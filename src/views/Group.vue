<template>
    <div>
      <h1>Group Page</h1>
      <router-view></router-view> <!-- 하위 라우트를 표시 -->
    </div>
  </template>
  
  <script>
  import { RouterView } from "vue-router";
  export default {
    name: 'Group'
  }
  </script>  