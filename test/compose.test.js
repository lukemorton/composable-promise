import test from 'ava'
import { compose } from '../lib'

test('single function by ref', async (t) => {
  const fn = () => true
  t.true(await compose(fn))
})

test('two functions by ref', async (t) => {
  const a = () => 1
  const b = (n) => n + 1
  t.is(await compose(a, b), 2)
})

test('one promise by ref', async (t) => {
  const promise = Promise.resolve(true)
  t.true(await compose(promise))
})

test('one promise constructor', async (t) => {
  const promise = () => Promise.resolve(true)
  t.true(await compose(promise))
})

test('two promise constructors', async (t) => {
  const a = () => Promise.resolve(1)
  const b = (n) => Promise.resolve(n + 1)
  t.is(await compose(a, b), 2)
})

test('three promise constructors', async (t) => {
  const a = () => Promise.resolve(1)
  const add1 = (n) => Promise.resolve(n + 1)
  t.is(await compose(a, add1, add1), 3)
})

test('mix of functions by ref and promise constructors', async (t) => {
  const a = () => 1
  const add1 = (n) => Promise.resolve(n + 1)
  const add2 = (n) => n + 2
  t.is(await compose(a, add1, add1), 3)
  t.is(await compose(a, add1, add2), 4)
  t.is(await compose(a, add2, add1), 4)
})

test('one promise by ref, one function by ref and promise constructor', async (t) => {
  const promiseRef = Promise.resolve(1)
  const fn = (res) => res + 1
  const anotherPromise = (res) => Promise.resolve(res + 1)
  t.is(await compose(promiseRef, fn, anotherPromise), 3)
})

test('validation use case', async (t) => {
  const json = async (req) => ({ cool: true })
  const validate = (data) => data
  const create = async (data) => ({ ...data, id: 1 })

  const user = await compose(json({}), validate, create)
  t.is(user.id, 1)
})
