<template>
  <div class="appSiderbar2">
    <div class="topBox">
      <NuxtLink to="/">
        <UiNuxtchatLogo class="topLogo" />
      </NuxtLink>
      <div class="toolList">
        <NuxtLink :to="item.path" class="item" :class="{ active: item.path == route.path }" v-for="item in toolList">
          <div class="wrapIcon">
            <my-icon class="icon" :name="item.icon"></my-icon>
          </div>
          <span class="name">{{ item.name }}</span>
        </NuxtLink>
      </div>
    </div>

    <div class="bottoms">
      <UiPopover trigger="hover" placement="right-end" v-if="true">
        <template #reference>
          <UiAvatar></UiAvatar>
        </template>
        <template #default>
          <div class="userMenuList">
            <div class="item" v-for="item in userMenuList" @click="clickUserMenu(item)">
              <my-icon class="icon" :name="item.icon"></my-icon>
              <span class="name">{{ item.name }}</span>
            </div>
          </div>
        </template>
      </UiPopover>
      <div v-else class="wrapLogin">
        <button class="loginBtn">{{ t('chat.login') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MenuItem {
  name: string;
  path?: string;
  icon: string;
}

const { t } = useI18n();

const toolList = [
  {
    name: t('chat.history'),
    path: '/chat/history',
    icon: 'iconpark/history',
  },
  // {
  //   name:t('chat.collect'),
  //   path: '/chat/collection',
  //   icon: 'iconpark/collection-files',
  // },
];

const userMenuList: MenuItem[] = [
  {
    name: t('chat.setting'),
    path: '/settings',
    icon: 'iconpark/setting-two',
  },
  // {
  //   name: t('chat.exit_login'),
  //   icon: 'iconpark/logout',
  // },
];
const cookieStore = useCookieStore();
const route = useRoute();

function clickUserMenu(item: MenuItem) {
  console.log('clickUserMenu', item);
  if (item.path) {
    navigateTo({
      path: item.path,
    });
  }
}
</script>

<style lang="scss" scoped>
.appSiderbar2 {
  width: $s-16;
  padding-top: $s-6;
  padding-bottom: $s-8;
  background: $color-bg-gray-light;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;

  .topBox {
    display: flex;
    flex-direction: column;
    .topLogo {
      font-size: $s-13;
      user-select: none;
    }

    .toolList {
      margin-top: $s-8;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: $s-6;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        &:hover,
        &.active {
          .wrapIcon {
            background-color: $color-primary;
          }

          .name {
            color: $color-text-0;
          }
        }

        .wrapIcon {
          width: $s-8;
          height: $s-8;
          border-radius: $radius-full;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: $color-primary-light;
          .icon {
            font-size: $text-sm;
            color: $color-text-white;
          }
        }
        .name {
          margin-top: $s-3;
          font-size: $text-sm;
          color: $color-text-1;
        }
      }
    }
  }

  .bottoms {
    display: flex;
    flex-direction: column;
    gap: $s-4;

    .wrapLogin {
      display: flex;
      flex-direction: row;
      .loginBtn {
        background-color: $color-primary-light;
        color: $color-text-0;
        font-size: $text-sm;
        padding: $s-3 $s-6;
        border-radius: $radius-xl;
      }
    }
  }
}

.userMenuList {
  // margin-left: $s-3;
  display: flex;
  flex-direction: column;
  width: $s-14;
  // background-color: $color-bg-chat;
  border-radius: $radius-md;
  border: 1px solid $color-border-gray;
  .item {
    background-color: $color-bg-chat;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: $s-4 $s-3;
    border-bottom: 1px solid $color-border-gray;
    gap: $s-2;
    cursor: pointer;
    font-size: $text-sm;
    &:hover {
      background-color: $color-bg-hover-gray;
    }

    &:first-child {
      border-top-left-radius: $radius-md;
      border-top-right-radius: $radius-md;
    }
    &:last-child {
      border-bottom: none;
      border-bottom-left-radius: $radius-md;
      border-bottom-right-radius: $radius-md;
    }
  }
}
</style>
