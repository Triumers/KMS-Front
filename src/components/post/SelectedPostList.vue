<template>

    <div id="top">
        <h3 id="tab-name">{{ tabName }}</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNewPost()">글쓰기 버튼</b-button>
        </p>
    </div>

    <hr>

    <b-input-group class="search">
        <template #prepend>
            <b-form-select v-model="search.type" id="condition">
                <b-form-select-option value="title">제목</b-form-select-option>
                <b-form-select-option value="keyword">내용</b-form-select-option>
                <b-form-select-option value="tag">태그</b-form-select-option>
            </b-form-select>
        </template>

        <template v-if="search.type == 'tag'">
            <b-form-tags input-id="tags-separators" v-model="search.tags" separator=" ,;"
                placeholder="Enter new tags separated by space" @tag-state="onTagState" no-add-on-enter></b-form-tags>
        </template>
        <b-form-input v-else type="text" id="input-search" v-model="search.word"></b-form-input>
        <b-button variant="light" id="search-post" @click="searchPost">검색</b-button>
    </b-input-group>

    <div class="postList-div">
        <div class="row row-cols-1 row-cols-1 row-cols-md-2">
            <div class="col" v-for="post in postList" :key="post.id"
                @click="postDetail(post.originId ? post.originId : post.id)">
                <div class="card">
                    <div class="card-body">
                        <div id="top-info">
                            <b-avatar variant="info" size="4rem" id="profile-img"
                                :src="post.author.profileImg ? post.author.profileImg : 'https://placekitten.com/300/300'"></b-avatar>
                            <div id="author-date">
                                <h5 class="author"> {{ post.author.name }} </h5>
                                <p class="date"><small class="text-muted"> {{ convertToDate(post.createdAt) }}</small>
                                </p>
                            </div>
                        </div>
                        <h5 class="card-title">{{post.title}}</h5>
                        <div class="content-preview">{{ post.content }}</div>
                        <b-card-img src="https://picsum.photos/1000/400/?image=85" rounded alt="Image" bottom></b-card-img>
                        <div class="d-flex justify-content-between align-items-center">
                                <p class="like">
                                    <span class="material-icons">favorite</span>
                                    {{ post.likeCnt }}
                                </p>
                                <p class="tags">
                                    <span class="tag" v-for="tag in post.tags" :key="tag.id">
                                        <b-badge>#{{ tag }}</b-badge>
                                    </span>&nbsp;
                                </p>
                        </div>
                    </div>
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

const tabId = useRoute().params.id;
const tabName = "모집";

const search = ref({
    tabRelationId : tabId,
    type : 'title',
    word : '',
    title: null,
    keyword: null,
    tags: []
});

const postDetail = (postId) => {
    router.push({
        path: `/tab/detail/${postId}`,
        query: {
            general: isGeneral()
        }
    })
};

const createNewPost = () => {
    let createPath = `/tab/${tabId}`;

    if(isGeneral()){
        createPath += "/general"
    }

    router.push({
        path: createPath + "/new"
    });
};

const isGeneral = () => {
    const generalList = ["모집"];

    return generalList.includes(tabName);
}

async function searchPost(){
    
    switch(type){
        case 'title':
            search.value.title = search.value.word;
            break;
        case 'keyword':
            search.value.keyword = search.value.word;
            break;
    }

    if(type != "tag" || search.value.tags.length <= 0)
        tags = null;
    
    await getPostList();
}

async function getTabName() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/tab/${tabId}`);
            tab.name.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("탭 이름을 불러올 수 없습니다.");
    } finally {
    }
}

async function getPostList() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post('http://localhost:5000/post/tab', { tabRelationId: tabId.value });
            postList.value = response.data;
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

const postList = ref([
    {
        "id": 1,
        "title": "자바의 기본 문법",
        "content": "자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다. 자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다. 자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다.",
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
        "likeCnt": 3
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
        "history": null,
        "likeCnt": 3
    }
]);


</script>

<style>
.content-preview {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 두 줄을 표시하고 넘어가면 말줄임표 표시 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 50px;
}

#profile-img{
    float: left;
}

.tag{
    margin-left: 5px; 
}

#top{
    display: flex;
    justify-content: space-between;
}

</style>