# Iterators

`vnode-util` provides several iterator functions that can be used to walk slot VNodes *without* modifying them. They are roughly equivalent to the iterator methods found on arrays:

| Array     | vnode-util      |
|-----------|----------------------|
| forEach() | eachChild()          |
| every()   | everyChild()         |
| find()    | findChild()          |
| some()    | someChild()          |

Each of the iterators takes three arguments. The first is the array of children to iterate, which is usually created by calling a slot function. The second is a callback function that will be passed the top-level VNodes in the order they appear.

```js
import { eachChild } from 'vnode-util'
// Inside a render function
const children = slots.default?.() ?? []
eachChild(children, (vnode) => {
  console.log(vnode.type)
})
```

Just like the array methods...

* `eachChild()` will ignore the value returned by the callback. When iteration is complete it returns `undefined`.

* `everyChild()` will stop iterating if the callback returns a falsy value. When iteration is complete it returns either `true` or `false`.

* `findChild()` will stop iterating if the callback returns a truthy value and return the corresponding VNode.

* `someChild()` will stop iterating if the callback returns a truthy value. When iteration is complete it returns either `true` or `false`.

The array of children does not necessarily need to contain fully instantiated VNodes. For example, text nodes can be represented as just strings and fragments can be arrays. This is consistent with how Vue handles the children passed to `h`, and how it handles values returned from render functions or within slot functions. If you obtained your array of children by calling a slot function then Vue will have already promoted the children to full VNodes, but the iterators don't require that.

The iterator callback will be passed a fully instantiated VNode, even if the original child array contained some other representation of the child. This is a design choice. `vnode-util` aims to remove the burden of worrying about the various edge cases, but here we have to pick between two different edge cases. The callbacks only need to worry about handling full VNodes, but the tradeoff is that that exact VNode may not be in the original array. In practice, this should only affect text and comment nodes, and only in cases where they haven't come from a slot function.

Fragment nodes are never passed to the iterator callback. Instead, the iterator will iterate through the children of the fragment. The iterators do not walk the children of any other node type, just fragments. They are only attempting to iterate what would generally be considered the 'top-level' VNodes.

The optional third argument for each iterator is an object containing [iteration options](/api.html#iterationoptions). The iterators will usually pass all node types to the callback, but the options can be used to restrict iteration to specific types of node. The available node types are `component`, `element`, `text`, `comment` and `static`.
So if we only want to iterate over `text` nodes we can pass `{ text: true }` as the third argument.
There are constants available for the most common combinations: `ALL_VNODES`, `SKIP_COMMENTS` and `COMPONENTS_AND_ELEMENTS`. The iterators all default to `ALL_VNODES`.

The following example defines a functional component that counts the number of children in its slot. The count is displayed above the list and the wrapper `<ul>` element is not rendered if there are no children:

```js
import { h } from 'vue'
import { eachChild, SKIP_COMMENTS } from 'vnode-util'
function ChildComponent(_, { slots }) {
  const children = slots.default?.() ?? []
  let count = 0
  eachChild(children, () => count++, SKIP_COMMENTS)
  return h('div', [
    h('div', `Child count: ${count}`),
    count ? h('ul', children) : null
  ])
}
```

The example uses `SKIP_COMMENTS` to skip over the comment nodes created by the falsy `v-if` conditions.
While this example needs to display the count, a more common scenario involves only needing to know whether the count is 0. The [`isEmpty()`](/api.html#isempty) helper can be used in that case.

It is worth noting that the count here is just a count of the VNodes. It is not necessarily an accurate count of the number of `<li>` elements. If any of the children had been a component it would have added 1 to the count, even though a component wouldn't necessarily render exactly one `<li>` element.
