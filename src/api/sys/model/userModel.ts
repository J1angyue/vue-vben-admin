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
  deptDO: {
    id: number;
    name: string;
  };
}
