import {
  EMPLOYEE_DATA,
  INTERNET_STATE,
  COMPANY_DATA,
  VERIFICATION_TOKEN,
  CHECKED_IN_DATA,
  CHECKED_OUT_DATA,
  USER_CREDENTIALS,
  IS_LOGGED_IN,
  SHOW_LANG_MODAL,
  CURRENT_LANG,
} from '../types';

export function setInternetState(state: boolean) {
  return {
    type: INTERNET_STATE,
    payload: state,
  };
}

export function setEmployeeData(data: any) {
  return {
    type: EMPLOYEE_DATA,
    payload: data,
  };
}

export function setCompanyData(data: any) {
  return {
    type: COMPANY_DATA,
    payload: data,
  };
}

export function setVerificationToken(data: string) {
  return {
    type: VERIFICATION_TOKEN,
    payload: data,
  };
}

export function setCheckedInData(data: any) {
  return {
    type: CHECKED_IN_DATA,
    payload: data,
  };
}
export function setCheckedOutData(data: any) {
  return {
    type: CHECKED_OUT_DATA,
    payload: data,
  };
}

export function setIsLoggedIn(data: boolean) {
  return {
    type: IS_LOGGED_IN,
    payload: data,
  };
}
export function setUserCredentials(data: any) {
  return {
    type: USER_CREDENTIALS,
    payload: data,
  };
}
export function setLangModalState(show: boolean) {
  return {
    type: SHOW_LANG_MODAL,
    payload: show,
  };
}
export function setCurrentLanguage(code: string) {
  return {
    type: CURRENT_LANG,
    payload: code,
  };
}
