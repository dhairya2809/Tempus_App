/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import NetInfo from '@react-native-community/netinfo';
import {useDispatch} from 'react-redux';
import {setInternetState} from '@store/redux/actions/Comman';
import {ToastHandler} from './ToastController';
import {localiseString} from '@src/locales';
import SensitiveStorage from '@src/store/sensitive/SensitiveStorage';
import {IResponse} from '@src/services/Common';
import {postAPI} from '@src/services/API';
import EndPoints from '@src/services/EndPoints';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '@src/constants';

function InternetHandler() {
  const dispatch = useDispatch();
  const [isConnected, setIsConnected] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = async () => {
      NetInfo.addEventListener(state => {
        setIsConnected(Boolean(state.isConnected));
        console.log('Network Connected', state.isConnected);
        if (!state.isConnected) {
          ToastHandler.showToast(
            'warning',
            localiseString('general.noInternet'),
          );
        }
        //When internet connected, offline saved data should sync to server.
        dispatch(setInternetState(Boolean(state.isConnected)));
      });
    };

    unsubscribe();

    return () => {
      unsubscribe();
    };
  }, []);

  // Call your background task function when the connection status changes
  React.useEffect(() => {
    if (isConnected) {
      performBackgroundTask();
    }
  }, [isConnected]);

  // Your function to make API calls and remove data from AsyncStorage
  async function performBackgroundTask() {
    try {
      const storedData = await AsyncStorage.getItem(
        Constants.LocalStorageKeys.OFFLINE_DATA,
      );
      if (storedData) {
        const dataArray = JSON.parse(storedData);

        for (const dataItem of dataArray) {
          const result = await makeApiCall(dataItem);
          // Remove data from AsyncStorage if the API call was successful
          if (result.success) {
            await removeDataFromStorage(dataItem);
          }
        }
      }
    } catch (error) {
      // Handle errors if any
      console.log(error);
    }
  }

  async function makeApiCall(data: any) {
    try {
      const token = await SensitiveStorage.getCreds();
      const body: any = {
        coordinates: data?.coordinates,
        type: data?.type,
        timestamp: data?.timestamp,
        token: token?.password,
      };
      const response: IResponse = await postAPI(EndPoints.CHECK_IN_OUT, body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async function removeDataFromStorage(data: any) {
    try {
      const storedData = await AsyncStorage.getItem(
        Constants.LocalStorageKeys.OFFLINE_DATA,
      );
      if (storedData) {
        const dataArray = JSON.parse(storedData);
        const newDataArray = dataArray.filter(
          (item: any) => item.timestamp !== data.timestamp,
        );
        await AsyncStorage.setItem(
          Constants.LocalStorageKeys.OFFLINE_DATA,
          JSON.stringify(newDataArray),
        );
      }
    } catch (error) {
      console.error(error);
    }
  }

  return null;
}

export default InternetHandler;
