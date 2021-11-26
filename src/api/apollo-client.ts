import '@apollo-elements/components/apollo-client';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client/core';
import { hasAllVariables } from '@apollo-elements/core/lib/has-all-variables';

import api from './api.json';

const link = ApolloLink.from([
  new ApolloLink((operation, forwards) => {
    return hasAllVariables(operation) && forwards(operation);
  }),
  new HttpLink({
    uri: api.url,
    headers: {
      'PRIVATE-TOKEN': api.token,
    },
  }),
]);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
