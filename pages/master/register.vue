<template>
  <view class="container">
    <view class="header">
      <text class="title">注册成为喂猫师傅</text>
      <text class="subtitle">加入我们，开启专业服务之旅</text>
    </view>

    <view class="form-container">
      <view class="form-item">
        <text class="label">手机号 *</text>
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
        <text class="label">验证码 *</text>
        <view class="code-input-wrapper">
          <input 
            class="input code-input" 
            v-model="formData.code" 
            type="number"
            placeholder="请输入验证码"
            maxlength="6"
            placeholder-style="color: #999"
          />
          <button 
            class="code-btn" 
            :disabled="codeCountdown > 0"
            @click="sendCode"
          >
            {{ codeCountdown > 0 ? `${codeCountdown}秒后重试` : '获取验证码' }}
          </button>
        </view>
      </view>

      <view class="form-item">
        <text class="label">密码 *</text>
        <input 
          class="input" 
          v-model="formData.password" 
          type="password"
          placeholder="请输入密码（至少6位）"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">确认密码 *</text>
        <input 
          class="input" 
          v-model="formData.confirmPassword" 
          type="password"
          placeholder="请再次输入密码"
          placeholder-style="color: #999"
        />
      </view>

      <view class="form-item">
        <text class="label">真实姓名 *</text>
        <input 
          class="input" 
          v-model="formData.realName" 
          placeholder="请输入真实姓名"
          placeholder-style="color: #999"
        />
      </view>

      <view class="agreement">
        <checkbox-group @change="agreeChange">
          <label class="agreement-item">
            <checkbox value="agree" :checked="agreed" color="#FF8C00" />
            <text class="agreement-text">我已阅读并同意</text>
            <text class="agreement-link" @click.stop="viewAgreement">《服务协议》</text>
          </label>
        </checkbox-group>
      </view>

      <button class="register-btn" @click="handleRegister">立即注册</button>

      <view class="login-link">
        <text class="login-text">已有账号？</text>
        <text class="login-btn-text" @click="goToLogin">立即登录</text>
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
        code: '',
        password: '',
        confirmPassword: '',
        realName: ''
      },
      agreed: false,
      codeCountdown: 0
    }
  },
  methods: {
    agreeChange(e) {
      this.agreed = e.detail.value.includes('agree')
    },
    sendCode() {
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入手机号',
          icon: 'none'
        })
        return
      }
      if (!/^1[3-9]\d{9}$/.test(this.formData.phone)) {
        uni.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        })
        return
      }

      uni.showLoading({
        title: '发送中...'
      })

      // 模拟发送验证码
      setTimeout(() => {
        uni.hideLoading()
        uni.showToast({
          title: '验证码已发送',
          icon: 'success'
        })

        // 开始倒计时
        this.codeCountdown = 60
        const timer = setInterval(() => {
          this.codeCountdown--
          if (this.codeCountdown <= 0) {
            clearInterval(timer)
          }
        }, 1000)
      }, 1000)
    },
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
      if (!this.formData.code) {
        uni.showToast({
          title: '请输入验证码',
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
      if (this.formData.password !== this.formData.confirmPassword) {
        uni.showToast({
          title: '两次密码不一致',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.realName) {
        uni.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        })
        return false
      }
      if (!this.agreed) {
        uni.showToast({
          title: '请同意服务协议',
          icon: 'none'
        })
        return false
      }
      return true
    },
    handleRegister() {
      if (!this.validateForm()) {
        return
      }

      uni.showLoading({
        title: '注册中...'
      })

      // 模拟注册API调用
      setTimeout(() => {
        uni.hideLoading()
        
        // 保存注册信息，自动登录
        uni.setStorageSync('master_token', 'mock_token_' + Date.now())
        uni.setStorageSync('master_phone', this.formData.phone)
        uni.setStorageSync('master_name', this.formData.realName)
        uni.setStorageSync('master_logged_in', true)
        uni.setStorageSync('current_role', 'master')
        
        uni.showToast({
          title: '注册成功',
          icon: 'success'
        })

        setTimeout(() => {
          // 跳转到实名认证
          uni.reLaunch({
            url: '/pages/master/certification'
          })
        }, 1500)
      }, 1000)
    },
    goToLogin() {
      uni.navigateBack()
    },
    viewAgreement() {
      uni.showModal({
        title: '服务协议',
        content: '这里显示服务协议内容...',
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
  padding: 60rpx 30rpx;
}

.header {
  text-align: center;
  margin-bottom: 60rpx;
}

.title {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  display: block;
  margin-bottom: 20rpx;
}

.subtitle {
  font-size: 26rpx;
  color: #999;
  display: block;
}

.form-container {
  background: #ffffff;
  border-radius: 30rpx;
  padding: 50rpx 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
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

.code-input-wrapper {
  display: flex;
  gap: 20rpx;
  align-items: center;
}

.code-input {
  flex: 1;
}

.code-btn {
  width: 200rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #FF8C00;
  color: #ffffff;
  border-radius: 20rpx;
  font-size: 26rpx;
  border: none;
  padding: 0;
  
  &[disabled] {
    background: #ccc;
    color: #999;
  }
}

.agreement {
  margin-bottom: 40rpx;
}

.agreement-item {
  display: flex;
  align-items: center;
  gap: 10rpx;
}

.agreement-text {
  font-size: 26rpx;
  color: #666;
}

.agreement-link {
  font-size: 26rpx;
  color: #FF8C00;
}

.register-btn {
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

.login-link {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10rpx;
}

.login-text {
  font-size: 26rpx;
  color: #999;
}

.login-btn-text {
  font-size: 26rpx;
  color: #FF8C00;
  font-weight: bold;
}
</style>
