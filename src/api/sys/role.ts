import { defHttp } from '@/utils/http/axios';

export function getAllRoleList() {
  return defHttp.get({ url: '/system/role/list-all-simple' });
}
