"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { SELLER_APPLICATION_STATUS } from "@/graphql/queries/sellerApplicationStatus";
import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { APPLICATION_STATUS } from "@/lib/constant";

export default function DashboardPage() {
  const router = useRouter();

  const { refetch: refetchStatus } = useGraphQLQuery(
    SELLER_APPLICATION_STATUS,
    {
      skip: true,
    }
  );

  useEffect(() => {
    const checkStatusAndRedirect = async () => {
      if (!isAuthenticated()) {
        router.push("/auth");
        return;
      }

      try {
        const result = await refetchStatus();

        if (result.data?.sellerApplicationStatus) {
          const status = result.data.sellerApplicationStatus.status;

          // Redirect based on application status
          switch (status) {
            case APPLICATION_STATUS.APPROVED:
              router.push("/seller/dashboard");
              break;
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
        } else {
          // No status found, redirect to onboarding
          router.push("/onboarding");
        }
      } catch (error) {
        console.error("Error checking application status:", error);
        router.push("/onboarding");
      }
    };

    checkStatusAndRedirect();
  }, [router, refetchStatus]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
