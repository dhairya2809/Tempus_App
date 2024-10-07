import {
  CHECKED_IN_DATA,
  CHECKED_OUT_DATA,
  COMPANY_DATA,
  CURRENT_LANG,
  EMPLOYEE_DATA,
  INTERNET_STATE,
  IS_LOGGED_IN,
  SHOW_LANG_MODAL,
  USER_CREDENTIALS,
  VERIFICATION_TOKEN,
} from '../types';

const initialState = {
  internetState: true,
  employeeData: {},
  companyData: {},
  verificationToken: '',
  checkedInData: {},
  checkedOutData: {},
  isLoggedIn: false,
  userCredentials: {},
  showLangModal: false,
  currentLang: '',
};

const CommanReducer = (
  state = initialState,
  action: {type: any; payload: any},
) => {
  switch (action.type) {
    case INTERNET_STATE:
      return {
        ...state,
        internetState: action.payload,
      };
    case EMPLOYEE_DATA:
      return {
        ...state,
        employeeData: action.payload,
      };
    case COMPANY_DATA:
      return {
        ...state,
        companyData: action.payload,
      };
    case VERIFICATION_TOKEN:
      return {
        ...state,
        verificationToken: action.payload,
      };
    case CHECKED_IN_DATA:
      return {
        ...state,
        checkedInData: action.payload,
      };
    case CHECKED_OUT_DATA:
      return {
        ...state,
        checkedOutData: action.payload,
      };
    case IS_LOGGED_IN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case USER_CREDENTIALS:
      return {
        ...state,
        userCredentials: action.payload,
      };
    case SHOW_LANG_MODAL:
      return {
        ...state,
        showLangModal: action.payload,
      };
    case CURRENT_LANG:
      return {
        ...state,
        currentLang: action.payload,
      };
    default:
      return state;
  }
};

export default CommanReducer;
