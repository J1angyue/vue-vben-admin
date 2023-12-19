import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Tag } from 'ant-design-vue';
import Icon from '@/components/Icon/Icon.vue';

export enum MenuTypeEnum {
  DIR = 0,
  MENU = 1,
  Button = 2,
}

export const columns: BasicColumn[] = [
  {
    title: '菜单名称',
    align: 'left',
    dataIndex: 'name',
  },
  {
    title: '图标',
    dataIndex: 'icon',
    customRender: ({ record }) => (record.icon ? h(Icon, { icon: record.icon }) : null),
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
  },
  {
    title: '组件路径',
    dataIndex: 'component',
  },
  {
    title: '排序',
    dataIndex: 'sort',
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender: ({ record }) => {
      const status = record.status;
      const enable = ~~status === 0;
      const color = enable ? 'green' : 'red';
      const text = enable ? '启用' : '停用';
      return h(Tag, { color: color }, () => text);
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

const isDir = (type) => type === MenuTypeEnum.DIR;
const isMenu = (type) => type === MenuTypeEnum.MENU;
const isButton = (type) => type === MenuTypeEnum.Button;

export const formSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    show: false,
  },
  {
    field: 'type',
    label: '菜单类型',
    component: 'RadioButtonGroup',
    defaultValue: MenuTypeEnum.MENU,
    componentProps: {
      options: [
        { label: '目录', value: MenuTypeEnum.DIR },
        { label: '菜单', value: MenuTypeEnum.MENU },
        { label: '按钮', value: MenuTypeEnum.Button },
      ],
    },
  },
  {
    field: 'name',
    label: '菜单名称',
    component: 'Input',
    required: true,
  },

  {
    field: 'parentId',
    label: '上级菜单',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        children: 'children',
        value: 'id',
      },
    },
  },
  {
    field: 'sort',
    label: '排序',
    component: 'InputNumber',
    required: true,
  },
  {
    field: 'icon',
    label: '图标',
    component: 'IconPicker',
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'path',
    label: '路由地址',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'component',
    label: '组件路径',
    component: 'Input',
    required: true,
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'permission',
    label: '权限标识',
    component: 'Input',
    ifShow: ({ values }) => !isDir(values.type),
  },
  {
    field: 'status',
    label: '状态',
    component: 'RadioButtonGroup',
    defaultValue: 0,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '启用', value: 0 },
        { label: '禁用', value: 1 },
      ],
    },
  },
  {
    field: 'keepAlive',
    label: '是否缓存',
    component: 'RadioButtonGroup',
    defaultValue: false,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '否', value: false },
        { label: '是', value: true },
      ],
    },
    ifShow: ({ values }) => isMenu(values.type),
  },
  {
    field: 'visible',
    label: '显示状态',
    component: 'RadioButtonGroup',
    defaultValue: true,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '显示', value: true },
        { label: '隐藏', value: false },
      ],
    },
    ifShow: ({ values }) => !isButton(values.type),
  },
  {
    field: 'alwaysShow',
    label: '总是显示',
    component: 'RadioButtonGroup',
    defaultValue: true,
    colProps: { span: 12 },
    componentProps: {
      options: [
        { label: '总是显示', value: true },
        { label: '自动隐藏', value: false },
      ],
    },
  },
];
