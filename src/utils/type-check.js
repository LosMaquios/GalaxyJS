export const { isArray } = Array

export function isNumber (value) {
  return typeof value === 'number'
}

export function isString (value) {
  return typeof value === 'string'
}

export function isArrayLike (value) {
  return isObject(value) && isNumber(value.length)
}

export function isSet (value) {
  return value instanceof Set
}

export function isMap (value) {
  return value instanceof Map
}

export function isObject (value) {
  return value !== null && typeof value === 'object'
}

export function isTextNode (node) {
  return node.nodeType === Node.TEXT_NODE
}

export function isElementNode (node) {
  return node.nodeType === Node.ELEMENT_NODE
}

export function isFunction (value) {
  return typeof value === 'function'
}

export function isDefined (value) {
  return value != null
}

export function isReserved (name) {
  return name.startsWith('$') || name.startsWith('_')
}

export function isPlaceholder (element) {
  return element instanceof HTMLTemplateElement
}

export function isGalaxyElement (element) {
  return !!element.$galaxy
}
