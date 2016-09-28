export {tryCatch, statementsAfterThrow}

function tryCatch(shouldThrow) {
  const ret = {}
  try {
    if (shouldThrow) {
      throw new Error('throw error')
    }
    ret.noThrow = true
  } catch (error) {
    ret.error = error
    return error
  } finally {
    return ret
  }
}

function statementsAfterThrow() {
  const ret = {}
  try {
    ret.before = true
    if (ret.before) {
      throw new Error('throw error')
    }
    ret.after = true
  } catch (error) {
    ret.error = error
  } finally {
    return ret
  }
}
