Rete.js Scopes plugin
====
[![Made in Ukraine](https://img.shields.io/badge/made_in-ukraine-ffd700.svg?labelColor=0057b7)](https://stand-with-ukraine.pp.ua)
[![Discord](https://img.shields.io/discord/1081223198055604244?color=%237289da&label=Discord)](https://discord.gg/cxSFkPZdsV)

**Rete.js advanced plugin**

## Key features

- **Nested nodes**: nodes may have parent nodes at one or more levels of depth
- **Drag-and-drop nesting**: user can easily re-organize nodes by drag-and-drop them to different parent nodes
- **Presets**: predefined configuration for nesting nodes by drag and drop or other methods
  -  **Classic**: assigning nodes by long-pressing a node and releasing over the parent node

## Getting Started

Please refer to the [guide](https://retejs.org/docs/guides/scopes) and [example](https://retejs.org/examples/scopes) using this plugin

## Contribution

Please refer to the [Contribution](https://retejs.org/docs/contribution) guide

## License

[CC BY-NC-SA 4.0](./LICENSE)

## 修改目标
该库在解决一些问题时，存在缺陷，为此目标产生了本个fork。

## CHANGELOG
### 24.4.23 解决即使提供了exclude方法，但是节点仍然可以被添加进被exclude的节点中的问题
通过这个修改，在传入exclude方法后，不能被添加子元素的node将不再对长按拖放做出视觉和逻辑响应
### 24.4.24 exclude方法在该插件中本身有其他用途，将我们之前写的exclude改为elder
修改了之前exclude逻辑修改造成的父级尺寸计算的错误