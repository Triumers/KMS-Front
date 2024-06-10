<template>
  <div class="container">
    <div class="header no-background no-shadow">
      <h2>마이페이지</h2>
    </div>
    <div class="button-group" style="justify-content: center; margin-bottom: 20px;">
      <button @click="goToChangePassword" class="button">비밀번호 변경</button>
      <button @click="goToEditInfo" class="button">내 정보 수정</button>
    </div>
    <div class="user-info" v-if="userInfo" style="text-align: center;">
      <img :src="profileImg" alt="프로필 이미지" class="profile-img" />
      <div class="info-row">
        <span class="value" style="font-weight: bold;">{{ userInfo.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">전화번호:</span>
        <span class="value">{{ userInfo.phoneNumber }}</span>
      </div>
      <div class="info-row">
        <span class="label">이메일:</span>
        <span class="value">{{ userInfo.email }}</span>
      </div>
      <div class="info-row">
        <span class="label">입사일:</span>
        <span class="value">{{ userInfo.startDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">퇴사일:</span>
        <span class="value">{{ userInfo.endDate }}</span>
      </div>
      <div class="info-row">
        <span class="label">팀:</span>
        <span class="value">{{ userInfo.team.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">직책:</span>
        <span class="value">{{ userInfo.position.name }}</span>
      </div>
      <div class="info-row">
        <span class="label">직급:</span>
        <span class="value">{{ userInfo.rank.name }}</span>
      </div>
    </div>
    <div class="section">
      <h3 class="section-title">내 활동</h3>
      <div class="activity-container">
        <div class="activity-card" @click="goToMyPosts">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>내 게시물</span>
        </div>
        <div class="activity-card" @click="goToMyComments">
          <i class="fa-solid fa-comment"></i>
          <span>내 댓글</span>
        </div>
        <div class="activity-card" @click="goToFavoritePosts">
          <i class="fa-solid fa-bookmark"></i>
          <span>즐겨찾기</span>
        </div>
        <div class="activity-card" @click="goToLikedPosts">
          <i class="fa-solid fa-heart"></i>
          <span>좋아요 한 게시물</span>
        </div>
      </div>
    </div>

    <div class="section" v-if="isManager">
      <hr>
      <h3 class="section-title">관리자 전용</h3>
      <div class="activity-container">
        <div class="button" data-bs-toggle="modal" data-bs-target="#addTab">
          <i class="fa-solid fa-pen-to-square"></i>
          <span>워크스페이스 및 스터디 추가</span>
        </div>

        <div class="modal fade" id="addTab" tabindex="-1" aria-labelledby="addTabLabel" aria-hidden="true">
          <div class="modal-dialog">
              <div class="modal-content">
                  <div class="modal-header">
                      <h1 class="modal-title fs-5" id="addTabLabel">탭 추가하기</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                      <div id="form-container">
                          <div id="tab-select" class="d-flex align-items-center mb-3">
                              <b-form-select v-model="tabForm.topTab" :options="options"></b-form-select>
                              <input v-if="tabForm.topTab === '스터디'" type="text" v-model="tabForm.bottomTab"
                                  placeholder="스터디명을 입력하세요." class="form-control ms-2" />
                          </div>
                          <div class="form-group d-flex flex-column">
                              <label class="form-label fw-bold">대표회원 선택</label>
                              <p v-if="tabForm.leader"> ○ {{ tabForm.leader.name }} ({{ tabForm.leader.team.name }} {{
                                  tabForm.leader.position.name }} {{
                                  tabForm.leader.rank.name }})</p>
                              <div class="d-flex mb-2">
                                  <input v-model="search" type="text" placeholder="직원 이름 검색" class="form-control" />

                                  <button class="search-button" id="search-post" @click="searchEmployees">
                                      <img src="@/assets/icons/search_icon.png" alt="Search" />
                                  </button>
                              </div>
                              <div v-if="searchEmployeeList && searchEmployeeList.length > 0" class="list-group">
                                  <button v-for="employee in searchEmployeeList" :key="employee.id"
                                      class="list-group-item list-group-item-action"
                                      @click="selectEmployee(employee)">
                                      {{ employee.name }} ({{ employee.team.name }} {{ employee.position.name }} {{
                                      employee.rank.name }})
                                  </button>
                              </div>
                              <div v-else-if="searchEmployeeList && search" class="text-danger">
                                  검색 결과가 없습니다.
                              </div>
                              <button v-if="searchEmployeeList" class="btn btn-secondary mt-2"
                                  @click="selectLeader">선택</button>
                          </div>
                      </div>
                  </div>
                  <div class="modal-footer">
                      <button type="button" class="button" data-bs-dismiss="modal">취소</button>
                      <button type="button" class="button" @click="saveNewTab">저장</button>
                  </div>
              </div>
          </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useStore } from 'vuex';
import defaultProfileImage from '@/assets/images/profile_image.png'; // 기본 이미지 경로를 import

const router = useRouter();
const store = useStore();
const userInfo = ref(null);

const options = ["워크스페이스", "스터디"];

// 탭 추가
const search = ref('');
const searchEmployeeList = ref(null);

const isManager = computed(() => {
  const userRole = store.state.userRole;
  return ['ROLE_HR_MANAGER', 'ROLE_ADMIN'].includes(userRole);
});

const tabForm = ref({
  topTab: '워크스페이스',
  bottomTab: null,
  leader: null,
  teamId: null
});

onMounted(async () => {
  if (!store.state.isLoggedIn) {
    router.push('/login');
    return;
  }
  
  try {
    store.dispatch('checkUserInfo');
    const token = localStorage.getItem('token');
    const response = await axios.get('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/my-page', {
      headers: {
        Authorization: token,
      },
    });
    userInfo.value = response.data.employee[0];
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    // 오류 처리 로직 추가
  }
});

function goToChangePassword() {
  router.push('/my-page/edit-password');
}

function goToEditInfo() {
  router.push('/my-page/edit');
}

function goToMyPosts() {
  router.push('/my-page/posts');
}

function goToLikedPosts() {
  router.push('/my-page/liked-posts');
}

function goToFavoritePosts() {
  router.push('/my-page/favorite-posts');
}

function goToMyComments() {
  router.push('/my-page/comments');
}

function selectEmployee(employee) {
  selected.value = employee;
}

function selectLeader() {
  tabForm.value.leader = selected.value;
}

async function saveNewTab() {
  if (tabForm.value.topTab === "워크스페이스") {
    tabForm.value.teamId = tabForm.value.leader.team.id;
  }

  const requestData = {
    topTab: {
      name: tabForm.value.topTab
    },
    bottomTab: {
      name: tabForm.value.bottomTab
    },
    teamId: tabForm.value.teamId,
    isPublic: false
  };

  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/tab/regist/new/${tabForm.value.leader.id}`, requestData);
      
      alert("탭 저장 완료");
      location.reload(true);
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    console.log("탭 저장에 실패했습니다:", error);
  } finally {
    // ...
  }
}

async function searchEmployees() {
  if (search.value.trim() === '') {
    searchEmployeeList.value = [];
    return;
  }

  try {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const requestBody = { name: search.value };
    const response = await axios.post('http://triumers-back.ap-northeast-2.elasticbeanstalk.com/employee/find/name', requestBody, {
      headers: {
        Authorization: `${token}`,
      },
    });
    searchEmployeeList.value = response.data.employee;
  } catch (error) {
    console.error('Error searching employees:', error);
    if (error.response && error.response.status === 401) {
      router.push('/login');
    }
  }
}

// 프로필 이미지 URL이 존재하지 않으면 기본 이미지를 반환하는 computed 속성
const profileImg = computed(() => {
  return userInfo.value && userInfo.value.profileImg ? userInfo.value.profileImg : defaultProfileImage;
});
</script>
  
<style scoped>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .no-background {
    background-color: transparent;
  }
  
  .no-shadow {
    box-shadow: none;
  }
  
  .user-info {
    background-color: #f5f5f5;
    border-radius: 4px;
    padding: 20px;
    margin-bottom: 20px;
  }
  
  .info-row {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .label {
    font-weight: bold;
    margin-right: 10px;
  }
  
  .value {
    margin-left: 10px;
  }
  
  .profile-img {
    max-width: 150px;
    max-height: 150px;
    border-radius: 50%;
    margin-bottom: 20px;
  }
  
  .button-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .button {
    padding: 8px 16px;
    border-radius: 4px;
    background-color: #042444;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .button:hover {
    background-color: #042444c5;
  }
  
  .section {
    margin-top: 40px;
  }
  
  .section-title {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .activity-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  
  .activity-card {
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transition: box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .activity-card:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .activity-card i {
    font-size: 24px;
    color: #555;
  }
  
  .activity-card span {
    color: #333;
  }

  #tab-select {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
}

#tab-select .form-control {
    margin-left: 10px;
}

.search-input {
    display: flex;
    margin-bottom: 10px;
}

.tab-select>input{
    width: max-content;
}


.no-results {
    color: #042444;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

#form-container{
    width: 100%;
}
</style>
