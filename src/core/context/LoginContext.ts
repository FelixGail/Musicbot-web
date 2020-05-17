import { createContext } from "react";

export interface ILoginContext {
  setError: (error: string | null) => void;
  redirectToReferrer: () => void;
}
export const LoginContext = createContext<ILoginContext>({
  setError: () => {},
  redirectToReferrer: () => {},
});
