<script setup>
import { RouterView } from 'vue-router';
import Header from '@/views/Header.vue';
</script>

<template>
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <header>
        <Header></Header>
  </header>

  <main>
    <RouterView />
  </main>


</template>

<style>

</style>
