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
    name: '关于系统',
    icon: 'about',
    path: '/about'
  }
]
