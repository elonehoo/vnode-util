<div align="center">
  <img src="./public/logo.svg" wigth='100px' height='100px' />
</div>

<h1 align="center">
  vnode-util
</h1>

<p align="center">
Utilities for manipulating Vue 3 VNodes
<p>

<p align="center">
  <a href="https://www.npmjs.com/package/vnode-util"><img src="https://img.shields.io/npm/v/vnode-util?color=43B36B&label="></a>
<p>

<p align="center">
 <a href="https://vnode-util.elonehoo.me">Documentation</a> | <a href="https://vnode-util.elonehoo.me/guide/">Getting Started</a> | <a href="https://stackblitz.com/edit/vnode-util?file=src/App.vue">Playground</a>
</p>
<br>
<br>

## Features

- Walk slot VNodes without worrying about fragments created by v-for.
- Add extra props, CSS classes, events and refs to slot contents.
- Remove existing nodes, wrap them with other nodes, or insert new nodes into the VNode tree.
- The library is already small, but the helpers are also highly tree-shakable, reducing the size even further.
- A fully typed API, building on the core Vue types.
- But if you really have to manipulate VNodes, a library to smooth over the edge cases makes it less likely to go wrong.

```vue
<script>
import { h } from 'vue'
import { addProps, betweenChildren, isText, replaceChildren } from 'vnode-util'

export default {
  setup(_, { slots }) {
    return () => {
      let children = slots.default?.() ?? []

      // Wrap text nodes in a `<div>`
      children = replaceChildren(children, (vnode) => {
        if (isText(vnode))
          return h('div', vnode)

      })

      // Add the 'my-child' class to all children
      children = addProps(children, () => {
        return {
          class: 'my-child'
        }
      })

      // Insert the text 'then' between children
      children = betweenChildren(children, () => 'then')

      return h('div', children)
    }
  }
}
</script>

<style>
.my-child {
  border: 1px solid #000;
  margin: 5px 0;
  max-width: 200px;
  padding: 5px;
}
</style>
```

## License

[MIT](./LICENSE) License © 2023-Present [Elone Hoo](https://github.com/elonehoo)
