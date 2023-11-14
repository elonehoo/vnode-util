<script setup>
import { ref } from 'vue'
import RadioButton from './RadioButton.vue'
import RadioGroup from './RadioGroup'

const boundValue = ref(null)
</script>

<template>
  <div>Bound value: {{ boundValue }}</div>
  <div>
    <RadioGroup v-model="boundValue">
      <RadioButton :value="null">
        None
      </RadioButton>
      <RadioButton v-for="item in ['First', 'Second', 'Third']" :value="item">
        {{ item }}
      </RadioButton>
    </RadioGroup>
  </div>
</template>
