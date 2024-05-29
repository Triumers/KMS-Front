<template>
    <div id="container">
        <form @submit.prevent="submitPost" @keydown.enter.prevent>
            <div id="top">
                <h3 id="title"><strong>게시글 작성</strong> </h3>
                <div>
                    <button id="save-btn" type="submit" class="btn btn-light" @click="savePost">작성 완료</button>
                </div>
            </div>
            <hr>

            <div id="main">
                <div id="main-content">

                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title" v-model="postForm.title"
                            placeholder="제목을 입력해주세요.">
                        <label for="title">제목</label>
                    </div>

                    <div class="form-floating mb-3">
                        <b-form-tags id="tags" class="form-control" input-id="tags-separators" v-model="postForm.tags"
                            separator=" ,;" placeholder="태그 입력 후, 스페이스 바를 눌러주세요." no-add-on-enter></b-form-tags>
                        <label for="tags">태그</label>
                    </div>

                    <p id="content-info">
                        <small>※ 마우스 오른쪽 버튼 클릭 시, 파일 업로드가 가능합니다.</small>
                        <span><b-button variant="outline-secondary" data-bs-toggle="modal"
                                data-bs-target="#preview">미리보기</b-button></span>

                    <!-- 미리보기 모달창 -->
                    <div class="modal fade" id="preview" data-bs-backdrop="static" data-bs-keyboard="false"
                        tabindex="-1" aria-labelledby="previewLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-scrollable">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h1 class="modal-title fs-5" id="previewLabel">미리보기</h1>
                                    <button type="button" class="btn-close" data-bs-dismiss="modal"
                                        aria-label="Close"></button>
                                </div>
                                <div class="modal-body" v-html="postForm.content">

                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary"
                                        data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </p>

                    <div id="content" class="form-floating mb-3">
                        <b-form-textarea id="content-text" class="form-control" placeholder="내용을 입력해주세요."
                            v-model="postForm.content" no-resize @contextmenu.prevent="openFileDialog"
                            @keydown.stop></b-form-textarea>
                        <label for="content-text">
                            내용 (html 형식으로 작성)
                        </label>
                        <input type="file" ref="fileInput" @change="uploadFile" style="display: none;" />
                    </div>
                </div>

                <div id="ai-chat">
                    <div>
                        <div class="ai" data-bs-toggle="collapse" :data-bs-target="`#aiChat`"
                            :aria-controls="`#aiChat`">
                            <h5>AI CHAT ▽</h5>
                        </div>
                        <hr>

                        <div class="collapse" id="aiChat">
                            <p>
                                <b-badge class="ai-menu" @click="requestToAI($event)">글 업그레이드</b-badge>
                                <b-badge class="ai-menu" @click="requestToAI($event)">내용 검증</b-badge>
                                <b-badge class="ai-menu" @click="requestToAI($event)">맞춤법 검사</b-badge>
                            </p>
                            <div id="ai-content" class="card">
                                <p><span class="material-icons">info</span>&nbsp;<small>응답 메시지 박스 클릭 시, 내용 복사</small>
                                </p>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </form>

    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const originId = currentRoute.query.post;

const fileInput = ref(null);
const postForm = ref({
    title: '',
    content: '',
    tags: [],
    tabRelationId: tabId,
    originId: originId
})

const aiForm = ref({
    content: ''
});

function openFileDialog(event) {
    event.preventDefault();
    fileInput.value.click();
}

async function uploadFile(event) {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/post/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    const fileUrl = response.data.url;
    const isImage = file.type.startsWith('image/');
    const urlToInsert = isImage ? `<img src="${fileUrl}" alt="${file.name}">` : `<a href="${fileUrl}">${file.name}</a>`;

    insertAtCursor(urlToInsert);


    // if (file) {
    //     try {
    //         const formData = new FormData();
    //         formData.append('file', file);

    //         const token = localStorage.getItem('token');
    //         if (token) {
    //             axios.defaults.headers.common['Authorization'] = token;
    //             const response = await axios.post('http://localhost:5000/post/upload', formData, {
    //                 headers: {
    //                     'Content-Type': 'multipart/form-data'
    //                 }
    //             });

    //             const fileUrl = response.data.url;
    //             const isImage = file.type.startsWith('image/');
    //             const urlToInsert = isImage ? `<img src="${fileUrl}" alt="${file.name}">` : `<a href="${fileUrl}">${file.name}</a>`;

    //             insertAtCursor(urlToInsert);
    //         } else {
    //             alert("잘못된 접근입니다.");
    //         }
    //     } catch (error) {
    //         alert("파일 업로드에 실패했습니다.");
    //     }
    // }
}

function insertAtCursor(text) {
    const textarea = document.getElementById('content-text');
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const beforeValue = textarea.value.substring(0, startPos);
    const afterValue = textarea.value.substring(endPos, textarea.value.length);

    postForm.value.content = beforeValue + text + afterValue;
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.focus();
}

async function savePost() {

    console.log(postForm.value);

    if (originId) {
        console.log("MODIFY");
        // await saveModifyPost();
        router.push(`/tab/detail/${originId}`);
    }
    else {
        // await saveNewPost();
        router.push(`/tab/detail/${originId}`);
    }
}

async function saveNewPost() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.get(`http://localhost:5000/post/regist`, { newPost: postForm.value });
            originId.value = response.data.id;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글 저장에 실패했습니다.");
    }
}

async function saveModifyPost() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            await axios.get(`http://localhost:5000/post/modify`, { modifyPost: postForm.value });
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글 저장에 실패했습니다.");
    }
}


function responseMsgClick() {
    const divContent = this.textContent;
    navigator.clipboard.writeText(divContent)
        .then(() => {
            alert("복사 되었습니다.")
            console.log('복사 완료');
        })
        .catch(err => {
            console.error('복사 실패:', err);
        });
}

async function requestToAI(event) {

    const aiType = { '글 업그레이드': 'enhancement', '내용 검증': 'validation', '맞춤법 검사': 'grammar' };
    const type = event.target.textContent;

    const requestAI = document.createElement('p');
    requestAI.className = 'alert alert-light';
    requestAI.innerHTML = type;
    document.getElementById('ai-content').appendChild(requestAI);

    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.get(`http://localhost:5000/post/ai`, {
                request: {
                    type: aiType[type],
                    content: postForm.value.content
                }
            });

            const responseContent = response.data.content;
            createResponseMsg(responseContent);

        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("요청에 실패했습니다.");
    }

    function createResponseMsg(content) {
        const responseAI = document.createElement('p');
        responseAI.addEventListener('click', responseMsgClick);
        responseAI.className = 'alert alert-primary';
        responseAI.setAttribute('data-bs-toggle', 'tooltip'); // 툴팁 토글 속성 추가
        responseAI.setAttribute('title', '클릭 시, 내용 복사'); // 툴팁 제목 추가
        responseAI.innerHTML = content;

        document.getElementById('ai-content').appendChild(responseAI);
    }


}


const setPost = () => {
    postForm.value = {
        title: post.value.title,
        content: post.value.content,
        tags: post.value.tags,
        tabRelationId: tabId,
        originId: originId
    };
}

onMounted(() => {
    if (originId) {
        setPost();
    }
});

async function getPostById() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/post/${originId}`);
            post.value = response.data;
        } else {
            alert("잘못된 접근입니다.");
        }
    } catch (error) {
        alert("게시글을 불러올 수 없습니다.");
    } finally {
    }
}

const post = ref({
    "id": 2,
    "title": "자바의 기본 문법 수정\r\n",
    "content": "수정 내용",
    "createdAt": "2021-11-08T11:44:30.327959",
    "author": {
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
    },
    "originId": 1,
    "recentId": null,
    "tabRelationId": 1,
    "categoryId": null,
    "tags": [
        "개발", "tag1", "tag2", "tag6", "tag7", "tag8"
    ],
    "history": [
        {
            "id": 1,
            "title": "자바의 기본 문법",
            "content": "자바는 객체 지향 프로그래밍 언어로, 강력한 기능과 유연성을 제공합니다. 이번 스터디에서는 자바의 기본 문법과 객체 지향 프로그래밍의 개념을 학습합니다. 변수 선언, 자료형, 조건문, 반복문, 클래스와 객체, 상속과 다형성 등의 내용을 다룹니다.",
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
            "participants": null
        },
        {
            "id": 2,
            "title": "자바의 기본 문법 수정\r\n",
            "content": "수정 내용",
            "createdAt": "2021-11-08T11:44:30.327959",
            "author": {
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
            },
            "originId": 1,
            "recentId": null,
            "tabRelationId": 1,
            "categoryId": null,
            "tags": [],
            "history": null,
            "participants": null
        }
    ],
    "participants": [
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

</script>

<style>
#top,
#main,
#content-info {
    display: flex;
    justify-content: space-between;
}

#container {
    margin: 20px;
}

#main-content {
    width: 100%;
    height: 100%;
    padding-right: 20px;
}

#ai-chat {
    max-width: 300px;
    min-width: 300px;
}

#ai-content {
    height: 500px;
    padding: 10px;
    overflow-y: auto;
}

.ai-menu {
    margin-left: 5px;
}


.form-floating {
    height: fit-content;
}

#content-text {
    width: 100%;
    min-height: 450px;
}
</style>