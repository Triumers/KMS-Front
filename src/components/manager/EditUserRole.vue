<template>
  <div class="container">
    <h2>회원 권한 수정</h2>
    <div class="form-group">
      <label for="role">권한:</label>
      <select id="role" v-model="role" required>
        <option value="ROLE_NORMAL">일반 사용자</option>
        <option value="ROLE_LEADER">리더</option>
        <option value="ROLE_HR_MANAGER">인사 매니저</option>
        <option value="ROLE_ADMIN">관리자</option>
      </select>
    </div>
    <button class="submit-button" @click="updateMemberPermission">수정</button>
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

async function updateMemberPermission() {
try {
  const token = localStorage.getItem('token');
  await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/manager/edit/role', {
    email: memberEmail.value,
    role: role.value,
  }, {
    headers: {
      Authorization: token,
    },
  });
  alert('회원 권한이 성공적으로 수정되었습니다.');
  router.push({ name: 'EditUser', params: { id: memberId } });
} catch (error) {
  console.error('Failed to update member permission:', error);
  alert('회원 권한 수정에 실패했습니다. 다시 시도해주세요.');
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

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
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