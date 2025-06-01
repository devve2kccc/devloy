"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useEnvironmentSelection,
  useEnvironmentStore,
} from "../states/environment";
import { useEffect } from "react";

interface EnvironmentSelect {
  projectId: string;
}
export default function EnvironmentSelect({ projectId }: EnvironmentSelect) {
  const { environments, selectedEnvironment, setSelectedEnvironment } =
    useEnvironmentSelection();

  console.log(environments);

  useEffect(() => {
    useEnvironmentStore.getState().setProjectId(projectId);
  }, [projectId]);

  return (
    <Select value={selectedEnvironment} onValueChange={setSelectedEnvironment}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select environment" />
      </SelectTrigger>
      <SelectContent>
        {environments?.map((env) => (
          <SelectItem key={env.id} value={env.id}>
            {env.type}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
