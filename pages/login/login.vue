<template>
  <view class="login-container">
    <!-- Logo区域 -->
    <view class="logo-section">
      <image class="logo" src="https://public.readdy.ai/ai/img_res/be8a795c48dd7b1d71e99593c3facf38.jpg" />
      <text class="app-name">课海导航</text>
    </view>

    <!-- 切换表单类型 -->
    <view class="form-type-switch">
      <view 
        :class="['switch-item', { active: formType === 'login' }]"
        @click="formType = 'login'"
      >登录</view>
      <view 
        :class="['switch-item', { active: formType === 'register' }]"
        @click="formType = 'register'"
      >注册</view>
    </view>

    <!-- 登录表单 -->
    <view class="form-container" v-if="formType === 'login'">
      <view class="input-group">
        <uni-icons type="person" size="20" color="#666"/>
        <input 
          type="text"
          v-model="loginForm.userName"
          placeholder="请输入用户名/手机号"
          class="input-field"
        />
      </view>
      <view class="input-group">
        <uni-icons type="locked" size="20" color="#666"/>
        <input 
          :type="showPassword ? 'text' : 'password'"
          v-model="loginForm.password"
          placeholder="请输入密码"
          class="input-field"
        />
        <uni-icons 
          :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
          size="20"
          color="#666"
          @click="showPassword = !showPassword"
        />
      </view>

      <view class="form-actions">
        <label class="remember-me">
          <checkbox  color="#007AFF"/>
          <text>记住我</text>
        </label>
        <text class="forget-password" @click="formType = 'forget'">忘记密码？</text>
      </view>

      <button class="submit-btn" @click="handleLogin">登录</button>

      <view class="third-party-login">
        <view class="divider">
          <text class="divider-text">其他登录方式</text>
        </view>
        <view class="login-methods">
          <view class="method-item" @click="handleThirdPartyLogin('wechat')">
            <uni-icons type="weixin" size="28" color="#07C160"/>
            <text>微信</text>
          </view>
          <view class="method-item" @click="handleThirdPartyLogin('qq')">
            <uni-icons type="qq" size="28" color="#12B7F5"/>
            <text>QQ</text>
          </view>
          <view class="method-item" @click="handleThirdPartyLogin('weibo')">
            <uni-icons type="weibo" size="28" color="#E6162D"/>
            <text>微博</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 注册表单 -->
    <view class="form-container" v-if="formType === 'register'">
      <view class="input-group">
        <uni-icons type="person" size="20" color="#666"/>
        <input 
          type="text"
          v-model="registerForm.userName"
          placeholder="请输入用户名"
          class="input-field"
        />
      </view>
	  <view class="input-group">
	    <uni-icons type="email" size="20" color="#666"/>
	    <input 
	      type="text"
	      v-model="registerForm.email"
	      placeholder="请输入邮箱"
	      class="input-field"
	    />
	  </view>
      <view class="input-group">
        <uni-icons type="locked" size="20" color="#666"/>
        <input 
          :type="showPassword ? 'text' : 'password'"
          v-model="registerForm.password"
          placeholder="请设置密码"
          class="input-field"
        />
        <uni-icons 
          :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
          size="20"
          color="#666"
          @click="showPassword = !showPassword"
        />
      </view>

      <view class="agreement">
        <checkbox @click="showAgreement" color="#007AFF"/>
        <text>我已阅读并同意</text>
        <text class="link">《用户协议》</text>
        <text>和</text>
        <text class="link" @click="showPrivacy">《隐私政策》</text>
      </view>

      <button class="submit-btn" @click="handleRegister">注册</button>
    </view>

    <!-- 忘记密码表单 -->
    <view class="form-container" v-if="formType === 'forget'">
      <view class="input-group">
        <uni-icons type="phone" size="20" color="#666"/>
        <input 
          type="number"
          v-model="forgetForm.phone"
          placeholder="请输入手机号"
          class="input-field"
        />
      </view>
      <view class="input-group verification">
        <input 
          type="number"
          v-model="forgetForm.code"
          placeholder="请输入验证码"
          class="input-field"
        />
        <button 
          class="verify-btn" 
          :disabled="isCountingDown"
          @click="sendVerificationCode"
        >
          {{ countDownText }}
        </button>
      </view>
      <view class="input-group">
        <uni-icons type="locked" size="20" color="#666"/>
        <input 
          :type="showPassword ? 'text' : 'password'"
          v-model="forgetForm.newPassword"
          placeholder="请设置新密码"
          class="input-field"
        />
        <uni-icons 
          :type="showPassword ? 'eye-filled' : 'eye-slash-filled'"
          size="20"
          color="#666"
          @click="showPassword = !showPassword"
        />
      </view>

      <button class="submit-btn" @click="handleResetPassword">重置密码</button>
      <text class="back-to-login" @click="formType = 'login'">返回登录</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import {register,login} from '@/utils/user.js'
import cache from '@/utils/cache.js'

const formType = ref('login');
const showPassword = ref(false);
const countDown = ref(0);

const loginForm = ref({
  userName: '',
  password: '',
  remember: false
});

const registerForm = ref({
  userName: '',
  phone: '',
  code: '',
  password: '',
  agreement: false,
  email:""
});

const forgetForm = ref({
  phone: '',
  code: '',
  newPassword: ''
});

const isCountingDown = computed(() => countDown.value > 0);
const countDownText = computed(() => isCountingDown.value ? `${countDown.value}秒后重试` : '获取验证码');

const startCountDown = () => {
  countDown.value = 60;
  const timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--;
    } else {
      clearInterval(timer);
    }
  }, 1000);
};

const sendVerificationCode = () => {
  if (isCountingDown.value) return;
  
  const phone = formType.value === 'register' ? registerForm.value.phone : forgetForm.value.phone;
  if (!phone) {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    });
    return;
  }
  
  // 这里添加发送验证码的逻辑
  uni.showToast({
    title: '验证码已发送',
    icon: 'success'
  });
  startCountDown();
};

const handleLogin = () => {
  if (!loginForm.value.userName || !loginForm.value.password) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  login(loginForm.value).then((res)=>{
	if(res.success){
		cache("token",res.data.token,3600)
		cache("id",res.data.id,3600)
		uni.showToast({
		  title: '登录成功',
		  icon: 'success'
		});
		uni.switchTab({
			url:"/pages/home/home"
		})
		console.log(465);
	}else{
		uni.showModal({
		  title: res.message,
		  icon: 'fail'
		});
	}
  })

};

const handleRegister = () => {
  if (!registerForm.value.agreement) {
    uni.showToast({
      title: '请同意用户协议和隐私政策',
      icon: 'none'
    });
    return;
  }
  
  if (!registerForm.value.userName || !registerForm.value.password) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  register(registerForm.value).then((res)=>{
	if(res.success){
		uni.showToast({
		  title: '注册成功',
		  icon: 'success'
		});
	}else{
		uni.showModal({
		  title: res.message,
		  icon: 'fail'
		});
	}
  })
};

const handleResetPassword = () => {
  if (!forgetForm.value.phone || !forgetForm.value.code || !forgetForm.value.newPassword) {
    uni.showToast({
      title: '请填写完整信息',
      icon: 'none'
    });
    return;
  }
  
  // 这里添加重置密码逻辑
  uni.showToast({
    title: '密码重置成功',
    icon: 'success'
  });
  formType.value = 'login';
};

const handleThirdPartyLogin = (platform: string) => {
  uni.showToast({
    title: `正在跳转${platform}登录`,
    icon: 'none'
  });
};

const showAgreement = () => {
  registerForm.value.agreement=!registerForm.value.agreement
};

const showPrivacy = () => {
  uni.showToast({
    title: '查看隐私政策',
    icon: 'none'
  });
};
</script>

<style>
page {
  height: 100%;
}

.login-container {
  min-height: 100%;
  padding: 60rpx 40rpx;
  background-color: #FFFFFF;
}

.logo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 20rpx;
}

.app-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.form-type-switch {
  display: flex;
  justify-content: center;
  margin-bottom: 40rpx;
}

.switch-item {
  padding: 20rpx 40rpx;
  font-size: 16px;
  color: #666;
  position: relative;
}

.switch-item.active {
  color: #007AFF;
  font-weight: bold;
}

.switch-item.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 4rpx;
  background-color: #007AFF;
  border-radius: 2rpx;
}

.form-container {
  margin-top: 40rpx;
}

.input-group {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background-color: #F5F7FA;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.input-field {
  flex: 1;
  margin: 0 20rpx;
  font-size: 14px;
}

.verification {
  padding-right: 0;
}

.verify-btn {
  margin: 0;
  padding: 0 30rpx;
  height: 68rpx;
  line-height: 68rpx;
  font-size: 14px;
  color: #007AFF;
  background-color: transparent;
}

.verify-btn::after {
  border: none;
}

.verify-btn[disabled] {
  color: #999;
  background-color: transparent;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20rpx 0 40rpx;
}

.remember-me {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #666;
}

.forget-password {
  font-size: 14px;
  color: #007AFF;
}

.submit-btn {
  width: 100%;
  height: 88rpx;
  line-height: 88rpx;
  background-color: #007AFF;
  color: #FFFFFF;
  font-size: 16px;
  border-radius: 44rpx;
  margin: 40rpx 0;
}

.third-party-login {
  margin-top: 60rpx;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 40rpx;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 30%;
  height: 1px;
  background-color: #E5E5E5;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider-text {
  display: inline-block;
  padding: 0 20rpx;
  font-size: 14px;
  color: #999;
  background-color: #FFFFFF;
}

.login-methods {
  display: flex;
  justify-content: center;
  gap: 60rpx;
}

.method-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.method-item text {
  font-size: 12px;
  color: #666;
}

.agreement {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #666;
  margin-top: 20rpx;
}

.link {
  color: #007AFF;
  margin: 0 4rpx;
}

.back-to-login {
  display: block;
  text-align: center;
  font-size: 14px;
  color: #007AFF;
  margin-top: 20rpx;
}
</style>

