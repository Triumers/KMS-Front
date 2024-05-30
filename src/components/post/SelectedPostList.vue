<template>
    <div id="top">
        <h3 id="tab-name">{{ tabName }}</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNew()">글쓰기 버튼</b-button>
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
const currentRoute = useRoute();

const tabId = 1; // useRoute().params.id;
const tabName = ref(null);

const postList = ref(null);
const search = ref({
    tabRelationId : 1,
    categoryId : null,
    type : 'title',
    word : '',
    title: null,
    keyword: null,
    tags: null
});

onMounted(() => {
    getTabName();
   getPostList();
});

const postDetail = (postId) => {

const firstSegment = currentRoute.path.split('/')[1];

    router.push({
        path: `/${firstSegment}/detail/${postId}`
    })
};

const createNew = () => {
    const currentPath = router.currentRoute.value.path;
    const newPath = `${currentPath}/new`; 
    router.push(newPath); 
};

async function searchPost(){
    
    switch(search.value.type){
        case 'title':
            search.value.title = search.value.word;
            break;
        case 'keyword':
            search.value.keyword = search.value.word;
            break;
    }

    if(search.value.type != "tag" || search.value.tags.length <= 0)
        tags = null;
    
    await getPostList();
}

async function getTabName() {
    const response = await axios.get(`http://localhost:5000/tab/name/${tabId}`);
    tabName.value = response.data;

    // try {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         axios.defaults.headers.common['Authorization'] = token;
    // const response = await axios.get(`http://localhost:5000/tab/name/${tabId}`);
    //         tabName.value = response.data;
    //     } else {
    //         alert("잘못된 접근입니다.");
    //     }
    // } catch (error) {
    //     alert("탭 이름을 불러올 수 없습니다.");
    // } finally {
    // }
}

const pageable = {
    page: 0,
    size: 10
};

async function getPostList() {
    try {
        const response = await axios.post('http://localhost:5000/post/tab', {
            tabRelationId: search.value.tabRelationId,
            categoryId: search.value.categoryId,
            title: search.value.title,
            keyword: search.value.keyword,
            tags: search.value.tags
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
//             const response = await axios.post('http://localhost:5000/post/tab', {
//                 tabRelationId: search.value.tabRelationId,
//                 categoryId: search.value.categoryId,
//                 title: search.value.title,
//                 keyword: search.value.keyword,
//                 tags: search.value.tags
//             });
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
    // const dateSplit = date.split("T");
    // dateSplit[1] = dateSplit[1].split(".")[0];

    // return dateSplit[0] + " " + dateSplit[1];
    return date;
};




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