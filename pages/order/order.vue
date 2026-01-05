<template>
  <view class="container">
    <!-- 订单状态筛选 -->
    <view class="tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="switchTab(index)"
      >
        <text>{{ tab.name }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view class="order-item" v-for="(order, index) in filteredOrders" :key="index" @click="viewOrderDetail(order)">
        <view class="order-header">
          <text class="order-number">订单号：{{ order.orderNo }}</text>
          <text class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</text>
        </view>
        <view class="order-content">
          <text class="service-name">{{ order.serviceName }}</text>
          <text class="order-time">服务时间：{{ order.serviceTime }}</text>
          <text class="order-address">服务地址：{{ order.address }}</text>
        </view>
        <view class="order-footer">
          <text class="order-price">¥{{ order.price }}</text>
          <view class="order-actions">
            <button class="action-btn" v-if="order.status === 0" @click.stop="cancelOrder(order)">取消订单</button>
            <button class="action-btn primary" v-if="order.status === 0" @click.stop="payOrder(order)">立即支付</button>
            <button class="action-btn" v-if="order.status === 2" @click.stop="evaluateOrder(order)">评价</button>
          </view>
        </view>
      </view>

      <view v-if="filteredOrders.length === 0" class="empty">
        <text class="empty-text">暂无订单</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 0,
      tabs: [
        { name: '全部', status: -1 },
        { name: '待支付', status: 0 },
        { name: '待服务', status: 1 },
        { name: '已完成', status: 2 }
      ],
      orders: [
        {
          id: 1,
          orderNo: '202401150001',
          serviceName: '标准喂猫服务',
          serviceTime: '2024-01-16 10:00',
          address: '北京市朝阳区xxx小区1号楼101',
          price: 59,
          status: 0 // 0-待支付 1-待服务 2-已完成
        },
        {
          id: 2,
          orderNo: '202401140002',
          serviceName: '贴心喂猫服务',
          serviceTime: '2024-01-15 14:00',
          address: '北京市海淀区xxx小区2号楼202',
          price: 79,
          status: 1
        },
        {
          id: 3,
          orderNo: '202401130003',
          serviceName: '基础喂猫服务',
          serviceTime: '2024-01-14 09:00',
          address: '北京市西城区xxx小区3号楼303',
          price: 39,
          status: 2
        }
      ]
    }
  },
  computed: {
    filteredOrders() {
      if (this.currentTab === 0) {
        return this.orders
      }
      const status = this.tabs[this.currentTab].status
      return this.orders.filter(order => order.status === status)
    }
  },
  methods: {
    switchTab(index) {
      this.currentTab = index
    },
    getStatusText(status) {
      const statusMap = {
        0: '待支付',
        1: '待服务',
        2: '已完成'
      }
      return statusMap[status] || '未知'
    },
    viewOrderDetail(order) {
      uni.navigateTo({
        url: `/pages/order/detail?id=${order.id}`
      })
    },
    cancelOrder(order) {
      uni.showModal({
        title: '提示',
        content: '确定要取消这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '订单已取消',
              icon: 'success'
            })
          }
        }
      })
    },
    payOrder(order) {
      uni.showToast({
        title: '跳转支付',
        icon: 'none'
      })
    },
    evaluateOrder(order) {
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
}

.tabs {
  display: flex;
  background: #ffffff;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;

  &.active {
    color: #FF8C00;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60rpx;
      height: 4rpx;
      background: #FF8C00;
      border-radius: 2rpx;
    }
  }
}

.order-list {
  padding: 20rpx 30rpx;
}

.order-item {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-number {
  font-size: 26rpx;
  color: #999;
}

.order-status {
  font-size: 28rpx;
  font-weight: bold;

  &.status-0 {
    color: #FF8C00;
  }

  &.status-1 {
    color: #4CAF50;
  }

  &.status-2 {
    color: #999;
  }
}

.order-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
  margin-bottom: 20rpx;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.order-time,
.order-address {
  font-size: 28rpx;
  color: #666;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF8C00;
}

.order-actions {
  display: flex;
  gap: 15rpx;
}

.action-btn {
  padding: 10rpx 30rpx;
  font-size: 26rpx;
  border-radius: 30rpx;
  border: 1rpx solid #ddd;
  background: #ffffff;
  color: #666;

  &.primary {
    background: #FF8C00;
    color: #ffffff;
    border: none;
  }
}

.empty {
  text-align: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
