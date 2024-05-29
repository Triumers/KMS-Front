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
                    path: 'general/new',
                    component: GeneralWriterView
                }
            ]
        },
        {
            path: '/wiki',
            component: Wiki,
            children: [
                {
                    path: 'posts',
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
                            path: 'general/new',
                            component: GeneralWriterView
                        }
                    ]
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
                    path: 'posts',
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
                            path: 'general/new',
                            component: GeneralWriterView
                        }
                    ]
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
                            path: 'posts',
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
                                    path: 'general/new',
                                    component: GeneralWriterView
                                }
                            ]
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
                            path: 'posts',
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
                                    path: 'general/new',
                                    component: GeneralWriterView
                                }
                            ]
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
                    path: 'posts',
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
                            path: 'general/new',
                            component: GeneralWriterView
                        }
                    ]
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
