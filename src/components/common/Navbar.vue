<template>
  <div class="navbar">
    <li class="nav-item">
      <router-link class="nav-link" to="/wiki">Wiki</router-link>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/workspace">Workspace</router-link>
    </li>
    <li class="nav-item dropdown">
      <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown"
        aria-expanded="false">
        Group
      </a>
      <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
        <li>
          <router-link class="dropdown-item" to="/group/study">Study</router-link>
        </li>
        <li>
          <router-link class="dropdown-item" to="/group/organization">Organization</router-link>
        </li>
      </ul>
    </li>
    <li class="nav-item">
      <router-link class="nav-link" to="/office-life">Office Life</router-link>
    </li>
  </div>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  display:list-item;
  flex-direction: column;
  width: 200px;
  /* 너비를 조정하여 원하는 크기로 설정하세요 */
  background-color: #f8f9fa;
  /* 배경색을 원하는 색으로 설정하세요 */
  padding: 10px;
  list-style-type: none; /* 기본 리스트 스타일 제거 */
  padding-left: 0; /* 패딩 제거 */
}

.nav-item {
  margin: 5px 0;
  padding: 10px;
  text-decoration: none;
  color: #333;
}

.nav-item:hover {
  background-color: #e2e6ea;
}

.dropdown-menu {
  list-style-type: none; /* 드롭다운 리스트 스타일 제거 */
  padding-left: 0; /* 패딩 제거 */
}

.dropdown-item {
  padding: 5px 10px;
  text-decoration: none;
  color: #333;
}

.dropdown-item:hover {
  background-color: #e2e6ea;
}
</style>
