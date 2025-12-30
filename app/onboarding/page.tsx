"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStorage, isAuthenticated, logout } from "@/lib/auth";
import { Stepper } from "@/components/ui";
import {
  GSTStep,
  StoreNameStep,
  ShippingStep,
  BankDetailsStep,
} from "@/components/onboarding";
import Logo from "@/components/icons/Logo";
import { SUBMIT_SELLER_APPLICATION } from "@/graphql/mutations/submitSellerApplication";
import { SELLER_APPLICATION_STATUS } from "@/graphql/queries/sellerApplicationStatus";
import { useGraphQLMutation, useGraphQLQuery } from "@/hooks/useGraphQL";
import { FeedbackBanner } from "@/components/FeedbackBanner";
import UserIcon from "@/components/icons/UserIcon";
import { APPLICATION_STATUS } from "@/lib/constant";

const STEPS = [
  { id: 1, title: "Seller account creation", completed: true, active: false },
  { id: 2, title: "Verify tax details", completed: false, active: true },
  { id: 3, title: "Store name", completed: false, active: false },
  {
    id: 4,
    title: "Shipping preferences & Pickup address",
    completed: false,
    active: false,
  },
  { id: 5, title: "Bank details", completed: false, active: false },
];

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(2);
  const [steps, setSteps] = useState(STEPS);
  const [formData, setFormData] = useState<any>({});
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pendingFeedback, setPendingFeedback] = useState<any[]>([]);
  const [hasPendingCorrections, setHasPendingCorrections] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const router = useRouter();

  const [submitApplication] = useGraphQLMutation(SUBMIT_SELLER_APPLICATION);
  const { refetch: refetchStatus } = useGraphQLQuery(
    SELLER_APPLICATION_STATUS,
    {
      skip: true,
    }
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/auth");
      return;
    }

    const userData = userStorage.getUser();
    setUser(userData);

    // Check status and redirect if necessary
    const checkStatusAndFeedback = async () => {
      try {
        const result = await refetchStatus();

        if (result.data?.sellerApplicationStatus) {
          const {
            status,
            hasPendingCorrections: hasPending,
            pendingFeedback: feedback,
            currentStep: backendStep,
          } = result.data.sellerApplicationStatus;

          // Redirect based on status - only DRAFT should be on onboarding
          if (status === APPLICATION_STATUS.APPROVED) {
            router.push("/seller/dashboard");
            return;
          } else if (status === APPLICATION_STATUS.PENDING) {
            router.push("/application/pending");
            return;
          } else if (status === APPLICATION_STATUS.REJECTED) {
            router.push("/application/rejected");
            return;
          }

          // If status is DRAFT, continue with onboarding
          setHasPendingCorrections(hasPending);
          setPendingFeedback(feedback || []);

          // If there are pending corrections, navigate to the first step that needs correction
          if (hasPending && feedback && feedback.length > 0) {
            const firstStepToFix = Math.min(
              ...feedback.map((fb: any) => fb.step)
            );
            setCurrentStep(firstStepToFix);
            updateSteps(firstStepToFix);
          } else if (backendStep && backendStep >= 2) {
            // Otherwise, navigate to current step from backend (minimum step 2)
            setCurrentStep(backendStep);
            updateSteps(backendStep);
          } else {
            // If no backend step or step is less than 2, start at step 2
            setCurrentStep(2);
            updateSteps(2);
          }
        }
      } catch (error) {
        console.error("Error checking status:", error);
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatusAndFeedback();
  }, [router, refetchStatus]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const updateSteps = (stepNumber: number) => {
    setSteps((prevSteps) =>
      prevSteps.map((step) => {
        // Check if this step has pending feedback
        const stepFeedback = pendingFeedback.find(
          (fb) => fb.step === step.id && fb.needsCorrection && !fb.resubmitted
        );

        return {
          ...step,
          completed: step.id < stepNumber,
          active: step.id === stepNumber,
          hasError: !!stepFeedback,
        };
      })
    );
  };

  const handleGSTNext = async (values: any) => {
    setFormData({ ...formData, gst: values });
    
    // If there are pending corrections, check status after this step
    if (hasPendingCorrections) {
      // After saving this step, check if all corrections are done
      const statusResult = await refetchStatus();
      
      if (statusResult.data?.sellerApplicationStatus) {
        const { status, pendingFeedback: updatedFeedback } = statusResult.data.sellerApplicationStatus;
        
        // If backend has marked as PENDING (all corrections done), redirect
        if (status === APPLICATION_STATUS.PENDING) {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
          return;
        } else if (status === APPLICATION_STATUS.APPROVED) {
          alert("Application approved! Redirecting to your dashboard.");
          router.push("/seller/dashboard");
          return;
        }
        
        // Update feedback state
        setPendingFeedback(updatedFeedback || []);
      }
      
      // Find the next step that needs correction (after step 2)
      const nextCorrectionStep = pendingFeedback
        .filter((fb) => fb.step > 2 && fb.needsCorrection && !fb.resubmitted)
        .sort((a, b) => a.step - b.step)[0];
      
      if (nextCorrectionStep) {
        // Navigate to next step needing correction
        setCurrentStep(nextCorrectionStep.step);
        updateSteps(nextCorrectionStep.step);
      } else {
        // No more corrections needed, check status one more time
        const finalCheck = await refetchStatus();
        if (finalCheck.data?.sellerApplicationStatus?.status === "PENDING") {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
        } else {
          setCurrentStep(5);
          updateSteps(5);
        }
      }
    } else {
      // Normal flow - go to next step
      setCurrentStep(3);
      updateSteps(3);
    }
  };

  const handleStoreNameNext = async (values: any) => {
    setFormData({ ...formData, storeName: values });
    
    // If there are pending corrections, check status after this step
    if (hasPendingCorrections) {
      // After saving this step, check if all corrections are done
      const statusResult = await refetchStatus();
      
      if (statusResult.data?.sellerApplicationStatus) {
        const { status, pendingFeedback: updatedFeedback } = statusResult.data.sellerApplicationStatus;
        
        // If backend has marked as PENDING (all corrections done), redirect
        if (status === APPLICATION_STATUS.PENDING) {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
          return;
        } else if (status === APPLICATION_STATUS.APPROVED) {
          alert("Application approved! Redirecting to your dashboard.");
          router.push("/seller/dashboard");
          return;
        }
        
        // Update feedback state
        setPendingFeedback(updatedFeedback || []);
      }
      
      // Find the next step that needs correction (after step 3)
      const nextCorrectionStep = pendingFeedback
        .filter((fb) => fb.step > 3 && fb.needsCorrection && !fb.resubmitted)
        .sort((a, b) => a.step - b.step)[0];
      
      if (nextCorrectionStep) {
        // Navigate to next step needing correction
        setCurrentStep(nextCorrectionStep.step);
        updateSteps(nextCorrectionStep.step);
      } else {
        // No more corrections needed, check status one more time
        const finalCheck = await refetchStatus();
        if (finalCheck.data?.sellerApplicationStatus?.status === "PENDING") {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
        } else {
          setCurrentStep(5);
          updateSteps(5);
        }
      }
    } else {
      // Normal flow - go to next step
      setCurrentStep(4);
      updateSteps(4);
    }
  };

  const handleShippingNext = async (values: any) => {
    setFormData({ ...formData, shipping: values });
    
    // If there are pending corrections, check status after this step
    if (hasPendingCorrections) {
      // After saving this step, check if all corrections are done
      const statusResult = await refetchStatus();
      
      if (statusResult.data?.sellerApplicationStatus) {
        const { status, pendingFeedback: updatedFeedback } = statusResult.data.sellerApplicationStatus;
        
        // If backend has marked as PENDING (all corrections done), redirect
        if (status === APPLICATION_STATUS.PENDING) {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
          return;
        } else if (status === APPLICATION_STATUS.APPROVED) {
          alert("Application approved! Redirecting to your dashboard.");
          router.push("/seller/dashboard");
          return;
        }
        
        // Update feedback state
        setPendingFeedback(updatedFeedback || []);
      }
      
      // Find the next step that needs correction (after step 4)
      const nextCorrectionStep = pendingFeedback
        .filter((fb) => fb.step > 4 && fb.needsCorrection && !fb.resubmitted)
        .sort((a, b) => a.step - b.step)[0];
      
      if (nextCorrectionStep) {
        // Navigate to next step needing correction
        setCurrentStep(nextCorrectionStep.step);
        updateSteps(nextCorrectionStep.step);
      } else {
        // No more corrections needed, check status one more time
        const finalCheck = await refetchStatus();
        if (finalCheck.data?.sellerApplicationStatus?.status === "PENDING") {
          alert("All corrections submitted successfully! Your application is under review.");
          router.push("/application/pending");
        } else {
          setCurrentStep(5);
          updateSteps(5);
        }
      }
    } else {
      // Normal flow - go to next step
      setCurrentStep(5);
      updateSteps(5);
    }
  };

  const handleBankDetailsNext = async (values: any) => {
    setFormData({ ...formData, bankDetails: values });

    // Check if there are any pending corrections before submitting
    if (hasPendingCorrections) {
      alert(
        "Please correct all feedback items before submitting your application."
      );
      return;
    }

    try {
      const result = await submitApplication();

      if (result.data?.submitSellerApplication?.success) {
        // After successful submission, check the current status
        const statusResult = await refetchStatus();
        
        if (statusResult.data?.sellerApplicationStatus) {
          const { status } = statusResult.data.sellerApplicationStatus;
          
          // Redirect based on final status
          if (status === APPLICATION_STATUS.APPROVED) {
            alert("Application approved! Redirecting to your dashboard.");
            router.push("/seller/dashboard");
          } else if (status === APPLICATION_STATUS.PENDING) {
            alert(
              "Application submitted successfully! Your application is under review."
            );
            router.push("/application/pending");
          } else if (status === APPLICATION_STATUS.REJECTED) {
            alert("Application has been rejected. Please check the feedback.");
            router.push("/application/rejected");
          } else {
            // Status is still DRAFT - shouldn't happen but handle gracefully
            alert("Application saved. Please complete all steps.");
          }
        } else {
          // Fallback if status check fails
          alert(
            "Application submitted successfully! Your application is under review."
          );
          router.push("/application/pending");
        }
      } else {
        alert(
          result.data?.submitSellerApplication?.message ||
            "Failed to submit application"
        );
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const handleNavigateToStep = (step: number) => {
    setCurrentStep(step);
    updateSteps(step);
  };

  const handleBack = () => {
    if (currentStep > 2) {
      setCurrentStep(currentStep - 1);
      updateSteps(currentStep - 1);
    }
  };

  if (!user || isCheckingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo className="h-8" />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
            >
              <UserIcon className="w-6 h-6 text-gray-600" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <Stepper steps={steps} />

      <div className="py-8">
        {hasPendingCorrections && (
          <FeedbackBanner
            pendingFeedback={pendingFeedback}
            onNavigateToStep={handleNavigateToStep}
          />
        )}

        {currentStep === 2 && (
          <GSTStep
            onNext={handleGSTNext}
            initialValues={formData.gst}
            feedback={pendingFeedback.find((fb) => fb.step === 2)}
          />
        )}

        {currentStep === 3 && (
          <StoreNameStep
            onNext={handleStoreNameNext}
            onBack={handleBack}
            initialValues={formData.storeName}
            feedback={pendingFeedback.find((fb) => fb.step === 3)}
          />
        )}

        {currentStep === 4 && (
          <ShippingStep
            onNext={handleShippingNext}
            onBack={handleBack}
            initialValues={formData.shipping}
            feedback={pendingFeedback.find((fb) => fb.step === 4)}
          />
        )}

        {currentStep === 5 && (
          <BankDetailsStep
            onNext={handleBankDetailsNext}
            onBack={handleBack}
            initialValues={formData.bankDetails}
            feedback={pendingFeedback.find((fb) => fb.step === 5)}
          />
        )}
      </div>
    </div>
  );
}
