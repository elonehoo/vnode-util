<script setup>
import WrappingList from './WrappingList.vue'
</script>

<template>
  <WrappingList>
    <div>Top</div>
    <template v-for="n in 3">
      <div>{{ n }} - Upper</div>
      <div>{{ n }} - Lower</div>
    </template>
    <div>Bottom</div>
  </WrappingList>
</template>
Footer
