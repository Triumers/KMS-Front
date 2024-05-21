<template>
    <div>
        <p id="tab-name"> 탭 이름 </p>
        <p id="write-btn">
        <div>글쓰기 버튼</div>
        </p>
    </div>

    <hr>

    <div class="search">
        <select id="condition">
            <option value="name">이름</option>
            <option value="address">태그</option>
        </select>
        <input type="text" id="input-search" />
        <button id="search-post">검색</button>
    </div>

    <div class="postList-div">
        <div class="post" v-for="post in postList" :key="post.id" @click="postDetail(post.originId ? post.originId : post.id)">
            <div>
                <div class="title">
                    <p>{{ post.title }}</p>
                </div>
                <p class="date">{{ post.createdAt.split("T")[0] }}</p>
            </div>
            <div class="tags">
                <p>
                    <span v-for="tag in post.tags" :key="tag.id">
                        #{{ tag.name }}
                    </span>&nbsp;
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const tabId = useRoute().params.id;

const postDetail = (postId) => {
    router.push(`/tab/detail/${postId}`);
};

async function getPostList() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post('http://localhost:5000/post/tab', { tabRelationId: tabId });
            postList.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally {
    }
}


const postList = ref([
    {
        "id" : 2,
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
    },
    {
        "id" : 1,
        "title": "modifyTitle",
        "content": "newContent",
        "createdAt": "2021-11-08T11:44:30.327959",
        "originId": null,
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
]);


</script>

<style></style>