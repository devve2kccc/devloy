import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { client } from "../../../lib/hc";
import { getProjects } from "../actions/projects";
import { getProjectServices } from "../actions/services";
import { useEnvironmentStore } from "../states/environment";

export type ProjectType = InferResponseType<typeof client.api.projects.$get>;

export const useGetProjectServices = () => {
  const { projectId, selectedEnvironment } = useEnvironmentStore();

  const query = useQuery({
    queryKey: ["project-services", projectId, selectedEnvironment],
    queryFn: () => getProjectServices(projectId!, selectedEnvironment),
    enabled: !!projectId && !!selectedEnvironment,
  });

  return query;
};
