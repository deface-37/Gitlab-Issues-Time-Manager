import { ApolloClient, NormalizedCacheObject } from '@apollo/client/core';

declare global {
  interface Window {
    __APOLLO_CLIENT__: ApolloClient<NormalizedCacheObject>;
  }
}
