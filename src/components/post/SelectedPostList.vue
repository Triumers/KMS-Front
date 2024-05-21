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
        <div class="post" v-for="post in postList" :key="post.id"
            @click="postDetail(post.originId ? post.originId : post.id)">
            <div>
                <div class="title">
                    <p>{{ post.title }}</p>
                </div>
                <p class="date">{{ post.createdAt.split("T")[0] }}</p>
            </div>
            <div class="tags">
                <p>
                    <span v-for="tag in post.tags" :key="tag.id">
                        #{{ tag }}
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
        "id": 1,
        "title": "자바의 기본 문법",
        "content": "자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다.",
        "createdAt": "2021-11-08T11:44:30.327959",
        "author": {
            "id": 1,
            "email": "admin",
            "name": "관리자",
            "profileImg": null,
            "role": "ROLE_ADMIN",
            "startDate": "2024-05-17",
            "endDate": null,
            "phoneNumber": null,
            "teamId": 1,
            "positionId": 1,
            "rankId": 1
        },
        "originId": null,
        "recentId": 2,
        "tabRelationId": 1,
        "categoryId": null,
        "tags": [
            "개발", "tag1", "tag2", "tag3", "tag4", "tag5"
        ],
        "history": null
    },
    {
        "id": 2,
        "title": "자바의 기본 문법 수정",
        "content": "자바 수정",
        "createdAt": "2021-11-08T11:44:30.327959",
        "author": {
            "id": 1,
            "email": "admin",
            "name": "관리자",
            "profileImg": null,
            "role": "ROLE_ADMIN",
            "startDate": "2024-05-17",
            "endDate": null,
            "phoneNumber": null,
            "teamId": 1,
            "positionId": 1,
            "rankId": 1
        },
        "originId": 1,
        "recentId": null,
        "tabRelationId": 1,
        "categoryId": null,
        "tags": [
            "개발", "tag1", "tag2", "tag8", "tag7", "tag6"
        ],
        "history": null
    }
]);


</script>

<style></style>