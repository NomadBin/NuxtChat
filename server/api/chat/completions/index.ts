import { getEnvValueByBrand } from '~~/server/utils/chat';
import type { UiBrandAvatarName } from '~~/types/chat';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const body = await readBody(event);

  const brand = body['brand'] as UiBrandAvatarName;
  delete body['brand'];

  let apiKey = getEnvValueByBrand(config, brand, 'key');
  const Authorization = event.headers.get('Authorization');

  if (Authorization) {
    const tempArr = Authorization.split(' ');
    // 如果有 Authorization 头，则使用 Authorization 头中的 API 密钥
    if (tempArr.length == 2) {
      apiKey = tempArr[1];
    }
  }

  if (!apiKey) {
    return new Response('not config apikey', { status: 400 });
  }

  let url = getEnvValueByBrand(config, brand);

  const fetchOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
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
