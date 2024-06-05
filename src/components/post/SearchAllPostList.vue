<template>
    <div id="top">
        <h3 id="tab-name">검색 결과</h3>
    </div>

    <hr>

    <div v-if="postList" class="postList-div">
        <div class="row row-cols-1 row-cols-1 row-cols-md-2">
            <div class="col" v-for="post in postList" :key="post.id"
                @click="postDetail(post.originId ? post.originId : post.id)">
                <div class="card">
                    <div class="card-body">
                        <div id="top-info">
                            <b-avatar variant="info" size="4rem" id="profile-img"
                                :src="post.author.profileImg ? post.author.profileImg : '/src/assets/images/profile_image.png'"></b-avatar>
                            <div id="author-date">
                                <h5 class="author"> {{ post.author.name }} </h5>
                                <p class="date"><small class="text-muted"> {{ convertToDate(post.createdAt) }}</small>
                                </p>
                            </div>
                        </div>
                        <h5 class="card-title"><strong>{{ post.title }}</strong></h5>
                        <div class="content-preview">{{ post.content }}</div>
                        <b-card-img :src="post.postImg ? post.postImg : '/src/assets/images/logo_header.png'" style="width: 100%; height: 200px;" rounded alt="Image" bottom></b-card-img>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="like">
                                <span class="material-icons">favorite</span>
                                {{ post.likeList.length }}
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
    <div v-else-if="!isLoading && (!postList || postList.length <= 0)" id="no-content">
        <p>검색 결과가 없습니다.</p>
    </div>

    <!-- spinner -->
    <div class="text-center" v-if="isLoading" style="margin: 10px;">
        <span class="spinner-grow spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </span>
        &nbsp;
        <span class="spinner-grow spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </span>
        &nbsp;
        <span class="spinner-grow spinner-grow-sm" role="status">
            <span class="visually-hidden">Loading...</span>
        </span>
    </div>

</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const isLoading = ref(false);
const postList = ref([]);
const search = ref({
    type: currentRoute.query.type,
    keyword: currentRoute.query.keyword,
    title: null,
    content: null,
    tags: [],
    page: 0,
    size: 10
});

onMounted(async () => {
    await searchPost();
    window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
});

async function handleScroll() {
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 1) {
        search.value.page += 1;
        await getPostList();
    }
}

watch(() => currentRoute.query, async () => {
  search.value.type = currentRoute.query.type;
  search.value.keyword = currentRoute.query.keyword;
  await searchPost();
});

const postDetail = (postId) => {
    router.push({
        path: `${currentRoute.path}/detail/${postId}`
    });
};

async function searchPost() {

    search.value.title = null;
    search.value.content = null;

    switch (search.value.type) {
        case 'title':
            search.value.title = search.value.keyword;
            break;
        case 'content':
            search.value.content = search.value.keyword;
            break;
    }

    if (search.value.type == "tag")
        search.value.tags = currentRoute.query.tags.length > 0 ? currentRoute.query.tags.split(',') : [];

    search.value.page = 0; 
    postList.value = [];

    await getPostList();
}

async function getPostList() {
    if (isLoading.value) return;
        isLoading.value = true;
try {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.post('http://localhost:5000/post/tab/all', {
            categoryId: null,
            title: search.value.title,
            content: search.value.content,
            tags: search.value.tags,
            page: search.value.page,
                size: search.value.size
            });
            const newPosts = response.data.content;
            postList.value = [...postList.value, ...newPosts];
    } else {
        alert("잘못된 접근입니다.");
    }
} catch (error) {
    console.log("게시글을 불러올 수 없습니다.");
} finally{
    isLoading.value = false;
    if(!postList.value || postList.value.length <= 0){
        postList.value = null;
    }
}
}

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