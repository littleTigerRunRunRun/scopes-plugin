import { NodeEditor, NodeId, Root, Scope } from 'rete'
import { BaseArea, BaseAreaPlugin } from 'rete-area-plugin'

import { Scopes } from '..'
import { ExpectedScheme, Padding, Size } from '../types'
import { Translate } from '../utils'

export type AgentContext<T> = {
  editor: NodeEditor<ExpectedScheme>
  area: BaseAreaPlugin<ExpectedScheme, BaseArea<ExpectedScheme> | T>
  scopes: Scope<Scopes, [BaseArea<ExpectedScheme>, Root<ExpectedScheme>]>
}
export type AgentParams = {
  padding: (id: NodeId) => Padding,
  size: (id: NodeId, size: Size) => Size,
  exclude: (id: NodeId) => boolean,
  elder: (id: NodeId) => boolean,
  translate: Translate
}

export type ScopeAgent = <T>(params: AgentParams, context: AgentContext<T>) => void
