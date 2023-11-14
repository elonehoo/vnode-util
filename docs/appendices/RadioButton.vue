<script>
</script>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    required: true,
  },
  value: {
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])
let id = 0
const radioModel = computed({
  get() {
    return props.modelValue
  },
  set(newChecked) {
    emit('update:modelValue', newChecked)
  },
})
const myId = `radio-button-${++id}`
</script>

<template>
  <div>
    <input :id="myId" v-model="radioModel" type="radio" :value="value">
    <label :for="myId"><slot /></label>
  </div>
</template>
