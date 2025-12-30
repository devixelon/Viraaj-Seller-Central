import { gql } from "@apollo/client";

export const SAVE_GST_PAN_DETAILS = gql`
  mutation SaveGstPanDetails(
    $documentType: String!
    $gstNumber: String
    $panNumber: String
    $panDocumentUrl: String
  ) {
    saveGstPanDetails(
      documentType: $documentType
      gstNumber: $gstNumber
      panNumber: $panNumber
      panDocumentUrl: $panDocumentUrl
    ) {
      success
      message
      sellerProfile {
        currentStep
        step2Completed
      }
    }
  }
`;
