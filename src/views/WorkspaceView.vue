<template>
<div id="workspace-tab">    
<router-link class="w-tab" active-class="active" :to="`/workspace/${route.params.id}/wiki`">WIKI</router-link>
&nbsp;
<router-link class="w-tab" active-class="active" :to="`/workspace/${route.params.id}/docs`">DOCS</router-link>
</div>
<RouterView/>
</template>

<script setup>
import { ref } from 'vue';
import { RouterView, useRoute } from "vue-router";

const route = useRoute();

</script>

<style>
.w-tab{
    padding: 5px 10px;
    color: #042444;
    border: 1px solid #042444;
    text-decoration: none;
    border-radius: 30px;
}

#workspace-tab{
    margin-bottom: 10px;
}

.active{
    transition: all 0.3s;
    background-color: rgba(166, 175, 210, 0.496);
}

</style>