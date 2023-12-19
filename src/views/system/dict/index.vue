<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-button type="primary" @click="openDrawer(true, {})">新增</a-button>
    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.key === 'status'">
        <a-tag :color="getStatusColor(text)" :bordered="false">{{ getStatusLabel(text) }}</a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-button type="link" @click="openDrawer(true, { id: record.id })">修改</a-button>
        <a-button type="link" color="success" @click="goDictData(record.type)">数据</a-button>
        <a-button type="link" danger @click="confirmDelete(record.id)">删除</a-button>
      </template>
    </template>
  </BasicTable>
  <DictTypeDrawer @register="registerDrawer" @success="reload" />
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router';

  import { useDrawer } from '@/components/Drawer';
  import { BasicTable, useTable } from '@/components/Table';
  import { getDictTypePage, deleteDictType } from '@/api/sys/dict';

  import { DICT_TYPE_COLUMNS, getStatusColor, getStatusLabel } from './dict.data';
  import DictTypeDrawer from './DictTypeDrawer.vue';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createConfirm, createMessage } = useMessage();
  const router = useRouter();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const [registerTable, { reload }] = useTable({
    title: '字典类型',
    api: getDictTypePage,
    columns: DICT_TYPE_COLUMNS,
    showIndexColumn: false,
    rowKey: 'id',
  });

  function goDictData(dictType: string) {
    router.push(`/system/dict/data/${dictType}`);
  }

  function confirmDelete(id) {
    createConfirm({
      content: '确认删除该字典类型码？',
      iconType: 'warning',
    })
      .then(() => deleteDictType(id))
      .then(() => createMessage.success('删除成功'))
      .then(reload);
  }
</script>
