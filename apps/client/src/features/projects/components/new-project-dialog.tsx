import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNewProject } from "../hooks/use-new-project";
import { NewProjectForm } from "./new-project-form";
import { ProjectSchema } from "@db/prisma/generated/zod";
import { z } from "zod";
import { useNewProjectMutation } from "@/features/projects/services/newProject";

const ProjectType = ProjectSchema.pick({
  name: true,
  description: true,
});

export function NewProjectDialog() {
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
