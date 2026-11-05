import { describe, expect, it } from "vitest";
import { Store, hashPassword, newId, requireOwner, requireUser, verifyPassword } from "./store.ts";
import { AppError } from "./types.ts";

describe("store", () => {
  it("seeds an owner", () => {
    const s = new Store();
    expect(s.userByEmail("owner@venue.local")?.role).toBe("owner");
  });

  it("hashes and verifies passwords", () => {
    const secret = hashPassword("secret");
    expect(verifyPassword("secret", secret)).toBe(true);
    expect(verifyPassword("nope", secret)).toBe(false);
  });

  it("mints unique ids", () => {
    expect(newId("x")).not.toBe(newId("x"));
  });

  it("looks up users by email case-insensitively", () => {
    const s = new Store();
    expect(s.userByEmail("OWNER@venue.local")?.id).toBe("user-owner-seed");
  });

  it("requireUser fails without a session", () => {
    const s = new Store();
    expect(() => requireUser(s, undefined)).toThrow(AppError);
  });

  it("requireOwner fails for a player session", () => {
    const s = new Store();
    s.users.set("p", {
      id: "p",
      email: "p@x.com",
      passwordSecret: hashPassword("x"),
      fullName: "P",
      role: "player",
    });
    s.sessions.set("t", "p");
    expect(() => requireOwner(s, "t")).toThrow(AppError);
  });

  it("serialises withLock so two holds cannot both succeed", async () => {
    const s = new Store();
    let n = 0;
    await Promise.all([
      s.withLock(async () => {
        const v = n;
        await Promise.resolve();
        n = v + 1;
      }),
      s.withLock(async () => {
        const v = n;
        await Promise.resolve();
        n = v + 1;
      }),
    ]);
    expect(n).toBe(2);
  });
});
