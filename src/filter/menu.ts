import { Menu, MenuVo } from '../types/entity'

/**
 * 菜单过滤
 * @param menus 菜单数据
 * @param parent_id 父ID
 */
export const filterMenu = (
  menus: Array<Menu>,
  parent_id: number
): Array<MenuVo> => {
  const data: Array<MenuVo> = []
  menus
    .filter(
      (item) =>
        [1, 2].includes(item.menu_type as number) &&
        item.parent_id === parent_id &&
        item.is_show
    )
    .forEach((item) => {
      data.push({
        name: item.menu_title as string,
        icon: item.icon as string,
        path: item.path as string,
        children: item.is_sub ? filterMenu(menus, item.menu_id as number) : []
      })
    })
  return data
}
