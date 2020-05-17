import { createContext } from "react";
import { Fingerprint } from "icbint";

export const FingerprintContext = createContext(new Fingerprint(""));
