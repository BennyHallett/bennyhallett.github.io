---
layout: post
title:  "Simple local storage in Elm"
date:   2016-08-17 08:20:00 +1000
for:    blog
gaid:   "local-storage-elm"
permalink: "/simple-local-storage-in-elm/"
---

As of today - August 17th 2016 - Elm doesn't have a native mechanism for accessing the browser's [local storage][local-storage]. [Evan][evan-twitter]
is currently [building a module to do just this][native-storage] but according to the documentation it isn't ready for use yet.

Luckily for us, Elm provides a useful mechanism for interacting with plain old javascript - which let's us do whatever the hell we want. **Ports!** We can
use Ports to send data to some javascript and persist it in local storage, as well as have some javascript pull the data from local storage and pass it
to our Elm app.

Now local storage is a pretty useful tool to have. It lets us write apps for the web browser without needing to send data back to a server - which costs
time to build and maintain as well as money to run. The drawback is that it's local to that browser only, so no accessing your data from both
desktop and mobile, or from home, work, and school. The reason I decided to use local storage with Elm was for [my Football ELO ranking tracker][elo-site].
I wanted to be able to store the results of FIFA matches I play with friends, but didn't have the need to make them accessible to everyone over the internet - we
always play at the same place.

### Ports in Elm

Ports in Elm are a mechanism for bridging the gap between the purity of Elm and the anything-goes world of Javascript.

If we imagine our Elm app as a black box, then ports are little holes drilled into the outside of that box for us to
squeeze data through in both directions. More importantly, ports act as an airlock, keeping the Elm side and the Javascript
side completely separate.

The airlock we use with ports are JSON Encoders and Decoders, which allow us to transform Elm data structures into JSON and
vice-versa.

### Example time

So I think the best way of learning a thing is to actually do it, so lets go ahead and implement some simple local storage. We
can take one of the early Elm example apps - the counter - and store it's state in local storage.

Here's where we start - the [original counter code][counter-code]

* Writing to local storage - port + coder
* Reading from local storage on startup - port + coder
* Loading State

[local-storage]: https://mozilla.org/local-storage
[evan-twitter]: https://twitter.com/evancz
[native-storage]: https://github.com/evancz/elm-local-storage
[elo-site]: https://elo.bennyhallett.com
[counter-code]: https://guide.elm-lang.org
