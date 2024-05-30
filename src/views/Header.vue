<template>
    <div class="header-left">
      <div class="logo">
        <img src="@/assets/images/logo_header.png" alt="Logo" @click="navigateTo('')" />
      </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  /* background-color: #F4F3F6; */
  color: #000;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: bold;
}

.logo > img {
  width: 200px;
}
</style>

