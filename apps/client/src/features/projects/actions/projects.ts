"use server";
import { headers } from "next/headers";
import { client } from "@/lib/hc";
import { InferRequestType, InferResponseType } from "hono";
import { auth } from "@/lib/auth";

type NewProjectType = InferRequestType<
  typeof client.api.projects.$post
>["json"];

type NewProjectTypeResponse = InferResponseType<
  typeof client.api.projects.$post
>;

export const getProjects = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }
  const response = await client.api.projects.$get(
    {},
    {
      headers: { cookie: (await headers()).get("cookie") ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch projects!");
  }

  const data = await response.json();

  if (!data) return [];

  return data.map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));
};

export const newProject = async (project: NewProjectType) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await client.api.projects.$post(
    { json: project },
    {
      headers: { cookie: (await headers()).get("cookie") ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create project!");
  }

  return (await response.json()) as NewProjectTypeResponse;
};

export const getProjectsEnvironments = async (projectId: string) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const response = await client.api.projects[":projectId"].environments.$get(
    {
      param: {
        projectId: projectId,
      },
    },
    {
      headers: { cookie: (await headers()).get("cookie") ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project environments!");
  }

  return await response.json();
};
