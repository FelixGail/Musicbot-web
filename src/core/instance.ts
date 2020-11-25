import { BotInstance, VersionInfo } from "./types";
import Axios from "axios";
import Operations from "./rest/operations";

export async function isInstanceAvailable(instance: BotInstance) {
  return Axios.get<VersionInfo>(
    `https://${instance.domain}:${instance.port}/version`,
    {
      ...Operations.getVersion(),
      timeout: 1000,
    }
  ).then(
    (value) => {
      instance.name = value.data.botName;
      return true;
    },
    () => false
  );
}

const re = /^(https?:\/\/)?([^\s:]+)(:([1-9][0-9]*))?$/;
export function fromString(
  value: String,
  name: string = "manual",
  defaultPort: number = 42945
): BotInstance | null {
  const match = value.match(re);
  if (match !== null) {
    console.log(match);
    return {
      name: name,
      updated: Date.now(),
      domain: match[2],
      port: match[4] ? +match[4] : defaultPort,
    };
  }
  return null;
}
