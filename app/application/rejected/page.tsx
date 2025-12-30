"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStorage, isAuthenticated, logout } from "@/lib/auth";
import Logo from "@/components/icons/Logo";
import UserIcon from "@/components/icons/UserIcon";
import XIcon from "@/components/icons/XIcon";
import { SELLER_APPLICATION_STATUS } from "@/graphql/queries/sellerApplicationStatus";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { APPLICATION_STATUS } from "@/lib/constant";

export default function ApplicationRejectedPage() {
  const [user, setUser] = useState<any>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

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

    // Check status periodically every 30 seconds
    const checkStatus = async () => {
      try {
        const result = await refetchStatus();
        if (result.data?.sellerApplicationStatus) {
          const status = result.data.sellerApplicationStatus.status;
          
          // If status is no longer REJECTED, redirect to appropriate page
          if (status !== APPLICATION_STATUS.REJECTED) {
            switch (status) {
              case APPLICATION_STATUS.APPROVED:
                router.push("/seller/dashboard");
                break;
              case APPLICATION_STATUS.PENDING:
                router.push("/application/pending");
                break;
              case APPLICATION_STATUS.DRAFT:
              default:
                router.push("/onboarding");
                break;
            }
          }
        }
      } catch (error) {
        console.error("Error checking application status:", error);
      }
    };

    // Initial check
    checkStatus();

    // Set up polling interval (every 30 seconds)
    const intervalId = setInterval(checkStatus, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [router, refetchStatus]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user) {
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
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo />
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
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

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-8 text-center">
          <XIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Application Rejected
          </h2>
          <p className="text-gray-600 mb-6">
            Unfortunately, your seller application has been rejected. You can
            resubmit your application with updated details or contact our support team for
            assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/onboarding")}
              className="px-6 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors duration-200"
            >
              Resubmit Application
            </button>
            <button
              onClick={() => window.open("mailto:support@viraaj.in", "_blank")}
              className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
