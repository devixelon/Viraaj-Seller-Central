"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Input } from "@/components/ui";
import { SAVE_BANK_DETAILS } from "@/graphql/mutations/saveBankDetails";
import { getErrorMessage } from "@/lib/errors";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { StepFeedbackAlert } from "@/components/StepFeedbackAlert";

interface BankDetailsFormValues {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
}

interface BankDetailsStepProps {
  onNext: (values: BankDetailsFormValues) => void;
  onBack: () => void;
  initialValues?: BankDetailsFormValues;
  feedback?: {
    step: number;
    needsCorrection: boolean;
    feedback: string;
    resubmitted: boolean;
  };
}

export const BankDetailsStep: React.FC<BankDetailsStepProps> = ({
  onNext,
  onBack,
  initialValues,
  feedback,
}) => {
  const [error, setError] = useState("");
  const [saveBankDetails] = useGraphQLMutation(SAVE_BANK_DETAILS);

  const validate = (values: BankDetailsFormValues) => {
    const errors: any = {};

    if (!values.accountHolderName) {
      errors.accountHolderName = "Account holder name is required";
    } else if (values.accountHolderName.length < 3) {
      errors.accountHolderName = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(values.accountHolderName)) {
      errors.accountHolderName = "Name should contain only letters";
    }

    if (!values.accountNumber) {
      errors.accountNumber = "Account number is required";
    } else if (!/^[0-9]{9,18}$/.test(values.accountNumber)) {
      errors.accountNumber = "Account number must be 9-18 digits";
    }

    if (!values.confirmAccountNumber) {
      errors.confirmAccountNumber = "Please re-enter account number";
    } else if (values.accountNumber !== values.confirmAccountNumber) {
      errors.confirmAccountNumber = "Account numbers do not match";
    }

    if (!values.ifscCode) {
      errors.ifscCode = "IFSC code is required";
    } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(values.ifscCode)) {
      errors.ifscCode = "Invalid IFSC code format (e.g., SBIN0001234)";
    }

    return errors;
  };

  const handleSubmit = async (
    values: BankDetailsFormValues,
    { setSubmitting }: FormikHelpers<BankDetailsFormValues>
  ) => {
    try {
      setError("");

      const result = await saveBankDetails({
        variables: {
          accountHolderName: values.accountHolderName,
          bankAccountNumber: values.accountNumber,
          confirmAccountNumber: values.confirmAccountNumber,
          ifscCode: values.ifscCode,
        },
      });

      if (result.error) {
        setError(getErrorMessage(result.error));
        setSubmitting(false);
        return;
      }

      if (!result.data?.saveBankDetails?.success) {
        setError(
          result.data?.saveBankDetails?.message || "Failed to save bank details"
        );
        setSubmitting(false);
        return;
      }

      // Success - move to next step or complete
      onNext(values);
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Bank Account Details
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter your bank account details for payment settlements.
        </p>

        {feedback && (
          <StepFeedbackAlert 
            feedback={feedback.feedback}
            resubmitted={feedback.resubmitted}
          />
        )}

        <Formik
          initialValues={{
            accountHolderName: initialValues?.accountHolderName || "",
            accountNumber: initialValues?.accountNumber || "",
            confirmAccountNumber: initialValues?.confirmAccountNumber || "",
            ifscCode: initialValues?.ifscCode || "",
          }}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          }) => (
            <Form className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="Account Holder Name"
                name="accountHolderName"
                type="text"
                placeholder="Enter account holder name"
                value={values.accountHolderName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.accountHolderName}
                touched={touched.accountHolderName}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Bank Account Number"
                name="accountNumber"
                type="text"
                placeholder="Enter bank account number"
                value={values.accountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.accountNumber}
                touched={touched.accountNumber}
                required
                disabled={isSubmitting}
              />

              <Input
                label="Re-enter Bank Account Number"
                name="confirmAccountNumber"
                type="text"
                placeholder="Re-enter bank account number"
                value={values.confirmAccountNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.confirmAccountNumber}
                touched={touched.confirmAccountNumber}
                required
                disabled={isSubmitting}
              />

              <Input
                label="IFSC Code"
                name="ifscCode"
                type="text"
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                value={values.ifscCode}
                onChange={(e) => {
                  e.target.value = e.target.value.toUpperCase();
                  handleChange(e);
                }}
                onBlur={handleBlur}
                error={errors.ifscCode}
                touched={touched.ifscCode}
                required
                disabled={isSubmitting}
              />

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save and Continue"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
