import { makeVar } from '@apollo/client/core';
import { getSettings } from '../localStorage/settings';

export const settingsVar = makeVar(getSettings());
