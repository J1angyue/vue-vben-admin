import { RouteRecordRaw } from 'vue-router';

export const mainOutRoutes: RouteRecordRaw[] = [
  {
    path: '/main-out',
    name: 'MainOut',
    component: () => import('@/views/demo/main-out/index.vue'),
    meta: {
      title: 'MainOut',
      ignoreAuth: true,
    },
  },
];

export const mainOutRouteNames = mainOutRoutes.map((item) => item.name);
