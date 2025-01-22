import { OpenAI } from 'openai';
import { H3Event } from 'h3';

// const client = new OpenAI({
//   apiKey: '',
//   baseURL: 'https://api.moonshot.cn/v1',
// });

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  // console.log('body', body);

  return mockTestData(event);

  // const completion = await client.chat.completions.create({
  //   model: 'moonshot-v1-8k',
  //   messages: body.messages,
  //   stream: true,
  // });
  // // 设置响应头以支持流式传输
  // event.node.res.setHeader('Content-Type', 'text/event-stream');
  // event.node.res.setHeader('Cache-Control', 'no-cache');
  // event.node.res.setHeader('Connection', 'keep-alive');

  // for await (const chunk of completion) {
  //   const content = chunk.choices[0].delta.content;
  //   if (content) {
  //     // 发送数据块给客户端
  //     event.node.res.write(`data: ${JSON.stringify({ content })}\n\n`);
  //   }
  // }
  // // 结束响应
  // event.node.res.end();
});

/**
 * 模拟数据
 * stream流式传输参考:
 * https://platform.moonshot.cn/docs/guide/utilize-the-streaming-output-feature-of-kimi-api#%E6%8E%A5%E5%8F%A3%E7%BB%86%E8%8A%82
 * https://nitro.build/guide/websocket#example
 */
const mockTestData = (event: H3Event) => {
  const eventStream = createEventStream(event);

  let times = 0;
  let maxTimes = 40;
  const interval = setInterval(async () => {
    // const sendItem = {
    //   id: `cmpl-${new Date().toLocaleTimeString()}`,
    //   object: 'chat.completion.chunk',
    //   created: 1698999575,
    //   model: 'moonshot-v1-8k',
    //   choices: [{ index: 0, delta: { content: '返回你好,' }, finish_reason: null }],
    // };
    await eventStream.push(JSON.stringify({ content: `返回你好${Math.random() * 100},` }));
    times++;

    if (times >= maxTimes) {
      await eventStream.push('[DONE]');
      clearInterval(interval);
      await eventStream.close();
    }
  }, 100);

  eventStream.onClosed(async () => {
    clearInterval(interval);
    await eventStream.close();
    console.log('api eventStream.onClosed');
  });

  return eventStream.send();
};
