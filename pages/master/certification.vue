<template>
  <view class="container">
    <view class="info-card">
      <text class="card-title">实名认证</text>
      <text class="card-desc">完成实名认证后即可开始接单服务</text>
    </view>

    <view class="form-container">
      <!-- 认证状态提示 -->
      <view v-if="certStatus === 1" class="status-tip processing">
        <text class="tip-icon">⏳</text>
        <text class="tip-text">您的认证信息正在审核中，请耐心等待...</text>
      </view>
      <view v-if="certStatus === 2" class="status-tip success">
        <text class="tip-icon">✅</text>
        <text class="tip-text">您已完成实名认证</text>
      </view>
      <view v-if="certStatus === 3" class="status-tip failed">
        <text class="tip-icon">❌</text>
        <text class="tip-text">认证失败，请重新提交</text>
      </view>

      <view class="form-section">
        <view class="section-title">基本信息</view>
        
        <view class="form-item">
          <text class="label">真实姓名 *</text>
          <input 
            class="input" 
            v-model="formData.realName" 
            placeholder="请输入真实姓名"
            :disabled="certStatus === 1 || certStatus === 2"
            placeholder-style="color: #999"
          />
        </view>

        <view class="form-item">
          <text class="label">身份证号 *</text>
          <input 
            class="input" 
            v-model="formData.idCard" 
            type="idcard"
            placeholder="请输入18位身份证号"
            maxlength="18"
            :disabled="certStatus === 1 || certStatus === 2"
            placeholder-style="color: #999"
          />
        </view>

        <view class="form-item">
          <text class="label">联系电话 *</text>
          <input 
            class="input" 
            v-model="formData.phone" 
            type="number"
            placeholder="请输入联系电话"
            maxlength="11"
            :disabled="certStatus === 1 || certStatus === 2"
            placeholder-style="color: #999"
          />
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">身份证明</view>
        
        <view class="upload-item">
          <text class="label">身份证正面 *</text>
          <view class="upload-box" @click="uploadIdCard('front')">
            <image 
              v-if="formData.idCardFront" 
              :src="formData.idCardFront" 
              class="upload-image"
              mode="aspectFill"
            />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">📷</text>
              <text class="upload-text">点击上传</text>
            </view>
          </view>
        </view>

        <view class="upload-item">
          <text class="label">身份证反面 *</text>
          <view class="upload-box" @click="uploadIdCard('back')">
            <image 
              v-if="formData.idCardBack" 
              :src="formData.idCardBack" 
              class="upload-image"
              mode="aspectFill"
            />
            <view v-else class="upload-placeholder">
              <text class="upload-icon">📷</text>
              <text class="upload-text">点击上传</text>
            </view>
          </view>
        </view>
      </view>

      <view class="form-section">
        <view class="section-title">服务信息</view>
        
        <view class="form-item">
          <text class="label">服务区域 *</text>
          <picker 
            mode="region" 
            :value="formData.serviceArea" 
            @change="onAreaChange"
            :disabled="certStatus === 1 || certStatus === 2"
          >
            <view class="picker">
              <text :class="{ placeholder: !formData.serviceArea.length }">
                {{ formData.serviceArea.length ? formData.serviceArea.join(' ') : '请选择服务区域' }}
              </text>
              <text class="arrow">></text>
            </view>
          </picker>
        </view>

        <view class="form-item">
          <text class="label">服务经验 *</text>
          <input 
            class="input" 
            v-model="formData.experience" 
            type="number"
            placeholder="请输入服务经验（年）"
            :disabled="certStatus === 1 || certStatus === 2"
            placeholder-style="color: #999"
          />
        </view>

        <view class="form-item">
          <text class="label">个人简介</text>
          <textarea 
            class="textarea" 
            v-model="formData.introduction" 
            placeholder="请简单介绍您的服务经历和特长"
            :disabled="certStatus === 1 || certStatus === 2"
            placeholder-style="color: #999"
          />
        </view>
      </view>

      <view class="tips">
        <text class="tips-title">温馨提示：</text>
        <text class="tips-item">1. 请确保身份证信息真实有效</text>
        <text class="tips-item">2. 身份证照片需清晰可见，无反光</text>
        <text class="tips-item">3. 审核时间为1-3个工作日</text>
        <text class="tips-item">4. 认证通过后即可开始接单</text>
      </view>

      <button 
        class="submit-btn" 
        @click="handleSubmit"
        :disabled="certStatus === 1 || certStatus === 2"
      >
        {{ certStatus === 1 ? '审核中...' : certStatus === 2 ? '已认证' : '提交认证' }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      certStatus: 0, // 0: 未认证, 1: 审核中, 2: 已认证, 3: 认证失败
      formData: {
        realName: '',
        idCard: '',
        phone: '',
        idCardFront: '',
        idCardBack: '',
        serviceArea: [],
        experience: '',
        introduction: ''
      }
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
    
    this.loadCertData()
  },
  methods: {
    loadCertData() {
      // 加载认证状态
      this.certStatus = uni.getStorageSync('master_cert_status') || 0
      
      // 加载已保存的表单数据
      const savedData = uni.getStorageSync('master_cert_form')
      if (savedData) {
        this.formData = { ...this.formData, ...savedData }
      }
    },
    uploadIdCard(type) {
      if (this.certStatus === 1 || this.certStatus === 2) {
        return
      }

      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera', 'album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          
          // 模拟上传
          uni.showLoading({
            title: '上传中...'
          })
          
          setTimeout(() => {
            uni.hideLoading()
            
            if (type === 'front') {
              this.formData.idCardFront = tempFilePath
            } else {
              this.formData.idCardBack = tempFilePath
            }
            
            // 保存到本地
            uni.setStorageSync('master_cert_form', this.formData)
            
            uni.showToast({
              title: '上传成功',
              icon: 'success'
            })
          }, 1000)
        }
      })
    },
    onAreaChange(e) {
      this.formData.serviceArea = e.detail.value
      uni.setStorageSync('master_cert_form', this.formData)
    },
    validateForm() {
      if (!this.formData.realName) {
        uni.showToast({
          title: '请输入真实姓名',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.idCard) {
        uni.showToast({
          title: '请输入身份证号',
          icon: 'none'
        })
        return false
      }
      if (!/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/.test(this.formData.idCard)) {
        uni.showToast({
          title: '请输入正确的身份证号',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.phone) {
        uni.showToast({
          title: '请输入联系电话',
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
      if (!this.formData.idCardFront) {
        uni.showToast({
          title: '请上传身份证正面',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.idCardBack) {
        uni.showToast({
          title: '请上传身份证反面',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.serviceArea || this.formData.serviceArea.length === 0) {
        uni.showToast({
          title: '请选择服务区域',
          icon: 'none'
        })
        return false
      }
      if (!this.formData.experience) {
        uni.showToast({
          title: '请输入服务经验',
          icon: 'none'
        })
        return false
      }
      return true
    },
    handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      uni.showModal({
        title: '确认提交',
        content: '提交后信息将进入审核，请确认信息无误',
        success: (res) => {
          if (res.confirm) {
            uni.showLoading({
              title: '提交中...'
            })

            // 模拟提交API
            setTimeout(() => {
              uni.hideLoading()
              
              // 更新认证状态为审核中
              this.certStatus = 1
              uni.setStorageSync('master_cert_status', 1)
              uni.setStorageSync('master_cert_form', this.formData)
              
              uni.showToast({
                title: '提交成功，等待审核',
                icon: 'success'
              })
              
              setTimeout(() => {
                uni.navigateBack()
              }, 1500)
            }, 1000)
          }
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
  padding: 30rpx;
  padding-bottom: 40rpx;
}

.info-card {
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  border-radius: 20rpx;
  padding: 40rpx;
  margin-bottom: 30rpx;
  text-align: center;
}

.card-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #ffffff;
  display: block;
  margin-bottom: 15rpx;
}

.card-desc {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
  display: block;
}

.form-container {
  background: #ffffff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
}

.status-tip {
  padding: 30rpx;
  border-radius: 15rpx;
  margin-bottom: 30rpx;
  display: flex;
  align-items: center;
  gap: 20rpx;

  &.processing {
    background: #E3F2FD;
  }

  &.success {
    background: #E8F5E9;
  }

  &.failed {
    background: #FFEBEE;
  }
}

.tip-icon {
  font-size: 40rpx;
}

.tip-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.form-section {
  margin-bottom: 40rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
  padding-bottom: 15rpx;
  border-bottom: 1rpx solid #f0f0f0;
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

.input {
  width: 100%;
  height: 88rpx;
  padding: 0 30rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;

  &[disabled] {
    background: #f9f9f9;
    color: #999;
  }
}

.picker {
  height: 88rpx;
  padding: 0 30rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 28rpx;
  color: #333;

  .placeholder {
    color: #999;
  }
}

.arrow {
  color: #999;
  font-size: 28rpx;
}

.textarea {
  width: 100%;
  min-height: 200rpx;
  padding: 20rpx 30rpx;
  background: #f5f5f5;
  border-radius: 20rpx;
  font-size: 28rpx;
  color: #333;
}

.upload-item {
  margin-bottom: 30rpx;
}

.upload-box {
  width: 100%;
  height: 400rpx;
  border: 2rpx dashed #ddd;
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
}

.upload-image {
  width: 100%;
  height: 100%;
  border-radius: 18rpx;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
}

.upload-icon {
  font-size: 80rpx;
}

.upload-text {
  font-size: 28rpx;
  color: #999;
}

.tips {
  background: #FFF8E1;
  border-radius: 15rpx;
  padding: 30rpx;
  margin-bottom: 40rpx;
}

.tips-title {
  font-size: 28rpx;
  font-weight: bold;
  color: #FF8C00;
  display: block;
  margin-bottom: 15rpx;
}

.tips-item {
  font-size: 26rpx;
  color: #666;
  line-height: 1.8;
  display: block;
  margin-bottom: 10rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background: linear-gradient(135deg, #FF8C00 0%, #FFA500 100%);
  color: #ffffff;
  border-radius: 44rpx;
  font-size: 32rpx;
  font-weight: bold;
  border: none;

  &[disabled] {
    background: #ccc;
    color: #999;
  }
}
</style>
