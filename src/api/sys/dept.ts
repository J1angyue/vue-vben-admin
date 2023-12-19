import { defHttp } from '@/utils/http/axios';

export interface SysDeptModel {
  id?: number;
  parentId: number;
  name: string;
  sort: number;
  createTime: number;
  children?: SysDeptModel[];
}

export function getDeptListAll() {
  return defHttp.get<SysDeptModel[]>({ url: '/system/dept/list-all-simple' });
}

export function getDeptTreeAll() {
  return getDeptListAll().then((dept) => {
    const treeResult: SysDeptModel[] = [];

    for (const menu of dept) {
      const parent = dept.find(({ id }) => id === menu.parentId);
      if (!parent) {
        treeResult.push(menu);
        continue;
      }
      (parent.children = parent.children || []).push(menu);
    }

    return treeResult;
  });
}
