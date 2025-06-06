"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { availableServices, ServiceConfigTemplate } from "@repo/services";
import { Input } from "@/components/ui/input";

interface AvailableServicesProps {
  onServiceSelect: (service: ServiceConfigTemplate) => void;
  disabled?: boolean;
}

export default function AvailableServicesList({
  onServiceSelect,
  disabled,
}: AvailableServicesProps) {
  const [selectedService, setSelectedService] =
    useState<ServiceConfigTemplate | null>(null);
  const [search, setSearch] = useState("");

  const filteredServices =
    search.length > 0
      ? availableServices.filter((service) =>
          service.name.toLowerCase().includes(search.toLowerCase())
        )
      : availableServices;

  console.log(search);

  const handleServiceSelect = (service: ServiceConfigTemplate) => {
    setSelectedService(service);
  };

  const handleCreateService = () => {
    if (selectedService) {
      onServiceSelect(selectedService);
    }
  };

  return (
    <div className="space-y-4">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search Services"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <Card
            key={service.id}
            className={`p-4 cursor-pointer transition-colors ${
              selectedService?.id === service.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => handleServiceSelect(service)}
          >
            <div className="flex items-center space-x-2">
              {service.icon && (
                <div className="w-8 h-8 flex items-center justify-center">
                  <i className={`icon-${service.icon}`} />
                </div>
              )}
              <div>
                <h3 className="font-medium">{service.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {service.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedService && (
        <div className="flex justify-end">
          <Button onClick={handleCreateService} disabled={disabled}>
            {disabled ? "Creating..." : "Create Service"}
          </Button>
        </div>
      )}
    </div>
  );
}
