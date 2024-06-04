<template>

    <div id="top">
        <h3 id="tab-name">Docs</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNew()">업로드</b-button>
        </p>
    </div>

    <hr>

    <p class="input-group mb-3 search">
        <span class="search-type">
            <select v-model="search.type" class="form-select pt-1 search-type"
                style="width:fit-content; vertical-align: middle; margin-right: 10px;">
                <option value="title">제목</option>
            </select>
        </span>

        <b-form-input type="text" id="search-input" placeholder="검색어를 입력하세요" v-model="search.keyword"></b-form-input>

        <button class="search-button" id="search-post" @click="searchPost">
            <img src="@/assets/icons/search_icon.png" alt="Search" />
        </button>
    </p>

    <div id="docsList">
        <table class="table table-borderless">
            <thead>
                <tr class="table-light">
                    <th scope="col">NAME</th>
                    <th scope="col">FILE</th>
                    <th scope="col">TYPE</th>
                    <th scope="col">UPLOADER</th>
                    <th scope="col">DATE ADDED</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in postList" :key="post.id">
                    <td><strong>{{ post.title }}</strong></td>
                    <td>
                        <a :href="post.content.split(' : ')[2]" style="color: black; text-decoration: none;">
                            <span class="material-icons">attach_file</span>
                            {{ post.content.split(' : ')[0] }}
                        </a>
                    </td>
                    <td>{{ post.content.split(' : ')[1] }}</td>
                    <td>{{ post.author.name }}</td>
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
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const postList = ref([]);
const search = ref({
    tabRelationId: tabId,
    categoryId: 1,
    type: "title",
    word: '',
    title: null
});

onMounted(() => {
    getPostList();
});

const createNew = () => {
    const currentPath = router.currentRoute.value.path;
    const newPath = `${currentPath}/new`;
    router.push(newPath);
};

async function searchPost() {
    search.value.title = search.value.word;
    await getPostList();
}

async function getPostList() {
    try {
        const response = await axios.post('http://localhost:5000/post/tab', {
            tabRelationId: search.value.tabRelationId,
            categoryId: search.value.categoryId,
            title: search.value.title
        });
        postList.value = response.data.content;
    } catch (error) {
        console.error("게시글을 불러올 수 없습니다.", error);
    }
}

// async function getPostList() {
//     try {
//         const token = localStorage.getItem('token');
//         if (token) {
//             axios.defaults.headers.common['Authorization'] = token;
// const response = await axios.post('http://localhost:5000/post/tab', {
//     tabRelationId: search.value.tabRelationId,
//     categoryId: search.value.categoryId,
//     title: search.value.title
// });
//             postList.value = response.data.content;
//         } else {
//             alert("잘못된 접근입니다.");
//         }
//     } catch (error) {
//         alert("게시글을 불러올 수 없습니다.");
//     } finally {
//     }
// }

const convertToDate = (date) => {
    const dateSplit = date.split("T");
    dateSplit[1] = dateSplit[1].split(".")[0];

    return dateSplit[0] + " " + dateSplit[1];
};

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

#top {
    display: flex;
    justify-content: space-between;
}
</style>