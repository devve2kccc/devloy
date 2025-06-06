import { Hono } from "hono";
import { AppContext } from "@/app/api/[[...route]]/utils/shared-context";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma, Prisma } from "@repo/db";
import { availableServices, ServiceTemplateConfig } from "@repo/services";
import { client } from "./utils/rpc";

const app = new Hono<AppContext>()
  .get(
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
  )
  .post(
    "/:projectId/environments/:environmentId",
    zValidator(
      "param",
      z.object({
        projectId: z.string(),
        environmentId: z.string(),
      })
    ),
    zValidator(
      "json",
      z.object({
        templateId: z.string(), // e.g., "postgres", "redis"
        name: z.string().min(3).max(60), // User-defined name for this instance
        userConfig: z
          .object({
            // User's overrides
            port: z.number().optional(), // Host port
            environment: z.record(z.string()).optional(),
            volumes: z.array(z.string()).optional(),
            // Add any other user-configurable options
          })
          .optional(),
      })
    ),
    async (c) => {
      const user = c.get("user");
      const { projectId, environmentId } = c.req.valid("param");
      const { templateId, name, userConfig } = c.req.valid("json");

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

        const serviceTemplate = availableServices.find(
          (s) => s.id === templateId
        );

        if (!serviceTemplate) {
          return c.json({ error: "Service template not found" }, 400);
        }

        const finalConfig: ServiceTemplateConfig = {
          containerName: `${name}-${environment.id.substring(0, 8)}`, // Generate a unique name
          port:
            userConfig?.port || Number(serviceTemplate.defaultConfig.ports[0]), // Default to template internal port, or 80
          environment: {
            ...serviceTemplate.defaultConfig.environment,
            ...userConfig?.environment,
          },
          volumes: [
            ...(serviceTemplate.defaultConfig.volumes || []),
            ...(userConfig?.volumes || []),
          ],
          serviceInternalPort: parseInt(
            serviceTemplate.defaultConfig.ports[0],
            10
          ), // Use the internal port from template
        };

        const dockerComposeYml = serviceTemplate.dockerCompose(finalConfig);

        const newService = await prisma.service.create({
          data: {
            name: name,
            environmentId: environmentId,
            type: serviceTemplate.type as any, // Cast if your Prisma enum matches
            templateId: templateId,
            status: "PENDING", // Set initial status
            config: finalConfig as any, // Store the final config
          },
        });

        const deployResponse = await client.api.services.deploy.$post({
          json: {
            serviceId: newService.id,
            containerName: finalConfig.containerName,
            dockerImage: finalConfig.dockerImage,
            exposedHostPort: finalConfig.port, // Use the host port from finalConfig
            serviceInternalPort: finalConfig.serviceInternalPort,
            environment: finalConfig.environment,
            volumes: finalConfig.volumes,
          },
        });
        // call

        return c.json({});
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return c.json({ error: "Database error" }, 500);
        }
        throw error;
      }
    }
  );

export default app;
