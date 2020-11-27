import { createContext } from 'react';

export interface ConnectProp {
  setNextState: (nextState: SetupStates) => void;
}

export enum SetupStates {
  FETCH_INSTANCES,
  PINGING,
  TEST_ICBINT,
  LOGIN_ICBINT,
  LOGIN_NO_ICBINT,
  REGISTER_NO_ICBINT,
  FETCH_USER_INFO,
  DONE,
  FAILED,
}

export const ConnectionSetupContext = createContext<ConnectProp>({
  setNextState: () => console.error('ConnectionSetupContext has not been initialized correctly'),
});
