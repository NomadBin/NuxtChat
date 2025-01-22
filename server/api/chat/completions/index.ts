import type { UiBrandAvatarName } from '~~/types/chat';

export default defineEventHandler(async (event) => {
  if (event.method === 'OPTIONS') {
    setResponseStatus(event, 200);
    return {
      body: 'OK',
    };
  }

  const body = await readBody(event);

  const brand = body['brand'] as UiBrandAvatarName;
  const Authorization = event.headers.get('Authorization') ?? '';

  // console.log('body', body);
  // console.log('Authorization', Authorization);

  let url = '';

  if (brand == 'deepseek') {
    url = 'https://api.deepseek.com/v1';
  }

  const fetchOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: Authorization,
    },
    method: event.method,
    body: await readRawBody(event),
    redirect: 'follow',
  };

  const response = await fetch(url + '/chat/completions', fetchOptions);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
});
