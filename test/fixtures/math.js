/*
 * this file may seem odd, but trust me, this is intended to help
 * ensure we're developing a good slice, not to have a good math
 * module :)
 */
export {sum, subtract, multiply, divide, randomBool}

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

function randomBool() {
  if (Math.random() > 0.5) {
    return true
  } else {
    return false
  }
}
