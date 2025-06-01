"use client";
import CardWrapper from "@/components/card-wrapper";
import { useGetProjectServices } from "../hooks/getProjectServices";

export function ProjectServices() {
  const { data: services, isLoading } = useGetProjectServices();

  if (isLoading) return <div>Loading services...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-5">
      {services?.map((service, index) => (
        <CardWrapper
          key={index}
          header={service.name}
          description={service.status}
        >
          {service.name}
        </CardWrapper>
      ))}
    </div>
  );
}
