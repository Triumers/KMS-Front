<template>
<router-link :to="`/workspace/${route.params.id}/wiki`">WIKI</router-link>
<router-link :to="`/workspace/${route.params.id}/docs`">DOCS</router-link>
<RouterView/>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from "vue-router";

const route = useRoute();

</script>

<style>


</style>