import CardWrapper from "@/components/card-wrapper";
import { Service } from "@repo/db";

export function ServiceCard({ service }: { service: Service }) {
  return (
    <CardWrapper header={service.name} description={service.status}>
      {service.name}
    </CardWrapper>
  );
}
