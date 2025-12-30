import { gql } from "@apollo/client";

export const SAVE_SHIPPING_ADDRESS = gql`
  mutation SaveShippingAddress(
    $pincode: String!
    $city: String!
    $state: String!
    $address: String!
  ) {
    saveShippingAddress(
      pincode: $pincode
      city: $city
      state: $state
      address: $address
    ) {
      success
      message
      sellerProfile {
        currentStep
        step4Completed
      }
    }
  }
`;
