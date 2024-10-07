import {AUTH_TOKEN} from '../types';

const initialState = {
  token: '',
};
const authTokenReducer = (
  state = initialState,
  action: {type: any; payload: any},
) => {
  switch (action.type) {
    case AUTH_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      return state;
  }
};
export default authTokenReducer;
