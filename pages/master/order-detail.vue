<template>
  <view class="container">
    <view class="order-info">
      <!-- 订单状态 -->
      <view class="status-section">
        <view class="status-box" :class="'status-' + order.status">
          <text class="status-text">{{ getStatusText(order.status) }}</text>
        </view>
      </view>

      <!-- 订单基本信息 -->
      <view class="info-section">
        <view class="section-title">订单信息</view>
        <view class="info-item">
          <text class="label">订单号：</text>
          <text class="value">{{ order.orderNo }}</text>
        </view>
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
        <view class="info-item">
          <text class="label">服务费用：</text>
          <text class="value price">¥{{ order.price }}</text>
        </view>
      </view>

      <!-- 客户信息 -->
      <view class="info-section">
        <view class="section-title">客户信息</view>
        <view class="info-item">
          <text class="label">客户姓名：</text>
          <text class="value">{{ order.customerName }}</text>
        </view>
        <view class="info-item">
          <text class="label">联系电话：</text>
          <text class="value">{{ order.customerPhone }}</text>
          <text class="action-link" @click="callCustomer">拨打</text>
        </view>
        <view class="info-item">
          <text class="label">距离：</text>
          <text class="value">{{ order.distance }}km</text>
        </view>
        <view class="info-item" v-if="order.catInfo">
          <text class="label">猫咪信息：</text>
          <text class="value">{{ order.catInfo }}</text>
        </view>
        <view class="info-item" v-if="order.remark">
          <text class="label">备注：</text>
          <text class="value">{{ order.remark }}</text>
        </view>
      </view>

      <!-- 服务操作 -->
      <view class="info-section" v-if="order.status === 1">
        <view class="section-title">服务操作</view>
        <view class="action-list">
          <button class="action-btn" @click="uploadPhoto">上传服务照片</button>
          <button class="action-btn" @click="addNote">添加服务记录</button>
        </view>
      </view>

      <!-- 服务记录 -->
      <view class="info-section" v-if="serviceRecords.length > 0">
        <view class="section-title">服务记录</view>
        <view class="record-list">
          <view class="record-item" v-for="(record, index) in serviceRecords" :key="index">
            <view class="record-time">{{ record.time }}</view>
            <view class="record-content">{{ record.content }}</view>
            <image v-if="record.photo" :src="record.photo" class="record-photo" mode="aspectFill"></image>
          </view>
        </view>
      </view>
    </view>

    <!-- 底部操作按钮 -->
    <view class="footer-actions">
      <button 
        class="footer-btn primary" 
        v-if="order.status === 0"
        @click="acceptOrder"
      >
        接单
      </button>
      <button 
        class="footer-btn primary" 
        v-if="order.status === 1"
        @click="startService"
      >
        开始服务
      </button>
      <button 
        class="footer-btn success" 
        v-if="order.status === 1"
        @click="completeService"
      >
        完成服务
      </button>
      <button 
        class="footer-btn" 
        v-if="order.status === 0"
        @click="rejectOrder"
      >
        拒绝接单
      </button>
      <button 
        class="footer-btn" 
        @click="navigateToAddress"
      >
        导航
      </button>
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
        status: 0, // 0-待接单 1-进行中 2-已完成
        customerName: '张女士',
        customerPhone: '13800138000',
        distance: 2.5,
        catInfo: '橘猫，2岁，性格温顺',
        remark: '请按时到达，谢谢'
      },
      serviceRecords: []
    }
  },
  onLoad(options) {
    // 检查登录状态
    const masterLoggedIn = uni.getStorageSync('master_logged_in')
    if (!masterLoggedIn) {
      uni.reLaunch({
        url: '/pages/master/login'
      })
      return
    }
    
    if (options.id) {
      this.orderId = options.id
      this.loadOrderDetail()
    }
    if (options.action === 'start') {
      // 自动开始服务
      setTimeout(() => {
        this.startService()
      }, 500)
    }
  },
  methods: {
    loadOrderDetail() {
      // 加载订单详情
      // 这里应该调用API获取订单详情
    },
    getStatusText(status) {
      const statusMap = {
        0: '待接单',
        1: '进行中',
        2: '已完成'
      }
      return statusMap[status] || '未知'
    },
    callCustomer() {
      uni.makePhoneCall({
        phoneNumber: this.order.customerPhone
      })
    },
    navigateToAddress() {
      uni.openLocation({
        latitude: 39.908823, // 示例经纬度
        longitude: 116.397470,
        name: '服务地址',
        address: this.order.address
      })
    },
    acceptOrder() {
      uni.showModal({
        title: '确认接单',
        content: `确定要接取订单 ${this.order.orderNo} 吗？`,
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '处理中...'
            })
            
            setTimeout(() => {
              uni.hideLoading()
              this.order.status = 1
              uni.showToast({
                title: '接单成功',
                icon: 'success'
              })
            }, 1000)
          }
        }
      })
    },
    rejectOrder() {
      uni.showModal({
        title: '拒绝接单',
        content: '确定要拒绝这个订单吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({
              title: '已拒绝接单',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          }
        }
      })
    },
    startService() {
      uni.showModal({
        title: '开始服务',
        content: '确定要开始服务吗？',
        success: (res) => {
          if (res.confirm) {
            this.order.status = 1
            this.addServiceRecord('开始服务')
            uni.showToast({
              title: '服务已开始',
              icon: 'success'
            })
          }
        }
      })
    },
    completeService() {
      uni.showModal({
        title: '完成服务',
        content: '确定已完成该订单的服务吗？完成后将无法修改',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '提交中...'
            })
            
            setTimeout(() => {
              uni.hideLoading()
              this.order.status = 2
              uni.showToast({
                title: '服务已完成',
                icon: 'success'
              })
              
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            }, 1000)
          }
        }
      })
    },
    uploadPhoto() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          
          uni.showLoading({
            title: '上传中...'
          })
          
          setTimeout(() => {
            uni.hideLoading()
            this.addServiceRecord('上传服务照片', tempFilePath)
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            })
          }, 1000)
        }
      })
    },
    addNote() {
      uni.showModal({
        title: '添加服务记录',
        editable: true,
        placeholderText: '请输入服务内容',
        success: (res) => {
          if (res.confirm && res.content) {
            this.addServiceRecord(res.content)
            uni.showToast({
              title: '添加成功',
              icon: 'success'
            })
          }
        }
      })
    },
    addServiceRecord(content, photo = '') {
      const record = {
        time: this.formatTime(new Date()),
        content: content,
        photo: photo
      }
      this.serviceRecords.push(record)
    },
    formatTime(date) {
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const hour = String(date.getHours()).padStart(2, '0')
      const minute = String(date.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
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

.status-section {
  text-align: center;
  margin-bottom: 40rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.status-box {
  display: inline-block;
  padding: 20rpx 60rpx;
  border-radius: 50rpx;

  &.status-0 {
    background: #FFF3E0;
  }

  &.status-1 {
    background: #E3F2FD;
  }

  &.status-2 {
    background: #E8F5E9;
  }
}

.status-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
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

.info-item {
  display: flex;
  align-items: flex-start;
  padding: 20rpx 0;
  border-bottom: 1rpx solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
}

.label {
  font-size: 28rpx;
  color: #666;
  width: 160rpx;
  flex-shrink: 0;
}

.value {
  flex: 1;
  font-size: 28rpx;
  color: #333;

  &.price {
    font-size: 32rpx;
    font-weight: bold;
    color: #FF8C00;
  }
}

.action-link {
  font-size: 26rpx;
  color: #FF8C00;
  margin-left: 20rpx;
}

.action-list {
  display: flex;
  gap: 20rpx;
}

.action-btn {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  background: #f5f5f5;
  color: #333;
  border-radius: 35rpx;
  font-size: 26rpx;
  border: none;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.record-item {
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 15rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999;
  margin-bottom: 10rpx;
}

.record-content {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 10rpx;
}

.record-photo {
  width: 100%;
  max-height: 400rpx;
  border-radius: 10rpx;
}

.footer-actions {
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

.footer-btn {
  flex: 1;
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  border: none;
  background: #f5f5f5;
  color: #666;

  &.primary {
    background: #FF8C00;
    color: #ffffff;
  }

  &.success {
    background: #4CAF50;
    color: #ffffff;
  }
}
</style>
