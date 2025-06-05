"use server";

import { auth } from "@/lib/auth";
import { client } from "@/lib/hc";
import { headers } from "next/headers";

export const getProjectServices = async (
  projectId: string,
  environmentId: string
) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await client.api.services[":projectId"].environments[
    ":environmentId"
  ].$get(
    {
      param: {
        projectId,
        environmentId,
      },
    },
    {
      headers: { cookie: (await headers()).get("cookie") ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project services!");
  }

  const data = await response.json();

  return data.map((service) => ({
    ...service,
    createdAt: new Date(service.createdAt),
    updatedAt: new Date(service.updatedAt),
  }));
};
