import type { Component, ComponentOptions, FunctionalComponent, VNode, VNodeArrayChildren, VNodeChild } from 'vue'
import process from 'node:process'
import {
  cloneVNode,
  Comment,

  createCommentVNode,
  createTextVNode,
  Fragment,

  isVNode,
  Static,
  Text,

} from 'vue'

const DEV = process.env.NODE_ENV !== 'production'

export function isComment(vnode: unknown): vnode is (null | undefined | boolean | (VNode & { type: Comment })) {
  return getType(vnode) === 'comment'
}

export function isComponent(vnode: unknown): vnode is (VNode & { type: Component }) {
  return getType(vnode) === 'component'
}

export function isElement(vnode: unknown): vnode is (VNode & { type: string }) {
  return getType(vnode) === 'element'
}

export function isFragment(vnode: unknown): vnode is ((VNode & { type: typeof Fragment }) | VNodeArrayChildren) {
  return getType(vnode) === 'fragment'
}

export function isFunctionalComponent(vnode: unknown): vnode is (VNode & { type: FunctionalComponent }) {
  return isComponent(vnode) && typeof vnode.type === 'function'
}

export function isStatefulComponent(vnode: unknown): vnode is (VNode & { type: ComponentOptions }) {
  return isComponent(vnode) && typeof vnode.type === 'object'
}

export function isStatic(vnode: unknown): vnode is (VNode & { type: typeof Static }) {
  return getType(vnode) === 'static'
}

export function isText(vnode: unknown): vnode is (string | number | (VNode & { type: Text })) {
  return getType(vnode) === 'text'
}

export function getText(vnode: VNode | string | number): string | undefined {
  if (typeof vnode === 'string')
    return vnode

  if (typeof vnode === 'number')
    return String(vnode)

  if (isVNode(vnode) && vnode.type === Text)
    return String(vnode.children)

  return undefined
}

type ValueTypes = 'string' | 'number' | 'boolean' | 'undefined' | 'symbol' | 'bigint' | 'object' | 'function' | 'array' | 'date' | 'regexp' | 'vnode' | 'null'

function typeOf(value: unknown) {
  let t: ValueTypes = typeof value

  if (t === 'object') {
    if (value === null)
      t = 'null'
    else if (Array.isArray(value))
      t = 'array'
    else if (isVNode(value))
      t = 'vnode'
    else if (value instanceof Date)
      t = 'date'
    else if (value instanceof RegExp)
      t = 'regexp'
  }

  return t
}

function warn(method: string, msg: string) {
  console.warn(`[${method}] ${msg}`)
}

function checkArguments(method: string, passed: unknown[], expected: string[]) {
  for (let index = 0; index < passed.length; ++index) {
    const t = typeOf(passed[index])
    const expect = expected[index]

    if (expect !== t)
      warn(method, `Argument ${index + 1} was ${t}, should be ${expect}`)
  }
}

export function getType(vnode: unknown) {
  const typeofVNode = typeof vnode

  if (vnode == null || typeofVNode === 'boolean')
    return 'comment'
  else if (typeofVNode === 'string' || typeofVNode === 'number')
    return 'text'
  else if (Array.isArray(vnode))
    return 'fragment'

  if (isVNode(vnode)) {
    const { type } = vnode
    const typeofType = typeof type

    if (typeofType === 'symbol') {
      if (type === Fragment)
        return 'fragment'
      else if (type === Text)
        return 'text'
      else if (type === Comment)
        return 'comment'
      else if (type === Static)
        return 'static'
    }
    else if (typeofType === 'string') {
      return 'element'
    }
    else if (typeofType === 'object' || typeofType === 'function') {
      return 'component'
    }
  }

  return undefined
}

function isEmptyObject(obj: Record<string, unknown>) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key))
      return false
  }
  return true
}

function getFragmentChildren(fragmentVNode: VNode | VNodeArrayChildren): VNodeArrayChildren {
  if (Array.isArray(fragmentVNode))
    return fragmentVNode

  const { children } = fragmentVNode

  if (Array.isArray(children))
    return children

  if (DEV)
    warn('getFragmentChildren', `Unknown children for fragment: ${typeOf(children)}`)

  return []
}

export interface IterationOptions {
  element?: boolean
  component?: boolean
  comment?: boolean
  text?: boolean
  static?: boolean
}

// esbuild can remove an identity function, so long as it uses a function declaration
function freeze<T>(obj: T): T {
  if (DEV)
    return Object.freeze(obj)

  return obj
}

export const COMPONENTS_AND_ELEMENTS: IterationOptions = /* #__PURE__ */ freeze({
  element: true,
  component: true,
})

export const SKIP_COMMENTS: IterationOptions = /* #__PURE__ */ freeze({
  element: true,
  component: true,
  text: true,
  static: true,
})

export const ALL_VNODES: IterationOptions = /* #__PURE__ */ freeze({
  element: true,
  component: true,
  text: true,
  static: true,
  comment: true,
})

function promoteToVNode(node: any, options: IterationOptions): VNode | null {
  const type = getType(node)

  // In practice, we don't call this function for fragments, but TS gets unhappy if we don't handle it
  if (!type || type === 'fragment' || !options[type])
    return null

  if (isVNode(node))
    return node

  if (type === 'text')
    return createTextVNode(getText(node as (string | number)))

  return createCommentVNode()
}

export function addProps(children: VNodeArrayChildren, callback: (vnode: VNode) => (Record<string, unknown> | null | void), options: IterationOptions = COMPONENTS_AND_ELEMENTS): VNodeArrayChildren {
  if (DEV)
    checkArguments('addProps', [children, callback, options], ['array', 'function', 'object'])

  // @ts-expect-error error
  return replaceChildrenInternal(children, (vnode) => {
    const props = callback(vnode)

    if (DEV) {
      const typeofProps = typeOf(props)

      if (!['object', 'null', 'undefined'].includes(typeofProps))
        warn('addProps', `Callback returned unexpected ${typeofProps}: ${String(props)}`)
    }

    if (props && !isEmptyObject(props))
      return cloneVNode(vnode, props, true)
  }, options)
}

export function replaceChildren(children: VNodeArrayChildren, callback: (vnode: VNode) => (VNode | VNodeArrayChildren | string | number | void), options: IterationOptions = SKIP_COMMENTS): VNodeArrayChildren {
  if (DEV)
    checkArguments('replaceChildren', [children, callback, options], ['array', 'function', 'object'])

  return replaceChildrenInternal(children, callback, options)
}

function replaceChildrenInternal(children: VNodeArrayChildren, callback: (vnode: VNode) => (VNode | VNodeArrayChildren | string | number | void), options: IterationOptions): VNodeArrayChildren {
  let nc: VNodeArrayChildren | null = null

  for (let index = 0; index < children.length; ++index) {
    const child = children[index]

    if (isFragment(child)) {
      const oldFragmentChildren = getFragmentChildren(child)
      const newFragmentChildren = replaceChildrenInternal(oldFragmentChildren, callback, options)

      let newChild: VNodeChild = child

      if (oldFragmentChildren !== newFragmentChildren) {
        nc ??= children.slice(0, index)

        if (Array.isArray(child)) {
          newChild = newFragmentChildren
        }
        else {
          newChild = cloneVNode(child)

          newChild.children = newFragmentChildren
        }
      }

      nc && nc.push(newChild)
    }
    else {
      const vnode = promoteToVNode(child, options)

      if (vnode) {
        const newNodes = callback(vnode) ?? vnode

        if (DEV) {
          const typeOfNewNodes = typeOf(newNodes)

          if (!['array', 'vnode', 'string', 'number', 'undefined'].includes(typeOfNewNodes))
            warn('replaceChildren', `Callback returned unexpected ${typeOfNewNodes} ${String(newNodes)}`)
        }

        if (newNodes !== child)
          nc ??= children.slice(0, index)

        if (Array.isArray(newNodes))
          nc && nc.push(...newNodes)
        else
          nc && nc.push(newNodes)
      }
      else {
        nc && nc.push(child)
      }
    }
  }

  return nc ?? children
}

export function betweenChildren(children: VNodeArrayChildren, callback: (previousVNode: VNode, nextVNode: VNode) => (VNode | VNodeArrayChildren | string | number | void), options: IterationOptions = SKIP_COMMENTS): VNodeArrayChildren {
  if (DEV)
    checkArguments('betweenChildren', [children, callback, options], ['array', 'function', 'object'])

  let previousVNode: VNode | null = null

  return replaceChildrenInternal(children, (vnode) => {
    let insertedNodes: VNode | VNodeArrayChildren | string | number | void = ''

    if (previousVNode) {
      insertedNodes = callback(previousVNode, vnode)

      if (DEV) {
        const typeOfInsertedNodes = typeOf(insertedNodes)

        if (!['array', 'vnode', 'string', 'number', 'undefined'].includes(typeOfInsertedNodes))
          warn('betweenChildren', `Callback returned unexpected ${typeOfInsertedNodes} ${String(insertedNodes)}`)
      }
    }

    previousVNode = vnode

    if (insertedNodes == null || (Array.isArray(insertedNodes) && insertedNodes.length === 0))
      return

    if (Array.isArray(insertedNodes))
      return [...insertedNodes, vnode]

    return [insertedNodes, vnode]
  }, options)
}

export function someChild(children: VNodeArrayChildren, callback: (vnode: VNode) => unknown, options: IterationOptions = ALL_VNODES): boolean {
  if (DEV)
    checkArguments('someChild', [children, callback, options], ['array', 'function', 'object'])

  return someChildInternal(children, callback, options)
}

function someChildInternal(children: VNodeArrayChildren, callback: (vnode: VNode) => unknown, options: IterationOptions): boolean {
  for (const child of children) {
    if (isFragment(child)) {
      if (someChild(getFragmentChildren(child), callback, options))
        return true
    }
    else {
      const vnode = promoteToVNode(child, options)

      if (vnode && callback(vnode))
        return true
    }
  }

  return false
}

export function everyChild(children: VNodeArrayChildren, callback: (vnode: VNode) => unknown, options: IterationOptions = ALL_VNODES): boolean {
  if (DEV)
    checkArguments('everyChild', [children, callback, options], ['array', 'function', 'object'])

  return !someChildInternal(children, vnode => !callback(vnode), options)
}

export function eachChild(children: VNodeArrayChildren, callback: (vnode: VNode) => void, options: IterationOptions = ALL_VNODES): void {
  if (DEV)
    checkArguments('eachChild', [children, callback, options], ['array', 'function', 'object'])

  someChildInternal(children, (vnode) => {
    callback(vnode)
  }, options)
}

export function findChild(children: VNodeArrayChildren, callback: (vnode: VNode) => unknown, options: IterationOptions = ALL_VNODES): (VNode | undefined) {
  if (DEV)
    checkArguments('findChild', [children, callback, options], ['array', 'function', 'object'])

  let node: VNode | undefined

  // @ts-expect-error error
  someChildInternal(children, (vnode) => {
    if (callback(vnode)) {
      node = vnode
      return true
    }
  }, options)

  return node
}

const COLLAPSIBLE_WHITESPACE_RE = /\S|\u00A0/

export function isEmpty(children: VNodeArrayChildren): boolean {
  if (DEV)
    checkArguments('isEmpty', [children], ['array'])

  return !someChildInternal(children, (vnode) => {
    if (isText(vnode)) {
      const text = getText(vnode) || ''

      return COLLAPSIBLE_WHITESPACE_RE.test(text)
    }

    return true
  }, SKIP_COMMENTS)
}

export function extractSingleChild(children: VNodeArrayChildren): VNode | undefined {
  if (DEV)
    checkArguments('extractSingleChild', [children], ['array'])

  const node = findChild(children, () => {
    return true
  }, COMPONENTS_AND_ELEMENTS)

  if (DEV) {
    // @ts-expect-error error
    someChildInternal(children, (vnode) => {
      let warning = ''

      // The equality check is valid here as matching nodes can't come from promotions
      if (vnode === node)
        return false

      if (isElement(vnode) || isComponent(vnode)) {
        warning = 'Multiple root nodes found, only one expected'
      }
      else if (isText(vnode)) {
        const text = getText(vnode) || ''

        if (COLLAPSIBLE_WHITESPACE_RE.test(text))
          warning = `Non-empty text node:\n'${text}'`
      }
      else {
        warning = `Encountered unexpected ${getType(vnode)} VNode`
      }

      if (warning) {
        warn('extractSingleChild', warning)
        return true
      }
    }, SKIP_COMMENTS)
  }

  return node
}
