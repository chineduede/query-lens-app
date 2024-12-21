import convict from "convict";

export enum EnvironmentType {
  QA = "qa",
  STAGING = "staging",
  PROD = "prod",
}

const configSchema = {
  env: {
    doc: "The application environment (stage)",
    format: "*",
    default: "qa",
  },
  shortName: {
    doc: "Short name of application",
    format: "*",
    default: "query-lens",
  },
};

export class ConfigManager {
  private static instance: ConfigManager;
  private readonly config = convict({
    ...configSchema,
  });

  private constructor(env: string) {
    const envLower = env.toLowerCase();
    this.config.set("env", envLower);
    this.config.validate({ allowed: "strict" });
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      const stage = process.env.STAGE;
      if (!stage) {
        throw new Error("STAGE environment variable is not set");
      }
      ConfigManager.instance = new ConfigManager(stage);
    }
    return ConfigManager.instance;
  }

  public env(): string {
    return this.config.get("env");
  }

  public shortName(): string {
    return this.config.get("shortName");
  }

  public envType(): EnvironmentType {
    switch (this.env()) {
      case EnvironmentType.PROD:
        return EnvironmentType.PROD;
      case EnvironmentType.STAGING:
        return EnvironmentType.STAGING;
      default:
        return EnvironmentType.QA;
    }
  }

  public isDevEnv() {
    switch (this.env()) {
      case EnvironmentType.PROD:
      case EnvironmentType.STAGING:
      case EnvironmentType.QA:
        return false;
      default:
        return true;
    }
  }
}
