import {AUTH_TOKEN} from '../types';

export function setAuthToken(token: string) {
  return {
    type: AUTH_TOKEN,
    payload: token,
  };
}
