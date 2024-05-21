<template>
    <div>
        <p id="title"> {{ post.title }} </p>
        <div>
            <div class="translate">
                <select id="condition">
                    <option disabled value="">번역</option>
                    <option value="en">영어</option>
                    <option value="jp">일본어</option>
                    <option value="ch">중국어</option>
                </select>
            </div>
            <div id="export">내보내기</div>
            <div id="modify-btn" @click="modifyPost(post.originId ? post.originId : post.id)">수정</div>
            <div v-if="isAuthorized" id="delete-btn" @click="deletePost(post.originId ? post.originId : post.id)">삭제
            </div>
        </div>
    </div>
    <div id="post-container">
        <div id="content" v-html="post.content"></div>
        <div id="post-info">
            <div>
                <p>최종 수정일</p>
                <p> {{ convertToDate(post.createdAt) }}</p>
            </div>
            <div>
                <p>태그</p>
                <div class="hashtag">
                    <p>
                        <span v-for="tag in post.tags" :key="tag.id">
                            #{{ tag }}
                        </span>&nbsp;
                    </p>
                </div>
            </div>
            <div>
                <div class="authors" data-bs-toggle="collapse" :data-bs-target="`#authorList`"
                    :aria-controls="`#authorList`">
                    <p>참여자</p>
                </div>

                <div class="collapse" id="authorList">
                    <p class="author" v-for="participant in post.participants" :key="participant.id">
                        <b-avatar variant="info"
                            :src="participant.profileImg ? participant.profileImg : 'https://placekitten.com/300/300'"></b-avatar>
                        {{ participant.name }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const postId = useRoute().params.id;
const isAuthorized = true;

const modifyPost = (postId) => {
    router.push({
        path: `/tab/${post.value.tabRelationId}/new`,
        query: {
            post: postId
        }
    })
}

async function deletePost(postId) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            // const response = await axios.post(`http://localhost:5000/post/delete/${postId}`);

            router.push(`/tab/${post.value.tabRelationId}`);
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally {
    }
}

const convertToDate = (date) => {
    const dateSplit = date.split("T");
    dateSplit[1] = dateSplit[1].split(".")[0];

    return dateSplit[0] + " " + dateSplit[1];
};

async function getPostById() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/post/${postId}`);
            post.value = response.data;

            isAuthorized.value = (await axios.post(`http://localhost:5000/post/isAuthor/${postId}`)).data;
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