import {localiseString} from '@src/locales';
import SensitiveStorage from '@store/sensitive/SensitiveStorage';
import Helpers from '@utils/Helpers';
import {ToastHandler} from '@utils/ToastController';
import axios, {AxiosError} from 'axios';
import {IResponse} from './Common';

interface Params {
  baseUrl: any;
  headers: any;
  method: string;
}

const postConfig: Params = {
  // baseUrl: baseUrl,
  baseUrl: '',
  headers: {
    Accept: 'application/json',
  },
  method: 'post',
};

const getConfig: Params = {
  baseUrl: '',
  headers: {
    Accept: 'application/json',
  },
  method: 'get',
};

export const postAPI = async (url: string, data: any): Promise<any> => {
  const serverEndpoint: any = await SensitiveStorage.getCompanyServerEndpoint();
  Helpers.logTrace(
    'REQUEST-URL :',
    'start',
    `https://${serverEndpoint?.password}/${url}`,
  );
  Helpers.logTrace('REQUEST-BODY :', 'info', data);
  return await axios({
    ...postConfig,
    url: `https://${serverEndpoint?.password}/${url}`,
    data,
  })
    .then(response => {
      if (response.status === 200) {
        Helpers.logTrace('RESPONSE :', 'success', response.data?.Data);
      }
      return {
        status: response.status,
        data: response.data?.Data,
        ok: response?.statusText,
      };
    })
    .catch(async (error: AxiosError) => {
      Helpers.logTrace('ERROR :', 'error', error.code);
      if (error.code === 'ERR_NETWORK') {
        //This method will get call in case of https:// failure and will run with insecure stream
        const responseAlpha: IResponse = await postAPIWithoutSecure(url, data);
        return responseAlpha;
      } else {
        handleErrors(error);
      }
      // return {
      //   status: error.status,
      //   data: error.response,
      // };
    });
};

export const postAPIWithoutSecure = async (
  url: string,
  data: any,
): Promise<any> => {
  const serverEndpoint: any = await SensitiveStorage.getCompanyServerEndpoint();
  Helpers.logTrace(
    'REQUEST-URL :',
    'start',
    `http://${serverEndpoint?.password}/${url}`,
  );
  Helpers.logTrace('REQUEST-BODY :', 'info', data);
  return await axios({
    ...postConfig,
    url: `http://${serverEndpoint?.password}/${url}`,
    data,
  })
    .then(response => {
      if (response.status === 200) {
        Helpers.logTrace('RESPONSE :', 'success', response.data?.Data);
      }
      return {
        status: response.status,
        data: response.data?.Data,
        ok: response?.statusText,
      };
    })
    .catch((error: AxiosError) => {
      handleErrors(error);
      return {
        status: error.status,
        data: error.response,
      };
    });
};

export const getAPI = async (url: string): Promise<any> => {
  const serverEndpoint: any = await SensitiveStorage.getCompanyServerEndpoint();
  Helpers.logTrace(
    'REQUEST-URL :',
    'start',
    `https://${serverEndpoint?.password}/${url}`,
  );
  return await axios({
    ...getConfig,
    url: `https://${serverEndpoint?.password}/${url}`,
  })
    .then(response => {
      if (response.status === 200) {
        Helpers.logTrace('RESPONSE :', 'success', response);
      }
      return {
        status: response.status,
        data: response.data.Data,
      };
    })
    .catch(async (error: AxiosError) => {
      Helpers.logTrace('ERROR :', 'error', error.code);
      if (error.code === 'ERR_NETWORK') {
        //This method will get call in case of https:// failure and will run with insecure stream
        const responseAlpha: IResponse = await getAPIWithoutSecure(url);
        return responseAlpha;
      } else {
        handleErrors(error);
      }
      return {
        status: error.status,
        data: error.response,
      };
    });
};

export const getAPIWithoutSecure = async (url: string): Promise<any> => {
  const serverEndpoint: any = await SensitiveStorage.getCompanyServerEndpoint();
  Helpers.logTrace(
    'REQUEST-URL :',
    'start',
    `http://${serverEndpoint?.password}/${url}`,
  );
  return await axios({
    ...getConfig,
    url: `http://${serverEndpoint?.password}/${url}`,
  })
    .then(response => {
      if (response.status === 200) {
        Helpers.logTrace('RESPONSE :', 'success', response);
      }
      return {
        status: response.status,
        data: response.data.Data,
      };
    })
    .catch(error => {
      handleErrors(error);
      return {
        status: error.status,
        data: error.response,
      };
    });
};

function handleErrors(error: AxiosError) {
  Helpers.logTrace('ERROR :', 'error', error.code);
  const errorCodes = error.response?.status;

  if (error.code === 'ERR_NETWORK') {
    ToastHandler.showToast(
      'danger',
      error.message +
        ' or ' +
        localiseString('companyLogin.invalidCompanyServer'),
    );
    return;
  }

  if (error.code === 'ERR_BAD_REQUEST') {
    ToastHandler.showToast('danger', error.message);
    return;
  }

  switch (errorCodes) {
    case 404:
      ToastHandler.showToast(
        'danger',
        localiseString('networkErrors.badRequest'),
      );
      break;
    case 500:
      ToastHandler.showToast(
        'danger',
        localiseString('networkErrors.internalError'),
      );
      break;
    case 408:
      ToastHandler.showToast('danger', localiseString('networkErrors.timeout'));
      break;
    case 401:
      ToastHandler.showToast(
        'danger',
        localiseString('networkErrors.unauthorized'),
      );
      break;
    default:
      break;
  }
}
