import { create } from "zustand";
import { useEffect } from "react";
import { useGetProjectEnvironments } from "../hooks/getProjectsEnvironments";

interface EnvironmentState {
  selectedEnvironment: string;
  setSelectedEnvironment: (env: string) => void;
  projectId: string | null;
  setProjectId: (id: string) => void;
}

export const useEnvironmentStore = create<EnvironmentState>((set) => ({
  selectedEnvironment: "",
  setSelectedEnvironment: (env) => set({ selectedEnvironment: env }),
  projectId: null,
  setProjectId: (id) => set({ projectId: id }),
}));

// Custom hook to handle environment selection and default environment
export function useEnvironmentSelection() {
  const { projectId, selectedEnvironment, setSelectedEnvironment } =
    useEnvironmentStore();

  const { data: environments } = useGetProjectEnvironments(projectId);

  // Set default environment (production) when environments are loaded
  useEffect(() => {
    if (environments && !selectedEnvironment) {
      const productionEnv = environments.find(
        (env) => env.type === "production"
      );
      setSelectedEnvironment(productionEnv?.id || environments[0]?.id);
    }
  }, [environments, selectedEnvironment, setSelectedEnvironment]);

  return {
    environments,
    selectedEnvironment,
    setSelectedEnvironment,
  };
}
