import styled from "styled-components";

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 600px) {
    margin-left: 5px;
    margin-right: 5px;
  }

  @media only screen and (min-width: 600px) {
    margin-left: 20px;
    margin-right: 20px;
  }

  @media only screen and (min-width: 1000px) {
    margin-left: 50px;
    margin-right: 50px;
  }

  @media only screen and (min-width: 1600px) {
    margin-left: 100px;
    margin-right: 100px;
  }

  @media only screen and (max-height: 600px) {
    margin-top: 10px;
  }

  @media only screen and (min-height: 600px) {
    margin-top: 20px;
  }

  @media only screen and (min-height: 1200) {
    margin-top: 50px;
  }
  
`;