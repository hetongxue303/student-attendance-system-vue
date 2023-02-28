<template>
  <svg
    :aria-hidden="true"
    class="svg-icon"
    :style="{
      color: color,
      height: size + 'em',
      width: size + 'em',
      fill: fill,
      marginRight: mr + 'px',
      marginLeft: ml + 'px'
    }"
  >
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    prefix?: string
    name: string
    color?: string
    size?: number
    fill?: string
    ml?: number
    mr?: number
  }>(),
  {
    prefix: 'icon',
    color: '',
    size: 1.2,
    fill: 'currentColor',
    ml: 0,
    mr: 0
  }
)

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>

<style scoped lang="scss">
.svg-icon {
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
