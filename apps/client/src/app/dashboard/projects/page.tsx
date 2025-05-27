import { Separator } from "@/components/ui/separator";
import { getProjects } from "@/features/projects/actions/projects";
import ProjectsHeader from "@/features/projects/components/project-header";
import ProjectsGrid from "@/features/projects/components/projects-grid";
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
