function isAuthenticated(): boolean {
  return true;
}

export default defineNuxtRouteMiddleware((to, from) => {
  console.log('run auth');
  // const route = useRoute();
  if (isAuthenticated()) {
    // if (route.path !== '/chat') {
    //   return navigateTo('/chat');
    // }
  } else {
    return navigateTo('/login');
  }
});
