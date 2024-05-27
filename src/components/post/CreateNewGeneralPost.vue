<template>
    <form @submit.prevent="submitPost" @keydown.enter.prevent>
        <div>
            <p id="title"> 게시글 작성 </p>
            <div>
                <button id="save-btn" type="submit" @click="savePost">작성 완료</button>
            </div>
        </div>
        <div>
            <label for="title">제목:</label>
            <input type="text" id="title" v-model="postForm.title">
        </div>
        <div>
            <b-form-select v-model="postForm.tags[0]" :options="options"></b-form-select>
        </div>

        <div>
            <label for="content">내용(html 형식으로 작성):</label>
            <textarea id="content" v-model="postForm.content"></textarea>
        </div>
    </form>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const originId = currentRoute.query.post;

const postForm = ref({
    id: null,
    title: '',
    content: '',
    tags: [],
    tabRelationId: tabId,
    originId: originId
})

const options = ["스터디 모집", "단기 모임"];

async function savePost() {

    console.log(postForm.value);
    // await saveNewPost();
    router.push(`/tab/detail/${originId}`);

}

async function saveNewPost() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.get(`http://localhost:5000/post/regist`, { newPost: postForm.value });
            originId.value = response.data.id;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글 저장에 실패했습니다.");
    }
}


const setPost = () => {
    postForm.value = {
        title: post.value.title,
        content: post.value.content,
        tags: post.value.tags,
        tabRelationId: tabId,
        originId: originId
    };
}

onMounted(() => {
    postForm.value.tags = ["스터디 모집"];
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

const post = ref({
    "id": 2,
    "title": "자바의 기본 문법 수정\r\n",
    "content": "수정 내용",
    "createdAt": "2021-11-08T11:44:30.327959",
    "author": {
        "id": 2,
        "email": "test1",
        "name": "테스트1",
        "profileImg": "test1.jpg",
        "role": "ROLE_NORMAL",
        "startDate": null,
        "endDate": null,
        "phoneNumber": null,
        "teamId": 2,
        "positionId": 2,
        "rankId": 2
    },
    "originId": 1,
    "recentId": null,
    "tabRelationId": 1,
    "categoryId": null,
    "tags": [
        "개발", "tag1", "tag2", "tag6", "tag7", "tag8"
    ],
    "history": [
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
            "history": null,
            "participants": null
        },
        {
            "id": 2,
            "title": "자바의 기본 문법 수정\r\n",
            "content": "수정 내용",
            "createdAt": "2021-11-08T11:44:30.327959",
            "author": {
                "id": 2,
                "email": "test1",
                "name": "테스트1",
                "profileImg": "test1.jpg",
                "role": "ROLE_NORMAL",
                "startDate": null,
                "endDate": null,
                "phoneNumber": null,
                "teamId": 2,
                "positionId": 2,
                "rankId": 2
            },
            "originId": 1,
            "recentId": null,
            "tabRelationId": 1,
            "categoryId": null,
            "tags": [],
            "history": null,
            "participants": null
        }
    ],
    "participants": [
        {
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
        {
            "id": 2,
            "email": "test1",
            "name": "테스트1",
            "profileImg": "test1.jpg",
            "role": "ROLE_NORMAL",
            "startDate": null,
            "endDate": null,
            "phoneNumber": null,
            "teamId": 2,
            "positionId": 2,
            "rankId": 2
        }
    ]
});

</script>

<style></style>