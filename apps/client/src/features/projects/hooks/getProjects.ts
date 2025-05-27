import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "../../../lib/hc";
import { getProjects } from "../actions/projects";

export type ProjectType = InferResponseType<typeof client.api.projects.$get>;

export const useGetProjects = () => {
  const query = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  return query;
};
