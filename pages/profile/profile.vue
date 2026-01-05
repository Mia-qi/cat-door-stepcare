<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="avatar">
        <text class="avatar-text">{{ user.name ? user.name.charAt(0) : 'U' }}</text>
      </view>
      <view class="user-info">
        <text class="username">{{ user.name || '未登录' }}</text>
        <text class="user-phone" v-if="user.phone">{{ user.phone }}</text>
      </view>
      <text class="edit-btn" @click="editProfile">编辑</text>
    </view>

    <!-- 订单统计 -->
    <view class="stats-section">
      <view class="stat-item" @click="goToOrders(0)">
        <text class="stat-number">{{ stats.pending }}</text>
        <text class="stat-label">待支付</text>
      </view>
      <view class="stat-item" @click="goToOrders(1)">
        <text class="stat-number">{{ stats.processing }}</text>
        <text class="stat-label">进行中</text>
      </view>
      <view class="stat-item" @click="goToOrders(2)">
        <text class="stat-number">{{ stats.completed }}</text>
        <text class="stat-label">已完成</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToAddress">
        <text class="menu-icon">📍</text>
        <text class="menu-text">收货地址</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToCoupons">
        <text class="menu-icon">🎫</text>
        <text class="menu-text">优惠券</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToFavorites">
        <text class="menu-icon">❤️</text>
        <text class="menu-text">我的收藏</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 其他功能 -->
    <view class="menu-section">
      <view class="menu-item" @click="contactService">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToAbout">
        <text class="menu-icon">ℹ️</text>
        <text class="menu-text">关于我们</text>
        <text class="menu-arrow">></text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: {
        name: '用户昵称',
        phone: '138****8888'
      },
      stats: {
        pending: 1,
        processing: 1,
        completed: 5
      }
    }
  },
  methods: {
    editProfile() {
      uni.showToast({
        title: '编辑资料',
        icon: 'none'
      })
    },
    goToOrders(status) {
      uni.switchTab({
        url: '/pages/order/order'
      })
    },
    goToAddress() {
      uni.showToast({
        title: '收货地址',
        icon: 'none'
      })
    },
    goToCoupons() {
      uni.showToast({
        title: '优惠券',
        icon: 'none'
      })
    },
    goToFavorites() {
      uni.showToast({
        title: '我的收藏',
        icon: 'none'
      })
    },
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      })
    },
    contactService() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
    },
    goToAbout() {
      uni.showModal({
        title: '关于我们',
        content: '上门喂猫服务小程序\n版本：1.0.0\n为您的爱猫提供专业贴心的服务',
        showCancel: false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #FFF8DC;
}

.user-header {
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  padding: 60rpx 30rpx 40rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid rgba(255, 255, 255, 0.5);
}

.avatar-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
}

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.user-phone {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.8);
}

.edit-btn {
  font-size: 28rpx;
  color: #ffffff;
  padding: 10rpx 20rpx;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
  border-radius: 30rpx;
}

.stats-section {
  background: #ffffff;
  margin: -30rpx 30rpx 30rpx;
  border-radius: 20rpx;
  padding: 40rpx 0;
  display: flex;
  justify-content: space-around;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.stat-number {
  font-size: 48rpx;
  font-weight: bold;
  color: #FF8C00;
}

.stat-label {
  font-size: 26rpx;
  color: #666;
}

.menu-section {
  background: #ffffff;
  border-radius: 20rpx;
  margin: 0 30rpx 30rpx;
  padding: 0 30rpx;
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
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}

.menu-arrow {
  font-size: 28rpx;
  color: #999;
}
</style>
