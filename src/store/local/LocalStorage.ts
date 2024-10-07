import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from '@src/constants';

//NOTE: UserData Methods
export const persistUserData = async (userInfo: any) => {
  try {
    const data = AsyncStorage.setItem(
      Constants.LocalStorageKeys.USER_DATA,
      JSON.stringify(userInfo),
    );

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const retrieveUserData = async () => {
  try {
    const data: any = await AsyncStorage.getItem(
      Constants.LocalStorageKeys.USER_DATA,
    );
    const rawData = JSON.parse(data);
    return rawData;
  } catch (error) {
    console.log('error', error);
  }
};

export const removeUserData = async () => {
  try {
    const data = await AsyncStorage.removeItem(
      Constants.LocalStorageKeys.USER_DATA,
    );
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

//NOTE: Save checked-in data
export const persistCheckedInData = async (info: any) => {
  try {
    const data = AsyncStorage.setItem(
      Constants.LocalStorageKeys.CHECKED_IN,
      JSON.stringify(info),
    );

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const retrieveCheckedInData = async () => {
  try {
    const data: any = await AsyncStorage.getItem(
      Constants.LocalStorageKeys.CHECKED_IN,
    );
    const rawData = JSON.parse(data);
    return rawData;
  } catch (error) {
    console.log('error', error);
  }
};

export const removeCheckedInData = async () => {
  try {
    const data = await AsyncStorage.removeItem(
      Constants.LocalStorageKeys.CHECKED_IN,
    );
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

//NOTE: Save checked-in data
export const persistCheckedOutData = async (info: any) => {
  try {
    const data = AsyncStorage.setItem(
      Constants.LocalStorageKeys.CHECKED_OUT,
      JSON.stringify(info),
    );

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const retrieveCheckedOutData = async () => {
  try {
    const data: any = await AsyncStorage.getItem(
      Constants.LocalStorageKeys.CHECKED_OUT,
    );
    const rawData = JSON.parse(data);
    return rawData;
  } catch (error) {
    console.log('error', error);
  }
};

export const removeCheckedOutData = async () => {
  try {
    const data = await AsyncStorage.removeItem(
      Constants.LocalStorageKeys.CHECKED_OUT,
    );
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

//NOTE: Offline Tracked Actions List
export const persistOfflineCheckedData = async (info: any) => {
  try {
    const data = AsyncStorage.setItem(
      Constants.LocalStorageKeys.OFFLINE_DATA,
      JSON.stringify(info),
    );

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const retrieveOfflineCheckedData = async () => {
  try {
    const data: any = await AsyncStorage.getItem(
      Constants.LocalStorageKeys.OFFLINE_DATA,
    );
    const rawData = JSON.parse(data);
    return rawData;
  } catch (error) {
    console.log('error', error);
  }
};

export const removeOfflineCheckedData = async () => {
  try {
    const data = await AsyncStorage.removeItem(
      Constants.LocalStorageKeys.OFFLINE_DATA,
    );
    return data;
  } catch (error) {
    console.log('error', error);
  }
};

//NOTE: Offline Tracked Actions List
export const persistCurrentLang = async (info: any) => {
  try {
    const data = AsyncStorage.setItem(
      Constants.LocalStorageKeys.CURRENT_LANG,
      JSON.stringify(info),
    );

    return data;
  } catch (error) {
    console.log('error', error);
  }
};

export const retrieveCurrentLang = async () => {
  try {
    const data: any = await AsyncStorage.getItem(
      Constants.LocalStorageKeys.CURRENT_LANG,
    );
    const rawData = JSON.parse(data);
    return rawData;
  } catch (error) {
    console.log('error', error);
  }
};