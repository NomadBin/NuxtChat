export default defineEventHandler((event) => {
  console.log('New request: ' + getRequestURL(event));
  if (event.method === 'OPTIONS') {
    // 设置允许的来源
    setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
    // 设置允许的请求方法
    setResponseHeader(event, 'Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // 设置允许的请求头
    setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // 设置预检请求的有效期
    setResponseHeader(event, 'Access-Control-Max-Age', 86400);
    // 返回 204 No Content 状态码
    setResponseStatus(event, 204);
    return;
  }
});
