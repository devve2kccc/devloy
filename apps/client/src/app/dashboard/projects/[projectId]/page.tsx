import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProjectsEnvironments } from "@/features/projects/actions/projects";
import EnvironmentSelect from "@/features/projects/components/project-env-selector";
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
        <div className="flex justify-between items-center p-5">
          <EnvironmentSelect projectId={projectId} />
          <Button>Add Service</Button>
        </div>
        <Separator />

        {/* // services */}
      </div>
    </HydrationBoundary>
  );
}
