<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-button type="primary" @click="openDrawer(true, {})"> 新增 </a-button>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.key === 'colorType' && text">
        <a-tag :color="record.colorType" :bordered="false">{{ record.colorType }}</a-tag>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag :color="getStatusColor(text)" :bordered="false">{{ getStatusLabel(text) }}</a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-button type="link" @click="openDrawer(true, { id: record.id })">修改</a-button>
        <a-button type="link" danger @click="confirmRm(record.id)">删除</a-button>
      </template>
    </template>
  </BasicTable>
  <DictDataDrawer :dictType="dictType" @register="registerDrawer" @success="reload" />
</template>

<script lang="ts" setup name="DictTypeList">
  import { onMounted, computed } from 'vue';
  import { useRouter } from 'vue-router';

  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { getDictDataPage, deleteDictData } from '@/api/sys/dict';
  import { DICT_DATA_COLUMNS, getStatusColor, getStatusLabel } from '../dict.data';
  import DictDataDrawer from './DictDataDrawer.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const router = useRouter();
  const { createMessage, createConfirm } = useMessage();
  const dictType = computed(() => router.currentRoute.value.params.dictType as string);

  const [registerTable, { reload, setTableData }] = useTable({
    title: '字典数据',
    api: getDictDataPage,
    columns: DICT_DATA_COLUMNS,
    showIndexColumn: false,
    immediate: false,
    searchInfo: {
      dictType,
    },
    rowKey: 'id',
  });
  const [registerDrawer, { openDrawer }] = useDrawer();

  function initPage() {
    if (!dictType.value) {
      setTableData([]);
      return;
    }

    reload();
  }

  function confirmRm(id) {
    createConfirm({ content: '确认删除该字典数据吗？', iconType: 'warning' })
      .then(() => deleteDictData(id))
      .then(() => createMessage.success('删除成功'))
      .then(reload);
  }

  onMounted(initPage);
  defineEmits(['create-clicked', 'edit-clicked']);
</script>
