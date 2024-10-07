import {localiseString} from '@src/locales';
import {Platform, Rationale} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Permissions, {PERMISSIONS} from 'react-native-permissions';
import {ToastHandler} from './ToastController';

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const data = {position, lat, long};
        resolve(data);
      },
      error => {
        console.log(error.code, error.message);
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};

export const requestLocationPermission = async () => {
  const rationale: Rationale = {
    title: 'Datelka',
    message: localiseString('general.locationPermission'),
    buttonPositive: 'Allow',
    buttonNegative: 'Cancel',
  };
  let status;
  if (Platform.OS === 'ios') {
    status = await Permissions.request(PERMISSIONS.IOS.LOCATION_ALWAYS);
  } else if (Platform.OS === 'android') {
    status = await Permissions.request(
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      rationale,
    );
  }

  console.log('status :', status);
  if (status === 'granted') {
    console.log('Location permission granted');
  } else if (
    status === 'granted' ||
    status === 'blocked' ||
    status === 'unavailable'
  ) {
    console.log('Location permission denied');
    ToastHandler.showToast(
      'info',
      'Allow access to location permission from settings',
    );
  }
};

export const getCurrentTimeStamp = () => {
  const now = new Date();
  const formattedTimestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now
    .getHours()
    .toString()
    .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now
    .getSeconds()
    .toString()
    .padStart(2, '0')}`;

  return formattedTimestamp;
};

const GeoLocations = {
  getCurrentLocation,
  getCurrentTimeStamp,
  requestLocationPermission,
};

export default GeoLocations;
