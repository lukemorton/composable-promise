import test from 'ava'
import { thread } from '../lib'

test('call single function with arg', async (t) => {
  const fn = (x) => x
  t.true(await thread(true, fn))
})

test('call multiple functions with arg', async (t) => {
  const identity = (a) => a
  const addOne = (n) => n + 1
  t.is(await thread(1, identity, addOne), 2)
})

test('call with promise constructor', async (t) => {
  const identityThen = (a) => Promise.resolve(a)
  t.true(await thread(true, identityThen))
})

test('call with promise as first arg', async (t) => {
  const promise = Promise.resolve(true)
  const identity = (a) => a
  t.throws(thread(promise, identity), 'You cannot pass a promise as the first argument of thread()')
})

test('call with multiple promise constructors', async (t) => {
  const addOneEventually = (n) => Promise.resolve(n + 1)
  t.is(await thread(1, addOneEventually, addOneEventually), 3)
})

test('validation use case', async (t) => {
  const json = async (req) => ({ cool: true })
  const validate = (data) => data
  const create = async (data) => ({ ...data, id: 1 })

  const user = await thread({}, json, validate, create)
  t.is(user.id, 1)
})
