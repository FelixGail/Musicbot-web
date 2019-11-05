import React from "react";
import { RouteComponentProps } from "react-router";
import { Row, Col } from "antd";
import LinkButton from "../util/LinkButton";
import { Link } from "react-router-dom";
import { IdenticonComponent } from "./Identicon";
import { Fingerprint } from "icbint";
import { FingerprintContext, ConfigurationContext } from "../../core/context";
export const VerifyFingerprint = (props: RouteComponentProps) => {
  return (
    <Row>
      <Col offset={2} span={20}>
        <div className="stateContainer" id="state1">
          <h1 className="fade centered">Welcome</h1>
          <h4 className="fade centered" id="text1">
            Please verify that this identicon matches the one created by your
            server.
          </h4>
          <a
            className="footnote fade"
            href="https://bjoernpetersen.github.io/ICBINT/"
          >
            (MORE INFORMATION)
          </a>
          <ConfigurationContext.Consumer>
            {value => {
              const fingerprint = new Fingerprint(
                value.configuration.icbintKey!
              );
              return (
                <FingerprintContext.Provider value={fingerprint}>
                  <div className="identiconWrapper">
                    {fingerprint.identicons.map((identicon, i) => {
                      return (
                        <Link key={i} to={`${props.match.url}/${i}`}>
                          <IdenticonComponent
                            className="identicon"
                            identicon={identicon}
                            computingSize={150}
                          />
                        </Link>
                      );
                    })}
                  </div>
                  <p className="footnote">
                    Fingerprint: {fingerprint.getReadableHeyString()}
                  </p>
                </FingerprintContext.Provider>
              );
            }}
          </ConfigurationContext.Consumer>
          <LinkButton className="fade" to={`user`}>
            Verify
          </LinkButton>
        </div>
      </Col>
    </Row>
  );
};
