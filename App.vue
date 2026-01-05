<template>
  <!-- 应用入口 -->
</template>

<script>
export default {
  onLaunch: function() {
    console.log('App Launch')
    this.checkLoginStatus()
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  methods: {
    checkLoginStatus() {
      // 检查当前角色和登录状态
      const currentRole = uni.getStorageSync('current_role') || 'user'
      const currentPages = getCurrentPages()
      
      // 如果当前在登录页或注册页，不需要自动跳转
      if (currentPages.length > 0) {
        const currentRoute = currentPages[currentPages.length - 1].route
        if (currentRoute.includes('login') || currentRoute.includes('register')) {
          return
        }
      }

      // 如果是师傅端，检查是否已登录
      if (currentRole === 'master') {
        const masterLoggedIn = uni.getStorageSync('master_logged_in')
        if (!masterLoggedIn) {
          // 未登录，跳转到登录页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/master/login'
            })
          }, 500)
        }
      }
    }
  }
}
</script>

<style lang="scss">
/* 每个页面公共css */
@import './uni.scss';

page {
  background-color: #f5f5f5;
}
</style>
