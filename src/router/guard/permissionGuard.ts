import type { Router } from 'vue-router';

import { usePermissionStoreWithOut } from '@/store/modules/permission';

import { PageEnum } from '@/enums/pageEnum';
import { useUserStoreWithOut } from '@/store/modules/user';

const LOGIN_PATH = PageEnum.BASE_LOGIN;

const whitePathList: Array<PageEnum | string> = [LOGIN_PATH];

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

    if (!userStore.userInfo) {
      try {
        await userStore.getUserInfoAction();
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
    }

    if (permissionStore.menuList.length) {
      next();
      return;
    }

    const routes = await permissionStore.buildRoutesAction();

    routes.forEach(router.addRoute);

    if (!permissionStore.menuList.length) {
      next(false);
      return;
    }

    if (to.path === PageEnum.BASE_HOME) {
      next({
        replace: true,
        path: permissionStore.menuList[0].path,
      });
    }

    next();
  });
}
