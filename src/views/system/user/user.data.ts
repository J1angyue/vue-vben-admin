import { updateSysUserStatus } from '@/api/sys/user';
import { BasicColumn, FormSchema } from '@/components/Table';
import { formatToDateTime } from '@/utils/dateUtil';
import { Switch } from 'ant-design-vue';
import { h } from 'vue';

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'username',
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    format: (text) => formatToDateTime(text),
  },
  {
    title: '最近登陆时间',
    dataIndex: 'loginDate',
    format: (text) => (text ? formatToDateTime(text) : '-'),
  },
  {
    title: '所属部门',
    dataIndex: ['dept', 'name'],
  },
  {
    title: '状态',
    dataIndex: 'status',
    customRender({ record }) {
      record.loading = false;
      return h(Switch, {
        checked: record.status,
        checkedValue: 0,
        unCheckedValue: 1,
        checkedChildren: '启用',
        unCheckedChildren: '停用',
        onChange(status) {
          record.loading = true;
          updateSysUserStatus({ id: record.id, status: +status })
            .then(() => (record.status = status))
            .finally(() => (record.loading = false));
        },
      });
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'USERNAME',
    label: '用户名',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'MOBILE',
    label: '手机号',
    component: 'Input',
    colProps: { span: 6 },
  },
  {
    field: 'NICKNAME',
    label: '昵称',
    component: 'Input',
    colProps: { span: 6 },
  },
];

export const sysUserDrawerSchema: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    ifShow: false,
  },
  {
    field: 'nickname',
    label: '用户昵称',
    component: 'Input',
    required: true,
  },
  {
    field: 'deptId',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'name',
        key: 'id',
        value: 'id',
      },
    },
    required: true,
  },
  {
    field: 'postIds',
    label: '岗位',
    component: 'Select',
    required: true,
    defaultValue: [],
    componentProps: {
      mode: 'multiple',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    field: 'roleIds',
    label: '角色',
    component: 'Select',
    required: true,
    defaultValue: [],
    componentProps: {
      mode: 'multiple',
      fieldNames: {
        label: 'name',
        value: 'id',
      },
    },
  },
  {
    field: 'username',
    label: '账号',
    component: 'Input',
    ifShow: ({ values }) => !values.id,
    required: true,
  },
  {
    field: 'password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    ifShow: ({ values }) => !values.id,
  },
  {
    field: 'mobile',
    label: '手机号码',
    component: 'Input',
  },
  {
    field: 'email',
    label: '邮箱',
    component: 'Input',
  },
  {
    field: 'sex',
    label: '性别',
    component: 'RadioButtonGroup',
    defaultValue: 3,
    componentProps: {
      options: [
        { label: '男', value: 1 },
        { label: '女', value: 2 },
        { label: '未知', value: 3 },
      ],
    },
  },
  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
    defaultValue: '',
  },
];
