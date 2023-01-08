# Replacing nodes

`replaceChildren()` can be used to add, remove or replace VNodes.

```js
import { cloneVNode, h } from 'vue'
import { replaceChildren } from 'vnode-util'
// Inside a render function
const children = slots.default?.() || []
const newChildren = replaceChildren(children, (vnode) => {
  // If the child is already a <li>, ensure it has the 'list-item' class
  if (vnode.type === 'li') {
    return cloneVNode(vnode, { class: 'list-item' })
  }
  // If the child isn't already a <li>, wrap it in one
  return h('li', { class: 'list-item' }, [vnode])
})
```

As shown in the example above, `replaceChildren()` can be combined with `cloneVNode()` to recreate the functionality of [`addProps()`](/guide/adding-props.html). It can also be used instead of [`betweenChildren()`](/guide/inserting-new-nodes.html) to insert nodes.

The callback function can return either a single VNode or an array of children. The returned nodes are inserted into the tree to replace the node passed to the callback. The original node can be included in the returned array. If the callback returns `null` or `undefined` then the tree will be left unchanged. An empty array can be used to remove a node from the tree.

As with the other helpers, fragment VNodes will be skipped and their children will be walked instead. The fragments will be cloned when replacing child nodes but the overall structure of the fragments will be preserved.

If the callback returns an array it will not be treated as a fragment, the individual children will be added in place of the current node. Any arrays nested within the returned array will be treated as fragments, just as they would when passing children to `h()`. When making changes to the tree structure it is important to consider the impact of fragments and `key` values to ensure that the VNodes get paired up correctly across re-renders.

`replaceChildren()` takes an optional third argument specifying [iteration options](/api.html#iterationoptions), much like with the [iterators](/guide/iterators.html). Unlike those iterators, the default value for `replaceChildren()` is `SKIP_COMMENTS`.
