import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import Services from "./services";

export const app = new Hono<{
  Variables: {
    auth: string | null;
  };
}>().basePath("/api");

app.use(
  "*",
  cors({
    origin: "http://localhost:3000", // replace with your origin
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "PUT", "DELETE"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use(logger());

app.use("*", async (c, next) => {
  const auth = c.req.header("Authorization");

  if (!auth) {
    c.set("auth", null);
    return next();
  }

  c.set("auth", auth);
  return next();
});

const router = app.route("/services", Services);

export type AppType = typeof router;

export default {
  port: 4000,
  hostname: "0.0.0.0",
  fetch: app.fetch,
};
