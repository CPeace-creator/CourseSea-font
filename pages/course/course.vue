
<template>
  <view class="page-container">
    <view class="course-management">
      <!-- 分类标签区域 -->
      <view class="category-section">
        <scroll-view scroll-x class="category-scroll" show-scrollbar="false">
          <view class="category-list">
            <view 
              v-for="(category, index) in categories" 
              :key="index"
              :class="['category-item', { active: currentCategory === category.id }]"
              @click="currentCategory = category.id"
            >
              {{ category.name }}
            </view>
            <view class="add-category" @click="showAddCategory">
              <uni-icons type="plus" size="20" color="#007AFF"/>
            </view>
          </view>
        </scroll-view>
      </view>

      <!-- 视图切换 -->
      <view class="view-toggle">
        <view class="toggle-buttons">
          <view 
            :class="['toggle-btn', { active: viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
          >
            <uni-icons type="grid" size="20" :color="viewMode === 'grid' ? '#FFFFFF' : '#666666'"/>
          </view>
          <view 
            :class="['toggle-btn', { active: viewMode === 'list' }]"
            @click="viewMode = 'list'"
          >
            <uni-icons type="list" size="20" :color="viewMode === 'list' ? '#FFFFFF' : '#666666'"/>
          </view>
        </view>
      </view>

      <!-- 课程列表 -->
      <view :class="['course-container', viewMode]">
        <view 
          v-for="(course, index) in filteredCourses" 
          :key="index"
          class="course-card"
        >
          <image class="course-image" :src="course.image" mode="aspectFill"/>
          <view class="course-info">
            <view class="course-header">
              <text class="course-title">{{ course.title }}</text>
              <text class="course-duration">{{ course.duration }}</text>
            </view>
            
            <view class="progress-section">
              <view class="progress-bar">
                <view 
                  class="progress-fill"
                  :style="{ width: `${course.progress}%` }"
                ></view>
              </view>
              <text class="progress-text">完成度 {{ course.progress }}%</text>
            </view>

            <view class="course-tags">
              <view 
                v-for="(tag, tagIndex) in course.tags" 
                :key="tagIndex"
                class="course-tag"
              >
                {{ tag }}
              </view>
            </view>

            <view class="course-actions">
              <view class="action-btn" @click="handleNotes(course)">
                <uni-icons type="compose" size="20" color="#007AFF"/>
                <text>笔记</text>
              </view>
              <view class="action-btn" @click="handleShare(course)">
                <uni-icons type="redo" size="20" color="#28CD41"/>
                <text>分享</text>
              </view>
              <view class="action-btn" @click="toggleComplete(course)">
                <uni-icons 
                  :type="course.completed ? 'checkbox-filled' : 'checkbox'" 
                  size="20" 
                  :color="course.completed ? '#FF9500' : '#666666'"
                />
                <text>{{ course.completed ? '已完成' : '完成' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 添加分类弹窗 -->
    <uni-popup ref="categoryPopup" type="center">
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">添加新分类</text>
          <uni-icons type="close" size="24" @click="closeModal"/>
        </view>
        <view class="modal-body">
          <input 
            v-model="newCategory"
            class="category-input"
            placeholder="请输入分类名称"
          />
        </view>
        <view class="modal-footer">
          <button class="modal-btn cancel" @click="closeModal">取消</button>
          <button class="modal-btn confirm" @click="addCategory">添加</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';

const currentCategory = ref('all');
const viewMode = ref<'grid' | 'list'>('grid');
const categoryPopup = ref<any>(null);
const newCategory = ref('');

const categories = ref([
  { id: 'all', name: '全部课程' },
  { id: 'frontend', name: '前端开发' },
  { id: 'backend', name: '后端开发' },
  { id: 'algorithm', name: '算法' },
  { id: 'design', name: '设计' },
]);

const courses = ref([
  {
    id: '1',
    title: '现代JavaScript开发',
    duration: '8小时30分钟',
    progress: 75,
    completed: true,
    category: 'frontend',
    tags: ['JavaScript', 'ES6+', 'Web开发'],
    image: 'https://public.readdy.ai/ai/img_res/6e066e581be53366264895e2438a7dbb.jpg'
  },
  {
    id: '2',
    title: 'Node.js后端架构',
    duration: '12小时45分钟',
    progress: 30,
    completed: false,
    category: 'backend',
    tags: ['Node.js', 'Express', 'MongoDB'],
    image: 'https://public.readdy.ai/ai/img_res/00105a6dad8c22adce1612c1dfc8c5c0.jpg'
  },
  {
    id: '3',
    title: '数据结构与算法',
    duration: '15小时20分钟',
    progress: 45,
    completed: false,
    category: 'algorithm',
    tags: ['数据结构', '算法', '问题解决'],
    image: 'https://public.readdy.ai/ai/img_res/cec3e3f98f51d475a99fd3ede9f8cb3e.jpg'
  }
]);

const filteredCourses = computed(() => {
  if (currentCategory.value === 'all') return courses.value;
  return courses.value.filter(course => course.category === currentCategory.value);
});

const showAddCategory = () => {
  categoryPopup.value.open();
};

const closeModal = () => {
  newCategory.value = '';
  categoryPopup.value.close();
};

const addCategory = () => {
  if (newCategory.value.trim()) {
    const id = newCategory.value.toLowerCase().replace(/\s+/g, '-');
    categories.value.push({
      id,
      name: newCategory.value.trim()
    });
    closeModal();
  }
};

const handleNotes = (course: any) => {
  uni.showToast({
    title: `正在打开${course.title}的笔记`,
    icon: 'none'
  });
};

const handleShare = (course: any) => {
  uni.showToast({
    title: `正在分享${course.title}`,
    icon: 'none'
  });
};

const toggleComplete = (course: any) => {
  course.completed = !course.completed;
  course.progress = course.completed ? 100 : course.progress;
};
</script>

<style>
page {
  height: 100%;
}

.course-management {
  padding: 30rpx;
}

.category-section {
  margin-bottom: 30rpx;
}

.category-scroll {
  width: 100%;
}

.category-list {
  display: flex;
  gap: 20rpx;
  padding: 10rpx 0;
}

.category-item {
  padding: 16rpx 32rpx;
  background-color: #F5F5F5;
  border-radius: 30rpx;
  font-size: 14px;
  color: #666666;
  white-space: nowrap;
}

.category-item.active {
  background-color: #007AFF;
  color: #FFFFFF;
}

.add-category {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80rpx;
  height: 60rpx;
  background-color: #F5F5F5;
  border-radius: 30rpx;
}

.view-toggle {
  margin-bottom: 30rpx;
}

.toggle-buttons {
  display: flex;
  gap: 20rpx;
  justify-content: flex-end;
}

.toggle-btn {
  padding: 16rpx;
  background-color: #F5F5F5;
  border-radius: 8rpx;
}

.toggle-btn.active {
  background-color: #007AFF;
}

.course-container {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.course-container.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.course-card {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.course-image {
  width: 100%;
  height: 300rpx;
}

.course-info {
  padding: 20rpx;
}

.course-header {
  margin-bottom: 20rpx;
}

.course-title {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.course-duration {
  font-size: 14px;
  color: #666666;
}

.progress-section {
  margin-bottom: 20rpx;
}

.progress-bar {
  height: 8rpx;
  background-color: #F5F5F5;
  border-radius: 4rpx;
  overflow: hidden;
  margin-bottom: 8rpx;
}

.progress-fill {
  height: 100%;
  background-color: #007AFF;
  border-radius: 4rpx;
}

.progress-text {
  font-size: 12px;
  color: #666666;
}

.course-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 20rpx;
}

.course-tag {
  padding: 8rpx 16rpx;
  background-color: #F5F5F5;
  border-radius: 20rpx;
  font-size: 12px;
  color: #666666;
}

.course-actions {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #F5F5F5;
  padding-top: 20rpx;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
}

.action-btn text {
  font-size: 12px;
  color: #666666;
}

.modal-content {
  width: 600rpx;
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.modal-header {
  padding: 30rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #F5F5F5;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

.modal-body {
  padding: 30rpx;
}

.category-input {
  width: 100%;
  height: 80rpx;
  border: 1px solid #E5E5E5;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 16px;
}

.modal-footer {
  padding: 20rpx;
  display: flex;
  justify-content: flex-end;
  gap: 20rpx;
  border-top: 1px solid #F5F5F5;
}

.modal-btn {
  padding: 20rpx 40rpx;
  border-radius: 8rpx;
  font-size: 16px;
}

.modal-btn.cancel {
  background-color: #F5F5F5;
  color: #666666;
}

.modal-btn.confirm {
  background-color: #007AFF;
  color: #FFFFFF;
}
</style>

