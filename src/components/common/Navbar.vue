<template>
  <div class="navbar">
    <li class="nav-item">
      <router-link class="nav-link" to="/wiki/1">Wiki</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" :to="'/workspace/' + workspaceTabId + '/wiki'">Workspace</router-link>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
        aria-expanded="false">
        Group
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li>
          <router-link class="dropdown-item" :to="'/group/study/' + (studyTabIds && studyTabIds.length > 0 ? studyTabIds[0] : '')">Study</router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/group/organization/2">Organization</router-link>
        </li>
      </ul>
    </li>

      <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
        aria-expanded="false">
        Office Life
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li>
          <router-link class="dropdown-item" to="/office-life/3">회사생활</router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/office-life/anonymous-board/list">익명게시판</router-link>
        </li>
      </ul>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/search-employee">직원 조회</router-link>
    </li>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

onMounted(async () => {
  await getUserCategory();
});

const categoryList = ref(null);
const workspaceTabId = ref(null);
const studyTabIds = ref(null);

async function getUserCategory() {
  try {
      const token = localStorage.getItem('token');
      if (token) {
          axios.defaults.headers.common['Authorization'] = token;
          const response = await axios.get(`http://localhost:5000/group/employee`);
          categoryList.value = response.data;

          setCategory();
      } else {
          console.log("잘못된 접근입니다.");
      }
  } catch (error) {
          console.log("탭 이름을 불러올 수 없습니다.");
  } finally {
  }
}

function setCategory() {

  const workspaceCategory = categoryList.value.find(category => category.topTabName === "워크스페이스");
  if (workspaceCategory) {
    workspaceTabId.value = workspaceCategory.tabId;
  }

  studyTabIds.value = categoryList.value.filter(category => category.topTabName === "스터디")
                                        .map(category => category.tabId);
}

</script>

<style scoped>
.navbar {
  display:list-item;
  list-style-type: none;
  flex-direction: column;
  width: 200px;
  background-color: #042444;
  padding: 10px;
}

.nav-item {
  margin: 5px 0;
  padding: 10px;
  text-decoration: none;
  color: #ffffff;
}

.nav-item:hover {
  background-color: #e2e6ea;
}
</style>
