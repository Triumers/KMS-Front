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
  list-style-type: none;
  flex-direction: column;
  width: 200px;
  background-color: #f8f9fa;
  padding: 10px;
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
</style>
