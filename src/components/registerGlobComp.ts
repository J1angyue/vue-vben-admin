import type { App } from 'vue';
import { Button } from './Button';
import { Input, Layout, Tag, Row, Col } from 'ant-design-vue';
import VXETable from 'vxe-table';

const components = [Button, Input, Layout, Tag, Row, Col, VXETable];

export function registerGlobComp(app: App) {
  components.forEach(app.use);
}
