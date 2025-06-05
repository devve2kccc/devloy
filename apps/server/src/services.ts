import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma, Prisma } from "@repo/db";

const app = new Hono<{
  Variables: {
    auth: string | null;
  };
}>().post(
  "/create",
  zValidator(
    "param",
    z.object({ projectId: z.string(), environmentId: z.string() })
  ),
  async (c) => {
    const auth = c.get("auth");

    if (auth !== process.env.DOCKER_API_KEY) {
      return c.json({ error: "Unauthorized" });
    }
    //HANDLE DOCKER CONTAINER CREATION
  }
);

export default app;
