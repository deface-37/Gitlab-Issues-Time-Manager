import { makeVar } from '@apollo/client/core';
import { defaultSettings } from '../localStorage/settings';

interface AuthInfo {
  accessToken?: string;
  isLoggedIn?: boolean;
  refreshToken?: string;
}

export const settingsVar = makeVar(defaultSettings);
export const authVar = makeVar<AuthInfo>({ isLoggedIn: false });
