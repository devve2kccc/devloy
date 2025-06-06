import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectsEnvironments } from "@/features/projects/actions/projects";
import EnvironmentSelect from "@/features/projects/components/project-env-selector";
import { ProjectServices } from "@/features/projects/components/project-services";
import ServicesHeader from "@/features/projects/components/service-header";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const projectId = (await params).projectId;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["project-environments", projectId],
    queryFn: () => getProjectsEnvironments(projectId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div>
        <ServicesHeader projectId={projectId} />
        <Separator className="mb-6" />

        <ProjectServices />
      </div>
    </HydrationBoundary>
  );
}
