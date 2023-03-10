<script setup>
import { ref } from 'vue'
import AddMultipleRefs from './add-multiple-refs'
const count = ref(3)
</script>

<template>
  <button @click="count++">
    Add
  </button>
  |
  <button @click="count = Math.max(count - 1, 0)">
    Remove
  </button>
  <AddMultipleRefs>
    <template v-for="n in count">
      <div>Item {{ n }}</div>
    </template>
  </AddMultipleRefs>
</template>
