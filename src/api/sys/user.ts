import { defHttp } from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  GetSysUserModel,
} from './model/userModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/system/auth/login',
  Logout = '/logout',
  GetUserInfo = '/system/auth/get-permission-info',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(data: LoginParams | string, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      data,
      headers: {
        'Content-Type': 'text/plain',
      },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function requestLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}

export function getSysUserPage(params) {
  return defHttp.get<GetSysUserModel[]>({ url: '/system/user/page', params });
}

export function getSysUserbyId(id) {
  return defHttp.get<GetSysUserModel>({ url: '/system/user/get', params: { id } });
}

export function createSysUser(data) {
  return defHttp.post({ url: '/system/user/create', data });
}

export function updateSysUser(data: GetSysUserModel) {
  return defHttp.put({ url: '/system/user/update', data });
}

export function updateSysUserStatus(data: { id: number; status: number | string }) {
  return defHttp.put({ url: '/system/user/update-status', data });
}

export function delSysUserById(id) {
  return defHttp.delete({ url: '/system/user/delete?id=' + id });
}

export function getUserRoleIds(userId) {
  return defHttp.get({ url: '/system/permission/list-user-roles', params: { userId } });
}
