import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";
import { ErrorLink } from "@apollo/client/link/error";

/*
    Create Apollo Client instance
*/
function createApolloClient() {
  /*
      Error handling link
  */
  const errorLink = new ErrorLink(({ graphQLErrors, networkError }: any) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }: any) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  /*
      HTTP link to your Django GraphQL endpoint
  */
  const httpLink = new HttpLink({
    uri:
      process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT ||
      "http://localhost:8000/graphql/",
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
    },
  });

  /*
      Apollo Client instance
  */
  return new ApolloClient({
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        // Add type policies here if needed for cache normalization
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
        errorPolicy: "all",
      },
      query: {
        fetchPolicy: "network-only",
        errorPolicy: "all",
      },
      mutate: {
        errorPolicy: "all",
      },
    },
  });
}

let client: ApolloClient | null = null;

export default function getClient() {
  // Create the client once
  if (!client) {
    client = createApolloClient();
  }

  return client;
}
