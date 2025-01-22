<template>
  <div class="errBox" v-if="errorObj && errorObj._component">
    <template v-if="errorObj._component == 'config-guide'">
      <ErrorConfigGuide :type="errorObj.type" :modelId="errorObj.modelId" :botMsgId="errorObj.botMsgId" />
    </template>
    <template v-if="errorObj._component == 'setup-guide'">
      <ErrorSetupGuide :type="errorObj.type" />
    </template>
    <template v-if="errorObj._component == 'error-msg'">
      <ErrorMsg :type="errorObj.type" :slot-val="errorObj.slotVal" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import type { MdItErroProps } from '~~/types/md-it';
import ErrorMsg from './ErrorMsg.vue';

interface Props {
  error: string;
}
const props = withDefaults(defineProps<Props>(), {});

const errorObj = computed(() => {
  if (props.error.startsWith('{') && props.error.endsWith('}')) {
    return JSON.parse(props.error) as MdItErroProps;
  } else {
    return null;
  }
});
</script>

<style lang="scss" scoped>
.errBox {
  width: 500px;
}
</style>
