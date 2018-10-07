import TemplateRenderer from '../Template.js'
import ElementRenderer from './Element.js'
import VoidRenderer from './Void.js'

import LoopDirective from '../loop/Loop.js'

import { isTextNode, isElementNode } from '../../utils/type-check.js'
import { flatChildren } from '../../utils/generic.js'

export default class ChildrenRenderer {
  constructor (children, scope, isolated) {
    this.children = Array.from(children)
    this.scope = scope
    this.isolated = isolated

    /**
     * Resolve children renderers
     */
    this.renderers = []

    // Attach children
    this._init()
  }

  _init () {
    for (const child of this.children) {

      // 1. Check {{ interpolation }}
      if (isTextNode(child) && TemplateRenderer.is(child)) {
        this.renderers.push(new TemplateRenderer(child, this))

      // 2. Element binding
      } else if (isElementNode(child)) {

        // The loop directive is resolved as a child
        if (LoopDirective.is(child)) {
          this.renderers.push(new LoopDirective(child, this))
        } else {
          const element = new (child.childNodes.length ? ElementRenderer : VoidRenderer)(child, this.scope, this.isolated)

          // Only consider a render element if its childs
          // or attributes has something to bind/update
          if (element.isRenderable) {
            this.renderers.push(...(element.isFlattenable ? flatChildren(element) : [element]))
          }
        }
      }

      // ... ignore comment nodes
    }
  }

  render () {
    for (const renderer of this.renderers) {
      renderer.render()
    }
  }
}
