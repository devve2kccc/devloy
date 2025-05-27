import { hcWithType } from "@repo/api-client";


export const client = hcWithType("http://localhost:4000", {
  init: {
    credentials: "include",
  },
});
