<template>
    <div id="container">
  <div id="top">
    <h1 id="title"> {{ post.title }} </h1>
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
          <span class="material-icons">more horiz</span>
        </template>
        <b-dropdown-item id="export"  @click="generatePDF">PDF 내보내기</b-dropdown-item>
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
            <span class="material-icons" data-bs-toggle="tooltip" title="게시글 히스토리 확인" @click="openHistoryModal">
              history
            </span>
          </template>
        </p>
      </div>
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
      <div>
        <div class="authors" data-bs-toggle="collapse" :data-bs-target="`#authorList`" :aria-controls="`#authorList`">
          <p><strong>참여자 ▽</strong></p>
        </div>
        <div class="collapse" id="authorList">
          <p class="author" v-for="participant in post.participants" :key="participant.id">
            <b-avatar variant="info"
              :src="participant.profileImg ? participant.profileImg : 'https://placekitten.com/300/300'">
            </b-avatar>
            &nbsp;{{ participant.name }}&nbsp;
          </p>
        </div>
      </div>
    </div>
  </div>

  <div>
    <button @click="openQuizModal">퀴즈 풀기</button>
    <Modal :isVisible="showQuizModal" @close="closeQuizModal">
      <TakeQuiz :quizId="selectedQuizId" :isVisible="showQuizModal" />
    </Modal>
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
                        :src="history.author.profileImg ? history.author.profileImg : 'https://placekitten.com/300/300'"></b-avatar>
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

import Modal from '@/components/common/Modal.vue';
import TakeQuiz from '@/components/quiz/TakeQuiz.vue';

const router = useRouter();
const currentRoute = useRoute();
const postId = currentRoute.params.id;
const general = (currentRoute.query.general == "true");

const isAuthorized = true;
const historyPost = ref(null);
const showQuizModal = ref(false);
const selectedQuizId = ref("1");

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
    {
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
    }
  ],
  hasQuiz: true
});

onMounted(() => {
  setHistoryContent(post.value.history[0]);
});

const modifyPost = (postId) => {
  let modifyPath = `/tab/${post.value.tabRelationId}`;
  if (general) {
    modifyPath += "/general";
  }
  router.push({
    path: modifyPath + "/new",
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
  
  html2pdf().from(createPdfHtml()).save();

  function createPdfHtml(){
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


const openQuizModal = () => {
  showQuizModal.value = true;
};

const closeQuizModal = () => {
  showQuizModal.value = false;
};

const openHistoryModal = () => {
  $('#historyModal').modal('show');
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
</style>
