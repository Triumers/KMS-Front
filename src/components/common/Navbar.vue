<template>
  <div class="navbar" v-if="isLoggedIn">
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
          <router-link class="dropdown-item" :to="'/group/study/' + (studyTabIds && studyTabIds.length > 0 ? studyTabIds[0] : '')">스터디</router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/group/organization/2">모집</router-link>
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
        <li>
          <router-link class="dropdown-item" to="/search-employee">직원 조회</router-link>
        </li>
      </ul>
    </li>
    <div class="lunch-menu">
      <div class="lunch-menu-wrapper" @mouseover="menuHovered = true" @mouseleave="menuHovered = false">
        <button @click="toggleMenu">점심 메뉴 추천</button>
        <p v-if="showMenu && menuHovered">오늘의 점심 메뉴: {{ selectedMenu }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const isLoggedIn = computed(() => store.state.isLoggedIn);

const categoryList = ref(null);
const workspaceTabId = ref(null);
const studyTabIds = ref(null);

const menuHovered = ref(false);

onMounted(async () => {
  store.dispatch('checkUserInfo');
  await getUserCategory();
});

async function getUserCategory() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.get(`http://triumers-back.ap-northeast-2.elasticbeanstalk.com/group/employee`);
      categoryList.value = response.data;
      setCategory();
    }
  } catch (error) {
    console.log("탭 이름을 불러올 수 없습니다.");
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

const menuList = ref([
  '김치찌개',
  '된장찌개',
  '제육볶음',
  '돈까스',
  '짜장면',
  '짬뽕',
  '스파게티',
  '피자',
  '스테이크',
  '초밥',
  '막국수',
  '순대국밥',
  '라멘',
  '샐러드',
  '닭도리탕',
  '초밥',
  '수제비',
  '잔치국수',
  '카레',
  '돈카츠',
  '찜닭',
  '볶음밥',
  '닭갈비',
  '덮밥',
  '텐동',
  '피자',
  '된장찌개',
  '새싹비빔밥',
  '육회비빔밥',
  '소바',
  '도시락',
  '순두부찌개',
  '라볶이',
  '떡볶이',
  '육개장',
  '짜글이',
  '김치찜',
  '우동',
  '콩나물국밥',
  '쌀국수',
  '샤브샤브',
  '마라탕',
  '부대찌개',
  '부타동',
  '칼국수',
  '김밥',
  '리조또'
]);

const selectedMenu = ref('');
const showMenu = ref(false);

function selectRandomMenu() {
  const randomIndex = Math.floor(Math.random() * menuList.value.length);
  selectedMenu.value = menuList.value[randomIndex];
}

function toggleMenu() {
  showMenu.value = !showMenu.value;
  if (showMenu.value) {
    selectRandomMenu();
  }
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

.lunch-menu {
  margin-top: 30%;
  padding: 10px;
  text-align: center;
}

.lunch-menu-wrapper {
  position: relative;
}

.lunch-menu button {
  padding: 5px 10px;
  background-color: #042444;
  color: #042444;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.lunch-menu button:hover {
  background-color: #ffffff;
  color: #042444;
}

.lunch-menu p {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 5px;
  margin-top: 5px;
  background-color: #042444;
  color: #042444;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.lunch-menu-wrapper:hover p {
  opacity: 1;
  color: #ffffff;
}

</style>

