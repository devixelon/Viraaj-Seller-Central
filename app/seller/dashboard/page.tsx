"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userStorage, isAuthenticated, logout } from "@/lib/auth";
import Logo from "@/components/icons/Logo";
import UserIcon from "@/components/icons/UserIcon";
import CheckCircleIcon from "@/components/icons/CheckCircleIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import ShoppingBagIcon from "@/components/icons/ShoppingBagIcon";
import ChartBarIcon from "@/components/icons/ChartBarIcon";
import { LoadingSpinner } from "@/components/ui";
import { SELLER_APPLICATION_STATUS } from "@/graphql/queries/sellerApplicationStatus";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { APPLICATION_STATUS } from "@/lib/constant";

export default function SellerDashboardPage() {
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

          // If status is no longer APPROVED, redirect to appropriate page
          if (status !== APPLICATION_STATUS.APPROVED) {
            switch (status) {
              case APPLICATION_STATUS.PENDING:
                router.push("/application/pending");
                break;
              case APPLICATION_STATUS.REJECTED:
                router.push("/application/rejected");
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
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <CheckCircleIcon className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                Your seller account is active! You can now start adding
                products.
              </h2>
              <p className="text-sm text-gray-600">
                Welcome to Viraaj Seller Portal. Your account has been approved
                and you can start listing your products.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
              <PlusIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add Product
            </h3>
            <p className="text-sm text-gray-600">
              Start listing your products to reach customers
            </p>
          </button>

          <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <ShoppingBagIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Manage Orders
            </h3>
            <p className="text-sm text-gray-600">
              View and manage your customer orders
            </p>
          </button>

          <button className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <ChartBarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              View Analytics
            </h3>
            <p className="text-sm text-gray-600">
              Track your sales and performance metrics
            </p>
          </button>
        </div>

        {/* Account Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Account Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Email
              </label>
              <p className="text-base text-gray-900">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Account Status
              </label>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
