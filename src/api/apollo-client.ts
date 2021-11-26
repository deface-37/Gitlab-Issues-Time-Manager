import '@apollo-elements/components/apollo-client';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';
import api from './api.json';

export const client = new ApolloClient({
  uri: api.url,
  cache: new InMemoryCache(),
  headers: {
    'PRIVATE-TOKEN': api.token,
  },
});
