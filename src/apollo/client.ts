import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  TypePolicies,
} from '@apollo/client/core';
import { Operation } from '@apollo/client/core';

import { settingsVar, authVar } from './vars';

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      appSettings() {
        return settingsVar();
      },
    },
  },
};

function hasAllVariables(operation: Operation): boolean {
  return !Object.values(operation.variables).some((variable) => !variable);
}

const graphqlURLAppend = '/api/graphql';

const checkVarsLink = new ApolloLink((operation, forwards) => {
  return hasAllVariables(operation) ? forwards(operation) : null;
});

const authLink = new ApolloLink((operation, forwards) => {
  const auth = authVar();
  if (!auth.accessToken) return null;

  operation.setContext({
    headers: {
      Authorization: auth.accessToken && 'Bearer ' + auth.accessToken,
    },
  });
  return forwards(operation);
});

const httpLink = new HttpLink({
  uri() {
    const settings = settingsVar();

    try {
      return new URL(graphqlURLAppend, settings.url).href;
    } catch (error) {
      console.error(error.message);
      return 'http://example.com';
    }
  },
});

const link = ApolloLink.from([checkVarsLink, authLink, httpLink]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache({ typePolicies }),
});
