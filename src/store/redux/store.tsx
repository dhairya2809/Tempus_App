import {combineReducers} from 'redux';
import {configureStore} from '@reduxjs/toolkit';
import authReducer from './reducers/AuthReducer';
import commanReducer from './reducers/CommanReducer';

const store = () =>
  configureStore({
    reducer: combineReducers({
      token: authReducer,
      state: commanReducer,
    }),
  });

export default store;
