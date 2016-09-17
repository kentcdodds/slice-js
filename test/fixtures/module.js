/*
 * this file may seem odd, but trust me, this is intended to help
 * ensure we're developing a good slice, not to have a good math
 * module :)
 */
export {sum, subtract, multiply, divide, isGreaterThan, isFooOrBar}

function sum(a, b) {
  return a + b
}

function subtract(a, b) {
  return sum(a, -b)
}

function multiply(a, b) {
  let product, i
  product = 0
  for (i = 0; i < b; i++) {
    product = sum(product, a)
  }
  return product
}

function divide(a, b) {
  return a / b
}

function isGreaterThan(a, b) {
  if (a > b) {
    return true
  } else if (b > a) {
    return false
  } else {
    return null
  }
}

function isFooOrBar(a) {
  /* eslint no-nested-ternary:0, no-unneeded-ternary:0 */
  return a === 'foo' ? true : a === 'bar' ? true : false
}
