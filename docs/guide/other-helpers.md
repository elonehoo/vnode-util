# Other helpers

## Extracting a single child

Slots return an array of children, but some components only allow for one child in their slot, like Vue's built-in components `<KeepAlive>` and `<Transition>`. `extractSingleChild()` can be used to pull out a meaningful root node from a slot. It skips over fragments, comments and text nodes, trying to find a component or element node.

In development builds, `extractSingleChild()` will log warnings if it finds multiple eligible nodes. It'll also log warnings if it encounters text nodes, unless they only contain collapsible whitespace.

In the example below, the `<MeasureWidth>` component expects its slot to contain a single child, either an element or a component.

It'll extract that child, ignoring any comment nodes, then add a `ref` prop using `cloneVNode()`. Once the corresponding `ref` is populated it can then be used to track the width of the child.

```js
import { cloneVNode, h, ref } from 'vue'
import { extractSingleChild } from 'vnode-util'
import { useMeasureWidth } from './useMeasureWidth.js'
export default {
  setup(_, { slots }) {
    const elRef = ref(null)
    const { width } = useMeasureWidth(elRef)
    return () => {
      const slotVNodes = slots.default?.() ?? []
      const child = extractSingleChild(slotVNodes)
      const childWithRef = child && cloneVNode(child, { ref: elRef }, true)
      return h('div', [
        h('div', `Width: ${width.value}`),
        childWithRef
      ])
    }
  }
}
```

`extractSingleChild()` uses `findChild()` internally. If the exact criteria used to extract a child aren't what you want then you can implement an alternative using `findChild()` directly.

## Checking for an empty slot

Another common need is to detect whether a slot is empty.

In general this is very difficult. The definition of 'empty' is not at all clear.

The `isEmpty()` helper can be used to check an array of VNodes to determine whether they appear to be empty. Comments are considered empty, as are text nodes that only contain collapsible whitespace. Elements are not considered to be empty, nor are components. A component VNode might ultimately not create any DOM nodes, but that isn't taken into account. Nor is CSS, so `v-show` won't be factored in either.

```js
const slotVNodes = slots.default?.() ?? []
const empty = isEmpty(slotVNodes)
```

A common mistake is to call the slot function twice, once to pass to `isEmpty()` and then again to do the actual rendering. Don't do it. Everything should happen within the same invocation of the render function and the slot should only need to be called once to obtain the array of VNodes. You should also avoid caching the same VNodes across multiple renders, e.g. in a `computed` property.
If the definition of 'empty' is not quite what you need then you can implement an alternative using `someChild()`.
