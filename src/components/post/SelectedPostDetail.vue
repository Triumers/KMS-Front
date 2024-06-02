<template>
  <div id="container">
    <div id="top">

      <div id="title-info">
        <h1 id="title"> {{ post.title }} </h1>

        <p class="like" data-bs-toggle="dropdown" aria-expanded="false">
          <span class="material-icons">favorite</span>
          {{ post.likeList.length }}
        </p>

        <ul class="dropdown-menu">
          <li v-for="like in post.likeList">
            <b-avatar variant="info" :src="like.profileImg ? like.profileImg : 'https://placekitten.com/300/300'">
            </b-avatar>
            &nbsp;{{ like.name }}&nbsp;
          </li>
        </ul>
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
          <p>
            <span>{{ convertToDate(post.createdAt) }} &nbsp;</span>
            <template v-if="!general">
              <span class="material-icons" data-bs-target="#historyModal" data-bs-toggle="modal">
                history
              </span>
            </template>
          </p>
        </div>
        <hr>
        <div id="tag-div">
          <p><strong>태그</strong></p>
          <div class="hashtag">
            <p>
              <span class="tag" v-for="tag in post.tags" :key="tag.id">
                <b-badge>#{{ tag }}</b-badge>
              </span>&nbsp;
            </p>
          </div>
        </div>
        <hr>
        <div>
          <div class="authors" data-bs-toggle="collapse" :data-bs-target="`#authorList`" :aria-controls="`#authorList`">
            <p><strong>참여자 ▽</strong></p>
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

    <!-- 퀴즈 모달창 -->
    <div v-if="isQuizAvailable" id="quiz-container">
      <TakeQuiz :quizId="selectedQuizId" />
    </div>

    <!-- 히스토리 모달창 -->
    <div class="modal fade" id="historyModal" aria-hidden="true" aria-labelledby="modalToggleLabel" tabindex="-1">
      <div class="modal-dialog modal-fullscreen">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="" id="modalToggleLabel">변경 히스토리 확인</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body" v-if="historyPost">
            <div class="history" id="historyContent">
              <h4 id="title"> {{ historyPost.title }} </h4>
              <small> {{ convertToDate(historyPost.createdAt) }}</small>
              <b-button variant="outline-dark" @click="restorePost()">버전 복원하기</b-button>
              <div id="tag-div">
                <div class="hashtag">
                  <p>
                    <span class="tag" v-for="tag in historyPost.tags" :key="tag.id">
                      <b-badge>#{{ tag }}</b-badge>
                    </span>&nbsp;
                  </p>
                </div>
              </div>
              <div id="content" v-html="historyPost.content"></div>
            </div>
            <div class="history" id="historyList">
              <b-list-group>
                <template v-for="history in post.history" :key="history.id">
                  <b-list-group-item button @click="setHistoryContent(history)">
                    <div>
                      <p>
                      <h3>
                        <b-avatar variant="info"
                          :src="history.author.profileImg ? history.author.profileImg : '@/assets/images/profile_image.png'"></b-avatar>
                        <span> &nbsp;{{ history.author.name }}&nbsp; </span>
                      </h3>
                      </p>
                      <small>{{ convertToDate(history.createdAt) }}</small>
                    </div>
                  </b-list-group-item>
                </template>
              </b-list-group>
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
import html2pdf from 'html2pdf.js';

import TakeQuiz from '@/components/quiz/TakeQuiz.vue';

const router = useRouter();
const currentRoute = useRoute();
const postId = currentRoute.params.id;
const general = (currentRoute.query.general == "true");

const isAuthorized = true;
const historyPost = ref(null);
const selectedQuizId = ref(null);
const isQuizAvailable = ref(false);

const post = ref({
  id: 2,
  title: "자바의 기본 문법 수정\r\n",
  content: `
  <div id="study-content">
    <h2>스터디 관련 내용</h2>
    <p>저희 스터디는 다음과 같은 내용으로 진행됩니다:</p>
    <ul>
        <li>매주 목요일 저녁 7시에 Zoom을 통한 온라인 회의</li>
        <li>각자 주제에 대한 조사와 발표 준비</li>
        <li>마감 시간을 준수하여 발표 자료 공유</li>
        <li>질의응답 및 토론 시간 확보</li>
    </ul>
    <p>스터디에 참여하기 위해서는 사전에 주제 선정 및 조사가 필요합니다. 또한, Zoom 링크와 발표 자료는 스터디 시작 1시간 전까지 공유되어야 합니다.</p>
    <p>더 자세한 내용은 아래 연락처로 문의해 주세요:</p>
    <ul>
        <li>이메일: example@example.com</li>
        <li>전화번호: 010-1234-5678</li>
    </ul>
</div>
  `,
  createdAt: "2021-11-08T11:44:30.327959",
  author: {
    id: 2,
    email: "test1",
    name: "테스트1",
    profileImg: "test1.jpg",
    role: "ROLE_NORMAL",
    startDate: null,
    endDate: null,
    phoneNumber: null,
    teamId: 2,
    positionId: 2,
    rankId: 2
  },
  originId: 1,
  recentId: null,
  tabRelationId: 1,
  categoryId: null,
  tags: ["개발", "tag1", "tag2", "tag6", "tag7", "tag8"],
  history: [
    {
      id: 1,
      title: "자바의 기본 문법",
      content: "자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다.",
      createdAt: "2021-11-08T11:44:30.327959",
      author: {
        id: 1,
        email: "admin",
        name: "관리자",
        profileImg: null,
        role: "ROLE_ADMIN",
        startDate: "2024-05-17",
        endDate: null,
        phoneNumber: null,
        teamId: 1,
        positionId: 1,
        rankId: 1
      },
      originId: null,
      recentId: 2,
      tabRelationId: 1,
      categoryId: null,
      tags: ["개발", "tag1", "tag2", "tag3", "tag4", "tag5"],
      history: null,
      participants: null
    },
    {
      id: 2,
      title: "자바의 기본 문법 수정\r\n",
      content: "수정 내용",
      createdAt: "2021-11-08T11:44:30.327959",
      author: {
        id: 2,
        email: "test1",
        name: "테스트1",
        profileImg: "test1.jpg",
        role: "ROLE_NORMAL",
        startDate: null,
        endDate: null,
        phoneNumber: null,
        teamId: 2,
        positionId: 2,
        rankId: 2
      },
      originId: 1,
      recentId: null,
      tabRelationId: 1,
      categoryId: null,
      tags: ["개발", "tag1", "tag2", "tag6", "tag7", "tag8"],
      history: null,
      participants: null
    }
  ],
  participants: [
    {
      id: 1,
      name: "홍길동",
      email: "admin",
      profileImg: "https://placekitten.com/300/300",
      name: "관리자",
      profileImg: null,
      role: "ROLE_ADMIN",
      startDate: "2024-05-17",
      endDate: null,
      phoneNumber: null,
      teamId: 1,
      positionId: 1,
      rankId: 1
    },
    {
      id: 2,
      name: "김영희",
      email: "test1",
      profileImg: "https://placekitten.com/300/300",
      role: "ROLE_NORMAL",
      startDate: null,
      endDate: null,
      phoneNumber: null,
      teamId: 2,
      positionId: 2,
      rankId: 2
    }
  ],
  "likeList": [
    {
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
    {
      "id": 2,
      "email": "test1",
      "name": "테스트1",
      "profileImg": "test1.jpg",
      "role": "ROLE_NORMAL",
      "startDate": null,
      "endDate": null,
      "phoneNumber": null,
      "teamId": 2,
      "positionId": 2,
      "rankId": 2
    }
  ]
});


onMounted(async () => {
  await checkQuizVisibility();
  setHistoryContent(post.value.history[0]);
});

const modifyPost = (postId) => {

  const segments = currentRoute.path.split('/');
  let detailPath = `${segments[1]}/${segments[2]}`;

  if (segments.length > 3 && segments[2] === "organization") {
    detailPath = `${detailPath}/${segments[3]}`;
  }

  router.push({
    path: `/${detailPath}/new`,
    query: {
      post: postId
    }
  });
};

async function restorePost() {
  if (confirm("선택한 버전으로 복원하시겠습니까?")) {
    historyPost.value.id = null;
    //await saveModifyPost(historyPost.value);
    location.reload(true);
  }
}

const setHistoryContent = (selectPost) => {
  historyPost.value = selectPost;
};

async function getAuthorized() {
  const response = await axios.get(`http://localhost:5000/post/isAuthor/${originId}`);
  isAuthorized.value = response.data;

  const segments = currentRoute.path.split('/');
  if (segments.length > 2 && segments[2] === "organization") {
    general = true;
  }

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

async function deletePost(postId) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      // const response = await axios.post(`http://localhost:5000/post/delete/${postId}`);
      router.push(`/tab/${post.value.tabRelationId}`);
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

async function getPostById() {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      const response = await axios.post(`http://localhost:5000/post/${postId}`);
      post.value = response.data;
      isAuthorized.value = (await axios.post(`http://localhost:5000/post/isAuthor/${postId}`)).data;
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    alert("게시글을 불러올 수 없습니다.");
  } finally {
  }
}

async function saveModifyPost(historyPost) {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
      await axios.get(`http://localhost:5000/post/modify`, { modifyPost: historyPost });
    } else {
      alert("잘못된 접근입니다.");
    }
  } catch (error) {
    alert("게시글 저장에 실패했습니다.");
  }
}

const generatePDF = () => {

  html2pdf().from(createPdfHtml()).set({ filename: `${post.value.title.trim()}.pdf` }).save();

  function createPdfHtml() {
    const pdfContent = `
    <div style="padding:20px">
    <h3>${post.value.title}</h3>
    <p>최종 수정일: ${convertToDate(post.value.createdAt)}</p>
    <div>
      <p>
        ${post.value.tags.map(tag => `<b-badge>#${tag}</b-badge>`).join('&nbsp;')}
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
}

#tag-div {
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
</style>
