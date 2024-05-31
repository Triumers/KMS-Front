<template>
    <div id="top">
        <h3 id="tab-name">{{ tabName }}</h3>
        <p id="write-btn">
            <b-button variant="light" @click="createNew()">글쓰기 버튼</b-button>
        </p>
    </div>

    <hr>

    <p class="input-group mb-3 search">
        <span class="search-type">
            <select v-model="search.type" class="form-select pt-1 search-type"
                style="width:fit-content; vertical-align: middle; margin-right: 10px;">
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="tag">태그</option>
            </select>
        </span>

        <b-form-tags v-if="search.type == 'tag'" class="form-select pt-1" input-id="tags-separators"
            v-model="search.tags" separator=" " placeholder="태그 입력 후, 스페이스 바를 눌러주세요." no-add-on-enter></b-form-tags>

        <b-form-input v-else type="text" id="search-input" placeholder="검색어를 입력하세요" v-model="search.keyword"></b-form-input>

        <button class="search-button" id="search-post" @click="searchPost" >
            <img src="@/assets/icons/search_icon.png" alt="Search" />
        </button>
        
    </p>

    <div class="postList-div">
        <div class="row row-cols-1 row-cols-1 row-cols-md-2">
            <div class="col" v-for="post in postList" :key="post.id"
                @click="postDetail(post.originId ? post.originId : post.id)">
                <div class="card">
                    <div class="card-body">
                        <div id="top-info">
                            <b-avatar variant="info" size="4rem" id="profile-img"
                                :src="post.author.profileImg ? post.author.profileImg : '@/assets/images/profile_image.png'"></b-avatar>
                            <div id="author-date">
                                <h5 class="author"> {{ post.author.name }} </h5>
                                <p class="date"><small class="text-muted"> {{ convertToDate(post.createdAt) }}</small>
                                </p>
                            </div>
                        </div>
                        <h5 class="card-title"><strong>{{ post.title }}</strong></h5>
                        <div class="content-preview">{{ post.content }}</div>
                        <b-card-img :src="post.postImg" rounded alt="Image" bottom></b-card-img>
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
    tabRelationId: 1,
    categoryId: null,
    type: 'title',
    keyword: '',
    title: null,
    content: null,
    tags: []
});

onMounted(() => {
    getTabName();
    getPostList();
});

const postDetail = (postId) => {

    const segments = currentRoute.path.split('/');

    let detailPath = `${segments[1]}/${segments[2]}`;

    if (segments.length > 3 && segments[2] === "organization") {
        detailPath = `${detailPath}/${segments[3]}`;
    }

    router.push({
        path: `/${detailPath}/detail/${postId}`
    });
};

const createNew = () => {
    const currentPath = router.currentRoute.value.path;
    const newPath = `${currentPath}/new`;
    router.push(newPath);
};

async function searchPost() {

    search.value.title = null;
    search.value.content = null;

    switch (search.value.type) {
        case 'title':
            search.value.title = search.value.keyword;
            break;
        case 'keyword':
            search.value.content = search.value.keyword;
            break;
    }

    if (search.value.type != "tag")
        tags = [];

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
            content: search.value.content,
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
//                 content: search.value.content,
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