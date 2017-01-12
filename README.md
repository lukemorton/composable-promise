# composable-promise

I wanted a way to express promises and async await in a procedural way without a bunch of variables. When you need to pass the resolved value of one promise into another there a currently a couple of options:

**Nest the promises**

``` js
function getFriends(userId) {
  return get(`/user/${user.id}/friends`)
}

function getFriendsFriends(friends) {
  return Promise.all(friends.map(user => get(`/user/${user.id}/friends`)))
}

function flattenFriends(friends, andTheirFriends) {
  return andTheirFriends.reduce((allFriends, friends) => allFriends.concat(friends), friends)
}

function usersFriendsAndTheirFriends(userId) {
  return Promise.new(function (resolve, reject) {
    getFriends(userId).then(function (friends) {
      const andTheirFriends = getFriendsFriends(friends)
      return flattenFriends(friends, andTheirFriends)
    })
  })
}
```

**Use async await with variables**

``` js
function usersFriendsAndTheirFriends(userId) {
  const friends = await getFriends(userId)
  const andTheirFriends = await getFriendsFriends(friends)
  return flattenFriends(friends, andTheirFriends)
}
```

## Using fn-promise

I wanted another solution. One that didn't require as many variables in `usersFriendsAndTheirFriends`.

``` js
import { thread, partialRight } from 'composable-promise'

function usersFriendsAndTheirFriends(userId) {
  return thread(userId, getFriends, partialRight(getFriendsFriends), flattenFriends)
}
```

The `thread()` function is similar to Clojure's [`->` or thread](https://clojure.org/guides/threading_macros) macro. `partialRight()` is very much like lodash's [partialRight](https://lodash.com/docs/4.17.4#partialRight).

## What do you think?

I'm interested in seeing if others find this approach useful. Let me know on Twitter [@LukeMorton](https://twitter.com/LukeMorton)

## License

MIT.
