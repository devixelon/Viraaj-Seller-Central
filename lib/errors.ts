/**
 * Utility function to extract error message from GraphQL error
 * @param error - The error object from GraphQL mutation/query
 * @returns The extracted error message string
 */
export const getErrorMessage = (error: any): string => {
  // Check for GraphQL errors array
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    return error.graphQLErrors[0].message;
  }
  // Check for network errors
  if (error.networkError) {
    return "Network error. Please check your connection.";
  }
  // Fallback to error message or default
  return error.message || "An unexpected error occurred. Please try again.";
};
