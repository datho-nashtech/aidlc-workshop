import { SLOT_TAKEN_MESSAGE } from "./api.js";

export function ownerNavVisible(role) {
  return role === "owner";
}

export function decodeRoleFromToken(token) {
  if (!token) return null;
  if (token.includes("owner")) return "owner";
  return "player";
}

export function handleBookConflict(err, { refreshSlots, retryPost } = {}) {
  if (err?.status !== 409) return { shown: false, retried: false };
  refreshSlots?.();
  if (typeof retryPost === "function") {
    throw new Error("409 must not retry POST /bookings");
  }
  return { shown: true, message: SLOT_TAKEN_MESSAGE, retried: false };
}

export function confirmationCopy(booking) {
  if (!booking) return "";
  if (booking.confirmationRef) return String(booking.confirmationRef);
  return booking.status === "pending" ? "pending" : "";
}

export function canBook(role) {
  return role === "player" || role === "owner";
}

export function validateEmail(email) {
  return Boolean(email && String(email).includes("@"));
}

export function validatePrice(price) {
  return Number(price) > 0;
}

export function validateSlot(slotId) {
  return Boolean(slotId);
}

export function navItems(role) {
  const items = [
    { id: "browse", label: "Browse" },
    { id: "login", label: "Login" },
    { id: "register", label: "Register" },
  ];
  if (canBook(role)) items.push({ id: "book", label: "Book" }, { id: "confirmation", label: "Confirmation" });
  if (ownerNavVisible(role)) {
    items.push({ id: "owner-fields", label: "Fields" }, { id: "owner-bookings", label: "Bookings" });
  }
  return items;
}
