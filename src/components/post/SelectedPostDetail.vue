<template>
  <div v-if="post" id="container">
    <div id="top">

      <div id="title-info">
        <h1 id="title"><strong>{{ post.title }}</strong></h1>

        <p id="like-container">
          <span class="material-icons" id="favorite-icon" @click="favoritePost(post.originId ? post.originId : post.id)"
            :style="{ color: post.isFavorite ? '#042444' : '#EFEFEF' }">bookmark</span>
          &nbsp;&nbsp;<span class="material-icons" id="like-icon"
            @click="likePost(post.originId ? post.originId : post.id)"
            :style="{ color: post.isLike ? '#042444' : '#EFEFEF' }">favorite</span>
        <div class="like" data-bs-toggle="dropdown" aria-expanded="false">
          <span><strong>&nbsp;{{ post.likeList.length }}</strong></span>
        </div>
        <ul class="dropdown-menu">
          <li v-for="like in post.likeList">
            <b-avatar variant="info" :src="like.profileImg ? like.profileImg : 'https://placekitten.com/300/300'">
            </b-avatar>
            &nbsp;{{ like.name }}&nbsp;
          </li>
        </ul>
        </p>
      </div>

      <div id="etc">
        <div class="translate">
          <select id="condition">
            <option value="en">영어</option>
            <option value="jp">일본어</option>
            <option value="ch">중국어</option>
          </select>
        </div>
        <b-dropdown size="lg" variant="link" toggle-class="text-decoration-none" no-caret>
          <template #button-content>
            <span class="material-icons" style="color: black;">more_horiz</span>
          </template>
          <b-dropdown-item id="export" @click="generatePDF">PDF 내보내기</b-dropdown-item>
          <b-dropdown-item v-if="!general" id="modify-btn"
            @click="modifyPost(post.originId ? post.originId : post.id)">수정</b-dropdown-item>
          <b-dropdown-item v-else-if="general && isAuthorized" id="modify-btn"
            @click="modifyPost(post.originId ? post.originId : post.id)">수정</b-dropdown-item>
          <b-dropdown-item v-if="isAuthorized" id="delete-btn"
            @click="deletePost(post.originId ? post.originId : post.id)">삭제</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
    <hr>
    <div id="post-container">
      <div id="content" v-html="post.content"></div>
      <div id="post-info">
        <div>
          <p><strong>최종 수정일</strong></p>
          <p id="date">
            <span>{{ convertToDate(post.createdAt) }} &nbsp;</span>
            <template v-if="!general">
              <span class="material-icons" data-bs-target="#historyModal" data-bs-toggle="modal">
                history
              </span>
            </template>
          </p>
        </div>
        <hr>
        <div id="tag-div" v-if="post.tags.length > 0">
          <p><strong>태그</strong></p>
          <div class="hashtag">
            <p>
              <span class="tag" v-for="tag in post.tags" :key="tag.id">
                <b-badge class="custom-badge" variant="custom-badge">#{{ tag }}</b-badge>
              </span>&nbsp;
            </p>
          </div>
          <hr>
        </div>

        <div>
          <div class="authors" data-bs-toggle="collapse" :data-bs-target="`#authorList`" :aria-controls="`#authorList`">
            <p id="author-drop"><strong>참여자</strong><span class="material-icons">arrow_drop_down</span></p>
          </div>
          <div class="show" id="authorList">
            <p class="author" v-for="participant in post.participants" :key="participant.id">
              <b-avatar variant="info"
                :src="participant.profileImg ? participant.profileImg : 'https://placekitten.com/300/300'"></b-avatar>
              &nbsp;{{ participant.name }}&nbsp;
            </p>
          </div>
        </div>
      </div>
    </div>

    <span class="material-icons" id="top-btn" @click=scrollToTop()>assistant_navigation</span>

    <!-- 퀴즈 모달창 -->
    <div v-if="isQuizAvailable" id="quiz-container">
      <TakeQuiz :quizId="selectedQuizId" />
    </div>

    <!-- 히스토리 모달창 -->
    <div class="modal fade" id="historyModal" aria-hidden="true" aria-labelledby="modalToggleLabel" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="" id="modalToggleLabel"><strong>변경 히스토리 확인</strong></h2>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <template v-if="historyPost">
              <div class="history" id="historyContent">
                <h4 id="title"> {{ historyPost.title }} </h4>
                <div id="date-restore">
                  <small> {{ convertToDate(historyPost.createdAt) }}</small>
                  &nbsp;<b-button size="sm" variant="outline-secondary" @click="restorePost()">버전 복원하기</b-button>
                </div>
                <div id="tag-div">
                  <div class="hashtag">
                    <p>
                      <span class="tag" v-for="tag in historyPost.tags" :key="tag.id">
                        <b-badge class="custom-badge" variant="custom-badge">#{{ tag }}</b-badge>
                      </span>&nbsp;
                    </p>
                  </div>
                </div>
                <hr>
                <div id="content" v-html="historyPost.content"></div>
              </div>
              <div class="history" id="historyList">
                <h3>버전 기록</h3>
                <hr>
                <b-list-group>
                  <template v-for="history in post.history" :key="history.id">
                    <b-list-group-item button @click="setHistoryContent(history)">
                      <div>
                        <p>
                        <h5>
                          <b-avatar variant="info"
                            :src="history.author.profileImg ? history.author.profileImg : '@/assets/images/profile_image.png'"></b-avatar>
                          <span> &nbsp;{{ history.author.name }}&nbsp; </span>
                        </h5>
                        </p>
                        <small>{{ convertToDate(history.createdAt) }}</small>
                      </div>
                    </b-list-group-item>
                  </template>
                </b-list-group>
              </div>
            </template>
            <template v-else>
              <div>
                <p>게시글 히스토리가 존재하지 않습니다.</p>
              </div>
            </template>
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
import html2pdf from 'html2pdf.js';

import TakeQuiz from '@/components/quiz/TakeQuiz.vue';

const router = useRouter();
const currentRoute = useRoute();
const postId = currentRoute.params.id;
const general = ref(currentRoute.path.includes("organization") ? true : false);

const isAuthorized = ref(false);
const historyPost = ref(null);
const selectedQuizId = ref(null);
const isQuizAvailable = ref(false);

const post = ref(null);

onMounted(async () => {
  await getPostById();
  await checkQuizVisibility();
});

const modifyPost = (postId) => {

  const segments = currentRoute.path.split('/');
  let detailPath = `${segments[1]}`;

  if (segments.length > 3 && segments[2] === "organization") {
    detailPath = `${segments[1]}/${segments[2]}`;
  }

  router.push({
    path: `/${detailPath}/${post.value.tabRelationId}/new`,
    query: {
      post: postId
    }
  });
};

async function likePost(id) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`http://localhost:5000/post/like`, { postId: id });

      post.value.isLike = !post.value.isLike
      
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    console.log("오류가 발생했습니다.");
  } finally {
  }
}

async function favoritePost(id) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`http://localhost:5000/post/favorite`, { postId: id });

      post.value.isFavorite = !post.value.isFavorite
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    console.log("오류가 발생했습니다.");
  } finally {
  }
}

async function restorePost() {
  if (confirm("선택한 버전으로 복원하시겠습니까?")) {
    await saveModifyPost(historyPost.value);
    location.reload(true);
  }
}

const setHistoryContent = (selectPost) => {
  historyPost.value = selectPost;
};


async function deletePost(postId) {

  if (confirm("게시글을 삭제하시겠습니까?")) {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        const response = await axios.delete(`http://localhost:5000/post/delete/${postId}`);

        const segments = currentRoute.path.split('/');
        let detailPath = `${segments[1]}`;

        if (segments[1] != 'wiki') {
          detailPath = `${segments[1]}/${segments[2]}`;
        }

        router.push(`/${detailPath}/${post.value.tabRelationId}`);
      } else {
        alert("잘못된 접근입니다.");
      }
    } catch (error) {
      alert("게시글을 삭제할 수 없습니다.");
    } finally {
    }
  }

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
      const response = await axios.get(`http://localhost:5000/post/find/${postId}`);
      post.value = response.data;

      const res = await axios.get(`http://localhost:5000/post/isAuthor/${postId}`);
      isAuthorized.value = (res.data == true ? true : false);

      if (post.value.history && post.value.history.length > 0)
        await setHistoryContent(post.value.history[0]);

    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
  } finally {
  }
}

async function saveModifyPost(post) {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/post/modify`, {
                title: post.title,
                postImg: post.postImg,
                content: post.content,
                tags: post.tags,
                tabRelationId: post.tabRelationId,
                originId: (post.originId ? post.originId : post.id)
            });
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        console.log("게시글 저장에 실패했습니다.");
    }
}

const generatePDF = () => {

  html2pdf().from(createPdfHtml()).set({ filename: `${post.value.title.trim()}.pdf` }).save();

  function createPdfHtml() {
    const pdfContent = `
    <div style="padding:20px">
    <h1><strong>${post.value.title}</strong></h1>
    <p>최종 수정일: ${convertToDate(post.value.createdAt)}</p>
    <div>
      <p>
        ${post.value.tags.map(tag => `<b-badge class="custom-badge">#${tag}</b-badge>`).join('&nbsp;')}
      </p>
    </div>
    <hr>
    <div>${post.value.content}</div>
    </div>
  `;
    return pdfContent;
  }
};

// Quiz Modal Visibility
const checkQuizVisibility = async () => {
  try {
    const response = await axios.get(`/quiz/exist?postId=${postId}`);
    if (response.status == 200) {
      isQuizAvailable.value = true;
      selectedQuizId.value = response.data.id;
    } else {
      isQuizAvailable.value = false;
    }
  } catch (error) {
    console.error('Failed to fetch quiz visibility:', error);
    isQuizAvailable.value = false;
  }
};

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
</script>

<style>
#post-container,
#top,
.modal-body {
  display: flex;
  justify-content: space-between;
}

#post-info {
  max-width: 300px;
  padding-right: 20px;
}

#historyList {
  min-width: 500px;
}

#etc {
  display: flex;
}

.tag {
  margin-left: 5px;
}

.history {
  overflow-y: auto;
}

#container {
  width: 90%;
  margin: 0 auto;
  padding-top: 20px;
}

#top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#title {
  margin: 0;
  font-size: 2em;
}

#etc {
  display: flex;
  align-items: center;
}

#condition {
  margin-right: 20px;
}

#post-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

#content {
  width: 100%;
}

#post-info {
  width: 25%;
  padding-left: 10px;
}

#tag-div {
  margin-top: 10px;
}

#date-restore {
  margin-top: 20px;
}

.authors {
  cursor: pointer;
}

.author {
  display: flex;
  align-items: center;
}

.material-icons {
  cursor: pointer;
}

.material-icons:hover {
  color: grey;
}

#quiz-container {
  margin-top: 20px;
}

li {
  margin: 5px;
}

#like-container {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.material-icons:hover {
  color: #042444;
}

#date,
#author-drop {
  display: flex;
  align-items: center;
}

.custom-badge {
  background-color: #042444;
  color: white;
}

.history {
  padding: 10px;
}

#top-btn {
  font-size: 50px;
  position: fixed;
  bottom: 20px;
  right: 20px;
  color: #042444;
}

#historyContent{
  width: 100%;
}
</style>
