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

  import { DICT_TYPE_FROM_SCHEMA } from './dict.data';

  import { getDictTypeById, updateDictType, createDictType, DictType } from '@/api/sys/dict';
  import { useMessage } from '@/hooks/web/useMessage';

  const emits = defineEmits(['success', 'register']);

  const isUpdate = ref(true);

  const { createMessage } = useMessage();

  const [registerForm, { resetFields, updateSchema, validate, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: DICT_TYPE_FROM_SCHEMA,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(({ id }) => {
    isUpdate.value = !!id;
    resetFields();
    setDrawerProps({ confirmLoading: false });

    if (id) {
      getDictTypeById(id).then(setFieldsValue);
    }

    updateSchema({
      field: 'type',
      componentProps: { disabled: isUpdate.value },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增字典类型' : '编辑字典类型'));

  async function handleSubmit() {
    try {
      const value: DictType = await validate();
      const api = value.id ? updateDictType : createDictType;
      setDrawerProps({ confirmLoading: true });
      await api(value);
      createMessage.success(getTitle.value + '成功');
      closeDrawer();
      emits('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
