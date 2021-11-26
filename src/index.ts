import './style.scss';
import './App';
import { client } from './api/apollo-client';

window.__APOLLO_CLIENT__ = client;
