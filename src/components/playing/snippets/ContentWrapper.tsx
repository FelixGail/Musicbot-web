import styled from 'styled-components';

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media only screen and (max-width: 600px) {
    margin-left: 5px;
    margin-right: 5px;
  }

  @media only screen and (min-width: 600px) {
    margin-left: 20px;
    margin-right: 20px;
  }

  @media only screen and (min-width: 1000px) {
    margin-left: 10%;
    margin-right: 10%;
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
