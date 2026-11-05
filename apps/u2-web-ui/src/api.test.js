import { describe, expect, it, vi } from "vitest";
import { SLOT_TAKEN_MESSAGE, WRITE_TIMEOUT_MS, createApi } from "./api.js";

function jsonRes(status, body) {
  return {
    status,
    ok: status >= 200 && status < 300,
    json: async () => body,
  };
}

describe("api client", () => {
  it("sends Authorization Bearer after login", async () => {
    const fetchImpl = vi.fn(async (url, init) => {
      if (String(url).endsWith("/session")) return jsonRes(200, { token: "tok-1" });
      return jsonRes(200, []);
    });
    const api = createApi({ fetchImpl, baseUrl: "http://u1" });
    await api.login("p@x.com", "secret");
    await api.listFields();
    const second = fetchImpl.mock.calls[1][1];
    expect(second.headers.authorization).toBe("Bearer tok-1");
  });

  it("omits Authorization when anonymous", async () => {
    const fetchImpl = vi.fn(async () => jsonRes(200, []));
    const api = createApi({ fetchImpl });
    await api.listFields();
    expect(fetchImpl.mock.calls[0][1].headers.authorization).toBeUndefined();
  });

  it("maps 409 on POST /bookings to taken message", async () => {
    const fetchImpl = vi.fn(async () => jsonRes(409, { error: "Slot taken" }));
    const api = createApi({ fetchImpl });
    await expect(api.createBooking("slot-held")).rejects.toMatchObject({
      status: 409,
      message: SLOT_TAKEN_MESSAGE,
    });
  });

  it("maps 409 deactivate to clear those bookings first", async () => {
    const fetchImpl = vi.fn(async () => jsonRes(409, { error: "Field has bookings" }));
    const api = createApi({ fetchImpl });
    await expect(api.deactivateField("f1")).rejects.toMatchObject({
      status: 409,
      message: "clear those bookings first",
    });
  });

  it("aborts writes after 10s", async () => {
    const fetchImpl = vi.fn(
      (_url, init) =>
        new Promise((_, reject) => {
          const fail = () => {
            const e = new Error("aborted");
            e.name = "AbortError";
            reject(e);
          };
          if (init.signal?.aborted) fail();
          else init.signal.addEventListener("abort", fail, { once: true });
        }),
    );
    const api = createApi({ fetchImpl, timeoutMs: 20 });
    await expect(api.createBooking("s1")).rejects.toMatchObject({ code: "TIMEOUT" });
  });

  it("uses 10000ms default timeout", () => {
    expect(WRITE_TIMEOUT_MS).toBe(10_000);
  });

  it("POSTs /register without inventing a retry", async () => {
    const fetchImpl = vi.fn(async () => jsonRes(201, { id: "u1", role: "player" }));
    const api = createApi({ fetchImpl });
    const result = await api.register({ email: "a@b.c", password: "x", fullName: "A" });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
    expect(String(fetchImpl.mock.calls[0][0])).toMatch(/\/register$/);
    expect(result.status).toBe(201);
  });

  it("GET booking returns confirmationRef payload", async () => {
    const fetchImpl = vi.fn(async () => jsonRes(200, { id: "b1", confirmationRef: "CNF-9" }));
    const api = createApi({ fetchImpl });
    const { data } = await api.getBooking("b1");
    expect(data.confirmationRef).toBe("CNF-9");
  });
});
