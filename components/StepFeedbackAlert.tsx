"use client";

import React from "react";
import InfoCircleIcon from "@/components/icons/InfoCircleIcon";
import AlertCircleIcon from "@/components/icons/AlertCircleIcon";

interface StepFeedbackAlertProps {
  feedback: string;
  resubmitted?: boolean;
}

export const StepFeedbackAlert: React.FC<StepFeedbackAlertProps> = ({
  feedback,
  resubmitted = false,
}) => {
  if (!feedback) {
    return null;
  }

  if (resubmitted) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
        <div className="flex items-start">
          <InfoCircleIcon className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Awaiting Review
            </h4>
            <p className="text-sm text-blue-700">
              Your corrections have been submitted and are being reviewed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
      <div className="flex items-start">
        <AlertCircleIcon className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-red-900 mb-1">
            Correction Required
          </h4>
          <p className="text-sm text-red-700">{feedback}</p>
        </div>
      </div>
    </div>
  );
};
