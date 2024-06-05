<template>
  <div>
    <div id="top">
      <span class="search-type">
        <select v-model="selectedTab" class="form-select pt-1 search-type"
                style="width:fit-content; vertical-align: middle; margin-right: 10px;" @change="changeStudy">
          <option v-for="tab in studyTab" :value="tab.tabId">
            {{ tab.bottomTabName }}
          </option>
        </select>
      </span>
    </div>
    <div>
      <RouterView :key="$route.fullPath" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const categoryList = ref(null);
const studyTab = ref(null);
const selectedTab = ref(null);

const router = useRouter();

onMounted(async () => {
  await getUserCategory();
});

const changeStudy = () => {
  const path = `/group/study/${selectedTab.value}`;
  router.push(path);
};

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
  }
}

function setCategory() {
  studyTab.value = categoryList.value.filter(category => category.topTabName === "스터디").map(category => category);
  selectedTab.value = studyTab.value[0].tabId;
}
</script>

<style>
#top {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}
</style>
