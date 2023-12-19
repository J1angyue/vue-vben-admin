<template>
  <div class="py-16px pl-16px h-full">
    <BasicTree
      title="部门列表"
      toolbar
      search
      :clickRowToExpand="false"
      :treeData="treeData"
      :fieldNames="{ title: 'name', key: 'id' }"
      @select="handleSelect"
    />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  import { BasicTree } from '@/components/Tree';
  import { getDeptTreeAll } from '@/api/sys/dept';

  const emit = defineEmits(['select']);

  const treeData = ref<any[]>([]);

  async function fetch() {
    treeData.value = await getDeptTreeAll();
  }

  function handleSelect(keys) {
    emit('select', keys[0]);
  }

  onMounted(fetch);
</script>
