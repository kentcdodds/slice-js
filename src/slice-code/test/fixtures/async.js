export {promise, callback}

function promise(pass) {
  return new Promise((resolve, reject) => {
    if (pass) {
      resolve('pass')
    } else {
      reject('!pass')
    }
  })
}

function callback(pass, cb) {
  promise(pass).then(cb, cb) // I know, I'm cheating :P
}
