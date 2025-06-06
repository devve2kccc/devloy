"use client";

import { Button } from "../../../components/ui/button";
import { useNewProject } from "../states/use-new-project";

export default function ProjectsHeader() {
  const { onOpen } = useNewProject();

  return (
    <div className="flex items-center justify-end p-5">
      <h1 className="text-3xl font-bold text-primary">Projects</h1>
      <Button className="ml-auto" onClick={onOpen}>
        Add Project
      </Button>
    </div>
  );
}
