"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Input, FileUpload } from "@/components/ui";
import { SAVE_GST_PAN_DETAILS } from "@/graphql/mutations/saveGstPanDetails";
import { getErrorMessage } from "@/lib/errors";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { StepFeedbackAlert } from "@/components/StepFeedbackAlert";

interface GSTFormValues {
  hasGST: boolean;
  gstNumber: string;
  panNumber: string;
  panDocument: File | null;
}

interface GSTStepProps {
  onNext: (values: GSTFormValues) => void;
  initialValues?: GSTFormValues;
  feedback?: {
    step: number;
    needsCorrection: boolean;
    feedback: string;
    resubmitted: boolean;
  };
}

export const GSTStep: React.FC<GSTStepProps> = ({
  onNext,
  initialValues,
  feedback,
}) => {
  const [hasGST, setHasGST] = useState(initialValues?.hasGST ?? true);
  const [error, setError] = useState("");
  const [saveGstPanDetails] = useGraphQLMutation(SAVE_GST_PAN_DETAILS);

  const validate = (values: GSTFormValues) => {
    const errors: any = {};

    if (hasGST) {
      if (!values.gstNumber) {
        errors.gstNumber = "GST number is required";
      } else if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          values.gstNumber
        )
      ) {
        errors.gstNumber = "Invalid GST number format";
      }
    } else {
      if (!values.panNumber) {
        errors.panNumber = "PAN number is required";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(values.panNumber)) {
        errors.panNumber = "Invalid PAN number format (e.g., ABCDE1234F)";
      }

      if (!values.panDocument) {
        errors.panDocument = "PAN document is required";
      }
    }

    return errors;
  };

  const handleSubmit = async (
    values: GSTFormValues,
    { setSubmitting }: FormikHelpers<GSTFormValues>
  ) => {
    try {
      setError("");

      // TODO: Upload PAN document if exists and get URL
      const panDocumentUrl = values.panDocument
        ? "https://example.com/pan.jpg"
        : undefined;

      const result = await saveGstPanDetails({
        variables: {
          documentType: hasGST ? "GST" : "PAN",
          gstNumber: hasGST ? values.gstNumber : undefined,
          panNumber: !hasGST ? values.panNumber : undefined,
          panDocumentUrl: !hasGST ? panDocumentUrl : undefined,
        },
      });

      if (result.error) {
        setError(getErrorMessage(result.error));
        setSubmitting(false);
        return;
      }

      if (!result.data?.saveGstPanDetails?.success) {
        setError(
          result.data?.saveGstPanDetails?.message ||
            "Failed to save GST/PAN details"
        );
        setSubmitting(false);
        return;
      }

      // Success - move to next step
      onNext({ ...values, hasGST });
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
          {hasGST ? "Enter GST number" : "Enter PAN number"}
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          {hasGST
            ? "GST number is required to sell on Viraaj."
            : "PAN number is mandatory to sell non-GST categories."}
        </p>

        {feedback && (
          <StepFeedbackAlert
            feedback={feedback.feedback}
            resubmitted={feedback.resubmitted}
          />
        )}

        <Formik
          initialValues={{
            hasGST,
            gstNumber: initialValues?.gstNumber || "",
            panNumber: initialValues?.panNumber || "",
            panDocument: initialValues?.panDocument || null,
          }}
          validate={validate}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {hasGST ? (
                <>
                  <Input
                    label="15 digit GST number"
                    name="gstNumber"
                    type="text"
                    placeholder="Enter GST number"
                    value={values.gstNumber || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.gstNumber}
                    touched={touched.gstNumber}
                    required
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasPAN"
                      name="documentType"
                      checked={!hasGST}
                      onChange={() => setHasGST(false)}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="hasPAN"
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      I have PAN number
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <Input
                    label="10 digit PAN number"
                    name="panNumber"
                    type="text"
                    placeholder="Enter PAN number"
                    value={values.panNumber || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.panNumber}
                    touched={touched.panNumber}
                    required
                    disabled={isSubmitting}
                  />

                  <FileUpload
                    label="Upload PAN Document"
                    name="panDocument"
                    accept="image/*,.pdf"
                    onChange={(file) => setFieldValue("panDocument", file)}
                    error={errors.panDocument}
                    touched={touched.panDocument}
                    required
                    disabled={isSubmitting}
                  />

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasGST"
                      name="documentType"
                      checked={hasGST}
                      onChange={() => setHasGST(true)}
                      className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                    />
                    <label
                      htmlFor="hasGST"
                      className="ml-2 text-sm text-gray-700 cursor-pointer"
                    >
                      I have GST number
                    </label>
                  </div>
                </>
              )}

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
