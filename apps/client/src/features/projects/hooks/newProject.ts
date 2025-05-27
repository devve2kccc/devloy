import { client } from "@/lib/hc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { newProject } from "../actions/projects";

type ResponseType = InferResponseType<typeof client.api.projects.$post>;

type RequestType = InferRequestType<typeof client.api.projects.$post>["json"];

export const useNewProjectMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => newProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return mutation;
};
