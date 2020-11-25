import { createContext } from "react";

export interface ILoginContext {
  setError: (error: string | null) => void;
  redirect: string;
}

export const LoginContext = createContext<ILoginContext>({
  setError: () => {},
  redirect: "/",
});
