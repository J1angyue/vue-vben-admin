import { BasicColumn, FormSchema } from '@/components/Table';
import { formatToDateTime } from '@/utils/dateUtil';
import { DictColorTypeEnum, DictStatusEnum } from '@/api/sys/dict';

export function getStatusColor(status: DictStatusEnum) {
  switch (status) {
    case DictStatusEnum.DISABLED:
      return 'red';
    case DictStatusEnum.ENABLED:
      return 'blue';
    default:
      return '';
  }
}
export function getStatusLabel(status: DictStatusEnum) {
  switch (status) {
    case DictStatusEnum.DISABLED:
      return '禁用';
    case DictStatusEnum.ENABLED:
      return '启用';
    default:
      return status;
  }
}

export const DICT_TYPE_COLUMNS: BasicColumn[] = [
  {
    title: '编号',
    dataIndex: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'type',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    format: (text) => formatToDateTime(text as string),
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

export const DICT_TYPE_FROM_SCHEMA: FormSchema[] = [
  {
    field: 'id',
    show: false,
    slot: 'id',
  },
  {
    field: 'type',
    label: '字典类型',
    component: 'Input',
  },
  {
    field: 'name',
    label: '字典名称',
    component: 'Input',
    required: true,
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'RadioGroup',
    defaultValue: DictStatusEnum.ENABLED,
    componentProps: {
      options: [
        { value: DictStatusEnum.ENABLED, label: getStatusLabel(DictStatusEnum.ENABLED) },
        { value: DictStatusEnum.DISABLED, label: getStatusLabel(DictStatusEnum.DISABLED) },
      ],
    },
  },
  {
    field: 'remark',
    label: '备注',
    component: 'InputTextArea',
  },
];

export const DICT_DATA_COLUMNS: BasicColumn[] = [
  {
    title: '字典数据编号',
    dataIndex: 'id',
  },
  {
    title: '字典数据标签',
    dataIndex: 'label',
  },
  {
    title: '字典数据值',
    dataIndex: 'value',
  },
  {
    title: '序号',
    dataIndex: 'sort',
  },
  {
    title: '颜色类型',
    dataIndex: 'colorType',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    format: (text) => formatToDateTime(text as string),
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '操作',
    dataIndex: 'action',
  },
];

export const DICT_DATA_FORM_SCHEMA: FormSchema[] = [
  {
    field: 'id',
    show: false,
    slot: 'id',
  },
  {
    field: 'dictType',
    label: '字典类型',
    component: 'Input',
    componentProps: {
      disabled: true,
    },
  },
  {
    field: 'label',
    label: '数据标签',
    required: true,
    component: 'Input',
  },
  {
    field: 'value',
    label: '数据值',
    required: true,
    component: 'Input',
  },
  {
    field: 'sort',
    label: '显示顺序',
    required: true,
    component: 'InputNumber',
    defaultValue: 1,
  },
  {
    field: 'status',
    label: '状态',
    required: true,
    component: 'RadioGroup',
    defaultValue: DictStatusEnum.ENABLED,
    componentProps: {
      options: [
        { value: DictStatusEnum.ENABLED, label: getStatusLabel(DictStatusEnum.ENABLED) },
        { value: DictStatusEnum.DISABLED, label: getStatusLabel(DictStatusEnum.DISABLED) },
      ],
    },
  },
  {
    field: 'colorType',
    label: '颜色类型',
    component: 'Select',
    componentProps: {
      options: Object.values(DictColorTypeEnum).map((value) => ({ label: value, value })),
    },
  },
];
