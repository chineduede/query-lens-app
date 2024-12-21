import { defineBackend } from '@aws-amplify/backend';
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { apiFunction } from './api/api-handler/resource';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
// import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Stack } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
  apiFunction,
});


const apiStack = backend.createStack('api-stack');
const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  'userPoolAuthorizer',
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient],
  }
)

const lambdaIntegration = new HttpLambdaIntegration(
  'lambdaIntegration',
  backend.apiFunction.resources.lambda
)


const httpApi = new HttpApi(apiStack, 'httpApi', {
  apiName: 'query-lens-api',
  corsPreflight: {
    allowMethods: [
      CorsHttpMethod.ANY,
    ],
    allowOrigins: ["*"],
    allowHeaders: ["*"],
  },
})

httpApi.addRoutes({
  path: '/{any+}',
  integration: lambdaIntegration,
  authorizer: userPoolAuthorizer,
})

httpApi.addRoutes({
  methods: [HttpMethod.OPTIONS],
  path: '/{proxy+}',
  integration: lambdaIntegration,
})
// // create a new IAM policy to allow Invoke access to the API
// const apiPolicy = new Policy(apiStack, "ApiPolicy", {
//   statements: [
//     new PolicyStatement({
//       actions: ["execute-api:Invoke"],
//       resources: [
//         `${httpApi.arnForExecuteApi("*", "/items")}`,
//         `${httpApi.arnForExecuteApi("*", "/items/*")}`,
//         `${httpApi.arnForExecuteApi("*", "/cognito-auth-path")}`,
//       ],
//     }),
//   ],
// });

// // attach the policy to the authenticated and unauthenticated IAM roles
// backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy);
// backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy);

backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
});
