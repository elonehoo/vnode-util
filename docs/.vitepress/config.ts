import { defineConfig } from 'vitepress'
import { version } from '../../package.json'
import { description, discord, font, github, name, releases, twitter } from './meta'

export default defineConfig({
  lang: 'en-US',
  title: name,
  description,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:title', content: name }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { name: 'twitter:title', content: name }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['link', { href: font, rel: 'stylesheet' }],
    ['link', { rel: 'mask-icon', href: '/logo.svg', color: '#ffffff' }],
  ],
  lastUpdated: true,
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
  },
  themeConfig: {
    logo: '/logo.svg',
    editLink: {
      pattern: 'https://github.com/elonehoo/vnode-util/tree/main/docs/:path',
      text: 'Suggest changes to this page',
    },
    socialLinks: [
      { icon: 'twitter', link: twitter },
      { icon: 'discord', link: discord },
      { icon: 'github', link: github },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Elone Hoo',
    },
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Api', link: '/api/' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Appendices', link: '/appendices/some-notes-on-vnodes' },
      {
        text: `v${version}`,
        items: [
          {
            text: 'Release Notes ',
            link: releases,
          },
        ],
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Why vnode-util', link: '/guide/why' },
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Iterators', link: '/guide/iterators' },
            { text: 'Adding props', link: '/guide/adding-props' },
            { text: 'Inserting new nodes', link: '/guide/inserting-new-nodes' },
            { text: 'Replacing nodes', link: '/guide/replacing-nodes' },
            { text: 'Checking the VNode type', link: '/guide/checking-the-vnode-type' },
            { text: 'Other helpers', link: '/guide/other-helpers' },
          ],
        },
        {
          text: 'Api',
          items: [
            { text: 'Api Reference', link: '/api/' },
          ],
        },
        {
          text: 'Examples',
          items: [
            { text: 'Examples Reference', link: '/examples/' },
          ],
        },
        {
          text: 'Appendices',
          items: [
            { text: 'Some notes on VNodes', link: '/appendices/some-notes-on-vnodes' },
            { text: 'VNode manipulation and components', link: '/appendices/vnode-manipulation-and-components' },
          ],
        },
      ],
    },
  },
})
