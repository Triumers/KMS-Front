import { createRouter, createWebHistory } from 'vue-router';

import MainView from '@/views/MainView.vue';

import PostView from '@/views/PostView.vue';
import PostListView from "@/components/post/SelectedPostList.vue";
import PostDetailView from "@/components/post/SelectedPostDetail.vue";
import PostWriterView from "@/components/post/CreateNewPost.vue";
import GeneralWriterView from "@/components/post/CreateNewGeneralPost.vue";
import CreateQuiz from '@/components/quiz/CreateQuiz.vue';
import TakeQuiz from '@/components/quiz/TakeQuiz.vue';
import QuizView from '@/views/QuizView.vue';

import Wiki from '@/views/Wiki.vue';
import Workspace from '@/views/Workspace.vue';
import Group from '@/views/Group.vue';
import Study from '@/views/Study.vue';
import Organization from '@/views/Organization.vue';
import OfficeLife from '@/views/OfficeLife.vue';

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
            children: [
                {
                    path: ':id',
                    component: PostListView
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: ':id/new',
                    component: PostWriterView
                },
                {
                    path: 'meeting/new',
                    component: GeneralWriterView
                }
            ]
        },
        {
            path: '/quiz',
            component: QuizView,
            children: [
                {
                    path: 'new',
                    component: CreateQuiz
                },
                {
                    path: ':id',
                    component: TakeQuiz
                }
            ]
        },
        {
            path: '/wiki',
            component: Wiki
        },
        {
            path: '/workspace',
            component: Workspace
        },
        {
            path: '/group',
            component: Group,
            children: [
                {
                    path: 'study',
                    component: Study
                },
                {
                    path: 'organization',
                    component: Organization
                }
            ]
        },
        {
            path: '/office-life',
            component: OfficeLife
        }
    ]
});

export default router;
