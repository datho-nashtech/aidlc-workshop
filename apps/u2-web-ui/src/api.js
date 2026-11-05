export const WRITE_TIMEOUT_MS = 10_000;
export const SLOT_TAKEN_MESSAGE = "that hour is taken";

export function createApi({
  fetchImpl = globalThis.fetch,
  baseUrl = "http://127.0.0.1:3001",
  timeoutMs = WRITE_TIMEOUT_MS,
  now = () => Date.now(),
} = {}) {
  let token = "";

  function setToken(value) {
    token = value ?? "";
  }

  function getToken() {
    return token;
  }

  async function request(method, path, body, { timeout = timeoutMs } = {}) {
    const controller = new AbortController();
    const started = now();
    const timer = setTimeout(() => controller.abort(), timeout);
    const headers = { "content-type": "application/json" };
    if (token) headers.authorization = `Bearer ${token}`;
    try {
      const res = await fetchImpl(`${baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const elapsed = now() - started;
      if (elapsed >= timeout) {
        const err = new Error("Request timed out");
        err.code = "TIMEOUT";
        throw err;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 409) {
        const err = new Error(data.error === "Field has bookings" ? "clear those bookings first" : SLOT_TAKEN_MESSAGE);
        err.status = 409;
        err.body = data;
        throw err;
      }
      if (!res.ok) {
        const err = new Error(data.error ?? `HTTP ${res.status}`);
        err.status = res.status;
        err.body = data;
        throw err;
      }
      return { status: res.status, data };
    } catch (err) {
      if (err?.name === "AbortError") {
        const timeoutErr = new Error("Request timed out");
        timeoutErr.code = "TIMEOUT";
        throw timeoutErr;
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  return {
    setToken,
    getToken,
    request,
    register: (payload) => request("POST", "/register", payload),
    login: async (email, password) => {
      const result = await request("POST", "/session", { email, password });
      setToken(result.data.token);
      return result;
    },
    listFields: () => request("GET", "/fields"),
    addField: (name, price) => request("POST", "/fields", { name, price }),
    editField: (id, name, price) => request("PUT", `/fields/${id}`, { name, price }),
    deactivateField: (id) => request("DELETE", `/fields/${id}`),
    listSlots: (fieldId, date) => request("GET", `/fields/${fieldId}/slots?date=${encodeURIComponent(date)}`),
    listBookings: () => request("GET", "/bookings"),
    createBooking: (slotId, playerEmail) =>
      request("POST", "/bookings", playerEmail ? { slotId, playerEmail } : { slotId }),
    markPaid: (id) => request("POST", `/bookings/${id}/paid`),
    getBooking: (id) => request("GET", `/bookings/${id}`),
  };
}
