import {createRouter, createWebHistory} from 'vue-router';

import MainView from '@/views/MainView.vue';

import PostView from '@/views/PostView.vue';
import PostListView from "@/components/post/SelectedPostList.vue";
import PostDetailView from "@/components/post/SelectedPostDetail.vue";
import PostWriterView from "@/components/post/CreateNewPost.vue";



const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: MainView
        },
        {
            path: '/tab',
            component: PostView,
            children:[
                {
                    path: '/tab/:id',
                    component: PostListView
                },
                {
                    path: '/tab/detail/:id',
                    component: PostDetailView
                },
                {
                    path: '/tab/:id/new',
                    component: PostWriterView
                }
            ]
        }
    ]
});

export default router;