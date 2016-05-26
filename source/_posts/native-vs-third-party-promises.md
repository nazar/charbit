title: "Native vs Third Party Javascript Promises"
date: 2016-05-18 10:21:42
tags:
  - Javascript
  - Promises
categories:
  - Software Development
summary:
---
# Native Promises vs Bluebird

I’ve been asked, on more than one occasion, about moving to ES6’s native Promises as opposed to using a third party library such as [When](https://github.com/cujojs/when) or [Bluebird](http://bluebirdjs.com/docs/getting-started.html).  In every occasion surprise was expressed when my response was that _I intend to continue using Bluebird over native Promises_.

Some express surprise over not using native Promises, at times citing concerns that third party Promise libraries might not be as performant as Native Promises but, IMHO, this is a poor decision metric as: a) Promises are mostly used in conjunction with external resources (think DB or API queries) - the bottleneck isn’t the Promise implementation; b) third party Promise implementations are [leaner and more performant](http://bluebirdjs.com/docs/benchmarks.html) than Native Promises - at least for now.

My answer always focused on the additional benefits and “sugar” provided by third party libraries when compared to the sparse implementation of Native Promises.

<!--more-->

Before I continue with specifics and examples:

## A _Very_ Quick Introduction to Promises

In short, Promises “promise” to simplify writing asynchronous code and, more importantly, offer an improved error handling mechanism.

Promises first became mainstream in Javascript when jQuery introduced [Deferred Objects](https://api.jquery.com/category/deferred-object/) in jQuery 1.5 in 2011. Alternative promise libraries started gaining ground soon afterwards but especially after [You’re Missing the Point of Promises](https://gist.github.com/domenic/3889970) post which was critical of jQuery’s implementation of Promises via _Deferred Objects_, specifically in regards to exception handling.

[Q](https://github.com/kriskowal/q) initially lead the charge of next generation Promise libraries and found widespread adoption until the arrival of [Bluebird](http://bluebirdjs.com/docs/getting-started.html) which initially rose to prominence due to its [benchmarks](http://bluebirdjs.com/docs/benchmarks.html) which showed that Bluebird was faster than other Promise libraries; these benchmarks also highlighted how slow Q was. Bluebird, unlike Q, also provided an API that mirrored [Promises/A+](https://github.com/promises-aplus/promises-spec) thus providing [drop-in](http://bluebirdjs.com/docs/coming-from-other-libraries.html#coming-from-native-promises) support to Native Promises.

Promises are also present in other programming languages: [Futures](https://www.dartlang.org/docs/tutorials/futures/) in [Dart](https://www.dartlang.org/); [concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html) in Python and so on. The [Futures and Promises](https://en.wikipedia.org/wiki/Futures_and_promises) Wikipedia entry details the history of promises/futures.

Much has been written about promises and the advantages, given by their proponents, over callbacks. I won’t go over these here but instead provide the following resources for further reading.
- [Why I am switching to promises](https://spion.github.io/posts/why-i-am-switching-to-promises.html)
- [Staying Sane With Asynchronous Programming: Promises and Generators](http://colintoh.com/blog/staying-sane-with-asynchronous-programming-promises-and-generators)
- [Callback Hell](http://callbackhell.com)

## Native ES6 Promises

[Native Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), as defined by the [ECMA Script 2015 specifications](http://www.ecma-international.org/ecma-262/6.0/#sec-promise-objects), provide the following methods:
- [resolve](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/resolve)
- [reject](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/reject)
- [all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
- [race](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race)
- [then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then)
- [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch)

## Advantage of Promise Libraries

Several libraries conform to the [Promises/A+](https://github.com/promises-aplus/promises-spec) API which include [when](https://github.com/cujojs/when), [bluebird](http://bluebirdjs.com/docs/getting-started.html) and the now defunct [Q](http://documentup.com/kriskowal/q/). [Several other](https://promisesaplus.com/implementations) libraries exist that implement basic Promises/A+ spec.

The remainder of this post will concentrate on [bluebird](http://bluebirdjs.com/docs/getting-started.html) and the [extended Promises API](http://bluebirdjs.com/docs/api-reference.html) it provides. [When](https://github.com/cujojs/when) also provides an [equally robust API](https://github.com/cujojs/when/blob/master/docs/api.md).

### Limit Concurrency with `.each`

When we talk of Javascript’s asynchronous nature, this is specifically in regards to how Javascript interfaces to external sources such as XHR, Database queries, external OS executables and so on. All these operations block in synchronous languages - i.e. querying a database would block execution in say Ruby until the query completes.

Not so in Javascript - these are all asynchronous which can become an issue when synchronous operations are required. A good example would be interfacing to an external API which is subject to rate limiting where it would be desirable to query the API endpoint one request at a time.

Bluebird makes this trivial using [each](http://bluebirdjs.com/docs/api/promise.each.html):

{% codeblock lang:jacascript %}
	  getTwitterAccountIdsFromDb()
	    .each(account => getAccountInfoFromApiFor(account));
{% endcodeblock %}

In the above example, `getTwitterAccountIdsFromDb` will execute sequentially.

### Transforming with `.map`

Bluebird offers several [Collections](http://bluebirdjs.com/docs/api/collections.html) based operators such as [any](http://bluebirdjs.com/docs/api/promise.any.html), [some](http://bluebirdjs.com/docs/api/promise.some.html), [reduce](http://bluebirdjs.com/docs/api/promise.reduce.html), [map](http://bluebirdjs.com/docs/api/promise.map.html) amongst others.

`map` is particularly interesting in that it is also able to limit [concurrency](http://bluebirdjs.com/docs/api/promise.map.html#map-option-concurrency). Using the Twitter example from `each`, we can rewrite the following function:

{% codeblock lang:javascript %}
    let accounts = getTwitterAccountIdsFromDb()
        .map(getAccountInfoFromApiFor);
{% endcodeblock %}

In the above example, `accounts` will hold an array of objects for each query returned from `getAccountInfoFromApiFor`. Note that `.map`, by default, will process in parallel. To limit concurrency:

{% codeblock lang:javascript %}
  let accounts = getTwitterAccountIdsFromDb()
      .map(account => getAccountInfoFromApiFor(account), {concurrency: 1});
{% endcodeblock %}

This will now call `getAccountInfoFromApiFor` sequentially, once for each account returned from `getTwitterAccountIdsFromDb`.

### Delays with `.delay`

Keeping with the theme of a rate-limited API endpoint, another useful method is [delay](http://bluebirdjs.com/docs/api/delay.html), which can be used as follows:

{% codeblock lang:javascript %}
    getTwitterAccountIdsFromDb()
        .each(account => {
          return transformAccount(account)
            .delay(1000 * 60);
        });
{% endcodeblock %}

The above `delay` will introduce a 60 second delay between each `transformAccount` call.

[timeout](http://bluebirdjs.com/docs/api/timeout.html) is also provided that throws if a promise is not fulfilled within the specified time.

### Granular exception handing with `.catch`

Bluebird provides an extended [catch](http://bluebirdjs.com/docs/api/catch.html) which allows defining `catch` statements by exception type. This better mirrors exception handling by exception type:

{% codeblock lang:javascript %}
    doSomethingAndReturnAPromise()
        .then(function() {
          return a.b.c.d();
        })
        .catch(TypeError, function(e) {
          //If it is a TypeError, will end up here because
          //it is a type error to reference property of undefined
        })
        .catch(ReferenceError, function(e) {
          //Will end up here if a was never declared at all
        })
        .catch(function(e) {
          //Generic catch-the rest, error wasn't TypeError nor
          //ReferenceError
        });
{% endcodeblock %}

### Catch-all Mechanism with `.finally`

Although native promises provide a [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method to capture and bubble exceptions, there isn’t a clean cleanup mechanism that always executes after an exception.

Use cases for this include a `loading` variable that holds UI state linked to a spinner, for example:

{% codeblock lang:javascript %}
    this.loading = true;
    getSomeExternalAPIValue()
        .then(processValue)
        .then(notifyUser)
        .catch(displayError)
        .finally(() => this.loading = false);
{% endcodeblock %}

### Object Intercepts with `.tap`

I first came across [tap](http://ruby-doc.org/core-2.2.3/Object.html#tap-method) in Ruby, primarily in the following situations:

{% codeblock lang:ruby %}
    def something
        result = operation
        do_something_with result
        result # return
    end
{% endcodeblock %}

Using tap:

{% codeblock lang:ruby %}
    def something
        operation.tap do |op|
            do_something_with op
        end
    end
{% endcodeblock %}

Where `tap` provides a mechanism for an object to be operated on in a block ***and then returned*** - note that the object no longer needs to be returned as Ruby always returns the last object in a block.

[Lodash](https://lodash.com) also provides [tap](https://lodash.com/docs#tap), which allows us to apply as similar pattern in Javascript; I often use tap in conjunction with `reduce`:

{% codeblock lang:javascript %}
  	function doSomething() {
  	  return _.reduce(someArray, (result, item) => {
  	    return _.tap(result, r => {
  	      if (item === someCondition){
  	        r.push(item * 2);
  	      } else {
  	        r.push(item / 2);
  	      }
  	    })
  	  }, []);
  	}
{% endcodeblock %}

IMHO, this reads better than returning the result at the end of the `reduce` function.

Bluebird also provides [tap](http://bluebirdjs.com/docs/api/tap.html) as mechanism to intercept the promise success chain without affecting data being passed through the chain.

Instead of:

{% codeblock ang:javascript %}
  	  doSomething()
  	    .then(...)
  	    .then(item => {
  	      domeSomethingElse();
  	      return item
  	    }).then(...);
{% endcodeblock %}

`tap` allows us to simplify this to:

{% codeblock lang:javascript %}
  	  doSomething()
  	    .then(...)
  	    .tap(doSomethingElse)
  	    .then(...);
{% endcodeblock %}

Bluebird provides other useful utility methods such as: [call](http://bluebirdjs.com/docs/api/call.html), [get](http://bluebirdjs.com/docs/api/get.html), [return](http://bluebirdjs.com/docs/api/return.html) plus more.

### Promise all the Things with Promisification

Last but not least is Bluebird’s wrapper to node type callback function interfaces. Bluebird provides [promisify](http://bluebirdjs.com/docs/api/promise.promisify.html) which transforms any function callback with the signature of `function(err, data)` into a Promise.

Using `fs.readfile` as an example:

{% codeblock lang:javascript %}
  	  var readFile = Promise.promisify(require("fs").readFile);
  	  readFile('a_file')
  	    .then(parse)
  	    .then(output)
  	    .catch(displayError);
{% endcodeblock %}

## Finally

Hopefully I've shown the added benefits third party Promise libraries provide specifically in terms of convenience and encapsulation of difficult problems such as sequential asynchronous operations, to name a few.

I encourage the reader to visit [Bluebird's API reference](http://bluebirdjs.com/docs/api-reference.html). I promise you'll find it convenient!