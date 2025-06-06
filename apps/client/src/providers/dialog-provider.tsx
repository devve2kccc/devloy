"use client";

import NewProjectDialog from "@/features/projects/components/new-project-dialog";
import NewServiceDialog from "@/features/projects/components/new-service-dialog";
import { useMountedState } from "react-use";

export const DialogProvider = () => {
  const isMounted = useMountedState();

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <NewProjectDialog />
      <NewServiceDialog />
    </>
  );
};
