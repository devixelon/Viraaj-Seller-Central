# GraphQL Implementation Guide

## Overview

This directory contains GraphQL queries, mutations, and related utilities for communicating with the Django GraphQL backend.

## Directory Structure

```
graphql/
├── queries/       # GraphQL queries
├── mutations/     # GraphQL mutations
└── README.md      # This file
```

## Setup

1. **Environment Variables**: Create a `.env.local` file in the root directory:

   ```
   NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
   ```

2. **Apollo Provider**: The Apollo Provider is configured in the root layout to wrap the entire application.

## Usage

### Using Queries

```typescript
"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { GET_EXAMPLE_DATA } from "@/graphql/queries/example";

function MyComponent() {
  const { data, loading, error } = useGraphQLQuery(GET_EXAMPLE_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{/* Render your data */}</div>;
}
```

### Using Queries with Variables

```typescript
"use client";

import { useGraphQLQuery } from "@/hooks/useGraphQL";
import { GET_ITEM_BY_ID } from "@/graphql/queries/example";

function MyComponent({ id }: { id: string }) {
  const { data, loading, error } = useGraphQLQuery(GET_ITEM_BY_ID, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <div>{/* Render your data */}</div>;
}
```

### Using Mutations

```typescript
"use client";

import { useGraphQLMutation } from "@/hooks/useGraphQL";
import { CREATE_EXAMPLE } from "@/graphql/mutations/example";

function MyComponent() {
  const [createExample, { data, loading, error }] =
    useGraphQLMutation(CREATE_EXAMPLE);

  const handleSubmit = async (formData: any) => {
    try {
      const result = await createExample({
        variables: { input: formData },
      });
      console.log("Success:", result.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return <form onSubmit={handleSubmit}>{/* Your form fields */}</form>;
}
```

### Direct Client Usage (Server Components)

For server components or API routes:

```typescript
import client from "@/lib/apollo-client";
import { GET_EXAMPLE_DATA } from "@/graphql/queries/example";

async function getData() {
  const { data } = await client.query({
    query: GET_EXAMPLE_DATA,
  });
  return data;
}
```

## Authentication

If your Django backend requires authentication:

1. **Token-based Auth**: Add the token to request headers in `lib/apollo-client.ts`:

   ```typescript
   const httpLink = new HttpLink({
     uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
     headers: {
       authorization: `Bearer ${token}`,
     },
   });
   ```

2. **Cookie-based Auth**: The client is already configured with `credentials: 'include'`.

## Best Practices

1. **Organize Queries/Mutations**: Group related queries and mutations in separate files
2. **Type Safety**: Define TypeScript interfaces for your GraphQL responses
3. **Error Handling**: Always handle loading and error states
4. **Caching**: Leverage Apollo's cache for better performance
5. **Fragments**: Use GraphQL fragments for reusable field selections

## Example with TypeScript Types

```typescript
// Define your types
interface User {
  id: string;
  name: string;
  email: string;
}

interface GetUsersResponse {
  users: User[];
}

// Use with hooks
const { data, loading, error } = useGraphQLQuery<GetUsersResponse>(GET_USERS);
```

## Resources

- [Apollo Client Documentation](https://www.apollographql.com/docs/react/)
- [GraphQL Documentation](https://graphql.org/learn/)
- [Django GraphQL (Graphene)](https://docs.graphene-python.org/en/latest/)
