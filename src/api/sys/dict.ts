import { defHttp } from '@/utils/http/axios';

export interface DictType {
  id?: number;
  name: string;
  status: DictStatusEnum;
  type: string;
  remark?: '';
  createTime?: number;
}

export interface DictData {
  id?: number;
  label: string;
  value: string;
  sort: number;
  status: DictStatusEnum;
  colorType?: DictColorTypeEnum | string;
  dictType: string;
  remark?: string;
  createTime?: number;
}

export enum DictStatusEnum {
  ENABLED = 0,
  DISABLED = 1,
}

export enum DictColorTypeEnum {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
  PROCESSING = 'processing',
  default = 'defalut',
}

export const getDictTypePage = (params) =>
  defHttp.get<DictType[]>({ url: '/system/dict-type/page', params });

export const getDictTypeById = (id) =>
  defHttp.get<DictType>({ url: '/system/dict-type/get', params: { id } });

export const updateDictType = (data: DictType) =>
  defHttp.put({ url: '/system/dict-type/update', data });

export const createDictType = (data: DictType) =>
  defHttp.post({ url: '/system/dict-type/create', data });

export const deleteDictType = (id: number) =>
  defHttp.delete({ url: '/system/dict-type/delete?id=' + id });

export const getDictDataPage = (params) =>
  defHttp.get<DictData[]>({ url: '/system/dict-data/page', params });

export const getDictDataById = (id) =>
  defHttp.get<DictData>({ url: '/system/dict-data/get', params: { id } });

export const updateDictData = (data: DictData) =>
  defHttp.put({ url: '/system/dict-data/update', data });

export const createDictData = (data: DictData) =>
  defHttp.post({ url: '/system/dict-data/create', data });

export const deleteDictData = (id: number) =>
  defHttp.delete({ url: '/system/dict-data/delete?id=' + id });
