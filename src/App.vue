<script setup>
import { RouterView } from 'vue-router';
import Header from '@/views/Header.vue';
</script>

<template>

  <header>
        <Header></Header>
  </header>

  <main>
    <RouterView />
  </main>


</template>

<style>

</style>
