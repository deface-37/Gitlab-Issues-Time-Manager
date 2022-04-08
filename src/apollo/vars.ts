import { makeVar } from '@apollo/client/core';
import { getSettings } from '../localStorage/settings';

interface AuthInfo {
  accessToken?: string;
  isLoggedIn?: boolean;
  refreshToken?: string;
}

export const settingsVar = makeVar(getSettings());
export const authVar = makeVar<AuthInfo>({ isLoggedIn: false });
