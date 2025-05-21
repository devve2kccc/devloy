import CardWrapper from "../../../components/card-wrapper";

import { ProjectSchema } from "../../../../../../packages/db/prisma/generated/zod";
import { z } from "zod";

type ProjectType = z.infer<typeof ProjectSchema>;

export default function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <CardWrapper header={project.name} description={project?.description ?? ""}>
      <div>
        Created at{" "}
        {project.createdAt instanceof Date
          ? project.createdAt.toLocaleDateString()
          : String(project.createdAt)}
      </div>
    </CardWrapper>
  );
}
