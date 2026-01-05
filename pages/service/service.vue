<template>
  <view class="container">
    <view class="service-header">
      <view class="service-icon">{{ service.icon }}</view>
      <text class="service-name">{{ service.name }}</text>
      <text class="service-price">¥{{ service.price }}/次</text>
    </view>

    <view class="service-content">
      <view class="section">
        <view class="section-title">服务内容</view>
        <view class="content-list">
          <view class="content-item" v-for="(item, index) in service.contents" :key="index">
            <text class="item-icon">✓</text>
            <text class="item-text">{{ item }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">服务说明</view>
        <text class="description">{{ service.description }}</text>
      </view>

      <view class="section">
        <view class="section-title">服务时长</view>
        <text class="duration">{{ service.duration }}</text>
      </view>

      <view class="section">
        <view class="section-title">温馨提示</view>
        <view class="tips">
          <text class="tip-item" v-for="(tip, index) in tips" :key="index">• {{ tip }}</text>
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="btn" @click="goToBooking">立即预约</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      service: {
        id: 1,
        name: '标准喂猫服务',
        price: 59,
        icon: '🎮',
        contents: [
          '定时定量喂食猫粮',
          '更换清洁饮用水',
          '清理并更换猫砂',
          '陪伴猫咪玩耍互动',
          '检查猫咪健康状况'
        ],
        description: '专业的上门喂猫服务，为您的爱猫提供贴心的照顾，让您出门在外也能安心。',
        duration: '约30-40分钟'
      },
      tips: [
        '请提前1天预约，方便安排服务人员',
        '服务人员均经过专业培训，持有相关证书',
        '服务过程中会实时拍照反馈',
        '如需临时取消，请提前2小时联系客服'
      ]
    }
  },
  onLoad(options) {
    if (options.id) {
      this.loadServiceDetail(options.id)
    }
    if (options.name) {
      this.service.name = decodeURIComponent(options.name)
    }
    if (options.price) {
      this.service.price = parseFloat(options.price)
    }
  },
  methods: {
    loadServiceDetail(id) {
      // 根据id加载服务详情
      // 这里可以使用不同的服务数据
      const services = {
        1: {
          icon: '🍽️',
          contents: ['定时定量喂食猫粮', '更换清洁饮用水', '清理并更换猫砂']
        },
        2: {
          icon: '🎮',
          contents: ['定时定量喂食猫粮', '更换清洁饮用水', '清理并更换猫砂', '陪伴猫咪玩耍互动', '检查猫咪健康状况']
        },
        3: {
          icon: '❤️',
          contents: ['定时定量喂食猫粮', '更换清洁饮用水', '清理并更换猫砂', '陪伴猫咪玩耍互动', '健康检查评估', '简单医疗处理']
        },
        4: {
          icon: '👑',
          contents: ['定时定量喂食猫粮', '更换清洁饮用水', '清理并更换猫砂', '陪伴猫咪玩耍互动', '健康检查评估', '详细视频报告', '24小时在线咨询']
        }
      }
      const serviceData = services[id]
      if (serviceData) {
        this.service.icon = serviceData.icon
        this.service.contents = serviceData.contents
      }
    },
    goToBooking() {
      uni.navigateTo({
        url: `/pages/booking/booking?serviceId=${this.service.id}&serviceName=${this.service.name}&price=${this.service.price}`
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #FFF8DC;
  padding-bottom: 120rpx;
}

.service-header {
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  padding: 60rpx 30rpx;
  text-align: center;
  color: #ffffff;
}

.service-icon {
  font-size: 100rpx;
  margin-bottom: 20rpx;
}

.service-name {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
}

.service-price {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.service-content {
  padding: 30rpx;
}

.section {
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
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.content-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.content-item {
  display: flex;
  align-items: flex-start;
  gap: 15rpx;
}

.item-icon {
  color: #4CAF50;
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 5rpx;
}

.item-text {
  font-size: 28rpx;
  color: #666;
  line-height: 1.6;
  flex: 1;
}

.description {
  font-size: 28rpx;
  color: #666;
  line-height: 1.8;
}

.duration {
  font-size: 28rpx;
  color: #666;
}

.tips {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.tip-item {
  font-size: 26rpx;
  color: #999;
  line-height: 1.6;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: #ffffff;
  border-top: 1rpx solid #eee;
}

.btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: #FF8C00;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  border: none;
}
</style>
