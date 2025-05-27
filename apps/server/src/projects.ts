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
    
    if (!user) return c.body(null, 401);

    const data = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
    });

    return c.json(data);
  })
  .post(
    "/",
    zValidator("json", ProjectSchema.pick({ name: true, description: true })),
    async (c) => {
      const user = c.get("user");
      const data = c.req.valid("json");

      if (!user) return c.body(null, 401);

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

      if (!user) return c.body(null, 401);

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

      if (!user) return c.body(null, 401);

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
