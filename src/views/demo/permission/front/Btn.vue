<template>
  <PageWrapper
    title="前端权限按钮示例"
    contentBackground
    contentClass="p-4"
    content="由于刷新的时候会请求用户信息接口，会根据接口重置角色信息，所以刷新后界面会恢复原样，如果不需要，可以注释 src/layout/default/index内的获取用户信息接口"
  >
    <CurrentPermissionMode />

    <p>
      当前角色: <a> {{ userStore.getRoleList }} </a>
    </p>
    <Alert class="mt-4" type="info" message="点击后请查看按钮变化" show-icon />

    <div class="mt-4">
      权限切换(请先切换权限模式为前端角色权限模式):
      <Space>
        <a-button @click="changeRole('super')" :type="isSuper ? 'primary' : 'default'">
          {{ 'super' }}
        </a-button>
        <a-button @click="changeRole('test')" :type="isTest ? 'primary' : 'default'">
          {{ 'test' }}
        </a-button>
      </Space>
    </div>
    <Divider>组件方式判断权限(有需要可以自行全局注册)</Divider>
    <Authority :value="'super'">
      <a-button type="primary" class="mx-4"> 拥有super角色权限可见 </a-button>
    </Authority>

    <Authority :value="'test'">
      <a-button color="success" class="mx-4"> 拥有test角色权限可见 </a-button>
    </Authority>

    <Authority :value="['test', 'super']">
      <a-button color="error" class="mx-4"> 拥有[test,super]角色权限可见 </a-button>
    </Authority>

    <Divider>函数方式方式判断权限(适用于函数内部过滤)</Divider>
    <a-button v-if="hasPermission('super')" type="primary" class="mx-4">
      拥有super角色权限可见
    </a-button>

    <a-button v-if="hasPermission('test')" color="success" class="mx-4">
      拥有test角色权限可见
    </a-button>

    <a-button v-if="hasPermission(['test', 'super'])" color="error" class="mx-4">
      拥有[test,super]角色权限可见
    </a-button>

    <Divider>指令方式方式判断权限(该方式不能动态修改权限.)</Divider>
    <a-button v-auth="'super'" type="primary" class="mx-4"> 拥有super角色权限可见 </a-button>

    <a-button v-auth="'test'" color="success" class="mx-4"> 拥有test角色权限可见 </a-button>

    <a-button v-auth="['test', 'super']" color="error" class="mx-4">
      拥有[test,super]角色权限可见
    </a-button>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { Alert, Divider, Space } from 'ant-design-vue';
  import CurrentPermissionMode from '../CurrentPermissionMode.vue';
  import { useUserStore } from '@/store/modules/user';
  import { usePermission } from '@/hooks/web/usePermission';
  import { Authority } from '@/components/Authority';
  import { PageWrapper } from '@/components/Page';

  const { changeRole, hasPermission } = usePermission();
  const userStore = useUserStore();

  const isSuper = computed(() => userStore.getRoleList.includes('super'));
  const isTest = computed(() => userStore.getRoleList.includes('test'));
</script>
<style lang="less" scoped>
  .demo {
    background-color: @component-background;
  }
</style>
