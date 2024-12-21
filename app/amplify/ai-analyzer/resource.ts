import { Construct } from "constructs";
import { NamingStrategy } from "../utils/NamingStrategy";
import { Bucket, BucketEncryption } from "aws-cdk-lib/aws-s3";
import { RemovalPolicy } from "aws-cdk-lib";
import { ConfigManager } from "../utils/ConfigManager";

type AiAnalyzerStackProps = {
  namingStrategy: NamingStrategy;
  configManager: ConfigManager;
};

export class AiAnalyzerConstruct extends Construct {
  public readonly resultsBucket: Bucket;

  constructor(scope: Construct, id: string, props: AiAnalyzerStackProps) {
    super(scope, id);

    const namingStrategy = props.namingStrategy;
    const configManager = props.configManager;
    // create s3 analysis bucket
    const resultsBucketName = namingStrategy.name("query-analysis-results");
    this.resultsBucket = new Bucket(this, resultsBucketName, {
      removalPolicy: configManager.isDevEnv()
        ? RemovalPolicy.DESTROY
        : RemovalPolicy.RETAIN,
      versioned: true,
      encryption: BucketEncryption.S3_MANAGED,
    });
  }
}
