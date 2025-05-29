import { useQuery } from "@tanstack/react-query";
import { getProjectsEnvironments } from "../actions/projects";

export const useGetProjectEnvironments = (projectId: string | null) => {
  const query = useQuery({
    queryKey: ["project-environments", projectId],
    queryFn: () => getProjectsEnvironments(projectId!),
    enabled: !!projectId,
  });

  return query;
};
