import { gql } from "@apollo/client";

export const SIGN_IN = gql`
  mutation SignIn($emailOrMobile: String!, $password: String!) {
    signIn(emailOrMobile: $emailOrMobile, password: $password) {
      message
      user {
        id
        email
        mobileNumber
      }
      accessToken
      refreshToken
    }
  }
`;
