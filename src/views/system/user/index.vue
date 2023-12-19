<template>
  <div class="overflow-hidden flex flex-nowrap h-full">
    <DeptTree class="w-1/4" @select="handleSelect" />
    <BasicTable class="w-3/4" @register="registerTable" :searchInfo="searchInfo">
      <template #toolbar>
        <a-button type="primary" @click="openDrawer(true, {})">新增用户</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <a-button type="link" @click="openDrawer(true, { id: record.id })">修改</a-button>
          <a-button type="link" danger @click="confirmDelete(record.id)">删除</a-button>
        </template>
      </template>
    </BasicTable>
  </div>
  <UserDrawer @register="registerDrawer" @success="reload" />
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';

  import { BasicTable, useTable } from '@/components/Table';
  import { useDrawer } from '@/components/Drawer';
  import { getSysUserPage, delSysUserById } from '@/api/sys/user';

  import DeptTree from './DeptTree.vue';
  import UserDrawer from './UserDrawer.vue';

  import { columns, searchFormSchema } from './user.data';
  import { useMessage } from '@/hooks/web/useMessage';

  const { createConfirm, createMessage } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();

  const searchInfo = reactive<Recordable>({});

  const [registerTable, { reload }] = useTable({
    title: '用户列表',
    api: getSysUserPage,
    rowKey: 'id',
    columns,
    bordered: true,
    useSearchForm: true,
    formConfig: {
      labelWidth: 100,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    handleSearchInfoFn(info) {
      return Object.entries(info).forEach(([k, v]) => {
        info[k.toLowerCase()] = v;
        Reflect.deleteProperty(info, k);
      });
    },
  });

  function handleSelect(deptId = '') {
    searchInfo.deptId = deptId;
    reload();
  }

  function confirmDelete(id) {
    createConfirm({
      content: '确认删除该用户吗？',
      iconType: 'warning',
    })
      .then(() => delSysUserById(id))
      .then(() => createMessage.success('删除成功'))
      .then(() => reload());
  }
</script>
