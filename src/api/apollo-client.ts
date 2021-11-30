import '@apollo-elements/components/apollo-client';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import { hasAllVariables } from '@apollo-elements/core/lib/has-all-variables';

const graphqlAppend = '/api/graphql';

export function getNewClient(baseUrl: string, token: string) {
  let url: string;
  try {
    url = new URL(graphqlAppend, baseUrl).toString();
  } catch (e) {
    console.error(e.message);
    return null;
  }
  const link = ApolloLink.from([
    new ApolloLink((operation, forwards) => {
      return hasAllVariables(operation) ? forwards(operation) : null;
    }),
    new HttpLink({
      uri: url,
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
