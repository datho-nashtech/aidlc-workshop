import { describe, expect, it } from "vitest";
import { Store, hashPassword } from "./store.ts";
import { AppError } from "./types.ts";
import * as svc from "./services.ts";

function playerStore() {
  const store = new Store();
  const token = svc.login(store, "owner@venue.local", "changeme");
  store.users.set("player-1", {
    id: "player-1",
    email: "player@x.com",
    passwordSecret: hashPassword("pw"),
    fullName: "Player",
    role: "player",
  });
  store.sessions.set("player-tok", "player-1");
  return { store, ownerTok: token };
}

describe("services", () => {
  it("registers a player and refuses duplicate email", () => {
    const store = new Store();
    svc.registerPlayer(store, { email: "a@b.c", password: "pw", fullName: "A" });
    expect(() =>
      svc.registerPlayer(store, { email: "a@b.c", password: "pw", fullName: "A" }),
    ).toThrow(AppError);
  });

  it("login fails on bad password", () => {
    const store = new Store();
    expect(() => svc.login(store, "owner@venue.local", "wrong")).toThrow(AppError);
  });

  it("adds a field and lists it without login", () => {
    const { store, ownerTok } = playerStore();
    svc.addField(store, ownerTok, "Pitch A", 100);
    expect(svc.listFields(store, undefined)).toHaveLength(1);
  });

  it("refuses deactivate while a booking exists", async () => {
    const { store, ownerTok } = playerStore();
    const field = svc.addField(store, ownerTok, "Pitch A", 100);
    const slots = svc.listSlots(store, field.id, "2026-11-06");
    await svc.createBooking(store, "player-tok", { slotId: slots[10].id });
    expect(() => svc.deactivateField(store, ownerTok, field.id)).toThrow(AppError);
  });

  it("player hold then collision 409", async () => {
    const { store, ownerTok } = playerStore();
    const field = svc.addField(store, ownerTok, "Pitch A", 100);
    const slots = svc.listSlots(store, field.id, "2026-11-06");
    await svc.createBooking(store, "player-tok", { slotId: slots[10].id });
    await expect(svc.createBooking(store, "player-tok", { slotId: slots[10].id })).rejects.toMatchObject({
      status: 409,
    });
  });

  it("owner-on-behalf requires an existing player email", async () => {
    const { store, ownerTok } = playerStore();
    const field = svc.addField(store, ownerTok, "Pitch A", 100);
    const slots = svc.listSlots(store, field.id, "2026-11-06");
    await expect(
      svc.createBooking(store, ownerTok, { slotId: slots[10].id, playerEmail: "missing@x.com" }),
    ).rejects.toMatchObject({ status: 404 });
    const b = await svc.createBooking(store, ownerTok, {
      slotId: slots[10].id,
      playerEmail: "player@x.com",
    });
    expect(b.userId).toBe("player-1");
  });

  it("mark paid confirms and sets confirmationRef", async () => {
    const { store, ownerTok } = playerStore();
    const field = svc.addField(store, ownerTok, "Pitch A", 100);
    const slots = svc.listSlots(store, field.id, "2026-11-06");
    const b = await svc.createBooking(store, "player-tok", { slotId: slots[10].id });
    const confirmed = svc.markPaid(store, ownerTok, b.id);
    expect(confirmed.status).toBe("confirmed");
    expect(confirmed.confirmationRef).toBeTruthy();
  });

  it("inactive field refuses new holds", async () => {
    const { store, ownerTok } = playerStore();
    const field = svc.addField(store, ownerTok, "Pitch A", 100);
    svc.deactivateField(store, ownerTok, field.id);
    const slots = svc.listSlots(store, field.id, "2026-11-06");
    await expect(svc.createBooking(store, "player-tok", { slotId: slots[10].id })).rejects.toMatchObject({
      status: 409,
    });
  });
});
