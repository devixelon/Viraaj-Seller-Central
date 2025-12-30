'use client';

import { OperationVariables } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';
import { DocumentNode } from 'graphql';

/**
 * Custom hook wrapper for Apollo useQuery with TypeScript support
 * @param query - GraphQL query document
 * @param options - Query options
 */
export function useGraphQLQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode,
  options?: Parameters<typeof useQuery<TData, TVariables>>[1]
) {
  return useQuery<TData, TVariables>(query, options as any);
}

/**
 * Custom hook wrapper for Apollo useMutation with TypeScript support
 * @param mutation - GraphQL mutation document
 * @param options - Mutation options
 */
export function useGraphQLMutation<TData = any, TVariables extends OperationVariables = OperationVariables>(
  mutation: DocumentNode,
  options?: Parameters<typeof useMutation<TData, TVariables>>[1]
) {
  return useMutation<TData, TVariables>(mutation, options as any);
}
