import { client } from "@/lib/hc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProjectType = InferResponseType<typeof client.api.projects.$get>;

export const getProjects = async () => {
  const response = await client.api.projects.$get();

  if (!response.ok) {
    throw new Error("Failed to fetch projects!");
  }

  const data = (await response.json()) as ProjectType;

  if (!data) return [];

  return data.map((project) => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }));
};

export const useGetProjects = () => {
  const query = useQuery({ queryKey: ["projects"], queryFn: getProjects });

  return query;
};
