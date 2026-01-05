<template>
  <view class="container">
    <!-- 顶部状态栏 -->
    <view class="status-bar">
      <view class="status-item" @click="checkCertification">
        <view class="status-icon" :class="certStatusClass">{{ certStatusIcon }}</view>
        <view class="status-info">
          <text class="status-title">认证状态</text>
          <text class="status-desc">{{ certStatusText }}</text>
        </view>
        <text class="status-arrow">></text>
      </view>
      <view class="status-item" @click="viewStats">
        <view class="status-icon stats">📊</view>
        <view class="status-info">
          <text class="status-title">本月收入</text>
          <text class="status-desc income">¥{{ monthlyIncome }}</text>
        </view>
        <text class="status-arrow">></text>
      </view>
    </view>

    <!-- 接单状态切换 -->
    <view class="work-status">
      <text class="status-label">接单状态</text>
      <switch :checked="isWorking" @change="toggleWorkStatus" color="#FF8C00" />
      <text class="status-text">{{ isWorking ? '接单中' : '已暂停' }}</text>
    </view>

    <!-- 订单筛选 -->
    <view class="filter-tabs">
      <view 
        class="tab-item" 
        :class="{ active: currentTab === index }"
        v-for="(tab, index) in tabs" 
        :key="index"
        @click="switchTab(index)"
      >
        <text>{{ tab.name }}</text>
        <text v-if="tab.count > 0" class="tab-count">{{ tab.count }}</text>
      </view>
    </view>

    <!-- 订单列表 -->
    <view class="order-list">
      <view 
        class="order-item" 
        v-for="(order, index) in filteredOrders" 
        :key="index"
        @click="viewOrderDetail(order)"
      >
        <view class="order-header">
          <view class="order-info">
            <text class="order-number">订单号：{{ order.orderNo }}</text>
            <text class="order-status" :class="'status-' + order.status">{{ getStatusText(order.status) }}</text>
          </view>
          <text class="order-price">¥{{ order.price }}</text>
        </view>

        <view class="order-content">
          <view class="content-row">
            <text class="label">服务项目：</text>
            <text class="value">{{ order.serviceName }}</text>
          </view>
          <view class="content-row">
            <text class="label">服务时间：</text>
            <text class="value">{{ order.serviceTime }}</text>
          </view>
          <view class="content-row">
            <text class="label">服务地址：</text>
            <text class="value">{{ order.address }}</text>
          </view>
          <view class="content-row">
            <text class="label">客户信息：</text>
            <text class="value">{{ order.customerName }} {{ order.customerPhone }}</text>
          </view>
        </view>

        <view class="order-footer">
          <text class="order-distance">距离：{{ order.distance }}km</text>
          <view class="order-actions">
            <button 
              class="action-btn primary" 
              v-if="order.status === 0"
              @click.stop="acceptOrder(order)"
            >
              接单
            </button>
            <button 
              class="action-btn" 
              v-if="order.status === 1"
              @click.stop="startService(order)"
            >
              开始服务
            </button>
            <button 
              class="action-btn" 
              v-if="order.status === 2"
              @click.stop="completeOrder(order)"
            >
              完成服务
            </button>
          </view>
        </view>
      </view>

      <view v-if="filteredOrders.length === 0" class="empty">
        <text class="empty-icon">📭</text>
        <text class="empty-text">暂无订单</text>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <view class="bottom-nav">
      <view class="nav-item active" @click="goToPage('/pages/master/index')">
        <text class="nav-icon">📋</text>
        <text class="nav-text">接单</text>
      </view>
      <view class="nav-item" @click="goToPage('/pages/master/profile')">
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
      isWorking: true, // 是否接单中
      currentTab: 0, // 当前选中的tab
      certStatus: 0, // 0: 未认证, 1: 审核中, 2: 已认证, 3: 认证失败
      monthlyIncome: 2580,
      tabs: [
        { name: '全部', status: -1, count: 0 },
        { name: '待接单', status: 0, count: 3 },
        { name: '进行中', status: 1, count: 2 },
        { name: '已完成', status: 2, count: 15 }
      ],
      orders: [
        {
          id: 1,
          orderNo: '202401150001',
          serviceName: '标准喂猫服务',
          serviceTime: '2024-01-16 10:00',
          address: '北京市朝阳区xxx小区1号楼101',
          price: 59,
          status: 0, // 0-待接单 1-进行中 2-已完成
          customerName: '张女士',
          customerPhone: '138****8888',
          distance: 2.5
        },
        {
          id: 2,
          orderNo: '202401150002',
          serviceName: '贴心喂猫服务',
          serviceTime: '2024-01-16 14:00',
          address: '北京市海淀区xxx小区2号楼202',
          price: 79,
          status: 1,
          customerName: '李先生',
          customerPhone: '139****9999',
          distance: 3.2
        },
        {
          id: 3,
          orderNo: '202401140003',
          serviceName: '基础喂猫服务',
          serviceTime: '2024-01-15 09:00',
          address: '北京市西城区xxx小区3号楼303',
          price: 39,
          status: 2,
          customerName: '王女士',
          customerPhone: '137****7777',
          distance: 1.8
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
    },
    certStatusText() {
      const statusMap = {
        0: '未认证',
        1: '审核中',
        2: '已认证',
        3: '认证失败'
      }
      return statusMap[this.certStatus] || '未认证'
    },
    certStatusIcon() {
      const iconMap = {
        0: '⚠️',
        1: '⏳',
        2: '✅',
        3: '❌'
      }
      return iconMap[this.certStatus] || '⚠️'
    },
    certStatusClass() {
      const classMap = {
        0: 'warning',
        1: 'processing',
        2: 'success',
        3: 'failed'
      }
      return classMap[this.certStatus] || 'warning'
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
    
    this.loadCertStatus()
    this.loadWorkStatus()
    // 设置当前角色
    uni.setStorageSync('current_role', 'master')
  },
  onShow() {
    this.loadCertStatus()
  },
  onPullDownRefresh() {
    // 刷新订单列表
    setTimeout(() => {
      uni.stopPullDownRefresh()
      uni.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    }, 1000)
  },
  methods: {
    loadCertStatus() {
      this.certStatus = uni.getStorageSync('master_cert_status') || 0
    },
    loadWorkStatus() {
      this.isWorking = uni.getStorageSync('master_work_status') !== false
    },
    checkCertification() {
      if (this.certStatus === 0 || this.certStatus === 3) {
        uni.navigateTo({
          url: '/pages/master/certification'
        })
      } else {
        uni.showModal({
          title: '认证状态',
          content: `当前状态：${this.certStatusText}`,
          showCancel: false
        })
      }
    },
    viewStats() {
      uni.showToast({
        title: '查看统计',
        icon: 'none'
      })
    },
    toggleWorkStatus(e) {
      this.isWorking = e.detail.value
      uni.setStorageSync('master_work_status', this.isWorking)
      
      if (!this.isWorking && this.certStatus !== 2) {
        uni.showModal({
          title: '提示',
          content: '您还未完成实名认证，建议先完成认证后再接单',
          showCancel: false
        })
      }
    },
    switchTab(index) {
      this.currentTab = index
    },
    getStatusText(status) {
      const statusMap = {
        0: '待接单',
        1: '进行中',
        2: '已完成'
      }
      return statusMap[status] || '未知'
    },
    viewOrderDetail(order) {
      uni.navigateTo({
        url: `/pages/master/order-detail?id=${order.id}`
      })
    },
    acceptOrder(order) {
      uni.showModal({
        title: '确认接单',
        content: `确定要接取订单 ${order.orderNo} 吗？`,
        success: (res) => {
          if (res.confirm) {
            // 更新订单状态
            order.status = 1
            uni.showToast({
              title: '接单成功',
              icon: 'success'
            })
            // 刷新订单列表
            this.$forceUpdate()
          }
        }
      })
    },
    startService(order) {
      uni.navigateTo({
        url: `/pages/master/order-detail?id=${order.id}&action=start`
      })
    },
    completeOrder(order) {
      uni.showModal({
        title: '完成服务',
        content: '确定已完成该订单的服务吗？',
        success: (res) => {
          if (res.confirm) {
            // 更新订单状态
            order.status = 2
            uni.showToast({
              title: '服务已完成',
              icon: 'success'
            })
            // 刷新订单列表
            this.$forceUpdate()
            // 更新tab计数
            this.tabs[2].count = Math.max(0, this.tabs[2].count - 1)
            this.tabs[3].count++
          }
        }
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
  padding-bottom: 40rpx;
}

.status-bar {
  background: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  gap: 20rpx;
}

.status-item {
  flex: 1;
  background: #f5f5f5;
  border-radius: 20rpx;
  padding: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.status-icon {
  font-size: 50rpx;
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.warning {
    background: #FFF3E0;
  }

  &.processing {
    background: #E3F2FD;
  }

  &.success {
    background: #E8F5E9;
  }

  &.failed {
    background: #FFEBEE;
  }

  &.stats {
    background: #F3E5F5;
  }
}

.status-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.status-title {
  font-size: 26rpx;
  color: #999;
}

.status-desc {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;

  &.income {
    color: #FF8C00;
    font-size: 32rpx;
  }
}

.status-arrow {
  font-size: 28rpx;
  color: #999;
}

.work-status {
  background: #ffffff;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.status-label {
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
  flex: 1;
}

.status-text {
  font-size: 28rpx;
  color: #666;
}

.filter-tabs {
  background: #ffffff;
  padding: 0 30rpx;
  display: flex;
  gap: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.tab-item {
  padding: 30rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
  display: flex;
  align-items: center;
  gap: 10rpx;

  &.active {
    color: #FF8C00;
    font-weight: bold;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4rpx;
      background: #FF8C00;
    }
  }
}

.tab-count {
  background: #FF8C00;
  color: #ffffff;
  font-size: 20rpx;
  padding: 2rpx 8rpx;
  border-radius: 20rpx;
  min-width: 32rpx;
  text-align: center;
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
  align-items: flex-start;
  margin-bottom: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.order-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
}

.order-number {
  font-size: 26rpx;
  color: #999;
}

.order-status {
  font-size: 28rpx;
  font-weight: bold;
  align-self: flex-start;
  padding: 4rpx 12rpx;
  border-radius: 20rpx;

  &.status-0 {
    background: #FFF3E0;
    color: #FF8C00;
  }

  &.status-1 {
    background: #E3F2FD;
    color: #2196F3;
  }

  &.status-2 {
    background: #E8F5E9;
    color: #4CAF50;
  }
}

.order-price {
  font-size: 36rpx;
  font-weight: bold;
  color: #FF8C00;
}

.order-content {
  margin-bottom: 20rpx;
}

.content-row {
  display: flex;
  margin-bottom: 15rpx;
  font-size: 28rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  color: #666;
  width: 160rpx;
}

.value {
  color: #333;
  flex: 1;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20rpx;
  border-top: 1rpx solid #f0f0f0;
}

.order-distance {
  font-size: 26rpx;
  color: #999;
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

.empty-icon {
  font-size: 100rpx;
  display: block;
  margin-bottom: 20rpx;
}

.empty-text {
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
