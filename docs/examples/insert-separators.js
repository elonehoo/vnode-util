import { h } from 'vue'
import { betweenChildren } from 'vnode-util'

export default function InsertSeparators(_, { slots }) {
  return betweenChildren(slots.default(), () => h('hr'))
}
