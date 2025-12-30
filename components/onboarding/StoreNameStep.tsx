"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Input } from "@/components/ui";
import { SAVE_STORE_NAME } from "@/graphql/mutations/saveStoreName";
import { getErrorMessage } from "@/lib/errors";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { StepFeedbackAlert } from "@/components/StepFeedbackAlert";

interface StoreNameFormValues {
  storeName: string;
}

interface StoreNameStepProps {
  onNext: (values: StoreNameFormValues) => void;
  onBack: () => void;
  initialValues?: StoreNameFormValues;
  feedback?: {
    step: number;
    needsCorrection: boolean;
    feedback: string;
    resubmitted: boolean;
  };
}

export const StoreNameStep: React.FC<StoreNameStepProps> = ({
  onNext,
  onBack,
  initialValues,
  feedback,
}) => {
  const [error, setError] = useState("");
  const [saveStoreName] = useGraphQLMutation(SAVE_STORE_NAME);

  const validate = (values: StoreNameFormValues) => {
    const errors: any = {};

    if (!values.storeName) {
      errors.storeName = "Store name is required";
    } else if (values.storeName.length < 3) {
      errors.storeName = "Store name must be at least 3 characters";
    } else if (values.storeName.length > 50) {
      errors.storeName = "Store name must not exceed 50 characters";
    }

    return errors;
  };

  const handleSubmit = async (
    values: StoreNameFormValues,
    { setSubmitting }: FormikHelpers<StoreNameFormValues>
  ) => {
    try {
      setError("");

      const result = await saveStoreName({
        variables: {
          storeName: values.storeName,
        },
      });

      if (result.error) {
        setError(getErrorMessage(result.error));
        setSubmitting(false);
        return;
      }

      if (!result.data?.saveStoreName?.success) {
        setError(
          result.data?.saveStoreName?.message || "Failed to save store name"
        );
        setSubmitting(false);
        return;
      }

      // Success - move to next step
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
          Name your Viraaj store
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your Viraaj store name can be updated anytime from your account
          settings.
        </p>

        {feedback && (
          <StepFeedbackAlert 
            feedback={feedback.feedback}
            resubmitted={feedback.resubmitted}
          />
        )}

        <Formik
          initialValues={{
            storeName: initialValues?.storeName || "",
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
              
              <div className="border border-gray-200 rounded-lg p-6">
                <Input
                  label="Your Viraaj Store Name"
                  name="storeName"
                  type="text"
                  placeholder="Enter your store name"
                  value={values.storeName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.storeName}
                  touched={touched.storeName}
                  required
                  disabled={isSubmitting}
                />
              </div>

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
