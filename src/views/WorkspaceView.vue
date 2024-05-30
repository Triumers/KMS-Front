<template>
<router-link to="/workspace/wiki">WIKI</router-link>
<router-link to="/workspace/docs">DOCS</router-link>
<RouterView/>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView } from "vue-router";

</script>

<style scoped>


</style>