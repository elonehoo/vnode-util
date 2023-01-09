<script setup>
import WrappingList from './WrappingList.vue'
</script>

<template>
  <wrapping-list>
    <div>Top</div>
    <template v-for="n in 3">
      <div>{{ n }} - Upper</div>
      <div>{{ n }} - Lower</div>
    </template>
    <div>Bottom</div>
  </wrapping-list>
</template>
Footer
