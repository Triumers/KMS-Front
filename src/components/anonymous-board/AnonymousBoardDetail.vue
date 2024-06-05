<template>
  <div class="container">
    <div class="board-detail">
      <div class="board-header">
        <h2 class="board-title">{{ anonymousBoard.title }}</h2>
        <hr class="title-separator" />
        <div class="board-actions">
          <button @click="goToBoardList" class="list-button">글 목록</button>
          <button @click="deleteAnonymousBoard" v-if="isAdmin" class="delete-button">삭제</button>
        </div>
      </div>
      <div class="board-info">
        <span class="board-author">{{ anonymousBoard.nickname }}</span>
        <span class="board-date">{{ formatDateTime(anonymousBoard.createdDate) }}</span>
      </div>
      <div class="board-content">
        <p>{{ anonymousBoard.content }}</p>
      </div>
    </div>
    <hr class="comment-separator" />
    <div class="comment-form">
      <h3 class="comment-form-title">댓글 작성</h3>
      <input type="text" v-model="newComment.nickname" placeholder="닉네임" class="comment-nickname-input" />
      <div class="comment-input-wrapper">
        <textarea v-model="newComment.content" placeholder="댓글을 입력하세요" class="comment-input"></textarea>
        <button @click="saveAnonymousBoardComment" class="submit-button">작성</button>
      </div>
    </div>
    <div class="comment-section">
      <h3 class="comment-title">댓글 목록</h3>
      <hr class="comment-list-separator" />
      <ul class="comment-list">
        <li v-for="comment in anonymousBoardCommentList" :key="comment.id" class="comment-item">
          <div class="comment-info">
            <span class="comment-author">{{ comment.nickname }}</span>
            <span class="comment-date">{{ formatDateTime(comment.createdDate) }}</span>
          </div>
          <p class="comment-content">{{ comment.content }}</p>
          <hr class="comments-separator" />
        </li>
      </ul>
      <div class="comment-pagination">
        <button @click="previousPage" :disabled="currentPage === 1" class="pagination-button">&lt;</button>
        <span class="pagination-info">{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">&gt;</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const anonymousBoard = ref({});
const anonymousBoardCommentList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const newComment = ref({
  content: '',
  nickname: '익명',
});
const isAdmin = ref(false);

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

onMounted(() => {
  fetchAnonymousBoardById();
  fetchAnonymousBoardCommentList();
  checkAdminRole();
});

async function fetchAnonymousBoardById() {
  try {
    const response = await axios.get(`http://localhost:5000/anonymous-board/${route.params.id}`);
    anonymousBoard.value = response.data;
  } catch (error) {
    console.error('Failed to fetch anonymous board:', error);
  }
}

async function fetchAnonymousBoardCommentList() {
  try {
    const response = await axios.get(`http://localhost:5000/anonymous-board/${route.params.id}/comments?page=${currentPage.value - 1}&size=${pageSize.value}`);
    anonymousBoardCommentList.value = response.data.content;
    totalCount.value = response.data.totalElements;
  } catch (error) {
    console.error('Failed to fetch anonymous board comment list:', error);
  }
}

async function saveAnonymousBoardComment() {
  try {
    const response = await axios.post(`http://localhost:5000/anonymous-board/${route.params.id}/comments`, newComment.value);
    newComment.value.content = '';
    newComment.value.nickname = '익명';
    fetchAnonymousBoardCommentList();
  } catch (error) {
    console.error('Failed to save anonymous board comment:', error);
  }
}

async function deleteAnonymousBoard() {
  try {
    await axios.delete(`http://localhost:5000/anonymous-board/${route.params.id}`);
    router.push('/office-life/anonymous-board/list');
  } catch (error) {
    console.error('Failed to delete anonymous board:', error);
  }
}

function formatDateTime(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const year = dateTime.getFullYear();
  const month = padZero(dateTime.getMonth() + 1);
  const day = padZero(dateTime.getDate());
  const hours = padZero(dateTime.getHours());
  const minutes = padZero(dateTime.getMinutes());
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchAnonymousBoardCommentList();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchAnonymousBoardCommentList();
  }
}

function goToBoardList() {
  router.push('/office-life/anonymous-board/list');
}

function checkAdminRole() {
  // 관리자 여부를 확인하는 로직 추가
  // 예: 로그인한 사용자의 역할을 확인하여 관리자인 경우 isAdmin을 true로 설정
  // 실제 구현에서는 서버에서 사용자 정보를 가져와 확인해야 함
  isAdmin.value = true; // 예시로 관리자로 설정
}
</script>

  
  <style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }

  .title-separator {
  border: none;
  border-top: 2px solid #363333;
  margin-top: 10px;
  margin-bottom: 20px;
}

  
  .board-detail {
    margin-bottom: 40px;
  }
  
  .board-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .board-title {
    font-size: 28px;
    font-weight: bold;
  }
  
  .board-actions {
    display: flex;
    align-items: center;
  }
  
  .delete-button {
    padding: 8px 16px;
    background-color: #c9170b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .delete-button:hover {
  background-color: #d32f2f;
}
  
  .board-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #888;
    font-size: 14px;
  }
  
  .board-author {
    font-weight: bold;
  }
  
  .board-date {
    font-style: italic;
  }
  
  .board-content {
    font-size: 16px;
    line-height: 1.6;
    margin-bottom: 20px;
  }
  
  .comment-separator {
  border: none;
  border-top: 2px solid #ccc;
  margin-top: 40px;
  margin-bottom: 20px;
}

.comment-list-separator {
  border: none;
  border-top: 2px solid #ccc;
  margin-top: 10px;
  margin-bottom: 20px;
}

  .comment-form {
    margin-top: 40px;
    margin-bottom: 40px;
  }
  
  .comment-form-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .comment-nickname-input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    width: 200px;
  }

  .comment-nickname-input::placeholder {
  color: #aaa;
}
  
  .comment-input-wrapper {
    display: flex;
    align-items: center;
  }
  
  .comment-input {
    flex: 1;
    height: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: vertical;
    margin-right: 10px;
  }
  
  .submit-button {
  padding: 10px 16px;
  height: 100px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #0c5195;
}
  
  .comment-section {
    margin-top: 40px;
  }
  
  .comment-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  .comment-list {
    list-style-type: none;
    padding: 0;
  }
  
  .comment-item {
    /* padding: 10px; */
    margin-bottom: 15px;
  }
  
  .comment-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    color: #888;
    font-size: 14px;
  }
  
  .comment-author {
    font-weight: bold;
  }
  
  .comment-date {
    font-style: italic;
  }
  
  .comment-content {
    font-size: 16px;
    line-height: 1.4;
  }
  
  .comment-divider {
  border: none;
  border-top: 2px solid #ccc;
  margin-top: 10px;
}

.comments-separator {
  border: none;
  border-top: 1px solid #b0b0b0;
  margin-top: 10px;
  margin-bottom: 10px;
}
  
.comment-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 5px 10px;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
}

  
.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

  .pagination-button:hover:not(:disabled) {
  background-color: #042444;
}
  
.pagination-info {
  font-size: 14px;
}

.list-button {
  padding: 8px 16px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.list-button:hover {
  background-color: #0c5195;
}

  </style>