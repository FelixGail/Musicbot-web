import { createContext } from "react";
import Axios, { AxiosInstance } from "axios";
import { Token, Permission, BotInstance } from "../types";

export interface IConfiguration {
  username?: string;
  token?: Token;
  permissions?: Permission[];
  icbintKey?: string;
  loggedIn: boolean;
  axios: AxiosInstance;
  instance?: BotInstance;
  registryUrl: string;
}
export interface IConfigurationContext {
  readonly configuration: IConfiguration;
  setConfiguration: (patch: Partial<IConfiguration>) => void;
}
export const ConfigurationContext = createContext<IConfigurationContext>({
  configuration: {
    loggedIn: false,
    axios: Axios.create(),
    registryUrl: "/registry",
  },
  setConfiguration: () => {},
});
