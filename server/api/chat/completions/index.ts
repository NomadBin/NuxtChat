import { getBaseUrlByBrand } from '~~/server/utils/chat';
import type { UiBrandAvatarName } from '~~/types/chat';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  const body = await readBody(event);

  const brand = body['brand'] as UiBrandAvatarName;
  delete body['brand'];

  const Authorization = event.headers.get('Authorization') ?? '';

  let url = getBaseUrlByBrand(config, brand);

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
