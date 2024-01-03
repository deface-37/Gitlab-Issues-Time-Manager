import { createContext } from '@lit/context';
import type { AuthFlow } from 'src/auth/authFlow';
export type { AuthFlow } from 'src/auth/authFlow';

export const authContext = createContext<AuthFlow>(Symbol('authFlow'));
