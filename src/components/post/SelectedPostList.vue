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
        <!-- originId가 존재하면 parameter -> originId -->
        <div class="post" v-for="post in postList" :key="post.id" @click="postDetail(post.id)">
            <div>
                <div class="title">
                    <p>{{ post.title }}</p>
                </div>
                <p class="date">{{ post.createdAt }}</p>
            </div>
            <div class="hashtag">
                <p>
                    <span v-for="tag in post.tags" :key="tag. id">
                        #{{ tag.name }}
                    </span>&nbsp;
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const tabId = useRoute().params.id;

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

const postDetail = (postId) => {
    console.log(postId);
};

</script>

<style></style>