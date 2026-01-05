<template>
  <view class="container">
    <!-- 角色切换 -->
    <view class="role-section">
      <view class="section-title">切换身份</view>
      <view class="role-switch">
        <view 
          class="role-item" 
          :class="{ active: currentRole === 'user' }"
          @click="switchRole('user')"
        >
          <view class="role-icon">👤</view>
          <text class="role-name">用户端</text>
          <text class="role-desc">预约服务</text>
          <text v-if="currentRole === 'user'" class="role-badge">当前</text>
        </view>
        <view 
          class="role-item" 
          :class="{ active: currentRole === 'master' }"
          @click="switchRole('master')"
        >
          <view class="role-icon">🐱</view>
          <text class="role-name">喂猫师傅端</text>
          <text class="role-desc">接单服务</text>
          <text v-if="currentRole === 'master'" class="role-badge">当前</text>
        </view>
      </view>
    </view>

    <!-- 功能设置 -->
    <view class="menu-section">
      <view class="section-title">功能设置</view>
      <view class="menu-item" @click="goToProfile">
        <text class="menu-icon">👤</text>
        <text class="menu-text">个人资料</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToCertification" v-if="currentRole === 'master'">
        <text class="menu-icon">🆔</text>
        <text class="menu-text">实名认证</text>
        <text class="menu-status" :class="certStatusClass">{{ certStatusText }}</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="changePassword">
        <text class="menu-icon">🔒</text>
        <text class="menu-text">修改密码</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="manageAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-text">地址管理</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 通用设置 -->
    <view class="menu-section">
      <view class="section-title">通用设置</view>
      <view class="menu-item">
        <text class="menu-icon">🔔</text>
        <text class="menu-text">消息通知</text>
        <switch :checked="settings.notification" @change="toggleNotification" color="#FF8C00" />
      </view>
      <view class="menu-item">
        <text class="menu-icon">🌙</text>
        <text class="menu-text">夜间模式</text>
        <switch :checked="settings.darkMode" @change="toggleDarkMode" color="#FF8C00" />
      </view>
      <view class="menu-item" @click="clearCache">
        <text class="menu-icon">🗑️</text>
        <text class="menu-text">清除缓存</text>
        <text class="menu-desc">123.5MB</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 其他 -->
    <view class="menu-section">
      <view class="section-title">其他</view>
      <view class="menu-item" @click="contactService">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="viewAgreement">
        <text class="menu-icon">📄</text>
        <text class="menu-text">服务协议</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="viewPrivacy">
        <text class="menu-icon">🔐</text>
        <text class="menu-text">隐私政策</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="about">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentRole: 'user', // user: 用户端, master: 喂猫师傅端
      certStatus: 0, // 0: 未认证, 1: 审核中, 2: 已认证, 3: 认证失败
      settings: {
        notification: true,
        darkMode: false
      }
    }
  },
  computed: {
    certStatusText() {
      const statusMap = {
        0: '未认证',
        1: '审核中',
        2: '已认证',
        3: '认证失败'
      }
      return statusMap[this.certStatus] || '未认证'
    },
    certStatusClass() {
      const classMap = {
        0: 'status-pending',
        1: 'status-processing',
        2: 'status-success',
        3: 'status-failed'
      }
      return classMap[this.certStatus] || 'status-pending'
    }
  },
  onLoad() {
    this.loadSettings()
    this.loadCertStatus()
  },
  onShow() {
    // 每次显示时刷新当前角色
    this.currentRole = uni.getStorageSync('current_role') || 'user'
    this.loadCertStatus()
  },
  methods: {
    loadSettings() {
      // 从本地存储加载设置
      const savedRole = uni.getStorageSync('current_role')
      if (savedRole) {
        this.currentRole = savedRole
      } else {
        this.currentRole = 'user'
        uni.setStorageSync('current_role', 'user')
      }
      
      const savedSettings = uni.getStorageSync('app_settings')
      if (savedSettings) {
        this.settings = { ...this.settings, ...savedSettings }
      }
      
      console.log('加载设置完成', {
        currentRole: this.currentRole,
        settings: this.settings
      })
    },
    loadCertStatus() {
      // 如果是师傅端，加载认证状态
      if (this.currentRole === 'master') {
        this.certStatus = uni.getStorageSync('master_cert_status') || 0
      }
    },
    switchRole(role) {
      if (this.currentRole === role) {
        return
      }

      uni.showModal({
        title: '切换身份',
        content: `确定要切换到${role === 'user' ? '用户端' : '喂猫师傅端'}吗？`,
        success: (res) => {
          if (res.confirm) {
            // 保存当前角色
            this.currentRole = role
            uni.setStorageSync('current_role', role)

            // 根据角色跳转到对应首页
            if (role === 'user') {
              // 跳转到用户端首页
              uni.reLaunch({
                url: '/pages/index/index'
              })
            } else {
              // 切换到师傅端，检查是否已登录
              const masterLoggedIn = uni.getStorageSync('master_logged_in')
              if (masterLoggedIn) {
                // 已登录，跳转到师傅端首页
                uni.reLaunch({
                  url: '/pages/master/index'
                })
              } else {
                // 未登录，跳转到师傅端登录页
                uni.reLaunch({
                  url: '/pages/master/login'
                })
              }
            }
          }
        }
      })
    },
    goToProfile() {
      if (this.currentRole === 'user') {
        uni.navigateTo({
          url: '/pages/profile/profile'
        })
      } else {
        uni.navigateTo({
          url: '/pages/master/profile'
        })
      }
    },
    goToCertification() {
      uni.navigateTo({
        url: '/pages/master/certification'
      })
    },
    changePassword() {
      uni.showToast({
        title: '修改密码功能',
        icon: 'none'
      })
    },
    manageAddress() {
      uni.showToast({
        title: '地址管理功能',
        icon: 'none'
      })
    },
    toggleNotification(e) {
      this.settings.notification = e.detail.value
      uni.setStorageSync('app_settings', this.settings)
    },
    toggleDarkMode(e) {
      this.settings.darkMode = e.detail.value
      uni.setStorageSync('app_settings', this.settings)
      uni.showToast({
        title: e.detail.value ? '已开启夜间模式' : '已关闭夜间模式',
        icon: 'none'
      })
    },
    clearCache() {
      uni.showModal({
        title: '清除缓存',
        content: '确定要清除缓存吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除缓存逻辑
            uni.showLoading({
              title: '清除中...'
            })
            setTimeout(() => {
              uni.hideLoading()
              uni.showToast({
                title: '清除成功',
                icon: 'success'
              })
            }, 1000)
          }
        }
      })
    },
    contactService() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
    },
    viewAgreement() {
      uni.showModal({
        title: '服务协议',
        content: '这里是服务协议内容...',
        showCancel: false
      })
    },
    viewPrivacy() {
      uni.showModal({
        title: '隐私政策',
        content: '这里是隐私政策内容...',
        showCancel: false
      })
    },
    about() {
      uni.showModal({
        title: '关于我们',
        content: '上门喂猫服务平台\n版本：1.0.0\n\n为您的爱猫提供专业贴心的服务',
        showCancel: false
      })
    },
    handleLogout() {
      uni.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            // 清除登录信息
            if (this.currentRole === 'master') {
              uni.removeStorageSync('master_token')
              uni.removeStorageSync('master_logged_in')
              uni.removeStorageSync('master_phone')
            } else {
              uni.removeStorageSync('user_token')
              uni.removeStorageSync('user_logged_in')
            }

            // 跳转到登录页
            if (this.currentRole === 'master') {
              uni.reLaunch({
                url: '/pages/master/login'
              })
            } else {
              uni.showToast({
                title: '退出成功',
                icon: 'success'
              })
              // 用户端可以继续使用，不需要强制登录
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  width: 100%;
  background: #FFF8DC;
  padding: 30rpx;
  padding-bottom: 120rpx;
  box-sizing: border-box;
}

.role-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  display: block;
}

.role-switch {
  display: flex;
  gap: 20rpx;
}

.role-item {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 30rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15rpx;
  position: relative;
  border: 2rpx solid transparent;
  transition: all 0.3s;

  &.active {
    background: linear-gradient(135deg, #FFE4B5 0%, #FFF8DC 100%);
    border-color: #FF8C00;
  }
}

.role-icon {
  font-size: 60rpx;
  display: block;
}

.role-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.role-desc {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.role-badge {
  position: absolute;
  top: 10rpx;
  right: 10rpx;
  background: #FF8C00;
  color: #ffffff;
  font-size: 20rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
}

.menu-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 30rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.menu-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
  width: 40rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-desc {
  font-size: 26rpx;
  color: #999;
  margin-right: 10rpx;
}

.menu-status {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;

  &.status-pending {
    background: #f5f5f5;
    color: #999;
  }

  &.status-processing {
    background: #FFF8E1;
    color: #FF8C00;
  }

  &.status-success {
    background: #E8F5E9;
    color: #4CAF50;
  }

  &.status-failed {
    background: #FFEBEE;
    color: #F44336;
  }
}

.menu-arrow {
  font-size: 28rpx;
  color: #999;
}

.logout-section {
  margin-top: 40rpx;
}

.logout-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #ffffff;
  color: #F44336;
  border-radius: 44rpx;
  font-size: 32rpx;
  border: 1rpx solid #eee;
}
</style>
