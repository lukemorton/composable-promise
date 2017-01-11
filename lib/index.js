
module.exports = exports = { compose, pipe }

async function compose () {
  const fns = [].slice.call(arguments)
  var mem

  if (fns[0].then) {
    mem = await fns.shift()
  } else if (typeof fns[0] !== 'function') {
    mem = fns.shift()
  }

  for (const fn of fns) {
    mem = await fn(mem)
  }

  return mem
}

async function pipe () {
  const [arg, firstFn, ...fns] = [].slice.call(arguments)

  if (arg.then) {
    throw new Error('You cannot pass a promise as the first argument of pipe()')
  }

  return compose(firstFn(arg), ...fns)
}
