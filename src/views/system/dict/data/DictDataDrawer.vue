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
  import { ref, computed } from 'vue';

  import { BasicForm, useForm } from '@/components/Form';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';

  import { DICT_DATA_FORM_SCHEMA } from '../dict.data';

  import { getDictDataById, updateDictData, createDictData, DictData } from '@/api/sys/dict';
  import { useMessage } from '@/hooks/web/useMessage';

  const props = defineProps({
    dictType: String,
  });

  const emits = defineEmits(['success', 'register']);

  const isUpdate = ref(true);

  const { createMessage } = useMessage();

  const [registerForm, { resetFields, validate, setFieldsValue }] = useForm({
    labelWidth: 100,
    schemas: DICT_DATA_FORM_SCHEMA,
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(({ id }) => {
    isUpdate.value = !!id;
    resetFields();
    setDrawerProps({ confirmLoading: false });

    if (id) {
      getDictDataById(id).then(setFieldsValue);
      return;
    }

    setFieldsValue({ dictType: props.dictType });
  });

  const getTitle = computed(() => (isUpdate.value ? '编辑字典数据' : '新增字典数据'));

  async function handleSubmit() {
    try {
      const value: DictData = await validate();

      if (!value.colorType) {
        value.colorType = '';
      }

      const api = value.id ? updateDictData : createDictData;
      await api(value);
      createMessage.success(getTitle.value + '成功');
      setDrawerProps({ confirmLoading: true });
      closeDrawer();
      emits('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
