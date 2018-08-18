import { CustomRenderer, CustomVoidRenderer } from '../../renderers/element/Custom.js'
import ElementRenderer from '../../renderers/element/Element.js'

import { isGalaxyElement } from '../../utils/type-check.js'
import { newIsolated } from '../../utils/generic.js'

export default class ItemRenderer {
  constructor (template, context, isolated) {
    const Renderer = ItemRenderer.getRenderer(template)

    this.renderer = new Renderer(
      template.cloneNode(true),
      context.scope,
      newIsolated(context.isolated, isolated)
    )

    this.reused = false
  }

  static getRenderer (template) {
    return isGalaxyElement(template)
      ? (CustomVoidRenderer.is(template) ? CustomVoidRenderer : CustomRenderer)
      : ElementRenderer
  }

  get key () {
    return this.renderer.bindings.by
  }

  get next () {
    return this.renderer.element.nextSibling
  }

  by (isolated) {
    return this.key.getter(isolated)
  }

  update (isolated) {
    this.reused = true

    Object.assign(this.renderer.isolated, isolated)
  }

  insert (item) {
    item.parentNode.insertBefore(this.renderer.element, item)
  }

  remove () {
    this.renderer.element.remove()
  }

  render () {
    this.renderer.render()
  }
}