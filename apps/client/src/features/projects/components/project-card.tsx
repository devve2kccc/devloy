import CardWrapper from "../../../components/card-wrapper";
import { z } from "zod";
import { ProjectSchema } from "@repo/db/generated/zod";
import Link from "next/link";

type ProjectType = z.infer<typeof ProjectSchema>;

export default function ProjectCard({ project }: { project: ProjectType }) {
  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <CardWrapper
        header={project.name}
        description={project?.description ?? ""}
      >
        <div>
          Created at{" "}
          {project.createdAt instanceof Date
            ? project.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            : String(project.createdAt)}
        </div>
      </CardWrapper>
    </Link>
  );
}
