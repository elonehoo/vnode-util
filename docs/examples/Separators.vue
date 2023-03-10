<script setup>
import InsertSeparators from './insert-separators'
</script>

<template>
  <InsertSeparators>
    <div>Top</div>
    <template v-for="n in 3">
      <div>{{ n }} - Upper</div>
      <div>{{ n }} - Lower</div>
    </template>
    <div>Bottom</div>
  </InsertSeparators>
</template>
