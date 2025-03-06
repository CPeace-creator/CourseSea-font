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
		  v-for="(category, index) in categories"
		  :key="category.id"
		  :class="['category-tag', { active: selectedCategory === category.name }]"
		  @click="selectedCategory = category.name"
		>
		  <text class="icon" :class="category.icon"></text> <!-- 添加图标 -->
		  {{ category.name }}
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
          <view class="fab-item cursor-pointer" @click="handleFabAction('add')">
            <view class="fab-item-inner">
              <uni-icons type="plus" size="20" color="#FFFFFF" />
              <text>快速添加</text>
            </view>
          </view>
          <view class="fab-item cursor-pointer" @click="handleFabAction('import')">
            <view class="fab-item-inner">
              <uni-icons type="download" size="20" color="#FFFFFF" />
              <text>导入课程</text>
            </view>
          </view>
          <view
            class="fab-item cursor-pointer"
            @click="handleFabAction('reminder')"
          >
            <view class="fab-item-inner">
              <uni-icons type="calendar" size="20" color="#FFFFFF" />
              <text>设置提醒</text>
            </view>
          </view>
        </view>
        <view
          class="fab-button cursor-pointer"
          :class="{ 'fab-button-active': showFabMenu }"
          @click="showFabMenu = !showFabMenu"
        >
          <uni-icons
            :type="showFabMenu ? 'close' : 'plus'"
            size="24"
            color="#FFFFFF"
          />
        </view>
      </view>
	  <!-- 添加课程弹窗 -->
	  <uni-popup ref="addCoursePopup" type="center" :mask-click="false">
	  	    <view class="add-course-popup">
	  	      <view class="popup-header">
	  	        <text class="popup-title">添加课程</text>
	  	        <view class="close-icon cursor-pointer" @click="closeAddCoursePopup">
	  	          <uni-icons type="close" size="24" color="#666" />
	  	        </view>
	  	      </view>
	  	      
	  	      <scroll-view class="popup-content" scroll-y>
	  	        <view class="form-item">
	  	          <text class="form-label required">课程名称</text>
	  	          <input
	  	            class="form-input"
	  	            v-model="courseForm.name"
	  	            placeholder="请输入课程名称"
	  	            maxlength="50"
	  	          />
	  	        </view>
	  	      
	  	        <view class="form-item">
	  	          <text class="form-label required">课程分类</text>
	  	          <view class="category-list">
	  	            <view
	  	              v-for="category in categories"
	  	              :key="category.id"
	  	              class="category-item cursor-pointer"
	  	              :class="{'category-active': courseForm.category === category.id}"
	  	              @click="courseForm.category = category.id"
	  	            >
	  	              <uni-icons
	  	                :type="category.icon"
	  	                size="16"
	  	                :color="courseForm.category === category.id ? '#FFFFFF' : '#666666'"
	  	              />
	  	              <text>{{ category.name }}</text>
	  	            </view>
	  	          </view>
	  	        </view>
	  	      
	  	        <view class="form-item">
	  	          <text class="form-label required">课程封面</text>
	  	          <view class="upload-cover cursor-pointer" @click="handleUploadCover">
	  	            <template v-if="courseForm.avatar">
	  	              <image
	  	                :src="courseForm.avatar"
	  	                mode="aspectFill"
	  	                class="cover-preview"
	  	              />
	  	              <view class="cover-mask">
	  	                <uni-icons type="image" size="24" color="#FFFFFF" />
	  	                <text>更换封面</text>
	  	              </view>
	  	            </template>
	  	            <template v-else>
	  	              <view class="upload-placeholder">
	  	                <uni-icons type="image" size="32" color="#CCCCCC" />
	  	                <text>上传封面图</text>
	  	                <text class="upload-tip"
	  	                  >建议尺寸 750x422，支持jpg、png格式</text
	  	                >
	  	              </view>
	  	            </template>
	  	          </view>
	  	        </view>
	  	      
	  	        <view class="form-item">
	  	          <text class="form-label required">课程链接</text>
	  	          <view class="link-input-wrapper">
	  	            <input
	  	              class="form-input"
	  	              v-model="courseForm.link"
	  	              placeholder="请输入课程链接"
	  	            />
	  	            <view class="paste-btn cursor-pointer" @click="handlePasteLink">
	  	              <uni-icons type="paperclip" size="16" color="#0A84FF" />
	  	              <text>粘贴</text>
	  	            </view>
	  	          </view>
	  	        </view>
	  	      
	  	        <view class="form-item">
	  	          <text class="form-label required">课程描述</text>
	  	          <textarea
	  	            class="form-textarea"
	  	            v-model="courseForm.description"
	  	            placeholder="请输入课程描述，建议包含课程亮点,学习目标等信息"
	  	            maxlength="500"
	  	          />
	  	          <text
	  	            class="textarea-counter"
	  	            :class="{'counter-warning': courseForm.description.length >= 450}"
	  	          >
	  	            {{ courseForm.description.length }}/500
	  	          </text>
	  	        </view>
	  	      </scroll-view>
	  	      
	  	      <view class="popup-footer">
	  	        <button class="btn-cancel cursor-pointer" @click="closeAddCoursePopup">
	  	          取消
	  	        </button>
	  	        <button
	  	          class="btn-confirm cursor-pointer"
	  	          :disabled="!isFormValid"
	  	          @click="handleSubmit"
	  	        >
	  	          <text>确认添加</text>
	  	          <uni-icons
	  	            v-if="isSubmitting"
	  	            type="spinner-cycle"
	  	            size="16"
	  	            color="#FFFFFF"
	  	          />
	  	        </button>
	  	      </view>
	  	    </view>
	  	  </uni-popup>
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
const selectedCategory = ref("前端开发");
const activeTab = ref(0);
const showFabMenu = ref(false);
const showReminders = ref(false);
const showGoals = ref(true);
const addCoursePopup = ref();
const isSubmitting = ref(false);
const currentDate = computed(() => {
  const date = new Date();
  return date.toLocaleDateString("zh-CN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
});

// const categories = [
//   "全部",
//   "前端开发",
//   "后端开发",
//   "运维部署",
//   "移动开发",
//   "AI/机器学习",
// ];
const categories = [
  { id: 1, name: "前端开发", icon: "code" },
  { id: 2, name: "后端开发", icon: "paint" },
  { id: 3, name: "运维部署", icon: "staff" },
  { id: 4, name: "移动开发", icon: "chat" },
  { id: 5, name: "AI/机器学习", icon: "medal" },
  { id: 6, name: "其他", icon: "star" },
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

const courseForm = ref({
  name: "",
  categoryId: 0,
  avatar: "",
  link: "",
  description: "",
});

const isFormValid = computed(() => {
	console.log(courseForm.value.name.trim() &&
    courseForm.value.category &&
    courseForm.value.link.trim() &&
    courseForm.value.description.trim());
  return (
    courseForm.value.name.trim() &&
    courseForm.value.category &&
    courseForm.value.link.trim() &&
    courseForm.value.description.trim()
  );
});

const handleFabAction = (action: string) => {
  showFabMenu.value = false;
  if (action === "add") {
    addCoursePopup.value.open();
  } else if (action === "import") {
    uni.showToast({ title: "导入功能开发中", icon: "none" });
  } else if (action === "reminder") {
    uni.showToast({ title: "提醒功能开发中", icon: "none" });
  }
};

const closeAddCoursePopup = () => {
  if (isSubmitting.value) return;

  if (hasFormContent.value) {
    uni.showModal({
      title: "提示",
      content: "当前内容尚未保存，确定要关闭吗？",
      success: (res) => {
        if (res.confirm) {
          resetForm();
          addCoursePopup.value.close();
        }
      },
    });
  } else {
    resetForm();
    addCoursePopup.value.close();
  }
};

const hasFormContent = computed(() => {
  return (
    courseForm.value.name ||
    courseForm.value.category ||
    courseForm.value.avatar ||
    courseForm.value.link ||
    courseForm.value.description
  );
});

const resetForm = () => {
  Object.assign(courseForm, {
    name: "",
    category: 0,
    avatar: "",
    link: "",
    description: "",
  });
};

const handleUploadCover = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ["compressed"],
    sourceType: ["album", "camera"],
    success: (res) => {
      courseForm.value.avatar = res.tempFilePaths[0];
    },
  });
};

const handlePasteLink = async () => {
  try {
    const text = await uni.getClipboardData();
    if (text.data) {
      courseForm.value.link = text.data;
      uni.showToast({ title: "已粘贴", icon: "success" });
    }
  } catch (error) {
    uni.showToast({ title: "粘贴失败", icon: "none" });
  }
};

const handleSubmit = async () => {
  if (isSubmitting.value) return;

  if (!isFormValid.value) {
    if (!courseForm.value.name.trim()) {
      uni.showToast({ title: "请输入课程名称", icon: "none" });
      return;
    }
    if (!courseForm.value.category) {
      uni.showToast({ title: "请选择课程分类", icon: "none" });
      return;
    }
    // if (!courseForm.value.avatar) {
    //   uni.showToast({ title: "请上传课程封面", icon: "none" });
    //   return;
    // }
    if (!courseForm.value.link.trim()) {
      uni.showToast({ title: "请输入课程链接", icon: "none" });
      return;
    }
    if (!courseForm.value.description.trim()) {
      uni.showToast({ title: "请输入课程描述", icon: "none" });
      return;
    }
    return;
  }

  isSubmitting.value = true;

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // 模拟提交
    uni.showToast({ title: "添加成功", icon: "success" });
    resetForm();
    addCoursePopup.value.close();
  } catch (error) {
    uni.showToast({ title: "添加失败，请重试", icon: "none" });
  } finally {
    isSubmitting.value = false;
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

page {
  height: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.fab-container {
  position: fixed;
  right: 40rpx;
  bottom: 160rpx;
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
  opacity: 0;
  animation: fadeIn 0.3s forwards;
  backdrop-filter: blur(4px);
}

.fab-menu {
  position: absolute;
  bottom: 120rpx;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  z-index: 99;
  transform: translateY(20rpx);
  opacity: 0;
  animation: slideUp 0.3s forwards;
}

.fab-item {
  transform: translateX(20rpx);
  opacity: 0;
  animation: slideIn 0.3s forwards;
}

.fab-item:nth-child(1) {
  animation-delay: 0.1s;
}
.fab-item:nth-child(2) {
  animation-delay: 0.2s;
}
.fab-item:nth-child(3) {
  animation-delay: 0.3s;
}

.fab-item-inner {
  display: flex;
  align-items: center;
  gap: 16rpx;
  background: linear-gradient(135deg, #0a84ff, #0055d6);
  padding: 20rpx 32rpx;
  border-radius: 40rpx;
  box-shadow: 0 4rpx 12rpx rgba(10, 132, 255, 0.3);
  transition: all 0.2s;
}

.fab-item-inner:active {
  transform: scale(0.95);
  box-shadow: 0 2rpx 6rpx rgba(10, 132, 255, 0.3);
}

.fab-item text {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
}

.fab-button {
  width: 110rpx;
  height: 110rpx;
  border-radius: 55rpx;
  background: linear-gradient(135deg, #0a84ff, #0055d6);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 6rpx 16rpx rgba(10, 132, 255, 0.4);
  transition: all 0.3s;
}

.fab-button:active {
  transform: scale(0.95);
}

.fab-button-active {
  transform: rotate(45deg);
  background: linear-gradient(135deg, #ff3b30, #ff2d55);
  box-shadow: 0 6rpx 16rpx rgba(255, 59, 48, 0.4);
}

.add-course-popup {
  width: 650rpx;
  background-color: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx;
  border-bottom: 1px solid #eeeeee;
}

.popup-title {
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.close-icon {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 24rpx;
  transition: background-color 0.3s;
}

.close-icon:active {
  background-color: #f5f5f5;
}

.popup-content {
  max-height: 800rpx;
  padding: 32rpx;
}

.form-item {
  margin-bottom: 32rpx;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.required::after {
  content: "*";
  color: #ff3b30;
  margin-left: 8rpx;
}

.form-input {
  width: 100%;
  height: 88rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 0 24rpx;
  font-size: 14px;
  color: #333333;
  transition: all 0.3s;
}

.form-input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.1);
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 24rpx;
  background-color: #f5f5f5;
  border-radius: 8rpx;
  font-size: 14px;
  color: #666666;
  transition: all 0.3s;
}

.category-item:active {
  opacity: 0.8;
}

.category-active {
  background-color: #0a84ff;
  color: #ffffff;
}

.upload-cover {
  width: 100%;
  height: 300rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  overflow: hidden;
  transition: all 0.3s;
}

.upload-cover:active {
  opacity: 0.8;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
}

.upload-placeholder text {
  font-size: 14px;
  color: #999999;
}

.upload-tip {
  font-size: 12px !important;
  color: #cccccc !important;
}

.cover-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16rpx;
  opacity: 0;
  transition: opacity 0.3s;
}

.upload-cover:hover .cover-mask {
  opacity: 1;
}

.cover-mask text {
  color: #ffffff;
}

.link-input-wrapper {
  position: relative;
}

.paste-btn {
  position: absolute;
  right: 24rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 4rpx;
  padding: 12rpx 20rpx;
  border-radius: 28rpx;
  background-color: rgba(10, 132, 255, 0.1);
  transition: all 0.3s;
}

.paste-btn:active {
  opacity: 0.8;
}

.paste-btn text {
  font-size: 12px;
  color: #0a84ff;
}

.form-textarea {
  width: 100%;
  height: 200rpx;
  background-color: #f5f5f5;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 14px;
  color: #333333;
  transition: all 0.3s;
}

.form-textarea:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.1);
}

.textarea-counter {
  display: block;
  text-align: right;
  font-size: 12px;
  color: #999999;
  margin-top: 8rpx;
}

.counter-warning {
  color: #ff3b30;
}

.popup-footer {
  display: flex;
  padding: 32rpx;
  gap: 20rpx;
  border-top: 1px solid #eeeeee;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  height: 88rpx;
  border-radius: 44rpx;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8rpx;
  transition: all 0.3s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666666;
}

.btn-cancel:active {
  background-color: #eeeeee;
}

.btn-confirm {
  background: linear-gradient(135deg, #0a84ff, #0055d6);
  color: #ffffff;
}

.btn-confirm:active {
  opacity: 0.9;
}

.btn-confirm:disabled {
  background: linear-gradient(135deg, #cccccc, #999999);
  opacity: 0.8;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateX(20rpx);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
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
