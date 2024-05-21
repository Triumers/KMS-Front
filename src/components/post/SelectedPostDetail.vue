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
                    참여자
                </div>

                <div class="collapse" id="authorList">
                    <p class="author" v-for="author in authors" :key="author.id">
                        {{ author }}
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

const modifyPost = (postId) => {
    router.push({
        path: `/tab/${post.value.tabRelationId}/new`,
        query: {
            post : postId
        }
    })
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
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally {
    }
}

const authors = ref(["author1", "author2", "author3", "author4", "author5"]);
const post = ref(
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
)

</script>

<style></style>