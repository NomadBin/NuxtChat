import type { MditConfigGuideProps, MdItErroProps } from '~~/types/md-it';

export function getMdcConfigGuideMdText(props: MditConfigGuideProps) {
  // return `
  //       ::config-guide{type="${props.type}" modelId="${props.modelId}" botMsgId="${props.botMsgId}"}
  //       ::

  //       `;

  const obj: MdItErroProps = {
    type: props.type,
    modelId: props.modelId ?? '',
    botMsgId: props.botMsgId ?? '',
    _component: 'config-guide',
  };

  return JSON.stringify(obj);
}
