"use client";

import { Button } from "../../../components/ui/button";
import { useNewService } from "../states/use-new-service";
import EnvironmentSelect from "./project-env-selector";

export default function ServicesHeader({ projectId }: { projectId: string }) {
  const { onOpen } = useNewService();

  return (
    <div className="flex justify-between items-center p-5">
      <div className="flex items-center gap-2">
        <h1 className="text-3xl font-bold text-primary">Services</h1>
        <EnvironmentSelect projectId={projectId} />
      </div>
      <Button onClick={onOpen}>Add Service</Button>
    </div>
  );
}
