import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as url from "node:url";
import { Construct } from "constructs";
import { NamingStrategy } from "../utils/NamingStrategy";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from "aws-cdk-lib/aws-apigatewayv2";
import { HttpUserPoolAuthorizer } from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { IUserPool, IUserPoolClient } from "aws-cdk-lib/aws-cognito";
import { Bucket } from "aws-cdk-lib/aws-s3";

type ApiStackProps = {
  s3AnalysisBucket: Bucket;
  namingStrategy: NamingStrategy;
  userPool: IUserPool;
  userPoolClient: IUserPoolClient;
};

export class ApiConstruct extends Construct {
  public readonly api: HttpApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id);

    const namingStrategy = props.namingStrategy;

    // Create Lambda Integration Function
    const apiLambda = new lambda.NodejsFunction(
      this,
      namingStrategy.name("apiLambda"),
      {
        entry: url.fileURLToPath(new URL("handler.ts", import.meta.url)),
        environment: {
          ANALYSIS_BUCKET_NAME: props.s3AnalysisBucket.bucketName,
        },
        runtime: Runtime.NODEJS_22_X,
        bundling: {
          sourceMap: true,
        },
      }
    );

    // add permissions for lambda to access s3 bucket
    props.s3AnalysisBucket.grantRead(apiLambda);

    // create lambda integration
    const lambdaIntegration = new HttpLambdaIntegration(
      "apiLambdaIntegration",
      apiLambda
    );

    // create user pool authorizer
    const userPoolAuthorizer = new HttpUserPoolAuthorizer(
      "userPoolAuthorizer",
      props.userPool,
      {
        userPoolClients: [props.userPoolClient],
      }
    );

    // create http api
    const httpApi = new HttpApi(this, namingStrategy.name("api"), {
      apiName: namingStrategy.name("api"),
      corsPreflight: {
        allowMethods: [CorsHttpMethod.ANY],
        allowOrigins: ["*"],
        allowHeaders: ["*"],
      },
    });

    httpApi.addRoutes({
      path: "/{any+}",
      integration: lambdaIntegration,
      authorizer: userPoolAuthorizer,
    });

    // CORS Preflight
    httpApi.addRoutes({
      methods: [HttpMethod.OPTIONS],
      path: "/{proxy+}",
      integration: lambdaIntegration,
    });

    this.api = httpApi;
  }
}
