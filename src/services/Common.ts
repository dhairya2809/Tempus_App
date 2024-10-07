import {AxiosResponse, AxiosRequestConfig} from 'axios';

export interface IResponse extends AxiosResponse {
  problem?: any;
  ok?: boolean;
  status: number;
  data: any;
  Data: any;
}

export type IRequest = AxiosRequestConfig;
