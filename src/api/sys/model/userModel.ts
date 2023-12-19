import { getMenuListResultModel } from './menuModel';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: number;
  accessToken: string;
  refreshToken: string;
  expiresTime: number;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: string[];
  user: {
    avatar: string;
    id: number;
    nickname: string;
  };
  permissions: string[];
  postName: string[];
  menus: getMenuListResultModel[];
}

export interface GetSysUserModel {
  avatar?: string;
  createTime: number;
  dept: { id: number; name: string };
  deptId: number;
  email?: '';
  id?: number;
  loginDate?: number;
  loginIp?: string;
  mobile?: string;
  nickname?: string;
  postIds: number[];
  remark?: string;
  sex?: number;
  status: number;
  username: string;
}
