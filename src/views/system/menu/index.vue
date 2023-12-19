<template>
  <BasicTable @register="registerTable">
    <template #toolbar>
      <a-button type="primary" @click="openDrawer(true, {})"> 新增菜单 </a-button>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'action'">
        <a-button type="link" @click="openDrawer(true, { id: record.id })">修改</a-button>
        <a-button type="link" @click="openDrawer(true, { parentId: record.id })">新增下级</a-button>
        <a-button type="link" danger @click="confirmDelete(record.id)">删除</a-button>
      </template>
    </template>
  </BasicTable>
  <MenuDrawer @register="registerDrawer" @success="reload" />
</template>
<script lang="ts" setup name="SystemMenuIndex">
  import { BasicTable, useTable } from '@/components/Table';
  import { getSysMenuList, deleteSysMenu } from '@/api/sys/menu';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';

  import MenuDrawer from './MenuDrawer.vue';
  import { columns } from './menu.data';

  const { createConfirm, createMessage } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerTable, { reload }] = useTable({
    title: '菜单列表',
    api: getSysMenuList,
    columns,
    formConfig: {
      labelWidth: 120,
    },
    isTreeTable: true,
    pagination: false,
    striped: false,
    bordered: true,
    showIndexColumn: false,
    canResize: false,
  });

  function confirmDelete(id) {
    createConfirm({
      iconType: 'warning',
      content: '确认删除该菜单吗？',
    })
      .then(() => deleteSysMenu(id))
      .then(() => reload())
      .then(() => createMessage.success('删除成功'));
  }
</script>
