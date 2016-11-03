# ultra-tree-shaking

Tree shaking is a super cool concept. Here's a basic example of tree shaking from Webpack or Rollup:

**math.js**

```javascript
export {doMath, sayMath}

const add = (a, b) => a + b
const subtract = (a, b) => a - b
const divide = (a, b) => a / b
const multiply = (a, b) => a * b

function doMath(a, b, operation) {
  switch (operation) {
    case 'add':
      return add(a, b)
    case 'subtract':
      return subtract(a, b)
    case 'divide':
      return divide(a, b)
    case 'multiply':
      return multiply(a, b)
    default:
      throw new Error(`Unsupported operation: ${operation}`)
  }
}

function sayMath() {
  return 'MATH!'
}
```

**app.js**

```javascript
import {doMath}
doMath(2, 3, 'multiply') // 6
```

The tree-shaken result of **math.js** would effectively be:

```javascript
export {doMath}

const add = (a, b) => a + b
const subtract = (a, b) => a - b
const divide = (a, b) => a / b
const multiply = (a, b) => a * b

function doMath(a, b, operation) {
  switch (operation) {
    case 'add':
      return add(a, b)
    case 'subtract':
      return subtract(a, b)
    case 'divide':
      return divide(a, b)
    case 'multiply':
      return multiply(a, b)
    default:
      throw new Error(`Unsupported operation: ${operation}`)
  }
}
```

However, with SliceJS, we could remove even _more_ code. Like this:

```javascript
export {doMath}

const multiply = (a, b) => a * b

function doMath(a, b) {
  return multiply(a, b)
}
```

Imagine doing this with `lodash`, `jquery` or `react`! Could be some pretty serious savings!

The biggest challenge with this would be getting an accurate measure of code coverage. For most applications, you'd have
a hard time making sure that your tests cover all use cases, and if you slice code out that's not covered by your test
cases, then your users wont get that code and things will blow up. There's still more work to be done here, but I think
that it's possible to make a big difference!
