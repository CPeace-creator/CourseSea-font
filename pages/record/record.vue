
<template>
  <view class="page-container">
    <!-- 个人学习数据卡片 -->
    <view class="study-stats-card">
      <view class="user-info">
        <image class="avatar" :src="userInfo.avatar" mode="aspectFill"/>
        <view class="user-details">
          <text class="username">{{userInfo.username}}</text>
          <text class="user-title">{{userInfo.title}}</text>
        </view>
        <view class="follow-btn" @click="handleFollow">
          <uni-icons :type="userInfo.isFollowed ? 'checkbox-filled' : 'plus'" size="20" color="#FFFFFF"/>
          <text>{{userInfo.isFollowed ? '已关注' : '关注'}}</text>
        </view>
      </view>
      
      <view class="study-data">
        <view class="data-item">
          <text class="data-value">{{formatTime(userInfo.totalStudyTime)}}</text>
          <text class="data-label">总学习时长</text>
        </view>
        <view class="data-item">
          <text class="data-value">{{userInfo.weekStreak}}</text>
          <text class="data-label">连续学习(周)</text>
        </view>
        <view class="data-item">
          <text class="data-value">{{userInfo.followers}}</text>
          <text class="data-label">关注者</text>
        </view>
      </view>
    </view>

    <!-- 排行榜 -->
    <view class="leaderboard-section">
      <view class="section-header">
        <text class="section-title">学习榜</text>
        <text class="section-subtitle">每周更新</text>
      </view>
      
      <view class="leaderboard-list">
        <view v-for="(user, index) in topUsers" :key="user.id" class="leaderboard-item">
          <view class="rank-badge" :class="`rank-${index + 1}`">
            <uni-icons v-if="index < 3" type="medal" size="24" :color="index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'"/>
            <text v-else>{{index + 1}}</text>
          </view>
          <image class="user-avatar" :src="user.avatar" mode="aspectFill"/>
          <view class="user-info-compact">
            <text class="user-name">{{user.username}}</text>
            <text class="study-time">{{formatTime(user.studyTime)}}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习动态 -->
    <view class="moments-section">
      <view class="section-header">
        <text class="section-title">学习动态</text>
        <view class="post-btn" @click="showPostModal">
          <uni-icons type="compose" size="20" color="#007AFF"/>
          <text>发布</text>
        </view>
      </view>

      <view class="moments-list">
        <view v-for="moment in moments" :key="moment.id" class="moment-card">
          <view class="moment-header">
            <image class="moment-avatar" :src="moment.userAvatar" mode="aspectFill"/>
            <view class="moment-user-info">
              <text class="moment-username">{{moment.username}}</text>
              <text class="moment-time">{{moment.time}}</text>
            </view>
          </view>
          
          <view class="moment-content">
            <text class="moment-text">{{moment.content}}</text>
            <image v-if="moment.image" class="moment-image" :src="moment.image" mode="aspectFill"/>
          </view>

          <view class="moment-course" v-if="moment.course">
            <uni-icons type="bookmark" size="16" color="#666666"/>
            <text>{{moment.course}}</text>
          </view>

          <view class="moment-actions">
            <view class="action-item" @click="handleLike(moment)">
              <uni-icons :type="moment.isLiked ? 'heart-filled' : 'heart'" size="20" :color="moment.isLiked ? '#FF6B6B' : '#666666'"/>
              <text>{{moment.likes}}</text>
            </view>
            <view class="action-item" @click="handleComment(moment)">
              <uni-icons type="chat" size="20" color="#666666"/>
              <text>{{moment.comments.length}}</text>
            </view>
            <view class="action-item" @click="handleShare(moment)">
              <uni-icons type="redo" size="20" color="#666666"/>
              <text>分享</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 发布动态弹窗 -->
    <uni-popup ref="postPopup" type="bottom">
      <view class="post-modal">
        <view class="post-header">
          <text class="post-title">分享学习动态</text>
          <uni-icons type="close" size="24" color="#666666" @click="closePostModal"/>
        </view>
        <view class="post-body">
          <textarea
            v-model="newPost.content"
            class="post-textarea"
            placeholder="分享你的学习心得..."
            maxlength="500"
          />
          <view class="post-course-selector" @click="selectCourse">
            <uni-icons type="bookmark" size="20" color="#666666"/>
            <text>{{newPost.course || '选择关联课程'}}</text>
          </view>
          <view class="post-image-upload" @click="uploadImage">
            <uni-icons type="image" size="40" color="#666666"/>
            <text>添加图片</text>
          </view>
        </view>
        <view class="post-footer">
          <button class="submit-btn" @click="submitPost">发布</button>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const userInfo = ref({
  username: '学习达人',
  title: '持续进步',
  avatar: 'https://public.readdy.ai/ai/img_res/f8f36239306dc434f8b93844c70c95c9.jpg',
  totalStudyTime: 3600 * 80, // 80小时
  weekStreak: 12,
  followers: 238,
  isFollowed: false
});

const topUsers = ref([
  {
    id: 1,
    username: '编程小王子',
    avatar: 'https://public.readdy.ai/ai/img_res/a4f0bc7261999e1d8e0df1d3a4c6229c.jpg',
    studyTime: 3600 * 100
  },
  {
    id: 2,
    username: '代码女神',
    avatar: 'https://public.readdy.ai/ai/img_res/3d2966a5795b62d1b0488a8e39f63a37.jpg',
    studyTime: 3600 * 95
  },
  {
    id: 3,
    username: '算法大师',
    avatar: 'https://public.readdy.ai/ai/img_res/3510f8bcaeca185680e3789f99d5b9b3.jpg',
    studyTime: 3600 * 90
  }
]);

const moments = ref([
  {
    id: 1,
    username: '编程小王子',
    userAvatar: 'https://public.readdy.ai/ai/img_res/8a46a81a396c74ff0d60c283545a5c79.jpg',
    time: '10分钟前',
    content: '今天终于搞定了React的性能优化问题，感觉特别有成就感！分享一下我的学习心得...',
    image: 'https://public.readdy.ai/ai/img_res/ef85ff5f1f8907fbafa4c331ac6bc6f8.jpg',
    course: 'React高级开发实战',
    likes: 45,
    isLiked: false,
    comments: [
      { id: 1, content: '太棒了！能详细分享一下吗？' }
    ]
  }
]);

const postPopup = ref<any>(null);
const newPost = ref({
  content: '',
  course: '',
  image: ''
});

const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}小时${minutes}分钟`;
};

const handleFollow = () => {
  userInfo.value.isFollowed = !userInfo.value.isFollowed;
  if (userInfo.value.isFollowed) {
    userInfo.value.followers++;
  } else {
    userInfo.value.followers--;
  }
};

const handleLike = (moment: any) => {
  moment.isLiked = !moment.isLiked;
  moment.likes += moment.isLiked ? 1 : -1;
};

const handleComment = (moment: any) => {
  uni.showToast({
    title: '评论功能开发中',
    icon: 'none'
  });
};

const handleShare = (moment: any) => {
  uni.showToast({
    title: '分享功能开发中',
    icon: 'none'
  });
};

const showPostModal = () => {
  postPopup.value.open();
};

const closePostModal = () => {
  newPost.value = {
    content: '',
    course: '',
    image: ''
  };
  postPopup.value.close();
};

const selectCourse = () => {
  uni.showToast({
    title: '课程选择功能开发中',
    icon: 'none'
  });
};

const uploadImage = () => {
  uni.showToast({
    title: '图片上传功能开发中',
    icon: 'none'
  });
};

const submitPost = () => {
  if (!newPost.value.content.trim()) {
    uni.showToast({
      title: '请输入内容',
      icon: 'none'
    });
    return;
  }
  
  moments.value.unshift({
    id: Date.now(),
    username: userInfo.value.username,
    userAvatar: userInfo.value.avatar,
    time: '刚刚',
    content: newPost.value.content,
    image: newPost.value.image,
    course: newPost.value.course,
    likes: 0,
    isLiked: false,
    comments: []
  });
  
  closePostModal();
  uni.showToast({
    title: '发布成功',
    icon: 'success'
  });
};
</script>

<style>
page {
  height: 100%;
  background-color: #F5F7FA;
}

.page-container {
  padding: 30rpx;
}

.study-stats-card {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 20rpx;
}

.user-details {
  flex: 1;
}

.username {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 8rpx;
}

.user-title {
  font-size: 14px;
  color: #666666;
}

.follow-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 16rpx 32rpx;
  background-color: #007AFF;
  border-radius: 30rpx;
}

.follow-btn text {
  color: #FFFFFF;
  font-size: 14px;
}

.study-data {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1px solid #F5F5F5;
}

.data-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data-value {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
  margin-bottom: 8rpx;
}

.data-label {
  font-size: 14px;
  color: #666666;
}

.leaderboard-section {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.section-subtitle {
  font-size: 14px;
  color: #666666;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
}

.rank-badge {
  width: 40rpx;
  height: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
}

.rank-1 {
  color: #FFD700;
}

.rank-2 {
  color: #C0C0C0;
}

.rank-3 {
  color: #CD7F32;
}

.user-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.user-info-compact {
  flex: 1;
}

.user-name {
  font-size: 16px;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.study-time {
  font-size: 14px;
  color: #666666;
}

.moments-section {
  background-color: #FFFFFF;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.post-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.post-btn text {
  font-size: 14px;
  color: #007AFF;
}

.moments-list {
  display: flex;
  flex-direction: column;
  gap: 30rpx;
}

.moment-card {
  border-bottom: 1px solid #F5F5F5;
  padding-bottom: 30rpx;
}

.moment-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.moment-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 40rpx;
  margin-right: 20rpx;
}

.moment-user-info {
  flex: 1;
}

.moment-username {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
  display: block;
  margin-bottom: 4rpx;
}

.moment-time {
  font-size: 12px;
  color: #999999;
}

.moment-content {
  margin-bottom: 20rpx;
}

.moment-text {
  font-size: 16px;
  color: #333333;
  line-height: 1.6;
  margin-bottom: 20rpx;
}

.moment-image {
  width: 100%;
  height: 400rpx;
  border-radius: 12rpx;
}

.moment-course {
  display: flex;
  align-items: center;
  gap: 8rpx;
  margin-bottom: 20rpx;
  padding: 16rpx;
  background-color: #F8F9FA;
  border-radius: 8rpx;
}

.moment-course text {
  font-size: 14px;
  color: #666666;
}

.moment-actions {
  display: flex;
  gap: 40rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.action-item text {
  font-size: 14px;
  color: #666666;
}

.post-modal {
  background-color: #FFFFFF;
  border-radius: 20rpx 20rpx 0 0;
  padding: 30rpx;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.post-title {
  font-size: 18px;
  font-weight: bold;
  color: #333333;
}

.post-body {
  margin-bottom: 30rpx;
}

.post-textarea {
  width: 100%;
  height: 200rpx;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
  font-size: 16px;
  margin-bottom: 20rpx;
}

.post-course-selector {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.post-course-selector text {
  font-size: 14px;
  color: #666666;
}

.post-image-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
  gap: 16rpx;
}

.post-image-upload text {
  font-size: 14px;
  color: #666666;
}

.post-footer {
  display: flex;
  justify-content: flex-end;
}

.submit-btn {
  background-color: #007AFF;
  color: #FFFFFF;
  padding: 20rpx 60rpx;
  border-radius: 30rpx;
  font-size: 16px;
}
</style>

