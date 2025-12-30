import React, { FC } from "react";
import CheckIcon from "@/components/icons/CheckIcon";

interface Step {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface StepperProps {
  steps: Step[];
}

export const Stepper: FC<StepperProps> = ({ steps }) => {
  return (
    <div className="w-full bg-white border-b border-gray-200 py-6">
      <div className="max-w-5xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="relative">
          <div className="absolute top-5 left-0 w-full h-1 bg-gray-200">
            <div
              className="h-full bg-teal-600 transition-all duration-300"
              style={{
                width: `${((steps.filter((s) => s.completed).length) / (steps.length - 1)) * 100}%`,
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-200 ${
                    step.completed
                      ? "bg-teal-600 border-teal-600"
                      : step.active
                      ? "bg-white border-teal-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {step.completed ? (
                    <CheckIcon className="w-5 h-5 text-white" />
                  ) : step.active ? (
                    <div className="w-3 h-3 rounded-full bg-teal-600"></div>
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center max-w-[120px]">
                  <p
                    className={`text-xs font-medium ${
                      step.active || step.completed
                        ? "text-gray-900"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
