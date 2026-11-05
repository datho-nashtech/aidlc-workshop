import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { Store } from "./store.ts";
import { AppError } from "./types.ts";
import * as svc from "./services.ts";

function readBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c as Buffer));
    req.on("end", () => {
      if (chunks.length === 0) return resolve({});
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch {
        reject(new AppError(400, "Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json");
  res.end(JSON.stringify(body));
}

function tokenOf(req: IncomingMessage): string | undefined {
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ")) return undefined;
  return h.slice("Bearer ".length);
}

function publicUser(u: { id: string; email: string; fullName: string; role: string }) {
  return { id: u.id, email: u.email, fullName: u.fullName, role: u.role };
}

const ALLOWED_ORIGINS = new Set(["http://127.0.0.1:4173", "http://localhost:4173"]);

function applyCors(req: IncomingMessage, res: ServerResponse) {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Max-Age", "600");
  }
}

export function createApp(store = new Store()) {
  const server = createServer(async (req, res) => {
    try {
      applyCors(req, res);
      const url = new URL(req.url ?? "/", "http://localhost");
      const method = req.method ?? "GET";
      if (method === "OPTIONS") {
        res.statusCode = 204;
        res.end();
        return;
      }
      const token = tokenOf(req);

      if (method === "POST" && url.pathname === "/register") {
        const body = (await readBody(req)) as { email?: string; password?: string; fullName?: string };
        const user = svc.registerPlayer(store, {
          email: body.email ?? "",
          password: body.password ?? "",
          fullName: body.fullName ?? "",
        });
        return send(res, 201, publicUser(user));
      }

      if (method === "POST" && url.pathname === "/session") {
        const body = (await readBody(req)) as { email?: string; password?: string };
        const tok = svc.login(store, body.email ?? "", body.password ?? "");
        return send(res, 200, { token: tok });
      }

      if (method === "GET" && url.pathname === "/fields") {
        return send(res, 200, svc.listFields(store, token));
      }

      if (method === "POST" && url.pathname === "/fields") {
        const body = (await readBody(req)) as { name?: string; price?: number };
        return send(res, 201, svc.addField(store, token, body.name ?? "", Number(body.price)));
      }

      const fieldOne = url.pathname.match(/^\/fields\/([^/]+)$/);
      if (fieldOne && method === "PUT") {
        const body = (await readBody(req)) as { name?: string; price?: number };
        return send(res, 200, svc.editField(store, token, fieldOne[1], body.name ?? "", Number(body.price)));
      }
      if (fieldOne && method === "DELETE") {
        return send(res, 200, svc.deactivateField(store, token, fieldOne[1]));
      }

      const slots = url.pathname.match(/^\/fields\/([^/]+)\/slots$/);
      if (slots && method === "GET") {
        return send(res, 200, svc.listSlots(store, slots[1], url.searchParams.get("date") ?? ""));
      }

      if (method === "GET" && url.pathname === "/bookings") {
        return send(res, 200, svc.listBookings(store, token));
      }
      if (method === "POST" && url.pathname === "/bookings") {
        const body = (await readBody(req)) as { slotId?: string; playerEmail?: string };
        const booking = await svc.createBooking(store, token, {
          slotId: body.slotId ?? "",
          playerEmail: body.playerEmail,
        });
        return send(res, 201, booking);
      }

      const paid = url.pathname.match(/^\/bookings\/([^/]+)\/paid$/);
      if (paid && method === "POST") {
        return send(res, 200, svc.markPaid(store, token, paid[1]));
      }

      const oneBooking = url.pathname.match(/^\/bookings\/([^/]+)$/);
      if (oneBooking && method === "GET") {
        return send(res, 200, svc.getBooking(store, token, oneBooking[1]));
      }

      send(res, 404, { error: "Not found" });
    } catch (err) {
      if (err instanceof AppError) return send(res, err.status, { error: err.message });
      send(res, 500, { error: "Internal error" });
    }
  });
  return { server, store };
}
