import { NodeId } from 'rete'

import { getPickedNodes } from '../..'
import { reassignParent } from '../../scope'
import { Position } from '../../types'
import { AgentContext, AgentParams, ScopeAgent } from '../types'

export type DefaultScopesAgentParams = AgentParams & {
  timeout?: number
}

export const useScopeAgent: ScopeAgent = (params: DefaultScopesAgentParams, { area, editor, scopes }) => {
  const timeout = params.timeout || 250

  let picked: { timeout: number } | null = null
  let candidates: string[] = []

  function cancel() {
    if (picked) {
      window.clearTimeout(picked.timeout)
      picked = null
    }
  }

  function pick(id: NodeId) {
    const timeoutId = window.setTimeout(() => {
      const selected = editor.getNodes().filter(n => n.selected)
      const targets = selected.length ? selected.map(n => n.id) : [id]

      candidates.push(...targets)
      scopes.emit({ type: 'scopepicked', data: { ids: targets } })
    }, timeout)

    picked = { timeout: timeoutId }
  }
  function release() {
    const list = [...candidates]

    cancel()
    candidates = []

    scopes.emit({ type: 'scopereleased', data: { ids: list } })

    return list
  }

  area.addPipe(async context => {
    if (!(context instanceof Object) || !('type' in context)) return context
    if (context.type === 'nodepicked') {
      pick(context.data.id)
    }
    if (context.type === 'nodetranslated') {
      cancel()
    }
    if (context.type === 'nodedragged') {
      const { pointer } = area.area
      const ids = release()

      if (ids.length === 0) return

      await reassignParent(ids, pointer, params, { area, editor })
    }
    return context
  })
}

export function useVisualEffects<T>(params: DefaultScopesAgentParams, { area, editor, scopes }: AgentContext<T>): void {
  const pickedNodes = getPickedNodes(scopes)
  let previousHighlighted: string | null = null
  let clientPointerPostion: Position | null = null

  // eslint-disable-next-line max-statements
  function updateHighlightedScopes(position: { x: number, y: number }, nodes: NodeId[]) {
    // 如果先前有高亮对象，先取消其高亮
    if (previousHighlighted) {
      const view = area.nodeViews.get(previousHighlighted)

      if (view && nodes.length) view.element.style.opacity = '0.4'
      previousHighlighted = null
    }
    if (nodes.length) {
      const { x, y } = position
      const elements = document.elementsFromPoint(x, y)
      const nodeViews = editor.getNodes().filter(node => {
        return params.elder(node.id)
      }).map(node => {
        const view = area.nodeViews.get(node.id)

        if (!view) throw new Error('view')

        return {
          node,
          view
        }
      })

      const intersectedNodes = elements
        .map(el => nodeViews.find(item => item.view.element === el))
        .filter((item): item is Exclude<typeof item, undefined> => Boolean(item))

      const nonSelected = intersectedNodes
        .filter(item => !item.node.selected)
      // 从交互点出发，找到画布中交互点位置上的节点们，然后和画布中记录的节点做比对，找出交叉内容，之后剔除选中（正在拖拽的）的内容后，第一个交互点就是会进行拖入操作的。
      const first = nonSelected[0]

      if (first) {
        first.view.element.style.opacity = '0.8'
        previousHighlighted = first.node.id
      }
    }
  }
  // eslint-disable-next-line max-statements
  scopes.addPipe(context => {
    if (context.type === 'scopepicked') {
      const { ids } = context.data

      // 未选中的节点统统改为虚化（opacity=0.4)
      editor.getNodes().filter(n => !ids.includes(n.id)).forEach(node => {
        const view = area.nodeViews.get(node.id)

        if (view) view.element.style.opacity = '0.4'
      })
      if (clientPointerPostion) {
        updateHighlightedScopes(clientPointerPostion, pickedNodes)
      }
    }
    if (context.type === 'scopereleased') {
      const { ids } = context.data

      // 未选中的节点统统解除虚化（opacity='')
      editor.getNodes().filter(n => !ids.includes(n.id)).forEach(node => {
        const view = area.nodeViews.get(node.id)

        if (view) view.element.style.opacity = ''
      })
      if (clientPointerPostion) {
        updateHighlightedScopes(clientPointerPostion, pickedNodes)
      }
    }
    if (context.type === 'pointermove') {
      clientPointerPostion = {
        x: context.data.event.clientX,
        y: context.data.event.clientY
      }
      updateHighlightedScopes(clientPointerPostion, pickedNodes)
    }
    return context
  })
}
