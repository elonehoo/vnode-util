# Inserting new nodes

Adding extra nodes before or after slot contents is relatively easy and doesn't even need a render function. But inserting extra nodes between the slotted nodes is more difficult. Comment nodes from `v-if` typically need to be ignored and fragments coming from `v-for` make it quite difficult to figure out exactly what 'top-level' nodes exist. Further, the fragments tree is an important part of the VNode diffing algorithm, so flattening that tree can lose valuable information.

The `betweenChildren()` helper aims to make inserting nodes between children easier. This example inserts an `<hr>` between 'top-level' children:

```js
import { h } from 'vue'
import { betweenChildren } from 'vnode-util'
// Inside a render function
const children = slots.default?.() || []
const newChildren = betweenChildren(children, (beforeVNode, afterVNode) => {
  return h('hr')
})
```

The callback will be passed the two VNodes, allowing for conditional logic to decide what to insert between them. While the two nodes are considered adjacent from an iteration perspective, they may be in different fragments or have other nodes between them that have been skipped. By default, any comment VNodes will be ignored. The exact insertion position of any returned nodes is not guaranteed, only that it will be somewhere between the two nodes passed to the callback.

If the callback returns an array then the individual items will be inserted, it won't be treated as a fragment. Nested arrays will be treated as fragments. This is similar to passing children to `h()`. If the number of items being inserted is dynamic then wrapping them in a fragment can be a useful technique to ensure that VNodes get paired up correctly across re-renders. A fragment can also make it easier to assign suitable `key` values, as the children of a fragment are only eligible for pairing with each other.

`betweenChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `betweenChildren()` is `SKIP_COMMENTS`.
