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
    path: '/educational',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'college-list',
        path: '/educational/college-list',
        meta: {
          title: '学院管理',
          cache: false
        },
        component: () => import('@views/educational/college/index.vue')
      },
      {
        name: 'major-list',
        path: '/educational/major-list',
        meta: {
          title: '专业管理',
          cache: false
        },
        component: () => import('@views/educational/major/index.vue')
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'user',
        path: '/system/user',
        meta: {
          title: '用户管理',
          cache: false
        },
        component: () => import('@views/system/user/index.vue')
      },
      {
        name: 'role',
        path: '/system/role',
        meta: {
          title: '角色管理',
          cache: false
        },
        component: () => import('@views/system/role/index.vue')
      },
      {
        name: 'menu',
        path: '/system/menu',
        meta: {
          title: '菜单管理',
          cache: false
        },
        component: () => import('@views/system/menu/index.vue')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    meta: { cache: false },
    children: [
      {
        name: 'sign-in',
        path: '/sign-in',
        meta: {
          title: '学生签到',
          cache: false
        },
        component: () => import('@views/sign-in/index.vue')
      },
      {
        name: 'my-course',
        path: '/my-course',
        meta: {
          title: '我的课程',
          cache: false
        },
        component: () => import('@views/my-course/index.vue')
      },
      {
        name: 'choice-list',
        path: '/choice-list',
        meta: {
          title: '选课列表',
          cache: false
        },
        component: () => import('@views/choice-list/index.vue')
      },
      {
        name: 'application-list',
        path: '/application-list',
        meta: {
          title: '申请列表',
          cache: false
        },
        component: () => import('@views/application-list/index.vue')
      },
      {
        name: 'course-list',
        path: '/course-list',
        meta: {
          title: '课程管理',
          cache: false
        },
        component: () => import('@views/course/index.vue')
      },
      {
        name: '/create-attendance',
        path: '/create-attendance',
        meta: {
          title: '发布签到',
          cache: false
        },
        component: () => import('@views/create-attendance/index.vue')
      },
      {
        name: 'about',
        path: '/about',
        meta: {
          title: '关于系统',
          cache: false
        },
        component: () => import('@views/about/index.vue')
      },
      {
        name: 'center',
        path: '/user/center',
        meta: {
          title: '个人中心',
          cache: false
        },
        component: () => import('@views/center/index.vue')
      }
    ]
  }
]
