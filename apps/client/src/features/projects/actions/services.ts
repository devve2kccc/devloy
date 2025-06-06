"use server";

import { auth } from "@/lib/auth";
import { client } from "@/lib/hc";
import { ServiceConfigTemplate } from "@repo/services";
// import { client as rpcClient } from "@/app/api/[[...route]]/utils/rpc";
import { headers } from "next/headers";

// export const getAvailableServices = async () => {
//   const session = await auth.api.getSession({ headers: await headers() });

//   if (!session) {
//     throw new Error("Unauthorized");
//   }

//   const response = await rpcClient.api.services.available.$get(
//     {},
//     {
//       headers: {
//         Authorization: process.env.DOCKER_API_KEY!,
//       },
//     }
//   );

//   if (!response.ok) {
//     throw new Error("Failed to fetch Available Services!");
//   }

//   return await response.json();
// };

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

export const createService = async (
  projectId: string,
  environmentId: string,
  service: ServiceConfigTemplate
) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }
};
