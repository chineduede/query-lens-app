import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import serverless from 'serverless-http';
import { ExpressApiSetup } from './express';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const app = ExpressApiSetup();
  const serverlessApp = serverless(app);

  app.locals.event = event;
  const response = await serverlessApp(event, {});

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      "Access-Control-Allow-Origin": "*", // Restrict this to domains you trust
      "Access-Control-Allow-Headers": "*", // Specify only the headers you need to allow
    },
    body: JSON.stringify(response),
  };
};
