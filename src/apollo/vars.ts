import { makeVar } from '@apollo/client/core';
import { getSettings } from '../localStorage/settings';

import { AuthInfo } from '../schema'; 

export const settingsVar = makeVar(getSettings());
export const authVar = makeVar<AuthInfo>({ isLoggedIn: false });