export interface getMenuListResultModel {
  id: number;
  parentId: number;
  name: string;
  path: string;
  component: string;
  componentName: string;
  icon: string;
  visible: boolean;
  keepAlive: boolean;
  alwaysShow: boolean;
  children: Nullable<getMenuListResultModel[]>;
}
