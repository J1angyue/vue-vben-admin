import type { Router } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';

import { PageEnum } from '@/enums/pageEnum';
import { useUserStoreWithOut } from '@/store/modules/user';
import { PAGE_NOT_FOUND_ROUTE } from '../routes/basic';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: Array<PageEnum | string> = [LOGIN_PATH];

function getNearestLeafChild(menus) {
  while (menus[0].children && menus[0].children.length) {
    menus = menus[0].children;
  }
  return menus[0] || PAGE_NOT_FOUND_ROUTE;
}

export function createPermissionGuard(router: Router) {
  const userStore = useUserStoreWithOut();
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, from, next) => {
    const token = userStore.getToken;

    if (whitePathList.includes(to.path)) {
      next();
      return;
    }

    if (!token) {
      next({
        path: LOGIN_PATH,
        replace: true,
        query: {
          redirect: decodeURIComponent(to.fullPath),
        },
      });
      return;
    }

    if (userStore.userInfo) {
      next();
      return;
    }

    try {
      const userInfo = await userStore.getUserInfoAction();
      if (!userInfo) {
        throw new Error('加载用户信息失败');
      }
      permissionStore.setPermCodeList(userInfo.permissions);
      const routes = await permissionStore.buildRoutesAction(userInfo.menus);
      routes.forEach(router.addRoute);
    } catch {
      await userStore.logout(false);
      next({
        path: LOGIN_PATH,
        query: {
          redirect: decodeURIComponent(to.fullPath),
        },
      });
      return;
    }

    if (!permissionStore.menuList.length) {
      next(new Error('No permission menus.'));
      return;
    }

    if (to.path === PageEnum.BASE_HOME) {
      next({
        replace: true,
        path: getNearestLeafChild(permissionStore.menuList).path,
      });
      return;
    }

    if (to.name === PAGE_NOT_FOUND_ROUTE.name) {
      next({ path: to.fullPath, replace: true });
      return;
    }

    next();
  });
}
