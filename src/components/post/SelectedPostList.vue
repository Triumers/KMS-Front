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

    <div v-if="postList" class="postList-div">
        <div class="row row-cols-1 row-cols-1 row-cols-md-2">
            <div class="col" v-for="post in postList" :key="post.id"
                @click="postDetail(post.originId ? post.originId : post.id)">
                <div class="card">
                    <div class="card-body">
                        <div id="top-info">
                            <div>
                            <b-avatar variant="info" size="4rem" id="profile-img"
                                :src="post.author.profileImg ? post.author.profileImg : '@/assets/images/profile_image.png'"></b-avatar>
                            </div>
                                <div id="author-date">
                                <h5 class="author"> {{ post.author.name }} </h5>
                                <p class="date"><small class="text-muted"> {{ convertToDate(post.createdAt) }}</small>
                                </p>
                            </div>
                        </div>
                        <div class="preview-main">
                        <h5 class="card-title"><strong>{{ post.title }}</strong></h5>
                        <div class="content-preview">{{ stripHtmlTags(post.content) }}</div>
                        <b-card-img :src="post.postImg ? post.postImg : '@/assets/images/logo_header.png'" style="width: 200px; height: 100px;" rounded alt="Image" bottom></b-card-img>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <p class="like">
                                <span class="material-icons"  @click="likePost(post.originId ? post.originId : post.id)" :style="{ color: post.isLike ? '#042444' : '#EFEFEF' }">favorite</span>
                                &nbsp;<span>{{ post.likeList.length }} </span>
                            </p>
                            <p class="tags">
                                <span class="tag" v-for="tag in post.tags" :key="tag.id">
                                    <b-badge class="custom-badge" variant="custom-badge">#{{ tag }}</b-badge>
                                </span>&nbsp;
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else id="no-content">
        <p>게시글이 존재하지 않습니다.</p>
    </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const tabName = ref(null);

const postList = ref(null);
const search = ref({
    tabRelationId: tabId,
    categoryId: null,
    type: 'title',
    keyword: '',
    title: null,
    content: null,
    tags: []
});

onMounted(async() => {
        await getTabName(tabId);
        await getPostList();
    }
);

const postDetail = (postId) => {

    const segments = currentRoute.path.split('/');

    let detailPath = `${segments[1]}`;

    if (segments.length > 3 && segments[1] === "group") {
        detailPath = `${detailPath}/${segments[2]}`;
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

const stripHtmlTags = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
};

const pageable = {
    page: 0,
    size: 10
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
        search.value.tags = [];

    await getPostList();
}

async function getTabName(id) {

    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
    const response = await axios.get(`http://localhost:5000/tab/name/${id}`);
            tabName.value = response.data;
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
            const response = await axios.post('http://localhost:5000/post/tab', {
                tabRelationId: tabId,
                categoryId: search.value.categoryId,
                title: search.value.title,
                content: search.value.content,
                tags: search.value.tags
            });
            postList.value = response.data.content;
            console.log(postList.value);
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally{
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

#no-content {
    display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

#no-content>p {
    margin-top: 100px;
}

.like{
    display: flex;
      align-items: center;
}

#author-date{
    margin-left: 10px;
}

#top-info{
    display: flex;
  justify-content: left;
  align-items: center;
}

.preview-main, .d-flex{
    margin-top: 10px;
}

.custom-badge {
  background-color: #042444;
  color: white;
}


</style>