import { h } from 'vue'
import { addProps } from 'vnode-util'

export default function AddOutline(_, { slots }) {
  const children = addProps(slots.default(), () => {
    return {
      class: 'child-outline',
    }
  })

  return h('div', children)
}
