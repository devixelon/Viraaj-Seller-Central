"use client";

import { ReactNode } from "react";
import { ApolloProvider as Provider } from "@apollo/client/react";
import getClient from "./apollo-client";

export function ApolloProvider({ children }: { children: ReactNode }) {
  const client = getClient();
  return <Provider client={client}>{children}</Provider>;
}
