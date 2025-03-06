
<template>
  <view class="page-container">
    <!-- Profile Header -->
    <view class="profile-header">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
        <view class="user-details">
          <text class="username">{{ userInfo.name }}</text>
          <text class="user-title">{{ userInfo.title }}</text>
        </view>
      </view>
      <view class="settings-btn" @click="handleSettings">
        <uni-icons type="gear" size="24" color="#333333"/>
      </view>
    </view>

    <!-- Learning Stats -->
    <view class="stats-container">
      <view class="stat-card" v-for="(stat, index) in learningStats" :key="index">
        <text class="stat-value">{{ stat.value }}</text>
        <text class="stat-label">{{ stat.label }}</text>
      </view>
    </view>

    <!-- Learning Streak -->
    <view class="streak-section">
      <view class="section-header">
        <text class="section-title">学习连续打卡</text>
        <text class="streak-count">{{ streak.current }} 天</text>
      </view>
      <view class="streak-calendar">
        <view 
          v-for="(day, index) in streak.days" 
          :key="index"
          :class="['streak-day', { completed: day.completed }]"
        >
          <text class="day-label">{{ day.label }}</text>
          <view class="day-indicator"></view>
        </view>
      </view>
    </view>

    <!-- Recent Courses -->
    <view class="recent-courses">
      <view class="section-header">
        <text class="section-title">继续学习</text>
        <view class="view-all" @click="navigateToCourses">
          <text>查看全部</text>
          <uni-icons type="right" size="14" color="#007AFF"/>
        </view>
      </view>
      <scroll-view scroll-x class="courses-scroll" show-scrollbar="false">
        <view class="course-cards">
          <view 
            v-for="(course, index) in recentCourses" 
            :key="index"
            class="course-card"
            @click="handleCourseClick(course)"
          >
            <image class="course-image" :src="course.image" mode="aspectFill"/>
            <view class="course-info">
              <text class="course-title">{{ course.title }}</text>
              <view class="progress-bar">
                <view 
                  class="progress-fill"
                  :style="{ width: `${course.progress}%` }"
                ></view>
              </view>
              <view class="course-meta">
                <text class="progress-text">已完成 {{ course.progress }}%</text>
                <text class="time-left">剩余 {{ course.timeLeft }}</text>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Achievements -->
    <view class="achievements-section">
      <view class="section-header">
        <text class="section-title">最近成就</text>
        <view class="view-all" @click="navigateToAchievements">
          <text>查看全部</text>
          <uni-icons type="right" size="14" color="#007AFF"/>
        </view>
      </view>
      <view class="achievements-grid">
        <view 
          v-for="(achievement, index) in achievements" 
          :key="index"
          class="achievement-card"
          @click="showAchievementDetails(achievement)"
        >
          <image class="achievement-icon" :src="achievement.icon" mode="aspectFit"/>
          <text class="achievement-name">{{ achievement.name }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const userInfo = ref({
  name: '张小明',
  title: '全栈开发工程师',
  avatar: 'https://public.readdy.ai/ai/img_res/24974eb59ae2e4e3b37eb3c0abf6d427.jpg'
});

const learningStats = ref([
  { value: '24', label: '课程' },
  { value: '156', label: '学时' },
  { value: '12', label: '证书' }
]);

const streak = ref({
  current: 15,
  days: [
    { label: '一', completed: true },
    { label: '二', completed: true },
    { label: '三', completed: true },
    { label: '四', completed: true },
    { label: '五', completed: true },
    { label: '六', completed: false },
    { label: '日', completed: false }
  ]
});

const recentCourses = ref([
  {
    id: '1',
    title: 'React 高级设计模式',
    progress: 65,
    timeLeft: '2小时30分',
    image: 'https://public.readdy.ai/ai/img_res/de35faebc47c473550f9a989cee49b97.jpg'
  },
  {
    id: '2',
    title: '云架构设计',
    progress: 32,
    timeLeft: '4小时15分',
    image: 'https://public.readdy.ai/ai/img_res/f8161374ff11d926855164ddac4d9113.jpg'
  },
  {
    id: '3',
    title: 'UI/UX 设计原则',
    progress: 89,
    timeLeft: '1小时20分',
    image: 'https://public.readdy.ai/ai/img_res/745b52c7095cd6a1d345b9dd064e17cf.jpg'
  }
]);

const achievements = ref([
  {
    id: '1',
    name: '学习达人',
    icon: 'https://public.readdy.ai/ai/img_res/1a06f80d5afe12d97f5f321412e4a0df.jpg'
  },
  {
    id: '2',
    name: '代码大师',
    icon: 'https://public.readdy.ai/ai/img_res/26ee6663b7c70c811e2353148d320abd.jpg'
  },
  {
    id: '3',
    name: '团队精神',
    icon: 'https://public.readdy.ai/ai/img_res/111317facfb2a98c2ee4271cd54ce667.jpg'
  },
  {
    id: '4',
    name: '问题解决者',
    icon: 'https://public.readdy.ai/ai/img_res/cb4aecc7df93ceb5a9fb29a0db7798f5.jpg'
  }
]);

const handleSettings = () => {
  uni.showToast({
    title: '打开设置',
    icon: 'none'
  });
};

const navigateToCourses = () => {
  uni.showToast({
    title: '查看所有课程',
    icon: 'none'
  });
};

const handleCourseClick = (course: any) => {
  uni.showToast({
    title: `正在打开 ${course.title}`,
    icon: 'none'
  });
};

const navigateToAchievements = () => {
  uni.showToast({
    title: '查看所有成就',
    icon: 'none'
  });
};

const showAchievementDetails = (achievement: any) => {
  uni.showToast({
    title: `成就：${achievement.name}`,
    icon: 'none'
  });
};
</script>

<style>
page {
  height: 100%;
}

.page-container {
  padding: 30rpx;
  background-color: #F8F9FA;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40rpx;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}

.user-title {
  font-size: 14px;
  color: #666666;
  margin-top: 4rpx;
}

.settings-btn {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  border-radius: 40rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stats-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 40rpx;
}

.stat-card {
  flex: 1;
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 16rpx;
  margin: 0 10rpx;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.stat-label {
  font-size: 14px;
  color: #666666;
}

.streak-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 16rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

.streak-count {
  font-size: 16px;
  color: #007AFF;
  font-weight: bold;
}

.streak-calendar {
  display: flex;
  justify-content: space-between;
}

.streak-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.day-label {
  font-size: 14px;
  color: #666666;
}

.day-indicator {
  width: 24rpx;
  height: 24rpx;
  border-radius: 12rpx;
  background-color: #F5F5F5;
}

.streak-day.completed .day-indicator {
  background-color: #007AFF;
}

.recent-courses {
  margin-bottom: 40rpx;
}

.view-all {
  display: flex;
  align-items: center;
  gap: 8rpx;
  color: #007AFF;
  font-size: 14px;
}

.courses-scroll {
  width: 100%;
}

.course-cards {
  display: flex;
  gap: 20rpx;
  padding: 10rpx 0;
}

.course-card {
  width: 400rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.course-image {
  width: 100%;
  height: 200rpx;
}

.course-info {
  padding: 20rpx;
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 16rpx;
  display: block;
}

.progress-bar {
  height: 8rpx;
  background-color: #F5F5F5;
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 12rpx;
}

.progress-fill {
  height: 100%;
  background-color: #007AFF;
  border-radius: 4rpx;
}

.course-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666666;
}

.achievements-section {
  background-color: #FFFFFF;
  padding: 30rpx;
  border-radius: 16rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.achievement-icon {
  width: 100rpx;
  height: 100rpx;
}

.achievement-name {
  font-size: 12px;
  color: #666666;
  text-align: center;
}
</style>

