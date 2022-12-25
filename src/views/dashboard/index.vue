<template>首页</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getCenterInfo } from '../../api/login'

onMounted(() => {
  getCenterInfo('admin')
})
</script>

<style scoped lang="scss"></style>
