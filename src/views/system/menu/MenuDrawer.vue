<template>
  <BasicDrawer
    width="50%"
    showFooter
    :title="getTitle"
    @register="registerDrawer"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup name="MenuDrawer">
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';

  import { getSysMenuList, getSysMenuById, updateSysMenu, createSysMenu } from '@/api/sys/menu';
  import type { getMenuListResultModel } from '@/api/sys/model/menuModel';
  import { useMessage } from '@/hooks/web/useMessage';

  const emits = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  let treeData: Nullable<getMenuListResultModel[]> = null;

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    treeData = treeData?.length ? treeData : await getSysMenuList();
    resetFields();

    if (data?.id) {
      isUpdate.value = false;
      getSysMenuById(data.id).then(setFieldsValue);
    } else if (data?.parentId) {
      isUpdate.value = false;
      setFieldsValue({ parentId: data.parentId });
    }

    updateSchema({
      field: 'parentId',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate();
      setDrawerProps({ confirmLoading: true });
      const api = values.id ? updateSysMenu : createSysMenu;
      await api(values);
      createMessage.success('保存成功');
      closeDrawer();
      emits('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
