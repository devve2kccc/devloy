import { client } from "@/lib/hc";
import { useMutation } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";

type ResponseType = InferResponseType<typeof client.api.projects.$post>;

type RequestType = InferRequestType<typeof client.api.projects.$post>["json"];

export const useNewProjectMutation = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.projects.$post({ json });

      return (await response.json()) as ResponseType;
    },
  });

  return mutation;
};
