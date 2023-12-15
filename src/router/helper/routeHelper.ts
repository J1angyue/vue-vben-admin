import { LAYOUT } from '@/router/constant';

import { getMenuListResultModel } from '@/api/sys/model/menuModel';
import type { RouteRecordRaw, RouteComponent } from 'vue-router';

const ROUTE_COMPONENTS: Record<string, () => Promise<RouteComponent>> = import.meta.glob(
  '../../views/**/*.{vue,tsx}',
);

// Dynamic introduction
function getComponentByPath(route: getMenuListResultModel) {
  if (!route.component || route.component.toUpperCase() === LAYOUT.name) {
    return LAYOUT;
  }
  const matchedKey = Object.keys(ROUTE_COMPONENTS).find(
    (key) => key === route.component || key.includes(route.component),
  );
  if (!matchedKey) {
    return;
  }
  return Reflect.get(ROUTE_COMPONENTS, matchedKey);
}

// 将后端配置的菜单转换为 vue-router 的路由配置对象
export function transformBackendMenuToRoute(
  backendMenus: getMenuListResultModel[],
): RouteRecordRaw[] {
  return standardizeRoutes(backendMenus);
}

function standardizeRoutes(backendMenus: getMenuListResultModel[]): RouteRecordRaw[] {
  const standardized: RouteRecordRaw[] = [];
  for (const route of backendMenus) {
    standardized.push({
      path: route.path,
      component: getComponentByPath(route),
      children: Array.isArray(route.children) ? standardizeRoutes(route.children) : [],
      name: route.name,
      meta: {
        alwaysShow: route.alwaysShow,
        keepAlive: route.keepAlive,
        componentName: route.componentName,
        icon: route.icon,
        id: route.id,
        title: route.name,
        parentId: route.parentId,
        visible: route.visible,
      },
    });
  }
  return standardized;
}
