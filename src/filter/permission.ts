import { Menu } from '../types/entity'
import { MenuDto } from '../types/element'
import { RouteRecordRaw } from 'vue-router'

// 解决vite不能使用vue3+ts动态导入问题
const modules = import.meta.glob('../views/**/*.vue')

/**
 * 过滤菜单信息
 * @param menus 用户菜单信息
 * @param parent_id 父ID
 */
export const filterMenu = (menus: Menu[], parent_id: number): MenuDto[] => {
  const data: MenuDto[] = []
  menus
    .filter(
      (item) =>
        [1, 2].includes(Number(item.menu_type)) &&
        item.parent_id === parent_id &&
        item.is_show
    )
    .forEach((item) => {
      data.push({
        title: item.menu_title as string,
        icon: item.icon as string,
        path: item.path as string,
        children: item.is_sub ? filterMenu(menus, item.menu_id as number) : []
      })
    })
  return data
}

/**
 * 过滤路由信息
 * @param menus 用户菜单信息
 */
export const filterRouter = (menus: Menu[]): RouteRecordRaw[] => {
  const data: RouteRecordRaw[] = []
  menus
    .filter((item) => !item.is_sub)
    .forEach((item) => {
      data.push({
        name: item.menu_name as string,
        path: item.path as string,
        component: modules[`../views/${item.component}`],
        meta: {
          title: item.menu_title as string,
          icon: item.icon as string,
          type: item.menu_type as string,
          show: item.is_show as boolean,
          sub: item.is_sub as boolean
        }
      })
    })
  return data
}
