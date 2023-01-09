---
layout: home
sidebar: false

title: vnode-util
titleTemplate: Utilities for manipulating Vue 3 VNodes

hero:
    name: vnode-util
    text: Helper functions for working with Vue 3 VNodes
    tagline: Smoothing over the edge cases for working with the VNodes returned by a slot
    image:
      src: /logo.svg
      alt: vnode-util
    actions:
      - theme: brand
        text: Get Started
        link: /guide/
      - theme: alt
        text: Why vnode-util?
        link: /guide/why
      - theme: alt
        text: Playground
        link: https://stackblitz.com/edit/vnode-util?file=src/App.vue
      - theme: alt
        text: View on GitHub
        link: https://github.com/elonehoo/vue-hooks-form
features:
  - title: Fragment-aware iteration
    details: Walk slot VNodes without worrying about fragments created by v-for.
  - title: Add props
    details: Add extra props, CSS classes, events and refs to slot contents.
  - title: Edit the VNode tree
    details: Remove existing nodes, wrap them with other nodes, or insert new nodes into the VNode tree.
  - title: Small and tree-shakable
    details: The library is already small, but the helpers are also highly tree-shakable, reducing the size even further.
  - title: Type safe
    details: A fully typed API, building on the core Vue types.
  - title: Probably not a good idea
    details: But if you really have to manipulate VNodes, a library to smooth over the edge cases makes it less likely to go wrong.
---
