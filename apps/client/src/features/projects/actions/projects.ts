"use server";
import { headers } from "next/headers";
import { client } from "../../../lib/hc";
import { InferRequestType, InferResponseType } from "hono";

type ProjectType = InferResponseType<typeof client.api.projects.$get>;
type NewProjectType = InferRequestType<
  typeof client.api.projects.$post
>["json"];

type NewProjectTypeResponse = InferResponseType<
  typeof client.api.projects.$post
>;

export const getProjects = async () => {
  const cookie = (await headers()).get("cookie");

  const response = await client.api.projects.$get(
    {},
    {
      headers: { cookie: cookie ?? "" },
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
  const cookie = (await headers()).get("cookie");

  const response = await client.api.projects.$post(
    { json: project },
    {
      headers: { cookie: cookie ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create project!");
  }

  return (await response.json()) as NewProjectTypeResponse;
};

export const getProjectsEnvironments = async (projectId: string) => {
  const cookie = (await headers()).get("cookie");

  const response = await client.api.projects[":projectId"].environments.$get(
    {
      param: {
        projectId: projectId,
      },
    },
    {
      headers: { cookie: cookie ?? "" },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch project environments!");
  }

  return await response.json();
};
