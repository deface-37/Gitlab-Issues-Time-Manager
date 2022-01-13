import '@apollo-elements/components/apollo-client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
  TypePolicies,
} from '@apollo/client/core';
import { Operation } from '@apollo/client/core';

import { settingsVar } from '../vars/settings-var';

const typePolicies: TypePolicies = {
  Query: {
    fields: {
      myGroupName() {
        const settings = settingsVar();
        return settings.groupName;
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
  const settings = settingsVar();
  operation.setContext((prevContext: any) => ({
    headers: {
      'PRIVATE-TOKEN': settings.personalToken,
      ...prevContext.headers,
    },
  }));
  return forwards(operation);
});

export function getNewClient(baseUrl: string) {
  let url: string;
  try {
    url = new URL(graphqlURLAppend, baseUrl).toString();
  } catch (e) {
    console.error(e.message);
    return null;
  }

  const link = ApolloLink.from([
    checkVarsLink,
    authLink,
    new HttpLink({
      uri: url,
    }),
  ]);

  return new ApolloClient({
    link,
    cache: new InMemoryCache({ typePolicies }),
  });
}
