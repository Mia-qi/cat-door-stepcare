<template>
  <view class="container">
    <view class="service-card">
      <text class="card-title">选择服务</text>
      <view class="service-info">
        <text class="service-name">{{ booking.serviceName || '请选择服务' }}</text>
        <text class="service-price" v-if="booking.price">¥{{ booking.price }}/次</text>
      </view>
      <button class="select-btn" @click="selectService">选择服务项目</button>
    </view>

    <view class="form-section">
      <view class="form-item">
        <text class="label">服务时间 *</text>
        <picker mode="date" :value="booking.date" @change="onDateChange" :start="minDate">
          <view class="picker">
            <text :class="{ placeholder: !booking.date }">{{ booking.date || '请选择日期' }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">服务时段 *</text>
        <picker mode="time" :value="booking.time" @change="onTimeChange">
          <view class="picker">
            <text :class="{ placeholder: !booking.time }">{{ booking.time || '请选择时间' }}</text>
            <text class="arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">服务地址 *</text>
        <input 
          class="input" 
          v-model="booking.address" 
          placeholder="请输入详细地址"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">联系人 *</text>
        <input 
          class="input" 
          v-model="booking.contact" 
          placeholder="请输入联系人姓名"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">联系电话 *</text>
        <input 
          class="input" 
          v-model="booking.phone" 
          type="number"
          placeholder="请输入联系电话"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">猫咪信息</text>
        <textarea 
          class="textarea" 
          v-model="booking.catInfo" 
          placeholder="请描述猫咪的基本信息（品种、年龄、特殊注意事项等）"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">备注</text>
        <textarea 
          class="textarea" 
          v-model="booking.remark" 
          placeholder="其他需要说明的事项"
          placeholder-style="color: #999"
        />
      </view>
    </view>

    <view class="price-section">
      <view class="price-item">
        <text class="label">服务费用</text>
        <text class="value">¥{{ booking.price || 0 }}</text>
      </view>
    </view>

    <view class="footer">
      <view class="total-price">
        <text class="label">合计：</text>
        <text class="value">¥{{ booking.price || 0 }}</text>
      </view>
      <button class="submit-btn" @click="submitOrder">提交订单</button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    
    return {
      minDate: `${year}-${month}-${day}`,
      booking: {
        serviceId: '',
        serviceName: '',
        price: 0,
        date: '',
        time: '',
        address: '',
        contact: '',
        phone: '',
        catInfo: '',
        remark: ''
      }
    }
  },
  onLoad(options) {
    if (options.serviceId) {
      this.booking.serviceId = options.serviceId
    }
    if (options.serviceName) {
      this.booking.serviceName = decodeURIComponent(options.serviceName)
    }
    if (options.price) {
      this.booking.price = parseFloat(options.price)
    }
  },
  methods: {
    selectService() {
      uni.showActionSheet({
        itemList: ['基础喂猫 - ¥39', '标准喂猫 - ¥59', '贴心喂猫 - ¥79', 'VIP喂猫 - ¥99'],
        success: (res) => {
          const services = [
            { id: 1, name: '基础喂猫', price: 39 },
            { id: 2, name: '标准喂猫', price: 59 },
            { id: 3, name: '贴心喂猫', price: 79 },
            { id: 4, name: 'VIP喂猫', price: 99 }
          ]
          const selected = services[res.tapIndex]
          this.booking.serviceId = selected.id
          this.booking.serviceName = selected.name
          this.booking.price = selected.price
        }
      })
    },
    onDateChange(e) {
      this.booking.date = e.detail.value
    },
    onTimeChange(e) {
      this.booking.time = e.detail.value
    },
    validateForm() {
      if (!this.booking.serviceName) {
        uni.showToast({
          title: '请选择服务项目',
          icon: 'none'
        })
        return false
      }
      if (!this.booking.date) {
        uni.showToast({
          title: '请选择服务日期',
          icon: 'none'
        })
        return false
      }
      if (!this.booking.time) {
        uni.showToast({
          title: '请选择服务时间',
          icon: 'none'
        })
        return false
      }
      if (!this.booking.address) {
        uni.showToast({
          title: '请输入服务地址',
          icon: 'none'
        })
        return false
      }
      if (!this.booking.contact) {
        uni.showToast({
          title: '请输入联系人',
          icon: 'none'
        })
        return false
      }
      if (!this.booking.phone) {
        uni.showToast({
          title: '请输入联系电话',
          icon: 'none'
        })
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.booking.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return false
      }
      return true
    },
    submitOrder() {
      if (!this.validateForm()) {
        return
      }
      
      uni.showLoading({
        title: '提交中...'
      })
      
      // 模拟提交订单
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '订单提交成功',
          icon: 'success'
        })
        setTimeout(() => {
          uni.navigateTo({
            url: '/pages/order/order'
          })
        }, 1500)
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: #FFF8DC;
  padding: 30rpx;
  padding-bottom: 200rpx;
}

.service-card {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.card-title {
  font-size: 28rpx;
  color: #999;
  display: block;
  margin-bottom: 20rpx;
}

.service-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.service-name {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.service-price {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF8C00;
}

.select-btn {
  width: 100%;
  height: 70rpx;
  line-height: 70rpx;
  border: 1rpx solid #FF8C00;
  color: #FF8C00;
  background: transparent;
  border-radius: 35rpx;
  font-size: 28rpx;
}

.form-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.form-item {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 15rpx;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  font-size: 28rpx;

  .placeholder {
    color: #999;
  }
}

.arrow {
  color: #999;
  font-size: 28rpx;
}

.input {
  width: 100%;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.textarea {
  width: 100%;
  min-height: 150rpx;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 10rpx;
  font-size: 28rpx;
  color: #333;
}

.price-section {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.price-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-item .label {
  margin-bottom: 0;
}

.price-item .value {
  font-size: 32rpx;
  font-weight: bold;
  color: #FF8C00;
}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 30rpx;
  background: #ffffff;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.total-price {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 10rpx;

  .label {
    font-size: 28rpx;
    color: #666;
    margin-bottom: 0;
  }

  .value {
    font-size: 36rpx;
    font-weight: bold;
    color: #FF8C00;
  }
}

.submit-btn {
  width: 300rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #FF8C00;
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  border: none;
}
</style>
