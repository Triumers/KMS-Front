<template>

    <div id="top">
        <h3 id="tab-name">Docs</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNewDocs()">업로드</b-button>
        </p>
    </div>

    <hr>

    <b-input-group class="search">
        <template #prepend>
            <b-form-select v-model="search.type" id="condition">
                <b-form-select-option value="title">제목</b-form-select-option>
            </b-form-select>
        </template>
        <b-form-input type="text" id="input-search" v-model="search.word"></b-form-input>
        <b-button variant="light" id="search-post" @click="searchPost">검색</b-button>
    </b-input-group>

    <div id="docsList">
        <table class="table table-borderless">
            <thead>
                <tr class="table-light">
                    <th scope="col">NAME</th>
                    <th scope="col">FILE</th>
                    <th scope="col">TYPE</th>
                    <th scope="col">DATE ADDED</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in postList" :key="post.id">
                    <td><strong>{{ post.title }}</strong></td>
                    <td><a :href="post.content.split(' : ')[2]">{{ post.content.split(' : ')[0] }}</a></td>
                    <td>{{ post.content.split(' : ')[1] }}</td>
                    <td>{{ convertToDate(post.createdAt) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const tabId = useRoute().params.id;

const search = ref({
    tabRelationId: tabId,
    type: 'title',
    word: '',
    title: null,
    keyword: null,
    tags: []
});

const createNewDocs = () => {
    router.push({
        path: "new"
    });
};

async function searchPost() {

    search.value.title = search.value.word;
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
        "content": "파일이름 : 타입 : https://picsum.photos/1000/400/?image=85",
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
        "content": "파일이름 : 타입 : https://picsum.photos/1000/400/?image=85",
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
    -webkit-line-clamp: 2;
    /* 두 줄을 표시하고 넘어가면 말줄임표 표시 */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: 50px;
}

#profile-img {
    float: left;
}

.tag {
    margin-left: 5px;
}

#top{
    display: flex;
    justify-content: space-between;
}
</style>