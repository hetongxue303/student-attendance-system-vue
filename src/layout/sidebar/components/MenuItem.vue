<template>
  <template v-for="(item, index) in data" :key="index">
    <!--有子组件时-->
    <el-sub-menu
      v-if="item.children && item.children.length > 0"
      :index="item.path"
    >
      <template #title>
        <svg-icon :mr="10" :name="item.icon" />
        <span>{{ item.title }}</span>
      </template>
      <MenuItem :data="item.children" />
    </el-sub-menu>
    <!--无子组件时-->
    <el-menu-item v-else :index="item.path">
      <svg-icon :mr="10" :name="item.icon" />
      <template #title>{{ item.title }}</template>
    </el-menu-item>
  </template>
</template>

<script setup lang="ts">
import { MenuDto } from '../../../types/element'

withDefaults(defineProps<{ data: MenuDto[] }>(), {})
</script>

<style scoped lang="scss">
:deep(.el-menu-item) {
  background-color: #1f2d3d;
  border-right: 0;

  &:hover {
    background-color: #001528;
  }
}

:deep(.el-sub-menu__title:hover) {
  background-color: #263445 !important;
}
</style>
