<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>회원 검색</h2>
      <button class="create-button" @click="goToMemberCreate">회원 생성</button>
    </div>
    <div class="search-container">
      <input
        type="text"
        v-model="searchKeyword"
        placeholder="이름 또는 이메일 검색"
        class="search-input"
        @input="searchMembers"
        @keyup.enter="searchMembers"
      />
      <div class="search-button-wrapper">
        <button class="search-button" @click="searchMembers">검색</button>
      </div>
    </div>
    <div v-if="members.length === 0 && searchKeyword !== ''" class="no-results">
      검색 결과가 없습니다.
    </div>
    <div class="member-list">
      <div
        v-for="member in members"
        :key="member.id"
        class="member-item"
        @click="selectMember(member)"
      >
        <div class="member-name">{{ member.name }}</div>
        <div class="member-email">{{ member.email }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const searchKeyword = ref('');
const members = ref([]);

async function searchMembers() {
  try {
    const token = localStorage.getItem('token');
    let response;
    if (searchKeyword.value.includes('@')) {
      response = await axios.get(
        `http://localhost:5000/employee/find/email/${searchKeyword.value}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    } else {
      response = await axios.post(
        'http://localhost:5000/employee/find/name',
        {
          name: searchKeyword.value,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
    }
    members.value = response.data.employee;
  } catch (error) {
    console.error('Failed to search members:', error);
    // 오류 처리 로직 추가
    alert('회원 검색에 실패했습니다. 다시 시도해주세요.');
  }
}

function selectMember(member) {
  router.push({ name: 'MemberEdit', params: { id: member.id } });
}

function goToMemberCreate() {
  router.push({ name: 'MemberCreate' });
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

.no-background {
  background-color: transparent;
}
  
.no-shadow {
  box-shadow: none;
}
  
.create-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: #1b2cba;
}

.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.search-button-wrapper {
  margin-left: 10px;
}

.search-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #1b2cba;
}

.no-results {
  text-align: center;
  font-style: italic;
  color: #888;
  margin-bottom: 20px;
}

.member-list {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.member-item {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.member-item:hover {
  background-color: #e0e0e0;
}

.member-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

.member-email {
  font-size: 14px;
  color: #888;
}
</style>