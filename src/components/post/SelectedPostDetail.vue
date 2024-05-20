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
            <div id="modify-btn">수정</div>
        </div>
    </div>
    <div id="post-container">
        <div id="content" v-html="post.content"></div>
        <div id="post-info">
            <div>
                <p>최종 수정일</p>
                <p> {{ post.createdAt }}</p>
            </div>
            <div>
                <p>태그</p>
                <div class="hashtag">
                    <p>
                        <span v-for="tag in post.tags" :key="tag.id">
                            #{{ tag.name }}
                        </span>&nbsp;
                    </p>
                </div>
            </div>
            <div>
                <p>참여자</p>
                <p class="authors" v-for="author in authors" :key="author.id">
                    {{ author }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const postId = useRoute().params.id;
console.log(postId);

const authors = ref(["author1", "author2", "author3", "author4", "author5"]);
const post = ref(
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
    }
)

</script>

<style>

</style>