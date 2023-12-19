import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { transformBackendMenuToRoute } from '@/router/helper/routeHelper';
import { transformBackendMenuToFrontendMenu } from '@/router/helper/menuHelper';
import { Menu } from '@/router/types';

interface PermissionState {
  // Permission code list
  // 权限代码列表
  permCodeList: string[] | number[];
  // To trigger a menu update
  // 触发菜单更新
  lastBuildMenuTime: number;
  // Backstage menu list
  // 后台菜单列表
  menuList: Menu[];
}

export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    // 权限代码列表
    permCodeList: [],
    // To trigger a menu update
    // 触发菜单更新
    lastBuildMenuTime: 0,
    menuList: [],
  }),
  getters: {
    getPermCodeList(state): string[] | number[] {
      return state.permCodeList;
    },
    getMenuList(state): Menu[] {
      return state.menuList;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },
    setMenuList(list: Menu[]) {
      this.menuList = list;
    },
    resetState(): void {
      this.permCodeList = [];
      this.menuList = [];
      this.lastBuildMenuTime = 0;
    },
    // 构建路由
    buildRoutesAction(backendMenus): RouteRecordRaw[] {
      const frontEndMenus = transformBackendMenuToFrontendMenu(backendMenus);
      this.setMenuList(frontEndMenus);
      return transformBackendMenuToRoute(backendMenus);
    },
  },
});

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
