import { describe, expect, it, vi, beforeEach } from "vitest";
import { createApp } from "./app.js";

function mockApi(overrides = {}) {
  return {
    getToken: () => "",
    setToken: vi.fn(),
    login: vi.fn(async () => ({ status: 200, data: { token: "t" } })),
    register: vi.fn(async () => ({ status: 201, data: { id: "u" } })),
    listFields: vi.fn(async () => ({ data: [{ id: "f1", name: "Pitch", price: 10 }] })),
    listSlots: vi.fn(async () => ({ data: [{ id: "s1", startAt: "10:00", status: "free" }] })),
    listBookings: vi.fn(async () => ({ data: [{ id: "b1", status: "pending", paymentStatus: "unpaid" }] })),
    createBooking: vi.fn(async () => ({
      status: 201,
      data: { id: "b9", status: "pending", confirmationRef: null },
    })),
    getBooking: vi.fn(async () => ({ data: { id: "b9", confirmationRef: "CNF-1", status: "confirmed" } })),
    addField: vi.fn(async () => ({ status: 201, data: {} })),
    deactivateField: vi.fn(async () => ({ status: 200, data: {} })),
    markPaid: vi.fn(async () => ({ status: 200, data: {} })),
    ...overrides,
  };
}

describe("app book flow", () => {
  it("does not POST again after 409", async () => {
    const createBooking = vi
      .fn()
      .mockRejectedValueOnce(Object.assign(new Error("that hour is taken"), { status: 409 }));
    const api = mockApi({ createBooking, listSlots: vi.fn(async () => ({ data: [] })) });
    const app = createApp({ api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "player";
    app.state.selectedSlotId = "held-1";
    app.state.selectedFieldId = "f1";
    await app.book();
    expect(createBooking).toHaveBeenCalledTimes(1);
    expect(api.listSlots).toHaveBeenCalled();
    expect(app.state.message).toBe("that hour is taken");
  });

  it("after 201 goes to confirmation with booking id", async () => {
    const api = mockApi();
    const app = createApp({ api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "player";
    app.state.selectedSlotId = "free-1";
    await app.book();
    expect(app.state.page).toBe("confirmation");
    expect(app.state.bookingId).toBe("b9");
    expect(app.state.confirmation).toBe("pending");
  });
});

describe("app shell screens", () => {
  let root;

  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    root = document.getElementById("app");
  });

  it("hides owner nav for a player after login", async () => {
    const api = mockApi({ getToken: () => "t" });
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.render();
    root.querySelector("[data-testid=nav-login]").click();
    await Promise.resolve();
    root.querySelector("[data-testid=login-email]").value = "player@x.com";
    root.querySelector("[data-testid=login-password]").value = "secret";
    root.querySelector("[data-testid=login-submit]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(root.querySelector("[data-testid=nav-owner-fields]")).toBeNull();
    expect(root.querySelector("[data-testid=session-chip]").textContent).toBe("player");
  });

  it("shows owner tools after owner login", async () => {
    const api = mockApi({ getToken: () => "t" });
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.render();
    root.querySelector("[data-testid=nav-login]").click();
    await Promise.resolve();
    root.querySelector("[data-testid=login-email]").value = "owner@venue.local";
    root.querySelector("[data-testid=login-password]").value = "changeme";
    root.querySelector("[data-testid=login-submit]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(root.querySelector("[data-testid=nav-owner-fields]")).not.toBeNull();
  });

  it("registers then shows login", async () => {
    const api = mockApi();
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.render();
    root.querySelector("[data-testid=nav-register]").click();
    await Promise.resolve();
    root.querySelector("[data-testid=register-name]").value = "Pat";
    root.querySelector("[data-testid=register-email]").value = "p@x.com";
    root.querySelector("[data-testid=register-password]").value = "pw";
    root.querySelector("[data-testid=register-submit]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(api.register).toHaveBeenCalled();
    expect(app.state.page).toBe("login");
  });

  it("loads confirmationRef from GET booking", async () => {
    const api = mockApi();
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "player";
    app.state.page = "confirmation";
    app.state.bookingId = "b9";
    app.render();
    root.querySelector("[data-testid=confirmation-load]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(root.querySelector("[data-testid=confirmation-ref]").textContent).toBe("CNF-1");
  });

  it("owner can add a field and mark paid", async () => {
    const api = mockApi({ getToken: () => "t" });
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "owner";
    app.state.page = "owner-fields";
    app.state.fields = [{ id: "f1", name: "Pitch", price: 10 }];
    app.render();
    root.querySelector("[data-testid=field-name]").value = "B";
    root.querySelector("[data-testid=field-price]").value = "20";
    root.querySelector("[data-testid=field-add]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(api.addField).toHaveBeenCalledWith("B", 20);
    root.querySelector("[data-testid=nav-owner-bookings]").click();
    await new Promise((r) => setTimeout(r, 0));
    root.querySelector("[data-testid=paid-b1]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(api.markPaid).toHaveBeenCalledWith("b1");
  });

  it("deactivate 409 shows clear those bookings first", async () => {
    const api = mockApi({
      deactivateField: vi.fn(async () => {
        throw Object.assign(new Error("clear those bookings first"), { status: 409 });
      }),
    });
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "owner";
    app.state.page = "owner-fields";
    app.state.fields = [{ id: "f1", name: "Pitch", price: 10 }];
    app.render();
    root.querySelector("[data-testid=field-off-f1]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(root.querySelector("[data-testid=message]").textContent).toBe("clear those bookings first");
  });

  it("picks a slot from browse", async () => {
    const api = mockApi();
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.slots = [{ id: "s1", startAt: "10:00", status: "free" }];
    app.render();
    root.querySelector("[data-testid=slot-s1]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(app.state.selectedSlotId).toBe("s1");
  });

  it("logout clears session", async () => {
    const api = mockApi({ getToken: () => "t", setToken: vi.fn() });
    const app = createApp({ root, api, storage: { getItem: () => null, setItem: () => {} } });
    app.state.role = "player";
    app.render();
    root.querySelector("[data-testid=logout]").click();
    await new Promise((r) => setTimeout(r, 0));
    expect(api.setToken).toHaveBeenCalledWith("");
    expect(app.state.role).toBeNull();
  });
});
