import { defineFunction } from "@aws-amplify/backend";

export const apiFunction = defineFunction({
  name: "api-handler",
  runtime: 20,
  resourceGroupName: "api",
  
});
