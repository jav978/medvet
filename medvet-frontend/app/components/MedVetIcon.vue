<template>
  <img
    :src="logoImg"
    :class="[customClass || 'w-full h-full', 'object-contain select-none']"
    :style="sizeStyle"
    alt="MedVet"
    loading="eager"
    draggable="false"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import logoImg from '~/assets/logo.png'

interface Props {
  size?: number | string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: undefined,
  customClass: ''
})

const sizeStyle = computed(() => {
  if (!props.size) return {}
  const s = typeof props.size === 'number' ? `${props.size}px` : props.size
  return { width: s, height: s }
})
</script>

