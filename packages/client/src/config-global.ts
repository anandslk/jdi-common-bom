import packageJson from "../package.json";

type ConfigValue = {
  appName: string;
  appVersion: string;
};

export const CONFIG: ConfigValue = {
  appName: "BOM",
  appVersion: packageJson.version,
};
