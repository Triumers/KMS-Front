import { createRouter, createWebHistory } from 'vue-router';

import MainView from '@/views/MainView.vue';

import WorkspaceView from '@/views/WorkspaceView.vue';
import PostListView from "@/components/post/SelectedPostList.vue";
import PostDetailView from "@/components/post/SelectedPostDetail.vue";
import PostWriterView from "@/components/post/CreateNewPost.vue";
import GeneralWriterView from "@/components/post/CreateNewGeneralPost.vue";
import DocsWriterView from "@/components/post/CreateNewDocs.vue";
import DocsListView from "@/components/post/SelectedDocsList.vue";

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
            path: '/wiki',
            component: Wiki,
            children: [
                {
                    path: '',
                    component: PostListView
                },
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
                    path: 'quiz',
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
                }
            ]
        },
        {
            path: '/workspace',
            component: Workspace,
            children: [
                {
                    path: '',  // 추후 ':id'로 변경
                    component: WorkspaceView,
                    children: [
                        {
                            path: 'wiki',
                            component: PostListView
                        },
                        {
                            path: 'docs',
                            component: DocsListView
                        },
                        {
                            path: 'wiki/new',
                            component: PostWriterView
                        },
                        {
                            path: 'docs/new',
                            component: DocsWriterView
                        }
                    ]
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: 'quiz',
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
                }
            ]
        },
        {
            path: '/group',
            component: Group,
            children: [
                {
                    path: 'study',
                    component: Study,
                    children: [
                        {
                            path: '', // 추후 ':id'로 변경
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
                            path: 'quiz',
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
                        }
                    ]
                },
                {
                    path: 'organization',
                    component: Organization,
                    children: [
                        {
                            path: '',  // 추후 ':id'로 변경
                            component: PostListView
                        },
                        {
                            path: 'detail/:id',
                            component: PostDetailView
                        },
                        {
                            path: 'new',
                            component: GeneralWriterView
                        },
                        {
                            path: 'quiz',
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
                        }
                    ]
                }
            ]
        },
        {
            path: '/office-life',
            component: OfficeLife,
            children: [
                {
                    path: '',  // 추후 ':id'로 변경
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
                    path: 'quiz',
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
                }
            ]
        }
    ]
});

export default router;
