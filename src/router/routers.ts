import { RouteRecordRaw } from 'vue-router'
import Layout from '@layout/Index.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '用户登录',
      cache: false
    },
    component: () => import('@views/login.vue')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { cache: false },
    children: [
      {
        name: 'dashboard',
        path: '/dashboard',
        meta: {
          title: '首页',
          cache: false
        },
        component: () => import('@views/dashboard/index.vue')
      },
      {
        name: '401',
        path: '/401',
        meta: {
          title: '401',
          cache: false
        },
        component: () => import('@views/error/401.vue')
      },
      {
        name: '404',
        path: '/:pathMatch(.*)*',
        meta: {
          title: '404',
          cache: false
        },
        component: () => import('@views/error/404.vue')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'college',
        path: '/school/college',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => import('@views/school/college/index.vue')
      },
      {
        name: 'major',
        path: '/school/major',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => import('@views/school/major/index.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'course',
        path: '/educational/course',
        meta: {
          title: '课程管理',
          cache: false
        },
        component: () => import('@views/educational/course/index.vue')
      }
    ]
  }
]
