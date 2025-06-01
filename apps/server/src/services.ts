import { Hono } from "hono";
import { AppContext } from "../types/shared-context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma, Prisma } from "@repo/db";

const app = new Hono<AppContext>().get(
  "/:projectId/environments/:environmentId",
  zValidator(
    "param",
    z.object({ projectId: z.string(), environmentId: z.string() })
  ),
  async (c) => {
    const user = c.get("user");
    const { projectId, environmentId } = c.req.valid("param");

    console.log(user);

    if (!user) return c.json({ error: "Unauthorized" }, 401);

    try {
      const project = await prisma.project.findFirst({
        where: {
          id: projectId,
          userId: user.id,
        },
      });

      if (!project) {
        return c.json({ error: "Project not found" }, 404);
      }

      const environment = await prisma.environment.findFirst({
        where: {
          id: environmentId,
          projectId: projectId,
        },
      });

      if (!environment) {
        return c.json({ error: "Environment not found" }, 404);
      }

      const services = await prisma.service.findMany({
        where: {
          environmentId: environmentId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return c.json(services);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return c.json({ error: "Database error" }, 500);
      }
      throw error;
    }
  }
);

export default app;
