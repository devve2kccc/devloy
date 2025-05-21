import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ProjectsHeader from "@/features/projects/components/project-header";
import ProjectsGrid from "@/features/projects/components/projects-grid";
import { useNewProject } from "@/features/projects/hooks/use-new-project";
import { getProjects } from "@/features/projects/services/getProjects";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

export default async function Projects() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  return (
    <div>
      <ProjectsHeader />

      <Separator className="w-full mb-6" />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <ProjectsGrid />
      </HydrationBoundary>
    </div>
  );
}
