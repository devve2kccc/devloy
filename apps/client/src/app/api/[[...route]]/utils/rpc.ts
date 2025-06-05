import { hcWithType } from "@repo/api-client";

export const client = hcWithType("http://localhost:3000", {
  init: {
    credentials: "include",
  },
});
