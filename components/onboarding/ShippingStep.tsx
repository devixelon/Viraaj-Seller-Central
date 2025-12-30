"use client";

import React, { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import { Input, Select } from "@/components/ui";
import { SAVE_SHIPPING_ADDRESS } from "@/graphql/mutations/saveShippingAddress";
import { getErrorMessage } from "@/lib/errors";
import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { StepFeedbackAlert } from "@/components/StepFeedbackAlert";

interface ShippingFormValues {
  pincode: string;
  city: string;
  state: string;
  address: string;
}

interface ShippingStepProps {
  onNext: (values: ShippingFormValues) => void;
  onBack: () => void;
  initialValues?: ShippingFormValues;
  feedback?: {
    step: number;
    needsCorrection: boolean;
    feedback: string;
    resubmitted: boolean;
  };
}

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry",
];

export const ShippingStep: React.FC<ShippingStepProps> = ({
  onNext,
  onBack,
  initialValues,
  feedback,
}) => {
  const [error, setError] = useState("");
  const [saveShippingAddress] = useGraphQLMutation(SAVE_SHIPPING_ADDRESS);

  const validate = (values: ShippingFormValues) => {
    const errors: any = {};

    if (!values.pincode) {
      errors.pincode = "Pincode is required";
    } else if (!/^[1-9][0-9]{5}$/.test(values.pincode)) {
      errors.pincode = "Invalid pincode (must be 6 digits)";
    }

    if (!values.city) {
      errors.city = "City is required";
    } else if (values.city.length < 2) {
      errors.city = "City name must be at least 2 characters";
    }

    if (!values.state) {
      errors.state = "State is required";
    }

    if (!values.address) {
      errors.address = "Address is required";
    } else if (values.address.length < 10) {
      errors.address = "Address must be at least 10 characters";
    }

    return errors;
  };

  const handleSubmit = async (
    values: ShippingFormValues,
    { setSubmitting }: FormikHelpers<ShippingFormValues>
  ) => {
    try {
      setError("");

      const result = await saveShippingAddress({
        variables: {
          pincode: values.pincode,
          city: values.city,
          state: values.state,
          address: values.address,
        },
      });

      if (result.error) {
        setError(getErrorMessage(result.error));
        setSubmitting(false);
        return;
      }

      if (!result.data?.saveShippingAddress?.success) {
        setError(
          result.data?.saveShippingAddress?.message ||
            "Failed to save shipping address"
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
          Add new pickup address
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Provide your shipping preferences and pickup address details.
        </p>

        {feedback && (
          <StepFeedbackAlert 
            feedback={feedback.feedback}
            resubmitted={feedback.resubmitted}
          />
        )}

        <Formik
          initialValues={{
            pincode: initialValues?.pincode || "",
            city: initialValues?.city || "",
            state: initialValues?.state || "",
            address: initialValues?.address || "",
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

              <div className="border border-teal-600 rounded-lg p-6">
                <Input
                  label="Pincode"
                  name="pincode"
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={values.pincode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={errors.pincode}
                  touched={touched.pincode}
                  required
                  disabled={isSubmitting}
                />

                <div className="mt-4">
                  <Input
                    label="City"
                    name="city"
                    type="text"
                    placeholder="Enter city name"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={errors.city}
                    touched={touched.city}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="mt-4">
                  <Select
                    label="State"
                    name="state"
                    value={values.state}
                    options={INDIAN_STATES}
                    onChange={(value) => {
                      handleChange({ target: { name: "state", value } });
                    }}
                    onBlur={handleBlur}
                    placeholder="Select state"
                    required
                    disabled={isSubmitting}
                    error={errors.state}
                    touched={touched.state}
                    searchable={true}
                  />
                </div>

                <div className="mt-4">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Area, Street, Building No.
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    rows={3}
                    placeholder="Enter address such as area name, building number, door number, etc."
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={isSubmitting}
                    className={`w-full px-4 py-3 rounded-lg border transition-colors duration-200 ${
                      touched.address && errors.address
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                    } focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none`}
                  />
                  {touched.address && errors.address && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.address}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4">
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
