"use client";
import { Loader2 } from "lucide-react";
import { useGetProjects } from "../services/getProjects";
import ProjectCard from "./project-card";

export default function ProjectsGrid() {
  const { data: projects, isLoading } = useGetProjects();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
      {projects?.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
}
