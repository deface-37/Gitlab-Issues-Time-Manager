import '@apollo-elements/components/apollo-client';
import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client/core';
import { Operation } from '@apollo/client/core';

function hasAllVariables(operation: Operation): boolean {
  return !Object.values(operation.variables).some((variable) => !variable);
}

const graphqlURLAppend = '/api/graphql';

const checkVarsLink = new ApolloLink((operation, forwards) => {
  return hasAllVariables(operation) ? forwards(operation) : null;
});

export function getNewClient(baseUrl: string, token: string) {
  let url: string;
  try {
    url = new URL(graphqlURLAppend, baseUrl).toString();
  } catch (e) {
    console.error(e.message);
    return null;
  }
  const link = ApolloLink.from([
    checkVarsLink,
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
