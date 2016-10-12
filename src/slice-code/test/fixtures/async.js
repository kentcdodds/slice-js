export {callPromise, callback}

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
  return callPromise(pass).then(cb, cb) // I know, I'm cheating :P
}

function callPromise(pass) {
  // do this so we don't get Unhandled promise rejections in the console
  return promise(pass).catch(rejection => rejection)
}
