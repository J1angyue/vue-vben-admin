<template>
  <RouterView>
    <template #default="{ Component }">
      <keep-alive :include="tabStore.getCachedTabList">
        <component :is="Component" />
      </keep-alive>
    </template>
  </RouterView>
  <FrameLayout v-if="getCanEmbedIFramePage" />
</template>

<script lang="ts" setup>
  import FrameLayout from '@/layouts/iframe/index.vue';

  import { useRootSetting } from '@/hooks/setting/useRootSetting';

  import { useMultipleTabStore } from '@/store/modules/multipleTab';

  defineOptions({ name: 'PageLayout' });

  const tabStore = useMultipleTabStore();

  const { getCanEmbedIFramePage } = useRootSetting();
</script>
