import { gql } from "@apollo/client";

export const SELLER_APPLICATION_STATUS = gql`
  query SellerApplicationStatus {
    sellerApplicationStatus {
      status
      currentStep
      hasPendingCorrections
      pendingFeedback {
        step
        needsCorrection
        feedback
        resubmitted
      }
      message
      isActive
    }
  }
`;
