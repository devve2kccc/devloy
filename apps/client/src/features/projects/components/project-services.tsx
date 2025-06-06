"use client";
import { useGetProjectServices } from "../hooks/getProjectServices";
import { ServiceCard } from "./service-card";

export function ProjectServices() {
  const { data: services, isLoading } = useGetProjectServices();

  if (isLoading) return <div>Loading services...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
      {services?.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}
