import { Hono } from "hono";
import { auth } from "./lib/auth";
import { cors } from "hono/cors";
import Projects from "./projects";
import { AppContext } from "../types/shared-context";
import { logger } from "hono/logger";

import Services from "./services";

export const app = new Hono<AppContext>().basePath("/api");

app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use(logger());

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.on(["POST", "GET"], "/auth/*", (c) => auth.handler(c.req.raw));

const router = app.route("/projects", Projects).route("/services", Services);

app.get("/me", async (c) => {
  const user = c.get("user");
  return c.json(user);
});

app.get("/health", (c) => {
  return c.text("OK");
});

export type AppType = typeof router;

export default {
  port: 4000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
