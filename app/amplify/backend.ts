import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { Stack } from "aws-cdk-lib";
import { ConfigManager } from "./utils/ConfigManager";
import { NamingStrategy } from "./utils/NamingStrategy";
import { AiAnalyzerConstruct } from "./ai-analyzer/resource";
import { ApiConstruct } from "./api/resource";

const backend = defineBackend({
  auth,
  data,
});

const configManager = ConfigManager.getInstance();
const namingStrategy = NamingStrategy.getInstance(configManager);

const aiAnalyzerConstruct = new AiAnalyzerConstruct(
  backend.createStack("ai-analyzer-stack"),
  "ai-analyzer-stack",
  {
    namingStrategy,
    configManager,
  }
);

const apiConstruct = new ApiConstruct(
  backend.createStack("api-stack"),
  "api-stack",
  {
    namingStrategy,
    userPool: backend.auth.resources.userPool,
    userPoolClient: backend.auth.resources.userPoolClient,
    s3AnalysisBucket: aiAnalyzerConstruct.resultsBucket,
  }
);

apiConstruct.node.addDependency(aiAnalyzerConstruct);

backend.addOutput({
  custom: {
    API: {
      [apiConstruct.api.httpApiName!]: {
        endpoint: apiConstruct.api.url,
        region: Stack.of(apiConstruct.api).region,
        apiName: apiConstruct.api.httpApiName,
      },
    },
  },
});
