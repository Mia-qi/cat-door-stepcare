<template>
  <view class="container">
    <!-- 用户信息 -->
    <view class="user-header">
      <view class="avatar">
        <text class="avatar-text">{{ masterInfo.name ? masterInfo.name.charAt(0) : 'M' }}</text>
      </view>
      <view class="user-info">
        <text class="username">{{ masterInfo.name || '喂猫师傅' }}</text>
        <text class="user-phone" v-if="masterInfo.phone">{{ masterInfo.phone }}</text>
        <view class="cert-badge" :class="certStatusClass">
          <text class="cert-text">{{ certStatusText }}</text>
        </view>
      </view>
      <text class="edit-btn" @click="editProfile">编辑</text>
    </view>

    <!-- 统计数据 -->
    <view class="stats-section">
      <view class="stat-item" @click="viewOrders(0)">
        <text class="stat-number">{{ stats.totalOrders }}</text>
        <text class="stat-label">总订单</text>
      </view>
      <view class="stat-item" @click="viewOrders(1)">
        <text class="stat-number">{{ stats.completedOrders }}</text>
        <text class="stat-label">已完成</text>
      </view>
      <view class="stat-item" @click="viewEarnings">
        <text class="stat-number">¥{{ stats.totalEarnings }}</text>
        <text class="stat-label">总收入</text>
      </view>
      <view class="stat-item" @click="viewRating">
        <text class="stat-number">{{ stats.rating }}</text>
        <text class="stat-label">评分</text>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="menu-section">
      <view class="menu-item" @click="goToCertification">
        <text class="menu-icon">🆔</text>
        <text class="menu-text">实名认证</text>
        <text class="menu-status" :class="certStatusClass">{{ certStatusText }}</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToBankCard">
        <text class="menu-icon">💳</text>
        <text class="menu-text">银行卡管理</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="viewServiceArea">
        <text class="menu-icon">📍</text>
        <text class="menu-text">服务区域</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="viewWorkSchedule">
        <text class="menu-icon">📅</text>
        <text class="menu-text">工作排班</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 其他功能 -->
    <view class="menu-section">
      <view class="menu-item" @click="viewEarningsDetail">
        <text class="menu-icon">💰</text>
        <text class="menu-text">收益明细</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="viewEvaluation">
        <text class="menu-icon">⭐</text>
        <text class="menu-text">客户评价</text>
        <text class="menu-badge" v-if="stats.unreadEval > 0">{{ stats.unreadEval }}</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="goToSettings">
        <text class="menu-icon">⚙️</text>
        <text class="menu-text">设置</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 帮助中心 -->
    <view class="menu-section">
      <view class="menu-item" @click="helpCenter">
        <text class="menu-icon">❓</text>
        <text class="menu-text">帮助中心</text>
        <text class="menu-arrow">></text>
      </view>
      <view class="menu-item" @click="contactService">
        <text class="menu-icon">📞</text>
        <text class="menu-text">联系客服</text>
        <text class="menu-arrow">></text>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item" @click="goToPage('/pages/master/index')">
        <text class="nav-icon">📋</text>
        <text class="nav-text">接单</text>
      </view>
      <view class="nav-item active" @click="goToPage('/pages/master/profile')">
        <text class="nav-icon">👤</text>
        <text class="nav-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      certStatus: 0, // 0: 未认证, 1: 审核中, 2: 已认证, 3: 认证失败
      masterInfo: {
        name: '张师傅',
        phone: '138****8888'
      },
      stats: {
        totalOrders: 156,
        completedOrders: 148,
        totalEarnings: 8520,
        rating: 4.8,
        unreadEval: 3
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
    // 检查登录状态
    const masterLoggedIn = uni.getStorageSync('master_logged_in')
    if (!masterLoggedIn) {
      uni.reLaunch({
        url: '/pages/master/login'
      })
      return
    }
    
    this.loadMasterInfo()
    // 设置当前角色
    uni.setStorageSync('current_role', 'master')
  },
  onShow() {
    this.loadMasterInfo()
  },
  methods: {
    loadMasterInfo() {
      // 加载师傅信息
      const savedName = uni.getStorageSync('master_name')
      const savedPhone = uni.getStorageSync('master_phone')
      if (savedName) this.masterInfo.name = savedName
      if (savedPhone) this.masterInfo.phone = savedPhone
      
      // 加载认证状态
      this.certStatus = uni.getStorageSync('master_cert_status') || 0
    },
    editProfile() {
      uni.showToast({
        title: '编辑资料',
        icon: 'none'
      })
    },
    viewOrders(status) {
      uni.reLaunch({
        url: '/pages/master/index'
      })
    },
    viewEarnings() {
      uni.showToast({
        title: '查看收益',
        icon: 'none'
      })
    },
    viewRating() {
      uni.showToast({
        title: '查看评分',
        icon: 'none'
      })
    },
    goToCertification() {
      uni.navigateTo({
        url: '/pages/master/certification'
      })
    },
    goToBankCard() {
      uni.showToast({
        title: '银行卡管理',
        icon: 'none'
      })
    },
    viewServiceArea() {
      uni.showToast({
        title: '服务区域',
        icon: 'none'
      })
    },
    viewWorkSchedule() {
      uni.showToast({
        title: '工作排班',
        icon: 'none'
      })
    },
    viewEarningsDetail() {
      uni.showToast({
        title: '收益明细',
        icon: 'none'
      })
    },
    viewEvaluation() {
      uni.showToast({
        title: '客户评价',
        icon: 'none'
      })
    },
    goToSettings() {
      uni.navigateTo({
        url: '/pages/settings/settings'
      })
    },
    helpCenter() {
      uni.showToast({
        title: '帮助中心',
        icon: 'none'
      })
    },
    contactService() {
      uni.makePhoneCall({
        phoneNumber: '400-123-4567'
      })
    },
    goToPage(url) {
      // 获取当前页面路由
      const currentPages = getCurrentPages()
      const currentRoute = '/' + (currentPages[currentPages.length - 1].route || '')
      
      // 如果已经在当前页面，不跳转
      if (url === currentRoute) {
        return
      }
      
      uni.navigateTo({
        url: url,
        fail: () => {
          uni.reLaunch({
            url: url
          })
        }
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

.cert-badge {
  align-self: flex-start;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;
  font-size: 22rpx;

  &.status-pending {
    background: rgba(255, 255, 255, 0.3);
    color: #ffffff;
  }

  &.status-processing {
    background: rgba(255, 255, 255, 0.5);
    color: #ffffff;
  }

  &.status-success {
    background: rgba(76, 175, 80, 0.8);
    color: #ffffff;
  }

  &.status-failed {
    background: rgba(244, 67, 54, 0.8);
    color: #ffffff;
  }
}

.cert-text {
  font-size: 22rpx;
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
  font-size: 40rpx;
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
  width: 40rpx;
  text-align: center;
}

.menu-text {
  flex: 1;
  font-size: 30rpx;
  color: #333;
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

.menu-badge {
  background: #F44336;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 20rpx;
  margin-right: 10rpx;
  min-width: 32rpx;
  text-align: center;
}

.menu-arrow {
  font-size: 28rpx;
  color: #999;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff;
  border-top: 1rpx solid #eee;
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  z-index: 999;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}

.nav-icon {
  font-size: 44rpx;
}

.nav-text {
  font-size: 24rpx;
  color: #7A7E83;
}

.nav-item.active .nav-text {
  color: #FF8C00;
}

.container {
  padding-bottom: 120rpx; /* 为底部导航栏留出空间 */
}
</style>
