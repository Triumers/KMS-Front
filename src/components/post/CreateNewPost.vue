<template>
    <div id="container">
        <form @submit.prevent="submitPost" @keydown.enter.prevent>
            <div id="top">
                <h3 id="top-title"><strong>게시글 작성</strong> </h3>
                <div>
                    <button id="save-btn" type="submit" class="btn btn-light" @click="savePost">작성 완료</button>
                </div>
            </div>
            <hr>

            <div id="main">
                <div id="main-content">

                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="title-input" v-model="postForm.title"
                            placeholder="제목을 입력해주세요.">
                        <label for="title-input">제목</label>
                    </div>

                    <div class="form-floating mb-3">
                        <b-form-tags id="tags" class="form-control" input-id="tags-separators" v-model="postForm.tags"
                            separator=" ,;" placeholder="태그 입력 후, 스페이스 바를 눌러주세요." no-add-on-enter></b-form-tags>
                        <label for="tags">태그</label>
                    </div>

                    <p id="content-info">
                        <small>※ 마우스 오른쪽 버튼 클릭 시, 파일 업로드가 가능합니다.</small>

                    <div>
                        <span><b-button variant="outline-secondary" data-bs-toggle="modal"
                                data-bs-target="#preview">미리보기</b-button></span>
                        <span>
                            <b-button variant="outline-info" @click="aiToggle = !aiToggle">AI
                                CHAT</b-button>
                        </span>
                    </div>


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

                    <div id="content" class="form-floating">
                        <b-form-textarea id="content-text" class="form-control" placeholder="내용을 입력해주세요."
                            v-model="postForm.content" no-resize @contextmenu.prevent="openFileDialog"
                            @keydown.stop></b-form-textarea>
                        <label for="content-text">
                            내용 (html 형식으로 작성)
                        </label>
                        <input type="file" ref="fileInput" @change="uploadFile" style="display: none;" />
                    </div>
                </div>

                <div id="ai-chat" v-if="aiToggle">
                    <div id="aiChat">
                        <p>
                            <b-badge class="ai-menu" @click="requestToAI($event)">글 업그레이드</b-badge>
                            <b-badge class="ai-menu" @click="requestToAI($event)">내용 검증</b-badge>
                            <b-badge class="ai-menu" @click="requestToAI($event)">맞춤법 교정</b-badge>
                        </p>
                        <div id="ai-content" class="card">
                            <p><span class="material-icons">info</span>&nbsp;<small>응답 메시지 박스 클릭 시, 내용 복사</small>
                            </p>

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
const post = ref(null);
const aiToggle = ref(false);

const fileInput = ref(null);
const postForm = ref({
    title: '',
    postImg: null,
    content: '',
    tags: [],
    tabRelationId: tabId,
    originId: originId
})

onMounted(() => {
    if (originId) {
        setPost();
    }
});

async function setPost() {

    await getPostById(originId);
    postForm.value = {
        title: post.value.title,
        content: post.value.content,
        tags: post.value.tags,
        tabRelationId: tabId,
        originId: originId
    };
}

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

    const fileUrl = response.data;
    const isImage = file.type.startsWith('image/');
    const urlToInsert = isImage ? `<img src="${fileUrl}" alt="${file.name}" class="img-fluid">` : `<a href="${fileUrl}">${file.name}</a>`;
    if (isImage && postForm.value.postImg == null) {
        postForm.value.postImg = fileUrl;
    }

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

    // const fileUrl = response.data;
    // const isImage = file.type.startsWith('image/');
    // const urlToInsert = isImage ? `<img src="${fileUrl}" alt="${file.name}" class="img-fluid">` : `<a href="${fileUrl}">${file.name}</a>`;
    // if(isImage && postForm.value.postImg == null) {
    //     postForm.value.postImg = fileUrl;
    // }
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
    if (originId) {
        console.log("MODIFY");
        // await saveModifyPost();
    }
    else {
        // await saveNewPost();
    }
    const segments = currentRoute.path.split('/');
    const firstRoot = segments[1];
    const newPath = `/${firstRoot}/detail/${originId}`;
    router.push(newPath);
}

async function saveNewPost() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = token;
            const response = await axios.post(`http://localhost:5000/post/regist`, {
                title: postForm.value.title,
                postImg: postForm.value.postImg,
                content: postForm.value.content,
                tags: postForm.value.tags,
                tabRelationId: postForm.value.tabId,
                originId: postForm.value.originId
            });
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
            await axios.post(`http://localhost:5000/post/modify`, {
                title: postForm.value.title,
                postImg: postForm.value.postImg,
                content: postForm.value.content,
                tags: postForm.value.tags,
                tabRelationId: postForm.value.tabId,
                originId: postForm.value.originId
            });
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

    const aiType = { '글 업그레이드': 'enhancement', '내용 검증': 'validation', '맞춤법 교정': 'grammar' };
    const type = event.target.textContent;

    const requestAI = document.createElement('p');
    requestAI.className = 'alert alert-light';
    requestAI.innerHTML = type;
    document.getElementById('ai-content').appendChild(requestAI);

    const response = await axios.post(`http://localhost:5000/post/ai`, {
        type: aiType[type],
        content: postForm.value.content
    });

    const responseContent = response.data;
    createResponseMsg(responseContent);

    // try {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         axios.defaults.headers.common['Authorization'] = token;
    // const response = await axios.post(`http://localhost:5000/post/ai`, {
    //                 type: aiType[type],
    //                 content: postForm.value.content
    //         });

    //         const responseContent = response.data;
    //         createResponseMsg(responseContent);

    //     } else {
    //         alert("잘못된 접근입니다.");
    //     }
    // } catch (error) {
    //     alert("요청에 실패했습니다.");
    // }

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

async function getPostById(originId) {

    const response = await axios.get(`http://localhost:5000/post/find/${originId}`);
    post.value = response.data;

    // try {
    //     const token = localStorage.getItem('token');
    //     if (token) {
    //         axios.defaults.headers.common['Authorization'] = token;
    //         const response = await axios.post(`http://localhost:5000/post/find/${originId}`);
    //         post.value = response.data;
    //     } else {
    //         alert("잘못된 접근입니다.");
    //     }
    // } catch (error) {
    //     alert("게시글을 불러올 수 없습니다.");
    // } finally {
    // }
}
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
    min-height: 450px;
}
</style>