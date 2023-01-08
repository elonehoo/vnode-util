# Adding props

VNode props can be used for a variety of purposes:

* Passing component props.
* Passing component event listeners.
* Setting HTML element attributes.
* Setting HTML element properties.
* Adding HTML element event listeners.

There are also the special props `ref` and `key`.

Calling a slot function will yield an array of VNodes. If we wish to add extra VNode props to the 'top-level' VNodes then we can use `addProps`.

This example will add the CSS class `my-child` to each of the VNodes:

```js
import { addProps } from 'vnode-util'
// Inside a render function
const children = slots.default?.() ?? []
const newChildren = addProps(children, (vnode) => {
  return {
    class: 'my-child'
  }
})
```

`addProps()` behaves much like the iterator functions discussed previously, skipping over fragments and walking their children instead. Text nodes and comment nodes are also skipped by default as they don't have props. The callback will be invoked for nodes corresponding to elements or components, with the node being passed to the callback as the first argument. In the example above the VNode isn't used by the callback, it just returns an object containing the props to add.
`vnode-util` will use [`cloneVNode()`](https://vuejs.org/api/render-function.html#clonevnode) to take copies of any VNodes that are modified, leaving the original tree unchanged.
VNodes represent event listeners using props that begin with `on`, followed by the event name in PascalCase. So, for example, a listener for the event `update:modelValue` can be added using the prop `onUpdate:modelValue`.
```js
import { addProps } from 'vnode-util'
// Inside a render function
const children = slots.default?.() || []
const newChildren = addProps(children, (vnode) => {
  return {
    'onUpdate:modelValue'(newValue) {
      console.log(`update: ${newValue}`)
    }
  }
})
```
Added props will be merged using [`mergeProps()`](https://vuejs.org/api/render-function.html#mergeprops), with special handling for event listeners, `class` and `style`. Likewise, if the props include a `ref` property it will be added to any existing `ref`, rather than replacing it.
