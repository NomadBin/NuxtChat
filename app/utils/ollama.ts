import { Ollama } from 'ollama/browser';
import type { FetchChatOptions } from '~~/types/chat';
import type { MdItErroProps } from '~~/types/md-it';

export function getOllama(modelId: string) {
  const chatStore = useChatStore();
  const host = chatStore.getModelConfig(modelId) || 'http://127.0.0.1:11434';
  const ollama = new Ollama({ host: host });
  return ollama;
}

export async function ollamaStreamChat(options: FetchChatOptions) {
  try {
    const ollama = getOllama(options.modelId);
    const response = await ollama.chat({
      model: options.modelId,
      messages: options.messages,
      stream: true,
    });

    let allMessage = '';
    for await (const part of response) {
      // process.stdout.write(part.message.content);
      const content = part.message.content;
      // console.log('part', part);
      if (part.done) {
        options.onFinish({});
      } else {
        allMessage += content;
        options.onMessage(allMessage);
      }
    }
  } catch (error: any) {
    console.error('get Error:', error);
    console.log('error.message', error.message);

    if (matchCatchErrorMsg(error, `model "${options.modelId}" not found, try pulling it first`)) {
      const errorText = getMdcConfigGuideMdText({
        type: 'ollama',
        modelId: options.modelId,
        botMsgId: options.botMsgId,
      });
      options.onMessage(errorText);
      options.onFinish({ err: 'try pulling it first' });
    } else if (matchCatchErrorMsg(error, `Failed to fetch`)) {
      // options.onMessage(`
      //   ::setup-guide{type="ollama"}
      //   ::
      //  `);
      const errorObj: MdItErroProps = {
        type: 'ollama',
        _component: 'setup-guide',
      };
      options.onMessage(JSON.stringify(errorObj));
      options.onFinish({ err: 'Failed to fetch' });
    } else {
      // options.onMessage(`
      //   ::error-msg
      //   ${error.message}
      //   ::
      //  `);
      const errorObj: MdItErroProps = {
        type: 'ollama',
        slotVal: error.message,
        _component: 'error-msg',
      };
      options.onMessage(JSON.stringify(errorObj));
      options.onFinish({ err: error.message });
    }
  }
}

interface OllamaStreamPull {
  modelId: string;
  ollama: Ollama;
  onProgess: (params: { completed: number; total: number }) => void;
  onFinish: (params: { err?: any }) => void;
}

export async function ollamaStreamPull(options: OllamaStreamPull) {
  // const ollama = getOllama(options.modelId);

  try {
    const response = await options.ollama.pull({
      insecure: true,
      model: options.modelId,
      stream: true,
    });
    for await (const part of response) {
      // console.log('part', part);
      if (part.completed) {
        options.onProgess({
          completed: part.completed,
          total: part.total,
        });
      }
    }
    options.onFinish({});
  } catch (err: any) {
    options.onFinish({ err });
  }
}
