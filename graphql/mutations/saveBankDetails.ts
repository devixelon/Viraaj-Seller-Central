import { gql } from "@apollo/client";

export const SAVE_BANK_DETAILS = gql`
  mutation SaveBankDetails(
    $accountHolderName: String!
    $bankAccountNumber: String!
    $confirmAccountNumber: String!
    $ifscCode: String!
  ) {
    saveBankDetails(
      accountHolderName: $accountHolderName
      bankAccountNumber: $bankAccountNumber
      confirmAccountNumber: $confirmAccountNumber
      ifscCode: $ifscCode
    ) {
      success
      message
      sellerProfile {
        currentStep
        step5Completed
        allStepsCompleted
      }
    }
  }
`;
