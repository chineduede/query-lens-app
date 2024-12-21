import "reflect-metadata";
import { ConfigManager } from "./ConfigManager";

export class NamingStrategy {
  private static instance: NamingStrategy;

  private constructor(private readonly config: ConfigManager) {}

  public static getInstance(config: ConfigManager): NamingStrategy {
    if (!NamingStrategy.instance) {
      NamingStrategy.instance = new NamingStrategy(config);
    }
    return NamingStrategy.instance;
  }

  public name(
    name: string,
    splitter = "-",
    appendStage = true,
    appendStageType = false
  ): string {
    let output = name.startsWith(this.config.shortName())
      ? name
      : name
      ? `${this.config.shortName()}-${name}`
      : this.config.shortName();

    if (appendStage) {
      output += `-${this.config.env()}`;
    } else if (appendStageType) {
      output += `-${this.config.envType()}`;
    }

    if (splitter !== "-") {
      output = output.replace(/-/g, splitter);
    }

    return output;
  }
}
