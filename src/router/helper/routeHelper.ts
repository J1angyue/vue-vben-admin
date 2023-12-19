import { LAYOUT } from '@/router/constant';

import { getMenuListResultModel } from '@/api/sys/model/menuModel';
import type { RouteRecordRaw, RouteComponent } from 'vue-router';
import { joinPath } from './pathHelper';

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
  const standardRoutes = standardizeRoutes(backendMenus);
  return flatRoutes(standardRoutes);
}

function standardizeRoutes(
  backendMenus: getMenuListResultModel[],
  parentPath?: string,
): RouteRecordRaw[] {
  const standardized: RouteRecordRaw[] = [];
  for (const route of backendMenus) {
    const path = parentPath ? joinPath(parentPath, route.path) : route.path;

    standardized.push({
      path,
      component: getComponentByPath(route),
      children: Array.isArray(route.children) ? standardizeRoutes(route.children, path) : [],
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

function flatRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  for (const route of routes) {
    if (!Array.isArray(route.children) || !route.children.length) {
      continue;
    }
    route.children = getLeafChildren(route.children);
  }
  return routes;
}

function getLeafChildren(routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const leafChildren: RouteRecordRaw[] = [];

  for (const route of routes) {
    if (!Array.isArray(route.children) || !route.children.length) {
      leafChildren.push(route);
      continue;
    }
    leafChildren.push(...getLeafChildren(route.children));
  }

  return leafChildren;
}
