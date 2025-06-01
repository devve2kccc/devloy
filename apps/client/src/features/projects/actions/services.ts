"use server";

import { client } from "@/lib/hc";
import { headers } from "next/headers";

export const getProjectServices = async (
  projectId: string,
  environmentId: string
) => {
  const cookie = (await headers()).get("cookie");

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
      headers: { cookie: cookie ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project services!");
  }

  return await response.json();
};
