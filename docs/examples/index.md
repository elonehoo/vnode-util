<script setup>
import AddClass from './AddClass.vue'
import BasicAccordionExamples from './BasicAccordionExamples.vue'
import WrapChildren from './WrapChildren.vue'
import Separators from './Separators.vue'
import EmptyList from './EmptyList.vue'
import AddSlotRef from './AddSlotRef.vue'
import AddSlotRefs from './AddSlotRefs.vue'
</script>

# Examples Reference

`vnode-util` are intended to manipulate VNodes in `render` functions, so the examples below are all using `render` functions instead of templates. `<script setup>` doesn't support `render` functions, but they can be written in various other ways:

```js
export default {
  render() {
    // Options API render function
  }
}
```

```js
export default {
  setup() {
    return () => {
      // Composition API render function
    }
  }
}
```

```js
export default () => {
  // Functional components are just a render function
}
```

The examples use functional components where possible.

Templates are used for components that don't use `vnode-util` directly, as those don't need to use `render` functions.

## Adding a class

Props can be added to child VNodes using `addProps`. For a `class` prop this will be additive, it won't remove any other classes that are already included.

In the example below, the `<add-outline>` component adds the class `child-outline` to each of its children. This class applies the border and spacing seen in the live demo.

<<< @/examples/add-outline.js

Usage:

<<< @/examples/AddClass.vue

<style>
.child-outline {
  border: 1px solid #777;
  padding: 5px;
}

.child-outline + .child-outline {
  margin-top: 10px;
}
</style>

<live-example>
  <AddClass />
</live-example>

## Adding component v-model

`addProps` can also be used to add the prop/event pair used for `v-model`. Here we'll use it to implement an accordion component.

:::tip
This functionality would be better implemented using `provide` and `inject`.
:::

The intended usage is something like this:

<<< @/examples/BasicAccordionExamples.vue

First we'll need a `<basic-accordion-panel>` component. It implements an `expanded` prop and `update:expanded` event, consistent with `v-model:expanded`:

<<< @/examples/BasicAccordionPanel.vue

The `<basic-accordion>` might then be implemented something like this, using `addProps` to add the prop and event:

<<< @/examples/BasicAccordion.vue

This implementation is very naive and is only intended to demonstrate the basic idea of how this component might be implemented using VNode manipulation.

All of which gives:

<live-example>
  <BasicAccordionExamples />
</live-example>

## Wrap children

We can use the `replaceChildren` helper to wrap each child node in an extra `<div>`:

<<< @/examples/WrappingList.vue

This might then be used something like this:

<<< @/examples/WrapChildren.vue

<live-example>
  <WrapChildren />
</live-example>

## Inserting between children

The `betweenChildren` helper can be used to insert separators between children. For example:

<<< @/examples/insert-separators.js

With usage:

<<< @/examples/Separators.vue

<style>
.hr-example hr {
  border-top-color: #777;
  border-top-width: 2px;
}
</style>

<live-example class="hr-example">
  <Separators />
</live-example>

## Checking for empty content

The `isEmpty` helper can help to check whether the child VNodes are empty. Fragment nodes aren't counted as content, neither are comments nor strings of collapsible whitespace.

<<< @/examples/results-list.js

Example usage, with an empty list followed by a non-empty list:

<<< @/examples/EmptyList.vue

<live-example>
  <EmptyList />
</live-example>

## Adding a `ref` to a slot

Adding a 'template ref' to slot content can be a bit tricky. A common trick is to add the `ref` attribute to a surrounding element and then walk the DOM tree to access the relevant element. But that only works if there is a surrounding element in the relevant component, and it also only allows access to elements, not components.

There are a number of ways we might attempt to implement something like this with `vue-vnode-utils`.

Let's assume our component only allows a single child inside the slot, a bit like a `<Transition>` component. Let's further assume that we want to skip fragment nodes, comments and empty text nodes. We could use `extractSingleChild()`, which will pull out a single element or component node, with a console warning if multiple nodes are found.

<<< @/examples/add-ref.js

The example is using `outerHTML` during rendering, which is only there so we can see the contents of the `ref`. Something like that should not appear in real code.

Usage might look something like this:

<<< @/examples/AddSlotRef.vue

This example is a bit silly, because in practice you're very unlikely to use a `v-for` in a scenario where only one node can be rendered. But it shows how `extractSingleChild()` successfully negotiates the `v-for` fragments and `v-if` comment nodes.

One quirk of this example is the position of the `key`. There's no benefit in having a `key` on the nodes we discard, as they'll never make it to the patching process anyway. Instead, we need the `key` to be placed on the `<div>` VNode that we keep. This will ensure that the `<div>` DOM nodes are not reused for different items, updating the `ref` on each rendering update.

In a real use case we'd probably be fine with reusing the same `<div>`, so the `key` could be omitted.

<style>
.button-example button {
  background-color: #ccc;
  border: 1px solid #777;
  border-radius: 3px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);
  color: #000;
  padding: 2px 5px;
}
</style>

<live-example class="button-example">
  <AddSlotRef />
</live-example>

Another way we might approach this is using `addProps()`. This could be used to add a `ref` to a single node, like in the previous example, or it could handle the more general case with multiple top-level nodes:

<<< @/examples/add-multiple-refs.js

As with the previous example, this example contains a circularity because it is rendering the `outerHTML` of the `ref` elements, but that's just for demo purposes and in real code you would do whatever you need to do with the elements/components, not just dump out their `outerHTML`.

Usage might be something like this:

<<< @/examples/AddSlotRefs.vue

All of which gives:

<live-example class="button-example">
  <client-only>
    <AddSlotRefs />
  </client-only>
</live-example>
