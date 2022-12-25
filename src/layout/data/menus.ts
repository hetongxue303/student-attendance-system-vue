export const menus: Array<any> = [
  {
    name: '首页',
    icon: 'index',
    path: '/dashboard'
  },
  {
    name: '学校管理',
    icon: 'school',
    path: '/school',
    children: [
      {
        name: '学院管理',
        icon: 'college',
        path: '/school/college'
      },
      {
        name: '专业管理',
        icon: 'major',
        path: '/school/major'
      }
    ]
  },
  {
    name: '教务管理',
    icon: 'user',
    path: '/educational',
    children: [
      {
        name: '课程管理',
        icon: 'course',
        path: '/educational/course'
      }
    ]
  }
]
