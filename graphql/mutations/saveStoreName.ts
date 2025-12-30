import { gql } from "@apollo/client";

export const SAVE_STORE_NAME = gql`
  mutation SaveStoreName($storeName: String!) {
    saveStoreName(storeName: $storeName) {
      success
      message
      sellerProfile {
        currentStep
        step3Completed
      }
    }
  }
`;
