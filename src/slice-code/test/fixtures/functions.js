export {sum, subtract, multiply, divide}

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
