<template>首页</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getCenterInfo } from '../../api/login'
import { usePermissionStore } from '../../store/modules/permission'
import { filterMenu } from '../../filter/menu'
import { MenuVo } from '../../types/entity'

onMounted(() => {
  getCenterInfo('admin')
  aaa()
})
const aaa = () => {
  const menus: Array<MenuVo> = filterMenu(usePermissionStore().getMenus, 0)
}
</script>

<style scoped lang="scss"></style>
