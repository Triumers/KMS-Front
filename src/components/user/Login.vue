<template>
  <div class="container">
    <div class="login-form">
      <h2 class="form-title">로그인</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="email" id="email" v-model="email" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input type="password" id="password" v-model="password" required class="form-input" />
        </div>
        <button type="submit" class="login-button">로그인</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const email = ref('');
const password = ref('');

// 로그인 상태 확인 함수
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  if (token) {
    alert('이미 로그인한 상태입니다.');
    router.push('/wiki/posts');
  }
};

async function login() {
  try {
    const response = await axios.post('/login', {
      email: email.value,
      password: password.value,
    });
    const token = response.headers.get('Authorization');
    const userRole = response.headers.get('UserRole');
    store.dispatch('login', { token, userRole });
    router.push('/wiki/posts');
  } catch (error) {
    console.error('Failed to login:', error);
    alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
  }
}

onMounted(() => {
  checkLoginStatus();
});
</script>
  
  <style scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
  }
  
  .login-form {
    width: 400px;
    padding: 40px;
    background-color: white;
    border-radius: 4px;
  }
  
  .form-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  label {
    display: block;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .form-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }
  
  .login-button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    background-color: #042444;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .login-button:hover {
    background-color: #0c5195;
  }
  </style>