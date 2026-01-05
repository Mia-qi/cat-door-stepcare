<template>
  <view class="container">
    <view class="order-info">
      <view class="info-section">
        <view class="section-title">订单状态</view>
        <view class="status-box" :class="'status-' + order.status">
          <text class="status-text">{{ getStatusText(order.status) }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">服务信息</view>
        <view class="info-item">
          <text class="label">服务项目：</text>
          <text class="value">{{ order.serviceName }}</text>
        </view>
        <view class="info-item">
          <text class="label">服务时间：</text>
          <text class="value">{{ order.serviceTime }}</text>
        </view>
        <view class="info-item">
          <text class="label">服务地址：</text>
          <text class="value">{{ order.address }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">订单信息</view>
        <view class="info-item">
          <text class="label">订单号：</text>
          <text class="value">{{ order.orderNo }}</text>
        </view>
        <view class="info-item">
          <text class="label">下单时间：</text>
          <text class="value">{{ order.createTime }}</text>
        </view>
        <view class="info-item">
          <text class="label">服务人员：</text>
          <text class="value">{{ order.servicePerson || '待分配' }}</text>
        </view>
      </view>

      <view class="info-section">
        <view class="section-title">费用明细</view>
        <view class="price-item">
          <text class="label">服务费用</text>
          <text class="value">¥{{ order.price }}</text>
        </view>
        <view class="price-total">
          <text class="label">实付金额</text>
          <text class="value total">¥{{ order.price }}</text>
        </view>
      </view>
    </view>

    <view class="actions">
      <button class="btn secondary" v-if="order.status === 0" @click="cancelOrder">取消订单</button>
      <button class="btn primary" v-if="order.status === 0" @click="payOrder">立即支付</button>
      <button class="btn secondary" v-if="order.status === 1" @click="contactService">联系服务人员</button>
      <button class="btn primary" v-if="order.status === 2" @click="evaluateOrder">评价服务</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      orderId: '',
      order: {
        id: 1,
        orderNo: '202401150001',
        serviceName: '标准喂猫服务',
        serviceTime: '2024-01-16 10:00',
        address: '北京市朝阳区xxx小区1号楼101',
        price: 59,
        status: 0,
        createTime: '2024-01-15 14:30:00',
        servicePerson: '张师傅'
      }
    }
  },
  onLoad(options) {
    this.orderId = options.id
    this.loadOrderDetail()
  },
  methods: {
    loadOrderDetail() {
      // 这里应该调用API获取订单详情
      // 暂时使用模拟数据
    },
    getStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待服务',
        2: '已完成'
      }
      return statusMap[status] || '未知'
    },
    cancelOrder() {
      uni.showModal({
        title: '提示',
        content: '确定要取消这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '订单已取消',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    },
    payOrder() {
      uni.showToast({
        title: '跳转支付',
        icon: 'none'
      })
    },
    contactService() {
      uni.makePhoneCall({
        phoneNumber: '13800138000'
      })
    },
    evaluateOrder() {
      uni.showToast({
        title: '跳转评价',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #FFF8DC;
  padding: 30rpx;
  padding-bottom: 160rpx;
}

.order-info {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.info-section {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.status-box {
  text-align: center;
  padding: 40rpx;
  border-radius: 15rpx;

  &.status-0 {
    background: #FFF8E1;
  }

  &.status-1 {
    background: #E8F5E9;
  }

  &.status-2 {
    background: #F5F5F5;
  }
}

.status-text {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.info-item,
.price-item {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}

.label {
  font-size: 28rpx;
  color: #666;
}

.value {
  font-size: 28rpx;
  color: #333;
}

.price-total {
  display: flex;
  justify-content: space-between;
  padding: 20rpx 0;
  margin-top: 20rpx;
  border-top: 2rpx solid #f0f0f0;

  .label {
    font-size: 32rpx;
    font-weight: bold;
    color: #333;
  }

  .total {
    font-size: 36rpx;
    font-weight: bold;
    color: #FF8C00;
  }
}

.actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: #ffffff;
  border-top: 1rpx solid #eee;
  display: flex;
  gap: 20rpx;
}

.btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 32rpx;
  border: none;

  &.primary {
    background: #FF8C00;
    color: #ffffff;
  }

  &.secondary {
    background: #f5f5f5;
    color: #666;
  }
}
</style>
