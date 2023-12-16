import type { Menu } from '@/router/types';
import { findPath } from '@/utils/helper/treeHelper';
import { getMenuListResultModel } from '@/api/sys/model/menuModel';
import { joinPath } from '@/router/helper/pathHelper';

export function getAllParentPath<T = Recordable>(treeData: T[], path: string) {
  const menuList = findPath(treeData, (n) => n.path === path) as Menu[];
  return (menuList || []).map((item) => item.path);
}

// 将路由转换成菜单
export function transformBackendMenuToFrontendMenu(
  backendMenus: getMenuListResultModel[],
  parentPath?: string,
): Menu[] {
  const menus: Menu[] = [];

  for (let backendMenu of backendMenus) {
    if (!backendMenu.visible) {
      continue;
    }

    // 处理不始终显示
    if (!backendMenu.alwaysShow) {
      const visibleChildren = backendMenu.children?.filter((menu) => menu.visible) || [];
      // 不始终显示时，若没有可见的子级菜单，本级也不显示
      if (!Array.isArray(backendMenu.children) || !visibleChildren.length) {
        continue;
      }
      // 不始终显示时，若只有一个可见子级菜单，只展示一个子级菜单，本级就不展示了
      if (backendMenu.children.filter((menu) => menu.visible).length === 1) {
        parentPath = parentPath ? joinPath(parentPath, backendMenu.path) : backendMenu.path;
        backendMenu = backendMenu.children[0];
      }
    }

    const path = parentPath ? joinPath(parentPath, backendMenu.path) : backendMenu.path;
    menus.push({
      id: backendMenu.id,
      parentId: backendMenu.parentId,
      path,
      name: backendMenu.name,
      icon: backendMenu.icon,
      children: backendMenu.children
        ? transformBackendMenuToFrontendMenu(backendMenu.children, path)
        : [],
    });
  }

  return menus;
}
