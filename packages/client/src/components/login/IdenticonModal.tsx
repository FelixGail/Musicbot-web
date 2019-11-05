import React from "react";
import { IdenticonComponent } from "./Identicon";
import { FingerprintContext } from "../../core/context";
export const IdenticonModal = (match: any, history: any) => {
  return (
    <FingerprintContext.Consumer>
      {fingerprint => {
        const identicon = fingerprint.identicons[parseInt(match.params.id, 10)];
        if (!identicon) return null;
        const back = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
          e.stopPropagation();
          history.goBack();
        };
        return (
          <div onClick={back} className="modalOuter">
            <div className="modal">
              <IdenticonComponent
                className="identcon"
                identicon={identicon}
                computingSize={900}
              />
            </div>
          </div>
        );
      }}
    </FingerprintContext.Consumer>
  );
};
