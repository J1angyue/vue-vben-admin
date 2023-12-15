import { defineComponent } from 'vue';

export type Component<T = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface MenuTag {
  type?: 'primary' | 'error' | 'warn' | 'success';
  content?: string;
  dot?: boolean;
}

export interface Menu {
  id: number;

  parentId: number;

  name: string;

  icon?: string;

  path: string;

  children?: Menu[];
}

export interface MenuModule {
  orderNo?: number;
  menu: Menu;
}
