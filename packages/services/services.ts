// This type represents the combined configuration (template defaults + user overrides)
// that will be used to generate the dockerode options.

import Docker from "dockerode";

export type ServiceInstanceConfig = {
  containerName: string;
  environment: Record<string, string>;
  volumes: string[];
  port: number; // The host port the user wants to expose
  serviceInternalPort: number; // The internal port of the service (e.g., 5432 for Postgres)
  dockerImage: string; // Ensure this is always present in the final config
  // Add any other properties from ServiceTemplateConfig that are needed for Docker options
  // e.g., networks, restart policy name, cpu/memory limits, etc.
};

export type ServiceConfigTemplate = {
  id: string;
  name: string;
  description: string;
  type: "database" | "cache" | "application" | "custom_docker";
  icon?: string;
  defaultConfig: {
    environment: Record<string, string>;
    volumes: string[];
    ports: string[]; // These are container's internal ports
  };
  dockerImage: string; // Default image for the template

  // NEW: Function to generate Docker.ContainerCreateOptions directly
  toDockerCreateOptions: (
    config: ServiceInstanceConfig
  ) => Docker.ContainerCreateOptions;
};

export const availableServices: ServiceConfigTemplate[] = [
  {
    id: "postgres",
    name: "PostgreSQL",
    description: "A powerful, open source object-relational database system",
    type: "database",
    icon: "database",
    defaultConfig: {
      environment: {
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_DB: "postgres",
      },
      // Note: For volumes, `dockerode` expects a specific string format.
      // "postgres_data:/var/lib/postgresql/data" directly maps to HostConfig.Binds
      volumes: ["postgres_data:/var/lib/postgresql/data"],
      ports: ["5432"], // Internal container port
    },
    dockerImage: "postgres:latest",
    toDockerCreateOptions: (config: ServiceInstanceConfig) => {
      const createOptions: Docker.ContainerCreateOptions = {
        Image: config.dockerImage,
        name: config.containerName,
        Env: Object.entries(config.environment).map(
          ([key, value]) => `${key}=${value}`
        ),
        HostConfig: {
          RestartPolicy: {
            Name: "unless-stopped",
          },
          // Map the host port to the internal service port
          PortBindings: {
            [`${config.serviceInternalPort}/tcp`]: [
              { HostPort: String(config.port) },
            ],
          },
          // Apply volumes directly
          Binds: config.volumes,
        },
        // It's good practice to declare the internal ports the container exposes
        ExposedPorts: {
          [`${config.serviceInternalPort}/tcp`]: {},
        },
      };
      return createOptions;
    },
  },
  {
    id: "redis",
    name: "Redis",
    description: "In-memory data structure store",
    type: "cache",
    icon: "database",
    defaultConfig: {
      environment: {},
      volumes: ["redis_data:/data"],
      ports: ["6379"], // Internal container port
    },
    dockerImage: "redis:latest",
    toDockerCreateOptions: (config: ServiceInstanceConfig) => {
      const createOptions: Docker.ContainerCreateOptions = {
        Image: config.dockerImage,
        name: config.containerName,
        Env: Object.entries(config.environment).map(
          ([key, value]) => `${key}=${value}`
        ), // Will be empty if no environment vars
        HostConfig: {
          RestartPolicy: {
            Name: "unless-stopped",
          },
          PortBindings: {
            [`${config.serviceInternalPort}/tcp`]: [
              { HostPort: String(config.port) },
            ],
          },
          Binds: config.volumes,
        },
        ExposedPorts: {
          [`${config.serviceInternalPort}/tcp`]: {},
        },
      };
      return createOptions;
    },
  },
];
