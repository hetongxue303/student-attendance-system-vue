export const menus: Array<any> = [
  {
    name: '首页',
    icon: 'index',
    path: '/dashboard'
  },
  {
    name: '学生签到',
    icon: 'user',
    path: '/sign-in'
  },
  {
    name: '我的课程',
    icon: 'user',
    path: '/my-course'
  },
  {
    name: '选课列表',
    icon: 'user',
    path: '/choice-list'
  },
  {
    name: '申请列表',
    icon: 'user',
    path: '/application-list'
  },
  {
    name: '课程管理',
    icon: 'course',
    path: '/course'
  },
  {
    name: '发布签到',
    icon: 'course',
    path: '/create-attendance'
  },
  {
    name: '考勤管理',
    icon: 'user',
    path: '/attendance',
    children: [
      {
        name: '考勤记录',
        icon: 'user',
        path: '/attendance/record'
      }
    ]
  },
  {
    name: '教务管理',
    icon: 'user',
    path: '/educational',
    children: [
      {
        name: '学院管理',
        icon: 'college',
        path: '/educational/college'
      },
      {
        name: '专业管理',
        icon: 'major',
        path: '/educational/major'
      }
    ]
  },
  {
    name: '系统管理',
    icon: 'system',
    path: '/system',
    children: [
      {
        name: '用户管理',
        icon: 'user',
        path: '/system/user'
      },
      {
        name: '角色管理',
        icon: 'role',
        path: '/system/role'
      },
      {
        name: '菜单管理',
        icon: 'menu',
        path: '/system/menu'
      }
    ]
  },
  {
    name: '关于系统',
    icon: 'about',
    path: '/about'
  }
]
