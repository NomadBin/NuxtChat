// export default function ({ isDev, redirect }) {
//   if (!isDev) {
//     return redirect("/");
//   }
// }

export default defineNuxtRouteMiddleware(({ params, path }, from) => {
  console.log("dev-only.ts", path);
  // 非开发环境不显示/dev/* 下的页面
  if (process.env.NODE_ENV != "development") {
    if (path.startsWith("/dev/")) {
      return navigateTo("/");
    }
  }
});
