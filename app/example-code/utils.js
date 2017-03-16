export {deepFreeze, clone}

function deepFreeze(o) {
  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop])
    }
  })

  return o
}

function clone(item) {
  /* eslint complexity:[2, 11] max-depth:[2, 6] */
  if (!item) {
    return item
  }
  const type = typeof item
  const string = Object.prototype.toString.call(item)
  const isPrimitive = type !== 'object' && type !== 'function'
  let result = item

  if (!isPrimitive) {
    if (string === '[object Array]') {
      result = []
      item.forEach((child, index) => {
        result[index] = clone(child)
      })
    } else if (type === 'object') {
      if (item.nodeType && typeof item.cloneNode === 'function') {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        if (string === '[object Date]') {
          result = new Date(item)
        } else {
          result = {}
          for (const i in item) {
            if (item.hasOwnProperty(i)) {
              result[i] = clone(item[i])
            }
          }
        }
      } else if (item.constructor) {
        result = new item.constructor()
      } else {
        result = item
      }
    }
  }

  return result
}
