import { createRouter, createWebHistory } from 'vue-router';

import SearchView from '@/views/SearchView.vue';
import SearchAllListView from '@/components/post/SearchAllPostList.vue';

import WorkspaceView from '@/views/WorkspaceView.vue';
import PostListView from "@/components/post/SelectedPostList.vue";
import PostDetailView from "@/components/post/SelectedPostDetail.vue";
import PostWriterView from "@/components/post/CreateNewPost.vue";
import GeneralWriterView from "@/components/post/CreateNewGeneralPost.vue";
import DocsWriterView from "@/components/post/CreateNewDocs.vue";
import DocsListView from "@/components/post/SelectedDocsList.vue";

import AnonymousBoard from '@/views/AnonymousBoard.vue';
import AnonymousBoardListView from '@/components/anonymous-board/AnonymousBoardList.vue';
import AnonymousBoardDetailView from '@/components/anonymous-board/AnonymousBoardDetail.vue';
import AnonymousBoardWriterView from '@/components/anonymous-board/CreateNewAnonymousBoard.vue';

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
            path: '',
            component: PostListView
        },
        {
            path: '/search',
            component: SearchView,
            children: [
                {
                    path: '',
                    component: SearchAllListView,
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                }
            ]
        },
        {
            path: '/wiki/1',
            component: Wiki,
            children: [
                {
                    path: '',
                    component: PostListView,
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: 'new',
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
                    path: 'study', // 추후 ':id'로 변경
                    component: Study,
                    children: [
                        {
                            path: '', 
                            component: PostListView
                        },
                        {
                            path: 'new',
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
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: 'organization/2',
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
            path: '/office-life/3',
            component: OfficeLife,
            children: [
                {
                    path: '',
                    component: PostListView
                },
                {
                    path: 'detail/:id',
                    component: PostDetailView
                },
                {
                    path: '/new',
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
                },
                {
                    path: 'anonymous-board',
                    component: AnonymousBoard,
                    children: [
                        {
                            path: 'list',
                            component: AnonymousBoardListView
                        },
                        {
                            path: 'new',
                            component: AnonymousBoardWriterView
                        },
                        {
                            path: ':id',
                            component: AnonymousBoardDetailView
                        }
                    ]
                }
            ]
        }
    ]
});

export default router;
