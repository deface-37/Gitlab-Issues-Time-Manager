import { ApolloQueryController, ApolloQueryControllerOptions } from '@apollo-elements/core';
import { client } from './client';
import { ComponentDocument, VariablesOf } from '@apollo-elements/core/types';
import { ReactiveControllerHost } from 'lit';

export const queryControllerWithClient = <D, V = VariablesOf<D>>(
  host: ReactiveControllerHost,
  query: ComponentDocument<D, V>,
  options?: ApolloQueryControllerOptions<D, V>
) => {
  const currentOptions = Object.assign({ client }, options);
  return new ApolloQueryController(host, query, currentOptions);
};
