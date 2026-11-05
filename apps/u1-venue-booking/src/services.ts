import { Store, hashPassword, newId, requireOwner, requireUser, verifyPassword } from "./store.ts";
import { AppError, type Booking, type Field, type Slot, type User } from "./types.ts";

export function registerPlayer(
  store: Store,
  input: { email: string; password: string; fullName: string },
): User {
  if (!input.email || !input.password || !input.fullName) {
    throw new AppError(400, "email, password and fullName are required");
  }
  if (store.userByEmail(input.email)) throw new AppError(409, "Email already exists");
  const user: User = {
    id: newId("user"),
    email: input.email,
    passwordSecret: hashPassword(input.password),
    fullName: input.fullName,
    role: "player",
  };
  store.users.set(user.id, user);
  return user;
}

export function login(store: Store, email: string, password: string): string {
  const user = store.userByEmail(email);
  if (!user || !verifyPassword(password, user.passwordSecret)) {
    throw new AppError(401, "Bad credentials");
  }
  const token = newId("sess");
  store.sessions.set(token, user.id);
  return token;
}

export function addField(store: Store, token: string | undefined, name: string, price: number): Field {
  requireOwner(store, token);
  if (!name || !(price > 0)) throw new AppError(400, "name and price > 0 required");
  if ([...store.fields.values()].some((f) => f.name === name)) {
    throw new AppError(409, "Duplicate field name");
  }
  const field: Field = { id: newId("field"), name, price, status: "active" };
  store.fields.set(field.id, field);
  return field;
}

export function editField(
  store: Store,
  token: string | undefined,
  fieldId: string,
  name: string,
  price: number,
): Field {
  requireOwner(store, token);
  const field = store.fields.get(fieldId);
  if (!field) throw new AppError(404, "Unknown field");
  if (!name || !(price > 0)) throw new AppError(400, "name and price > 0 required");
  if ([...store.fields.values()].some((f) => f.id !== fieldId && f.name === name)) {
    throw new AppError(409, "Duplicate field name");
  }
  field.name = name;
  field.price = price;
  return field;
}

export function listFields(store: Store, token: string | undefined): Field[] {
  const all = [...store.fields.values()];
  try {
    const user = token ? requireUser(store, token) : undefined;
    if (user?.role === "owner") return all;
  } catch {
    /* anonymous browse */
  }
  return all.filter((f) => f.status === "active");
}

export function deactivateField(store: Store, token: string | undefined, fieldId: string): Field {
  requireOwner(store, token);
  const field = store.fields.get(fieldId);
  if (!field) throw new AppError(404, "Unknown field");
  const occupied = [...store.bookings.values()].some(
    (b) => b.fieldId === fieldId && (b.status === "pending" || b.status === "confirmed"),
  );
  if (occupied) throw new AppError(409, "Field has bookings");
  field.status = "inactive";
  return field;
}

function onTheHour(iso: string): boolean {
  const d = new Date(iso);
  return !Number.isNaN(d.getTime()) && d.getUTCMinutes() === 0 && d.getUTCSeconds() === 0;
}

function dayHours(date: string): string[] {
  const starts: string[] = [];
  for (let h = 0; h < 24; h++) {
    const hh = String(h).padStart(2, "0");
    starts.push(`${date}T${hh}:00:00.000Z`);
  }
  return starts;
}

export function listSlots(store: Store, fieldId: string, date: string): Slot[] {
  const field = store.fields.get(fieldId);
  if (!field) throw new AppError(404, "Unknown field");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new AppError(400, "date=YYYY-MM-DD required");
  const out: Slot[] = [];
  for (const startAt of dayHours(date)) {
    let slot = [...store.slots.values()].find((s) => s.fieldId === fieldId && s.startAt === startAt);
    if (!slot) {
      slot = { id: newId("slot"), fieldId, startAt, status: "free" };
      store.slots.set(slot.id, slot);
    }
    const held = [...store.bookings.values()].some(
      (b) => b.slotId === slot!.id && (b.status === "pending" || b.status === "confirmed"),
    );
    slot.status = held ? "held" : "free";
    out.push(slot);
  }
  return out;
}

export async function createBooking(
  store: Store,
  token: string | undefined,
  input: { slotId: string; playerEmail?: string },
): Promise<Booking> {
  return store.withLock(() => {
    const actor = requireUser(store, token);
    const slot = store.slots.get(input.slotId);
    if (!slot) throw new AppError(404, "Unknown slot");
    if (!onTheHour(slot.startAt)) throw new AppError(400, "Slot must start on the hour");
    const field = store.fields.get(slot.fieldId);
    if (!field) throw new AppError(404, "Unknown field");
    if (field.status === "inactive") throw new AppError(409, "Field inactive");

    let player: User;
    if (actor.role === "owner") {
      if (!input.playerEmail) throw new AppError(400, "playerEmail required");
      const found = store.userByEmail(input.playerEmail);
      if (!found || found.role !== "player") throw new AppError(404, "Unknown player");
      player = found;
    } else if (actor.role === "player") {
      player = actor;
    } else {
      throw new AppError(403, "Not allowed");
    }

    const held = [...store.bookings.values()].some(
      (b) => b.slotId === slot.id && (b.status === "pending" || b.status === "confirmed"),
    );
    if (held) throw new AppError(409, "Slot already held");

    const booking: Booking = {
      id: newId("booking"),
      userId: player.id,
      fieldId: field.id,
      slotId: slot.id,
      status: "pending",
      paymentStatus: "unpaid",
      confirmationRef: null,
      createdByUserId: actor.id,
    };
    store.bookings.set(booking.id, booking);
    slot.status = "held";
    return booking;
  });
}

export function markPaid(store: Store, token: string | undefined, bookingId: string): Booking {
  requireOwner(store, token);
  const booking = store.bookings.get(bookingId);
  if (!booking) throw new AppError(404, "Unknown booking");
  if (booking.status === "confirmed") throw new AppError(409, "Already confirmed");
  booking.paymentStatus = "paid";
  booking.status = "confirmed";
  booking.confirmationRef = newId("conf");
  return booking;
}

export function listBookings(store: Store, token: string | undefined): Booking[] {
  requireOwner(store, token);
  return [...store.bookings.values()];
}

export function getBooking(store: Store, token: string | undefined, bookingId: string): Booking {
  const user = requireUser(store, token);
  const booking = store.bookings.get(bookingId);
  if (!booking) throw new AppError(404, "Unknown booking");
  if (user.role !== "owner" && booking.userId !== user.id) throw new AppError(404, "Unknown booking");
  return booking;
}

export { requireOwner, requireUser };
