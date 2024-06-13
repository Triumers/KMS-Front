<template>
  <div class="container">
    <h2>회원 비밀번호 초기화</h2>
    <p>회원의 비밀번호를 초기화하시겠습니까?</p>
    <div class="form-group">
      <label for="password">비밀번호:</label>
      <input type="password" id="password" v-model="password" />
      <p class="initial-password-info">비밀번호를 따로 입력하지 않을 시 초기 비밀번호는 "welcome"으로 설정됩니다.</p>
    </div>
    <button class="submit-button" @click="resetMemberPassword">초기화</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const memberId = route.params.id;

const memberEmail = ref('');
const password = ref('');

onMounted(async () => {
try {
  const token = localStorage.getItem('token');
  const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/id/${memberId}`, {
    headers: {
      Authorization: token,
    },
  });

  memberEmail.value = response.data.employee[0].email;
} catch (error) {
  console.error('Failed to fetch member email:', error);
  alert('회원 이메일을 가져오는데 실패했습니다.');
}
});

async function resetMemberPassword() {
try {
  const token = localStorage.getItem('token');
  const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/edit/password', {
    email: memberEmail.value,
    password: password.value,
  }, {
    headers: {
      Authorization: token,
    },
  });
  const newPassword = response.data.password;
  alert(`회원의 비밀번호가 초기화되었습니다. 새로운 비밀번호: ${newPassword}`);
  router.push({ name: 'EditUser', params: { id: memberId } });
} catch (error) {
  console.error('Failed to reset member password:', error);
  alert('회원 비밀번호 초기화에 실패했습니다. 다시 시도해주세요.');
}
}
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
    margin-bottom: 20px;
  }

  input[type="password"],
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  label {
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
  }

.submit-button {
  padding: 10px 20px;
  background-color: #042444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1b2cba;
}
</style>