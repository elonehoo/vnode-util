<script setup>
import AddOutline from './add-outline'
</script>

<template>
  <AddOutline>
    <div>Top</div>
    <template v-for="n in 3">
      <div>{{ n }} - Upper</div>
      <div>{{ n }} - Lower</div>
    </template>
    <div>Bottom</div>
  </AddOutline>
</template>
