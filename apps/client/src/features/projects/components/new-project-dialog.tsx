import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useNewProject } from "../states/use-new-project";
import { NewProjectForm } from "./new-project-form";
import { ProjectSchema } from "@repo/db/generated/zod";
import { z } from "zod";
import { useNewProjectMutation } from "../hooks/newProject";

const ProjectType = ProjectSchema.pick({
  name: true,
  description: true,
});

export default function NewProjectDialog() {
  const { isOpen, onClose } = useNewProject();
  const projectMutation = useNewProjectMutation();

  const handleSubmit = (values: z.infer<typeof ProjectType>) => {
    projectMutation.mutate(values, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Add a new project to create your services
          </DialogDescription>
        </DialogHeader>

        <NewProjectForm
          onSubmit={handleSubmit}
          disabled={projectMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
