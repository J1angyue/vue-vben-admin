import { RouteRecordRaw } from 'vue-router';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user';
import { transformBackendMenuToRoute } from '@/router/helper/routeHelper';
import { transformBackendMenuToFrontendMenu } from '@/router/helper/menuHelper';
import { getAuthMenuList } from '@/api/sys/menu';
import { useMessage } from '@/hooks/web/useMessage';
import { Menu } from '@/router/types';

const { createMessage } = useMessage();
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
    async buildRoutesAction(): Promise<RouteRecordRaw[]> {
      this.setPermCodeList(useUserStore().permissions);
      const backendMenus = await requestBackendMenus();
      const frontEndMenus = transformBackendMenuToFrontendMenu(backendMenus);
      this.setMenuList(frontEndMenus);
      return transformBackendMenuToRoute(backendMenus);
    },
  },
});

function requestBackendMenus() {
  createMessage.loading('菜单加载中……', 0);
  return getAuthMenuList()
    .catch(() => {
      createMessage.destroy();
      createMessage.error('菜单加载异常');
      return [];
    })
    .finally(createMessage.destroy);
}

// Need to be used outside the setup
// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
