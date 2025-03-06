<template>
  <view class="page-container">
    <!-- Header Section -->
    <view class="header">
      <view class="user-info">
        <image
          class="avatar"
          src="https://public.readdy.ai/ai/img_res/01b40ac6d045f55fd58fda2cc3f85fc7.jpg"
        />
        <view class="greeting">
          <text class="welcome">欢迎回来</text>
          <text class="name">张明</text>
        </view>
      </view>
      <view class="quick-actions">
        <uni-icons type="bell" size="24" @click="showReminders = true" />
        <uni-icons type="notification" size="24" @click="handleNotification" />
      </view>
    </view>

    <!-- Daily Goals Panel -->
    <view class="goals-panel" v-if="showGoals">
      <view class="goals-header">
        <text class="goals-title">今日目标</text>
        <text class="goals-date">{{ currentDate }}</text>
      </view>
      <view class="goals-list">
        <view
          class="goal-item"
          v-for="(goal, index) in dailyGoals"
          :key="index"
        >
          <view class="goal-checkbox" @click="toggleGoal(index)">
            <uni-icons
              :type="goal.completed ? 'checkbox-filled' : 'circle'"
              size="20"
              :color="goal.completed ? '#007AFF' : '#666'"
            />
          </view>
          <text :class="['goal-text', { completed: goal.completed }]"
            >{{ goal.text }}</text
          >
          <text class="goal-time">{{ goal.time }}</text>
        </view>
      </view>
    </view>

    <!-- Search Bar -->
    <view class="search-container">
      <view class="search-box">
        <uni-icons type="search" size="20" />
        <input type="text" v-model="searchText" placeholder="搜索课程..." />
      </view>
      <uni-icons type="filter" size="24" @click="showFilterPanel = true" />
    </view>

    <!-- Category Tags -->
    <scroll-view class="category-scroll" scroll-x>
      <view class="category-tags">
        <view
          v-for="(tag, index) in categories"
          :key="index"
          :class="['category-tag', { active: selectedCategory === tag }]"
          @click="selectedCategory = tag"
        >
          {{ tag }}
        </view>
      </view>
    </scroll-view>

    <!-- Learning Progress -->
    <view class="section-title">
      <text>学习进度</text>
      <text class="view-all" @click="viewAllCourses">查看全部</text>
    </view>

    <scroll-view class="progress-cards" scroll-x>
      <view
        class="course-card"
        v-for="(course, index) in currentCourses"
        :key="index"
      >
        <image class="course-image" :src="course.image" />
        <view class="course-info">
          <text class="course-title">{{ course.title }}</text>
          <view class="progress-bar">
            <view class="progress" :style="{ width: course.progress + '%' }" />
          </view>
          <text class="progress-text">已完成 {{ course.progress }}%</text>
        </view>
      </view>
    </scroll-view>

    <!-- Statistics -->
    <view class="statistics-section">
      <view class="stat-card">
        <text class="stat-value">{{ totalHours }}</text>
        <text class="stat-label">学习时长</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ coursesCompleted }}</text>
        <text class="stat-label">完成课程</text>
      </view>
      <view class="stat-card">
        <text class="stat-value">{{ currentStreak }}</text>
        <text class="stat-label">连续学习</text>
      </view>
    </view>

    <!-- FAB Menu -->
    <view class="fab-container" :class="{ 'fab-active': showFabMenu }">
      <view
        class="fab-backdrop"
        v-if="showFabMenu"
        @click="showFabMenu = false"
      ></view>
      <view class="fab-menu" v-if="showFabMenu">
        <view class="fab-item" @click="handleFabAction('add')">
          <uni-icons type="plus" size="20" color="#FFFFFF" />
          <text>快速添加</text>
        </view>
        <view class="fab-item" @click="handleFabAction('import')">
          <uni-icons type="download" size="20" color="#FFFFFF" />
          <text>导入课程</text>
        </view>
        <view class="fab-item" @click="handleFabAction('reminder')">
          <uni-icons type="calendar" size="20" color="#FFFFFF" />
          <text>设置提醒</text>
        </view>
      </view>
      <view class="fab-button" @click="showFabMenu = !showFabMenu">
        <uni-icons
          :type="showFabMenu ? 'close' : 'plus'"
          size="24"
          color="#FFFFFF"
        />
      </view>
    </view>

    <!-- Reminders Panel -->
    <uni-popup ref="remindersPopup" type="bottom" @change="handlePopupChange">
      <view class="reminders-panel">
        <view class="reminders-header">
          <text class="reminders-title">提醒事项</text>
          <uni-icons type="close" size="20" @click="showReminders = false" />
        </view>
        <view class="reminders-content">
          <view class="reminder-section">
            <text class="reminder-section-title">即将截止</text>
            <view class="reminder-list">
              <view
                class="reminder-item"
                v-for="(reminder, index) in upcomingDeadlines"
                :key="index"
              >
                <view class="reminder-info">
                  <text class="reminder-name">{{ reminder.name }}</text>
                  <text class="reminder-date">{{ reminder.date }}</text>
                </view>
                <uni-icons type="right" size="16" color="#666" />
              </view>
            </view>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";

const searchText = ref("");
const showFilterPanel = ref(false);
const selectedCategory = ref("全部");
const activeTab = ref(0);
const showFabMenu = ref(false);
const showReminders = ref(false);
const showGoals = ref(true);

const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString("zh-CN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
});

const categories = [
  "全部",
  "前端开发",
  "后端开发",
  "运维部署",
  "移动开发",
  "AI/机器学习",
];

const dailyGoals = ref([
  { text: "完成 React Hooks 章节", time: "10:00", completed: false },
  { text: "TypeScript 练习题", time: "14:00", completed: false },
  { text: "复习 Node.js 项目", time: "16:00", completed: false },
]);

const upcomingDeadlines = ref([
  { name: "React 高级模式测试", date: "明天 15:00" },
  { name: "Node.js 项目提交", date: "2月25日 23:59" },
  { name: "Flutter UI 挑战", date: "2月26日 17:00" },
]);

const currentCourses = [
  {
    title: "React 高级设计模式",
    progress: 75,
    image:
      "https://public.readdy.ai/ai/img_res/3e534d2e5a1c71a78c075f7cbb419651.jpg",
  },
  {
    title: "Node.js 微服务架构",
    progress: 45,
    image:
      "https://public.readdy.ai/ai/img_res/60b7695984c1931a34da1b4067e579ab.jpg",
  },
  {
    title: "Flutter 应用开发",
    progress: 30,
    image:
      "https://public.readdy.ai/ai/img_res/e284d2cefe0519dde1e3d7abf404004d.jpg",
  },
];

const totalHours = "126";
const coursesCompleted = "15";
const currentStreak = "7";


const toggleGoal = (index: number) => {
  dailyGoals.value[index].completed = !dailyGoals.value[index].completed;
};

const handleFabAction = (action: string) => {
  showFabMenu.value = false;
  switch (action) {
    case "add":
      uni.showToast({ title: "快速添加课程", icon: "none" });
      break;
    case "import":
      uni.showToast({ title: "导入课程", icon: "none" });
      break;
    case "reminder":
      uni.showToast({ title: "设置提醒", icon: "none" });
      break;
  }
};

const handleNotification = () => {
  uni.showToast({
    title: "消息中心",
    icon: "none",
  });
};

const viewAllCourses = () => {
  uni.showToast({
    title: "查看全部课程",
    icon: "none",
  });
};

const handlePopupChange = (e: { show: boolean }) => {
  showReminders.value = e.show;
};
</script>

<style>
page {
  height: 100%;
}

.page-container {
  min-height: 100%;
  background-color: #f5f7fa;
  padding: 30rpx;
  padding-bottom: 120rpx;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.greeting {
  display: flex;
  flex-direction: column;
}

.welcome {
  font-size: 14px;
  color: #666;
}

.name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.quick-actions {
  display: flex;
  gap: 30rpx;
}

.goals-panel {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 30rpx;
}

.goals-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.goals-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.goals-date {
  font-size: 14px;
  color: #666;
}

.goals-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.goal-text {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.goal-text.completed {
  text-decoration: line-through;
  color: #999;
}

.goal-time {
  font-size: 12px;
  color: #666;
}

.search-container {
  display: flex;
  align-items: center;
  gap: 20rpx;
  margin-bottom: 30rpx;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 16rpx;
}

.search-box input {
  flex: 1;
  margin-left: 20rpx;
  font-size: 14px;
}

.category-scroll {
  margin-bottom: 30rpx;
}

.category-tags {
  display: flex;
  padding: 10rpx 0;
}

.category-tag {
  padding: 16rpx 32rpx;
  background-color: #ffffff;
  border-radius: 30rpx;
  margin-right: 20rpx;
  font-size: 14px;
  color: #666;
}

.category-tag.active {
  background-color: #007aff;
  color: #ffffff;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 16px;
  font-weight: bold;
}

.view-all {
  color: #007aff;
  font-size: 14px;
  font-weight: normal;
}

.progress-cards {
  white-space: nowrap;
  margin-bottom: 30rpx;
}

.course-card {
  display: inline-block;
  width: 300rpx;
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-right: 20rpx;
  overflow: hidden;
}

.course-image {
  width: 300rpx;
  height: 180rpx;
}

.course-info {
  padding: 20rpx;
}

.course-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 16rpx;
  white-space: normal;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.progress-bar {
  height: 6rpx;
  background-color: #e5e5e5;
  border-radius: 3rpx;
  margin-bottom: 10rpx;
}

.progress {
  height: 100%;
  background-color: #007aff;
  border-radius: 3rpx;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

.statistics-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30rpx;
}

.stat-card {
  flex: 1;
  background-color: #ffffff;
  padding: 20rpx;
  border-radius: 16rpx;
  margin: 0 10rpx;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.fab-container {
  position: fixed;
  right: 30rpx;
  bottom: 140rpx;
  z-index: 100;
}

.fab-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 98;
}

.fab-menu {
  position: absolute;
  bottom: 100rpx;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  z-index: 99;
}

.fab-item {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background-color: #007aff;
  padding: 16rpx 24rpx;
  border-radius: 30rpx;
}

.fab-item text {
  color: #ffffff;
  font-size: 14px;
}

.fab-button {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background-color: #007aff;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 122, 255, 0.3);
}

.reminders-panel {
  background-color: #ffffff;
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  padding: 30rpx;
}

.reminders-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.reminders-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.reminder-section {
  margin-bottom: 30rpx;
}

.reminder-section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}

.reminder-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.reminder-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background-color: #f5f7fa;
  border-radius: 12rpx;
}

.reminder-info {
  flex: 1;
}

.reminder-name {
  font-size: 14px;
  color: #333;
  display: block;
  margin-bottom: 8rpx;
}

.reminder-date {
  font-size: 12px;
  color: #666;
}

.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #e5e5e5;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tab-text {
  font-size: 12px;
  color: #666;
  margin-top: 8rpx;
}

.tab-text.active {
  color: #007aff;
}
</style>
