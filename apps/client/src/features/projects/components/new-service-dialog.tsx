import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceConfig } from "@repo/services";

import { useNewService } from "../states/use-new-service";
import AvailableServicesList from "./available-service-list";
import { useEnvironmentStore } from "../states/environment";

export default function NewServiceDialog() {
  const { isOpen, onClose } = useNewService();
  const { projectId, selectedEnvironment } = useEnvironmentStore();

  const handleSubmit = (values: ServiceConfig) => {
    console.log(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Service</DialogTitle>
          <DialogDescription>Add a new service</DialogDescription>
        </DialogHeader>

        <AvailableServicesList onServiceSelect={handleSubmit} />
      </DialogContent>
    </Dialog>
  );
}
