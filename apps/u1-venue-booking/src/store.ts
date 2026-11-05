import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import type { Booking, Field, Slot, User } from "./types.ts";
import { AppError } from "./types.ts";

export function hashPassword(password: string, salt = randomBytes(16).toString("hex")): string {
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, secret: string): boolean {
  const [salt, hash] = secret.split(":");
  if (!salt || !hash) return false;
  const other = scryptSync(password, salt, 32);
  const a = Buffer.from(hash, "hex");
  if (a.length !== other.length) return false;
  return timingSafeEqual(a, other);
}

export class Store {
  users = new Map<string, User>();
  fields = new Map<string, Field>();
  slots = new Map<string, Slot>();
  bookings = new Map<string, Booking>();
  sessions = new Map<string, string>();
  private lock = Promise.resolve();

  constructor() {
    const email = process.env.OWNER_EMAIL ?? "owner@venue.local";
    const password = process.env.OWNER_PASSWORD ?? "changeme";
    const owner: User = {
      id: "user-owner-seed",
      email,
      passwordSecret: hashPassword(password),
      fullName: "Seed Owner",
      role: "owner",
    };
    this.users.set(owner.id, owner);
  }

  userByEmail(email: string): User | undefined {
    return [...this.users.values()].find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  async withLock<T>(fn: () => T | Promise<T>): Promise<T> {
    const run = this.lock.then(fn, fn);
    this.lock = run.then(
      () => undefined,
      () => undefined,
    );
    return run;
  }
}

export function newId(prefix: string): string {
  return `${prefix}-${randomUUID()}`;
}

export function requireUser(store: Store, token: string | undefined): User {
  if (!token) throw new AppError(401, "Login required");
  const userId = store.sessions.get(token);
  const user = userId ? store.users.get(userId) : undefined;
  if (!user) throw new AppError(401, "Login required");
  return user;
}

export function requireOwner(store: Store, token: string | undefined): User {
  const user = requireUser(store, token);
  if (user.role !== "owner") throw new AppError(403, "Not owner");
  return user;
}
