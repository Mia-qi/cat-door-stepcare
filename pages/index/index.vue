<template>
  <view class="container">
    <!-- 轮播图 -->
    <view class="banner-section">
      <view class="banner-content">
        <text class="banner-title">🐱 上门喂猫服务</text>
        <text class="banner-subtitle">专业、贴心、可靠</text>
      </view>
    </view>

    <!-- 快速下单 -->
    <view class="quick-order">
      <button class="quick-btn" @click="goToBooking">
        <text class="btn-icon">🐱</text>
        <text class="btn-text">立即预约</text>
      </button>
    </view>

    <!-- 服务项目 -->
    <view class="services-section">
      <view class="section-title">
        <text class="title-text">服务项目</text>
      </view>
      <view class="service-list">
        <view class="service-item" v-for="(service, index) in services" :key="index" @click="goToService(service)">
          <view class="service-icon">{{ service.icon }}</view>
          <text class="service-name">{{ service.name }}</text>
          <text class="service-desc">{{ service.desc }}</text>
          <text class="service-price">¥{{ service.price }}/次</text>
        </view>
      </view>
    </view>

    <!-- 服务特色 -->
    <view class="features-section">
      <view class="section-title">
        <text class="title-text">服务特色</text>
      </view>
      <view class="feature-list">
        <view class="feature-item" v-for="(feature, index) in features" :key="index">
          <view class="feature-icon">{{ feature.icon }}</view>
          <text class="feature-text">{{ feature.text }}</text>
        </view>
      </view>
    </view>

    <!-- 用户评价 -->
    <view class="reviews-section">
      <view class="section-title">
        <text class="title-text">用户评价</text>
        <text class="more-text" @click="viewMoreReviews">更多></text>
      </view>
      <view class="review-list">
        <view class="review-item" v-for="(review, index) in reviews" :key="index">
          <view class="review-header">
            <text class="review-name">{{ review.name }}</text>
            <view class="review-stars">
              <text v-for="i in 5" :key="i" class="star">{{ i <= review.rating ? '⭐' : '☆' }}</text>
            </view>
          </view>
          <text class="review-content">{{ review.content }}</text>
          <text class="review-time">{{ review.time }}</text>
        </view>
      </view>
    </view>

    <!-- 底部导航栏（替代 TabBar） -->
    <view class="bottom-nav">
      <view class="nav-item active" @click="goToPage('/pages/index/index')">
        <text class="nav-icon">🏠</text>
        <text class="nav-text">首页</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/order/order')">
        <text class="nav-icon">📋</text>
        <text class="nav-text">订单</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/profile/profile')">
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
      services: [
        {
          id: 1,
          name: '基础喂猫',
          desc: '喂食+换水+清理猫砂',
          price: 39,
          icon: '🍽️'
        },
        {
          id: 2,
          name: '标准喂猫',
          desc: '基础服务+陪伴玩耍',
          price: 59,
          icon: '🎮'
        },
        {
          id: 3,
          name: '贴心喂猫',
          desc: '标准服务+健康检查',
          price: 79,
          icon: '❤️'
        },
        {
          id: 4,
          name: 'VIP喂猫',
          desc: '贴心服务+视频报告',
          price: 99,
          icon: '👑'
        }
      ],
      features: [
        { icon: '✅', text: '专业服务' },
        { icon: '🔒', text: '安全可靠' },
        { icon: '⏰', text: '准时上门' },
        { icon: '📷', text: '实时反馈' }
      ],
      reviews: [
        {
          name: '张**',
          rating: 5,
          content: '服务很专业，猫咪很喜欢，很放心！',
          time: '2024-01-15'
        },
        {
          name: '李**',
          rating: 5,
          content: '小哥哥很细心，每天都有详细的反馈，点赞！',
          time: '2024-01-10'
        },
        {
          name: '王**',
          rating: 4,
          content: '性价比很高，下次还会预约。',
          time: '2024-01-08'
        }
      ]
    }
  },
  onLoad() {
    // 设置当前角色为用户端
    uni.setStorageSync('current_role', 'user')
  },
  onPullDownRefresh() {
    setTimeout(() => {
      uni.stopPullDownRefresh()
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    }, 1000)
  },
  methods: {
    goToBooking() {
      uni.navigateTo({
        url: '/pages/booking/booking'
      })
    },
    goToService(service) {
      uni.navigateTo({
        url: `/pages/service/service?id=${service.id}&name=${service.name}&price=${service.price}`
      })
    },
    viewMoreReviews() {
      uni.showToast({
        title: '更多评价',
        icon: 'none'
      })
    },
    goToPage(url) {
      // 使用 navigateTo 跳转（因为已经禁用了 tabBar）
      uni.navigateTo({
        url: url,
        fail: () => {
          // 如果失败，可能是路由问题，使用 reLaunch
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
  padding-bottom: 40rpx;
}

.banner-section {
  width: 100%;
  height: 400rpx;
  margin-bottom: 30rpx;
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.banner-title {
  font-size: 56rpx;
  font-weight: bold;
  color: #ffffff;
}

.banner-subtitle {
  font-size: 32rpx;
  color: rgba(255, 255, 255, 0.9);
}

.quick-order {
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}

.quick-btn {
  width: 100%;
  height: 100rpx;
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15rpx;
  border: none;
  box-shadow: 0 8rpx 20rpx rgba(255, 140, 0, 0.3);
}

.btn-icon {
  font-size: 40rpx;
}

.btn-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #ffffff;
}

.services-section,
.features-section,
.reviews-section {
  padding: 0 30rpx;
  margin-bottom: 40rpx;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.title-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.more-text {
  font-size: 28rpx;
  color: #999;
}

.service-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.service-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.service-icon {
  font-size: 60rpx;
  margin-bottom: 15rpx;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 10rpx;
}

.service-desc {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 15rpx;
  text-align: center;
}

.service-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF8C00;
}

.feature-list {
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.feature-icon {
  font-size: 50rpx;
}

.feature-text {
  font-size: 26rpx;
  color: #666;
}

.review-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.review-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15rpx;
}

.review-name {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.review-stars {
  display: flex;
  gap: 5rpx;
}

.star {
  font-size: 24rpx;
}

.review-content {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  margin-bottom: 15rpx;
  display: block;
}

.review-time {
  font-size: 24rpx;
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
  min-height: 100vh;
  padding-bottom: 120rpx; /* 为底部导航栏留出空间 */
}
</style>
