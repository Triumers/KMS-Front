<template>
  <div class="container">
    <div class="header">
      <h2>익명 게시판</h2>
      <button @click="goToWriteForm" class="write-button">글쓰기</button>
    </div>
    <div class="search-box">
      <div class="search-type">
        <select v-model="searchType" class="search-type-select">
          <option value="titleAndContent">제목+내용</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
      </div>
      <input type="text" v-model="keyword" placeholder="검색어 입력" class="search-input"/>
      <button @click="searchAnonymousBoards" class="search-button">검색</button>
    </div>
    <div class="board-list">
      <div v-for="(board, index) in paginatedBoards" :key="board.id" class="board-item" @click="goToBoardDetail(board.id)">
        <div class="board-header">
          <span class="board-title">{{ board.title }}</span>
          <div class="board-info-container">
            <span class="board-info">{{ formatNickname(board.nickname) }} | {{ formatDate(board.createdDate) }}</span>
          </div>
        </div>
        <p class="board-content">{{ board.content.slice(0, 50) }}...</p>
        <span class="comment-count">댓글 {{ board.commentCount }}</span>
      </div>
    </div>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination-button">이전</button>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">다음</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const anonymousBoardList = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalCount = ref(0);
const searchType = ref('titleAndContent');
const keyword = ref('');

const totalPages = computed(() => Math.ceil(totalCount.value / pageSize.value));

const paginatedBoards = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return anonymousBoardList.value.slice(startIndex, endIndex);
});

// 더미 데이터 생성
const dummyData = [
  {
    id: 1,
    nickname: '익명',
    title: '제목',
    content: '내용',
    createdDate: '2023-06-01T10:00:00',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    commentCount: 5
  },
  {
    id: 2,
    nickname: '익명',
    title: 'Qui ad consequat aute nisi officia nostrud id officia. Consectetur',
    content: 'Qui ad consequat aute nisi officia nostrud id officia. Consectetur id nisi laborum non ipsum exercitation est voluptate. Minim elit occaecat est labore nostrud elit. Amet consectetur aliquip consequat mollit laborum esse quis officia. Minim non occaecat quis aute esse officia.',
    createdDate: '2023-06-02T11:00:00',
    macAddress: '11:22:33:44:55:66',
    commentCount: 2
  },
  // ... (더미 데이터 추가) ...
];

onMounted(() => {
  // 더미 데이터를 anonymousBoardList에 할당
  anonymousBoardList.value = dummyData;
  totalCount.value = dummyData.length;
});

// async function fetchAnonymousBoardList() {
//   try {
//     const response = await axios.get(`/anonymous-board?page=${currentPage.value - 1}&size=${pageSize.value}`);
//     anonymousBoardList.value = response.data.content;
//     totalCount.value = response.data.totalElements;
//   } catch (error) {
//     console.error('Failed to fetch anonymous board list:', error);
//   }
// }

// async function searchAnonymousBoards() {
//   try {
//     const encodedKeyword = encodeURIComponent(keyword.value);
//     const response = await axios.get(`/anonymous-board/search?keyword=${encodedKeyword}&type=${searchType.value}&page=${currentPage.value - 1}&size=${pageSize.value}`);
//     anonymousBoardList.value = response.data.content;
//     totalCount.value = response.data.totalElements;
//   } catch (error) {
//     console.error('Failed to search anonymous boards:', error);
//   }
// }

// async function fetchAnonymousBoardDetailWithComments(boardId) {
//   try {
//     const boardResponse = await axios.get(`/anonymous-board/${boardId}`);
//     const commentResponse = await axios.get(`/anonymous-board/${boardId}/comments`);

//     const board = boardResponse.data;
//     board.commentCount = commentResponse.data.totalElements;

//     return board;
//   } catch (error) {
//     console.error('Failed to fetch anonymous board detail with comments:', error);
//     throw error;
//   }
// }

function goToWriteForm() {
  router.push('/office-life/anonymous-board/new');
}

function goToBoardDetail(boardId) {
  router.push(`/office-life/anonymous-board/${boardId}`);
}

function formatNickname(nickname) {
  return nickname;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${year}/${month}/${day} ${hours}:${minutes}`;
}

function padZero(number) {
  return number.toString().padStart(2, '0');
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    // fetchAnonymousBoardList();
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // fetchAnonymousBoardList();
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.write-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #2d42de;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.write-button:hover {
  background-color: #1b2cba;
}

.search-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-type {
  margin-right: 10px;
}

.search-type-select {
  padding: 10px 14px;  /* Increased padding */
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-type-select:hover {
  border-color: #888;
}

.search-input {
  flex-grow: 1;
  padding: 10px 14px;  /* Increased padding */
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-input:hover {
  border-color: #888;
}

.search-button {
  padding: 10px 16px;  /* Increased padding */
  border-radius: 4px;
  background-color: #2d42de;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #1b2cba;
}

.board-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.board-item {
  background-color: #f5f5f5;
  border-radius: 4px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.board-item:hover {
  background-color: #eaeaea;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.board-title {
  font-weight: bold;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%; /* Adjust as needed */
}

.board-info-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.board-info {
  font-size: 12px;
  color: #888;
}

.comment-count {
  font-size: 12px;
  color: #888;
  margin-top: 5px; /* Added margin to move it down */
}

.board-content {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 10px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination-button {
  padding: 8px 16px;
  border-radius: 4px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #388e3c;
}

.pagination-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .container {
    padding: 10px;
  }

  .search-box {
    flex-direction: column;
    align-items: stretch;
  }

  .search-type-select,
  .search-input,
  .search-button {
    margin-bottom: 10px;
  }

  .board-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .board-title {
    font-size: 16px;
  }

  .board-content {
    padding: 0;
  }
}
</style>
