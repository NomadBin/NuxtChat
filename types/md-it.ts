import type { UiBrandAvatarName } from './chat';

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
