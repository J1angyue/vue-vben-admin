<template>
  <BasicDrawer
    :title="getTitle"
    showFooter
    width="30%"
    @register="registerDrawer"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>

<script lang="ts" name="DictTypeDrawer" setup>
  import { ref, computed, unref } from 'vue';

  import { BasicForm, useForm } from '@/components/Form';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';

  import { sysUserDrawerSchema } from './user.data';

  import { GetSysUserModel } from '@/api/sys/model/userModel';
  import { getSysUserbyId, updateSysUser, createSysUser } from '@/api/sys/user';
  import { getDeptTreeAll } from '@/api/sys/dept';
  import { getAllRoleList } from '@/api/sys/role';

  import { useMessage } from '@/hooks/web/useMessage';
  import { getAllPostList } from '@/api/sys/post';

  const emits = defineEmits(['success', 'register']);

  const isUpdate = ref(true);

  const { createMessage } = useMessage();

  const [registerForm, { resetFields, updateSchema, validate, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: sysUserDrawerSchema,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    isUpdate.value = !!data?.id;
    resetFields();

    if (data?.id) {
      setDrawerProps({ confirmLoading: true });
      try {
        await getSysUserbyId(data.id).then(setFieldsValue);
      } finally {
        setDrawerProps({ confirmLoading: false });
      }
    }

    try {
      setDrawerProps({ confirmLoading: true });
      updateSchema({
        field: 'deptId',
        componentProps: { treeData: await getDeptTreeAll() },
      });
      updateSchema({
        field: 'postIds',
        componentProps: { options: await getAllPostList() },
      });
      updateSchema({
        field: 'roleIds',
        componentProps: { options: await getAllRoleList() },
      });
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增用户' : '编辑用户'));

  async function handleSubmit() {
    try {
      const value: GetSysUserModel = await validate();
      const saveUserAPI = value.id ? updateSysUser : createSysUser;

      if (saveUserAPI === updateSysUser) {
        Reflect.deleteProperty(value, 'account');
        Reflect.deleteProperty(value, 'password');
      }

      setDrawerProps({ confirmLoading: true });
      await saveUserAPI(value);
      createMessage.success('保存成功');
      closeDrawer();
      emits('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
