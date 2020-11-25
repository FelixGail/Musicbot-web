import styled from "styled-components";
import arrow from "../../../resources/img/arrow.svg";

export const NavigationArrow = styled.div<{ position: "left" | "right" }>`
  opacity: 0;

  @media only screen and (min-width: 1000px) {
    opacity: 1;
  }

  position: absolute;
  height: 14%;
  top: 44%;
  margin: 1%;
  width: 4%;
  background-image: url(${arrow});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  ${(props) =>
    props.position === "left"
      ? `${props.position}: 0;transform: rotate(180deg);`
      : `${props.position}: 0;`}
`;
