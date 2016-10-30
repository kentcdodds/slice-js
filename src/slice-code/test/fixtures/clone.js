export default clone

function clone(item) {
  if (!item) {
    return item
  }
  const type = typeof item
  const string = Object.prototype.toString.call(item)
  const isPrimitive = type !== "object" && type !== "function"
  let result = item

  if (!isPrimitive) {
      if (string === '[object Array]') {
      result = []
      item.forEach((child, index, array) => {
        result[index] = clone(child)
      })
    } else if (type === 'object') {
      if (item.nodeType && typeof item.cloneNode == 'function') {
        result = item.cloneNode(true)
      } else if (!item.prototype) {
        if (string === '[object Date]') {
          result = new Date(item)
        } else {
          result = {}
          for (const i in item) {
            result[i] = clone(item[i])
          }
        }
      } else {
        if (false && item.constructor) {
          result = new item.constructor()
        } else {
          result = item
        }
      }
    }
  }

  return result
}
