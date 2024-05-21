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
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const originId = currentRoute.query.post;
const postForm = ref({
    title: '',
    content: '',
    tags: [],
    tabRelationId : tabId,
    originId : originId
})

async function savePost(){
    if (originId) {
        console.log("MODIFY");
        router.push(`/tab/detail/${originId}`);
    }
    console.log(postForm.value);
}

const setPost = () => {
    postForm.value = {
        title: post.value.title,
        content: post.value.content,
        tags: post.value.tags,
        tabRelationId : tabId,
        originId : originId
    };
}

onMounted(() => {
    if (originId) {
        setPost();
    }
});

async function getPostById() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/post/${originId}`);
            post.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally {
    }
}

const post = ref(
    {
        "id": 2,
        "title": "modifyTitle",
        "content": "newContent",
        "createdAt": "2021-11-08T11:44:30.327959",
        "originId": 1,
        "authorId": 1,
        "tabRelationId": 1,
        "tags": [
            {
                "id": 21,
                "name": "tag1"
            },
            {
                "id": 22,
                "name": "tag2"
            },
            {
                "id": 23,
                "name": "tag3"
            },
            {
                "id": 24,
                "name": "tag4"
            },
            {
                "id": 25,
                "name": "tag5"
            }
        ]
    }
)
</script>

<style></style>