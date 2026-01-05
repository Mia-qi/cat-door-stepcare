<template>
  <view class="container">
    <view class="header">
      <text class="logo">🐱</text>
      <text class="title">喂猫师傅端</text>
      <text class="subtitle">专业服务，从登录开始</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="label">手机号</text>
        <input 
          class="input" 
          v-model="formData.phone" 
          type="number"
          placeholder="请输入手机号"
          maxlength="11"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">密码</text>
        <input 
          class="input" 
          v-model="formData.password" 
          type="password"
          placeholder="请输入密码"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-options">
        <text class="forgot-password" @click="forgotPassword">忘记密码？</text>
      </view>

      <button class="login-btn" @click="handleLogin">登录</button>

      <view class="register-link">
        <text class="register-text">还没有账号？</text>
        <text class="register-btn" @click="goToRegister">立即注册</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        phone: '',
        password: ''
      }
    }
  },
  methods: {
    validateForm() {
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return false
      }
      if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        })
        return false
      }
      if (this.formData.password.length < 6) {
        uni.showToast({
          title: '密码至少6位',
          icon: 'none'
        })
        return false
      }
      return true
    },
    handleLogin() {
      if (!this.validateForm()) {
        return
      }

      uni.showLoading({
        title: '登录中...'
      })

      // 模拟登录API调用
      setTimeout(() => {
        uni.hideLoading()
        
        // 保存登录信息
        uni.setStorageSync('master_token', 'mock_token_' + Date.now())
        uni.setStorageSync('master_phone', this.formData.phone)
        uni.setStorageSync('master_logged_in', true)
        uni.setStorageSync('current_role', 'master')
        
        uni.showToast({
          title: '登录成功',
          icon: 'success'
        })

        setTimeout(() => {
          // 跳转到首页
          uni.reLaunch({
            url: '/pages/master/index'
          })
        }, 1500)
      }, 1000)
    },
    goToRegister() {
      uni.navigateTo({
        url: '/pages/master/register'
      })
    },
    forgotPassword() {
      uni.showToast({
        title: '忘记密码功能',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  padding: 100rpx 60rpx;
}

.header {
  text-align: center;
  margin-bottom: 100rpx;
}

.logo {
  font-size: 120rpx;
  display: block;
  margin-bottom: 30rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 28rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.form-container {
  background: #ffffff;
  border-radius: 30rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0, 0, 0, 0.1);
}

.form-item {
  margin-bottom: 40rpx;
}

.label {
  font-size: 28rpx;
  color: #333;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 30rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.form-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 40rpx;
}

.forgot-password {
  font-size: 26rpx;
  color: #FF8C00;
}

.login-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;
  margin-bottom: 40rpx;
}

.register-link {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rpx;
}

.register-text {
  font-size: 26rpx;
  color: #999;
}

.register-btn {
  font-size: 26rpx;
  color: #FF8C00;
  font-weight: bold;
}
</style>
