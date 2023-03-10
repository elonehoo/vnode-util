import { addProps } from 'vnode-util'

export default {
  emits: ['update:modelValue'],
  props: ['modelValue'],

  render() {
    return addProps(this.$slots.default(), () => {
      return {
        'modelValue': this.modelValue,
        'onUpdate:modelValue': (newValue) => {
          this.$emit('update:modelValue', newValue)
        },
      }
    })
  },
}
