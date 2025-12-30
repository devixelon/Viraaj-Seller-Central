"use client";

import React from "react";
import InfoCircleIcon from "@/components/icons/InfoCircleIcon";
import WarningTriangleIcon from "@/components/icons/WarningTriangleIcon";

interface FeedbackItem {
  step: number;
  needsCorrection: boolean;
  feedback: string;
  resubmitted: boolean;
}

interface FeedbackBannerProps {
  pendingFeedback: FeedbackItem[];
  onNavigateToStep: (step: number) => void;
}

const stepNames: { [key: number]: string } = {
  2: "Tax Details (GST/PAN)",
  3: "Store Name",
  4: "Shipping Address",
  5: "Bank Details",
};

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  pendingFeedback,
  onNavigateToStep,
}) => {
  if (!pendingFeedback || pendingFeedback.length === 0) {
    return null;
  }

  const activeCorrections = pendingFeedback.filter((fb) => !fb.resubmitted);

  if (activeCorrections.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mb-8">
        <div className="bg-blue-50 border-2 border-blue-400 rounded-lg p-6">
          <div className="flex items-start">
            <InfoCircleIcon className="w-6 h-6 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Corrections Submitted
              </h3>
              <p className="text-sm text-gray-600">
                Your corrections have been submitted and are being reviewed by
                our team.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
        <div className="flex items-start mb-4">
          <WarningTriangleIcon className="w-6 h-6 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Corrections Required
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Your application needs corrections in {activeCorrections.length}{" "}
              step (s). Please review the feedback below and resubmit.
            </p>

            <div className="space-y-3">
              {activeCorrections.map((fb) => (
                <div
                  key={fb.step}
                  className="bg-white border border-yellow-300 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Step {fb.step}:{" "}
                        {stepNames[fb.step] || `Step ${fb.step}`}
                      </h4>
                      <p className="text-sm text-gray-700">{fb.feedback}</p>
                    </div>
                    <button
                      onClick={() => onNavigateToStep(fb.step)}
                      className="ml-4 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200 whitespace-nowrap"
                    >
                      Fix Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
