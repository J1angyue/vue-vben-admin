import type { UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import { ROLES_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { LoginParams } from '@/api/sys/model/userModel';
import { getUserInfo, loginApi, requestLogout } from '@/api/sys/user';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';

import { h } from 'vue';

import AES from 'crypto-js/aes';
import EncUTF8 from 'crypto-js/enc-utf8';
import MODE_ECB from 'crypto-js/mode-ecb';
import PAD_PKCS7 from 'crypto-js/pad-pkcs7';

function encryptLoginParams(loginParams: LoginParams) {
  return AES.encrypt(
    EncUTF8.parse(JSON.stringify(loginParams)),
    EncUTF8.parse('f4wjsudffd34er26'),
    {
      iv: EncUTF8.parse('0000000000000000'),
      mode: MODE_ECB,
      padding: PAD_PKCS7,
    },
  ).toString();
}

interface UserState {
  userInfo: Nullable<UserInfo>;
  roleList: string[];
  permissions: string[];
  posts: string[];
  dept?: Nullable<{ name: string; id: number }>;
  token?: string;
  sessionTimeout?: boolean;
  lastUpdateTime: number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: '',
    // roleList
    roleList: [],
    permissions: [],
    posts: [],
    dept: null,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(state): string[] {
      return state.roleList.length > 0 ? state.roleList : getAuthCache<string[]>(ROLES_KEY);
    },
    getSessionTimeout(state): boolean {
      return !!state.sessionTimeout;
    },
    getLastUpdateTime(state): number {
      return state.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: string[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setPermissions(permissions: string[]) {
      this.permissions = permissions;
    },
    setPosts(posts: string[]) {
      this.posts = posts;
    },
    setDept(dept: UserState['dept']) {
      this.dept = dept;
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ) {
      try {
        const { mode, ...loginParams } = params;
        const data = await loginApi(encryptLoginParams(loginParams), mode);
        this.setToken(data.accessToken);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getUserInfoAction(): Promise<UserInfo | null> {
      const { createMessage } = useMessage();
      createMessage.loading('正在加载您的信息……');
      try {
        const userInfo = await getUserInfo();
        this.setRoleList(Array.isArray(userInfo.roles) ? userInfo.roles : []);
        this.setUserInfo(userInfo.user);
        this.setPermissions(userInfo.permissions);
        this.setPosts(userInfo.postName);
        this.setDept(userInfo.deptDO);
      } finally {
        createMessage.destroy();
      }
      return this.userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      try {
        await requestLogout();
      } catch {
        // noop
      }

      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setRoleList([]);
      this.setPermissions([]);
      this.setPosts([]);
      this.setDept(null);
      this.setUserInfo(null);

      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', '登出提示'),
        content: () => h('span', '确认退出登录吗？'),
        onOk: () => this.logout(true),
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
