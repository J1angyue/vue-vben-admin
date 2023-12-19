import { defHttp } from '@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  GetMenuList = '/system/menu/list',
}

/**
 * @description: Get user menu based on id
 */

export const getSysMenuList = () =>
  defHttp.get<getMenuListResultModel[]>({ url: Api.GetMenuList }).then((flatMenus) => {
    const treeResult: getMenuListResultModel[] = [];

    for (const menu of flatMenus) {
      const parent = flatMenus.find(({ id }) => id === menu.parentId);
      if (!parent) {
        treeResult.push(menu);
        continue;
      }
      (parent.children = parent.children || []).push(menu);
    }

    return treeResult;
  });

export const getSysMenuById = (id) =>
  defHttp.get<getMenuListResultModel>({ url: '/system/menu/get', params: { id } });

export const createSysMenu = (data: getMenuListResultModel) =>
  defHttp.post({ url: '/system/menu/create', data });

export const updateSysMenu = (data: getMenuListResultModel) =>
  defHttp.put({ url: '/system/menu/update', data });

export const deleteSysMenu = (id: number) =>
  defHttp.delete({ url: '/system/menu/delete?id=' + id });

export const getAuthMenuList = () =>
  defHttp.get<getMenuListResultModel[]>({ url: '/system/auth/list-menus' });
