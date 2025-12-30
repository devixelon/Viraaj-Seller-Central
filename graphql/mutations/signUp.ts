import { gql } from "@apollo/client";

export const SIGN_UP = gql`
  mutation SignUp(
    $email: String!
    $mobileNumber: String!
    $password: String!
    $passwordConfirm: String!
  ) {
    signUp(
      email: $email
      mobileNumber: $mobileNumber
      password: $password
      passwordConfirm: $passwordConfirm
    ) {
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
