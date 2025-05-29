import { Hono } from "hono";
import { AppContext } from "../types/shared-context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma, ZodSchemas, Prisma } from "@repo/db";

const ProjectSchema = ZodSchemas.ProjectSchema;

const app = new Hono<AppContext>()
  .get("/", async (c) => {
    const user = c.get("user");

    console.log(user);

    if (!user) return c.json({ error: "Unauthorized" }, 401);

    const data = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
    });

    return c.json(data);
  })
  .get(
    "/:projectId/environments",
    zValidator("param", z.object({ projectId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { projectId } = c.req.valid("param");

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

        const environments = await prisma.environment.findMany({
          where: {
            projectId: projectId,
          },
          orderBy: {
            type: "asc",
          },
        });

        return c.json(environments);
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return c.json({ error: "Database error" }, 500);
        }
        throw error;
      }
    }
  )
  .post(
    "/",
    zValidator("json", ProjectSchema.pick({ name: true, description: true })),
    async (c) => {
      const user = c.get("user");
      const data = c.req.valid("json");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      const response = await prisma.project.create({
        data: {
          ...data,
          userId: user.id,
        },
      });

      return c.json(response);
    }
  )
  .put(
    "/:id",
    zValidator(
      "json",
      ProjectSchema.pick({ name: true, description: true }).partial()
    ),
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const user = c.get("user");
      const data = c.req.valid("json");
      const { id } = c.req.valid("param");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      try {
        const response = await prisma.project.update({
          data,
          where: {
            userId: user.id,
            id,
          },
        });
        return c.json(response);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return c.json({ error: "Project not found" }, 404);
        }
        throw error;
      }
    }
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const user = c.get("user");
      const { id } = c.req.valid("param");

      if (!user) return c.json({ error: "Unauthorized" }, 401);

      try {
        const response = await prisma.project.delete({
          where: {
            userId: user.id,
            id,
          },
        });

        return c.json(response);
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return c.json({ error: "Project not found" }, 404);
        }
        throw error;
      }
    }
  );

export default app;
