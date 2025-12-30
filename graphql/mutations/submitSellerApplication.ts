import { gql } from "@apollo/client";

export const SUBMIT_SELLER_APPLICATION = gql`
  mutation SubmitSellerApplication {
    submitSellerApplication {
      success
      message
      sellerProfile {
        applicationStatus
        submittedAt
      }
    }
  }
`;
