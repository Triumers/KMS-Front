<template>
  <div class="container">
    <div class="header">
      <h2 class="form-title">글 작성</h2>
      <button type="submit" class="submit-button" @click="saveAnonymousBoard">작성</button>
    </div>
    <div class="form">
      <div class="form-group">
        <input type="text" id="title" v-model="title" required class="form-input" placeholder="제목을 입력하세요" />
      </div>
      <div class="form-group">
        <input type="text" id="nickname" v-model="nickname" class="form-input nickname-input" placeholder="익명" />
      </div>
      <div class="form-group">
        <textarea id="content" v-model="content" required class="form-textarea" placeholder="내용을 입력하세요"></textarea>
      </div>
    </div>
  </div>
 </template>
 
 <script setup>
 import { ref } from 'vue';
 // import axios from 'axios';
 import { useRouter } from 'vue-router';
 
 const router = useRouter();
 const title = ref('');
 const content = ref('');
 const nickname = ref('익명');
 
 // 더미 데이터 생성
 const dummyResponse = {
  data: {
    id: 1,
    title: '',
    content: '',
    nickname: '',
    createdDate: '2023-06-10T10:00:00',
    macAddress: 'AA:BB:CC:DD:EE:FF',
  },
 };
 
 // async function saveAnonymousBoard() {
 //   try {
 //     const response = await axios.post('/anonymous-board', {
 //       title: title.value,
 //       content: content.value,
 //       nickname: nickname.value,
 //     });
 //     router.push(`/anonymous-board/${response.data.id}`);
 //   } catch (error) {
 //     console.error('Failed to save anonymous board:', error);
 //   }
 // }
 
 function saveAnonymousBoard() {
  // 더미 데이터 사용
  const response = dummyResponse;
  router.push(`/office-life/anonymous-board/${response.data.id}`);
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
 
 .form-title {
  font-size: 24px;
  font-weight: bold;
 }
 
 .submit-button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
 }
 
 .form-group {
  margin-bottom: 20px;
 }
 
 .form-input {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
 }
 
 .nickname-input {
  color: #888;
 }
 
 .form-textarea {
  width: 100%;
  height: 300px;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
  font-size: 16px;
  resize: vertical;
 }
 </style>