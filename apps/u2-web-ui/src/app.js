import { createApi } from "./api.js";
import {
  canBook,
  confirmationCopy,
  handleBookConflict,
  navItems,
  ownerNavVisible,
  validateEmail,
  validatePrice,
  validateSlot,
} from "./shell.js";

export function createApp({ root, api = createApi(), storage = globalThis.sessionStorage } = {}) {
  const state = {
    page: "browse",
    role: null,
    email: "",
    fields: [],
    slots: [],
    date: new Date().toISOString().slice(0, 10),
    selectedFieldId: "",
    selectedSlotId: "",
    bookingId: "",
    confirmation: "",
    message: "",
    ownerPlayerEmail: "",
    fieldName: "",
    fieldPrice: "",
    bookings: [],
  };

  function persist() {
    storage?.setItem?.("u2-session", JSON.stringify({ token: api.getToken(), role: state.role, email: state.email }));
  }

  function restore() {
    try {
      const raw = storage?.getItem?.("u2-session");
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.token) api.setToken(saved.token);
      state.role = saved.role ?? null;
      state.email = saved.email ?? "";
    } catch {
      /* ignore */
    }
  }

  async function refreshSlots() {
    if (!state.selectedFieldId) {
      state.slots = [];
      return;
    }
    const { data } = await api.listSlots(state.selectedFieldId, state.date);
    state.slots = data;
  }

  async function loadFields() {
    const { data } = await api.listFields();
    state.fields = data;
    if (!state.selectedFieldId && data[0]) state.selectedFieldId = data[0].id;
    await refreshSlots();
  }

  async function book({ retryPost } = {}) {
    if (!validateSlot(state.selectedSlotId)) {
      state.message = "Choose a free slot";
      render();
      return;
    }
    if (state.role === "owner" && !validateEmail(state.ownerPlayerEmail)) {
      state.message = "Player email is required";
      render();
      return;
    }
    try {
      const { data } = await api.createBooking(
        state.selectedSlotId,
        state.role === "owner" ? state.ownerPlayerEmail : undefined,
      );
      state.bookingId = data.id;
      state.confirmation = confirmationCopy(data);
      state.page = "confirmation";
      state.message = "";
    } catch (err) {
      const conflict = handleBookConflict(err, { refreshSlots, retryPost });
      if (conflict.shown) {
        state.message = conflict.message;
        await refreshSlots();
      } else {
        state.message = err.message;
      }
    }
    render();
  }

  function renderNav() {
    return navItems(state.role)
      .map(
        (item) =>
          `<button type="button" data-testid="nav-${item.id}" data-page="${item.id}">${item.label}</button>`,
      )
      .join("");
  }

  function renderBrowse() {
    const fields = state.fields
      .map(
        (f) =>
          `<option value="${f.id}" ${f.id === state.selectedFieldId ? "selected" : ""}>${f.name} (${f.price})</option>`,
      )
      .join("");
    const slots = state.slots
      .map(
        (s) =>
          `<button type="button" data-testid="slot-${s.id}" data-slot="${s.id}" ${s.status === "held" ? "disabled" : ""}>${s.startAt} ${s.status}</button>`,
      )
      .join("");
    return `<section data-testid="page-browse">
      <h2>Browse</h2>
      <label>Date <input data-testid="date" type="date" value="${state.date}" /></label>
      <select data-testid="field-select">${fields}</select>
      <div data-testid="slots">${slots}</div>
    </section>`;
  }

  function renderLogin() {
    return `<section data-testid="page-login">
      <h2>Login</h2>
      <input data-testid="login-email" type="email" placeholder="email" />
      <input data-testid="login-password" type="password" placeholder="password" />
      <button type="button" data-testid="login-submit">Sign in</button>
    </section>`;
  }

  function renderRegister() {
    return `<section data-testid="page-register">
      <h2>Register as player</h2>
      <input data-testid="register-name" placeholder="full name" />
      <input data-testid="register-email" type="email" placeholder="email" />
      <input data-testid="register-password" type="password" placeholder="password" />
      <button type="button" data-testid="register-submit">Register</button>
    </section>`;
  }

  function renderBook() {
    if (!canBook(state.role)) return `<p data-testid="page-book">Log in to book.</p>`;
    const ownerField =
      state.role === "owner"
        ? `<input data-testid="on-behalf-email" type="email" placeholder="player email" value="${state.ownerPlayerEmail}" />`
        : "";
    return `<section data-testid="page-book">
      <h2>Book</h2>
      <p>Slot: ${state.selectedSlotId || "none"}</p>
      ${ownerField}
      <button type="button" data-testid="book-submit">Save booking</button>
    </section>`;
  }

  function renderConfirmation() {
    return `<section data-testid="page-confirmation">
      <h2>Confirmation</h2>
      <input data-testid="booking-id" value="${state.bookingId}" />
      <button type="button" data-testid="confirmation-load">Load</button>
      <p data-testid="confirmation-ref">${state.confirmation}</p>
    </section>`;
  }

  function renderOwnerFields() {
    if (!ownerNavVisible(state.role)) return "";
    return `<section data-testid="page-owner-fields">
      <h2>Fields</h2>
      <input data-testid="field-name" placeholder="name" />
      <input data-testid="field-price" type="number" placeholder="price" />
      <button type="button" data-testid="field-add">Add</button>
      <ul>${state.fields.map((f) => `<li>${f.name} <button type="button" data-testid="field-off-${f.id}" data-off="${f.id}">Deactivate</button></li>`).join("")}</ul>
    </section>`;
  }

  function renderOwnerBookings() {
    if (!ownerNavVisible(state.role)) return "";
    return `<section data-testid="page-owner-bookings">
      <h2>All bookings</h2>
      <ul>${state.bookings
        .map(
          (b) =>
            `<li>${b.id} ${b.status} ${b.paymentStatus} <button type="button" data-testid="paid-${b.id}" data-paid="${b.id}">Mark paid</button></li>`,
        )
        .join("")}</ul>
    </section>`;
  }

  function pageHtml() {
    switch (state.page) {
      case "login":
        return renderLogin();
      case "register":
        return renderRegister();
      case "book":
        return renderBook();
      case "confirmation":
        return renderConfirmation();
      case "owner-fields":
        return renderOwnerFields();
      case "owner-bookings":
        return renderOwnerBookings();
      default:
        return renderBrowse();
    }
  }

  function render() {
    if (!root) return;
    root.innerHTML = `
      <header class="shell" data-testid="app-shell">
        <strong>Venue booking</strong>
        <span data-testid="session-chip">${state.role ?? "anonymous"}</span>
        <nav data-testid="nav">${renderNav()}</nav>
        <button type="button" data-testid="logout">Leave session</button>
      </header>
      <p data-testid="message">${state.message}</p>
      <main class="desktop-first">${pageHtml()}</main>
    `;
  }

  async function onClick(ev) {
    const t = ev.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.dataset.page) {
      state.page = t.dataset.page;
      if (state.page === "owner-bookings") {
        const { data } = await api.listBookings();
        state.bookings = data;
      }
      render();
      return;
    }
    if (t.dataset.slot) {
      state.selectedSlotId = t.dataset.slot;
      render();
      return;
    }
    if (t.dataset.testid === "logout") {
      api.setToken("");
      state.role = null;
      persist();
      state.page = "browse";
      render();
      return;
    }
    if (t.dataset.testid === "login-submit") {
      const email = root.querySelector("[data-testid=login-email]").value;
      const password = root.querySelector("[data-testid=login-password]").value;
      if (!validateEmail(email)) {
        state.message = "Email required";
        render();
        return;
      }
      try {
        await api.login(email, password);
        state.email = email;
        state.role = email.includes("owner") ? "owner" : "player";
        persist();
        state.page = "browse";
        await loadFields();
      } catch (err) {
        state.message = err.message;
      }
      render();
      return;
    }
    if (t.dataset.testid === "register-submit") {
      const fullName = root.querySelector("[data-testid=register-name]").value;
      const email = root.querySelector("[data-testid=register-email]").value;
      const password = root.querySelector("[data-testid=register-password]").value;
      if (!validateEmail(email)) {
        state.message = "Email required";
        render();
        return;
      }
      try {
        await api.register({ email, password, fullName });
        state.message = "Registered. Log in.";
        state.page = "login";
      } catch (err) {
        state.message = err.message;
      }
      render();
      return;
    }
    if (t.dataset.testid === "book-submit") {
      const onBehalf = root.querySelector("[data-testid=on-behalf-email]");
      if (onBehalf) state.ownerPlayerEmail = onBehalf.value;
      await book();
      return;
    }
    if (t.dataset.testid === "confirmation-load") {
      state.bookingId = root.querySelector("[data-testid=booking-id]").value;
      try {
        const { data } = await api.getBooking(state.bookingId);
        state.confirmation = confirmationCopy(data);
      } catch (err) {
        state.message = err.message;
      }
      render();
      return;
    }
    if (t.dataset.testid === "field-add") {
      const name = root.querySelector("[data-testid=field-name]").value;
      const price = Number(root.querySelector("[data-testid=field-price]").value);
      if (!validatePrice(price)) {
        state.message = "Price must be greater than 0";
        render();
        return;
      }
      try {
        await api.addField(name, price);
        await loadFields();
      } catch (err) {
        state.message = err.message;
      }
      render();
      return;
    }
    if (t.dataset.off) {
      try {
        await api.deactivateField(t.dataset.off);
        await loadFields();
      } catch (err) {
        state.message = err.message;
      }
      render();
      return;
    }
    if (t.dataset.paid) {
      try {
        await api.markPaid(t.dataset.paid);
        const { data } = await api.listBookings();
        state.bookings = data;
      } catch (err) {
        state.message = err.message;
      }
      render();
    }
  }

  async function onChange(ev) {
    const t = ev.target;
    if (!(t instanceof HTMLElement)) return;
    if (t.dataset.testid === "date") {
      state.date = t.value;
      await refreshSlots();
      render();
    }
    if (t.dataset.testid === "field-select") {
      state.selectedFieldId = t.value;
      await refreshSlots();
      render();
    }
  }

  restore();
  if (root) {
    root.addEventListener("click", (ev) => {
      onClick(ev).catch((err) => {
        state.message = err.message;
        render();
      });
    });
    root.addEventListener("change", (ev) => {
      onChange(ev).catch((err) => {
        state.message = err.message;
        render();
      });
    });
  }

  return {
    state,
    render,
    loadFields,
    book,
    refreshSlots,
  };
}
