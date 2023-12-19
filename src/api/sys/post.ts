import { defHttp } from '@/utils/http/axios';

export function getAllPostList() {
  return defHttp.get({ url: '/system/post/list-all-simple' });
}
