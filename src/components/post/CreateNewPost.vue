<template>
    <form @submit.prevent="submitPost">
        <div>
            <p id="title"> 위키 작성 </p>
            <div>
                <button id="save-btn" type="submit" @click="savePost">게시글 작성</button>
            </div>
        </div>
        <div>
            <label for="title">제목:</label>
            <input type="text" id="title" v-model="postForm.title">
        </div>
        <div>
            <label for="hashtags">해시태그 (쉼표로 구분):</label>
            <input type="text" id="hashtags" v-model="postForm.tags">
        </div>
        <div>
            <label for="content">내용(html 형식으로 작성):</label>
            <textarea id="content" v-model="postForm.content"></textarea>
        </div>
    </form>
    <div id="ai-chat">
        <p>AI chat</p>
        <div>검증/검색/맞춤법 등등</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const tabId = useRoute().params.id;
console.log(tabId);

const savePost = () => {
    console.log(postForm.value);
}

const postForm = ref({
    title: '',
    content: '',
    tags: []
})
</script>

<style></style>