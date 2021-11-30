import '@apollo-elements/components/apollo-client';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import { hasAllVariables } from '@apollo-elements/core/lib/has-all-variables';

const graphqlAppend = '/api/graphql';

export function getNewClient(baseUrl: string, token: string) {
  const url = new URL(graphqlAppend, baseUrl);

  const link = ApolloLink.from([
    new ApolloLink((operation, forwards) => {
      return hasAllVariables(operation) ? forwards(operation) : null;
    }),
    new HttpLink({
      uri: url.toString(),
      headers: {
        'PRIVATE-TOKEN': token,
      },
    }),
  ]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
}
