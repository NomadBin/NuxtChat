import type { UiBrandAvatarName } from '~/components/ui/BrandAvatar.vue';
export interface MditConfigGuideProps {
  type: UiBrandAvatarName;
  modelId?: string;
  botMsgId?: string;
  slotVal?: string;
}

export interface MdItErroProps {
  type: UiBrandAvatarName;
  modelId?: string;
  botMsgId?: string;
  slotVal?: string;
  _component: 'config-guide' | 'setup-guide' | 'error-msg';
}
