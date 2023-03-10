<script setup>
import ResultsList from './results-list'
</script>

<template>
  <pre>[]</pre>
  <ResultsList>
    <li v-for="result in []">
      {{ result }}
    </li>
  </ResultsList>
  <pre>['red', 'green', 'blue']</pre>
  <ResultsList>
    <li v-for="result in ['red', 'green', 'blue']">
      {{ result }}
    </li>
  </ResultsList>
</template>
