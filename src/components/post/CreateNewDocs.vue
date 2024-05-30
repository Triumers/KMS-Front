<template>

    <form id="docs-container" @submit.prevent="submitPost" @keydown.enter.prevent>
        <div id="top">
            <h3 id="title"><strong>DOCS</strong> </h3>
            <div>
                <button id="save-btn" type="submit" class="btn btn-light" @click="savePost">업로드</button>
            </div>
        </div>
        <hr>

        <div class="form-floating mb-3">
            <input type="text" class="form-control" id="title" v-model="docsForm.title" placeholder="제목을 입력해주세요.">
            <label for="title">제목</label>
        </div>

        <div class="mb-3">
            <label for="formFile" class="form-label"><strong>파일 업로드</strong></label>
            <input class="form-control" type="file" @change="uploadDocs" id="formFile">
        </div>
    </form>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const currentRoute = useRoute();

const tabId = currentRoute.params.id;
const originId = currentRoute.query.post;

const docsForm = ref({
    id: null,
    title: '',
    postImg: null,
    content: '',
    tags: [],
    tabRelationId: tabId,
    originId: originId,
    categoryId: 2
})

async function uploadDocs(event) {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5000/post/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });

    const fileUrl = response.data;
    docsForm.value.content = `${file.name.trim()} : ${file.type.trim()} : ${fileUrl.trim()}`;

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
    // docsForm.value.content = fileUrl;
    //         } else {
    //             alert("잘못된 접근입니다.");
    //         }
    //     } catch (error) {
    //         alert("파일 업로드에 실패했습니다.");
    //     }
    // }
}

async function savePost() {

    console.log(postForm.value);
    // await saveNewPost();

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


onMounted(() => {
    
});

</script>

<style>
#docs-container {
    margin: 20px;
}

#content {
    margin-top: 15px;
}
</style>