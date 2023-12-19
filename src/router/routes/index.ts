import type { RouteRecordRaw } from 'vue-router';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { PageEnum } from '@/enums/pageEnum';

// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./modules/**/*.ts', { eager: true });
const routeModuleList: RouteRecordRaw[] = [];

// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as Recordable)[key].default || {};
  const modList = Array.isArray(mod) ? [...mod] : [mod];
  routeModuleList.push(...modList);
});

// 根路由
export const ROOT_ROUTE = {
  path: PageEnum.BASE_HOME,
  name: 'Root',
  meta: {
    title: 'Root',
  },
};

export const LOGIN_ROUTE: RouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/system/login/Login.vue'),
  meta: {
    title: '请登录',
  },
};

// Basic routing without permission
// 未经许可的基本路由
export const FRONTEND_LOCAL_ROUTE = [LOGIN_ROUTE, ROOT_ROUTE, REDIRECT_ROUTE, PAGE_NOT_FOUND_ROUTE];
