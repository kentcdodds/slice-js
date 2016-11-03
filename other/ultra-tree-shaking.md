# Ultra-Tree Shaking ™

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

## Shaking data

Another thing that I think would be super cool to do would be to not allocate memory for objects that are never used.
Right now, with SliceJS, here's an example that could be further optimized:

**log.js**

```javascript
const currentLevel = 0

const logLevels = {
  ALL: 100,
  DEBUG: 70,
  ERROR: 50,
  INFO: 30,
  WARN: 20,
  OFF: 0,
}

const setCurrentLevel = level => currentLevel = level

export {log, setCurrentLevel, logLevels}

function log(level, ...args) {
  if (currentLevel > level) {
    console.log(...args)
  }
}
```

**app.js**

```javascript
import {log, logLevels, setCurrentLevel}
setCurrentLevel(logLevels.ERROR)
log(logLevels.WARN, 'This is a warning!')
```

If we tracked data coverage (in addition to branch/function/statement coverage as we do now), then we could slice out
the allocation for some of the properties in the `logLevels` object as well! This would result in:

```javascript
const currentLevel = 0

const logLevels = {
  ERROR: 50,
  WARN: 20,
}

const setCurrentLevel = level => currentLevel = level

export {log, setCurrentLevel, logLevels}

function log(level, ...args) {
  if (currentLevel > level) {
    console.log(...args)
  }
}
```

Which would be even cooler in scenarios where the objects are actually significant in length and amount of memory!
