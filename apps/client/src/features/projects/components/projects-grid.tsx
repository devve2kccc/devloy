"use client";
import { useGetProjects } from "../hooks/getProjects";
import ProjectCard from "./project-card";

export default function ProjectsGrid() {
  const { data: projects } = useGetProjects();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
      {projects?.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
