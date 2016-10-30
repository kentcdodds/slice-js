# Learning Code

One of the original goals to this project is to help developers learn code. Take this module for example:

```javascript
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
```

The `clone` function is `38` lines of code and has a
[cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity) of `10`. Not exactly the most simple code in
the world! All the branches that handle edge cases make learning how this works at least a 10 minute task. But with
slice-js, you can learn it much more quickly! Let's use `slice-js` to learn this code.

`slice-js` takes two inputs: The source code, and a code coverage report. Based on this information, it can create a
slice of the program that's relevant for that coverage. Let's just say that we can generate the coverage based on a
given usage module. We'll start with a simple object:

```javascript
import clone from 'clone'
clone({name: 'Luke'})
```

Based on this usage, a coverage report could be generated and the resulting code slice would look much easier to learn
quickly:

```javascript
export default clone

function clone(item) {
  const type = typeof item
  const isPrimitive = type !== "object" && type !== "function"
  let result = item

  if (!isPrimitive) {
    result = {}
    for (const i in item) {
      result[i] = clone(item[i])
    }
  }

  return result
}
```

We've gone from `38` lines of code to `14` and the cyclomatic complexity from `10` to `3`. That's considerably more easy
to learn! But that's not everything that's important in this code. The original code is definitely important. So let's
add more use-cases and see how this slice is changed.

```javascript
import clone from 'clone'
clone({name: 'Luke'})
clone(null)
```

With that addition of `clone(null)`, we'll get this difference:

```diff
export default clone

function clone(item) {
+ if (!item) {
+   return item
+ }
  const type = typeof item
  const isPrimitive = type !== "object" && type !== "function"
  let result = item

  if (!isPrimitive) {
    result = {}
    for (const i in item) {
      result[i] = clone(item[i])
    }
  }

  return result
}
```

That's pretty reasonable to learn in addition to what we've already learned about this code. Let's add more now:

```javascript
import clone from 'clone'
clone({name: 'Luke'})
clone(null)
clone({friends: [{name: 'Rebecca'}]})
```

And here's what the slice looks like now:

```diff
export default clone

function clone(item) {
  if (!item) {
    return item
  }
  const type = typeof item
+ const string = Object.prototype.toString.call(item)
  const isPrimitive = type !== "object" && type !== "function"
  let result = item

  if (!isPrimitive) {
-   result = {}
-   for (const i in item) {
-     result[i] = clone(item[i])
+   if (string === '[object Array]') {
+     result = []
+     item.forEach((child, index, array) => {
+       result[index] = clone(child)
+     })
+   } else {
+     result = {}
+     for (const i in item) {
+       result[i] = clone(item[i])
+     }
    }
  }

  return result
}
```

Let's do this one more time:

```javascript
import clone from 'clone'
clone({name: 'Luke'})
clone(null)
clone({friends: [{name: 'Rebecca'}]})
clone({title: 'How to Train Your Dragon', releaseDate: new Date(2010, 2, 26)})
```

And with that, we add yet another edge case.

```diff
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
    } else {
-     result = {}
-     for (const i in item) {
-       result[i] = clone(item[i])
+     if (string === '[object Date]') {
+       result = new Date(item)
+     } else {
+       result = {}
+       for (const i in item) {
+         result[i] = clone(item[i])
+       }
      }
    }
  }

  return result
}
```

The benefit of this approach is that we learn the code use-case-by-use-case. It's much easier to learn bit by bit like
this, and slice-js enables this.
