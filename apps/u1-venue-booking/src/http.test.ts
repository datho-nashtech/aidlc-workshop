import { afterEach, describe, expect, it } from "vitest";
import type { Server } from "node:http";
import { createApp } from "./http.ts";
import { hashPassword } from "./store.ts";

let server: Server | undefined;
let base = "";

async function listen() {
  const app = createApp();
  app.store.users.set("player-1", {
    id: "player-1",
    email: "player@x.com",
    passwordSecret: hashPassword("pw"),
    fullName: "Player",
    role: "player",
  });
  server = app.server.listen(0);
  await new Promise<void>((r) => server!.once("listening", () => r()));
  const addr = server.address();
  if (!addr || typeof addr === "string") throw new Error("no port");
  base = `http://127.0.0.1:${addr.port}`;
  return app;
}

afterEach(async () => {
  if (server) await new Promise<void>((r) => server!.close(() => r()));
  server = undefined;
});

async function json(path: string, init?: RequestInit) {
  const res = await fetch(base + path, {
    ...init,
    headers: { "content-type": "application/json", ...(init?.headers ?? {}) },
  });
  const body = await res.json();
  return { status: res.status, body };
}

describe("http", () => {
  it("registers and logs in", async () => {
    await listen();
    const reg = await json("/register", {
      method: "POST",
      body: JSON.stringify({ email: "n@x.com", password: "pw", fullName: "N" }),
    });
    expect(reg.status).toBe(201);
    const login = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "n@x.com", password: "pw" }),
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeTruthy();
  });

  it("owner creates a field", async () => {
    await listen();
    const login = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "owner@venue.local", password: "changeme" }),
    });
    const created = await json("/fields", {
      method: "POST",
      headers: { authorization: `Bearer ${login.body.token}` },
      body: JSON.stringify({ name: "A", price: 50 }),
    });
    expect(created.status).toBe(201);
    const listed = await json("/fields");
    expect(listed.status).toBe(200);
    expect(listed.body).toHaveLength(1);
  });

  it("player books a minted slot", async () => {
    await listen();
    const owner = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "owner@venue.local", password: "changeme" }),
    });
    const field = await json("/fields", {
      method: "POST",
      headers: { authorization: `Bearer ${owner.body.token}` },
      body: JSON.stringify({ name: "A", price: 50 }),
    });
    const slots = await json(`/fields/${field.body.id}/slots?date=2026-11-06`);
    expect(slots.body[10].id).toBeTruthy();
    const player = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "player@x.com", password: "pw" }),
    });
    const book = await json("/bookings", {
      method: "POST",
      headers: { authorization: `Bearer ${player.body.token}` },
      body: JSON.stringify({ slotId: slots.body[10].id }),
    });
    expect(book.status).toBe(201);
    const again = await json("/bookings", {
      method: "POST",
      headers: { authorization: `Bearer ${player.body.token}` },
      body: JSON.stringify({ slotId: slots.body[10].id }),
    });
    expect(again.status).toBe(409);
  });

  it("GET booking is 404 for another player", async () => {
    await listen();
    const owner = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "owner@venue.local", password: "changeme" }),
    });
    const field = await json("/fields", {
      method: "POST",
      headers: { authorization: `Bearer ${owner.body.token}` },
      body: JSON.stringify({ name: "A", price: 50 }),
    });
    const slots = await json(`/fields/${field.body.id}/slots?date=2026-11-06`);
    const player = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "player@x.com", password: "pw" }),
    });
    const book = await json("/bookings", {
      method: "POST",
      headers: { authorization: `Bearer ${player.body.token}` },
      body: JSON.stringify({ slotId: slots.body[10].id }),
    });
    const other = await json("/register", {
      method: "POST",
      body: JSON.stringify({ email: "o@x.com", password: "pw", fullName: "O" }),
    });
    expect(other.status).toBe(201);
    const otherTok = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "o@x.com", password: "pw" }),
    });
    const peek = await json(`/bookings/${book.body.id}`, {
      headers: { authorization: `Bearer ${otherTok.body.token}` },
    });
    expect(peek.status).toBe(404);
  });

  it("owner lists bookings and marks paid", async () => {
    await listen();
    const owner = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "owner@venue.local", password: "changeme" }),
    });
    const field = await json("/fields", {
      method: "POST",
      headers: { authorization: `Bearer ${owner.body.token}` },
      body: JSON.stringify({ name: "A", price: 50 }),
    });
    const slots = await json(`/fields/${field.body.id}/slots?date=2026-11-06`);
    const player = await json("/session", {
      method: "POST",
      body: JSON.stringify({ email: "player@x.com", password: "pw" }),
    });
    const book = await json("/bookings", {
      method: "POST",
      headers: { authorization: `Bearer ${player.body.token}` },
      body: JSON.stringify({ slotId: slots.body[10].id }),
    });
    const paid = await json(`/bookings/${book.body.id}/paid`, {
      method: "POST",
      headers: { authorization: `Bearer ${owner.body.token}` },
    });
    expect(paid.status).toBe(200);
    expect(paid.body.status).toBe("confirmed");
    const list = await json("/bookings", {
      headers: { authorization: `Bearer ${owner.body.token}` },
    });
    expect(list.body).toHaveLength(1);
  });

  it("answers CORS preflight from the local UI origin", async () => {
    await listen();
    const res = await fetch(`${base}/session`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://127.0.0.1:4173",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type, authorization",
      },
    });
    expect(res.status).toBe(204);
    expect(res.headers.get("access-control-allow-origin")).toBe("http://127.0.0.1:4173");
    expect(res.headers.get("access-control-allow-methods")).toMatch(/POST/);
    expect(res.headers.get("access-control-allow-headers")).toMatch(/Authorization/i);
  });

  it("echoes Access-Control-Allow-Origin on GET /fields for the local UI", async () => {
    await listen();
    const res = await fetch(`${base}/fields`, {
      headers: { Origin: "http://localhost:4173" },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBe("http://localhost:4173");
  });

  it("does not set Access-Control-Allow-Origin for a foreign origin", async () => {
    await listen();
    const res = await fetch(`${base}/fields`, {
      headers: { Origin: "http://evil.example" },
    });
    expect(res.status).toBe(200);
    expect(res.headers.get("access-control-allow-origin")).toBeNull();
  });
});
