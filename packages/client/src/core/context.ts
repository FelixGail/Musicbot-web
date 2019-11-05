import { createContext } from "react";
import { Fingerprint } from "icbint";
import Axios, { AxiosInstance } from "axios";
import { Token, Permission } from "./types";

export interface ILoginContext {
  setError: (error: string | null) => void;
  redirectToReferrer: () => void;
}

export const LoginContext = createContext<ILoginContext>({
  setError: () => {},
  redirectToReferrer: () => {}
});

export const FingerprintContext = createContext(new Fingerprint(""));

export const AxiosContext = createContext(Axios.create());

export interface IConfiguration {
  username?: string;
  password?: string;
  token?: Token;
  permissions?: Permission[];
  icbintKey?: string;
  loggedIn: boolean;
  axios: AxiosInstance;
}

export interface IConfigurationContext {
  readonly configuration: IConfiguration;
  setConfiguration: (patch: Partial<IConfiguration>) => void;
}

export const ConfigurationContext = createContext<IConfigurationContext>({
  configuration: { loggedIn: false, axios: Axios.create() },
  setConfiguration: () => {}
});
