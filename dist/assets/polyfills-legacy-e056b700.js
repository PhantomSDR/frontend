(function () {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
		var runtime = (function (exports) {

		  var Op = Object.prototype;
		  var hasOwn = Op.hasOwnProperty;
		  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
		  var undefined$1; // More compressible than void 0.
		  var $Symbol = typeof Symbol === "function" ? Symbol : {};
		  var iteratorSymbol = $Symbol.iterator || "@@iterator";
		  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
		  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

		  function define(obj, key, value) {
		    Object.defineProperty(obj, key, {
		      value: value,
		      enumerable: true,
		      configurable: true,
		      writable: true
		    });
		    return obj[key];
		  }
		  try {
		    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
		    define({}, "");
		  } catch (err) {
		    define = function(obj, key, value) {
		      return obj[key] = value;
		    };
		  }

		  function wrap(innerFn, outerFn, self, tryLocsList) {
		    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
		    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
		    var generator = Object.create(protoGenerator.prototype);
		    var context = new Context(tryLocsList || []);

		    // The ._invoke method unifies the implementations of the .next,
		    // .throw, and .return methods.
		    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

		    return generator;
		  }
		  exports.wrap = wrap;

		  // Try/catch helper to minimize deoptimizations. Returns a completion
		  // record like context.tryEntries[i].completion. This interface could
		  // have been (and was previously) designed to take a closure to be
		  // invoked without arguments, but in all the cases we care about we
		  // already have an existing method we want to call, so there's no need
		  // to create a new function object. We can even get away with assuming
		  // the method takes exactly one argument, since that happens to be true
		  // in every case, so we don't have to touch the arguments object. The
		  // only additional allocation required is the completion record, which
		  // has a stable shape and so hopefully should be cheap to allocate.
		  function tryCatch(fn, obj, arg) {
		    try {
		      return { type: "normal", arg: fn.call(obj, arg) };
		    } catch (err) {
		      return { type: "throw", arg: err };
		    }
		  }

		  var GenStateSuspendedStart = "suspendedStart";
		  var GenStateSuspendedYield = "suspendedYield";
		  var GenStateExecuting = "executing";
		  var GenStateCompleted = "completed";

		  // Returning this object from the innerFn has the same effect as
		  // breaking out of the dispatch switch statement.
		  var ContinueSentinel = {};

		  // Dummy constructor functions that we use as the .constructor and
		  // .constructor.prototype properties for functions that return Generator
		  // objects. For full spec compliance, you may wish to configure your
		  // minifier not to mangle the names of these two functions.
		  function Generator() {}
		  function GeneratorFunction() {}
		  function GeneratorFunctionPrototype() {}

		  // This is a polyfill for %IteratorPrototype% for environments that
		  // don't natively support it.
		  var IteratorPrototype = {};
		  define(IteratorPrototype, iteratorSymbol, function () {
		    return this;
		  });

		  var getProto = Object.getPrototypeOf;
		  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
		  if (NativeIteratorPrototype &&
		      NativeIteratorPrototype !== Op &&
		      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
		    // This environment has a native %IteratorPrototype%; use it instead
		    // of the polyfill.
		    IteratorPrototype = NativeIteratorPrototype;
		  }

		  var Gp = GeneratorFunctionPrototype.prototype =
		    Generator.prototype = Object.create(IteratorPrototype);
		  GeneratorFunction.prototype = GeneratorFunctionPrototype;
		  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
		  defineProperty(
		    GeneratorFunctionPrototype,
		    "constructor",
		    { value: GeneratorFunction, configurable: true }
		  );
		  GeneratorFunction.displayName = define(
		    GeneratorFunctionPrototype,
		    toStringTagSymbol,
		    "GeneratorFunction"
		  );

		  // Helper for defining the .next, .throw, and .return methods of the
		  // Iterator interface in terms of a single ._invoke method.
		  function defineIteratorMethods(prototype) {
		    ["next", "throw", "return"].forEach(function(method) {
		      define(prototype, method, function(arg) {
		        return this._invoke(method, arg);
		      });
		    });
		  }

		  exports.isGeneratorFunction = function(genFun) {
		    var ctor = typeof genFun === "function" && genFun.constructor;
		    return ctor
		      ? ctor === GeneratorFunction ||
		        // For the native GeneratorFunction constructor, the best we can
		        // do is to check its .name property.
		        (ctor.displayName || ctor.name) === "GeneratorFunction"
		      : false;
		  };

		  exports.mark = function(genFun) {
		    if (Object.setPrototypeOf) {
		      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
		    } else {
		      genFun.__proto__ = GeneratorFunctionPrototype;
		      define(genFun, toStringTagSymbol, "GeneratorFunction");
		    }
		    genFun.prototype = Object.create(Gp);
		    return genFun;
		  };

		  // Within the body of any async function, `await x` is transformed to
		  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
		  // `hasOwn.call(value, "__await")` to determine if the yielded value is
		  // meant to be awaited.
		  exports.awrap = function(arg) {
		    return { __await: arg };
		  };

		  function AsyncIterator(generator, PromiseImpl) {
		    function invoke(method, arg, resolve, reject) {
		      var record = tryCatch(generator[method], generator, arg);
		      if (record.type === "throw") {
		        reject(record.arg);
		      } else {
		        var result = record.arg;
		        var value = result.value;
		        if (value &&
		            typeof value === "object" &&
		            hasOwn.call(value, "__await")) {
		          return PromiseImpl.resolve(value.__await).then(function(value) {
		            invoke("next", value, resolve, reject);
		          }, function(err) {
		            invoke("throw", err, resolve, reject);
		          });
		        }

		        return PromiseImpl.resolve(value).then(function(unwrapped) {
		          // When a yielded Promise is resolved, its final value becomes
		          // the .value of the Promise<{value,done}> result for the
		          // current iteration.
		          result.value = unwrapped;
		          resolve(result);
		        }, function(error) {
		          // If a rejected Promise was yielded, throw the rejection back
		          // into the async generator function so it can be handled there.
		          return invoke("throw", error, resolve, reject);
		        });
		      }
		    }

		    var previousPromise;

		    function enqueue(method, arg) {
		      function callInvokeWithMethodAndArg() {
		        return new PromiseImpl(function(resolve, reject) {
		          invoke(method, arg, resolve, reject);
		        });
		      }

		      return previousPromise =
		        // If enqueue has been called before, then we want to wait until
		        // all previous Promises have been resolved before calling invoke,
		        // so that results are always delivered in the correct order. If
		        // enqueue has not been called before, then it is important to
		        // call invoke immediately, without waiting on a callback to fire,
		        // so that the async generator function has the opportunity to do
		        // any necessary setup in a predictable way. This predictability
		        // is why the Promise constructor synchronously invokes its
		        // executor callback, and why async functions synchronously
		        // execute code before the first await. Since we implement simple
		        // async functions in terms of async generators, it is especially
		        // important to get this right, even though it requires care.
		        previousPromise ? previousPromise.then(
		          callInvokeWithMethodAndArg,
		          // Avoid propagating failures to Promises returned by later
		          // invocations of the iterator.
		          callInvokeWithMethodAndArg
		        ) : callInvokeWithMethodAndArg();
		    }

		    // Define the unified helper method that is used to implement .next,
		    // .throw, and .return (see defineIteratorMethods).
		    defineProperty(this, "_invoke", { value: enqueue });
		  }

		  defineIteratorMethods(AsyncIterator.prototype);
		  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
		    return this;
		  });
		  exports.AsyncIterator = AsyncIterator;

		  // Note that simple async functions are implemented on top of
		  // AsyncIterator objects; they just return a Promise for the value of
		  // the final result produced by the iterator.
		  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
		    if (PromiseImpl === void 0) PromiseImpl = Promise;

		    var iter = new AsyncIterator(
		      wrap(innerFn, outerFn, self, tryLocsList),
		      PromiseImpl
		    );

		    return exports.isGeneratorFunction(outerFn)
		      ? iter // If outerFn is a generator, return the full iterator.
		      : iter.next().then(function(result) {
		          return result.done ? result.value : iter.next();
		        });
		  };

		  function makeInvokeMethod(innerFn, self, context) {
		    var state = GenStateSuspendedStart;

		    return function invoke(method, arg) {
		      if (state === GenStateExecuting) {
		        throw new Error("Generator is already running");
		      }

		      if (state === GenStateCompleted) {
		        if (method === "throw") {
		          throw arg;
		        }

		        // Be forgiving, per 25.3.3.3.3 of the spec:
		        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
		        return doneResult();
		      }

		      context.method = method;
		      context.arg = arg;

		      while (true) {
		        var delegate = context.delegate;
		        if (delegate) {
		          var delegateResult = maybeInvokeDelegate(delegate, context);
		          if (delegateResult) {
		            if (delegateResult === ContinueSentinel) continue;
		            return delegateResult;
		          }
		        }

		        if (context.method === "next") {
		          // Setting context._sent for legacy support of Babel's
		          // function.sent implementation.
		          context.sent = context._sent = context.arg;

		        } else if (context.method === "throw") {
		          if (state === GenStateSuspendedStart) {
		            state = GenStateCompleted;
		            throw context.arg;
		          }

		          context.dispatchException(context.arg);

		        } else if (context.method === "return") {
		          context.abrupt("return", context.arg);
		        }

		        state = GenStateExecuting;

		        var record = tryCatch(innerFn, self, context);
		        if (record.type === "normal") {
		          // If an exception is thrown from innerFn, we leave state ===
		          // GenStateExecuting and loop back for another invocation.
		          state = context.done
		            ? GenStateCompleted
		            : GenStateSuspendedYield;

		          if (record.arg === ContinueSentinel) {
		            continue;
		          }

		          return {
		            value: record.arg,
		            done: context.done
		          };

		        } else if (record.type === "throw") {
		          state = GenStateCompleted;
		          // Dispatch the exception by looping back around to the
		          // context.dispatchException(context.arg) call above.
		          context.method = "throw";
		          context.arg = record.arg;
		        }
		      }
		    };
		  }

		  // Call delegate.iterator[context.method](context.arg) and handle the
		  // result, either by returning a { value, done } result from the
		  // delegate iterator, or by modifying context.method and context.arg,
		  // setting context.delegate to null, and returning the ContinueSentinel.
		  function maybeInvokeDelegate(delegate, context) {
		    var methodName = context.method;
		    var method = delegate.iterator[methodName];
		    if (method === undefined$1) {
		      // A .throw or .return when the delegate iterator has no .throw
		      // method, or a missing .next mehtod, always terminate the
		      // yield* loop.
		      context.delegate = null;

		      // Note: ["return"] must be used for ES3 parsing compatibility.
		      if (methodName === "throw" && delegate.iterator["return"]) {
		        // If the delegate iterator has a return method, give it a
		        // chance to clean up.
		        context.method = "return";
		        context.arg = undefined$1;
		        maybeInvokeDelegate(delegate, context);

		        if (context.method === "throw") {
		          // If maybeInvokeDelegate(context) changed context.method from
		          // "return" to "throw", let that override the TypeError below.
		          return ContinueSentinel;
		        }
		      }
		      if (methodName !== "return") {
		        context.method = "throw";
		        context.arg = new TypeError(
		          "The iterator does not provide a '" + methodName + "' method");
		      }

		      return ContinueSentinel;
		    }

		    var record = tryCatch(method, delegate.iterator, context.arg);

		    if (record.type === "throw") {
		      context.method = "throw";
		      context.arg = record.arg;
		      context.delegate = null;
		      return ContinueSentinel;
		    }

		    var info = record.arg;

		    if (! info) {
		      context.method = "throw";
		      context.arg = new TypeError("iterator result is not an object");
		      context.delegate = null;
		      return ContinueSentinel;
		    }

		    if (info.done) {
		      // Assign the result of the finished delegate to the temporary
		      // variable specified by delegate.resultName (see delegateYield).
		      context[delegate.resultName] = info.value;

		      // Resume execution at the desired location (see delegateYield).
		      context.next = delegate.nextLoc;

		      // If context.method was "throw" but the delegate handled the
		      // exception, let the outer generator proceed normally. If
		      // context.method was "next", forget context.arg since it has been
		      // "consumed" by the delegate iterator. If context.method was
		      // "return", allow the original .return call to continue in the
		      // outer generator.
		      if (context.method !== "return") {
		        context.method = "next";
		        context.arg = undefined$1;
		      }

		    } else {
		      // Re-yield the result returned by the delegate method.
		      return info;
		    }

		    // The delegate iterator is finished, so forget it and continue with
		    // the outer generator.
		    context.delegate = null;
		    return ContinueSentinel;
		  }

		  // Define Generator.prototype.{next,throw,return} in terms of the
		  // unified ._invoke helper method.
		  defineIteratorMethods(Gp);

		  define(Gp, toStringTagSymbol, "Generator");

		  // A Generator should always return itself as the iterator object when the
		  // @@iterator function is called on it. Some browsers' implementations of the
		  // iterator prototype chain incorrectly implement this, causing the Generator
		  // object to not be returned from this call. This ensures that doesn't happen.
		  // See https://github.com/facebook/regenerator/issues/274 for more details.
		  define(Gp, iteratorSymbol, function() {
		    return this;
		  });

		  define(Gp, "toString", function() {
		    return "[object Generator]";
		  });

		  function pushTryEntry(locs) {
		    var entry = { tryLoc: locs[0] };

		    if (1 in locs) {
		      entry.catchLoc = locs[1];
		    }

		    if (2 in locs) {
		      entry.finallyLoc = locs[2];
		      entry.afterLoc = locs[3];
		    }

		    this.tryEntries.push(entry);
		  }

		  function resetTryEntry(entry) {
		    var record = entry.completion || {};
		    record.type = "normal";
		    delete record.arg;
		    entry.completion = record;
		  }

		  function Context(tryLocsList) {
		    // The root entry object (effectively a try statement without a catch
		    // or a finally block) gives us a place to store values thrown from
		    // locations where there is no enclosing try statement.
		    this.tryEntries = [{ tryLoc: "root" }];
		    tryLocsList.forEach(pushTryEntry, this);
		    this.reset(true);
		  }

		  exports.keys = function(val) {
		    var object = Object(val);
		    var keys = [];
		    for (var key in object) {
		      keys.push(key);
		    }
		    keys.reverse();

		    // Rather than returning an object with a next method, we keep
		    // things simple and return the next function itself.
		    return function next() {
		      while (keys.length) {
		        var key = keys.pop();
		        if (key in object) {
		          next.value = key;
		          next.done = false;
		          return next;
		        }
		      }

		      // To avoid creating an additional object, we just hang the .value
		      // and .done properties off the next function object itself. This
		      // also ensures that the minifier will not anonymize the function.
		      next.done = true;
		      return next;
		    };
		  };

		  function values(iterable) {
		    if (iterable) {
		      var iteratorMethod = iterable[iteratorSymbol];
		      if (iteratorMethod) {
		        return iteratorMethod.call(iterable);
		      }

		      if (typeof iterable.next === "function") {
		        return iterable;
		      }

		      if (!isNaN(iterable.length)) {
		        var i = -1, next = function next() {
		          while (++i < iterable.length) {
		            if (hasOwn.call(iterable, i)) {
		              next.value = iterable[i];
		              next.done = false;
		              return next;
		            }
		          }

		          next.value = undefined$1;
		          next.done = true;

		          return next;
		        };

		        return next.next = next;
		      }
		    }

		    // Return an iterator with no values.
		    return { next: doneResult };
		  }
		  exports.values = values;

		  function doneResult() {
		    return { value: undefined$1, done: true };
		  }

		  Context.prototype = {
		    constructor: Context,

		    reset: function(skipTempReset) {
		      this.prev = 0;
		      this.next = 0;
		      // Resetting context._sent for legacy support of Babel's
		      // function.sent implementation.
		      this.sent = this._sent = undefined$1;
		      this.done = false;
		      this.delegate = null;

		      this.method = "next";
		      this.arg = undefined$1;

		      this.tryEntries.forEach(resetTryEntry);

		      if (!skipTempReset) {
		        for (var name in this) {
		          // Not sure about the optimal order of these conditions:
		          if (name.charAt(0) === "t" &&
		              hasOwn.call(this, name) &&
		              !isNaN(+name.slice(1))) {
		            this[name] = undefined$1;
		          }
		        }
		      }
		    },

		    stop: function() {
		      this.done = true;

		      var rootEntry = this.tryEntries[0];
		      var rootRecord = rootEntry.completion;
		      if (rootRecord.type === "throw") {
		        throw rootRecord.arg;
		      }

		      return this.rval;
		    },

		    dispatchException: function(exception) {
		      if (this.done) {
		        throw exception;
		      }

		      var context = this;
		      function handle(loc, caught) {
		        record.type = "throw";
		        record.arg = exception;
		        context.next = loc;

		        if (caught) {
		          // If the dispatched exception was caught by a catch block,
		          // then let that catch block handle the exception normally.
		          context.method = "next";
		          context.arg = undefined$1;
		        }

		        return !! caught;
		      }

		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        var record = entry.completion;

		        if (entry.tryLoc === "root") {
		          // Exception thrown outside of any try block that could handle
		          // it, so set the completion value of the entire function to
		          // throw the exception.
		          return handle("end");
		        }

		        if (entry.tryLoc <= this.prev) {
		          var hasCatch = hasOwn.call(entry, "catchLoc");
		          var hasFinally = hasOwn.call(entry, "finallyLoc");

		          if (hasCatch && hasFinally) {
		            if (this.prev < entry.catchLoc) {
		              return handle(entry.catchLoc, true);
		            } else if (this.prev < entry.finallyLoc) {
		              return handle(entry.finallyLoc);
		            }

		          } else if (hasCatch) {
		            if (this.prev < entry.catchLoc) {
		              return handle(entry.catchLoc, true);
		            }

		          } else if (hasFinally) {
		            if (this.prev < entry.finallyLoc) {
		              return handle(entry.finallyLoc);
		            }

		          } else {
		            throw new Error("try statement without catch or finally");
		          }
		        }
		      }
		    },

		    abrupt: function(type, arg) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.tryLoc <= this.prev &&
		            hasOwn.call(entry, "finallyLoc") &&
		            this.prev < entry.finallyLoc) {
		          var finallyEntry = entry;
		          break;
		        }
		      }

		      if (finallyEntry &&
		          (type === "break" ||
		           type === "continue") &&
		          finallyEntry.tryLoc <= arg &&
		          arg <= finallyEntry.finallyLoc) {
		        // Ignore the finally entry if control is not jumping to a
		        // location outside the try/catch block.
		        finallyEntry = null;
		      }

		      var record = finallyEntry ? finallyEntry.completion : {};
		      record.type = type;
		      record.arg = arg;

		      if (finallyEntry) {
		        this.method = "next";
		        this.next = finallyEntry.finallyLoc;
		        return ContinueSentinel;
		      }

		      return this.complete(record);
		    },

		    complete: function(record, afterLoc) {
		      if (record.type === "throw") {
		        throw record.arg;
		      }

		      if (record.type === "break" ||
		          record.type === "continue") {
		        this.next = record.arg;
		      } else if (record.type === "return") {
		        this.rval = this.arg = record.arg;
		        this.method = "return";
		        this.next = "end";
		      } else if (record.type === "normal" && afterLoc) {
		        this.next = afterLoc;
		      }

		      return ContinueSentinel;
		    },

		    finish: function(finallyLoc) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.finallyLoc === finallyLoc) {
		          this.complete(entry.completion, entry.afterLoc);
		          resetTryEntry(entry);
		          return ContinueSentinel;
		        }
		      }
		    },

		    "catch": function(tryLoc) {
		      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
		        var entry = this.tryEntries[i];
		        if (entry.tryLoc === tryLoc) {
		          var record = entry.completion;
		          if (record.type === "throw") {
		            var thrown = record.arg;
		            resetTryEntry(entry);
		          }
		          return thrown;
		        }
		      }

		      // The context.catch method must only be called with a location
		      // argument that corresponds to a known catch block.
		      throw new Error("illegal catch attempt");
		    },

		    delegateYield: function(iterable, resultName, nextLoc) {
		      this.delegate = {
		        iterator: values(iterable),
		        resultName: resultName,
		        nextLoc: nextLoc
		      };

		      if (this.method === "next") {
		        // Deliberately forget the last sent value so that we don't
		        // accidentally pass it on to the delegate.
		        this.arg = undefined$1;
		      }

		      return ContinueSentinel;
		    }
		  };

		  // Regardless of whether this script is executing as a CommonJS module
		  // or not, return the runtime object so that we can declare the variable
		  // regeneratorRuntime in the outer scope, which allows this module to be
		  // injected easily by `bin/regenerator --include-runtime script.js`.
		  return exports;

		}(
		  // If this script is executing as a CommonJS module, use module.exports
		  // as the regeneratorRuntime namespace. Otherwise create a new empty
		  // object. Either way, the resulting object will be used to initialize
		  // the regeneratorRuntime variable at the top of this file.
		  module.exports 
		));

		try {
		  regeneratorRuntime = runtime;
		} catch (accidentalStrictMode) {
		  // This module should not be running in strict mode, so the above
		  // assignment should always work unless something is misconfigured. Just
		  // in case runtime.js accidentally runs in strict mode, in modern engines
		  // we can explicitly access globalThis. In older engines we can escape
		  // strict mode using a global Function call. This could conceivably fail
		  // if a Content Security Policy forbids using Function, but in that case
		  // the proper solution is to fix the accidental strict mode problem. If
		  // you've misconfigured your bundler to force strict mode and applied a
		  // CSP to forbid Function, and you're not willing to fix either of those
		  // problems, please detail your unique predicament in a GitHub issue.
		  if (typeof globalThis === "object") {
		    globalThis.regeneratorRuntime = runtime;
		  } else {
		    Function("r", "regeneratorRuntime = r")(runtime);
		  }
		}
	} (runtime));

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global$K =
	  // eslint-disable-next-line es/no-global-this -- safe
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  // eslint-disable-next-line no-restricted-globals -- safe
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func -- fallback
	  (function () { return this; })() || Function('return this')();

	var objectGetOwnPropertyDescriptor = {};

	var fails$X = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	var fails$W = fails$X;

	// Detect IE8's incomplete defineProperty implementation
	var descriptors = !fails$W(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var fails$V = fails$X;

	var functionBindNative = !fails$V(function () {
	  // eslint-disable-next-line es/no-function-prototype-bind -- safe
	  var test = (function () { /* empty */ }).bind();
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return typeof test != 'function' || test.hasOwnProperty('prototype');
	});

	var NATIVE_BIND$4 = functionBindNative;

	var call$v = Function.prototype.call;

	var functionCall = NATIVE_BIND$4 ? call$v.bind(call$v) : function () {
	  return call$v.apply(call$v, arguments);
	};

	var objectPropertyIsEnumerable = {};

	var $propertyIsEnumerable$2 = {}.propertyIsEnumerable;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$6 = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor$6 && !$propertyIsEnumerable$2.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
	objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor$6(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : $propertyIsEnumerable$2;

	var createPropertyDescriptor$a = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var NATIVE_BIND$3 = functionBindNative;

	var FunctionPrototype$4 = Function.prototype;
	var call$u = FunctionPrototype$4.call;
	var uncurryThisWithBind = NATIVE_BIND$3 && FunctionPrototype$4.bind.bind(call$u, call$u);

	var functionUncurryThis = NATIVE_BIND$3 ? uncurryThisWithBind : function (fn) {
	  return function () {
	    return call$u.apply(fn, arguments);
	  };
	};

	var uncurryThis$P = functionUncurryThis;

	var toString$m = uncurryThis$P({}.toString);
	var stringSlice$9 = uncurryThis$P(''.slice);

	var classofRaw$2 = function (it) {
	  return stringSlice$9(toString$m(it), 8, -1);
	};

	var uncurryThis$O = functionUncurryThis;
	var fails$U = fails$X;
	var classof$h = classofRaw$2;

	var $Object$4 = Object;
	var split = uncurryThis$O(''.split);

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails$U(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins -- safe
	  return !$Object$4('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classof$h(it) == 'String' ? split(it, '') : $Object$4(it);
	} : $Object$4;

	// we can't use just `it == null` since of `document.all` special case
	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot-aec
	var isNullOrUndefined$b = function (it) {
	  return it === null || it === undefined;
	};

	var isNullOrUndefined$a = isNullOrUndefined$b;

	var $TypeError$m = TypeError;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.es/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible$d = function (it) {
	  if (isNullOrUndefined$a(it)) throw $TypeError$m("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings
	var IndexedObject$5 = indexedObject;
	var requireObjectCoercible$c = requireObjectCoercible$d;

	var toIndexedObject$e = function (it) {
	  return IndexedObject$5(requireObjectCoercible$c(it));
	};

	var documentAll$2 = typeof document == 'object' && document.all;

	// https://tc39.es/ecma262/#sec-IsHTMLDDA-internal-slot
	var IS_HTMLDDA = typeof documentAll$2 == 'undefined' && documentAll$2 !== undefined;

	var documentAll_1 = {
	  all: documentAll$2,
	  IS_HTMLDDA: IS_HTMLDDA
	};

	var $documentAll$1 = documentAll_1;

	var documentAll$1 = $documentAll$1.all;

	// `IsCallable` abstract operation
	// https://tc39.es/ecma262/#sec-iscallable
	var isCallable$t = $documentAll$1.IS_HTMLDDA ? function (argument) {
	  return typeof argument == 'function' || argument === documentAll$1;
	} : function (argument) {
	  return typeof argument == 'function';
	};

	var isCallable$s = isCallable$t;
	var $documentAll = documentAll_1;

	var documentAll = $documentAll.all;

	var isObject$r = $documentAll.IS_HTMLDDA ? function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$s(it) || it === documentAll;
	} : function (it) {
	  return typeof it == 'object' ? it !== null : isCallable$s(it);
	};

	var global$J = global$K;
	var isCallable$r = isCallable$t;

	var aFunction = function (argument) {
	  return isCallable$r(argument) ? argument : undefined;
	};

	var getBuiltIn$i = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(global$J[namespace]) : global$J[namespace] && global$J[namespace][method];
	};

	var uncurryThis$N = functionUncurryThis;

	var objectIsPrototypeOf = uncurryThis$N({}.isPrototypeOf);

	var getBuiltIn$h = getBuiltIn$i;

	var engineUserAgent = getBuiltIn$h('navigator', 'userAgent') || '';

	var global$I = global$K;
	var userAgent$5 = engineUserAgent;

	var process$3 = global$I.process;
	var Deno$1 = global$I.Deno;
	var versions = process$3 && process$3.versions || Deno$1 && Deno$1.version;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  // in old Chrome, versions of V8 isn't V8 = Chrome / 10
	  // but their correct versions are not interesting for us
	  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
	}

	// BrowserFS NodeJS `process` polyfill incorrectly set `.v8` to `0.0`
	// so check `userAgent` even if `.v8` exists, but 0
	if (!version && userAgent$5) {
	  match = userAgent$5.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = userAgent$5.match(/Chrome\/(\d+)/);
	    if (match) version = +match[1];
	  }
	}

	var engineV8Version = version;

	/* eslint-disable es/no-symbol -- required for testing */

	var V8_VERSION$3 = engineV8Version;
	var fails$T = fails$X;

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
	var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$T(function () {
	  var symbol = Symbol();
	  // Chrome 38 Symbol has incorrect toString conversion
	  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
	  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
	    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
	    !Symbol.sham && V8_VERSION$3 && V8_VERSION$3 < 41;
	});

	/* eslint-disable es/no-symbol -- required for testing */

	var NATIVE_SYMBOL$6 = symbolConstructorDetection;

	var useSymbolAsUid = NATIVE_SYMBOL$6
	  && !Symbol.sham
	  && typeof Symbol.iterator == 'symbol';

	var getBuiltIn$g = getBuiltIn$i;
	var isCallable$q = isCallable$t;
	var isPrototypeOf$b = objectIsPrototypeOf;
	var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

	var $Object$3 = Object;

	var isSymbol$6 = USE_SYMBOL_AS_UID$1 ? function (it) {
	  return typeof it == 'symbol';
	} : function (it) {
	  var $Symbol = getBuiltIn$g('Symbol');
	  return isCallable$q($Symbol) && isPrototypeOf$b($Symbol.prototype, $Object$3(it));
	};

	var $String$4 = String;

	var tryToString$7 = function (argument) {
	  try {
	    return $String$4(argument);
	  } catch (error) {
	    return 'Object';
	  }
	};

	var isCallable$p = isCallable$t;
	var tryToString$6 = tryToString$7;

	var $TypeError$l = TypeError;

	// `Assert: IsCallable(argument) is true`
	var aCallable$e = function (argument) {
	  if (isCallable$p(argument)) return argument;
	  throw $TypeError$l(tryToString$6(argument) + ' is not a function');
	};

	var aCallable$d = aCallable$e;
	var isNullOrUndefined$9 = isNullOrUndefined$b;

	// `GetMethod` abstract operation
	// https://tc39.es/ecma262/#sec-getmethod
	var getMethod$7 = function (V, P) {
	  var func = V[P];
	  return isNullOrUndefined$9(func) ? undefined : aCallable$d(func);
	};

	var call$t = functionCall;
	var isCallable$o = isCallable$t;
	var isObject$q = isObject$r;

	var $TypeError$k = TypeError;

	// `OrdinaryToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-ordinarytoprimitive
	var ordinaryToPrimitive$2 = function (input, pref) {
	  var fn, val;
	  if (pref === 'string' && isCallable$o(fn = input.toString) && !isObject$q(val = call$t(fn, input))) return val;
	  if (isCallable$o(fn = input.valueOf) && !isObject$q(val = call$t(fn, input))) return val;
	  if (pref !== 'string' && isCallable$o(fn = input.toString) && !isObject$q(val = call$t(fn, input))) return val;
	  throw $TypeError$k("Can't convert object to primitive value");
	};

	var shared$7 = {exports: {}};

	var global$H = global$K;

	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$h = Object.defineProperty;

	var defineGlobalProperty$3 = function (key, value) {
	  try {
	    defineProperty$h(global$H, key, { value: value, configurable: true, writable: true });
	  } catch (error) {
	    global$H[key] = value;
	  } return value;
	};

	var global$G = global$K;
	var defineGlobalProperty$2 = defineGlobalProperty$3;

	var SHARED = '__core-js_shared__';
	var store$3 = global$G[SHARED] || defineGlobalProperty$2(SHARED, {});

	var sharedStore = store$3;

	var store$2 = sharedStore;

	(shared$7.exports = function (key, value) {
	  return store$2[key] || (store$2[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.26.1',
	  mode: 'global',
	  copyright: '© 2014-2022 Denis Pushkarev (zloirock.ru)',
	  license: 'https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE',
	  source: 'https://github.com/zloirock/core-js'
	});

	var requireObjectCoercible$b = requireObjectCoercible$d;

	var $Object$2 = Object;

	// `ToObject` abstract operation
	// https://tc39.es/ecma262/#sec-toobject
	var toObject$j = function (argument) {
	  return $Object$2(requireObjectCoercible$b(argument));
	};

	var uncurryThis$M = functionUncurryThis;
	var toObject$i = toObject$j;

	var hasOwnProperty = uncurryThis$M({}.hasOwnProperty);

	// `HasOwnProperty` abstract operation
	// https://tc39.es/ecma262/#sec-hasownproperty
	// eslint-disable-next-line es/no-object-hasown -- safe
	var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
	  return hasOwnProperty(toObject$i(it), key);
	};

	var uncurryThis$L = functionUncurryThis;

	var id$2 = 0;
	var postfix = Math.random();
	var toString$l = uncurryThis$L(1.0.toString);

	var uid$5 = function (key) {
	  return 'Symbol(' + (key === undefined ? '' : key) + ')_' + toString$l(++id$2 + postfix, 36);
	};

	var global$F = global$K;
	var shared$6 = shared$7.exports;
	var hasOwn$r = hasOwnProperty_1;
	var uid$4 = uid$5;
	var NATIVE_SYMBOL$5 = symbolConstructorDetection;
	var USE_SYMBOL_AS_UID = useSymbolAsUid;

	var WellKnownSymbolsStore$1 = shared$6('wks');
	var Symbol$1 = global$F.Symbol;
	var symbolFor = Symbol$1 && Symbol$1['for'];
	var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$4;

	var wellKnownSymbol$v = function (name) {
	  if (!hasOwn$r(WellKnownSymbolsStore$1, name) || !(NATIVE_SYMBOL$5 || typeof WellKnownSymbolsStore$1[name] == 'string')) {
	    var description = 'Symbol.' + name;
	    if (NATIVE_SYMBOL$5 && hasOwn$r(Symbol$1, name)) {
	      WellKnownSymbolsStore$1[name] = Symbol$1[name];
	    } else if (USE_SYMBOL_AS_UID && symbolFor) {
	      WellKnownSymbolsStore$1[name] = symbolFor(description);
	    } else {
	      WellKnownSymbolsStore$1[name] = createWellKnownSymbol(description);
	    }
	  } return WellKnownSymbolsStore$1[name];
	};

	var call$s = functionCall;
	var isObject$p = isObject$r;
	var isSymbol$5 = isSymbol$6;
	var getMethod$6 = getMethod$7;
	var ordinaryToPrimitive$1 = ordinaryToPrimitive$2;
	var wellKnownSymbol$u = wellKnownSymbol$v;

	var $TypeError$j = TypeError;
	var TO_PRIMITIVE$1 = wellKnownSymbol$u('toPrimitive');

	// `ToPrimitive` abstract operation
	// https://tc39.es/ecma262/#sec-toprimitive
	var toPrimitive$3 = function (input, pref) {
	  if (!isObject$p(input) || isSymbol$5(input)) return input;
	  var exoticToPrim = getMethod$6(input, TO_PRIMITIVE$1);
	  var result;
	  if (exoticToPrim) {
	    if (pref === undefined) pref = 'default';
	    result = call$s(exoticToPrim, input, pref);
	    if (!isObject$p(result) || isSymbol$5(result)) return result;
	    throw $TypeError$j("Can't convert object to primitive value");
	  }
	  if (pref === undefined) pref = 'number';
	  return ordinaryToPrimitive$1(input, pref);
	};

	var toPrimitive$2 = toPrimitive$3;
	var isSymbol$4 = isSymbol$6;

	// `ToPropertyKey` abstract operation
	// https://tc39.es/ecma262/#sec-topropertykey
	var toPropertyKey$5 = function (argument) {
	  var key = toPrimitive$2(argument, 'string');
	  return isSymbol$4(key) ? key : key + '';
	};

	var global$E = global$K;
	var isObject$o = isObject$r;

	var document$3 = global$E.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS$1 = isObject$o(document$3) && isObject$o(document$3.createElement);

	var documentCreateElement$2 = function (it) {
	  return EXISTS$1 ? document$3.createElement(it) : {};
	};

	var DESCRIPTORS$t = descriptors;
	var fails$S = fails$X;
	var createElement$1 = documentCreateElement$2;

	// Thanks to IE8 for its funny defineProperty
	var ie8DomDefine = !DESCRIPTORS$t && !fails$S(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(createElement$1('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var DESCRIPTORS$s = descriptors;
	var call$r = functionCall;
	var propertyIsEnumerableModule$2 = objectPropertyIsEnumerable;
	var createPropertyDescriptor$9 = createPropertyDescriptor$a;
	var toIndexedObject$d = toIndexedObject$e;
	var toPropertyKey$4 = toPropertyKey$5;
	var hasOwn$q = hasOwnProperty_1;
	var IE8_DOM_DEFINE$1 = ie8DomDefine;

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$2 = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	objectGetOwnPropertyDescriptor.f = DESCRIPTORS$s ? $getOwnPropertyDescriptor$2 : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject$d(O);
	  P = toPropertyKey$4(P);
	  if (IE8_DOM_DEFINE$1) try {
	    return $getOwnPropertyDescriptor$2(O, P);
	  } catch (error) { /* empty */ }
	  if (hasOwn$q(O, P)) return createPropertyDescriptor$9(!call$r(propertyIsEnumerableModule$2.f, O, P), O[P]);
	};

	var objectDefineProperty = {};

	var DESCRIPTORS$r = descriptors;
	var fails$R = fails$X;

	// V8 ~ Chrome 36-
	// https://bugs.chromium.org/p/v8/issues/detail?id=3334
	var v8PrototypeDefineBug = DESCRIPTORS$r && fails$R(function () {
	  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
	  return Object.defineProperty(function () { /* empty */ }, 'prototype', {
	    value: 42,
	    writable: false
	  }).prototype != 42;
	});

	var isObject$n = isObject$r;

	var $String$3 = String;
	var $TypeError$i = TypeError;

	// `Assert: Type(argument) is Object`
	var anObject$r = function (argument) {
	  if (isObject$n(argument)) return argument;
	  throw $TypeError$i($String$3(argument) + ' is not an object');
	};

	var DESCRIPTORS$q = descriptors;
	var IE8_DOM_DEFINE = ie8DomDefine;
	var V8_PROTOTYPE_DEFINE_BUG$1 = v8PrototypeDefineBug;
	var anObject$q = anObject$r;
	var toPropertyKey$3 = toPropertyKey$5;

	var $TypeError$h = TypeError;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var $defineProperty$1 = Object.defineProperty;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
	var ENUMERABLE = 'enumerable';
	var CONFIGURABLE$1 = 'configurable';
	var WRITABLE = 'writable';

	// `Object.defineProperty` method
	// https://tc39.es/ecma262/#sec-object.defineproperty
	objectDefineProperty.f = DESCRIPTORS$q ? V8_PROTOTYPE_DEFINE_BUG$1 ? function defineProperty(O, P, Attributes) {
	  anObject$q(O);
	  P = toPropertyKey$3(P);
	  anObject$q(Attributes);
	  if (typeof O === 'function' && P === 'prototype' && 'value' in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
	    var current = $getOwnPropertyDescriptor$1(O, P);
	    if (current && current[WRITABLE]) {
	      O[P] = Attributes.value;
	      Attributes = {
	        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
	        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
	        writable: false
	      };
	    }
	  } return $defineProperty$1(O, P, Attributes);
	} : $defineProperty$1 : function defineProperty(O, P, Attributes) {
	  anObject$q(O);
	  P = toPropertyKey$3(P);
	  anObject$q(Attributes);
	  if (IE8_DOM_DEFINE) try {
	    return $defineProperty$1(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw $TypeError$h('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var DESCRIPTORS$p = descriptors;
	var definePropertyModule$8 = objectDefineProperty;
	var createPropertyDescriptor$8 = createPropertyDescriptor$a;

	var createNonEnumerableProperty$d = DESCRIPTORS$p ? function (object, key, value) {
	  return definePropertyModule$8.f(object, key, createPropertyDescriptor$8(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var makeBuiltIn$4 = {exports: {}};

	var DESCRIPTORS$o = descriptors;
	var hasOwn$p = hasOwnProperty_1;

	var FunctionPrototype$3 = Function.prototype;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getDescriptor = DESCRIPTORS$o && Object.getOwnPropertyDescriptor;

	var EXISTS = hasOwn$p(FunctionPrototype$3, 'name');
	// additional protection from minified / mangled / dropped function names
	var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
	var CONFIGURABLE = EXISTS && (!DESCRIPTORS$o || (DESCRIPTORS$o && getDescriptor(FunctionPrototype$3, 'name').configurable));

	var functionName = {
	  EXISTS: EXISTS,
	  PROPER: PROPER,
	  CONFIGURABLE: CONFIGURABLE
	};

	var uncurryThis$K = functionUncurryThis;
	var isCallable$n = isCallable$t;
	var store$1 = sharedStore;

	var functionToString$1 = uncurryThis$K(Function.toString);

	// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
	if (!isCallable$n(store$1.inspectSource)) {
	  store$1.inspectSource = function (it) {
	    return functionToString$1(it);
	  };
	}

	var inspectSource$3 = store$1.inspectSource;

	var global$D = global$K;
	var isCallable$m = isCallable$t;

	var WeakMap$2 = global$D.WeakMap;

	var weakMapBasicDetection = isCallable$m(WeakMap$2) && /native code/.test(String(WeakMap$2));

	var shared$5 = shared$7.exports;
	var uid$3 = uid$5;

	var keys$3 = shared$5('keys');

	var sharedKey$4 = function (key) {
	  return keys$3[key] || (keys$3[key] = uid$3(key));
	};

	var hiddenKeys$6 = {};

	var NATIVE_WEAK_MAP$1 = weakMapBasicDetection;
	var global$C = global$K;
	var isObject$m = isObject$r;
	var createNonEnumerableProperty$c = createNonEnumerableProperty$d;
	var hasOwn$o = hasOwnProperty_1;
	var shared$4 = sharedStore;
	var sharedKey$3 = sharedKey$4;
	var hiddenKeys$5 = hiddenKeys$6;

	var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
	var TypeError$5 = global$C.TypeError;
	var WeakMap$1 = global$C.WeakMap;
	var set$2, get$1, has;

	var enforce = function (it) {
	  return has(it) ? get$1(it) : set$2(it, {});
	};

	var getterFor$1 = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject$m(it) || (state = get$1(it)).type !== TYPE) {
	      throw TypeError$5('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (NATIVE_WEAK_MAP$1 || shared$4.state) {
	  var store = shared$4.state || (shared$4.state = new WeakMap$1());
	  /* eslint-disable no-self-assign -- prototype methods protection */
	  store.get = store.get;
	  store.has = store.has;
	  store.set = store.set;
	  /* eslint-enable no-self-assign -- prototype methods protection */
	  set$2 = function (it, metadata) {
	    if (store.has(it)) throw TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    store.set(it, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return store.get(it) || {};
	  };
	  has = function (it) {
	    return store.has(it);
	  };
	} else {
	  var STATE = sharedKey$3('state');
	  hiddenKeys$5[STATE] = true;
	  set$2 = function (it, metadata) {
	    if (hasOwn$o(it, STATE)) throw TypeError$5(OBJECT_ALREADY_INITIALIZED);
	    metadata.facade = it;
	    createNonEnumerableProperty$c(it, STATE, metadata);
	    return metadata;
	  };
	  get$1 = function (it) {
	    return hasOwn$o(it, STATE) ? it[STATE] : {};
	  };
	  has = function (it) {
	    return hasOwn$o(it, STATE);
	  };
	}

	var internalState = {
	  set: set$2,
	  get: get$1,
	  has: has,
	  enforce: enforce,
	  getterFor: getterFor$1
	};

	var fails$Q = fails$X;
	var isCallable$l = isCallable$t;
	var hasOwn$n = hasOwnProperty_1;
	var DESCRIPTORS$n = descriptors;
	var CONFIGURABLE_FUNCTION_NAME$2 = functionName.CONFIGURABLE;
	var inspectSource$2 = inspectSource$3;
	var InternalStateModule$a = internalState;

	var enforceInternalState$4 = InternalStateModule$a.enforce;
	var getInternalState$a = InternalStateModule$a.get;
	// eslint-disable-next-line es/no-object-defineproperty -- safe
	var defineProperty$g = Object.defineProperty;

	var CONFIGURABLE_LENGTH = DESCRIPTORS$n && !fails$Q(function () {
	  return defineProperty$g(function () { /* empty */ }, 'length', { value: 8 }).length !== 8;
	});

	var TEMPLATE = String(String).split('String');

	var makeBuiltIn$3 = makeBuiltIn$4.exports = function (value, name, options) {
	  if (String(name).slice(0, 7) === 'Symbol(') {
	    name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
	  }
	  if (options && options.getter) name = 'get ' + name;
	  if (options && options.setter) name = 'set ' + name;
	  if (!hasOwn$n(value, 'name') || (CONFIGURABLE_FUNCTION_NAME$2 && value.name !== name)) {
	    if (DESCRIPTORS$n) defineProperty$g(value, 'name', { value: name, configurable: true });
	    else value.name = name;
	  }
	  if (CONFIGURABLE_LENGTH && options && hasOwn$n(options, 'arity') && value.length !== options.arity) {
	    defineProperty$g(value, 'length', { value: options.arity });
	  }
	  try {
	    if (options && hasOwn$n(options, 'constructor') && options.constructor) {
	      if (DESCRIPTORS$n) defineProperty$g(value, 'prototype', { writable: false });
	    // in V8 ~ Chrome 53, prototypes of some methods, like `Array.prototype.values`, are non-writable
	    } else if (value.prototype) value.prototype = undefined;
	  } catch (error) { /* empty */ }
	  var state = enforceInternalState$4(value);
	  if (!hasOwn$n(state, 'source')) {
	    state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
	  } return value;
	};

	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	// eslint-disable-next-line no-extend-native -- required
	Function.prototype.toString = makeBuiltIn$3(function toString() {
	  return isCallable$l(this) && getInternalState$a(this).source || inspectSource$2(this);
	}, 'toString');

	var isCallable$k = isCallable$t;
	var definePropertyModule$7 = objectDefineProperty;
	var makeBuiltIn$2 = makeBuiltIn$4.exports;
	var defineGlobalProperty$1 = defineGlobalProperty$3;

	var defineBuiltIn$h = function (O, key, value, options) {
	  if (!options) options = {};
	  var simple = options.enumerable;
	  var name = options.name !== undefined ? options.name : key;
	  if (isCallable$k(value)) makeBuiltIn$2(value, name, options);
	  if (options.global) {
	    if (simple) O[key] = value;
	    else defineGlobalProperty$1(key, value);
	  } else {
	    try {
	      if (!options.unsafe) delete O[key];
	      else if (O[key]) simple = true;
	    } catch (error) { /* empty */ }
	    if (simple) O[key] = value;
	    else definePropertyModule$7.f(O, key, {
	      value: value,
	      enumerable: false,
	      configurable: !options.nonConfigurable,
	      writable: !options.nonWritable
	    });
	  } return O;
	};

	var objectGetOwnPropertyNames = {};

	var ceil = Math.ceil;
	var floor$7 = Math.floor;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	// eslint-disable-next-line es/no-math-trunc -- safe
	var mathTrunc = Math.trunc || function trunc(x) {
	  var n = +x;
	  return (n > 0 ? floor$7 : ceil)(n);
	};

	var trunc$1 = mathTrunc;

	// `ToIntegerOrInfinity` abstract operation
	// https://tc39.es/ecma262/#sec-tointegerorinfinity
	var toIntegerOrInfinity$e = function (argument) {
	  var number = +argument;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return number !== number || number === 0 ? 0 : trunc$1(number);
	};

	var toIntegerOrInfinity$d = toIntegerOrInfinity$e;

	var max$4 = Math.max;
	var min$8 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex$7 = function (index, length) {
	  var integer = toIntegerOrInfinity$d(index);
	  return integer < 0 ? max$4(integer + length, 0) : min$8(integer, length);
	};

	var toIntegerOrInfinity$c = toIntegerOrInfinity$e;

	var min$7 = Math.min;

	// `ToLength` abstract operation
	// https://tc39.es/ecma262/#sec-tolength
	var toLength$a = function (argument) {
	  return argument > 0 ? min$7(toIntegerOrInfinity$c(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var toLength$9 = toLength$a;

	// `LengthOfArrayLike` abstract operation
	// https://tc39.es/ecma262/#sec-lengthofarraylike
	var lengthOfArrayLike$n = function (obj) {
	  return toLength$9(obj.length);
	};

	var toIndexedObject$c = toIndexedObject$e;
	var toAbsoluteIndex$6 = toAbsoluteIndex$7;
	var lengthOfArrayLike$m = lengthOfArrayLike$n;

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod$6 = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject$c($this);
	    var length = lengthOfArrayLike$m(O);
	    var index = toAbsoluteIndex$6(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare -- NaN check
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.es/ecma262/#sec-array.prototype.includes
	  includes: createMethod$6(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.es/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod$6(false)
	};

	var uncurryThis$J = functionUncurryThis;
	var hasOwn$m = hasOwnProperty_1;
	var toIndexedObject$b = toIndexedObject$e;
	var indexOf$1 = arrayIncludes.indexOf;
	var hiddenKeys$4 = hiddenKeys$6;

	var push$8 = uncurryThis$J([].push);

	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject$b(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !hasOwn$m(hiddenKeys$4, key) && hasOwn$m(O, key) && push$8(result, key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (hasOwn$m(O, key = names[i++])) {
	    ~indexOf$1(result, key) || push$8(result, key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys$3 = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var internalObjectKeys$1 = objectKeysInternal;
	var enumBugKeys$2 = enumBugKeys$3;

	var hiddenKeys$3 = enumBugKeys$2.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	// eslint-disable-next-line es/no-object-getownpropertynames -- safe
	objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return internalObjectKeys$1(O, hiddenKeys$3);
	};

	var objectGetOwnPropertySymbols = {};

	// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
	objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

	var getBuiltIn$f = getBuiltIn$i;
	var uncurryThis$I = functionUncurryThis;
	var getOwnPropertyNamesModule$2 = objectGetOwnPropertyNames;
	var getOwnPropertySymbolsModule$3 = objectGetOwnPropertySymbols;
	var anObject$p = anObject$r;

	var concat$3 = uncurryThis$I([].concat);

	// all object keys, includes non-enumerable and symbols
	var ownKeys$2 = getBuiltIn$f('Reflect', 'ownKeys') || function ownKeys(it) {
	  var keys = getOwnPropertyNamesModule$2.f(anObject$p(it));
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule$3.f;
	  return getOwnPropertySymbols ? concat$3(keys, getOwnPropertySymbols(it)) : keys;
	};

	var hasOwn$l = hasOwnProperty_1;
	var ownKeys$1 = ownKeys$2;
	var getOwnPropertyDescriptorModule$3 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$6 = objectDefineProperty;

	var copyConstructorProperties$4 = function (target, source, exceptions) {
	  var keys = ownKeys$1(source);
	  var defineProperty = definePropertyModule$6.f;
	  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule$3.f;
	  for (var i = 0; i < keys.length; i++) {
	    var key = keys[i];
	    if (!hasOwn$l(target, key) && !(exceptions && hasOwn$l(exceptions, key))) {
	      defineProperty(target, key, getOwnPropertyDescriptor(source, key));
	    }
	  }
	};

	var fails$P = fails$X;
	var isCallable$j = isCallable$t;

	var replacement = /#|\.prototype\./;

	var isForced$5 = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : isCallable$j(detection) ? fails$P(detection)
	    : !!detection;
	};

	var normalize = isForced$5.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced$5.data = {};
	var NATIVE = isForced$5.NATIVE = 'N';
	var POLYFILL = isForced$5.POLYFILL = 'P';

	var isForced_1 = isForced$5;

	var global$B = global$K;
	var getOwnPropertyDescriptor$5 = objectGetOwnPropertyDescriptor.f;
	var createNonEnumerableProperty$b = createNonEnumerableProperty$d;
	var defineBuiltIn$g = defineBuiltIn$h;
	var defineGlobalProperty = defineGlobalProperty$3;
	var copyConstructorProperties$3 = copyConstructorProperties$4;
	var isForced$4 = isForced_1;

	/*
	  options.target         - name of the target object
	  options.global         - target is the global object
	  options.stat           - export as static methods of target
	  options.proto          - export as prototype methods of target
	  options.real           - real prototype method for the `pure` version
	  options.forced         - export even if the native feature is available
	  options.bind           - bind methods to the target, required for the `pure` version
	  options.wrap           - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe         - use the simple assignment of property instead of delete + defineProperty
	  options.sham           - add a flag to not completely full polyfills
	  options.enumerable     - export as enumerable property
	  options.dontCallGetSet - prevent calling a getter on target
	  options.name           - the .name of the function if it does not match the key
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global$B;
	  } else if (STATIC) {
	    target = global$B[TARGET] || defineGlobalProperty(TARGET, {});
	  } else {
	    target = (global$B[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.dontCallGetSet) {
	      descriptor = getOwnPropertyDescriptor$5(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced$4(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty == typeof targetProperty) continue;
	      copyConstructorProperties$3(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty$b(sourceProperty, 'sham', true);
	    }
	    defineBuiltIn$g(target, key, sourceProperty, options);
	  }
	};

	var NATIVE_BIND$2 = functionBindNative;

	var FunctionPrototype$2 = Function.prototype;
	var apply$a = FunctionPrototype$2.apply;
	var call$q = FunctionPrototype$2.call;

	// eslint-disable-next-line es/no-reflect -- safe
	var functionApply$1 = typeof Reflect == 'object' && Reflect.apply || (NATIVE_BIND$2 ? call$q.bind(apply$a) : function () {
	  return call$q.apply(apply$a, arguments);
	});

	var isCallable$i = isCallable$t;

	var $String$2 = String;
	var $TypeError$g = TypeError;

	var aPossiblePrototype$1 = function (argument) {
	  if (typeof argument == 'object' || isCallable$i(argument)) return argument;
	  throw $TypeError$g("Can't set " + $String$2(argument) + ' as a prototype');
	};

	/* eslint-disable no-proto -- safe */

	var uncurryThis$H = functionUncurryThis;
	var anObject$o = anObject$r;
	var aPossiblePrototype = aPossiblePrototype$1;

	// `Object.setPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	// eslint-disable-next-line es/no-object-setprototypeof -- safe
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	    setter = uncurryThis$H(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set);
	    setter(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject$o(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var defineProperty$f = objectDefineProperty.f;

	var proxyAccessor$2 = function (Target, Source, key) {
	  key in Target || defineProperty$f(Target, key, {
	    configurable: true,
	    get: function () { return Source[key]; },
	    set: function (it) { Source[key] = it; }
	  });
	};

	var isCallable$h = isCallable$t;
	var isObject$l = isObject$r;
	var setPrototypeOf$7 = objectSetPrototypeOf;

	// makes subclassing work correct for wrapped built-ins
	var inheritIfRequired$6 = function ($this, dummy, Wrapper) {
	  var NewTarget, NewTargetPrototype;
	  if (
	    // it can work only with native `setPrototypeOf`
	    setPrototypeOf$7 &&
	    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
	    isCallable$h(NewTarget = dummy.constructor) &&
	    NewTarget !== Wrapper &&
	    isObject$l(NewTargetPrototype = NewTarget.prototype) &&
	    NewTargetPrototype !== Wrapper.prototype
	  ) setPrototypeOf$7($this, NewTargetPrototype);
	  return $this;
	};

	var wellKnownSymbol$t = wellKnownSymbol$v;

	var TO_STRING_TAG$5 = wellKnownSymbol$t('toStringTag');
	var test$1 = {};

	test$1[TO_STRING_TAG$5] = 'z';

	var toStringTagSupport = String(test$1) === '[object z]';

	var TO_STRING_TAG_SUPPORT$2 = toStringTagSupport;
	var isCallable$g = isCallable$t;
	var classofRaw$1 = classofRaw$2;
	var wellKnownSymbol$s = wellKnownSymbol$v;

	var TO_STRING_TAG$4 = wellKnownSymbol$s('toStringTag');
	var $Object$1 = Object;

	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw$1(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof$g = TO_STRING_TAG_SUPPORT$2 ? classofRaw$1 : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = $Object$1(it), TO_STRING_TAG$4)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw$1(O)
	    // ES3 arguments fallback
	    : (result = classofRaw$1(O)) == 'Object' && isCallable$g(O.callee) ? 'Arguments' : result;
	};

	var classof$f = classof$g;

	var $String$1 = String;

	var toString$k = function (argument) {
	  if (classof$f(argument) === 'Symbol') throw TypeError('Cannot convert a Symbol value to a string');
	  return $String$1(argument);
	};

	var toString$j = toString$k;

	var normalizeStringArgument$5 = function (argument, $default) {
	  return argument === undefined ? arguments.length < 2 ? '' : $default : toString$j(argument);
	};

	var isObject$k = isObject$r;
	var createNonEnumerableProperty$a = createNonEnumerableProperty$d;

	// `InstallErrorCause` abstract operation
	// https://tc39.es/proposal-error-cause/#sec-errorobjects-install-error-cause
	var installErrorCause$2 = function (O, options) {
	  if (isObject$k(options) && 'cause' in options) {
	    createNonEnumerableProperty$a(O, 'cause', options.cause);
	  }
	};

	var uncurryThis$G = functionUncurryThis;

	var $Error$1 = Error;
	var replace$7 = uncurryThis$G(''.replace);

	var TEST = (function (arg) { return String($Error$1(arg).stack); })('zxcasd');
	var V8_OR_CHAKRA_STACK_ENTRY = /\n\s*at [^:]*:[^\n]*/;
	var IS_V8_OR_CHAKRA_STACK = V8_OR_CHAKRA_STACK_ENTRY.test(TEST);

	var errorStackClear = function (stack, dropEntries) {
	  if (IS_V8_OR_CHAKRA_STACK && typeof stack == 'string' && !$Error$1.prepareStackTrace) {
	    while (dropEntries--) stack = replace$7(stack, V8_OR_CHAKRA_STACK_ENTRY, '');
	  } return stack;
	};

	var fails$O = fails$X;
	var createPropertyDescriptor$7 = createPropertyDescriptor$a;

	var errorStackInstallable = !fails$O(function () {
	  var error = Error('a');
	  if (!('stack' in error)) return true;
	  // eslint-disable-next-line es/no-object-defineproperty -- safe
	  Object.defineProperty(error, 'stack', createPropertyDescriptor$7(1, 7));
	  return error.stack !== 7;
	});

	var getBuiltIn$e = getBuiltIn$i;
	var hasOwn$k = hasOwnProperty_1;
	var createNonEnumerableProperty$9 = createNonEnumerableProperty$d;
	var isPrototypeOf$a = objectIsPrototypeOf;
	var setPrototypeOf$6 = objectSetPrototypeOf;
	var copyConstructorProperties$2 = copyConstructorProperties$4;
	var proxyAccessor$1 = proxyAccessor$2;
	var inheritIfRequired$5 = inheritIfRequired$6;
	var normalizeStringArgument$4 = normalizeStringArgument$5;
	var installErrorCause$1 = installErrorCause$2;
	var clearErrorStack$3 = errorStackClear;
	var ERROR_STACK_INSTALLABLE$1 = errorStackInstallable;
	var DESCRIPTORS$m = descriptors;

	var wrapErrorConstructorWithCause$2 = function (FULL_NAME, wrapper, FORCED, IS_AGGREGATE_ERROR) {
	  var STACK_TRACE_LIMIT = 'stackTraceLimit';
	  var OPTIONS_POSITION = IS_AGGREGATE_ERROR ? 2 : 1;
	  var path = FULL_NAME.split('.');
	  var ERROR_NAME = path[path.length - 1];
	  var OriginalError = getBuiltIn$e.apply(null, path);

	  if (!OriginalError) return;

	  var OriginalErrorPrototype = OriginalError.prototype;

	  // V8 9.3- bug https://bugs.chromium.org/p/v8/issues/detail?id=12006
	  if (hasOwn$k(OriginalErrorPrototype, 'cause')) delete OriginalErrorPrototype.cause;

	  if (!FORCED) return OriginalError;

	  var BaseError = getBuiltIn$e('Error');

	  var WrappedError = wrapper(function (a, b) {
	    var message = normalizeStringArgument$4(IS_AGGREGATE_ERROR ? b : a, undefined);
	    var result = IS_AGGREGATE_ERROR ? new OriginalError(a) : new OriginalError();
	    if (message !== undefined) createNonEnumerableProperty$9(result, 'message', message);
	    if (ERROR_STACK_INSTALLABLE$1) createNonEnumerableProperty$9(result, 'stack', clearErrorStack$3(result.stack, 2));
	    if (this && isPrototypeOf$a(OriginalErrorPrototype, this)) inheritIfRequired$5(result, this, WrappedError);
	    if (arguments.length > OPTIONS_POSITION) installErrorCause$1(result, arguments[OPTIONS_POSITION]);
	    return result;
	  });

	  WrappedError.prototype = OriginalErrorPrototype;

	  if (ERROR_NAME !== 'Error') {
	    if (setPrototypeOf$6) setPrototypeOf$6(WrappedError, BaseError);
	    else copyConstructorProperties$2(WrappedError, BaseError, { name: true });
	  } else if (DESCRIPTORS$m && STACK_TRACE_LIMIT in OriginalError) {
	    proxyAccessor$1(WrappedError, OriginalError, STACK_TRACE_LIMIT);
	    proxyAccessor$1(WrappedError, OriginalError, 'prepareStackTrace');
	  }

	  copyConstructorProperties$2(WrappedError, OriginalError);

	  try {
	    // Safari 13- bug: WebAssembly errors does not have a proper `.name`
	    if (OriginalErrorPrototype.name !== ERROR_NAME) {
	      createNonEnumerableProperty$9(OriginalErrorPrototype, 'name', ERROR_NAME);
	    }
	    OriginalErrorPrototype.constructor = WrappedError;
	  } catch (error) { /* empty */ }

	  return WrappedError;
	};

	/* eslint-disable no-unused-vars -- required for functions `.length` */

	var $$14 = _export;
	var global$A = global$K;
	var apply$9 = functionApply$1;
	var wrapErrorConstructorWithCause$1 = wrapErrorConstructorWithCause$2;

	var WEB_ASSEMBLY = 'WebAssembly';
	var WebAssembly = global$A[WEB_ASSEMBLY];

	var FORCED$b = Error('e', { cause: 7 }).cause !== 7;

	var exportGlobalErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  var O = {};
	  O[ERROR_NAME] = wrapErrorConstructorWithCause$1(ERROR_NAME, wrapper, FORCED$b);
	  $$14({ global: true, constructor: true, arity: 1, forced: FORCED$b }, O);
	};

	var exportWebAssemblyErrorCauseWrapper = function (ERROR_NAME, wrapper) {
	  if (WebAssembly && WebAssembly[ERROR_NAME]) {
	    var O = {};
	    O[ERROR_NAME] = wrapErrorConstructorWithCause$1(WEB_ASSEMBLY + '.' + ERROR_NAME, wrapper, FORCED$b);
	    $$14({ target: WEB_ASSEMBLY, stat: true, constructor: true, arity: 1, forced: FORCED$b }, O);
	  }
	};

	// https://github.com/tc39/proposal-error-cause
	exportGlobalErrorCauseWrapper('Error', function (init) {
	  return function Error(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('EvalError', function (init) {
	  return function EvalError(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('RangeError', function (init) {
	  return function RangeError(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('ReferenceError', function (init) {
	  return function ReferenceError(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('SyntaxError', function (init) {
	  return function SyntaxError(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('TypeError', function (init) {
	  return function TypeError(message) { return apply$9(init, this, arguments); };
	});
	exportGlobalErrorCauseWrapper('URIError', function (init) {
	  return function URIError(message) { return apply$9(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('CompileError', function (init) {
	  return function CompileError(message) { return apply$9(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('LinkError', function (init) {
	  return function LinkError(message) { return apply$9(init, this, arguments); };
	});
	exportWebAssemblyErrorCauseWrapper('RuntimeError', function (init) {
	  return function RuntimeError(message) { return apply$9(init, this, arguments); };
	});

	var classof$e = classofRaw$2;

	// `IsArray` abstract operation
	// https://tc39.es/ecma262/#sec-isarray
	// eslint-disable-next-line es/no-array-isarray -- safe
	var isArray$6 = Array.isArray || function isArray(argument) {
	  return classof$e(argument) == 'Array';
	};

	var DESCRIPTORS$l = descriptors;
	var isArray$5 = isArray$6;

	var $TypeError$f = TypeError;
	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var getOwnPropertyDescriptor$4 = Object.getOwnPropertyDescriptor;

	// Safari < 13 does not throw an error in this case
	var SILENT_ON_NON_WRITABLE_LENGTH_SET = DESCRIPTORS$l && !function () {
	  // makes no sense without proper strict mode support
	  if (this !== undefined) return true;
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).length = 1;
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	var arraySetLength = SILENT_ON_NON_WRITABLE_LENGTH_SET ? function (O, length) {
	  if (isArray$5(O) && !getOwnPropertyDescriptor$4(O, 'length').writable) {
	    throw $TypeError$f('Cannot set read only .length');
	  } return O.length = length;
	} : function (O, length) {
	  return O.length = length;
	};

	var $TypeError$e = TypeError;
	var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF; // 2 ** 53 - 1 == 9007199254740991

	var doesNotExceedSafeInteger$4 = function (it) {
	  if (it > MAX_SAFE_INTEGER) throw $TypeError$e('Maximum allowed index exceeded');
	  return it;
	};

	var $$13 = _export;
	var toObject$h = toObject$j;
	var lengthOfArrayLike$l = lengthOfArrayLike$n;
	var setArrayLength$1 = arraySetLength;
	var doesNotExceedSafeInteger$3 = doesNotExceedSafeInteger$4;
	var fails$N = fails$X;

	var INCORRECT_TO_LENGTH = fails$N(function () {
	  return [].push.call({ length: 0x100000000 }, 1) !== 4294967297;
	});

	// V8 and Safari <= 15.4, FF < 23 throws InternalError
	// https://bugs.chromium.org/p/v8/issues/detail?id=12681
	var SILENT_ON_NON_WRITABLE_LENGTH = !function () {
	  try {
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    Object.defineProperty([], 'length', { writable: false }).push();
	  } catch (error) {
	    return error instanceof TypeError;
	  }
	}();

	// `Array.prototype.push` method
	// https://tc39.es/ecma262/#sec-array.prototype.push
	$$13({ target: 'Array', proto: true, arity: 1, forced: INCORRECT_TO_LENGTH || SILENT_ON_NON_WRITABLE_LENGTH }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  push: function push(item) {
	    var O = toObject$h(this);
	    var len = lengthOfArrayLike$l(O);
	    var argCount = arguments.length;
	    doesNotExceedSafeInteger$3(len + argCount);
	    for (var i = 0; i < argCount; i++) {
	      O[len] = arguments[i];
	      len++;
	    }
	    setArrayLength$1(O, len);
	    return len;
	  }
	});

	var uncurryThis$F = functionUncurryThis;
	var fails$M = fails$X;
	var isCallable$f = isCallable$t;
	var classof$d = classof$g;
	var getBuiltIn$d = getBuiltIn$i;
	var inspectSource$1 = inspectSource$3;

	var noop = function () { /* empty */ };
	var empty = [];
	var construct$1 = getBuiltIn$d('Reflect', 'construct');
	var constructorRegExp = /^\s*(?:class|function)\b/;
	var exec$4 = uncurryThis$F(constructorRegExp.exec);
	var INCORRECT_TO_STRING$2 = !constructorRegExp.exec(noop);

	var isConstructorModern = function isConstructor(argument) {
	  if (!isCallable$f(argument)) return false;
	  try {
	    construct$1(noop, empty, argument);
	    return true;
	  } catch (error) {
	    return false;
	  }
	};

	var isConstructorLegacy = function isConstructor(argument) {
	  if (!isCallable$f(argument)) return false;
	  switch (classof$d(argument)) {
	    case 'AsyncFunction':
	    case 'GeneratorFunction':
	    case 'AsyncGeneratorFunction': return false;
	  }
	  try {
	    // we can't check .prototype since constructors produced by .bind haven't it
	    // `Function#toString` throws on some built-it function in some legacy engines
	    // (for example, `DOMQuad` and similar in FF41-)
	    return INCORRECT_TO_STRING$2 || !!exec$4(constructorRegExp, inspectSource$1(argument));
	  } catch (error) {
	    return true;
	  }
	};

	isConstructorLegacy.sham = true;

	// `IsConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-isconstructor
	var isConstructor$4 = !construct$1 || fails$M(function () {
	  var called;
	  return isConstructorModern(isConstructorModern.call)
	    || !isConstructorModern(Object)
	    || !isConstructorModern(function () { called = true; })
	    || called;
	}) ? isConstructorLegacy : isConstructorModern;

	var toPropertyKey$2 = toPropertyKey$5;
	var definePropertyModule$5 = objectDefineProperty;
	var createPropertyDescriptor$6 = createPropertyDescriptor$a;

	var createProperty$6 = function (object, key, value) {
	  var propertyKey = toPropertyKey$2(key);
	  if (propertyKey in object) definePropertyModule$5.f(object, propertyKey, createPropertyDescriptor$6(0, value));
	  else object[propertyKey] = value;
	};

	var fails$L = fails$X;
	var wellKnownSymbol$r = wellKnownSymbol$v;
	var V8_VERSION$2 = engineV8Version;

	var SPECIES$6 = wellKnownSymbol$r('species');

	var arrayMethodHasSpeciesSupport$5 = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return V8_VERSION$2 >= 51 || !fails$L(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$6] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};

	var uncurryThis$E = functionUncurryThis;

	var arraySlice$a = uncurryThis$E([].slice);

	var $$12 = _export;
	var isArray$4 = isArray$6;
	var isConstructor$3 = isConstructor$4;
	var isObject$j = isObject$r;
	var toAbsoluteIndex$5 = toAbsoluteIndex$7;
	var lengthOfArrayLike$k = lengthOfArrayLike$n;
	var toIndexedObject$a = toIndexedObject$e;
	var createProperty$5 = createProperty$6;
	var wellKnownSymbol$q = wellKnownSymbol$v;
	var arrayMethodHasSpeciesSupport$4 = arrayMethodHasSpeciesSupport$5;
	var nativeSlice = arraySlice$a;

	var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport$4('slice');

	var SPECIES$5 = wellKnownSymbol$q('species');
	var $Array$4 = Array;
	var max$3 = Math.max;

	// `Array.prototype.slice` method
	// https://tc39.es/ecma262/#sec-array.prototype.slice
	// fallback for not array-like ES3 strings and DOM objects
	$$12({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 }, {
	  slice: function slice(start, end) {
	    var O = toIndexedObject$a(this);
	    var length = lengthOfArrayLike$k(O);
	    var k = toAbsoluteIndex$5(start, length);
	    var fin = toAbsoluteIndex$5(end === undefined ? length : end, length);
	    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
	    var Constructor, result, n;
	    if (isArray$4(O)) {
	      Constructor = O.constructor;
	      // cross-realm fallback
	      if (isConstructor$3(Constructor) && (Constructor === $Array$4 || isArray$4(Constructor.prototype))) {
	        Constructor = undefined;
	      } else if (isObject$j(Constructor)) {
	        Constructor = Constructor[SPECIES$5];
	        if (Constructor === null) Constructor = undefined;
	      }
	      if (Constructor === $Array$4 || Constructor === undefined) {
	        return nativeSlice(O, k, fin);
	      }
	    }
	    result = new (Constructor === undefined ? $Array$4 : Constructor)(max$3(fin - k, 0));
	    for (n = 0; k < fin; k++, n++) if (k in O) createProperty$5(result, n, O[k]);
	    result.length = n;
	    return result;
	  }
	});

	var anObject$n = anObject$r;

	// `RegExp.prototype.flags` getter implementation
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
	var regexpFlags$1 = function () {
	  var that = anObject$n(this);
	  var result = '';
	  if (that.hasIndices) result += 'd';
	  if (that.global) result += 'g';
	  if (that.ignoreCase) result += 'i';
	  if (that.multiline) result += 'm';
	  if (that.dotAll) result += 's';
	  if (that.unicode) result += 'u';
	  if (that.unicodeSets) result += 'v';
	  if (that.sticky) result += 'y';
	  return result;
	};

	var fails$K = fails$X;
	var global$z = global$K;

	// babel-minify and Closure Compiler transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
	var $RegExp$2 = global$z.RegExp;

	var UNSUPPORTED_Y$3 = fails$K(function () {
	  var re = $RegExp$2('a', 'y');
	  re.lastIndex = 2;
	  return re.exec('abcd') != null;
	});

	// UC Browser bug
	// https://github.com/zloirock/core-js/issues/1008
	var MISSED_STICKY$2 = UNSUPPORTED_Y$3 || fails$K(function () {
	  return !$RegExp$2('a', 'y').sticky;
	});

	var BROKEN_CARET = UNSUPPORTED_Y$3 || fails$K(function () {
	  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
	  var re = $RegExp$2('^r', 'gy');
	  re.lastIndex = 2;
	  return re.exec('str') != null;
	});

	var regexpStickyHelpers = {
	  BROKEN_CARET: BROKEN_CARET,
	  MISSED_STICKY: MISSED_STICKY$2,
	  UNSUPPORTED_Y: UNSUPPORTED_Y$3
	};

	var objectDefineProperties = {};

	var internalObjectKeys = objectKeysInternal;
	var enumBugKeys$1 = enumBugKeys$3;

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	// eslint-disable-next-line es/no-object-keys -- safe
	var objectKeys$4 = Object.keys || function keys(O) {
	  return internalObjectKeys(O, enumBugKeys$1);
	};

	var DESCRIPTORS$k = descriptors;
	var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
	var definePropertyModule$4 = objectDefineProperty;
	var anObject$m = anObject$r;
	var toIndexedObject$9 = toIndexedObject$e;
	var objectKeys$3 = objectKeys$4;

	// `Object.defineProperties` method
	// https://tc39.es/ecma262/#sec-object.defineproperties
	// eslint-disable-next-line es/no-object-defineproperties -- safe
	objectDefineProperties.f = DESCRIPTORS$k && !V8_PROTOTYPE_DEFINE_BUG ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject$m(O);
	  var props = toIndexedObject$9(Properties);
	  var keys = objectKeys$3(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) definePropertyModule$4.f(O, key = keys[index++], props[key]);
	  return O;
	};

	var getBuiltIn$c = getBuiltIn$i;

	var html$2 = getBuiltIn$c('document', 'documentElement');

	/* global ActiveXObject -- old IE, WSH */

	var anObject$l = anObject$r;
	var definePropertiesModule$1 = objectDefineProperties;
	var enumBugKeys = enumBugKeys$3;
	var hiddenKeys$2 = hiddenKeys$6;
	var html$1 = html$2;
	var documentCreateElement$1 = documentCreateElement$2;
	var sharedKey$2 = sharedKey$4;

	var GT = '>';
	var LT = '<';
	var PROTOTYPE$2 = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO$1 = sharedKey$2('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var NullProtoObjectViaIFrame = function () {
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = documentCreateElement$1('iframe');
	  var JS = 'java' + SCRIPT + ':';
	  var iframeDocument;
	  iframe.style.display = 'none';
	  html$1.appendChild(iframe);
	  // https://github.com/zloirock/core-js/issues/475
	  iframe.src = String(JS);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(scriptTag('document.F=Object'));
	  iframeDocument.close();
	  return iframeDocument.F;
	};

	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    activeXDocument = new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = typeof document != 'undefined'
	    ? document.domain && activeXDocument
	      ? NullProtoObjectViaActiveX(activeXDocument) // old IE
	      : NullProtoObjectViaIFrame()
	    : NullProtoObjectViaActiveX(activeXDocument); // WSH
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE$2][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys$2[IE_PROTO$1] = true;

	// `Object.create` method
	// https://tc39.es/ecma262/#sec-object.create
	// eslint-disable-next-line es/no-object-create -- safe
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE$2] = anObject$l(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE$2] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO$1] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : definePropertiesModule$1.f(result, Properties);
	};

	var fails$J = fails$X;
	var global$y = global$K;

	// babel-minify and Closure Compiler transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
	var $RegExp$1 = global$y.RegExp;

	var regexpUnsupportedDotAll = fails$J(function () {
	  var re = $RegExp$1('.', 's');
	  return !(re.dotAll && re.exec('\n') && re.flags === 's');
	});

	var fails$I = fails$X;
	var global$x = global$K;

	// babel-minify and Closure Compiler transpiles RegExp('(?<a>b)', 'g') -> /(?<a>b)/g and it causes SyntaxError
	var $RegExp = global$x.RegExp;

	var regexpUnsupportedNcg = fails$I(function () {
	  var re = $RegExp('(?<a>b)', 'g');
	  return re.exec('b').groups.a !== 'b' ||
	    'b'.replace(re, '$<a>c') !== 'bc';
	});

	/* eslint-disable regexp/no-empty-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
	/* eslint-disable regexp/no-useless-quantifier -- testing */
	var call$p = functionCall;
	var uncurryThis$D = functionUncurryThis;
	var toString$i = toString$k;
	var regexpFlags = regexpFlags$1;
	var stickyHelpers$2 = regexpStickyHelpers;
	var shared$3 = shared$7.exports;
	var create$8 = objectCreate;
	var getInternalState$9 = internalState.get;
	var UNSUPPORTED_DOT_ALL$2 = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG$1 = regexpUnsupportedNcg;

	var nativeReplace = shared$3('native-string-replace', String.prototype.replace);
	var nativeExec = RegExp.prototype.exec;
	var patchedExec = nativeExec;
	var charAt$6 = uncurryThis$D(''.charAt);
	var indexOf = uncurryThis$D(''.indexOf);
	var replace$6 = uncurryThis$D(''.replace);
	var stringSlice$8 = uncurryThis$D(''.slice);

	var UPDATES_LAST_INDEX_WRONG = (function () {
	  var re1 = /a/;
	  var re2 = /b*/g;
	  call$p(nativeExec, re1, 'a');
	  call$p(nativeExec, re2, 'a');
	  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
	})();

	var UNSUPPORTED_Y$2 = stickyHelpers$2.BROKEN_CARET;

	// nonparticipating capturing group, copied from es5-shim's String#split patch.
	var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

	var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$2 || UNSUPPORTED_DOT_ALL$2 || UNSUPPORTED_NCG$1;

	if (PATCH) {
	  patchedExec = function exec(string) {
	    var re = this;
	    var state = getInternalState$9(re);
	    var str = toString$i(string);
	    var raw = state.raw;
	    var result, reCopy, lastIndex, match, i, object, group;

	    if (raw) {
	      raw.lastIndex = re.lastIndex;
	      result = call$p(patchedExec, raw, str);
	      re.lastIndex = raw.lastIndex;
	      return result;
	    }

	    var groups = state.groups;
	    var sticky = UNSUPPORTED_Y$2 && re.sticky;
	    var flags = call$p(regexpFlags, re);
	    var source = re.source;
	    var charsAdded = 0;
	    var strCopy = str;

	    if (sticky) {
	      flags = replace$6(flags, 'y', '');
	      if (indexOf(flags, 'g') === -1) {
	        flags += 'g';
	      }

	      strCopy = stringSlice$8(str, re.lastIndex);
	      // Support anchored sticky behavior.
	      if (re.lastIndex > 0 && (!re.multiline || re.multiline && charAt$6(str, re.lastIndex - 1) !== '\n')) {
	        source = '(?: ' + source + ')';
	        strCopy = ' ' + strCopy;
	        charsAdded++;
	      }
	      // ^(? + rx + ) is needed, in combination with some str slicing, to
	      // simulate the 'y' flag.
	      reCopy = new RegExp('^(?:' + source + ')', flags);
	    }

	    if (NPCG_INCLUDED) {
	      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
	    }
	    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

	    match = call$p(nativeExec, sticky ? reCopy : re, strCopy);

	    if (sticky) {
	      if (match) {
	        match.input = stringSlice$8(match.input, charsAdded);
	        match[0] = stringSlice$8(match[0], charsAdded);
	        match.index = re.lastIndex;
	        re.lastIndex += match[0].length;
	      } else re.lastIndex = 0;
	    } else if (UPDATES_LAST_INDEX_WRONG && match) {
	      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
	    }
	    if (NPCG_INCLUDED && match && match.length > 1) {
	      // Fix browsers whose `exec` methods don't consistently return `undefined`
	      // for NPCG, like IE8. NOTE: This doesn't work for /(.?)?/
	      call$p(nativeReplace, match[0], reCopy, function () {
	        for (i = 1; i < arguments.length - 2; i++) {
	          if (arguments[i] === undefined) match[i] = undefined;
	        }
	      });
	    }

	    if (match && groups) {
	      match.groups = object = create$8(null);
	      for (i = 0; i < groups.length; i++) {
	        group = groups[i];
	        object[group[0]] = match[group[1]];
	      }
	    }

	    return match;
	  };
	}

	var regexpExec$3 = patchedExec;

	var $$11 = _export;
	var exec$3 = regexpExec$3;

	// `RegExp.prototype.exec` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.exec
	$$11({ target: 'RegExp', proto: true, forced: /./.exec !== exec$3 }, {
	  exec: exec$3
	});

	var classofRaw = classofRaw$2;
	var uncurryThis$C = functionUncurryThis;

	var functionUncurryThisClause = function (fn) {
	  // Nashorn bug:
	  //   https://github.com/zloirock/core-js/issues/1128
	  //   https://github.com/zloirock/core-js/issues/1130
	  if (classofRaw(fn) === 'Function') return uncurryThis$C(fn);
	};

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var uncurryThis$B = functionUncurryThisClause;
	var defineBuiltIn$f = defineBuiltIn$h;
	var regexpExec$2 = regexpExec$3;
	var fails$H = fails$X;
	var wellKnownSymbol$p = wellKnownSymbol$v;
	var createNonEnumerableProperty$8 = createNonEnumerableProperty$d;

	var SPECIES$4 = wellKnownSymbol$p('species');
	var RegExpPrototype$5 = RegExp.prototype;

	var fixRegexpWellKnownSymbolLogic = function (KEY, exec, FORCED, SHAM) {
	  var SYMBOL = wellKnownSymbol$p(KEY);

	  var DELEGATES_TO_SYMBOL = !fails$H(function () {
	    // String methods call symbol-named RegEp methods
	    var O = {};
	    O[SYMBOL] = function () { return 7; };
	    return ''[KEY](O) != 7;
	  });

	  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails$H(function () {
	    // Symbol-named RegExp methods call .exec
	    var execCalled = false;
	    var re = /a/;

	    if (KEY === 'split') {
	      // We can't use real regex here since it causes deoptimization
	      // and serious performance degradation in V8
	      // https://github.com/zloirock/core-js/issues/306
	      re = {};
	      // RegExp[@@split] doesn't call the regex's exec method, but first creates
	      // a new one. We need to return the patched regex when creating the new one.
	      re.constructor = {};
	      re.constructor[SPECIES$4] = function () { return re; };
	      re.flags = '';
	      re[SYMBOL] = /./[SYMBOL];
	    }

	    re.exec = function () { execCalled = true; return null; };

	    re[SYMBOL]('');
	    return !execCalled;
	  });

	  if (
	    !DELEGATES_TO_SYMBOL ||
	    !DELEGATES_TO_EXEC ||
	    FORCED
	  ) {
	    var uncurriedNativeRegExpMethod = uncurryThis$B(/./[SYMBOL]);
	    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
	      var uncurriedNativeMethod = uncurryThis$B(nativeMethod);
	      var $exec = regexp.exec;
	      if ($exec === regexpExec$2 || $exec === RegExpPrototype$5.exec) {
	        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
	          // The native String method already delegates to @@method (this
	          // polyfilled function), leasing to infinite recursion.
	          // We avoid it by directly calling the native @@method method.
	          return { done: true, value: uncurriedNativeRegExpMethod(regexp, str, arg2) };
	        }
	        return { done: true, value: uncurriedNativeMethod(str, regexp, arg2) };
	      }
	      return { done: false };
	    });

	    defineBuiltIn$f(String.prototype, KEY, methods[0]);
	    defineBuiltIn$f(RegExpPrototype$5, SYMBOL, methods[1]);
	  }

	  if (SHAM) createNonEnumerableProperty$8(RegExpPrototype$5[SYMBOL], 'sham', true);
	};

	var uncurryThis$A = functionUncurryThis;
	var toIntegerOrInfinity$b = toIntegerOrInfinity$e;
	var toString$h = toString$k;
	var requireObjectCoercible$a = requireObjectCoercible$d;

	var charAt$5 = uncurryThis$A(''.charAt);
	var charCodeAt$2 = uncurryThis$A(''.charCodeAt);
	var stringSlice$7 = uncurryThis$A(''.slice);

	var createMethod$5 = function (CONVERT_TO_STRING) {
	  return function ($this, pos) {
	    var S = toString$h(requireObjectCoercible$a($this));
	    var position = toIntegerOrInfinity$b(pos);
	    var size = S.length;
	    var first, second;
	    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
	    first = charCodeAt$2(S, position);
	    return first < 0xD800 || first > 0xDBFF || position + 1 === size
	      || (second = charCodeAt$2(S, position + 1)) < 0xDC00 || second > 0xDFFF
	        ? CONVERT_TO_STRING
	          ? charAt$5(S, position)
	          : first
	        : CONVERT_TO_STRING
	          ? stringSlice$7(S, position, position + 2)
	          : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
	  };
	};

	var stringMultibyte = {
	  // `String.prototype.codePointAt` method
	  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
	  codeAt: createMethod$5(false),
	  // `String.prototype.at` method
	  // https://github.com/mathiasbynens/String.prototype.at
	  charAt: createMethod$5(true)
	};

	var charAt$4 = stringMultibyte.charAt;

	// `AdvanceStringIndex` abstract operation
	// https://tc39.es/ecma262/#sec-advancestringindex
	var advanceStringIndex$3 = function (S, index, unicode) {
	  return index + (unicode ? charAt$4(S, index).length : 1);
	};

	var uncurryThis$z = functionUncurryThis;
	var toObject$g = toObject$j;

	var floor$6 = Math.floor;
	var charAt$3 = uncurryThis$z(''.charAt);
	var replace$5 = uncurryThis$z(''.replace);
	var stringSlice$6 = uncurryThis$z(''.slice);
	var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
	var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

	// `GetSubstitution` abstract operation
	// https://tc39.es/ecma262/#sec-getsubstitution
	var getSubstitution$1 = function (matched, str, position, captures, namedCaptures, replacement) {
	  var tailPos = position + matched.length;
	  var m = captures.length;
	  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
	  if (namedCaptures !== undefined) {
	    namedCaptures = toObject$g(namedCaptures);
	    symbols = SUBSTITUTION_SYMBOLS;
	  }
	  return replace$5(replacement, symbols, function (match, ch) {
	    var capture;
	    switch (charAt$3(ch, 0)) {
	      case '$': return '$';
	      case '&': return matched;
	      case '`': return stringSlice$6(str, 0, position);
	      case "'": return stringSlice$6(str, tailPos);
	      case '<':
	        capture = namedCaptures[stringSlice$6(ch, 1, -1)];
	        break;
	      default: // \d\d?
	        var n = +ch;
	        if (n === 0) return match;
	        if (n > m) {
	          var f = floor$6(n / 10);
	          if (f === 0) return match;
	          if (f <= m) return captures[f - 1] === undefined ? charAt$3(ch, 1) : captures[f - 1] + charAt$3(ch, 1);
	          return match;
	        }
	        capture = captures[n - 1];
	    }
	    return capture === undefined ? '' : capture;
	  });
	};

	var call$o = functionCall;
	var anObject$k = anObject$r;
	var isCallable$e = isCallable$t;
	var classof$c = classofRaw$2;
	var regexpExec$1 = regexpExec$3;

	var $TypeError$d = TypeError;

	// `RegExpExec` abstract operation
	// https://tc39.es/ecma262/#sec-regexpexec
	var regexpExecAbstract = function (R, S) {
	  var exec = R.exec;
	  if (isCallable$e(exec)) {
	    var result = call$o(exec, R, S);
	    if (result !== null) anObject$k(result);
	    return result;
	  }
	  if (classof$c(R) === 'RegExp') return call$o(regexpExec$1, R, S);
	  throw $TypeError$d('RegExp#exec called on incompatible receiver');
	};

	var apply$8 = functionApply$1;
	var call$n = functionCall;
	var uncurryThis$y = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic$3 = fixRegexpWellKnownSymbolLogic;
	var fails$G = fails$X;
	var anObject$j = anObject$r;
	var isCallable$d = isCallable$t;
	var isNullOrUndefined$8 = isNullOrUndefined$b;
	var toIntegerOrInfinity$a = toIntegerOrInfinity$e;
	var toLength$8 = toLength$a;
	var toString$g = toString$k;
	var requireObjectCoercible$9 = requireObjectCoercible$d;
	var advanceStringIndex$2 = advanceStringIndex$3;
	var getMethod$5 = getMethod$7;
	var getSubstitution = getSubstitution$1;
	var regExpExec$3 = regexpExecAbstract;
	var wellKnownSymbol$o = wellKnownSymbol$v;

	var REPLACE = wellKnownSymbol$o('replace');
	var max$2 = Math.max;
	var min$6 = Math.min;
	var concat$2 = uncurryThis$y([].concat);
	var push$7 = uncurryThis$y([].push);
	var stringIndexOf$2 = uncurryThis$y(''.indexOf);
	var stringSlice$5 = uncurryThis$y(''.slice);

	var maybeToString = function (it) {
	  return it === undefined ? it : String(it);
	};

	// IE <= 11 replaces $0 with the whole match, as if it was $&
	// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
	var REPLACE_KEEPS_$0 = (function () {
	  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
	  return 'a'.replace(/./, '$0') === '$0';
	})();

	// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
	var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
	  if (/./[REPLACE]) {
	    return /./[REPLACE]('a', '$0') === '';
	  }
	  return false;
	})();

	var REPLACE_SUPPORTS_NAMED_GROUPS = !fails$G(function () {
	  var re = /./;
	  re.exec = function () {
	    var result = [];
	    result.groups = { a: '7' };
	    return result;
	  };
	  // eslint-disable-next-line regexp/no-useless-dollar-replacements -- false positive
	  return ''.replace(re, '$<a>') !== '7';
	});

	// @@replace logic
	fixRegExpWellKnownSymbolLogic$3('replace', function (_, nativeReplace, maybeCallNative) {
	  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

	  return [
	    // `String.prototype.replace` method
	    // https://tc39.es/ecma262/#sec-string.prototype.replace
	    function replace(searchValue, replaceValue) {
	      var O = requireObjectCoercible$9(this);
	      var replacer = isNullOrUndefined$8(searchValue) ? undefined : getMethod$5(searchValue, REPLACE);
	      return replacer
	        ? call$n(replacer, searchValue, O, replaceValue)
	        : call$n(nativeReplace, toString$g(O), searchValue, replaceValue);
	    },
	    // `RegExp.prototype[@@replace]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
	    function (string, replaceValue) {
	      var rx = anObject$j(this);
	      var S = toString$g(string);

	      if (
	        typeof replaceValue == 'string' &&
	        stringIndexOf$2(replaceValue, UNSAFE_SUBSTITUTE) === -1 &&
	        stringIndexOf$2(replaceValue, '$<') === -1
	      ) {
	        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
	        if (res.done) return res.value;
	      }

	      var functionalReplace = isCallable$d(replaceValue);
	      if (!functionalReplace) replaceValue = toString$g(replaceValue);

	      var global = rx.global;
	      if (global) {
	        var fullUnicode = rx.unicode;
	        rx.lastIndex = 0;
	      }
	      var results = [];
	      while (true) {
	        var result = regExpExec$3(rx, S);
	        if (result === null) break;

	        push$7(results, result);
	        if (!global) break;

	        var matchStr = toString$g(result[0]);
	        if (matchStr === '') rx.lastIndex = advanceStringIndex$2(S, toLength$8(rx.lastIndex), fullUnicode);
	      }

	      var accumulatedResult = '';
	      var nextSourcePosition = 0;
	      for (var i = 0; i < results.length; i++) {
	        result = results[i];

	        var matched = toString$g(result[0]);
	        var position = max$2(min$6(toIntegerOrInfinity$a(result.index), S.length), 0);
	        var captures = [];
	        // NOTE: This is equivalent to
	        //   captures = result.slice(1).map(maybeToString)
	        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
	        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
	        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
	        for (var j = 1; j < result.length; j++) push$7(captures, maybeToString(result[j]));
	        var namedCaptures = result.groups;
	        if (functionalReplace) {
	          var replacerArgs = concat$2([matched], captures, position, S);
	          if (namedCaptures !== undefined) push$7(replacerArgs, namedCaptures);
	          var replacement = toString$g(apply$8(replaceValue, undefined, replacerArgs));
	        } else {
	          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
	        }
	        if (position >= nextSourcePosition) {
	          accumulatedResult += stringSlice$5(S, nextSourcePosition, position) + replacement;
	          nextSourcePosition = position + matched.length;
	        }
	      }
	      return accumulatedResult + stringSlice$5(S, nextSourcePosition);
	    }
	  ];
	}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

	var wellKnownSymbol$n = wellKnownSymbol$v;
	var create$7 = objectCreate;
	var defineProperty$e = objectDefineProperty.f;

	var UNSCOPABLES = wellKnownSymbol$n('unscopables');
	var ArrayPrototype$1 = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype$1[UNSCOPABLES] == undefined) {
	  defineProperty$e(ArrayPrototype$1, UNSCOPABLES, {
	    configurable: true,
	    value: create$7(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables$7 = function (key) {
	  ArrayPrototype$1[UNSCOPABLES][key] = true;
	};

	var iterators = {};

	var fails$F = fails$X;

	var correctPrototypeGetter = !fails$F(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var hasOwn$j = hasOwnProperty_1;
	var isCallable$c = isCallable$t;
	var toObject$f = toObject$j;
	var sharedKey$1 = sharedKey$4;
	var CORRECT_PROTOTYPE_GETTER$2 = correctPrototypeGetter;

	var IE_PROTO = sharedKey$1('IE_PROTO');
	var $Object = Object;
	var ObjectPrototype$4 = $Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	// eslint-disable-next-line es/no-object-getprototypeof -- safe
	var objectGetPrototypeOf$1 = CORRECT_PROTOTYPE_GETTER$2 ? $Object.getPrototypeOf : function (O) {
	  var object = toObject$f(O);
	  if (hasOwn$j(object, IE_PROTO)) return object[IE_PROTO];
	  var constructor = object.constructor;
	  if (isCallable$c(constructor) && object instanceof constructor) {
	    return constructor.prototype;
	  } return object instanceof $Object ? ObjectPrototype$4 : null;
	};

	var fails$E = fails$X;
	var isCallable$b = isCallable$t;
	var isObject$i = isObject$r;
	var getPrototypeOf$5 = objectGetPrototypeOf$1;
	var defineBuiltIn$e = defineBuiltIn$h;
	var wellKnownSymbol$m = wellKnownSymbol$v;

	var ITERATOR$6 = wellKnownSymbol$m('iterator');
	var BUGGY_SAFARI_ITERATORS$1 = false;

	// `%IteratorPrototype%` object
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

	/* eslint-disable es/no-array-prototype-keys -- safe */
	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS$1 = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = getPrototypeOf$5(getPrototypeOf$5(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
	  }
	}

	var NEW_ITERATOR_PROTOTYPE = !isObject$i(IteratorPrototype$2) || fails$E(function () {
	  var test = {};
	  // FF44- legacy iterators case
	  return IteratorPrototype$2[ITERATOR$6].call(test) !== test;
	});

	if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

	// `%IteratorPrototype%[@@iterator]()` method
	// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
	if (!isCallable$b(IteratorPrototype$2[ITERATOR$6])) {
	  defineBuiltIn$e(IteratorPrototype$2, ITERATOR$6, function () {
	    return this;
	  });
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype$2,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS$1
	};

	var defineProperty$d = objectDefineProperty.f;
	var hasOwn$i = hasOwnProperty_1;
	var wellKnownSymbol$l = wellKnownSymbol$v;

	var TO_STRING_TAG$3 = wellKnownSymbol$l('toStringTag');

	var setToStringTag$b = function (target, TAG, STATIC) {
	  if (target && !STATIC) target = target.prototype;
	  if (target && !hasOwn$i(target, TO_STRING_TAG$3)) {
	    defineProperty$d(target, TO_STRING_TAG$3, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
	var create$6 = objectCreate;
	var createPropertyDescriptor$5 = createPropertyDescriptor$a;
	var setToStringTag$a = setToStringTag$b;
	var Iterators$4 = iterators;

	var returnThis$1 = function () { return this; };

	var iteratorCreateConstructor = function (IteratorConstructor, NAME, next, ENUMERABLE_NEXT) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = create$6(IteratorPrototype$1, { next: createPropertyDescriptor$5(+!ENUMERABLE_NEXT, next) });
	  setToStringTag$a(IteratorConstructor, TO_STRING_TAG, false);
	  Iterators$4[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var $$10 = _export;
	var call$m = functionCall;
	var FunctionName$1 = functionName;
	var isCallable$a = isCallable$t;
	var createIteratorConstructor = iteratorCreateConstructor;
	var getPrototypeOf$4 = objectGetPrototypeOf$1;
	var setPrototypeOf$5 = objectSetPrototypeOf;
	var setToStringTag$9 = setToStringTag$b;
	var createNonEnumerableProperty$7 = createNonEnumerableProperty$d;
	var defineBuiltIn$d = defineBuiltIn$h;
	var wellKnownSymbol$k = wellKnownSymbol$v;
	var Iterators$3 = iterators;
	var IteratorsCore = iteratorsCore;

	var PROPER_FUNCTION_NAME$3 = FunctionName$1.PROPER;
	var CONFIGURABLE_FUNCTION_NAME$1 = FunctionName$1.CONFIGURABLE;
	var IteratorPrototype = IteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$5 = wellKnownSymbol$k('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis = function () { return this; };

	var iteratorDefine = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$5]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = getPrototypeOf$4(anyNativeIterator.call(new Iterable()));
	    if (CurrentIteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
	      if (getPrototypeOf$4(CurrentIteratorPrototype) !== IteratorPrototype) {
	        if (setPrototypeOf$5) {
	          setPrototypeOf$5(CurrentIteratorPrototype, IteratorPrototype);
	        } else if (!isCallable$a(CurrentIteratorPrototype[ITERATOR$5])) {
	          defineBuiltIn$d(CurrentIteratorPrototype, ITERATOR$5, returnThis);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag$9(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
	  if (PROPER_FUNCTION_NAME$3 && DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    if (CONFIGURABLE_FUNCTION_NAME$1) {
	      createNonEnumerableProperty$7(IterablePrototype, 'name', VALUES);
	    } else {
	      INCORRECT_VALUES_NAME = true;
	      defaultIterator = function values() { return call$m(nativeIterator, this); };
	    }
	  }

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        defineBuiltIn$d(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else $$10({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
	  }

	  // define iterator
	  if (IterablePrototype[ITERATOR$5] !== defaultIterator) {
	    defineBuiltIn$d(IterablePrototype, ITERATOR$5, defaultIterator, { name: DEFAULT });
	  }
	  Iterators$3[NAME] = defaultIterator;

	  return methods;
	};

	// `CreateIterResultObject` abstract operation
	// https://tc39.es/ecma262/#sec-createiterresultobject
	var createIterResultObject$3 = function (value, done) {
	  return { value: value, done: done };
	};

	var toIndexedObject$8 = toIndexedObject$e;
	var addToUnscopables$6 = addToUnscopables$7;
	var Iterators$2 = iterators;
	var InternalStateModule$9 = internalState;
	var defineProperty$c = objectDefineProperty.f;
	var defineIterator$2 = iteratorDefine;
	var createIterResultObject$2 = createIterResultObject$3;
	var DESCRIPTORS$j = descriptors;

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState$8 = InternalStateModule$9.set;
	var getInternalState$8 = InternalStateModule$9.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.es/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.es/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.es/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.es/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator$2(Array, 'Array', function (iterated, kind) {
	  setInternalState$8(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject$8(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState$8(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return createIterResultObject$2(undefined, true);
	  }
	  if (kind == 'keys') return createIterResultObject$2(index, false);
	  if (kind == 'values') return createIterResultObject$2(target[index], false);
	  return createIterResultObject$2([index, target[index]], false);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.es/ecma262/#sec-createmappedargumentsobject
	var values = Iterators$2.Arguments = Iterators$2.Array;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$6('keys');
	addToUnscopables$6('values');
	addToUnscopables$6('entries');

	// V8 ~ Chrome 45- bug
	if (DESCRIPTORS$j && values.name !== 'values') try {
	  defineProperty$c(values, 'name', { value: 'values' });
	} catch (error) { /* empty */ }

	var TO_STRING_TAG_SUPPORT$1 = toStringTagSupport;
	var classof$b = classof$g;

	// `Object.prototype.toString` method implementation
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	var objectToString = TO_STRING_TAG_SUPPORT$1 ? {}.toString : function toString() {
	  return '[object ' + classof$b(this) + ']';
	};

	var TO_STRING_TAG_SUPPORT = toStringTagSupport;
	var defineBuiltIn$c = defineBuiltIn$h;
	var toString$f = objectToString;

	// `Object.prototype.toString` method
	// https://tc39.es/ecma262/#sec-object.prototype.tostring
	if (!TO_STRING_TAG_SUPPORT) {
	  defineBuiltIn$c(Object.prototype, 'toString', toString$f, { unsafe: true });
	}

	var typedArrayConstructor = {exports: {}};

	var wellKnownSymbol$j = wellKnownSymbol$v;

	var ITERATOR$4 = wellKnownSymbol$j('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$4] = function () {
	    return this;
	  };
	  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration$4 = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$4] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	// eslint-disable-next-line es/no-typed-arrays -- safe
	var arrayBufferBasicDetection = typeof ArrayBuffer != 'undefined' && typeof DataView != 'undefined';

	var NATIVE_ARRAY_BUFFER$1 = arrayBufferBasicDetection;
	var DESCRIPTORS$i = descriptors;
	var global$w = global$K;
	var isCallable$9 = isCallable$t;
	var isObject$h = isObject$r;
	var hasOwn$h = hasOwnProperty_1;
	var classof$a = classof$g;
	var tryToString$5 = tryToString$7;
	var createNonEnumerableProperty$6 = createNonEnumerableProperty$d;
	var defineBuiltIn$b = defineBuiltIn$h;
	var defineProperty$b = objectDefineProperty.f;
	var isPrototypeOf$9 = objectIsPrototypeOf;
	var getPrototypeOf$3 = objectGetPrototypeOf$1;
	var setPrototypeOf$4 = objectSetPrototypeOf;
	var wellKnownSymbol$i = wellKnownSymbol$v;
	var uid$2 = uid$5;
	var InternalStateModule$8 = internalState;

	var enforceInternalState$3 = InternalStateModule$8.enforce;
	var getInternalState$7 = InternalStateModule$8.get;
	var Int8Array$4 = global$w.Int8Array;
	var Int8ArrayPrototype$1 = Int8Array$4 && Int8Array$4.prototype;
	var Uint8ClampedArray$1 = global$w.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
	var TypedArray$1 = Int8Array$4 && getPrototypeOf$3(Int8Array$4);
	var TypedArrayPrototype$2 = Int8ArrayPrototype$1 && getPrototypeOf$3(Int8ArrayPrototype$1);
	var ObjectPrototype$3 = Object.prototype;
	var TypeError$4 = global$w.TypeError;

	var TO_STRING_TAG$2 = wellKnownSymbol$i('toStringTag');
	var TYPED_ARRAY_TAG$1 = uid$2('TYPED_ARRAY_TAG');
	var TYPED_ARRAY_CONSTRUCTOR = 'TypedArrayConstructor';
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS$2 = NATIVE_ARRAY_BUFFER$1 && !!setPrototypeOf$4 && classof$a(global$w.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQUIRED = false;
	var NAME$1, Constructor, Prototype;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var BigIntArrayConstructorsList = {
	  BigInt64Array: 8,
	  BigUint64Array: 8
	};

	var isView = function isView(it) {
	  if (!isObject$h(it)) return false;
	  var klass = classof$a(it);
	  return klass === 'DataView'
	    || hasOwn$h(TypedArrayConstructorsList, klass)
	    || hasOwn$h(BigIntArrayConstructorsList, klass);
	};

	var getTypedArrayConstructor$4 = function (it) {
	  var proto = getPrototypeOf$3(it);
	  if (!isObject$h(proto)) return;
	  var state = getInternalState$7(proto);
	  return (state && hasOwn$h(state, TYPED_ARRAY_CONSTRUCTOR)) ? state[TYPED_ARRAY_CONSTRUCTOR] : getTypedArrayConstructor$4(proto);
	};

	var isTypedArray$1 = function (it) {
	  if (!isObject$h(it)) return false;
	  var klass = classof$a(it);
	  return hasOwn$h(TypedArrayConstructorsList, klass)
	    || hasOwn$h(BigIntArrayConstructorsList, klass);
	};

	var aTypedArray$s = function (it) {
	  if (isTypedArray$1(it)) return it;
	  throw TypeError$4('Target is not a typed array');
	};

	var aTypedArrayConstructor$4 = function (C) {
	  if (isCallable$9(C) && (!setPrototypeOf$4 || isPrototypeOf$9(TypedArray$1, C))) return C;
	  throw TypeError$4(tryToString$5(C) + ' is not a typed array constructor');
	};

	var exportTypedArrayMethod$t = function (KEY, property, forced, options) {
	  if (!DESCRIPTORS$i) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global$w[ARRAY];
	    if (TypedArrayConstructor && hasOwn$h(TypedArrayConstructor.prototype, KEY)) try {
	      delete TypedArrayConstructor.prototype[KEY];
	    } catch (error) {
	      // old WebKit bug - some methods are non-configurable
	      try {
	        TypedArrayConstructor.prototype[KEY] = property;
	      } catch (error2) { /* empty */ }
	    }
	  }
	  if (!TypedArrayPrototype$2[KEY] || forced) {
	    defineBuiltIn$b(TypedArrayPrototype$2, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS$2 && Int8ArrayPrototype$1[KEY] || property, options);
	  }
	};

	var exportTypedArrayStaticMethod$1 = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!DESCRIPTORS$i) return;
	  if (setPrototypeOf$4) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global$w[ARRAY];
	      if (TypedArrayConstructor && hasOwn$h(TypedArrayConstructor, KEY)) try {
	        delete TypedArrayConstructor[KEY];
	      } catch (error) { /* empty */ }
	    }
	    if (!TypedArray$1[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return defineBuiltIn$b(TypedArray$1, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS$2 && TypedArray$1[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global$w[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      defineBuiltIn$b(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME$1 in TypedArrayConstructorsList) {
	  Constructor = global$w[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) enforceInternalState$3(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
	  else NATIVE_ARRAY_BUFFER_VIEWS$2 = false;
	}

	for (NAME$1 in BigIntArrayConstructorsList) {
	  Constructor = global$w[NAME$1];
	  Prototype = Constructor && Constructor.prototype;
	  if (Prototype) enforceInternalState$3(Prototype)[TYPED_ARRAY_CONSTRUCTOR] = Constructor;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !isCallable$9(TypedArray$1) || TypedArray$1 === Function.prototype) {
	  // eslint-disable-next-line no-shadow -- safe
	  TypedArray$1 = function TypedArray() {
	    throw TypeError$4('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS$2) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$w[NAME$1]) setPrototypeOf$4(global$w[NAME$1], TypedArray$1);
	  }
	}

	if (!NATIVE_ARRAY_BUFFER_VIEWS$2 || !TypedArrayPrototype$2 || TypedArrayPrototype$2 === ObjectPrototype$3) {
	  TypedArrayPrototype$2 = TypedArray$1.prototype;
	  if (NATIVE_ARRAY_BUFFER_VIEWS$2) for (NAME$1 in TypedArrayConstructorsList) {
	    if (global$w[NAME$1]) setPrototypeOf$4(global$w[NAME$1].prototype, TypedArrayPrototype$2);
	  }
	}

	// WebKit bug - one more object in Uint8ClampedArray prototype chain
	if (NATIVE_ARRAY_BUFFER_VIEWS$2 && getPrototypeOf$3(Uint8ClampedArrayPrototype) !== TypedArrayPrototype$2) {
	  setPrototypeOf$4(Uint8ClampedArrayPrototype, TypedArrayPrototype$2);
	}

	if (DESCRIPTORS$i && !hasOwn$h(TypedArrayPrototype$2, TO_STRING_TAG$2)) {
	  TYPED_ARRAY_TAG_REQUIRED = true;
	  defineProperty$b(TypedArrayPrototype$2, TO_STRING_TAG$2, { get: function () {
	    return isObject$h(this) ? this[TYPED_ARRAY_TAG$1] : undefined;
	  } });
	  for (NAME$1 in TypedArrayConstructorsList) if (global$w[NAME$1]) {
	    createNonEnumerableProperty$6(global$w[NAME$1], TYPED_ARRAY_TAG$1, NAME$1);
	  }
	}

	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS$2,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQUIRED && TYPED_ARRAY_TAG$1,
	  aTypedArray: aTypedArray$s,
	  aTypedArrayConstructor: aTypedArrayConstructor$4,
	  exportTypedArrayMethod: exportTypedArrayMethod$t,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod$1,
	  getTypedArrayConstructor: getTypedArrayConstructor$4,
	  isView: isView,
	  isTypedArray: isTypedArray$1,
	  TypedArray: TypedArray$1,
	  TypedArrayPrototype: TypedArrayPrototype$2
	};

	/* eslint-disable no-new -- required for testing */

	var global$v = global$K;
	var fails$D = fails$X;
	var checkCorrectnessOfIteration$3 = checkCorrectnessOfIteration$4;
	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$3 = global$v.ArrayBuffer;
	var Int8Array$3 = global$v.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails$D(function () {
	  Int8Array$3(1);
	}) || !fails$D(function () {
	  new Int8Array$3(-1);
	}) || !checkCorrectnessOfIteration$3(function (iterable) {
	  new Int8Array$3();
	  new Int8Array$3(null);
	  new Int8Array$3(1.5);
	  new Int8Array$3(iterable);
	}, true) || fails$D(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$3(new ArrayBuffer$3(2), 1, undefined).length !== 1;
	});

	var defineBuiltIn$a = defineBuiltIn$h;

	var defineBuiltIns$4 = function (target, src, options) {
	  for (var key in src) defineBuiltIn$a(target, key, src[key], options);
	  return target;
	};

	var isPrototypeOf$8 = objectIsPrototypeOf;

	var $TypeError$c = TypeError;

	var anInstance$8 = function (it, Prototype) {
	  if (isPrototypeOf$8(Prototype, it)) return it;
	  throw $TypeError$c('Incorrect invocation');
	};

	var toIntegerOrInfinity$9 = toIntegerOrInfinity$e;
	var toLength$7 = toLength$a;

	var $RangeError$5 = RangeError;

	// `ToIndex` abstract operation
	// https://tc39.es/ecma262/#sec-toindex
	var toIndex$2 = function (it) {
	  if (it === undefined) return 0;
	  var number = toIntegerOrInfinity$9(it);
	  var length = toLength$7(number);
	  if (number !== length) throw $RangeError$5('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	var $Array$3 = Array;
	var abs$1 = Math.abs;
	var pow$2 = Math.pow;
	var floor$5 = Math.floor;
	var log$4 = Math.log;
	var LN2$1 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = $Array$3(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow$2(2, -24) - pow$2(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs$1(number);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (number != number || number === Infinity) {
	    // eslint-disable-next-line no-self-compare -- NaN check
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$5(log$4(number) / LN2$1);
	    c = pow$2(2, -exponent);
	    if (number * c < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow$2(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow$2(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow$2(2, eBias - 1) * pow$2(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  while (mantissaLength >= 8) {
	    buffer[index++] = mantissa & 255;
	    mantissa /= 256;
	    mantissaLength -= 8;
	  }
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  while (exponentLength > 0) {
	    buffer[index++] = exponent & 255;
	    exponent /= 256;
	    exponentLength -= 8;
	  }
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  while (nBits > 0) {
	    exponent = exponent * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  while (nBits > 0) {
	    mantissa = mantissa * 256 + buffer[index--];
	    nBits -= 8;
	  }
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity : Infinity;
	  } else {
	    mantissa = mantissa + pow$2(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow$2(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var toObject$e = toObject$j;
	var toAbsoluteIndex$4 = toAbsoluteIndex$7;
	var lengthOfArrayLike$j = lengthOfArrayLike$n;

	// `Array.prototype.fill` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	var arrayFill$1 = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject$e(this);
	  var length = lengthOfArrayLike$j(O);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex$4(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex$4(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	var toAbsoluteIndex$3 = toAbsoluteIndex$7;
	var lengthOfArrayLike$i = lengthOfArrayLike$n;
	var createProperty$4 = createProperty$6;

	var $Array$2 = Array;
	var max$1 = Math.max;

	var arraySliceSimple = function (O, start, end) {
	  var length = lengthOfArrayLike$i(O);
	  var k = toAbsoluteIndex$3(start, length);
	  var fin = toAbsoluteIndex$3(end === undefined ? length : end, length);
	  var result = $Array$2(max$1(fin - k, 0));
	  for (var n = 0; k < fin; k++, n++) createProperty$4(result, n, O[k]);
	  result.length = n;
	  return result;
	};

	var global$u = global$K;
	var uncurryThis$x = functionUncurryThis;
	var DESCRIPTORS$h = descriptors;
	var NATIVE_ARRAY_BUFFER = arrayBufferBasicDetection;
	var FunctionName = functionName;
	var createNonEnumerableProperty$5 = createNonEnumerableProperty$d;
	var defineBuiltIns$3 = defineBuiltIns$4;
	var fails$C = fails$X;
	var anInstance$7 = anInstance$8;
	var toIntegerOrInfinity$8 = toIntegerOrInfinity$e;
	var toLength$6 = toLength$a;
	var toIndex$1 = toIndex$2;
	var IEEE754 = ieee754;
	var getPrototypeOf$2 = objectGetPrototypeOf$1;
	var setPrototypeOf$3 = objectSetPrototypeOf;
	var getOwnPropertyNames$4 = objectGetOwnPropertyNames.f;
	var defineProperty$a = objectDefineProperty.f;
	var arrayFill = arrayFill$1;
	var arraySlice$9 = arraySliceSimple;
	var setToStringTag$8 = setToStringTag$b;
	var InternalStateModule$7 = internalState;

	var PROPER_FUNCTION_NAME$2 = FunctionName.PROPER;
	var CONFIGURABLE_FUNCTION_NAME = FunctionName.CONFIGURABLE;
	var getInternalState$6 = InternalStateModule$7.get;
	var setInternalState$7 = InternalStateModule$7.set;
	var ARRAY_BUFFER$1 = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE$1 = 'prototype';
	var WRONG_LENGTH$1 = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer$1 = global$u[ARRAY_BUFFER$1];
	var $ArrayBuffer = NativeArrayBuffer$1;
	var ArrayBufferPrototype$1 = $ArrayBuffer && $ArrayBuffer[PROTOTYPE$1];
	var $DataView = global$u[DATA_VIEW];
	var DataViewPrototype = $DataView && $DataView[PROTOTYPE$1];
	var ObjectPrototype$2 = Object.prototype;
	var Array$1 = global$u.Array;
	var RangeError$3 = global$u.RangeError;
	var fill$1 = uncurryThis$x(arrayFill);
	var reverse = uncurryThis$x([].reverse);

	var packIEEE754 = IEEE754.pack;
	var unpackIEEE754 = IEEE754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter$1 = function (Constructor, key) {
	  defineProperty$a(Constructor[PROTOTYPE$1], key, { get: function () { return getInternalState$6(this)[key]; } });
	};

	var get = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$6(view);
	  if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
	  var bytes = getInternalState$6(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = arraySlice$9(bytes, start, start + count);
	  return isLittleEndian ? pack : reverse(pack);
	};

	var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex$1(index);
	  var store = getInternalState$6(view);
	  if (intIndex + count > store.byteLength) throw RangeError$3(WRONG_INDEX);
	  var bytes = getInternalState$6(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!NATIVE_ARRAY_BUFFER) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance$7(this, ArrayBufferPrototype$1);
	    var byteLength = toIndex$1(length);
	    setInternalState$7(this, {
	      bytes: fill$1(Array$1(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!DESCRIPTORS$h) this.byteLength = byteLength;
	  };

	  ArrayBufferPrototype$1 = $ArrayBuffer[PROTOTYPE$1];

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance$7(this, DataViewPrototype);
	    anInstance$7(buffer, ArrayBufferPrototype$1);
	    var bufferLength = getInternalState$6(buffer).byteLength;
	    var offset = toIntegerOrInfinity$8(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$3('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength$6(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$3(WRONG_LENGTH$1);
	    setInternalState$7(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!DESCRIPTORS$h) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };

	  DataViewPrototype = $DataView[PROTOTYPE$1];

	  if (DESCRIPTORS$h) {
	    addGetter$1($ArrayBuffer, 'byteLength');
	    addGetter$1($DataView, 'buffer');
	    addGetter$1($DataView, 'byteLength');
	    addGetter$1($DataView, 'byteOffset');
	  }

	  defineBuiltIns$3(DataViewPrototype, {
	    getInt8: function getInt8(byteOffset) {
	      return get(this, 1, byteOffset)[0] << 24 >> 24;
	    },
	    getUint8: function getUint8(byteOffset) {
	      return get(this, 1, byteOffset)[0];
	    },
	    getInt16: function getInt16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return (bytes[1] << 8 | bytes[0]) << 16 >> 16;
	    },
	    getUint16: function getUint16(byteOffset /* , littleEndian */) {
	      var bytes = get(this, 2, byteOffset, arguments.length > 1 ? arguments[1] : undefined);
	      return bytes[1] << 8 | bytes[0];
	    },
	    getInt32: function getInt32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined));
	    },
	    getUint32: function getUint32(byteOffset /* , littleEndian */) {
	      return unpackInt32(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined)) >>> 0;
	    },
	    getFloat32: function getFloat32(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 4, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 23);
	    },
	    getFloat64: function getFloat64(byteOffset /* , littleEndian */) {
	      return unpackIEEE754(get(this, 8, byteOffset, arguments.length > 1 ? arguments[1] : undefined), 52);
	    },
	    setInt8: function setInt8(byteOffset, value) {
	      set$1(this, 1, byteOffset, packInt8, value);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      set$1(this, 1, byteOffset, packInt8, value);
	    },
	    setInt16: function setInt16(byteOffset, value /* , littleEndian */) {
	      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint16: function setUint16(byteOffset, value /* , littleEndian */) {
	      set$1(this, 2, byteOffset, packInt16, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setInt32: function setInt32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setUint32: function setUint32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packInt32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat32: function setFloat32(byteOffset, value /* , littleEndian */) {
	      set$1(this, 4, byteOffset, packFloat32, value, arguments.length > 2 ? arguments[2] : undefined);
	    },
	    setFloat64: function setFloat64(byteOffset, value /* , littleEndian */) {
	      set$1(this, 8, byteOffset, packFloat64, value, arguments.length > 2 ? arguments[2] : undefined);
	    }
	  });
	} else {
	  var INCORRECT_ARRAY_BUFFER_NAME = PROPER_FUNCTION_NAME$2 && NativeArrayBuffer$1.name !== ARRAY_BUFFER$1;
	  /* eslint-disable no-new -- required for testing */
	  if (!fails$C(function () {
	    NativeArrayBuffer$1(1);
	  }) || !fails$C(function () {
	    new NativeArrayBuffer$1(-1);
	  }) || fails$C(function () {
	    new NativeArrayBuffer$1();
	    new NativeArrayBuffer$1(1.5);
	    new NativeArrayBuffer$1(NaN);
	    return NativeArrayBuffer$1.length != 1 || INCORRECT_ARRAY_BUFFER_NAME && !CONFIGURABLE_FUNCTION_NAME;
	  })) {
	    /* eslint-enable no-new -- required for testing */
	    $ArrayBuffer = function ArrayBuffer(length) {
	      anInstance$7(this, ArrayBufferPrototype$1);
	      return new NativeArrayBuffer$1(toIndex$1(length));
	    };

	    $ArrayBuffer[PROTOTYPE$1] = ArrayBufferPrototype$1;

	    for (var keys$2 = getOwnPropertyNames$4(NativeArrayBuffer$1), j$1 = 0, key$3; keys$2.length > j$1;) {
	      if (!((key$3 = keys$2[j$1++]) in $ArrayBuffer)) {
	        createNonEnumerableProperty$5($ArrayBuffer, key$3, NativeArrayBuffer$1[key$3]);
	      }
	    }

	    ArrayBufferPrototype$1.constructor = $ArrayBuffer;
	  } else if (INCORRECT_ARRAY_BUFFER_NAME && CONFIGURABLE_FUNCTION_NAME) {
	    createNonEnumerableProperty$5(NativeArrayBuffer$1, 'name', ARRAY_BUFFER$1);
	  }

	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (setPrototypeOf$3 && getPrototypeOf$2(DataViewPrototype) !== ObjectPrototype$2) {
	    setPrototypeOf$3(DataViewPrototype, ObjectPrototype$2);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var $setInt8 = uncurryThis$x(DataViewPrototype.setInt8);
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) defineBuiltIns$3(DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      $setInt8(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag$8($ArrayBuffer, ARRAY_BUFFER$1);
	setToStringTag$8($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var isObject$g = isObject$r;

	var floor$4 = Math.floor;

	// `IsIntegralNumber` abstract operation
	// https://tc39.es/ecma262/#sec-isintegralnumber
	// eslint-disable-next-line es/no-number-isinteger -- safe
	var isIntegralNumber$1 = Number.isInteger || function isInteger(it) {
	  return !isObject$g(it) && isFinite(it) && floor$4(it) === it;
	};

	var toIntegerOrInfinity$7 = toIntegerOrInfinity$e;

	var $RangeError$4 = RangeError;

	var toPositiveInteger$1 = function (it) {
	  var result = toIntegerOrInfinity$7(it);
	  if (result < 0) throw $RangeError$4("The argument can't be less than 0");
	  return result;
	};

	var toPositiveInteger = toPositiveInteger$1;

	var $RangeError$3 = RangeError;

	var toOffset$2 = function (it, BYTES) {
	  var offset = toPositiveInteger(it);
	  if (offset % BYTES) throw $RangeError$3('Wrong offset');
	  return offset;
	};

	var uncurryThis$w = functionUncurryThisClause;
	var aCallable$c = aCallable$e;
	var NATIVE_BIND$1 = functionBindNative;

	var bind$b = uncurryThis$w(uncurryThis$w.bind);

	// optional / simple context binding
	var functionBindContext = function (fn, that) {
	  aCallable$c(fn);
	  return that === undefined ? fn : NATIVE_BIND$1 ? bind$b(fn, that) : function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var isConstructor$2 = isConstructor$4;
	var tryToString$4 = tryToString$7;

	var $TypeError$b = TypeError;

	// `Assert: IsConstructor(argument) is true`
	var aConstructor$3 = function (argument) {
	  if (isConstructor$2(argument)) return argument;
	  throw $TypeError$b(tryToString$4(argument) + ' is not a constructor');
	};

	var classof$9 = classof$g;
	var getMethod$4 = getMethod$7;
	var isNullOrUndefined$7 = isNullOrUndefined$b;
	var Iterators$1 = iterators;
	var wellKnownSymbol$h = wellKnownSymbol$v;

	var ITERATOR$3 = wellKnownSymbol$h('iterator');

	var getIteratorMethod$4 = function (it) {
	  if (!isNullOrUndefined$7(it)) return getMethod$4(it, ITERATOR$3)
	    || getMethod$4(it, '@@iterator')
	    || Iterators$1[classof$9(it)];
	};

	var call$l = functionCall;
	var aCallable$b = aCallable$e;
	var anObject$i = anObject$r;
	var tryToString$3 = tryToString$7;
	var getIteratorMethod$3 = getIteratorMethod$4;

	var $TypeError$a = TypeError;

	var getIterator$3 = function (argument, usingIterator) {
	  var iteratorMethod = arguments.length < 2 ? getIteratorMethod$3(argument) : usingIterator;
	  if (aCallable$b(iteratorMethod)) return anObject$i(call$l(iteratorMethod, argument));
	  throw $TypeError$a(tryToString$3(argument) + ' is not iterable');
	};

	var wellKnownSymbol$g = wellKnownSymbol$v;
	var Iterators = iterators;

	var ITERATOR$2 = wellKnownSymbol$g('iterator');
	var ArrayPrototype = Array.prototype;

	// check on default Array iterator
	var isArrayIteratorMethod$3 = function (it) {
	  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR$2] === it);
	};

	var classof$8 = classof$g;
	var uncurryThis$v = functionUncurryThis;

	var slice$2 = uncurryThis$v(''.slice);

	var isBigIntArray$2 = function (it) {
	  return slice$2(classof$8(it), 0, 3) === 'Big';
	};

	var toPrimitive$1 = toPrimitive$3;

	var $TypeError$9 = TypeError;

	// `ToBigInt` abstract operation
	// https://tc39.es/ecma262/#sec-tobigint
	var toBigInt$3 = function (argument) {
	  var prim = toPrimitive$1(argument, 'number');
	  if (typeof prim == 'number') throw $TypeError$9("Can't convert number to bigint");
	  // eslint-disable-next-line es/no-bigint -- safe
	  return BigInt(prim);
	};

	var bind$a = functionBindContext;
	var call$k = functionCall;
	var aConstructor$2 = aConstructor$3;
	var toObject$d = toObject$j;
	var lengthOfArrayLike$h = lengthOfArrayLike$n;
	var getIterator$2 = getIterator$3;
	var getIteratorMethod$2 = getIteratorMethod$4;
	var isArrayIteratorMethod$2 = isArrayIteratorMethod$3;
	var isBigIntArray$1 = isBigIntArray$2;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
	var toBigInt$2 = toBigInt$3;

	var typedArrayFrom$1 = function from(source /* , mapfn, thisArg */) {
	  var C = aConstructor$2(this);
	  var O = toObject$d(source);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  var iteratorMethod = getIteratorMethod$2(O);
	  var i, length, result, thisIsBigIntArray, value, step, iterator, next;
	  if (iteratorMethod && !isArrayIteratorMethod$2(iteratorMethod)) {
	    iterator = getIterator$2(O, iteratorMethod);
	    next = iterator.next;
	    O = [];
	    while (!(step = call$k(next, iterator)).done) {
	      O.push(step.value);
	    }
	  }
	  if (mapping && argumentsLength > 2) {
	    mapfn = bind$a(mapfn, arguments[2]);
	  }
	  length = lengthOfArrayLike$h(O);
	  result = new (aTypedArrayConstructor$3(C))(length);
	  thisIsBigIntArray = isBigIntArray$1(result);
	  for (i = 0; length > i; i++) {
	    value = mapping ? mapfn(O[i], i) : O[i];
	    // FF30- typed arrays doesn't properly convert objects to typed array values
	    result[i] = thisIsBigIntArray ? toBigInt$2(value) : +value;
	  }
	  return result;
	};

	var isArray$3 = isArray$6;
	var isConstructor$1 = isConstructor$4;
	var isObject$f = isObject$r;
	var wellKnownSymbol$f = wellKnownSymbol$v;

	var SPECIES$3 = wellKnownSymbol$f('species');
	var $Array$1 = Array;

	// a part of `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesConstructor$1 = function (originalArray) {
	  var C;
	  if (isArray$3(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (isConstructor$1(C) && (C === $Array$1 || isArray$3(C.prototype))) C = undefined;
	    else if (isObject$f(C)) {
	      C = C[SPECIES$3];
	      if (C === null) C = undefined;
	    }
	  } return C === undefined ? $Array$1 : C;
	};

	var arraySpeciesConstructor = arraySpeciesConstructor$1;

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate$4 = function (originalArray, length) {
	  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
	};

	var bind$9 = functionBindContext;
	var uncurryThis$u = functionUncurryThis;
	var IndexedObject$4 = indexedObject;
	var toObject$c = toObject$j;
	var lengthOfArrayLike$g = lengthOfArrayLike$n;
	var arraySpeciesCreate$3 = arraySpeciesCreate$4;

	var push$6 = uncurryThis$u([].push);

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
	var createMethod$4 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var IS_FILTER_REJECT = TYPE == 7;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject$c($this);
	    var self = IndexedObject$4(O);
	    var boundFunction = bind$9(callbackfn, that);
	    var length = lengthOfArrayLike$g(self);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate$3;
	    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push$6(target, value);      // filter
	        } else switch (TYPE) {
	          case 4: return false;             // every
	          case 7: push$6(target, value);      // filterReject
	        }
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.es/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$4(0),
	  // `Array.prototype.map` method
	  // https://tc39.es/ecma262/#sec-array.prototype.map
	  map: createMethod$4(1),
	  // `Array.prototype.filter` method
	  // https://tc39.es/ecma262/#sec-array.prototype.filter
	  filter: createMethod$4(2),
	  // `Array.prototype.some` method
	  // https://tc39.es/ecma262/#sec-array.prototype.some
	  some: createMethod$4(3),
	  // `Array.prototype.every` method
	  // https://tc39.es/ecma262/#sec-array.prototype.every
	  every: createMethod$4(4),
	  // `Array.prototype.find` method
	  // https://tc39.es/ecma262/#sec-array.prototype.find
	  find: createMethod$4(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$4(6),
	  // `Array.prototype.filterReject` method
	  // https://github.com/tc39/proposal-array-filtering
	  filterReject: createMethod$4(7)
	};

	var getBuiltIn$b = getBuiltIn$i;
	var definePropertyModule$3 = objectDefineProperty;
	var wellKnownSymbol$e = wellKnownSymbol$v;
	var DESCRIPTORS$g = descriptors;

	var SPECIES$2 = wellKnownSymbol$e('species');

	var setSpecies$5 = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn$b(CONSTRUCTOR_NAME);
	  var defineProperty = definePropertyModule$3.f;

	  if (DESCRIPTORS$g && Constructor && !Constructor[SPECIES$2]) {
	    defineProperty(Constructor, SPECIES$2, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};

	var $$$ = _export;
	var global$t = global$K;
	var call$j = functionCall;
	var DESCRIPTORS$f = descriptors;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1 = typedArrayConstructorsRequireWrappers;
	var ArrayBufferViewCore$u = arrayBufferViewCore;
	var ArrayBufferModule = arrayBuffer;
	var anInstance$6 = anInstance$8;
	var createPropertyDescriptor$4 = createPropertyDescriptor$a;
	var createNonEnumerableProperty$4 = createNonEnumerableProperty$d;
	var isIntegralNumber = isIntegralNumber$1;
	var toLength$5 = toLength$a;
	var toIndex = toIndex$2;
	var toOffset$1 = toOffset$2;
	var toPropertyKey$1 = toPropertyKey$5;
	var hasOwn$g = hasOwnProperty_1;
	var classof$7 = classof$g;
	var isObject$e = isObject$r;
	var isSymbol$3 = isSymbol$6;
	var create$5 = objectCreate;
	var isPrototypeOf$7 = objectIsPrototypeOf;
	var setPrototypeOf$2 = objectSetPrototypeOf;
	var getOwnPropertyNames$3 = objectGetOwnPropertyNames.f;
	var typedArrayFrom = typedArrayFrom$1;
	var forEach$1 = arrayIteration.forEach;
	var setSpecies$4 = setSpecies$5;
	var definePropertyModule$2 = objectDefineProperty;
	var getOwnPropertyDescriptorModule$2 = objectGetOwnPropertyDescriptor;
	var InternalStateModule$6 = internalState;
	var inheritIfRequired$4 = inheritIfRequired$6;

	var getInternalState$5 = InternalStateModule$6.get;
	var setInternalState$6 = InternalStateModule$6.set;
	var enforceInternalState$2 = InternalStateModule$6.enforce;
	var nativeDefineProperty$1 = definePropertyModule$2.f;
	var nativeGetOwnPropertyDescriptor$2 = getOwnPropertyDescriptorModule$2.f;
	var round = Math.round;
	var RangeError$2 = global$t.RangeError;
	var ArrayBuffer$2 = ArrayBufferModule.ArrayBuffer;
	var ArrayBufferPrototype = ArrayBuffer$2.prototype;
	var DataView$1 = ArrayBufferModule.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = ArrayBufferViewCore$u.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = ArrayBufferViewCore$u.TYPED_ARRAY_TAG;
	var TypedArray = ArrayBufferViewCore$u.TypedArray;
	var TypedArrayPrototype$1 = ArrayBufferViewCore$u.TypedArrayPrototype;
	var aTypedArrayConstructor$2 = ArrayBufferViewCore$u.aTypedArrayConstructor;
	var isTypedArray = ArrayBufferViewCore$u.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  aTypedArrayConstructor$2(C);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty$1(it, key, { get: function () {
	    return getInternalState$5(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return isPrototypeOf$7(ArrayBufferPrototype, it) || (klass = classof$7(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && !isSymbol$3(key)
	    && key in target
	    && isIntegralNumber(+key)
	    && key >= 0;
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  key = toPropertyKey$1(key);
	  return isTypedArrayIndex(target, key)
	    ? createPropertyDescriptor$4(2, target[key])
	    : nativeGetOwnPropertyDescriptor$2(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  key = toPropertyKey$1(key);
	  if (isTypedArrayIndex(target, key)
	    && isObject$e(descriptor)
	    && hasOwn$g(descriptor, 'value')
	    && !hasOwn$g(descriptor, 'get')
	    && !hasOwn$g(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!hasOwn$g(descriptor, 'writable') || descriptor.writable)
	    && (!hasOwn$g(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty$1(target, key, descriptor);
	};

	if (DESCRIPTORS$f) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    getOwnPropertyDescriptorModule$2.f = wrappedGetOwnPropertyDescriptor;
	    definePropertyModule$2.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype$1, 'buffer');
	    addGetter(TypedArrayPrototype$1, 'byteOffset');
	    addGetter(TypedArrayPrototype$1, 'byteLength');
	    addGetter(TypedArrayPrototype$1, 'length');
	  }

	  $$$({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  typedArrayConstructor.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global$t[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState$5(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState$5(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty$1(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance$6(that, TypedArrayConstructorPrototype);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject$e(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer$2(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset$1(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError$2(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError$2(WRONG_LENGTH);
	          } else {
	            byteLength = toLength$5($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError$2(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return call$j(typedArrayFrom, TypedArrayConstructor, data);
	        }
	        setInternalState$6(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView$1(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (setPrototypeOf$2) setPrototypeOf$2(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = create$5(TypedArrayPrototype$1);
	    } else if (TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS$1) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance$6(dummy, TypedArrayConstructorPrototype);
	        return inheritIfRequired$4(function () {
	          if (!isObject$e(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset$1(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return call$j(typedArrayFrom, TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (setPrototypeOf$2) setPrototypeOf$2(TypedArrayConstructor, TypedArray);
	      forEach$1(getOwnPropertyNames$3(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty$4(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty$4(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    enforceInternalState$2(TypedArrayConstructorPrototype).TypedArrayConstructor = TypedArrayConstructor;

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty$4(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    var FORCED = TypedArrayConstructor != NativeTypedArrayConstructor;

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    $$$({ global: true, constructor: true, forced: FORCED, sham: !NATIVE_ARRAY_BUFFER_VIEWS }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty$4(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty$4(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies$4(CONSTRUCTOR_NAME);
	  };
	} else typedArrayConstructor.exports = function () { /* empty */ };

	var createTypedArrayConstructor$8 = typedArrayConstructor.exports;

	// `Uint8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$8('Uint8', function (init) {
	  return function Uint8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var ArrayBufferViewCore$t = arrayBufferViewCore;
	var lengthOfArrayLike$f = lengthOfArrayLike$n;
	var toIntegerOrInfinity$6 = toIntegerOrInfinity$e;

	var aTypedArray$r = ArrayBufferViewCore$t.aTypedArray;
	var exportTypedArrayMethod$s = ArrayBufferViewCore$t.exportTypedArrayMethod;

	// `%TypedArray%.prototype.at` method
	// https://github.com/tc39/proposal-relative-indexing-method
	exportTypedArrayMethod$s('at', function at(index) {
	  var O = aTypedArray$r(this);
	  var len = lengthOfArrayLike$f(O);
	  var relativeIndex = toIntegerOrInfinity$6(index);
	  var k = relativeIndex >= 0 ? relativeIndex : len + relativeIndex;
	  return (k < 0 || k >= len) ? undefined : O[k];
	});

	var tryToString$2 = tryToString$7;

	var $TypeError$8 = TypeError;

	var deletePropertyOrThrow$3 = function (O, P) {
	  if (!delete O[P]) throw $TypeError$8('Cannot delete property ' + tryToString$2(P) + ' of ' + tryToString$2(O));
	};

	var toObject$b = toObject$j;
	var toAbsoluteIndex$2 = toAbsoluteIndex$7;
	var lengthOfArrayLike$e = lengthOfArrayLike$n;
	var deletePropertyOrThrow$2 = deletePropertyOrThrow$3;

	var min$5 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	// eslint-disable-next-line es/no-array-prototype-copywithin -- safe
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject$b(this);
	  var len = lengthOfArrayLike$e(O);
	  var to = toAbsoluteIndex$2(target, len);
	  var from = toAbsoluteIndex$2(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$5((end === undefined ? len : toAbsoluteIndex$2(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else deletePropertyOrThrow$2(O, to);
	    to += inc;
	    from += inc;
	  } return O;
	};

	var uncurryThis$t = functionUncurryThis;
	var ArrayBufferViewCore$s = arrayBufferViewCore;
	var $ArrayCopyWithin = arrayCopyWithin;

	var u$ArrayCopyWithin = uncurryThis$t($ArrayCopyWithin);
	var aTypedArray$q = ArrayBufferViewCore$s.aTypedArray;
	var exportTypedArrayMethod$r = ArrayBufferViewCore$s.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$r('copyWithin', function copyWithin(target, start /* , end */) {
	  return u$ArrayCopyWithin(aTypedArray$q(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var ArrayBufferViewCore$r = arrayBufferViewCore;
	var $every = arrayIteration.every;

	var aTypedArray$p = ArrayBufferViewCore$r.aTypedArray;
	var exportTypedArrayMethod$q = ArrayBufferViewCore$r.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$q('every', function every(callbackfn /* , thisArg */) {
	  return $every(aTypedArray$p(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$q = arrayBufferViewCore;
	var $fill = arrayFill$1;
	var toBigInt$1 = toBigInt$3;
	var classof$6 = classof$g;
	var call$i = functionCall;
	var uncurryThis$s = functionUncurryThis;
	var fails$B = fails$X;

	var aTypedArray$o = ArrayBufferViewCore$q.aTypedArray;
	var exportTypedArrayMethod$p = ArrayBufferViewCore$q.exportTypedArrayMethod;
	var slice$1 = uncurryThis$s(''.slice);

	// V8 ~ Chrome < 59, Safari < 14.1, FF < 55, Edge <=18
	var CONVERSION_BUG = fails$B(function () {
	  var count = 0;
	  // eslint-disable-next-line es/no-typed-arrays -- safe
	  new Int8Array(2).fill({ valueOf: function () { return count++; } });
	  return count !== 1;
	});

	// `%TypedArray%.prototype.fill` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.fill
	exportTypedArrayMethod$p('fill', function fill(value /* , start, end */) {
	  var length = arguments.length;
	  aTypedArray$o(this);
	  var actualValue = slice$1(classof$6(this), 0, 3) === 'Big' ? toBigInt$1(value) : +value;
	  return call$i($fill, this, actualValue, length > 1 ? arguments[1] : undefined, length > 2 ? arguments[2] : undefined);
	}, CONVERSION_BUG);

	var lengthOfArrayLike$d = lengthOfArrayLike$n;

	var arrayFromConstructorAndList$2 = function (Constructor, list) {
	  var index = 0;
	  var length = lengthOfArrayLike$d(list);
	  var result = new Constructor(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var anObject$h = anObject$r;
	var aConstructor$1 = aConstructor$3;
	var isNullOrUndefined$6 = isNullOrUndefined$b;
	var wellKnownSymbol$d = wellKnownSymbol$v;

	var SPECIES$1 = wellKnownSymbol$d('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.es/ecma262/#sec-speciesconstructor
	var speciesConstructor$3 = function (O, defaultConstructor) {
	  var C = anObject$h(O).constructor;
	  var S;
	  return C === undefined || isNullOrUndefined$6(S = anObject$h(C)[SPECIES$1]) ? defaultConstructor : aConstructor$1(S);
	};

	var ArrayBufferViewCore$p = arrayBufferViewCore;
	var speciesConstructor$2 = speciesConstructor$3;

	var aTypedArrayConstructor$1 = ArrayBufferViewCore$p.aTypedArrayConstructor;
	var getTypedArrayConstructor$3 = ArrayBufferViewCore$p.getTypedArrayConstructor;

	// a part of `TypedArraySpeciesCreate` abstract operation
	// https://tc39.es/ecma262/#typedarray-species-create
	var typedArraySpeciesConstructor$4 = function (originalArray) {
	  return aTypedArrayConstructor$1(speciesConstructor$2(originalArray, getTypedArrayConstructor$3(originalArray)));
	};

	var arrayFromConstructorAndList$1 = arrayFromConstructorAndList$2;
	var typedArraySpeciesConstructor$3 = typedArraySpeciesConstructor$4;

	var typedArrayFromSpeciesAndList = function (instance, list) {
	  return arrayFromConstructorAndList$1(typedArraySpeciesConstructor$3(instance), list);
	};

	var ArrayBufferViewCore$o = arrayBufferViewCore;
	var $filter$1 = arrayIteration.filter;
	var fromSpeciesAndList = typedArrayFromSpeciesAndList;

	var aTypedArray$n = ArrayBufferViewCore$o.aTypedArray;
	var exportTypedArrayMethod$o = ArrayBufferViewCore$o.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$o('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter$1(aTypedArray$n(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  return fromSpeciesAndList(this, list);
	});

	var ArrayBufferViewCore$n = arrayBufferViewCore;
	var $find$1 = arrayIteration.find;

	var aTypedArray$m = ArrayBufferViewCore$n.aTypedArray;
	var exportTypedArrayMethod$n = ArrayBufferViewCore$n.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$n('find', function find(predicate /* , thisArg */) {
	  return $find$1(aTypedArray$m(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$m = arrayBufferViewCore;
	var $findIndex$1 = arrayIteration.findIndex;

	var aTypedArray$l = ArrayBufferViewCore$m.aTypedArray;
	var exportTypedArrayMethod$m = ArrayBufferViewCore$m.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$m('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex$1(aTypedArray$l(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var bind$8 = functionBindContext;
	var IndexedObject$3 = indexedObject;
	var toObject$a = toObject$j;
	var lengthOfArrayLike$c = lengthOfArrayLike$n;

	// `Array.prototype.{ findLast, findLastIndex }` methods implementation
	var createMethod$3 = function (TYPE) {
	  var IS_FIND_LAST_INDEX = TYPE == 1;
	  return function ($this, callbackfn, that) {
	    var O = toObject$a($this);
	    var self = IndexedObject$3(O);
	    var boundFunction = bind$8(callbackfn, that);
	    var index = lengthOfArrayLike$c(self);
	    var value, result;
	    while (index-- > 0) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (result) switch (TYPE) {
	        case 0: return value; // findLast
	        case 1: return index; // findLastIndex
	      }
	    }
	    return IS_FIND_LAST_INDEX ? -1 : undefined;
	  };
	};

	var arrayIterationFromLast = {
	  // `Array.prototype.findLast` method
	  // https://github.com/tc39/proposal-array-find-from-last
	  findLast: createMethod$3(0),
	  // `Array.prototype.findLastIndex` method
	  // https://github.com/tc39/proposal-array-find-from-last
	  findLastIndex: createMethod$3(1)
	};

	var ArrayBufferViewCore$l = arrayBufferViewCore;
	var $findLast = arrayIterationFromLast.findLast;

	var aTypedArray$k = ArrayBufferViewCore$l.aTypedArray;
	var exportTypedArrayMethod$l = ArrayBufferViewCore$l.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findLast` method
	// https://github.com/tc39/proposal-array-find-from-last
	exportTypedArrayMethod$l('findLast', function findLast(predicate /* , thisArg */) {
	  return $findLast(aTypedArray$k(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$k = arrayBufferViewCore;
	var $findLastIndex = arrayIterationFromLast.findLastIndex;

	var aTypedArray$j = ArrayBufferViewCore$k.aTypedArray;
	var exportTypedArrayMethod$k = ArrayBufferViewCore$k.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findLastIndex` method
	// https://github.com/tc39/proposal-array-find-from-last
	exportTypedArrayMethod$k('findLastIndex', function findLastIndex(predicate /* , thisArg */) {
	  return $findLastIndex(aTypedArray$j(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$j = arrayBufferViewCore;
	var $forEach$2 = arrayIteration.forEach;

	var aTypedArray$i = ArrayBufferViewCore$j.aTypedArray;
	var exportTypedArrayMethod$j = ArrayBufferViewCore$j.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$j('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach$2(aTypedArray$i(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$i = arrayBufferViewCore;
	var $includes$1 = arrayIncludes.includes;

	var aTypedArray$h = ArrayBufferViewCore$i.aTypedArray;
	var exportTypedArrayMethod$i = ArrayBufferViewCore$i.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$i('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes$1(aTypedArray$h(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$h = arrayBufferViewCore;
	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$g = ArrayBufferViewCore$h.aTypedArray;
	var exportTypedArrayMethod$h = ArrayBufferViewCore$h.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$h('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$g(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var global$s = global$K;
	var fails$A = fails$X;
	var uncurryThis$r = functionUncurryThis;
	var ArrayBufferViewCore$g = arrayBufferViewCore;
	var ArrayIterators = es_array_iterator;
	var wellKnownSymbol$c = wellKnownSymbol$v;

	var ITERATOR$1 = wellKnownSymbol$c('iterator');
	var Uint8Array$1 = global$s.Uint8Array;
	var arrayValues = uncurryThis$r(ArrayIterators.values);
	var arrayKeys = uncurryThis$r(ArrayIterators.keys);
	var arrayEntries = uncurryThis$r(ArrayIterators.entries);
	var aTypedArray$f = ArrayBufferViewCore$g.aTypedArray;
	var exportTypedArrayMethod$g = ArrayBufferViewCore$g.exportTypedArrayMethod;
	var TypedArrayPrototype = Uint8Array$1 && Uint8Array$1.prototype;

	var GENERIC = !fails$A(function () {
	  TypedArrayPrototype[ITERATOR$1].call([1]);
	});

	var ITERATOR_IS_VALUES = !!TypedArrayPrototype
	  && TypedArrayPrototype.values
	  && TypedArrayPrototype[ITERATOR$1] === TypedArrayPrototype.values
	  && TypedArrayPrototype.values.name === 'values';

	var typedArrayValues = function values() {
	  return arrayValues(aTypedArray$f(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$g('entries', function entries() {
	  return arrayEntries(aTypedArray$f(this));
	}, GENERIC);
	// `%TypedArray%.prototype.keys` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$g('keys', function keys() {
	  return arrayKeys(aTypedArray$f(this));
	}, GENERIC);
	// `%TypedArray%.prototype.values` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$g('values', typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$g(ITERATOR$1, typedArrayValues, GENERIC || !ITERATOR_IS_VALUES, { name: 'values' });

	var ArrayBufferViewCore$f = arrayBufferViewCore;
	var uncurryThis$q = functionUncurryThis;

	var aTypedArray$e = ArrayBufferViewCore$f.aTypedArray;
	var exportTypedArrayMethod$f = ArrayBufferViewCore$f.exportTypedArrayMethod;
	var $join = uncurryThis$q([].join);

	// `%TypedArray%.prototype.join` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.join
	exportTypedArrayMethod$f('join', function join(separator) {
	  return $join(aTypedArray$e(this), separator);
	});

	var fails$z = fails$X;

	var arrayMethodIsStrict$4 = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails$z(function () {
	    // eslint-disable-next-line no-useless-call -- required for testing
	    method.call(null, argument || function () { return 1; }, 1);
	  });
	};

	/* eslint-disable es/no-array-prototype-lastindexof -- safe */
	var apply$7 = functionApply$1;
	var toIndexedObject$7 = toIndexedObject$e;
	var toIntegerOrInfinity$5 = toIntegerOrInfinity$e;
	var lengthOfArrayLike$b = lengthOfArrayLike$n;
	var arrayMethodIsStrict$3 = arrayMethodIsStrict$4;

	var min$4 = Math.min;
	var $lastIndexOf$1 = [].lastIndexOf;
	var NEGATIVE_ZERO = !!$lastIndexOf$1 && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$3 = arrayMethodIsStrict$3('lastIndexOf');
	var FORCED$a = NEGATIVE_ZERO || !STRICT_METHOD$3;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$a ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return apply$7($lastIndexOf$1, this, arguments) || 0;
	  var O = toIndexedObject$7(this);
	  var length = lengthOfArrayLike$b(O);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$4(index, toIntegerOrInfinity$5(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : $lastIndexOf$1;

	var ArrayBufferViewCore$e = arrayBufferViewCore;
	var apply$6 = functionApply$1;
	var $lastIndexOf = arrayLastIndexOf;

	var aTypedArray$d = ArrayBufferViewCore$e.aTypedArray;
	var exportTypedArrayMethod$e = ArrayBufferViewCore$e.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.lastindexof
	exportTypedArrayMethod$e('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  var length = arguments.length;
	  return apply$6($lastIndexOf, aTypedArray$d(this), length > 1 ? [searchElement, arguments[1]] : [searchElement]);
	});

	var ArrayBufferViewCore$d = arrayBufferViewCore;
	var $map$1 = arrayIteration.map;
	var typedArraySpeciesConstructor$2 = typedArraySpeciesConstructor$4;

	var aTypedArray$c = ArrayBufferViewCore$d.aTypedArray;
	var exportTypedArrayMethod$d = ArrayBufferViewCore$d.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
	  return $map$1(aTypedArray$c(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (typedArraySpeciesConstructor$2(O))(length);
	  });
	});

	var aCallable$a = aCallable$e;
	var toObject$9 = toObject$j;
	var IndexedObject$2 = indexedObject;
	var lengthOfArrayLike$a = lengthOfArrayLike$n;

	var $TypeError$7 = TypeError;

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$2 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aCallable$a(callbackfn);
	    var O = toObject$9(that);
	    var self = IndexedObject$2(O);
	    var length = lengthOfArrayLike$a(O);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw $TypeError$7('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduce
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
	};

	var ArrayBufferViewCore$c = arrayBufferViewCore;
	var $reduce = arrayReduce.left;

	var aTypedArray$b = ArrayBufferViewCore$c.aTypedArray;
	var exportTypedArrayMethod$c = ArrayBufferViewCore$c.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$c('reduce', function reduce(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduce(aTypedArray$b(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$b = arrayBufferViewCore;
	var $reduceRight = arrayReduce.right;

	var aTypedArray$a = ArrayBufferViewCore$b.aTypedArray;
	var exportTypedArrayMethod$b = ArrayBufferViewCore$b.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRight` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$b('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  var length = arguments.length;
	  return $reduceRight(aTypedArray$a(this), callbackfn, length, length > 1 ? arguments[1] : undefined);
	});

	var ArrayBufferViewCore$a = arrayBufferViewCore;

	var aTypedArray$9 = ArrayBufferViewCore$a.aTypedArray;
	var exportTypedArrayMethod$a = ArrayBufferViewCore$a.exportTypedArrayMethod;
	var floor$3 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$a('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$9(that).length;
	  var middle = floor$3(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var global$r = global$K;
	var call$h = functionCall;
	var ArrayBufferViewCore$9 = arrayBufferViewCore;
	var lengthOfArrayLike$9 = lengthOfArrayLike$n;
	var toOffset = toOffset$2;
	var toIndexedObject$6 = toObject$j;
	var fails$y = fails$X;

	var RangeError$1 = global$r.RangeError;
	var Int8Array$2 = global$r.Int8Array;
	var Int8ArrayPrototype = Int8Array$2 && Int8Array$2.prototype;
	var $set = Int8ArrayPrototype && Int8ArrayPrototype.set;
	var aTypedArray$8 = ArrayBufferViewCore$9.aTypedArray;
	var exportTypedArrayMethod$9 = ArrayBufferViewCore$9.exportTypedArrayMethod;

	var WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS = !fails$y(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  var array = new Uint8ClampedArray(2);
	  call$h($set, array, { length: 1, 0: 3 }, 1);
	  return array[1] !== 3;
	});

	// https://bugs.chromium.org/p/v8/issues/detail?id=11294 and other
	var TO_OBJECT_BUG = WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS && ArrayBufferViewCore$9.NATIVE_ARRAY_BUFFER_VIEWS && fails$y(function () {
	  var array = new Int8Array$2(2);
	  array.set(1);
	  array.set('2', 1);
	  return array[0] !== 0 || array[1] !== 2;
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$9('set', function set(arrayLike /* , offset */) {
	  aTypedArray$8(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var src = toIndexedObject$6(arrayLike);
	  if (WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS) return call$h($set, this, src, offset);
	  var length = this.length;
	  var len = lengthOfArrayLike$9(src);
	  var index = 0;
	  if (len + offset > length) throw RangeError$1('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, !WORKS_WITH_OBJECTS_AND_GEERIC_ON_TYPED_ARRAYS || TO_OBJECT_BUG);

	var ArrayBufferViewCore$8 = arrayBufferViewCore;
	var typedArraySpeciesConstructor$1 = typedArraySpeciesConstructor$4;
	var fails$x = fails$X;
	var arraySlice$8 = arraySlice$a;

	var aTypedArray$7 = ArrayBufferViewCore$8.aTypedArray;
	var exportTypedArrayMethod$8 = ArrayBufferViewCore$8.exportTypedArrayMethod;

	var FORCED$9 = fails$x(function () {
	  // eslint-disable-next-line es/no-typed-arrays -- required for testing
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$8('slice', function slice(start, end) {
	  var list = arraySlice$8(aTypedArray$7(this), start, end);
	  var C = typedArraySpeciesConstructor$1(this);
	  var index = 0;
	  var length = list.length;
	  var result = new C(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$9);

	var ArrayBufferViewCore$7 = arrayBufferViewCore;
	var $some = arrayIteration.some;

	var aTypedArray$6 = ArrayBufferViewCore$7.aTypedArray;
	var exportTypedArrayMethod$7 = ArrayBufferViewCore$7.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$7('some', function some(callbackfn /* , thisArg */) {
	  return $some(aTypedArray$6(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var arraySlice$7 = arraySliceSimple;

	var floor$2 = Math.floor;

	var mergeSort = function (array, comparefn) {
	  var length = array.length;
	  var middle = floor$2(length / 2);
	  return length < 8 ? insertionSort(array, comparefn) : merge(
	    array,
	    mergeSort(arraySlice$7(array, 0, middle), comparefn),
	    mergeSort(arraySlice$7(array, middle), comparefn),
	    comparefn
	  );
	};

	var insertionSort = function (array, comparefn) {
	  var length = array.length;
	  var i = 1;
	  var element, j;

	  while (i < length) {
	    j = i;
	    element = array[i];
	    while (j && comparefn(array[j - 1], element) > 0) {
	      array[j] = array[--j];
	    }
	    if (j !== i++) array[j] = element;
	  } return array;
	};

	var merge = function (array, left, right, comparefn) {
	  var llength = left.length;
	  var rlength = right.length;
	  var lindex = 0;
	  var rindex = 0;

	  while (lindex < llength || rindex < rlength) {
	    array[lindex + rindex] = (lindex < llength && rindex < rlength)
	      ? comparefn(left[lindex], right[rindex]) <= 0 ? left[lindex++] : right[rindex++]
	      : lindex < llength ? left[lindex++] : right[rindex++];
	  } return array;
	};

	var arraySort = mergeSort;

	var userAgent$4 = engineUserAgent;

	var firefox = userAgent$4.match(/firefox\/(\d+)/i);

	var engineFfVersion = !!firefox && +firefox[1];

	var UA = engineUserAgent;

	var engineIsIeOrEdge = /MSIE|Trident/.test(UA);

	var userAgent$3 = engineUserAgent;

	var webkit = userAgent$3.match(/AppleWebKit\/(\d+)\./);

	var engineWebkitVersion = !!webkit && +webkit[1];

	var global$q = global$K;
	var uncurryThis$p = functionUncurryThisClause;
	var fails$w = fails$X;
	var aCallable$9 = aCallable$e;
	var internalSort$1 = arraySort;
	var ArrayBufferViewCore$6 = arrayBufferViewCore;
	var FF$1 = engineFfVersion;
	var IE_OR_EDGE$1 = engineIsIeOrEdge;
	var V8$1 = engineV8Version;
	var WEBKIT$1 = engineWebkitVersion;

	var aTypedArray$5 = ArrayBufferViewCore$6.aTypedArray;
	var exportTypedArrayMethod$6 = ArrayBufferViewCore$6.exportTypedArrayMethod;
	var Uint16Array = global$q.Uint16Array;
	var nativeSort$1 = Uint16Array && uncurryThis$p(Uint16Array.prototype.sort);

	// WebKit
	var ACCEPT_INCORRECT_ARGUMENTS = !!nativeSort$1 && !(fails$w(function () {
	  nativeSort$1(new Uint16Array(2), null);
	}) && fails$w(function () {
	  nativeSort$1(new Uint16Array(2), {});
	}));

	var STABLE_SORT$1 = !!nativeSort$1 && !fails$w(function () {
	  // feature detection can be too slow, so check engines versions
	  if (V8$1) return V8$1 < 74;
	  if (FF$1) return FF$1 < 67;
	  if (IE_OR_EDGE$1) return true;
	  if (WEBKIT$1) return WEBKIT$1 < 602;

	  var array = new Uint16Array(516);
	  var expected = Array(516);
	  var index, mod;

	  for (index = 0; index < 516; index++) {
	    mod = index % 4;
	    array[index] = 515 - index;
	    expected[index] = index - 2 * mod + 3;
	  }

	  nativeSort$1(array, function (a, b) {
	    return (a / 4 | 0) - (b / 4 | 0);
	  });

	  for (index = 0; index < 516; index++) {
	    if (array[index] !== expected[index]) return true;
	  }
	});

	var getSortCompare$1 = function (comparefn) {
	  return function (x, y) {
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (y !== y) return -1;
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (x !== x) return 1;
	    if (x === 0 && y === 0) return 1 / x > 0 && 1 / y < 0 ? 1 : -1;
	    return x > y;
	  };
	};

	// `%TypedArray%.prototype.sort` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$6('sort', function sort(comparefn) {
	  if (comparefn !== undefined) aCallable$9(comparefn);
	  if (STABLE_SORT$1) return nativeSort$1(this, comparefn);

	  return internalSort$1(aTypedArray$5(this), getSortCompare$1(comparefn));
	}, !STABLE_SORT$1 || ACCEPT_INCORRECT_ARGUMENTS);

	var ArrayBufferViewCore$5 = arrayBufferViewCore;
	var toLength$4 = toLength$a;
	var toAbsoluteIndex$1 = toAbsoluteIndex$7;
	var typedArraySpeciesConstructor = typedArraySpeciesConstructor$4;

	var aTypedArray$4 = ArrayBufferViewCore$5.aTypedArray;
	var exportTypedArrayMethod$5 = ArrayBufferViewCore$5.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$5('subarray', function subarray(begin, end) {
	  var O = aTypedArray$4(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex$1(begin, length);
	  var C = typedArraySpeciesConstructor(O);
	  return new C(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength$4((end === undefined ? length : toAbsoluteIndex$1(end, length)) - beginIndex)
	  );
	});

	var global$p = global$K;
	var apply$5 = functionApply$1;
	var ArrayBufferViewCore$4 = arrayBufferViewCore;
	var fails$v = fails$X;
	var arraySlice$6 = arraySlice$a;

	var Int8Array$1 = global$p.Int8Array;
	var aTypedArray$3 = ArrayBufferViewCore$4.aTypedArray;
	var exportTypedArrayMethod$4 = ArrayBufferViewCore$4.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$1 && fails$v(function () {
	  $toLocaleString.call(new Int8Array$1(1));
	});

	var FORCED$8 = fails$v(function () {
	  return [1, 2].toLocaleString() != new Int8Array$1([1, 2]).toLocaleString();
	}) || !fails$v(function () {
	  Int8Array$1.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$4('toLocaleString', function toLocaleString() {
	  return apply$5(
	    $toLocaleString,
	    TO_LOCALE_STRING_BUG ? arraySlice$6(aTypedArray$3(this)) : aTypedArray$3(this),
	    arraySlice$6(arguments)
	  );
	}, FORCED$8);

	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;
	var fails$u = fails$X;
	var global$o = global$K;
	var uncurryThis$o = functionUncurryThis;

	var Uint8Array = global$o.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array && Uint8Array.prototype || {};
	var arrayToString = [].toString;
	var join$1 = uncurryThis$o([].join);

	if (fails$u(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return join$1(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.es/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod$3('toString', arrayToString, IS_NOT_ARRAY_METHOD);

	var lengthOfArrayLike$8 = lengthOfArrayLike$n;

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.toReversed
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
	var arrayToReversed$1 = function (O, C) {
	  var len = lengthOfArrayLike$8(O);
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) A[k] = O[len - k - 1];
	  return A;
	};

	var arrayToReversed = arrayToReversed$1;
	var ArrayBufferViewCore$3 = arrayBufferViewCore;

	var aTypedArray$2 = ArrayBufferViewCore$3.aTypedArray;
	var exportTypedArrayMethod$2 = ArrayBufferViewCore$3.exportTypedArrayMethod;
	var getTypedArrayConstructor$2 = ArrayBufferViewCore$3.getTypedArrayConstructor;

	// `%TypedArray%.prototype.toReversed` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toReversed
	exportTypedArrayMethod$2('toReversed', function toReversed() {
	  return arrayToReversed(aTypedArray$2(this), getTypedArrayConstructor$2(this));
	});

	var ArrayBufferViewCore$2 = arrayBufferViewCore;
	var uncurryThis$n = functionUncurryThis;
	var aCallable$8 = aCallable$e;
	var arrayFromConstructorAndList = arrayFromConstructorAndList$2;

	var aTypedArray$1 = ArrayBufferViewCore$2.aTypedArray;
	var getTypedArrayConstructor$1 = ArrayBufferViewCore$2.getTypedArrayConstructor;
	var exportTypedArrayMethod$1 = ArrayBufferViewCore$2.exportTypedArrayMethod;
	var sort = uncurryThis$n(ArrayBufferViewCore$2.TypedArrayPrototype.sort);

	// `%TypedArray%.prototype.toSorted` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.toSorted
	exportTypedArrayMethod$1('toSorted', function toSorted(compareFn) {
	  if (compareFn !== undefined) aCallable$8(compareFn);
	  var O = aTypedArray$1(this);
	  var A = arrayFromConstructorAndList(getTypedArrayConstructor$1(O), O);
	  return sort(A, compareFn);
	});

	var lengthOfArrayLike$7 = lengthOfArrayLike$n;
	var toIntegerOrInfinity$4 = toIntegerOrInfinity$e;

	var $RangeError$2 = RangeError;

	// https://tc39.es/proposal-change-array-by-copy/#sec-array.prototype.with
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
	var arrayWith$1 = function (O, C, index, value) {
	  var len = lengthOfArrayLike$7(O);
	  var relativeIndex = toIntegerOrInfinity$4(index);
	  var actualIndex = relativeIndex < 0 ? len + relativeIndex : relativeIndex;
	  if (actualIndex >= len || actualIndex < 0) throw $RangeError$2('Incorrect index');
	  var A = new C(len);
	  var k = 0;
	  for (; k < len; k++) A[k] = k === actualIndex ? value : O[k];
	  return A;
	};

	var arrayWith = arrayWith$1;
	var ArrayBufferViewCore$1 = arrayBufferViewCore;
	var isBigIntArray = isBigIntArray$2;
	var toIntegerOrInfinity$3 = toIntegerOrInfinity$e;
	var toBigInt = toBigInt$3;

	var aTypedArray = ArrayBufferViewCore$1.aTypedArray;
	var getTypedArrayConstructor = ArrayBufferViewCore$1.getTypedArrayConstructor;
	var exportTypedArrayMethod = ArrayBufferViewCore$1.exportTypedArrayMethod;

	var PROPER_ORDER = !!function () {
	  try {
	    // eslint-disable-next-line no-throw-literal, es/no-typed-arrays -- required for testing
	    new Int8Array(1)['with'](2, { valueOf: function () { throw 8; } });
	  } catch (error) {
	    // some early implementations, like WebKit, does not follow the final semantic
	    // https://github.com/tc39/proposal-change-array-by-copy/pull/86
	    return error === 8;
	  }
	}();

	// `%TypedArray%.prototype.with` method
	// https://tc39.es/proposal-change-array-by-copy/#sec-%typedarray%.prototype.with
	exportTypedArrayMethod('with', { 'with': function (index, value) {
	  var O = aTypedArray(this);
	  var relativeIndex = toIntegerOrInfinity$3(index);
	  var actualValue = isBigIntArray(O) ? toBigInt(value) : +value;
	  return arrayWith(O, getTypedArrayConstructor(O), relativeIndex, actualValue);
	} }['with'], !PROPER_ORDER);

	var $$_ = _export;
	var global$n = global$K;
	var arrayBufferModule = arrayBuffer;
	var setSpecies$3 = setSpecies$5;

	var ARRAY_BUFFER = 'ArrayBuffer';
	var ArrayBuffer$1 = arrayBufferModule[ARRAY_BUFFER];
	var NativeArrayBuffer = global$n[ARRAY_BUFFER];

	// `ArrayBuffer` constructor
	// https://tc39.es/ecma262/#sec-arraybuffer-constructor
	$$_({ global: true, constructor: true, forced: NativeArrayBuffer !== ArrayBuffer$1 }, {
	  ArrayBuffer: ArrayBuffer$1
	});

	setSpecies$3(ARRAY_BUFFER);

	var createTypedArrayConstructor$7 = typedArrayConstructor.exports;

	// `Int32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$7('Int32', function (init) {
	  return function Int32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$6 = typedArrayConstructor.exports;

	// `Float32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$6('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$5 = typedArrayConstructor.exports;

	// `Float64Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$5('Float64', function (init) {
	  return function Float64Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var $$Z = _export;
	var fill = arrayFill$1;
	var addToUnscopables$5 = addToUnscopables$7;

	// `Array.prototype.fill` method
	// https://tc39.es/ecma262/#sec-array.prototype.fill
	$$Z({ target: 'Array', proto: true }, {
	  fill: fill
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$5('fill');

	var $$Y = _export;
	var copyWithin = arrayCopyWithin;
	var addToUnscopables$4 = addToUnscopables$7;

	// `Array.prototype.copyWithin` method
	// https://tc39.es/ecma262/#sec-array.prototype.copywithin
	$$Y({ target: 'Array', proto: true }, {
	  copyWithin: copyWithin
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$4('copyWithin');

	var createTypedArrayConstructor$4 = typedArrayConstructor.exports;

	// `Int8Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$4('Int8', function (init) {
	  return function Int8Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$3 = typedArrayConstructor.exports;

	// `Int16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$3('Int16', function (init) {
	  return function Int16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$2 = typedArrayConstructor.exports;

	// `Uint16Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$2('Uint16', function (init) {
	  return function Uint16Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var createTypedArrayConstructor$1 = typedArrayConstructor.exports;

	// `Uint32Array` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor$1('Uint32', function (init) {
	  return function Uint32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var $$X = _export;
	var fails$t = fails$X;

	// eslint-disable-next-line es/no-math-imul -- required for testing
	var $imul = Math.imul;

	var FORCED$7 = fails$t(function () {
	  return $imul(0xFFFFFFFF, 5) != -5 || $imul.length != 2;
	});

	// `Math.imul` method
	// https://tc39.es/ecma262/#sec-math.imul
	// some WebKit versions fails with big numbers, some has wrong arity
	$$X({ target: 'Math', stat: true, forced: FORCED$7 }, {
	  imul: function imul(x, y) {
	    var UINT16 = 0xFFFF;
	    var xn = +x;
	    var yn = +y;
	    var xl = UINT16 & xn;
	    var yl = UINT16 & yn;
	    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
	  }
	});

	// `Math.sign` method implementation
	// https://tc39.es/ecma262/#sec-math.sign
	// eslint-disable-next-line es/no-math-sign -- safe
	var mathSign = Math.sign || function sign(x) {
	  var n = +x;
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return n == 0 || n != n ? n : n < 0 ? -1 : 1;
	};

	var sign$1 = mathSign;

	var abs = Math.abs;
	var pow$1 = Math.pow;
	var EPSILON = pow$1(2, -52);
	var EPSILON32 = pow$1(2, -23);
	var MAX32 = pow$1(2, 127) * (2 - EPSILON32);
	var MIN32 = pow$1(2, -126);

	var roundTiesToEven = function (n) {
	  return n + 1 / EPSILON - 1 / EPSILON;
	};

	// `Math.fround` method implementation
	// https://tc39.es/ecma262/#sec-math.fround
	// eslint-disable-next-line es/no-math-fround -- safe
	var mathFround = Math.fround || function fround(x) {
	  var n = +x;
	  var $abs = abs(n);
	  var $sign = sign$1(n);
	  var a, result;
	  if ($abs < MIN32) return $sign * roundTiesToEven($abs / MIN32 / EPSILON32) * MIN32 * EPSILON32;
	  a = (1 + EPSILON32 / EPSILON) * $abs;
	  result = a - (a - $abs);
	  // eslint-disable-next-line no-self-compare -- NaN check
	  if (result > MAX32 || result != result) return $sign * Infinity;
	  return $sign * result;
	};

	var $$W = _export;
	var fround = mathFround;

	// `Math.fround` method
	// https://tc39.es/ecma262/#sec-math.fround
	$$W({ target: 'Math', stat: true }, { fround: fround });

	var $$V = _export;

	var floor$1 = Math.floor;
	var log$3 = Math.log;
	var LOG2E = Math.LOG2E;

	// `Math.clz32` method
	// https://tc39.es/ecma262/#sec-math.clz32
	$$V({ target: 'Math', stat: true }, {
	  clz32: function clz32(x) {
	    var n = x >>> 0;
	    return n ? 31 - floor$1(log$3(n + 0.5) * LOG2E) : 32;
	  }
	});

	var uncurryThis$m = functionUncurryThis;
	var requireObjectCoercible$8 = requireObjectCoercible$d;
	var toString$e = toString$k;

	var quot = /"/g;
	var replace$4 = uncurryThis$m(''.replace);

	// `CreateHTML` abstract operation
	// https://tc39.es/ecma262/#sec-createhtml
	var createHtml = function (string, tag, attribute, value) {
	  var S = toString$e(requireObjectCoercible$8(string));
	  var p1 = '<' + tag;
	  if (attribute !== '') p1 += ' ' + attribute + '="' + replace$4(toString$e(value), quot, '&quot;') + '"';
	  return p1 + '>' + S + '</' + tag + '>';
	};

	var fails$s = fails$X;

	// check the existence of a method, lowercase
	// of a tag and escaping quotes in arguments
	var stringHtmlForced = function (METHOD_NAME) {
	  return fails$s(function () {
	    var test = ''[METHOD_NAME]('"');
	    return test !== test.toLowerCase() || test.split('"').length > 3;
	  });
	};

	var $$U = _export;
	var createHTML$1 = createHtml;
	var forcedStringHTMLMethod$1 = stringHtmlForced;

	// `String.prototype.sub` method
	// https://tc39.es/ecma262/#sec-string.prototype.sub
	$$U({ target: 'String', proto: true, forced: forcedStringHTMLMethod$1('sub') }, {
	  sub: function sub() {
	    return createHTML$1(this, 'sub', '', '');
	  }
	});

	var uncurryThis$l = functionUncurryThis;

	// `thisNumberValue` abstract operation
	// https://tc39.es/ecma262/#sec-thisnumbervalue
	var thisNumberValue$2 = uncurryThis$l(1.0.valueOf);

	// a string of all valid unicode whitespaces
	var whitespaces$2 = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
	  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

	var uncurryThis$k = functionUncurryThis;
	var requireObjectCoercible$7 = requireObjectCoercible$d;
	var toString$d = toString$k;
	var whitespaces$1 = whitespaces$2;

	var replace$3 = uncurryThis$k(''.replace);
	var whitespace = '[' + whitespaces$1 + ']';
	var ltrim = RegExp('^' + whitespace + whitespace + '*');
	var rtrim = RegExp(whitespace + whitespace + '*$');

	// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
	var createMethod$1 = function (TYPE) {
	  return function ($this) {
	    var string = toString$d(requireObjectCoercible$7($this));
	    if (TYPE & 1) string = replace$3(string, ltrim, '');
	    if (TYPE & 2) string = replace$3(string, rtrim, '');
	    return string;
	  };
	};

	var stringTrim = {
	  // `String.prototype.{ trimLeft, trimStart }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
	  start: createMethod$1(1),
	  // `String.prototype.{ trimRight, trimEnd }` methods
	  // https://tc39.es/ecma262/#sec-string.prototype.trimend
	  end: createMethod$1(2),
	  // `String.prototype.trim` method
	  // https://tc39.es/ecma262/#sec-string.prototype.trim
	  trim: createMethod$1(3)
	};

	var DESCRIPTORS$e = descriptors;
	var global$m = global$K;
	var uncurryThis$j = functionUncurryThis;
	var isForced$3 = isForced_1;
	var defineBuiltIn$9 = defineBuiltIn$h;
	var hasOwn$f = hasOwnProperty_1;
	var inheritIfRequired$3 = inheritIfRequired$6;
	var isPrototypeOf$6 = objectIsPrototypeOf;
	var isSymbol$2 = isSymbol$6;
	var toPrimitive = toPrimitive$3;
	var fails$r = fails$X;
	var getOwnPropertyNames$2 = objectGetOwnPropertyNames.f;
	var getOwnPropertyDescriptor$3 = objectGetOwnPropertyDescriptor.f;
	var defineProperty$9 = objectDefineProperty.f;
	var thisNumberValue$1 = thisNumberValue$2;
	var trim = stringTrim.trim;

	var NUMBER = 'Number';
	var NativeNumber = global$m[NUMBER];
	var NumberPrototype = NativeNumber.prototype;
	var TypeError$3 = global$m.TypeError;
	var arraySlice$5 = uncurryThis$j(''.slice);
	var charCodeAt$1 = uncurryThis$j(''.charCodeAt);

	// `ToNumeric` abstract operation
	// https://tc39.es/ecma262/#sec-tonumeric
	var toNumeric = function (value) {
	  var primValue = toPrimitive(value, 'number');
	  return typeof primValue == 'bigint' ? primValue : toNumber(primValue);
	};

	// `ToNumber` abstract operation
	// https://tc39.es/ecma262/#sec-tonumber
	var toNumber = function (argument) {
	  var it = toPrimitive(argument, 'number');
	  var first, third, radix, maxCode, digits, length, index, code;
	  if (isSymbol$2(it)) throw TypeError$3('Cannot convert a Symbol value to a number');
	  if (typeof it == 'string' && it.length > 2) {
	    it = trim(it);
	    first = charCodeAt$1(it, 0);
	    if (first === 43 || first === 45) {
	      third = charCodeAt$1(it, 2);
	      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
	    } else if (first === 48) {
	      switch (charCodeAt$1(it, 1)) {
	        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
	        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
	        default: return +it;
	      }
	      digits = arraySlice$5(it, 2);
	      length = digits.length;
	      for (index = 0; index < length; index++) {
	        code = charCodeAt$1(digits, index);
	        // parseInt parses a string to a first unavailable symbol
	        // but ToNumber should return NaN if a string contains unavailable symbols
	        if (code < 48 || code > maxCode) return NaN;
	      } return parseInt(digits, radix);
	    }
	  } return +it;
	};

	// `Number` constructor
	// https://tc39.es/ecma262/#sec-number-constructor
	if (isForced$3(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
	  var NumberWrapper = function Number(value) {
	    var n = arguments.length < 1 ? 0 : NativeNumber(toNumeric(value));
	    var dummy = this;
	    // check on 1..constructor(foo) case
	    return isPrototypeOf$6(NumberPrototype, dummy) && fails$r(function () { thisNumberValue$1(dummy); })
	      ? inheritIfRequired$3(Object(n), dummy, NumberWrapper) : n;
	  };
	  for (var keys$1 = DESCRIPTORS$e ? getOwnPropertyNames$2(NativeNumber) : (
	    // ES3:
	    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
	    // ES2015 (in case, if modules with ES2015 Number statics required before):
	    'EPSILON,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,isFinite,isInteger,isNaN,isSafeInteger,parseFloat,parseInt,' +
	    // ESNext
	    'fromString,range'
	  ).split(','), j = 0, key$2; keys$1.length > j; j++) {
	    if (hasOwn$f(NativeNumber, key$2 = keys$1[j]) && !hasOwn$f(NumberWrapper, key$2)) {
	      defineProperty$9(NumberWrapper, key$2, getOwnPropertyDescriptor$3(NativeNumber, key$2));
	    }
	  }
	  NumberWrapper.prototype = NumberPrototype;
	  NumberPrototype.constructor = NumberWrapper;
	  defineBuiltIn$9(global$m, NUMBER, NumberWrapper, { constructor: true });
	}

	var $$T = _export;
	var trunc = mathTrunc;

	// `Math.trunc` method
	// https://tc39.es/ecma262/#sec-math.trunc
	$$T({ target: 'Math', stat: true }, {
	  trunc: trunc
	});

	var isObject$d = isObject$r;
	var classof$5 = classofRaw$2;
	var wellKnownSymbol$b = wellKnownSymbol$v;

	var MATCH$2 = wellKnownSymbol$b('match');

	// `IsRegExp` abstract operation
	// https://tc39.es/ecma262/#sec-isregexp
	var isRegexp = function (it) {
	  var isRegExp;
	  return isObject$d(it) && ((isRegExp = it[MATCH$2]) !== undefined ? !!isRegExp : classof$5(it) == 'RegExp');
	};

	var isRegExp$2 = isRegexp;

	var $TypeError$6 = TypeError;

	var notARegexp = function (it) {
	  if (isRegExp$2(it)) {
	    throw $TypeError$6("The method doesn't accept regular expressions");
	  } return it;
	};

	var wellKnownSymbol$a = wellKnownSymbol$v;

	var MATCH$1 = wellKnownSymbol$a('match');

	var correctIsRegexpLogic = function (METHOD_NAME) {
	  var regexp = /./;
	  try {
	    '/./'[METHOD_NAME](regexp);
	  } catch (error1) {
	    try {
	      regexp[MATCH$1] = false;
	      return '/./'[METHOD_NAME](regexp);
	    } catch (error2) { /* empty */ }
	  } return false;
	};

	var $$S = _export;
	var uncurryThis$i = functionUncurryThisClause;
	var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;
	var toLength$3 = toLength$a;
	var toString$c = toString$k;
	var notARegExp$2 = notARegexp;
	var requireObjectCoercible$6 = requireObjectCoercible$d;
	var correctIsRegExpLogic$2 = correctIsRegexpLogic;

	// eslint-disable-next-line es/no-string-prototype-startswith -- safe
	var nativeStartsWith = uncurryThis$i(''.startsWith);
	var stringSlice$4 = uncurryThis$i(''.slice);
	var min$3 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC$1 = correctIsRegExpLogic$2('startsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG$1 = !CORRECT_IS_REGEXP_LOGIC$1 && !!function () {
	  var descriptor = getOwnPropertyDescriptor$2(String.prototype, 'startsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.startsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.startswith
	$$S({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG$1 && !CORRECT_IS_REGEXP_LOGIC$1 }, {
	  startsWith: function startsWith(searchString /* , position = 0 */) {
	    var that = toString$c(requireObjectCoercible$6(this));
	    notARegExp$2(searchString);
	    var index = toLength$3(min$3(arguments.length > 1 ? arguments[1] : undefined, that.length));
	    var search = toString$c(searchString);
	    return nativeStartsWith
	      ? nativeStartsWith(that, search, index)
	      : stringSlice$4(that, index, index + search.length) === search;
	  }
	});

	var classof$4 = classofRaw$2;
	var global$l = global$K;

	var engineIsNode = classof$4(global$l.process) == 'process';

	var $TypeError$5 = TypeError;

	var validateArgumentsLength$1 = function (passed, required) {
	  if (passed < required) throw $TypeError$5('Not enough arguments');
	  return passed;
	};

	var userAgent$2 = engineUserAgent;

	var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent$2);

	var global$k = global$K;
	var apply$4 = functionApply$1;
	var bind$7 = functionBindContext;
	var isCallable$8 = isCallable$t;
	var hasOwn$e = hasOwnProperty_1;
	var fails$q = fails$X;
	var html = html$2;
	var arraySlice$4 = arraySlice$a;
	var createElement = documentCreateElement$2;
	var validateArgumentsLength = validateArgumentsLength$1;
	var IS_IOS$1 = engineIsIos;
	var IS_NODE$4 = engineIsNode;

	var set = global$k.setImmediate;
	var clear = global$k.clearImmediate;
	var process$2 = global$k.process;
	var Dispatch = global$k.Dispatch;
	var Function$1 = global$k.Function;
	var MessageChannel = global$k.MessageChannel;
	var String$1 = global$k.String;
	var counter = 0;
	var queue$1 = {};
	var ONREADYSTATECHANGE = 'onreadystatechange';
	var $location, defer, channel, port;

	try {
	  // Deno throws a ReferenceError on `location` access without `--location` flag
	  $location = global$k.location;
	} catch (error) { /* empty */ }

	var run = function (id) {
	  if (hasOwn$e(queue$1, id)) {
	    var fn = queue$1[id];
	    delete queue$1[id];
	    fn();
	  }
	};

	var runner = function (id) {
	  return function () {
	    run(id);
	  };
	};

	var listener = function (event) {
	  run(event.data);
	};

	var post = function (id) {
	  // old engines have not location.origin
	  global$k.postMessage(String$1(id), $location.protocol + '//' + $location.host);
	};

	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if (!set || !clear) {
	  set = function setImmediate(handler) {
	    validateArgumentsLength(arguments.length, 1);
	    var fn = isCallable$8(handler) ? handler : Function$1(handler);
	    var args = arraySlice$4(arguments, 1);
	    queue$1[++counter] = function () {
	      apply$4(fn, undefined, args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clear = function clearImmediate(id) {
	    delete queue$1[id];
	  };
	  // Node.js 0.8-
	  if (IS_NODE$4) {
	    defer = function (id) {
	      process$2.nextTick(runner(id));
	    };
	  // Sphere (JS game engine) Dispatch API
	  } else if (Dispatch && Dispatch.now) {
	    defer = function (id) {
	      Dispatch.now(runner(id));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  // except iOS - https://github.com/zloirock/core-js/issues/624
	  } else if (MessageChannel && !IS_IOS$1) {
	    channel = new MessageChannel();
	    port = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = bind$7(port.postMessage, port);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if (
	    global$k.addEventListener &&
	    isCallable$8(global$k.postMessage) &&
	    !global$k.importScripts &&
	    $location && $location.protocol !== 'file:' &&
	    !fails$q(post)
	  ) {
	    defer = post;
	    global$k.addEventListener('message', listener, false);
	  // IE8-
	  } else if (ONREADYSTATECHANGE in createElement('script')) {
	    defer = function (id) {
	      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
	        html.removeChild(this);
	        run(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function (id) {
	      setTimeout(runner(id), 0);
	    };
	  }
	}

	var task$1 = {
	  set: set,
	  clear: clear
	};

	var userAgent$1 = engineUserAgent;
	var global$j = global$K;

	var engineIsIosPebble = /ipad|iphone|ipod/i.test(userAgent$1) && global$j.Pebble !== undefined;

	var userAgent = engineUserAgent;

	var engineIsWebosWebkit = /web0s(?!.*chrome)/i.test(userAgent);

	var global$i = global$K;
	var bind$6 = functionBindContext;
	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
	var macrotask = task$1.set;
	var IS_IOS = engineIsIos;
	var IS_IOS_PEBBLE = engineIsIosPebble;
	var IS_WEBOS_WEBKIT = engineIsWebosWebkit;
	var IS_NODE$3 = engineIsNode;

	var MutationObserver = global$i.MutationObserver || global$i.WebKitMutationObserver;
	var document$2 = global$i.document;
	var process$1 = global$i.process;
	var Promise$1 = global$i.Promise;
	// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
	var queueMicrotaskDescriptor = getOwnPropertyDescriptor$1(global$i, 'queueMicrotask');
	var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

	var flush, head, last, notify$1, toggle, node, promise, then;

	// modern engines have queueMicrotask method
	if (!queueMicrotask) {
	  flush = function () {
	    var parent, fn;
	    if (IS_NODE$3 && (parent = process$1.domain)) parent.exit();
	    while (head) {
	      fn = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch (error) {
	        if (head) notify$1();
	        else last = undefined;
	        throw error;
	      }
	    } last = undefined;
	    if (parent) parent.enter();
	  };

	  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
	  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
	  if (!IS_IOS && !IS_NODE$3 && !IS_WEBOS_WEBKIT && MutationObserver && document$2) {
	    toggle = true;
	    node = document$2.createTextNode('');
	    new MutationObserver(flush).observe(node, { characterData: true });
	    notify$1 = function () {
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if (!IS_IOS_PEBBLE && Promise$1 && Promise$1.resolve) {
	    // Promise.resolve without an argument throws an error in LG WebOS 2
	    promise = Promise$1.resolve(undefined);
	    // workaround of WebKit ~ iOS Safari 10.1 bug
	    promise.constructor = Promise$1;
	    then = bind$6(promise.then, promise);
	    notify$1 = function () {
	      then(flush);
	    };
	  // Node.js without promises
	  } else if (IS_NODE$3) {
	    notify$1 = function () {
	      process$1.nextTick(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessage
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    // strange IE + webpack dev server bug - use .bind(global)
	    macrotask = bind$6(macrotask, global$i);
	    notify$1 = function () {
	      macrotask(flush);
	    };
	  }
	}

	var microtask$1 = queueMicrotask || function (fn) {
	  var task = { fn: fn, next: undefined };
	  if (last) last.next = task;
	  if (!head) {
	    head = task;
	    notify$1();
	  } last = task;
	};

	var global$h = global$K;

	var hostReportErrors$1 = function (a, b) {
	  var console = global$h.console;
	  if (console && console.error) {
	    arguments.length == 1 ? console.error(a) : console.error(a, b);
	  }
	};

	var perform$3 = function (exec) {
	  try {
	    return { error: false, value: exec() };
	  } catch (error) {
	    return { error: true, value: error };
	  }
	};

	var Queue$1 = function () {
	  this.head = null;
	  this.tail = null;
	};

	Queue$1.prototype = {
	  add: function (item) {
	    var entry = { item: item, next: null };
	    if (this.head) this.tail.next = entry;
	    else this.head = entry;
	    this.tail = entry;
	  },
	  get: function () {
	    var entry = this.head;
	    if (entry) {
	      this.head = entry.next;
	      if (this.tail === entry) this.tail = null;
	      return entry.item;
	    }
	  }
	};

	var queue = Queue$1;

	var global$g = global$K;

	var promiseNativeConstructor = global$g.Promise;

	/* global Deno -- Deno case */

	var engineIsDeno = typeof Deno == 'object' && Deno && typeof Deno.version == 'object';

	var IS_DENO$1 = engineIsDeno;
	var IS_NODE$2 = engineIsNode;

	var engineIsBrowser = !IS_DENO$1 && !IS_NODE$2
	  && typeof window == 'object'
	  && typeof document == 'object';

	var global$f = global$K;
	var NativePromiseConstructor$3 = promiseNativeConstructor;
	var isCallable$7 = isCallable$t;
	var isForced$2 = isForced_1;
	var inspectSource = inspectSource$3;
	var wellKnownSymbol$9 = wellKnownSymbol$v;
	var IS_BROWSER = engineIsBrowser;
	var IS_DENO = engineIsDeno;
	var V8_VERSION$1 = engineV8Version;

	NativePromiseConstructor$3 && NativePromiseConstructor$3.prototype;
	var SPECIES = wellKnownSymbol$9('species');
	var SUBCLASSING = false;
	var NATIVE_PROMISE_REJECTION_EVENT$1 = isCallable$7(global$f.PromiseRejectionEvent);

	var FORCED_PROMISE_CONSTRUCTOR$5 = isForced$2('Promise', function () {
	  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(NativePromiseConstructor$3);
	  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(NativePromiseConstructor$3);
	  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	  // We can't detect it synchronously, so just check versions
	  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION$1 === 66) return true;
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (!V8_VERSION$1 || V8_VERSION$1 < 51 || !/native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) {
	    // Detect correctness of subclassing with @@species support
	    var promise = new NativePromiseConstructor$3(function (resolve) { resolve(1); });
	    var FakePromise = function (exec) {
	      exec(function () { /* empty */ }, function () { /* empty */ });
	    };
	    var constructor = promise.constructor = {};
	    constructor[SPECIES] = FakePromise;
	    SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
	    if (!SUBCLASSING) return true;
	  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	  } return !GLOBAL_CORE_JS_PROMISE && (IS_BROWSER || IS_DENO) && !NATIVE_PROMISE_REJECTION_EVENT$1;
	});

	var promiseConstructorDetection = {
	  CONSTRUCTOR: FORCED_PROMISE_CONSTRUCTOR$5,
	  REJECTION_EVENT: NATIVE_PROMISE_REJECTION_EVENT$1,
	  SUBCLASSING: SUBCLASSING
	};

	var newPromiseCapability$2 = {};

	var aCallable$7 = aCallable$e;

	var $TypeError$4 = TypeError;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw $TypeError$4('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aCallable$7(resolve);
	  this.reject = aCallable$7(reject);
	};

	// `NewPromiseCapability` abstract operation
	// https://tc39.es/ecma262/#sec-newpromisecapability
	newPromiseCapability$2.f = function (C) {
	  return new PromiseCapability(C);
	};

	var $$R = _export;
	var IS_NODE$1 = engineIsNode;
	var global$e = global$K;
	var call$g = functionCall;
	var defineBuiltIn$8 = defineBuiltIn$h;
	var setPrototypeOf$1 = objectSetPrototypeOf;
	var setToStringTag$7 = setToStringTag$b;
	var setSpecies$2 = setSpecies$5;
	var aCallable$6 = aCallable$e;
	var isCallable$6 = isCallable$t;
	var isObject$c = isObject$r;
	var anInstance$5 = anInstance$8;
	var speciesConstructor$1 = speciesConstructor$3;
	var task = task$1.set;
	var microtask = microtask$1;
	var hostReportErrors = hostReportErrors$1;
	var perform$2 = perform$3;
	var Queue = queue;
	var InternalStateModule$5 = internalState;
	var NativePromiseConstructor$2 = promiseNativeConstructor;
	var PromiseConstructorDetection = promiseConstructorDetection;
	var newPromiseCapabilityModule$3 = newPromiseCapability$2;

	var PROMISE = 'Promise';
	var FORCED_PROMISE_CONSTRUCTOR$4 = PromiseConstructorDetection.CONSTRUCTOR;
	var NATIVE_PROMISE_REJECTION_EVENT = PromiseConstructorDetection.REJECTION_EVENT;
	var NATIVE_PROMISE_SUBCLASSING = PromiseConstructorDetection.SUBCLASSING;
	var getInternalPromiseState = InternalStateModule$5.getterFor(PROMISE);
	var setInternalState$5 = InternalStateModule$5.set;
	var NativePromisePrototype$1 = NativePromiseConstructor$2 && NativePromiseConstructor$2.prototype;
	var PromiseConstructor = NativePromiseConstructor$2;
	var PromisePrototype = NativePromisePrototype$1;
	var TypeError$2 = global$e.TypeError;
	var document$1 = global$e.document;
	var process = global$e.process;
	var newPromiseCapability$1 = newPromiseCapabilityModule$3.f;
	var newGenericPromiseCapability = newPromiseCapability$1;

	var DISPATCH_EVENT = !!(document$1 && document$1.createEvent && global$e.dispatchEvent);
	var UNHANDLED_REJECTION = 'unhandledrejection';
	var REJECTION_HANDLED = 'rejectionhandled';
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;
	var HANDLED = 1;
	var UNHANDLED = 2;

	var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

	// helpers
	var isThenable = function (it) {
	  var then;
	  return isObject$c(it) && isCallable$6(then = it.then) ? then : false;
	};

	var callReaction = function (reaction, state) {
	  var value = state.value;
	  var ok = state.state == FULFILLED;
	  var handler = ok ? reaction.ok : reaction.fail;
	  var resolve = reaction.resolve;
	  var reject = reaction.reject;
	  var domain = reaction.domain;
	  var result, then, exited;
	  try {
	    if (handler) {
	      if (!ok) {
	        if (state.rejection === UNHANDLED) onHandleUnhandled(state);
	        state.rejection = HANDLED;
	      }
	      if (handler === true) result = value;
	      else {
	        if (domain) domain.enter();
	        result = handler(value); // can throw
	        if (domain) {
	          domain.exit();
	          exited = true;
	        }
	      }
	      if (result === reaction.promise) {
	        reject(TypeError$2('Promise-chain cycle'));
	      } else if (then = isThenable(result)) {
	        call$g(then, result, resolve, reject);
	      } else resolve(result);
	    } else reject(value);
	  } catch (error) {
	    if (domain && !exited) domain.exit();
	    reject(error);
	  }
	};

	var notify = function (state, isReject) {
	  if (state.notified) return;
	  state.notified = true;
	  microtask(function () {
	    var reactions = state.reactions;
	    var reaction;
	    while (reaction = reactions.get()) {
	      callReaction(reaction, state);
	    }
	    state.notified = false;
	    if (isReject && !state.rejection) onUnhandled(state);
	  });
	};

	var dispatchEvent = function (name, promise, reason) {
	  var event, handler;
	  if (DISPATCH_EVENT) {
	    event = document$1.createEvent('Event');
	    event.promise = promise;
	    event.reason = reason;
	    event.initEvent(name, false, true);
	    global$e.dispatchEvent(event);
	  } else event = { promise: promise, reason: reason };
	  if (!NATIVE_PROMISE_REJECTION_EVENT && (handler = global$e['on' + name])) handler(event);
	  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
	};

	var onUnhandled = function (state) {
	  call$g(task, global$e, function () {
	    var promise = state.facade;
	    var value = state.value;
	    var IS_UNHANDLED = isUnhandled(state);
	    var result;
	    if (IS_UNHANDLED) {
	      result = perform$2(function () {
	        if (IS_NODE$1) {
	          process.emit('unhandledRejection', value, promise);
	        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
	      if (result.error) throw result.value;
	    }
	  });
	};

	var isUnhandled = function (state) {
	  return state.rejection !== HANDLED && !state.parent;
	};

	var onHandleUnhandled = function (state) {
	  call$g(task, global$e, function () {
	    var promise = state.facade;
	    if (IS_NODE$1) {
	      process.emit('rejectionHandled', promise);
	    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
	  });
	};

	var bind$5 = function (fn, state, unwrap) {
	  return function (value) {
	    fn(state, value, unwrap);
	  };
	};

	var internalReject = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  state.value = value;
	  state.state = REJECTED;
	  notify(state, true);
	};

	var internalResolve = function (state, value, unwrap) {
	  if (state.done) return;
	  state.done = true;
	  if (unwrap) state = unwrap;
	  try {
	    if (state.facade === value) throw TypeError$2("Promise can't be resolved itself");
	    var then = isThenable(value);
	    if (then) {
	      microtask(function () {
	        var wrapper = { done: false };
	        try {
	          call$g(then, value,
	            bind$5(internalResolve, wrapper, state),
	            bind$5(internalReject, wrapper, state)
	          );
	        } catch (error) {
	          internalReject(wrapper, error, state);
	        }
	      });
	    } else {
	      state.value = value;
	      state.state = FULFILLED;
	      notify(state, false);
	    }
	  } catch (error) {
	    internalReject({ done: false }, error, state);
	  }
	};

	// constructor polyfill
	if (FORCED_PROMISE_CONSTRUCTOR$4) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance$5(this, PromisePrototype);
	    aCallable$6(executor);
	    call$g(Internal, this);
	    var state = getInternalPromiseState(this);
	    try {
	      executor(bind$5(internalResolve, state), bind$5(internalReject, state));
	    } catch (error) {
	      internalReject(state, error);
	    }
	  };

	  PromisePrototype = PromiseConstructor.prototype;

	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  Internal = function Promise(executor) {
	    setInternalState$5(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: new Queue(),
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };

	  // `Promise.prototype.then` method
	  // https://tc39.es/ecma262/#sec-promise.prototype.then
	  Internal.prototype = defineBuiltIn$8(PromisePrototype, 'then', function then(onFulfilled, onRejected) {
	    var state = getInternalPromiseState(this);
	    var reaction = newPromiseCapability$1(speciesConstructor$1(this, PromiseConstructor));
	    state.parent = true;
	    reaction.ok = isCallable$6(onFulfilled) ? onFulfilled : true;
	    reaction.fail = isCallable$6(onRejected) && onRejected;
	    reaction.domain = IS_NODE$1 ? process.domain : undefined;
	    if (state.state == PENDING) state.reactions.add(reaction);
	    else microtask(function () {
	      callReaction(reaction, state);
	    });
	    return reaction.promise;
	  });

	  OwnPromiseCapability = function () {
	    var promise = new Internal();
	    var state = getInternalPromiseState(promise);
	    this.promise = promise;
	    this.resolve = bind$5(internalResolve, state);
	    this.reject = bind$5(internalReject, state);
	  };

	  newPromiseCapabilityModule$3.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if (isCallable$6(NativePromiseConstructor$2) && NativePromisePrototype$1 !== Object.prototype) {
	    nativeThen = NativePromisePrototype$1.then;

	    if (!NATIVE_PROMISE_SUBCLASSING) {
	      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
	      defineBuiltIn$8(NativePromisePrototype$1, 'then', function then(onFulfilled, onRejected) {
	        var that = this;
	        return new PromiseConstructor(function (resolve, reject) {
	          call$g(nativeThen, that, resolve, reject);
	        }).then(onFulfilled, onRejected);
	      // https://github.com/zloirock/core-js/issues/640
	      }, { unsafe: true });
	    }

	    // make `.constructor === Promise` work for native promise-based APIs
	    try {
	      delete NativePromisePrototype$1.constructor;
	    } catch (error) { /* empty */ }

	    // make `instanceof Promise` work for native promise-based APIs
	    if (setPrototypeOf$1) {
	      setPrototypeOf$1(NativePromisePrototype$1, PromisePrototype);
	    }
	  }
	}

	$$R({ global: true, constructor: true, wrap: true, forced: FORCED_PROMISE_CONSTRUCTOR$4 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag$7(PromiseConstructor, PROMISE, false);
	setSpecies$2(PROMISE);

	var call$f = functionCall;
	var anObject$g = anObject$r;
	var getMethod$3 = getMethod$7;

	var iteratorClose$2 = function (iterator, kind, value) {
	  var innerResult, innerError;
	  anObject$g(iterator);
	  try {
	    innerResult = getMethod$3(iterator, 'return');
	    if (!innerResult) {
	      if (kind === 'throw') throw value;
	      return value;
	    }
	    innerResult = call$f(innerResult, iterator);
	  } catch (error) {
	    innerError = true;
	    innerResult = error;
	  }
	  if (kind === 'throw') throw value;
	  if (innerError) throw innerResult;
	  anObject$g(innerResult);
	  return value;
	};

	var bind$4 = functionBindContext;
	var call$e = functionCall;
	var anObject$f = anObject$r;
	var tryToString$1 = tryToString$7;
	var isArrayIteratorMethod$1 = isArrayIteratorMethod$3;
	var lengthOfArrayLike$6 = lengthOfArrayLike$n;
	var isPrototypeOf$5 = objectIsPrototypeOf;
	var getIterator$1 = getIterator$3;
	var getIteratorMethod$1 = getIteratorMethod$4;
	var iteratorClose$1 = iteratorClose$2;

	var $TypeError$3 = TypeError;

	var Result = function (stopped, result) {
	  this.stopped = stopped;
	  this.result = result;
	};

	var ResultPrototype = Result.prototype;

	var iterate$6 = function (iterable, unboundFunction, options) {
	  var that = options && options.that;
	  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
	  var IS_RECORD = !!(options && options.IS_RECORD);
	  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
	  var INTERRUPTED = !!(options && options.INTERRUPTED);
	  var fn = bind$4(unboundFunction, that);
	  var iterator, iterFn, index, length, result, next, step;

	  var stop = function (condition) {
	    if (iterator) iteratorClose$1(iterator, 'normal', condition);
	    return new Result(true, condition);
	  };

	  var callFn = function (value) {
	    if (AS_ENTRIES) {
	      anObject$f(value);
	      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
	    } return INTERRUPTED ? fn(value, stop) : fn(value);
	  };

	  if (IS_RECORD) {
	    iterator = iterable.iterator;
	  } else if (IS_ITERATOR) {
	    iterator = iterable;
	  } else {
	    iterFn = getIteratorMethod$1(iterable);
	    if (!iterFn) throw $TypeError$3(tryToString$1(iterable) + ' is not iterable');
	    // optimisation for array iterators
	    if (isArrayIteratorMethod$1(iterFn)) {
	      for (index = 0, length = lengthOfArrayLike$6(iterable); length > index; index++) {
	        result = callFn(iterable[index]);
	        if (result && isPrototypeOf$5(ResultPrototype, result)) return result;
	      } return new Result(false);
	    }
	    iterator = getIterator$1(iterable, iterFn);
	  }

	  next = IS_RECORD ? iterable.next : iterator.next;
	  while (!(step = call$e(next, iterator)).done) {
	    try {
	      result = callFn(step.value);
	    } catch (error) {
	      iteratorClose$1(iterator, 'throw', error);
	    }
	    if (typeof result == 'object' && result && isPrototypeOf$5(ResultPrototype, result)) return result;
	  } return new Result(false);
	};

	var NativePromiseConstructor$1 = promiseNativeConstructor;
	var checkCorrectnessOfIteration$2 = checkCorrectnessOfIteration$4;
	var FORCED_PROMISE_CONSTRUCTOR$3 = promiseConstructorDetection.CONSTRUCTOR;

	var promiseStaticsIncorrectIteration = FORCED_PROMISE_CONSTRUCTOR$3 || !checkCorrectnessOfIteration$2(function (iterable) {
	  NativePromiseConstructor$1.all(iterable).then(undefined, function () { /* empty */ });
	});

	var $$Q = _export;
	var call$d = functionCall;
	var aCallable$5 = aCallable$e;
	var newPromiseCapabilityModule$2 = newPromiseCapability$2;
	var perform$1 = perform$3;
	var iterate$5 = iterate$6;
	var PROMISE_STATICS_INCORRECT_ITERATION$1 = promiseStaticsIncorrectIteration;

	// `Promise.all` method
	// https://tc39.es/ecma262/#sec-promise.all
	$$Q({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION$1 }, {
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$2.f(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform$1(function () {
	      var $promiseResolve = aCallable$5(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate$5(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        remaining++;
	        call$d($promiseResolve, C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$P = _export;
	var FORCED_PROMISE_CONSTRUCTOR$2 = promiseConstructorDetection.CONSTRUCTOR;
	var NativePromiseConstructor = promiseNativeConstructor;
	var getBuiltIn$a = getBuiltIn$i;
	var isCallable$5 = isCallable$t;
	var defineBuiltIn$7 = defineBuiltIn$h;

	var NativePromisePrototype = NativePromiseConstructor && NativePromiseConstructor.prototype;

	// `Promise.prototype.catch` method
	// https://tc39.es/ecma262/#sec-promise.prototype.catch
	$$P({ target: 'Promise', proto: true, forced: FORCED_PROMISE_CONSTRUCTOR$2, real: true }, {
	  'catch': function (onRejected) {
	    return this.then(undefined, onRejected);
	  }
	});

	// makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
	if (isCallable$5(NativePromiseConstructor)) {
	  var method = getBuiltIn$a('Promise').prototype['catch'];
	  if (NativePromisePrototype['catch'] !== method) {
	    defineBuiltIn$7(NativePromisePrototype, 'catch', method, { unsafe: true });
	  }
	}

	var $$O = _export;
	var call$c = functionCall;
	var aCallable$4 = aCallable$e;
	var newPromiseCapabilityModule$1 = newPromiseCapability$2;
	var perform = perform$3;
	var iterate$4 = iterate$6;
	var PROMISE_STATICS_INCORRECT_ITERATION = promiseStaticsIncorrectIteration;

	// `Promise.race` method
	// https://tc39.es/ecma262/#sec-promise.race
	$$O({ target: 'Promise', stat: true, forced: PROMISE_STATICS_INCORRECT_ITERATION }, {
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapabilityModule$1.f(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aCallable$4(C.resolve);
	      iterate$4(iterable, function (promise) {
	        call$c($promiseResolve, C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var $$N = _export;
	var call$b = functionCall;
	var newPromiseCapabilityModule = newPromiseCapability$2;
	var FORCED_PROMISE_CONSTRUCTOR$1 = promiseConstructorDetection.CONSTRUCTOR;

	// `Promise.reject` method
	// https://tc39.es/ecma262/#sec-promise.reject
	$$N({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR$1 }, {
	  reject: function reject(r) {
	    var capability = newPromiseCapabilityModule.f(this);
	    call$b(capability.reject, undefined, r);
	    return capability.promise;
	  }
	});

	var anObject$e = anObject$r;
	var isObject$b = isObject$r;
	var newPromiseCapability = newPromiseCapability$2;

	var promiseResolve$1 = function (C, x) {
	  anObject$e(C);
	  if (isObject$b(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var $$M = _export;
	var getBuiltIn$9 = getBuiltIn$i;
	var FORCED_PROMISE_CONSTRUCTOR = promiseConstructorDetection.CONSTRUCTOR;
	var promiseResolve = promiseResolve$1;

	getBuiltIn$9('Promise');

	// `Promise.resolve` method
	// https://tc39.es/ecma262/#sec-promise.resolve
	$$M({ target: 'Promise', stat: true, forced: FORCED_PROMISE_CONSTRUCTOR }, {
	  resolve: function resolve(x) {
	    return promiseResolve(this, x);
	  }
	});

	var DESCRIPTORS$d = descriptors;
	var FUNCTION_NAME_EXISTS = functionName.EXISTS;
	var uncurryThis$h = functionUncurryThis;
	var defineProperty$8 = objectDefineProperty.f;

	var FunctionPrototype$1 = Function.prototype;
	var functionToString = uncurryThis$h(FunctionPrototype$1.toString);
	var nameRE = /function\b(?:\s|\/\*[\S\s]*?\*\/|\/\/[^\n\r]*[\n\r]+)*([^\s(/]*)/;
	var regExpExec$2 = uncurryThis$h(nameRE.exec);
	var NAME = 'name';

	// Function instances `.name` property
	// https://tc39.es/ecma262/#sec-function-instances-name
	if (DESCRIPTORS$d && !FUNCTION_NAME_EXISTS) {
	  defineProperty$8(FunctionPrototype$1, NAME, {
	    configurable: true,
	    get: function () {
	      try {
	        return regExpExec$2(nameRE, functionToString(this))[1];
	      } catch (error) {
	        return '';
	      }
	    }
	  });
	}

	var call$a = functionCall;
	var hasOwn$d = hasOwnProperty_1;
	var isPrototypeOf$4 = objectIsPrototypeOf;
	var regExpFlags = regexpFlags$1;

	var RegExpPrototype$4 = RegExp.prototype;

	var regexpGetFlags = function (R) {
	  var flags = R.flags;
	  return flags === undefined && !('flags' in RegExpPrototype$4) && !hasOwn$d(R, 'flags') && isPrototypeOf$4(RegExpPrototype$4, R)
	    ? call$a(regExpFlags, R) : flags;
	};

	var PROPER_FUNCTION_NAME$1 = functionName.PROPER;
	var defineBuiltIn$6 = defineBuiltIn$h;
	var anObject$d = anObject$r;
	var $toString$1 = toString$k;
	var fails$p = fails$X;
	var getRegExpFlags$1 = regexpGetFlags;

	var TO_STRING = 'toString';
	var RegExpPrototype$3 = RegExp.prototype;
	var nativeToString = RegExpPrototype$3[TO_STRING];

	var NOT_GENERIC = fails$p(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
	// FF44- RegExp#toString has a wrong name
	var INCORRECT_NAME = PROPER_FUNCTION_NAME$1 && nativeToString.name != TO_STRING;

	// `RegExp.prototype.toString` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
	if (NOT_GENERIC || INCORRECT_NAME) {
	  defineBuiltIn$6(RegExp.prototype, TO_STRING, function toString() {
	    var R = anObject$d(this);
	    var pattern = $toString$1(R.source);
	    var flags = $toString$1(getRegExpFlags$1(R));
	    return '/' + pattern + '/' + flags;
	  }, { unsafe: true });
	}

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	// in old WebKit versions, `element.classList` is not an instance of global `DOMTokenList`
	var documentCreateElement = documentCreateElement$2;

	var classList = documentCreateElement('span').classList;
	var DOMTokenListPrototype$2 = classList && classList.constructor && classList.constructor.prototype;

	var domTokenListPrototype = DOMTokenListPrototype$2 === Object.prototype ? undefined : DOMTokenListPrototype$2;

	var $forEach$1 = arrayIteration.forEach;
	var arrayMethodIsStrict$2 = arrayMethodIsStrict$4;

	var STRICT_METHOD$2 = arrayMethodIsStrict$2('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.es/ecma262/#sec-array.prototype.foreach
	var arrayForEach = !STRICT_METHOD$2 ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach$1(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	// eslint-disable-next-line es/no-array-prototype-foreach -- safe
	} : [].forEach;

	var global$d = global$K;
	var DOMIterables$1 = domIterables;
	var DOMTokenListPrototype$1 = domTokenListPrototype;
	var forEach = arrayForEach;
	var createNonEnumerableProperty$3 = createNonEnumerableProperty$d;

	var handlePrototype$1 = function (CollectionPrototype) {
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
	    createNonEnumerableProperty$3(CollectionPrototype, 'forEach', forEach);
	  } catch (error) {
	    CollectionPrototype.forEach = forEach;
	  }
	};

	for (var COLLECTION_NAME$1 in DOMIterables$1) {
	  if (DOMIterables$1[COLLECTION_NAME$1]) {
	    handlePrototype$1(global$d[COLLECTION_NAME$1] && global$d[COLLECTION_NAME$1].prototype);
	  }
	}

	handlePrototype$1(DOMTokenListPrototype$1);

	var $$L = _export;
	var fails$o = fails$X;
	var toObject$8 = toObject$j;
	var nativeGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER$1 = correctPrototypeGetter;

	var FAILS_ON_PRIMITIVES$5 = fails$o(function () { nativeGetPrototypeOf(1); });

	// `Object.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-object.getprototypeof
	$$L({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$5, sham: !CORRECT_PROTOTYPE_GETTER$1 }, {
	  getPrototypeOf: function getPrototypeOf(it) {
	    return nativeGetPrototypeOf(toObject$8(it));
	  }
	});

	var $$K = _export;
	var toObject$7 = toObject$j;
	var nativeKeys = objectKeys$4;
	var fails$n = fails$X;

	var FAILS_ON_PRIMITIVES$4 = fails$n(function () { nativeKeys(1); });

	// `Object.keys` method
	// https://tc39.es/ecma262/#sec-object.keys
	$$K({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
	  keys: function keys(it) {
	    return nativeKeys(toObject$7(it));
	  }
	});

	var $$J = _export;
	var fails$m = fails$X;
	var isArray$2 = isArray$6;
	var isObject$a = isObject$r;
	var toObject$6 = toObject$j;
	var lengthOfArrayLike$5 = lengthOfArrayLike$n;
	var doesNotExceedSafeInteger$2 = doesNotExceedSafeInteger$4;
	var createProperty$3 = createProperty$6;
	var arraySpeciesCreate$2 = arraySpeciesCreate$4;
	var arrayMethodHasSpeciesSupport$3 = arrayMethodHasSpeciesSupport$5;
	var wellKnownSymbol$8 = wellKnownSymbol$v;
	var V8_VERSION = engineV8Version;

	var IS_CONCAT_SPREADABLE = wellKnownSymbol$8('isConcatSpreadable');

	// We can't use this feature detection in V8 since it causes
	// deoptimization and serious performance degradation
	// https://github.com/zloirock/core-js/issues/679
	var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails$m(function () {
	  var array = [];
	  array[IS_CONCAT_SPREADABLE] = false;
	  return array.concat()[0] !== array;
	});

	var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport$3('concat');

	var isConcatSpreadable = function (O) {
	  if (!isObject$a(O)) return false;
	  var spreadable = O[IS_CONCAT_SPREADABLE];
	  return spreadable !== undefined ? !!spreadable : isArray$2(O);
	};

	var FORCED$6 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

	// `Array.prototype.concat` method
	// https://tc39.es/ecma262/#sec-array.prototype.concat
	// with adding support of @@isConcatSpreadable and @@species
	$$J({ target: 'Array', proto: true, arity: 1, forced: FORCED$6 }, {
	  // eslint-disable-next-line no-unused-vars -- required for `.length`
	  concat: function concat(arg) {
	    var O = toObject$6(this);
	    var A = arraySpeciesCreate$2(O, 0);
	    var n = 0;
	    var i, k, length, len, E;
	    for (i = -1, length = arguments.length; i < length; i++) {
	      E = i === -1 ? O : arguments[i];
	      if (isConcatSpreadable(E)) {
	        len = lengthOfArrayLike$5(E);
	        doesNotExceedSafeInteger$2(n + len);
	        for (k = 0; k < len; k++, n++) if (k in E) createProperty$3(A, n, E[k]);
	      } else {
	        doesNotExceedSafeInteger$2(n + 1);
	        createProperty$3(A, n++, E);
	      }
	    }
	    A.length = n;
	    return A;
	  }
	});

	var $$I = _export;
	var $includes = arrayIncludes.includes;
	var fails$l = fails$X;
	var addToUnscopables$3 = addToUnscopables$7;

	// FF99+ bug
	var BROKEN_ON_SPARSE = fails$l(function () {
	  return !Array(1).includes();
	});

	// `Array.prototype.includes` method
	// https://tc39.es/ecma262/#sec-array.prototype.includes
	$$I({ target: 'Array', proto: true, forced: BROKEN_ON_SPARSE }, {
	  includes: function includes(el /* , fromIndex = 0 */) {
	    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$3('includes');

	var $$H = _export;
	var uncurryThis$g = functionUncurryThis;
	var notARegExp$1 = notARegexp;
	var requireObjectCoercible$5 = requireObjectCoercible$d;
	var toString$b = toString$k;
	var correctIsRegExpLogic$1 = correctIsRegexpLogic;

	var stringIndexOf$1 = uncurryThis$g(''.indexOf);

	// `String.prototype.includes` method
	// https://tc39.es/ecma262/#sec-string.prototype.includes
	$$H({ target: 'String', proto: true, forced: !correctIsRegExpLogic$1('includes') }, {
	  includes: function includes(searchString /* , position = 0 */) {
	    return !!~stringIndexOf$1(
	      toString$b(requireObjectCoercible$5(this)),
	      toString$b(notARegExp$1(searchString)),
	      arguments.length > 1 ? arguments[1] : undefined
	    );
	  }
	});

	var $$G = _export;
	var uncurryThis$f = functionUncurryThis;
	var IndexedObject$1 = indexedObject;
	var toIndexedObject$5 = toIndexedObject$e;
	var arrayMethodIsStrict$1 = arrayMethodIsStrict$4;

	var nativeJoin = uncurryThis$f([].join);

	var ES3_STRINGS = IndexedObject$1 != Object;
	var STRICT_METHOD$1 = arrayMethodIsStrict$1('join', ',');

	// `Array.prototype.join` method
	// https://tc39.es/ecma262/#sec-array.prototype.join
	$$G({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$1 }, {
	  join: function join(separator) {
	    return nativeJoin(toIndexedObject$5(this), separator === undefined ? ',' : separator);
	  }
	});

	var $$F = _export;
	var $map = arrayIteration.map;
	var arrayMethodHasSpeciesSupport$2 = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport$2('map');

	// `Array.prototype.map` method
	// https://tc39.es/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	$$F({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$E = _export;
	var toObject$5 = toObject$j;
	var toAbsoluteIndex = toAbsoluteIndex$7;
	var toIntegerOrInfinity$2 = toIntegerOrInfinity$e;
	var lengthOfArrayLike$4 = lengthOfArrayLike$n;
	var setArrayLength = arraySetLength;
	var doesNotExceedSafeInteger$1 = doesNotExceedSafeInteger$4;
	var arraySpeciesCreate$1 = arraySpeciesCreate$4;
	var createProperty$2 = createProperty$6;
	var deletePropertyOrThrow$1 = deletePropertyOrThrow$3;
	var arrayMethodHasSpeciesSupport$1 = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport$1('splice');

	var max = Math.max;
	var min$2 = Math.min;

	// `Array.prototype.splice` method
	// https://tc39.es/ecma262/#sec-array.prototype.splice
	// with adding support of @@species
	$$E({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 }, {
	  splice: function splice(start, deleteCount /* , ...items */) {
	    var O = toObject$5(this);
	    var len = lengthOfArrayLike$4(O);
	    var actualStart = toAbsoluteIndex(start, len);
	    var argumentsLength = arguments.length;
	    var insertCount, actualDeleteCount, A, k, from, to;
	    if (argumentsLength === 0) {
	      insertCount = actualDeleteCount = 0;
	    } else if (argumentsLength === 1) {
	      insertCount = 0;
	      actualDeleteCount = len - actualStart;
	    } else {
	      insertCount = argumentsLength - 2;
	      actualDeleteCount = min$2(max(toIntegerOrInfinity$2(deleteCount), 0), len - actualStart);
	    }
	    doesNotExceedSafeInteger$1(len + insertCount - actualDeleteCount);
	    A = arraySpeciesCreate$1(O, actualDeleteCount);
	    for (k = 0; k < actualDeleteCount; k++) {
	      from = actualStart + k;
	      if (from in O) createProperty$2(A, k, O[from]);
	    }
	    A.length = actualDeleteCount;
	    if (insertCount < actualDeleteCount) {
	      for (k = actualStart; k < len - actualDeleteCount; k++) {
	        from = k + actualDeleteCount;
	        to = k + insertCount;
	        if (from in O) O[to] = O[from];
	        else deletePropertyOrThrow$1(O, to);
	      }
	      for (k = len; k > len - actualDeleteCount + insertCount; k--) deletePropertyOrThrow$1(O, k - 1);
	    } else if (insertCount > actualDeleteCount) {
	      for (k = len - actualDeleteCount; k > actualStart; k--) {
	        from = k + actualDeleteCount - 1;
	        to = k + insertCount - 1;
	        if (from in O) O[to] = O[from];
	        else deletePropertyOrThrow$1(O, to);
	      }
	    }
	    for (k = 0; k < insertCount; k++) {
	      O[k + actualStart] = arguments[k + 2];
	    }
	    setArrayLength(O, len - actualDeleteCount + insertCount);
	    return A;
	  }
	});

	var objectGetOwnPropertyNamesExternal = {};

	/* eslint-disable es/no-object-getownpropertynames -- safe */

	var classof$3 = classofRaw$2;
	var toIndexedObject$4 = toIndexedObject$e;
	var $getOwnPropertyNames$1 = objectGetOwnPropertyNames.f;
	var arraySlice$3 = arraySliceSimple;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function (it) {
	  try {
	    return $getOwnPropertyNames$1(it);
	  } catch (error) {
	    return arraySlice$3(windowNames);
	  }
	};

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	objectGetOwnPropertyNamesExternal.f = function getOwnPropertyNames(it) {
	  return windowNames && classof$3(it) == 'Window'
	    ? getWindowNames(it)
	    : $getOwnPropertyNames$1(toIndexedObject$4(it));
	};

	var wellKnownSymbolWrapped = {};

	var wellKnownSymbol$7 = wellKnownSymbol$v;

	wellKnownSymbolWrapped.f = wellKnownSymbol$7;

	var global$c = global$K;

	var path$1 = global$c;

	var path = path$1;
	var hasOwn$c = hasOwnProperty_1;
	var wrappedWellKnownSymbolModule$1 = wellKnownSymbolWrapped;
	var defineProperty$7 = objectDefineProperty.f;

	var wellKnownSymbolDefine = function (NAME) {
	  var Symbol = path.Symbol || (path.Symbol = {});
	  if (!hasOwn$c(Symbol, NAME)) defineProperty$7(Symbol, NAME, {
	    value: wrappedWellKnownSymbolModule$1.f(NAME)
	  });
	};

	var call$9 = functionCall;
	var getBuiltIn$8 = getBuiltIn$i;
	var wellKnownSymbol$6 = wellKnownSymbol$v;
	var defineBuiltIn$5 = defineBuiltIn$h;

	var symbolDefineToPrimitive = function () {
	  var Symbol = getBuiltIn$8('Symbol');
	  var SymbolPrototype = Symbol && Symbol.prototype;
	  var valueOf = SymbolPrototype && SymbolPrototype.valueOf;
	  var TO_PRIMITIVE = wellKnownSymbol$6('toPrimitive');

	  if (SymbolPrototype && !SymbolPrototype[TO_PRIMITIVE]) {
	    // `Symbol.prototype[@@toPrimitive]` method
	    // https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	    // eslint-disable-next-line no-unused-vars -- required for .length
	    defineBuiltIn$5(SymbolPrototype, TO_PRIMITIVE, function (hint) {
	      return call$9(valueOf, this);
	    }, { arity: 1 });
	  }
	};

	var $$D = _export;
	var global$b = global$K;
	var call$8 = functionCall;
	var uncurryThis$e = functionUncurryThis;
	var DESCRIPTORS$c = descriptors;
	var NATIVE_SYMBOL$4 = symbolConstructorDetection;
	var fails$k = fails$X;
	var hasOwn$b = hasOwnProperty_1;
	var isPrototypeOf$3 = objectIsPrototypeOf;
	var anObject$c = anObject$r;
	var toIndexedObject$3 = toIndexedObject$e;
	var toPropertyKey = toPropertyKey$5;
	var $toString = toString$k;
	var createPropertyDescriptor$3 = createPropertyDescriptor$a;
	var nativeObjectCreate = objectCreate;
	var objectKeys$2 = objectKeys$4;
	var getOwnPropertyNamesModule$1 = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternal = objectGetOwnPropertyNamesExternal;
	var getOwnPropertySymbolsModule$2 = objectGetOwnPropertySymbols;
	var getOwnPropertyDescriptorModule$1 = objectGetOwnPropertyDescriptor;
	var definePropertyModule$1 = objectDefineProperty;
	var definePropertiesModule = objectDefineProperties;
	var propertyIsEnumerableModule$1 = objectPropertyIsEnumerable;
	var defineBuiltIn$4 = defineBuiltIn$h;
	var shared$2 = shared$7.exports;
	var sharedKey = sharedKey$4;
	var hiddenKeys$1 = hiddenKeys$6;
	var uid$1 = uid$5;
	var wellKnownSymbol$5 = wellKnownSymbol$v;
	var wrappedWellKnownSymbolModule = wellKnownSymbolWrapped;
	var defineWellKnownSymbol$5 = wellKnownSymbolDefine;
	var defineSymbolToPrimitive$1 = symbolDefineToPrimitive;
	var setToStringTag$6 = setToStringTag$b;
	var InternalStateModule$4 = internalState;
	var $forEach = arrayIteration.forEach;

	var HIDDEN = sharedKey('hidden');
	var SYMBOL = 'Symbol';
	var PROTOTYPE = 'prototype';

	var setInternalState$4 = InternalStateModule$4.set;
	var getInternalState$4 = InternalStateModule$4.getterFor(SYMBOL);

	var ObjectPrototype$1 = Object[PROTOTYPE];
	var $Symbol = global$b.Symbol;
	var SymbolPrototype$1 = $Symbol && $Symbol[PROTOTYPE];
	var TypeError$1 = global$b.TypeError;
	var QObject = global$b.QObject;
	var nativeGetOwnPropertyDescriptor$1 = getOwnPropertyDescriptorModule$1.f;
	var nativeDefineProperty = definePropertyModule$1.f;
	var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
	var nativePropertyIsEnumerable = propertyIsEnumerableModule$1.f;
	var push$5 = uncurryThis$e([].push);

	var AllSymbols = shared$2('symbols');
	var ObjectPrototypeSymbols = shared$2('op-symbols');
	var WellKnownSymbolsStore = shared$2('wks');

	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDescriptor = DESCRIPTORS$c && fails$k(function () {
	  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
	    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
	  })).a != 7;
	}) ? function (O, P, Attributes) {
	  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
	  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
	  nativeDefineProperty(O, P, Attributes);
	  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
	    nativeDefineProperty(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
	  }
	} : nativeDefineProperty;

	var wrap = function (tag, description) {
	  var symbol = AllSymbols[tag] = nativeObjectCreate(SymbolPrototype$1);
	  setInternalState$4(symbol, {
	    type: SYMBOL,
	    tag: tag,
	    description: description
	  });
	  if (!DESCRIPTORS$c) symbol.description = description;
	  return symbol;
	};

	var $defineProperty = function defineProperty(O, P, Attributes) {
	  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
	  anObject$c(O);
	  var key = toPropertyKey(P);
	  anObject$c(Attributes);
	  if (hasOwn$b(AllSymbols, key)) {
	    if (!Attributes.enumerable) {
	      if (!hasOwn$b(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor$3(1, {}));
	      O[HIDDEN][key] = true;
	    } else {
	      if (hasOwn$b(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
	      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor$3(0, false) });
	    } return setSymbolDescriptor(O, key, Attributes);
	  } return nativeDefineProperty(O, key, Attributes);
	};

	var $defineProperties = function defineProperties(O, Properties) {
	  anObject$c(O);
	  var properties = toIndexedObject$3(Properties);
	  var keys = objectKeys$2(properties).concat($getOwnPropertySymbols(properties));
	  $forEach(keys, function (key) {
	    if (!DESCRIPTORS$c || call$8($propertyIsEnumerable$1, properties, key)) $defineProperty(O, key, properties[key]);
	  });
	  return O;
	};

	var $create = function create(O, Properties) {
	  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
	};

	var $propertyIsEnumerable$1 = function propertyIsEnumerable(V) {
	  var P = toPropertyKey(V);
	  var enumerable = call$8(nativePropertyIsEnumerable, this, P);
	  if (this === ObjectPrototype$1 && hasOwn$b(AllSymbols, P) && !hasOwn$b(ObjectPrototypeSymbols, P)) return false;
	  return enumerable || !hasOwn$b(this, P) || !hasOwn$b(AllSymbols, P) || hasOwn$b(this, HIDDEN) && this[HIDDEN][P]
	    ? enumerable : true;
	};

	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
	  var it = toIndexedObject$3(O);
	  var key = toPropertyKey(P);
	  if (it === ObjectPrototype$1 && hasOwn$b(AllSymbols, key) && !hasOwn$b(ObjectPrototypeSymbols, key)) return;
	  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
	  if (descriptor && hasOwn$b(AllSymbols, key) && !(hasOwn$b(it, HIDDEN) && it[HIDDEN][key])) {
	    descriptor.enumerable = true;
	  }
	  return descriptor;
	};

	var $getOwnPropertyNames = function getOwnPropertyNames(O) {
	  var names = nativeGetOwnPropertyNames(toIndexedObject$3(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (!hasOwn$b(AllSymbols, key) && !hasOwn$b(hiddenKeys$1, key)) push$5(result, key);
	  });
	  return result;
	};

	var $getOwnPropertySymbols = function (O) {
	  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
	  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject$3(O));
	  var result = [];
	  $forEach(names, function (key) {
	    if (hasOwn$b(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || hasOwn$b(ObjectPrototype$1, key))) {
	      push$5(result, AllSymbols[key]);
	    }
	  });
	  return result;
	};

	// `Symbol` constructor
	// https://tc39.es/ecma262/#sec-symbol-constructor
	if (!NATIVE_SYMBOL$4) {
	  $Symbol = function Symbol() {
	    if (isPrototypeOf$3(SymbolPrototype$1, this)) throw TypeError$1('Symbol is not a constructor');
	    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
	    var tag = uid$1(description);
	    var setter = function (value) {
	      if (this === ObjectPrototype$1) call$8(setter, ObjectPrototypeSymbols, value);
	      if (hasOwn$b(this, HIDDEN) && hasOwn$b(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
	      setSymbolDescriptor(this, tag, createPropertyDescriptor$3(1, value));
	    };
	    if (DESCRIPTORS$c && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
	    return wrap(tag, description);
	  };

	  SymbolPrototype$1 = $Symbol[PROTOTYPE];

	  defineBuiltIn$4(SymbolPrototype$1, 'toString', function toString() {
	    return getInternalState$4(this).tag;
	  });

	  defineBuiltIn$4($Symbol, 'withoutSetter', function (description) {
	    return wrap(uid$1(description), description);
	  });

	  propertyIsEnumerableModule$1.f = $propertyIsEnumerable$1;
	  definePropertyModule$1.f = $defineProperty;
	  definePropertiesModule.f = $defineProperties;
	  getOwnPropertyDescriptorModule$1.f = $getOwnPropertyDescriptor;
	  getOwnPropertyNamesModule$1.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
	  getOwnPropertySymbolsModule$2.f = $getOwnPropertySymbols;

	  wrappedWellKnownSymbolModule.f = function (name) {
	    return wrap(wellKnownSymbol$5(name), name);
	  };

	  if (DESCRIPTORS$c) {
	    // https://github.com/tc39/proposal-Symbol-description
	    nativeDefineProperty(SymbolPrototype$1, 'description', {
	      configurable: true,
	      get: function description() {
	        return getInternalState$4(this).description;
	      }
	    });
	    {
	      defineBuiltIn$4(ObjectPrototype$1, 'propertyIsEnumerable', $propertyIsEnumerable$1, { unsafe: true });
	    }
	  }
	}

	$$D({ global: true, constructor: true, wrap: true, forced: !NATIVE_SYMBOL$4, sham: !NATIVE_SYMBOL$4 }, {
	  Symbol: $Symbol
	});

	$forEach(objectKeys$2(WellKnownSymbolsStore), function (name) {
	  defineWellKnownSymbol$5(name);
	});

	$$D({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL$4 }, {
	  useSetter: function () { USE_SETTER = true; },
	  useSimple: function () { USE_SETTER = false; }
	});

	$$D({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4, sham: !DESCRIPTORS$c }, {
	  // `Object.create` method
	  // https://tc39.es/ecma262/#sec-object.create
	  create: $create,
	  // `Object.defineProperty` method
	  // https://tc39.es/ecma262/#sec-object.defineproperty
	  defineProperty: $defineProperty,
	  // `Object.defineProperties` method
	  // https://tc39.es/ecma262/#sec-object.defineproperties
	  defineProperties: $defineProperties,
	  // `Object.getOwnPropertyDescriptor` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
	});

	$$D({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL$4 }, {
	  // `Object.getOwnPropertyNames` method
	  // https://tc39.es/ecma262/#sec-object.getownpropertynames
	  getOwnPropertyNames: $getOwnPropertyNames
	});

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	defineSymbolToPrimitive$1();

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag$6($Symbol, SYMBOL);

	hiddenKeys$1[HIDDEN] = true;

	var NATIVE_SYMBOL$3 = symbolConstructorDetection;

	/* eslint-disable es/no-symbol -- safe */
	var symbolRegistryDetection = NATIVE_SYMBOL$3 && !!Symbol['for'] && !!Symbol.keyFor;

	var $$C = _export;
	var getBuiltIn$7 = getBuiltIn$i;
	var hasOwn$a = hasOwnProperty_1;
	var toString$a = toString$k;
	var shared$1 = shared$7.exports;
	var NATIVE_SYMBOL_REGISTRY$1 = symbolRegistryDetection;

	var StringToSymbolRegistry = shared$1('string-to-symbol-registry');
	var SymbolToStringRegistry$1 = shared$1('symbol-to-string-registry');

	// `Symbol.for` method
	// https://tc39.es/ecma262/#sec-symbol.for
	$$C({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY$1 }, {
	  'for': function (key) {
	    var string = toString$a(key);
	    if (hasOwn$a(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
	    var symbol = getBuiltIn$7('Symbol')(string);
	    StringToSymbolRegistry[string] = symbol;
	    SymbolToStringRegistry$1[symbol] = string;
	    return symbol;
	  }
	});

	var $$B = _export;
	var hasOwn$9 = hasOwnProperty_1;
	var isSymbol$1 = isSymbol$6;
	var tryToString = tryToString$7;
	var shared = shared$7.exports;
	var NATIVE_SYMBOL_REGISTRY = symbolRegistryDetection;

	var SymbolToStringRegistry = shared('symbol-to-string-registry');

	// `Symbol.keyFor` method
	// https://tc39.es/ecma262/#sec-symbol.keyfor
	$$B({ target: 'Symbol', stat: true, forced: !NATIVE_SYMBOL_REGISTRY }, {
	  keyFor: function keyFor(sym) {
	    if (!isSymbol$1(sym)) throw TypeError(tryToString(sym) + ' is not a symbol');
	    if (hasOwn$9(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
	  }
	});

	var $$A = _export;
	var getBuiltIn$6 = getBuiltIn$i;
	var apply$3 = functionApply$1;
	var call$7 = functionCall;
	var uncurryThis$d = functionUncurryThis;
	var fails$j = fails$X;
	var isArray$1 = isArray$6;
	var isCallable$4 = isCallable$t;
	var isObject$9 = isObject$r;
	var isSymbol = isSymbol$6;
	var arraySlice$2 = arraySlice$a;
	var NATIVE_SYMBOL$2 = symbolConstructorDetection;

	var $stringify = getBuiltIn$6('JSON', 'stringify');
	var exec$2 = uncurryThis$d(/./.exec);
	var charAt$2 = uncurryThis$d(''.charAt);
	var charCodeAt = uncurryThis$d(''.charCodeAt);
	var replace$2 = uncurryThis$d(''.replace);
	var numberToString = uncurryThis$d(1.0.toString);

	var tester = /[\uD800-\uDFFF]/g;
	var low = /^[\uD800-\uDBFF]$/;
	var hi = /^[\uDC00-\uDFFF]$/;

	var WRONG_SYMBOLS_CONVERSION = !NATIVE_SYMBOL$2 || fails$j(function () {
	  var symbol = getBuiltIn$6('Symbol')();
	  // MS Edge converts symbol values to JSON as {}
	  return $stringify([symbol]) != '[null]'
	    // WebKit converts symbol values to JSON as null
	    || $stringify({ a: symbol }) != '{}'
	    // V8 throws on boxed symbols
	    || $stringify(Object(symbol)) != '{}';
	});

	// https://github.com/tc39/proposal-well-formed-stringify
	var ILL_FORMED_UNICODE = fails$j(function () {
	  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
	    || $stringify('\uDEAD') !== '"\\udead"';
	});

	var stringifyWithSymbolsFix = function (it, replacer) {
	  var args = arraySlice$2(arguments);
	  var $replacer = replacer;
	  if (!isObject$9(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
	  if (!isArray$1(replacer)) replacer = function (key, value) {
	    if (isCallable$4($replacer)) value = call$7($replacer, this, key, value);
	    if (!isSymbol(value)) return value;
	  };
	  args[1] = replacer;
	  return apply$3($stringify, null, args);
	};

	var fixIllFormed = function (match, offset, string) {
	  var prev = charAt$2(string, offset - 1);
	  var next = charAt$2(string, offset + 1);
	  if ((exec$2(low, match) && !exec$2(hi, next)) || (exec$2(hi, match) && !exec$2(low, prev))) {
	    return '\\u' + numberToString(charCodeAt(match, 0), 16);
	  } return match;
	};

	if ($stringify) {
	  // `JSON.stringify` method
	  // https://tc39.es/ecma262/#sec-json.stringify
	  $$A({ target: 'JSON', stat: true, arity: 3, forced: WRONG_SYMBOLS_CONVERSION || ILL_FORMED_UNICODE }, {
	    // eslint-disable-next-line no-unused-vars -- required for `.length`
	    stringify: function stringify(it, replacer, space) {
	      var args = arraySlice$2(arguments);
	      var result = apply$3(WRONG_SYMBOLS_CONVERSION ? stringifyWithSymbolsFix : $stringify, null, args);
	      return ILL_FORMED_UNICODE && typeof result == 'string' ? replace$2(result, tester, fixIllFormed) : result;
	    }
	  });
	}

	var $$z = _export;
	var NATIVE_SYMBOL$1 = symbolConstructorDetection;
	var fails$i = fails$X;
	var getOwnPropertySymbolsModule$1 = objectGetOwnPropertySymbols;
	var toObject$4 = toObject$j;

	// V8 ~ Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
	// https://bugs.chromium.org/p/v8/issues/detail?id=3443
	var FORCED$5 = !NATIVE_SYMBOL$1 || fails$i(function () { getOwnPropertySymbolsModule$1.f(1); });

	// `Object.getOwnPropertySymbols` method
	// https://tc39.es/ecma262/#sec-object.getownpropertysymbols
	$$z({ target: 'Object', stat: true, forced: FORCED$5 }, {
	  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
	    var $getOwnPropertySymbols = getOwnPropertySymbolsModule$1.f;
	    return $getOwnPropertySymbols ? $getOwnPropertySymbols(toObject$4(it)) : [];
	  }
	});

	var $$y = _export;
	var DESCRIPTORS$b = descriptors;
	var global$a = global$K;
	var uncurryThis$c = functionUncurryThis;
	var hasOwn$8 = hasOwnProperty_1;
	var isCallable$3 = isCallable$t;
	var isPrototypeOf$2 = objectIsPrototypeOf;
	var toString$9 = toString$k;
	var defineProperty$6 = objectDefineProperty.f;
	var copyConstructorProperties$1 = copyConstructorProperties$4;

	var NativeSymbol = global$a.Symbol;
	var SymbolPrototype = NativeSymbol && NativeSymbol.prototype;

	if (DESCRIPTORS$b && isCallable$3(NativeSymbol) && (!('description' in SymbolPrototype) ||
	  // Safari 12 bug
	  NativeSymbol().description !== undefined
	)) {
	  var EmptyStringDescriptionStore = {};
	  // wrap Symbol constructor for correct work with undefined description
	  var SymbolWrapper = function Symbol() {
	    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : toString$9(arguments[0]);
	    var result = isPrototypeOf$2(SymbolPrototype, this)
	      ? new NativeSymbol(description)
	      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
	      : description === undefined ? NativeSymbol() : NativeSymbol(description);
	    if (description === '') EmptyStringDescriptionStore[result] = true;
	    return result;
	  };

	  copyConstructorProperties$1(SymbolWrapper, NativeSymbol);
	  SymbolWrapper.prototype = SymbolPrototype;
	  SymbolPrototype.constructor = SymbolWrapper;

	  var NATIVE_SYMBOL = String(NativeSymbol('test')) == 'Symbol(test)';
	  var thisSymbolValue = uncurryThis$c(SymbolPrototype.valueOf);
	  var symbolDescriptiveString = uncurryThis$c(SymbolPrototype.toString);
	  var regexp = /^Symbol\((.*)\)[^)]+$/;
	  var replace$1 = uncurryThis$c(''.replace);
	  var stringSlice$3 = uncurryThis$c(''.slice);

	  defineProperty$6(SymbolPrototype, 'description', {
	    configurable: true,
	    get: function description() {
	      var symbol = thisSymbolValue(this);
	      if (hasOwn$8(EmptyStringDescriptionStore, symbol)) return '';
	      var string = symbolDescriptiveString(symbol);
	      var desc = NATIVE_SYMBOL ? stringSlice$3(string, 7, -1) : replace$1(string, regexp, '$1');
	      return desc === '' ? undefined : desc;
	    }
	  });

	  $$y({ global: true, constructor: true, forced: true }, {
	    Symbol: SymbolWrapper
	  });
	}

	var createTypedArrayConstructor = typedArrayConstructor.exports;

	// `Uint8ClampedArray` constructor
	// https://tc39.es/ecma262/#sec-typedarray-objects
	createTypedArrayConstructor('Uint8', function (init) {
	  return function Uint8ClampedArray(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	}, true);

	var defineWellKnownSymbol$4 = wellKnownSymbolDefine;

	// `Symbol.iterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.iterator
	defineWellKnownSymbol$4('iterator');

	var charAt$1 = stringMultibyte.charAt;
	var toString$8 = toString$k;
	var InternalStateModule$3 = internalState;
	var defineIterator$1 = iteratorDefine;
	var createIterResultObject$1 = createIterResultObject$3;

	var STRING_ITERATOR = 'String Iterator';
	var setInternalState$3 = InternalStateModule$3.set;
	var getInternalState$3 = InternalStateModule$3.getterFor(STRING_ITERATOR);

	// `String.prototype[@@iterator]` method
	// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
	defineIterator$1(String, 'String', function (iterated) {
	  setInternalState$3(this, {
	    type: STRING_ITERATOR,
	    string: toString$8(iterated),
	    index: 0
	  });
	// `%StringIteratorPrototype%.next` method
	// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
	}, function next() {
	  var state = getInternalState$3(this);
	  var string = state.string;
	  var index = state.index;
	  var point;
	  if (index >= string.length) return createIterResultObject$1(undefined, true);
	  point = charAt$1(string, index);
	  state.index += point.length;
	  return createIterResultObject$1(point, false);
	});

	var global$9 = global$K;
	var DOMIterables = domIterables;
	var DOMTokenListPrototype = domTokenListPrototype;
	var ArrayIteratorMethods = es_array_iterator;
	var createNonEnumerableProperty$2 = createNonEnumerableProperty$d;
	var wellKnownSymbol$4 = wellKnownSymbol$v;

	var ITERATOR = wellKnownSymbol$4('iterator');
	var TO_STRING_TAG$1 = wellKnownSymbol$4('toStringTag');
	var ArrayValues = ArrayIteratorMethods.values;

	var handlePrototype = function (CollectionPrototype, COLLECTION_NAME) {
	  if (CollectionPrototype) {
	    // some Chrome versions have non-configurable methods on DOMTokenList
	    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
	      createNonEnumerableProperty$2(CollectionPrototype, ITERATOR, ArrayValues);
	    } catch (error) {
	      CollectionPrototype[ITERATOR] = ArrayValues;
	    }
	    if (!CollectionPrototype[TO_STRING_TAG$1]) {
	      createNonEnumerableProperty$2(CollectionPrototype, TO_STRING_TAG$1, COLLECTION_NAME);
	    }
	    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
	      // some Chrome versions have non-configurable methods on DOMTokenList
	      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
	        createNonEnumerableProperty$2(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
	      } catch (error) {
	        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
	      }
	    }
	  }
	};

	for (var COLLECTION_NAME in DOMIterables) {
	  handlePrototype(global$9[COLLECTION_NAME] && global$9[COLLECTION_NAME].prototype, COLLECTION_NAME);
	}

	handlePrototype(DOMTokenListPrototype, 'DOMTokenList');

	var defineWellKnownSymbol$3 = wellKnownSymbolDefine;
	var defineSymbolToPrimitive = symbolDefineToPrimitive;

	// `Symbol.toPrimitive` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.toprimitive
	defineWellKnownSymbol$3('toPrimitive');

	// `Symbol.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
	defineSymbolToPrimitive();

	var anObject$b = anObject$r;
	var ordinaryToPrimitive = ordinaryToPrimitive$2;

	var $TypeError$2 = TypeError;

	// `Date.prototype[@@toPrimitive](hint)` method implementation
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	var dateToPrimitive$1 = function (hint) {
	  anObject$b(this);
	  if (hint === 'string' || hint === 'default') hint = 'string';
	  else if (hint !== 'number') throw $TypeError$2('Incorrect hint');
	  return ordinaryToPrimitive(this, hint);
	};

	var hasOwn$7 = hasOwnProperty_1;
	var defineBuiltIn$3 = defineBuiltIn$h;
	var dateToPrimitive = dateToPrimitive$1;
	var wellKnownSymbol$3 = wellKnownSymbol$v;

	var TO_PRIMITIVE = wellKnownSymbol$3('toPrimitive');
	var DatePrototype = Date.prototype;

	// `Date.prototype[@@toPrimitive]` method
	// https://tc39.es/ecma262/#sec-date.prototype-@@toprimitive
	if (!hasOwn$7(DatePrototype, TO_PRIMITIVE)) {
	  defineBuiltIn$3(DatePrototype, TO_PRIMITIVE, dateToPrimitive);
	}

	var uncurryThis$b = functionUncurryThis;
	var aCallable$3 = aCallable$e;
	var isObject$8 = isObject$r;
	var hasOwn$6 = hasOwnProperty_1;
	var arraySlice$1 = arraySlice$a;
	var NATIVE_BIND = functionBindNative;

	var $Function = Function;
	var concat$1 = uncurryThis$b([].concat);
	var join = uncurryThis$b([].join);
	var factories = {};

	var construct = function (C, argsLength, args) {
	  if (!hasOwn$6(factories, argsLength)) {
	    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
	    factories[argsLength] = $Function('C,a', 'return new C(' + join(list, ',') + ')');
	  } return factories[argsLength](C, args);
	};

	// `Function.prototype.bind` method implementation
	// https://tc39.es/ecma262/#sec-function.prototype.bind
	var functionBind = NATIVE_BIND ? $Function.bind : function bind(that /* , ...args */) {
	  var F = aCallable$3(this);
	  var Prototype = F.prototype;
	  var partArgs = arraySlice$1(arguments, 1);
	  var boundFunction = function bound(/* args... */) {
	    var args = concat$1(partArgs, arraySlice$1(arguments));
	    return this instanceof boundFunction ? construct(F, args.length, args) : F.apply(that, args);
	  };
	  if (isObject$8(Prototype)) boundFunction.prototype = Prototype;
	  return boundFunction;
	};

	var $$x = _export;
	var getBuiltIn$5 = getBuiltIn$i;
	var apply$2 = functionApply$1;
	var bind$3 = functionBind;
	var aConstructor = aConstructor$3;
	var anObject$a = anObject$r;
	var isObject$7 = isObject$r;
	var create$4 = objectCreate;
	var fails$h = fails$X;

	var nativeConstruct = getBuiltIn$5('Reflect', 'construct');
	var ObjectPrototype = Object.prototype;
	var push$4 = [].push;

	// `Reflect.construct` method
	// https://tc39.es/ecma262/#sec-reflect.construct
	// MS Edge supports only 2 arguments and argumentsList argument is optional
	// FF Nightly sets third argument as `new.target`, but does not create `this` from it
	var NEW_TARGET_BUG = fails$h(function () {
	  function F() { /* empty */ }
	  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
	});

	var ARGS_BUG = !fails$h(function () {
	  nativeConstruct(function () { /* empty */ });
	});

	var FORCED$4 = NEW_TARGET_BUG || ARGS_BUG;

	$$x({ target: 'Reflect', stat: true, forced: FORCED$4, sham: FORCED$4 }, {
	  construct: function construct(Target, args /* , newTarget */) {
	    aConstructor(Target);
	    anObject$a(args);
	    var newTarget = arguments.length < 3 ? Target : aConstructor(arguments[2]);
	    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
	    if (Target == newTarget) {
	      // w/o altered newTarget, optimization for 0-4 arguments
	      switch (args.length) {
	        case 0: return new Target();
	        case 1: return new Target(args[0]);
	        case 2: return new Target(args[0], args[1]);
	        case 3: return new Target(args[0], args[1], args[2]);
	        case 4: return new Target(args[0], args[1], args[2], args[3]);
	      }
	      // w/o altered newTarget, lot of arguments case
	      var $args = [null];
	      apply$2(push$4, $args, args);
	      return new (apply$2(bind$3, Target, $args))();
	    }
	    // with altered newTarget, not support built-in constructors
	    var proto = newTarget.prototype;
	    var instance = create$4(isObject$7(proto) ? proto : ObjectPrototype);
	    var result = apply$2(Target, instance, args);
	    return isObject$7(result) ? result : instance;
	  }
	});

	var $$w = _export;
	var DESCRIPTORS$a = descriptors;
	var ownKeys = ownKeys$2;
	var toIndexedObject$2 = toIndexedObject$e;
	var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
	var createProperty$1 = createProperty$6;

	// `Object.getOwnPropertyDescriptors` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
	$$w({ target: 'Object', stat: true, sham: !DESCRIPTORS$a }, {
	  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
	    var O = toIndexedObject$2(object);
	    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
	    var keys = ownKeys(O);
	    var result = {};
	    var index = 0;
	    var key, descriptor;
	    while (keys.length > index) {
	      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
	      if (descriptor !== undefined) createProperty$1(result, key, descriptor);
	    }
	    return result;
	  }
	});

	var defineWellKnownSymbol$2 = wellKnownSymbolDefine;

	// `Symbol.asyncIterator` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.asynciterator
	defineWellKnownSymbol$2('asyncIterator');

	var anObject$9 = anObject$r;
	var iteratorClose = iteratorClose$2;

	// call something on iterator step with safe closing on error
	var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
	  try {
	    return ENTRIES ? fn(anObject$9(value)[0], value[1]) : fn(value);
	  } catch (error) {
	    iteratorClose(iterator, 'throw', error);
	  }
	};

	var bind$2 = functionBindContext;
	var call$6 = functionCall;
	var toObject$3 = toObject$j;
	var callWithSafeIterationClosing = callWithSafeIterationClosing$1;
	var isArrayIteratorMethod = isArrayIteratorMethod$3;
	var isConstructor = isConstructor$4;
	var lengthOfArrayLike$3 = lengthOfArrayLike$n;
	var createProperty = createProperty$6;
	var getIterator = getIterator$3;
	var getIteratorMethod = getIteratorMethod$4;

	var $Array = Array;

	// `Array.from` method implementation
	// https://tc39.es/ecma262/#sec-array.from
	var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
	  var O = toObject$3(arrayLike);
	  var IS_CONSTRUCTOR = isConstructor(this);
	  var argumentsLength = arguments.length;
	  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
	  var mapping = mapfn !== undefined;
	  if (mapping) mapfn = bind$2(mapfn, argumentsLength > 2 ? arguments[2] : undefined);
	  var iteratorMethod = getIteratorMethod(O);
	  var index = 0;
	  var length, result, step, iterator, next, value;
	  // if the target is not iterable or it's an array with the default iterator - use a simple case
	  if (iteratorMethod && !(this === $Array && isArrayIteratorMethod(iteratorMethod))) {
	    iterator = getIterator(O, iteratorMethod);
	    next = iterator.next;
	    result = IS_CONSTRUCTOR ? new this() : [];
	    for (;!(step = call$6(next, iterator)).done; index++) {
	      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
	      createProperty(result, index, value);
	    }
	  } else {
	    length = lengthOfArrayLike$3(O);
	    result = IS_CONSTRUCTOR ? new this(length) : $Array(length);
	    for (;length > index; index++) {
	      value = mapping ? mapfn(O[index], index) : O[index];
	      createProperty(result, index, value);
	    }
	  }
	  result.length = index;
	  return result;
	};

	var $$v = _export;
	var from = arrayFrom;
	var checkCorrectnessOfIteration$1 = checkCorrectnessOfIteration$4;

	var INCORRECT_ITERATION = !checkCorrectnessOfIteration$1(function (iterable) {
	  // eslint-disable-next-line es/no-array-from -- required for testing
	  Array.from(iterable);
	});

	// `Array.from` method
	// https://tc39.es/ecma262/#sec-array.from
	$$v({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
	  from: from
	});

	var internalMetadata = {exports: {}};

	// FF26- bug: ArrayBuffers are non-extensible, but Object.isExtensible does not report it
	var fails$g = fails$X;

	var arrayBufferNonExtensible = fails$g(function () {
	  if (typeof ArrayBuffer == 'function') {
	    var buffer = new ArrayBuffer(8);
	    // eslint-disable-next-line es/no-object-isextensible, es/no-object-defineproperty -- safe
	    if (Object.isExtensible(buffer)) Object.defineProperty(buffer, 'a', { value: 8 });
	  }
	});

	var fails$f = fails$X;
	var isObject$6 = isObject$r;
	var classof$2 = classofRaw$2;
	var ARRAY_BUFFER_NON_EXTENSIBLE = arrayBufferNonExtensible;

	// eslint-disable-next-line es/no-object-isextensible -- safe
	var $isExtensible = Object.isExtensible;
	var FAILS_ON_PRIMITIVES$3 = fails$f(function () { $isExtensible(1); });

	// `Object.isExtensible` method
	// https://tc39.es/ecma262/#sec-object.isextensible
	var objectIsExtensible = (FAILS_ON_PRIMITIVES$3 || ARRAY_BUFFER_NON_EXTENSIBLE) ? function isExtensible(it) {
	  if (!isObject$6(it)) return false;
	  if (ARRAY_BUFFER_NON_EXTENSIBLE && classof$2(it) == 'ArrayBuffer') return false;
	  return $isExtensible ? $isExtensible(it) : true;
	} : $isExtensible;

	var fails$e = fails$X;

	var freezing = !fails$e(function () {
	  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
	  return Object.isExtensible(Object.preventExtensions({}));
	});

	var $$u = _export;
	var uncurryThis$a = functionUncurryThis;
	var hiddenKeys = hiddenKeys$6;
	var isObject$5 = isObject$r;
	var hasOwn$5 = hasOwnProperty_1;
	var defineProperty$5 = objectDefineProperty.f;
	var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
	var getOwnPropertyNamesExternalModule = objectGetOwnPropertyNamesExternal;
	var isExtensible$1 = objectIsExtensible;
	var uid = uid$5;
	var FREEZING$1 = freezing;

	var REQUIRED = false;
	var METADATA = uid('meta');
	var id$1 = 0;

	var setMetadata = function (it) {
	  defineProperty$5(it, METADATA, { value: {
	    objectID: 'O' + id$1++, // object ID
	    weakData: {}          // weak collections IDs
	  } });
	};

	var fastKey$1 = function (it, create) {
	  // return a primitive with prefix
	  if (!isObject$5(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if (!hasOwn$5(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return 'F';
	    // not necessary to add metadata
	    if (!create) return 'E';
	    // add missing metadata
	    setMetadata(it);
	  // return object ID
	  } return it[METADATA].objectID;
	};

	var getWeakData$1 = function (it, create) {
	  if (!hasOwn$5(it, METADATA)) {
	    // can't set metadata to uncaught frozen object
	    if (!isExtensible$1(it)) return true;
	    // not necessary to add metadata
	    if (!create) return false;
	    // add missing metadata
	    setMetadata(it);
	  // return the store of weak collections IDs
	  } return it[METADATA].weakData;
	};

	// add metadata on freeze-family methods calling
	var onFreeze$1 = function (it) {
	  if (FREEZING$1 && REQUIRED && isExtensible$1(it) && !hasOwn$5(it, METADATA)) setMetadata(it);
	  return it;
	};

	var enable = function () {
	  meta.enable = function () { /* empty */ };
	  REQUIRED = true;
	  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
	  var splice = uncurryThis$a([].splice);
	  var test = {};
	  test[METADATA] = 1;

	  // prevent exposing of metadata key
	  if (getOwnPropertyNames(test).length) {
	    getOwnPropertyNamesModule.f = function (it) {
	      var result = getOwnPropertyNames(it);
	      for (var i = 0, length = result.length; i < length; i++) {
	        if (result[i] === METADATA) {
	          splice(result, i, 1);
	          break;
	        }
	      } return result;
	    };

	    $$u({ target: 'Object', stat: true, forced: true }, {
	      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
	    });
	  }
	};

	var meta = internalMetadata.exports = {
	  enable: enable,
	  fastKey: fastKey$1,
	  getWeakData: getWeakData$1,
	  onFreeze: onFreeze$1
	};

	hiddenKeys[METADATA] = true;

	var $$t = _export;
	var global$8 = global$K;
	var uncurryThis$9 = functionUncurryThis;
	var isForced$1 = isForced_1;
	var defineBuiltIn$2 = defineBuiltIn$h;
	var InternalMetadataModule$1 = internalMetadata.exports;
	var iterate$3 = iterate$6;
	var anInstance$4 = anInstance$8;
	var isCallable$2 = isCallable$t;
	var isNullOrUndefined$5 = isNullOrUndefined$b;
	var isObject$4 = isObject$r;
	var fails$d = fails$X;
	var checkCorrectnessOfIteration = checkCorrectnessOfIteration$4;
	var setToStringTag$5 = setToStringTag$b;
	var inheritIfRequired$2 = inheritIfRequired$6;

	var collection$4 = function (CONSTRUCTOR_NAME, wrapper, common) {
	  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
	  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
	  var ADDER = IS_MAP ? 'set' : 'add';
	  var NativeConstructor = global$8[CONSTRUCTOR_NAME];
	  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
	  var Constructor = NativeConstructor;
	  var exported = {};

	  var fixMethod = function (KEY) {
	    var uncurriedNativeMethod = uncurryThis$9(NativePrototype[KEY]);
	    defineBuiltIn$2(NativePrototype, KEY,
	      KEY == 'add' ? function add(value) {
	        uncurriedNativeMethod(this, value === 0 ? 0 : value);
	        return this;
	      } : KEY == 'delete' ? function (key) {
	        return IS_WEAK && !isObject$4(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'get' ? function get(key) {
	        return IS_WEAK && !isObject$4(key) ? undefined : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : KEY == 'has' ? function has(key) {
	        return IS_WEAK && !isObject$4(key) ? false : uncurriedNativeMethod(this, key === 0 ? 0 : key);
	      } : function set(key, value) {
	        uncurriedNativeMethod(this, key === 0 ? 0 : key, value);
	        return this;
	      }
	    );
	  };

	  var REPLACE = isForced$1(
	    CONSTRUCTOR_NAME,
	    !isCallable$2(NativeConstructor) || !(IS_WEAK || NativePrototype.forEach && !fails$d(function () {
	      new NativeConstructor().entries().next();
	    }))
	  );

	  if (REPLACE) {
	    // create collection constructor
	    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
	    InternalMetadataModule$1.enable();
	  } else if (isForced$1(CONSTRUCTOR_NAME, true)) {
	    var instance = new Constructor();
	    // early implementations not supports chaining
	    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
	    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
	    var THROWS_ON_PRIMITIVES = fails$d(function () { instance.has(1); });
	    // most early implementations doesn't supports iterables, most modern - not close it correctly
	    // eslint-disable-next-line no-new -- required for testing
	    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
	    // for early implementations -0 and +0 not the same
	    var BUGGY_ZERO = !IS_WEAK && fails$d(function () {
	      // V8 ~ Chromium 42- fails only with 5+ elements
	      var $instance = new NativeConstructor();
	      var index = 5;
	      while (index--) $instance[ADDER](index, index);
	      return !$instance.has(-0);
	    });

	    if (!ACCEPT_ITERABLES) {
	      Constructor = wrapper(function (dummy, iterable) {
	        anInstance$4(dummy, NativePrototype);
	        var that = inheritIfRequired$2(new NativeConstructor(), dummy, Constructor);
	        if (!isNullOrUndefined$5(iterable)) iterate$3(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	        return that;
	      });
	      Constructor.prototype = NativePrototype;
	      NativePrototype.constructor = Constructor;
	    }

	    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
	      fixMethod('delete');
	      fixMethod('has');
	      IS_MAP && fixMethod('get');
	    }

	    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

	    // weak collections should not contains .clear method
	    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
	  }

	  exported[CONSTRUCTOR_NAME] = Constructor;
	  $$t({ global: true, constructor: true, forced: Constructor != NativeConstructor }, exported);

	  setToStringTag$5(Constructor, CONSTRUCTOR_NAME);

	  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

	  return Constructor;
	};

	var defineProperty$4 = objectDefineProperty.f;
	var create$3 = objectCreate;
	var defineBuiltIns$2 = defineBuiltIns$4;
	var bind$1 = functionBindContext;
	var anInstance$3 = anInstance$8;
	var isNullOrUndefined$4 = isNullOrUndefined$b;
	var iterate$2 = iterate$6;
	var defineIterator = iteratorDefine;
	var createIterResultObject = createIterResultObject$3;
	var setSpecies$1 = setSpecies$5;
	var DESCRIPTORS$9 = descriptors;
	var fastKey = internalMetadata.exports.fastKey;
	var InternalStateModule$2 = internalState;

	var setInternalState$2 = InternalStateModule$2.set;
	var internalStateGetterFor$1 = InternalStateModule$2.getterFor;

	var collectionStrong$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance$3(that, Prototype);
	      setInternalState$2(that, {
	        type: CONSTRUCTOR_NAME,
	        index: create$3(null),
	        first: undefined,
	        last: undefined,
	        size: 0
	      });
	      if (!DESCRIPTORS$9) that.size = 0;
	      if (!isNullOrUndefined$4(iterable)) iterate$2(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var entry = getEntry(that, key);
	      var previous, index;
	      // change existing entry
	      if (entry) {
	        entry.value = value;
	      // create new entry
	      } else {
	        state.last = entry = {
	          index: index = fastKey(key, true),
	          key: key,
	          value: value,
	          previous: previous = state.last,
	          next: undefined,
	          removed: false
	        };
	        if (!state.first) state.first = entry;
	        if (previous) previous.next = entry;
	        if (DESCRIPTORS$9) state.size++;
	        else that.size++;
	        // add to index
	        if (index !== 'F') state.index[index] = entry;
	      } return that;
	    };

	    var getEntry = function (that, key) {
	      var state = getInternalState(that);
	      // fast case
	      var index = fastKey(key);
	      var entry;
	      if (index !== 'F') return state.index[index];
	      // frozen object case
	      for (entry = state.first; entry; entry = entry.next) {
	        if (entry.key == key) return entry;
	      }
	    };

	    defineBuiltIns$2(Prototype, {
	      // `{ Map, Set }.prototype.clear()` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.clear
	      // https://tc39.es/ecma262/#sec-set.prototype.clear
	      clear: function clear() {
	        var that = this;
	        var state = getInternalState(that);
	        var data = state.index;
	        var entry = state.first;
	        while (entry) {
	          entry.removed = true;
	          if (entry.previous) entry.previous = entry.previous.next = undefined;
	          delete data[entry.index];
	          entry = entry.next;
	        }
	        state.first = state.last = undefined;
	        if (DESCRIPTORS$9) state.size = 0;
	        else that.size = 0;
	      },
	      // `{ Map, Set }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.delete
	      // https://tc39.es/ecma262/#sec-set.prototype.delete
	      'delete': function (key) {
	        var that = this;
	        var state = getInternalState(that);
	        var entry = getEntry(that, key);
	        if (entry) {
	          var next = entry.next;
	          var prev = entry.previous;
	          delete state.index[entry.index];
	          entry.removed = true;
	          if (prev) prev.next = next;
	          if (next) next.previous = prev;
	          if (state.first == entry) state.first = next;
	          if (state.last == entry) state.last = prev;
	          if (DESCRIPTORS$9) state.size--;
	          else that.size--;
	        } return !!entry;
	      },
	      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.foreach
	      // https://tc39.es/ecma262/#sec-set.prototype.foreach
	      forEach: function forEach(callbackfn /* , that = undefined */) {
	        var state = getInternalState(this);
	        var boundFunction = bind$1(callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	        var entry;
	        while (entry = entry ? entry.next : state.first) {
	          boundFunction(entry.value, entry.key, this);
	          // revert to the last existing entry
	          while (entry && entry.removed) entry = entry.previous;
	        }
	      },
	      // `{ Map, Set}.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-map.prototype.has
	      // https://tc39.es/ecma262/#sec-set.prototype.has
	      has: function has(key) {
	        return !!getEntry(this, key);
	      }
	    });

	    defineBuiltIns$2(Prototype, IS_MAP ? {
	      // `Map.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.get
	      get: function get(key) {
	        var entry = getEntry(this, key);
	        return entry && entry.value;
	      },
	      // `Map.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-map.prototype.set
	      set: function set(key, value) {
	        return define(this, key === 0 ? 0 : key, value);
	      }
	    } : {
	      // `Set.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-set.prototype.add
	      add: function add(value) {
	        return define(this, value = value === 0 ? 0 : value, value);
	      }
	    });
	    if (DESCRIPTORS$9) defineProperty$4(Prototype, 'size', {
	      get: function () {
	        return getInternalState(this).size;
	      }
	    });
	    return Constructor;
	  },
	  setStrong: function (Constructor, CONSTRUCTOR_NAME, IS_MAP) {
	    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
	    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
	    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
	    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
	    // https://tc39.es/ecma262/#sec-map.prototype.entries
	    // https://tc39.es/ecma262/#sec-map.prototype.keys
	    // https://tc39.es/ecma262/#sec-map.prototype.values
	    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
	    // https://tc39.es/ecma262/#sec-set.prototype.entries
	    // https://tc39.es/ecma262/#sec-set.prototype.keys
	    // https://tc39.es/ecma262/#sec-set.prototype.values
	    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
	    defineIterator(Constructor, CONSTRUCTOR_NAME, function (iterated, kind) {
	      setInternalState$2(this, {
	        type: ITERATOR_NAME,
	        target: iterated,
	        state: getInternalCollectionState(iterated),
	        kind: kind,
	        last: undefined
	      });
	    }, function () {
	      var state = getInternalIteratorState(this);
	      var kind = state.kind;
	      var entry = state.last;
	      // revert to the last existing entry
	      while (entry && entry.removed) entry = entry.previous;
	      // get next entry
	      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
	        // or finish the iteration
	        state.target = undefined;
	        return createIterResultObject(undefined, true);
	      }
	      // return step by kind
	      if (kind == 'keys') return createIterResultObject(entry.key, false);
	      if (kind == 'values') return createIterResultObject(entry.value, false);
	      return createIterResultObject([entry.key, entry.value], false);
	    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

	    // `{ Map, Set }.prototype[@@species]` accessors
	    // https://tc39.es/ecma262/#sec-get-map-@@species
	    // https://tc39.es/ecma262/#sec-get-set-@@species
	    setSpecies$1(CONSTRUCTOR_NAME);
	  }
	};

	var collection$3 = collection$4;
	var collectionStrong$1 = collectionStrong$2;

	// `Set` constructor
	// https://tc39.es/ecma262/#sec-set-objects
	collection$3('Set', function (init) {
	  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong$1);

	var $$s = _export;
	var global$7 = global$K;

	// `globalThis` object
	// https://tc39.es/ecma262/#sec-globalthis
	$$s({ global: true, forced: global$7.globalThis !== global$7 }, {
	  globalThis: global$7
	});

	var collection$2 = collection$4;
	var collectionStrong = collectionStrong$2;

	// `Map` constructor
	// https://tc39.es/ecma262/#sec-map-objects
	collection$2('Map', function (init) {
	  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionStrong);

	var $$r = _export;
	var $filter = arrayIteration.filter;
	var arrayMethodHasSpeciesSupport = arrayMethodHasSpeciesSupport$5;

	var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

	// `Array.prototype.filter` method
	// https://tc39.es/ecma262/#sec-array.prototype.filter
	// with adding support of @@species
	$$r({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
	  filter: function filter(callbackfn /* , thisArg */) {
	    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var $$q = _export;
	var createHTML = createHtml;
	var forcedStringHTMLMethod = stringHtmlForced;

	// `String.prototype.anchor` method
	// https://tc39.es/ecma262/#sec-string.prototype.anchor
	$$q({ target: 'String', proto: true, forced: forcedStringHTMLMethod('anchor') }, {
	  anchor: function anchor(name) {
	    return createHTML(this, 'a', 'name', name);
	  }
	});

	var $$p = _export;
	var fails$c = fails$X;
	var toIndexedObject$1 = toIndexedObject$e;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var DESCRIPTORS$8 = descriptors;

	var FAILS_ON_PRIMITIVES$2 = fails$c(function () { nativeGetOwnPropertyDescriptor(1); });
	var FORCED$3 = !DESCRIPTORS$8 || FAILS_ON_PRIMITIVES$2;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
	$$p({ target: 'Object', stat: true, forced: FORCED$3, sham: !DESCRIPTORS$8 }, {
	  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
	    return nativeGetOwnPropertyDescriptor(toIndexedObject$1(it), key);
	  }
	});

	// TODO: Remove from `core-js@4` since it's moved to entry points

	var $$o = _export;
	var call$5 = functionCall;
	var isCallable$1 = isCallable$t;
	var anObject$8 = anObject$r;
	var toString$7 = toString$k;

	var DELEGATES_TO_EXEC = function () {
	  var execCalled = false;
	  var re = /[ac]/;
	  re.exec = function () {
	    execCalled = true;
	    return /./.exec.apply(this, arguments);
	  };
	  return re.test('abc') === true && execCalled;
	}();

	var nativeTest = /./.test;

	// `RegExp.prototype.test` method
	// https://tc39.es/ecma262/#sec-regexp.prototype.test
	$$o({ target: 'RegExp', proto: true, forced: !DELEGATES_TO_EXEC }, {
	  test: function (S) {
	    var R = anObject$8(this);
	    var string = toString$7(S);
	    var exec = R.exec;
	    if (!isCallable$1(exec)) return call$5(nativeTest, R, string);
	    var result = call$5(exec, R, string);
	    if (result === null) return false;
	    anObject$8(result);
	    return true;
	  }
	});

	var toIntegerOrInfinity$1 = toIntegerOrInfinity$e;
	var toString$6 = toString$k;
	var requireObjectCoercible$4 = requireObjectCoercible$d;

	var $RangeError$1 = RangeError;

	// `String.prototype.repeat` method implementation
	// https://tc39.es/ecma262/#sec-string.prototype.repeat
	var stringRepeat = function repeat(count) {
	  var str = toString$6(requireObjectCoercible$4(this));
	  var result = '';
	  var n = toIntegerOrInfinity$1(count);
	  if (n < 0 || n == Infinity) throw $RangeError$1('Wrong number of repetitions');
	  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
	  return result;
	};

	var $$n = _export;
	var uncurryThis$8 = functionUncurryThis;
	var toIntegerOrInfinity = toIntegerOrInfinity$e;
	var thisNumberValue = thisNumberValue$2;
	var $repeat = stringRepeat;
	var fails$b = fails$X;

	var $RangeError = RangeError;
	var $String = String;
	var floor = Math.floor;
	var repeat = uncurryThis$8($repeat);
	var stringSlice$2 = uncurryThis$8(''.slice);
	var nativeToFixed = uncurryThis$8(1.0.toFixed);

	var pow = function (x, n, acc) {
	  return n === 0 ? acc : n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc);
	};

	var log$2 = function (x) {
	  var n = 0;
	  var x2 = x;
	  while (x2 >= 4096) {
	    n += 12;
	    x2 /= 4096;
	  }
	  while (x2 >= 2) {
	    n += 1;
	    x2 /= 2;
	  } return n;
	};

	var multiply = function (data, n, c) {
	  var index = -1;
	  var c2 = c;
	  while (++index < 6) {
	    c2 += n * data[index];
	    data[index] = c2 % 1e7;
	    c2 = floor(c2 / 1e7);
	  }
	};

	var divide = function (data, n) {
	  var index = 6;
	  var c = 0;
	  while (--index >= 0) {
	    c += data[index];
	    data[index] = floor(c / n);
	    c = (c % n) * 1e7;
	  }
	};

	var dataToString = function (data) {
	  var index = 6;
	  var s = '';
	  while (--index >= 0) {
	    if (s !== '' || index === 0 || data[index] !== 0) {
	      var t = $String(data[index]);
	      s = s === '' ? t : s + repeat('0', 7 - t.length) + t;
	    }
	  } return s;
	};

	var FORCED$2 = fails$b(function () {
	  return nativeToFixed(0.00008, 3) !== '0.000' ||
	    nativeToFixed(0.9, 0) !== '1' ||
	    nativeToFixed(1.255, 2) !== '1.25' ||
	    nativeToFixed(1000000000000000128.0, 0) !== '1000000000000000128';
	}) || !fails$b(function () {
	  // V8 ~ Android 4.3-
	  nativeToFixed({});
	});

	// `Number.prototype.toFixed` method
	// https://tc39.es/ecma262/#sec-number.prototype.tofixed
	$$n({ target: 'Number', proto: true, forced: FORCED$2 }, {
	  toFixed: function toFixed(fractionDigits) {
	    var number = thisNumberValue(this);
	    var fractDigits = toIntegerOrInfinity(fractionDigits);
	    var data = [0, 0, 0, 0, 0, 0];
	    var sign = '';
	    var result = '0';
	    var e, z, j, k;

	    // TODO: ES2018 increased the maximum number of fraction digits to 100, need to improve the implementation
	    if (fractDigits < 0 || fractDigits > 20) throw $RangeError('Incorrect fraction digits');
	    // eslint-disable-next-line no-self-compare -- NaN check
	    if (number != number) return 'NaN';
	    if (number <= -1e21 || number >= 1e21) return $String(number);
	    if (number < 0) {
	      sign = '-';
	      number = -number;
	    }
	    if (number > 1e-21) {
	      e = log$2(number * pow(2, 69, 1)) - 69;
	      z = e < 0 ? number * pow(2, -e, 1) : number / pow(2, e, 1);
	      z *= 0x10000000000000;
	      e = 52 - e;
	      if (e > 0) {
	        multiply(data, 0, z);
	        j = fractDigits;
	        while (j >= 7) {
	          multiply(data, 1e7, 0);
	          j -= 7;
	        }
	        multiply(data, pow(10, j, 1), 0);
	        j = e - 1;
	        while (j >= 23) {
	          divide(data, 1 << 23);
	          j -= 23;
	        }
	        divide(data, 1 << j);
	        multiply(data, 1, 1);
	        divide(data, 2);
	        result = dataToString(data);
	      } else {
	        multiply(data, 0, z);
	        multiply(data, 1 << -e, 0);
	        result = dataToString(data) + repeat('0', fractDigits);
	      }
	    }
	    if (fractDigits > 0) {
	      k = result.length;
	      result = sign + (k <= fractDigits
	        ? '0.' + repeat('0', fractDigits - k) + result
	        : stringSlice$2(result, 0, k - fractDigits) + '.' + stringSlice$2(result, k - fractDigits));
	    } else {
	      result = sign + result;
	    } return result;
	  }
	});

	var $$m = _export;
	var uncurryThis$7 = functionUncurryThisClause;
	var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var toLength$2 = toLength$a;
	var toString$5 = toString$k;
	var notARegExp = notARegexp;
	var requireObjectCoercible$3 = requireObjectCoercible$d;
	var correctIsRegExpLogic = correctIsRegexpLogic;

	// eslint-disable-next-line es/no-string-prototype-endswith -- safe
	var nativeEndsWith = uncurryThis$7(''.endsWith);
	var slice = uncurryThis$7(''.slice);
	var min$1 = Math.min;

	var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('endsWith');
	// https://github.com/zloirock/core-js/pull/702
	var MDN_POLYFILL_BUG = !CORRECT_IS_REGEXP_LOGIC && !!function () {
	  var descriptor = getOwnPropertyDescriptor(String.prototype, 'endsWith');
	  return descriptor && !descriptor.writable;
	}();

	// `String.prototype.endsWith` method
	// https://tc39.es/ecma262/#sec-string.prototype.endswith
	$$m({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
	  endsWith: function endsWith(searchString /* , endPosition = @length */) {
	    var that = toString$5(requireObjectCoercible$3(this));
	    notARegExp(searchString);
	    var endPosition = arguments.length > 1 ? arguments[1] : undefined;
	    var len = that.length;
	    var end = endPosition === undefined ? len : min$1(toLength$2(endPosition), len);
	    var search = toString$5(searchString);
	    return nativeEndsWith
	      ? nativeEndsWith(that, search, end)
	      : slice(that, end - search.length, end) === search;
	  }
	});

	var isArray = isArray$6;
	var lengthOfArrayLike$2 = lengthOfArrayLike$n;
	var doesNotExceedSafeInteger = doesNotExceedSafeInteger$4;
	var bind = functionBindContext;

	// `FlattenIntoArray` abstract operation
	// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
	var flattenIntoArray$1 = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
	  var targetIndex = start;
	  var sourceIndex = 0;
	  var mapFn = mapper ? bind(mapper, thisArg) : false;
	  var element, elementLen;

	  while (sourceIndex < sourceLen) {
	    if (sourceIndex in source) {
	      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

	      if (depth > 0 && isArray(element)) {
	        elementLen = lengthOfArrayLike$2(element);
	        targetIndex = flattenIntoArray$1(target, original, element, elementLen, targetIndex, depth - 1) - 1;
	      } else {
	        doesNotExceedSafeInteger(targetIndex + 1);
	        target[targetIndex] = element;
	      }

	      targetIndex++;
	    }
	    sourceIndex++;
	  }
	  return targetIndex;
	};

	var flattenIntoArray_1 = flattenIntoArray$1;

	var $$l = _export;
	var flattenIntoArray = flattenIntoArray_1;
	var aCallable$2 = aCallable$e;
	var toObject$2 = toObject$j;
	var lengthOfArrayLike$1 = lengthOfArrayLike$n;
	var arraySpeciesCreate = arraySpeciesCreate$4;

	// `Array.prototype.flatMap` method
	// https://tc39.es/ecma262/#sec-array.prototype.flatmap
	$$l({ target: 'Array', proto: true }, {
	  flatMap: function flatMap(callbackfn /* , thisArg */) {
	    var O = toObject$2(this);
	    var sourceLen = lengthOfArrayLike$1(O);
	    var A;
	    aCallable$2(callbackfn);
	    A = arraySpeciesCreate(O, 0);
	    A.length = flattenIntoArray(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	    return A;
	  }
	});

	// this method was added to unscopables after implementation
	// in popular engines, so it's moved to a separate module
	var addToUnscopables$2 = addToUnscopables$7;

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$2('flatMap');

	var $$k = _export;
	var FREEZING = freezing;
	var fails$a = fails$X;
	var isObject$3 = isObject$r;
	var onFreeze = internalMetadata.exports.onFreeze;

	// eslint-disable-next-line es/no-object-freeze -- safe
	var $freeze = Object.freeze;
	var FAILS_ON_PRIMITIVES$1 = fails$a(function () { $freeze(1); });

	// `Object.freeze` method
	// https://tc39.es/ecma262/#sec-object.freeze
	$$k({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$1, sham: !FREEZING }, {
	  freeze: function freeze(it) {
	    return $freeze && isObject$3(it) ? $freeze(onFreeze(it)) : it;
	  }
	});

	var getBuiltIn$4 = getBuiltIn$i;
	var defineWellKnownSymbol$1 = wellKnownSymbolDefine;
	var setToStringTag$4 = setToStringTag$b;

	// `Symbol.toStringTag` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.tostringtag
	defineWellKnownSymbol$1('toStringTag');

	// `Symbol.prototype[@@toStringTag]` property
	// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
	setToStringTag$4(getBuiltIn$4('Symbol'), 'Symbol');

	var global$6 = global$K;
	var setToStringTag$3 = setToStringTag$b;

	// JSON[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-json-@@tostringtag
	setToStringTag$3(global$6.JSON, 'JSON', true);

	var setToStringTag$2 = setToStringTag$b;

	// Math[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-math-@@tostringtag
	setToStringTag$2(Math, 'Math', true);

	var ArrayBufferViewCore = arrayBufferViewCore;
	var TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS = typedArrayConstructorsRequireWrappers;

	var aTypedArrayConstructor = ArrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayStaticMethod = ArrayBufferViewCore.exportTypedArrayStaticMethod;

	// `%TypedArray%.of` method
	// https://tc39.es/ecma262/#sec-%typedarray%.of
	exportTypedArrayStaticMethod('of', function of(/* ...items */) {
	  var index = 0;
	  var length = arguments.length;
	  var result = new (aTypedArrayConstructor(this))(length);
	  while (length > index) result[index] = arguments[index++];
	  return result;
	}, TYPED_ARRAYS_CONSTRUCTORS_REQUIRES_WRAPPERS);

	var $$j = _export;
	var $findIndex = arrayIteration.findIndex;
	var addToUnscopables$1 = addToUnscopables$7;

	var FIND_INDEX = 'findIndex';
	var SKIPS_HOLES$1 = true;

	// Shouldn't skip holes
	if (FIND_INDEX in []) Array(1)[FIND_INDEX](function () { SKIPS_HOLES$1 = false; });

	// `Array.prototype.findIndex` method
	// https://tc39.es/ecma262/#sec-array.prototype.findindex
	$$j({ target: 'Array', proto: true, forced: SKIPS_HOLES$1 }, {
	  findIndex: function findIndex(callbackfn /* , that = undefined */) {
	    return $findIndex(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables$1(FIND_INDEX);

	var uncurryThis$6 = functionUncurryThis;
	var defineBuiltIns$1 = defineBuiltIns$4;
	var getWeakData = internalMetadata.exports.getWeakData;
	var anInstance$2 = anInstance$8;
	var anObject$7 = anObject$r;
	var isNullOrUndefined$3 = isNullOrUndefined$b;
	var isObject$2 = isObject$r;
	var iterate$1 = iterate$6;
	var ArrayIterationModule = arrayIteration;
	var hasOwn$4 = hasOwnProperty_1;
	var InternalStateModule$1 = internalState;

	var setInternalState$1 = InternalStateModule$1.set;
	var internalStateGetterFor = InternalStateModule$1.getterFor;
	var find = ArrayIterationModule.find;
	var findIndex = ArrayIterationModule.findIndex;
	var splice = uncurryThis$6([].splice);
	var id = 0;

	// fallback for uncaught frozen keys
	var uncaughtFrozenStore = function (store) {
	  return store.frozen || (store.frozen = new UncaughtFrozenStore());
	};

	var UncaughtFrozenStore = function () {
	  this.entries = [];
	};

	var findUncaughtFrozen = function (store, key) {
	  return find(store.entries, function (it) {
	    return it[0] === key;
	  });
	};

	UncaughtFrozenStore.prototype = {
	  get: function (key) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) return entry[1];
	  },
	  has: function (key) {
	    return !!findUncaughtFrozen(this, key);
	  },
	  set: function (key, value) {
	    var entry = findUncaughtFrozen(this, key);
	    if (entry) entry[1] = value;
	    else this.entries.push([key, value]);
	  },
	  'delete': function (key) {
	    var index = findIndex(this.entries, function (it) {
	      return it[0] === key;
	    });
	    if (~index) splice(this.entries, index, 1);
	    return !!~index;
	  }
	};

	var collectionWeak$2 = {
	  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
	    var Constructor = wrapper(function (that, iterable) {
	      anInstance$2(that, Prototype);
	      setInternalState$1(that, {
	        type: CONSTRUCTOR_NAME,
	        id: id++,
	        frozen: undefined
	      });
	      if (!isNullOrUndefined$3(iterable)) iterate$1(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
	    });

	    var Prototype = Constructor.prototype;

	    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

	    var define = function (that, key, value) {
	      var state = getInternalState(that);
	      var data = getWeakData(anObject$7(key), true);
	      if (data === true) uncaughtFrozenStore(state).set(key, value);
	      else data[state.id] = value;
	      return that;
	    };

	    defineBuiltIns$1(Prototype, {
	      // `{ WeakMap, WeakSet }.prototype.delete(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.delete
	      // https://tc39.es/ecma262/#sec-weakset.prototype.delete
	      'delete': function (key) {
	        var state = getInternalState(this);
	        if (!isObject$2(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state)['delete'](key);
	        return data && hasOwn$4(data, state.id) && delete data[state.id];
	      },
	      // `{ WeakMap, WeakSet }.prototype.has(key)` methods
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.has
	      // https://tc39.es/ecma262/#sec-weakset.prototype.has
	      has: function has(key) {
	        var state = getInternalState(this);
	        if (!isObject$2(key)) return false;
	        var data = getWeakData(key);
	        if (data === true) return uncaughtFrozenStore(state).has(key);
	        return data && hasOwn$4(data, state.id);
	      }
	    });

	    defineBuiltIns$1(Prototype, IS_MAP ? {
	      // `WeakMap.prototype.get(key)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.get
	      get: function get(key) {
	        var state = getInternalState(this);
	        if (isObject$2(key)) {
	          var data = getWeakData(key);
	          if (data === true) return uncaughtFrozenStore(state).get(key);
	          return data ? data[state.id] : undefined;
	        }
	      },
	      // `WeakMap.prototype.set(key, value)` method
	      // https://tc39.es/ecma262/#sec-weakmap.prototype.set
	      set: function set(key, value) {
	        return define(this, key, value);
	      }
	    } : {
	      // `WeakSet.prototype.add(value)` method
	      // https://tc39.es/ecma262/#sec-weakset.prototype.add
	      add: function add(value) {
	        return define(this, value, true);
	      }
	    });

	    return Constructor;
	  }
	};

	var global$5 = global$K;
	var uncurryThis$5 = functionUncurryThis;
	var defineBuiltIns = defineBuiltIns$4;
	var InternalMetadataModule = internalMetadata.exports;
	var collection$1 = collection$4;
	var collectionWeak$1 = collectionWeak$2;
	var isObject$1 = isObject$r;
	var isExtensible = objectIsExtensible;
	var enforceInternalState$1 = internalState.enforce;
	var NATIVE_WEAK_MAP = weakMapBasicDetection;

	var IS_IE11 = !global$5.ActiveXObject && 'ActiveXObject' in global$5;
	var InternalWeakMap;

	var wrapper = function (init) {
	  return function WeakMap() {
	    return init(this, arguments.length ? arguments[0] : undefined);
	  };
	};

	// `WeakMap` constructor
	// https://tc39.es/ecma262/#sec-weakmap-constructor
	var $WeakMap = collection$1('WeakMap', wrapper, collectionWeak$1);

	// IE11 WeakMap frozen keys fix
	// We can't use feature detection because it crash some old IE builds
	// https://github.com/zloirock/core-js/issues/485
	if (NATIVE_WEAK_MAP && IS_IE11) {
	  InternalWeakMap = collectionWeak$1.getConstructor(wrapper, 'WeakMap', true);
	  InternalMetadataModule.enable();
	  var WeakMapPrototype = $WeakMap.prototype;
	  var nativeDelete = uncurryThis$5(WeakMapPrototype['delete']);
	  var nativeHas = uncurryThis$5(WeakMapPrototype.has);
	  var nativeGet = uncurryThis$5(WeakMapPrototype.get);
	  var nativeSet = uncurryThis$5(WeakMapPrototype.set);
	  defineBuiltIns(WeakMapPrototype, {
	    'delete': function (key) {
	      if (isObject$1(key) && !isExtensible(key)) {
	        var state = enforceInternalState$1(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeDelete(this, key) || state.frozen['delete'](key);
	      } return nativeDelete(this, key);
	    },
	    has: function has(key) {
	      if (isObject$1(key) && !isExtensible(key)) {
	        var state = enforceInternalState$1(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas(this, key) || state.frozen.has(key);
	      } return nativeHas(this, key);
	    },
	    get: function get(key) {
	      if (isObject$1(key) && !isExtensible(key)) {
	        var state = enforceInternalState$1(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        return nativeHas(this, key) ? nativeGet(this, key) : state.frozen.get(key);
	      } return nativeGet(this, key);
	    },
	    set: function set(key, value) {
	      if (isObject$1(key) && !isExtensible(key)) {
	        var state = enforceInternalState$1(this);
	        if (!state.frozen) state.frozen = new InternalWeakMap();
	        nativeHas(this, key) ? nativeSet(this, key, value) : state.frozen.set(key, value);
	      } else nativeSet(this, key, value);
	      return this;
	    }
	  });
	}

	var collection = collection$4;
	var collectionWeak = collectionWeak$2;

	// `WeakSet` constructor
	// https://tc39.es/ecma262/#sec-weakset-constructor
	collection('WeakSet', function (init) {
	  return function WeakSet() { return init(this, arguments.length ? arguments[0] : undefined); };
	}, collectionWeak);

	var IS_NODE = engineIsNode;

	var tryNodeRequire$1 = function (name) {
	  try {
	    // eslint-disable-next-line no-new-func -- safe
	    if (IS_NODE) return Function('return require("' + name + '")')();
	  } catch (error) { /* empty */ }
	};

	var makeBuiltIn$1 = makeBuiltIn$4.exports;
	var defineProperty$3 = objectDefineProperty;

	var defineBuiltInAccessor$3 = function (target, name, descriptor) {
	  if (descriptor.get) makeBuiltIn$1(descriptor.get, name, { getter: true });
	  if (descriptor.set) makeBuiltIn$1(descriptor.set, name, { setter: true });
	  return defineProperty$3.f(target, name, descriptor);
	};

	var DESCRIPTORS$7 = descriptors;
	var fails$9 = fails$X;
	var anObject$6 = anObject$r;
	var create$2 = objectCreate;
	var normalizeStringArgument$3 = normalizeStringArgument$5;

	var nativeErrorToString = Error.prototype.toString;

	var INCORRECT_TO_STRING$1 = fails$9(function () {
	  if (DESCRIPTORS$7) {
	    // Chrome 32- incorrectly call accessor
	    // eslint-disable-next-line es/no-object-defineproperty -- safe
	    var object = create$2(Object.defineProperty({}, 'name', { get: function () {
	      return this === object;
	    } }));
	    if (nativeErrorToString.call(object) !== 'true') return true;
	  }
	  // FF10- does not properly handle non-strings
	  return nativeErrorToString.call({ message: 1, name: 2 }) !== '2: 1'
	    // IE8 does not properly handle defaults
	    || nativeErrorToString.call({}) !== 'Error';
	});

	var errorToString$1 = INCORRECT_TO_STRING$1 ? function toString() {
	  var O = anObject$6(this);
	  var name = normalizeStringArgument$3(O.name, 'Error');
	  var message = normalizeStringArgument$3(O.message);
	  return !name ? message : !message ? name : name + ': ' + message;
	} : nativeErrorToString;

	var domExceptionConstants = {
	  IndexSizeError: { s: 'INDEX_SIZE_ERR', c: 1, m: 1 },
	  DOMStringSizeError: { s: 'DOMSTRING_SIZE_ERR', c: 2, m: 0 },
	  HierarchyRequestError: { s: 'HIERARCHY_REQUEST_ERR', c: 3, m: 1 },
	  WrongDocumentError: { s: 'WRONG_DOCUMENT_ERR', c: 4, m: 1 },
	  InvalidCharacterError: { s: 'INVALID_CHARACTER_ERR', c: 5, m: 1 },
	  NoDataAllowedError: { s: 'NO_DATA_ALLOWED_ERR', c: 6, m: 0 },
	  NoModificationAllowedError: { s: 'NO_MODIFICATION_ALLOWED_ERR', c: 7, m: 1 },
	  NotFoundError: { s: 'NOT_FOUND_ERR', c: 8, m: 1 },
	  NotSupportedError: { s: 'NOT_SUPPORTED_ERR', c: 9, m: 1 },
	  InUseAttributeError: { s: 'INUSE_ATTRIBUTE_ERR', c: 10, m: 1 },
	  InvalidStateError: { s: 'INVALID_STATE_ERR', c: 11, m: 1 },
	  SyntaxError: { s: 'SYNTAX_ERR', c: 12, m: 1 },
	  InvalidModificationError: { s: 'INVALID_MODIFICATION_ERR', c: 13, m: 1 },
	  NamespaceError: { s: 'NAMESPACE_ERR', c: 14, m: 1 },
	  InvalidAccessError: { s: 'INVALID_ACCESS_ERR', c: 15, m: 1 },
	  ValidationError: { s: 'VALIDATION_ERR', c: 16, m: 0 },
	  TypeMismatchError: { s: 'TYPE_MISMATCH_ERR', c: 17, m: 1 },
	  SecurityError: { s: 'SECURITY_ERR', c: 18, m: 1 },
	  NetworkError: { s: 'NETWORK_ERR', c: 19, m: 1 },
	  AbortError: { s: 'ABORT_ERR', c: 20, m: 1 },
	  URLMismatchError: { s: 'URL_MISMATCH_ERR', c: 21, m: 1 },
	  QuotaExceededError: { s: 'QUOTA_EXCEEDED_ERR', c: 22, m: 1 },
	  TimeoutError: { s: 'TIMEOUT_ERR', c: 23, m: 1 },
	  InvalidNodeTypeError: { s: 'INVALID_NODE_TYPE_ERR', c: 24, m: 1 },
	  DataCloneError: { s: 'DATA_CLONE_ERR', c: 25, m: 1 }
	};

	var $$i = _export;
	var tryNodeRequire = tryNodeRequire$1;
	var getBuiltIn$3 = getBuiltIn$i;
	var fails$8 = fails$X;
	var create$1 = objectCreate;
	var createPropertyDescriptor$2 = createPropertyDescriptor$a;
	var defineProperty$2 = objectDefineProperty.f;
	var defineBuiltIn$1 = defineBuiltIn$h;
	var defineBuiltInAccessor$2 = defineBuiltInAccessor$3;
	var hasOwn$3 = hasOwnProperty_1;
	var anInstance$1 = anInstance$8;
	var anObject$5 = anObject$r;
	var errorToString = errorToString$1;
	var normalizeStringArgument$2 = normalizeStringArgument$5;
	var DOMExceptionConstants$1 = domExceptionConstants;
	var clearErrorStack$2 = errorStackClear;
	var InternalStateModule = internalState;
	var DESCRIPTORS$6 = descriptors;

	var DOM_EXCEPTION$2 = 'DOMException';
	var DATA_CLONE_ERR = 'DATA_CLONE_ERR';
	var Error$2 = getBuiltIn$3('Error');
	// NodeJS < 17.0 does not expose `DOMException` to global
	var NativeDOMException$1 = getBuiltIn$3(DOM_EXCEPTION$2) || (function () {
	  try {
	    // NodeJS < 15.0 does not expose `MessageChannel` to global
	    var MessageChannel = getBuiltIn$3('MessageChannel') || tryNodeRequire('worker_threads').MessageChannel;
	    // eslint-disable-next-line es/no-weak-map, unicorn/require-post-message-target-origin -- safe
	    new MessageChannel().port1.postMessage(new WeakMap());
	  } catch (error) {
	    if (error.name == DATA_CLONE_ERR && error.code == 25) return error.constructor;
	  }
	})();
	var NativeDOMExceptionPrototype = NativeDOMException$1 && NativeDOMException$1.prototype;
	var ErrorPrototype = Error$2.prototype;
	var setInternalState = InternalStateModule.set;
	var getInternalState$2 = InternalStateModule.getterFor(DOM_EXCEPTION$2);
	var HAS_STACK = 'stack' in Error$2(DOM_EXCEPTION$2);

	var codeFor = function (name) {
	  return hasOwn$3(DOMExceptionConstants$1, name) && DOMExceptionConstants$1[name].m ? DOMExceptionConstants$1[name].c : 0;
	};

	var $DOMException$1 = function DOMException() {
	  anInstance$1(this, DOMExceptionPrototype$1);
	  var argumentsLength = arguments.length;
	  var message = normalizeStringArgument$2(argumentsLength < 1 ? undefined : arguments[0]);
	  var name = normalizeStringArgument$2(argumentsLength < 2 ? undefined : arguments[1], 'Error');
	  var code = codeFor(name);
	  setInternalState(this, {
	    type: DOM_EXCEPTION$2,
	    name: name,
	    message: message,
	    code: code
	  });
	  if (!DESCRIPTORS$6) {
	    this.name = name;
	    this.message = message;
	    this.code = code;
	  }
	  if (HAS_STACK) {
	    var error = Error$2(message);
	    error.name = DOM_EXCEPTION$2;
	    defineProperty$2(this, 'stack', createPropertyDescriptor$2(1, clearErrorStack$2(error.stack, 1)));
	  }
	};

	var DOMExceptionPrototype$1 = $DOMException$1.prototype = create$1(ErrorPrototype);

	var createGetterDescriptor = function (get) {
	  return { enumerable: true, configurable: true, get: get };
	};

	var getterFor = function (key) {
	  return createGetterDescriptor(function () {
	    return getInternalState$2(this)[key];
	  });
	};

	if (DESCRIPTORS$6) {
	  defineBuiltInAccessor$2(DOMExceptionPrototype$1, 'code', getterFor('code'));
	  defineBuiltInAccessor$2(DOMExceptionPrototype$1, 'message', getterFor('message'));
	  defineBuiltInAccessor$2(DOMExceptionPrototype$1, 'name', getterFor('name'));
	}

	defineProperty$2(DOMExceptionPrototype$1, 'constructor', createPropertyDescriptor$2(1, $DOMException$1));

	// FF36- DOMException is a function, but can't be constructed
	var INCORRECT_CONSTRUCTOR = fails$8(function () {
	  return !(new NativeDOMException$1() instanceof Error$2);
	});

	// Safari 10.1 / Chrome 32- / IE8- DOMException.prototype.toString bugs
	var INCORRECT_TO_STRING = INCORRECT_CONSTRUCTOR || fails$8(function () {
	  return ErrorPrototype.toString !== errorToString || String(new NativeDOMException$1(1, 2)) !== '2: 1';
	});

	// Deno 1.6.3- DOMException.prototype.code just missed
	var INCORRECT_CODE = INCORRECT_CONSTRUCTOR || fails$8(function () {
	  return new NativeDOMException$1(1, 'DataCloneError').code !== 25;
	});

	// Deno 1.6.3- DOMException constants just missed
	INCORRECT_CONSTRUCTOR
	  || NativeDOMException$1[DATA_CLONE_ERR] !== 25
	  || NativeDOMExceptionPrototype[DATA_CLONE_ERR] !== 25;

	var FORCED_CONSTRUCTOR$1 = INCORRECT_CONSTRUCTOR;

	// `DOMException` constructor
	// https://webidl.spec.whatwg.org/#idl-DOMException
	$$i({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR$1 }, {
	  DOMException: FORCED_CONSTRUCTOR$1 ? $DOMException$1 : NativeDOMException$1
	});

	var PolyfilledDOMException$1 = getBuiltIn$3(DOM_EXCEPTION$2);
	var PolyfilledDOMExceptionPrototype$1 = PolyfilledDOMException$1.prototype;

	if (INCORRECT_TO_STRING && (NativeDOMException$1 === PolyfilledDOMException$1)) {
	  defineBuiltIn$1(PolyfilledDOMExceptionPrototype$1, 'toString', errorToString);
	}

	if (INCORRECT_CODE && DESCRIPTORS$6 && NativeDOMException$1 === PolyfilledDOMException$1) {
	  defineBuiltInAccessor$2(PolyfilledDOMExceptionPrototype$1, 'code', createGetterDescriptor(function () {
	    return codeFor(anObject$5(this).name);
	  }));
	}

	for (var key$1 in DOMExceptionConstants$1) if (hasOwn$3(DOMExceptionConstants$1, key$1)) {
	  var constant$1 = DOMExceptionConstants$1[key$1];
	  var constantName$1 = constant$1.s;
	  var descriptor$1 = createPropertyDescriptor$2(6, constant$1.c);
	  if (!hasOwn$3(PolyfilledDOMException$1, constantName$1)) {
	    defineProperty$2(PolyfilledDOMException$1, constantName$1, descriptor$1);
	  }
	  if (!hasOwn$3(PolyfilledDOMExceptionPrototype$1, constantName$1)) {
	    defineProperty$2(PolyfilledDOMExceptionPrototype$1, constantName$1, descriptor$1);
	  }
	}

	var $$h = _export;
	var global$4 = global$K;
	var getBuiltIn$2 = getBuiltIn$i;
	var createPropertyDescriptor$1 = createPropertyDescriptor$a;
	var defineProperty$1 = objectDefineProperty.f;
	var hasOwn$2 = hasOwnProperty_1;
	var anInstance = anInstance$8;
	var inheritIfRequired$1 = inheritIfRequired$6;
	var normalizeStringArgument$1 = normalizeStringArgument$5;
	var DOMExceptionConstants = domExceptionConstants;
	var clearErrorStack$1 = errorStackClear;
	var DESCRIPTORS$5 = descriptors;

	var DOM_EXCEPTION$1 = 'DOMException';
	var Error$1 = getBuiltIn$2('Error');
	var NativeDOMException = getBuiltIn$2(DOM_EXCEPTION$1);

	var $DOMException = function DOMException() {
	  anInstance(this, DOMExceptionPrototype);
	  var argumentsLength = arguments.length;
	  var message = normalizeStringArgument$1(argumentsLength < 1 ? undefined : arguments[0]);
	  var name = normalizeStringArgument$1(argumentsLength < 2 ? undefined : arguments[1], 'Error');
	  var that = new NativeDOMException(message, name);
	  var error = Error$1(message);
	  error.name = DOM_EXCEPTION$1;
	  defineProperty$1(that, 'stack', createPropertyDescriptor$1(1, clearErrorStack$1(error.stack, 1)));
	  inheritIfRequired$1(that, this, $DOMException);
	  return that;
	};

	var DOMExceptionPrototype = $DOMException.prototype = NativeDOMException.prototype;

	var ERROR_HAS_STACK = 'stack' in Error$1(DOM_EXCEPTION$1);
	var DOM_EXCEPTION_HAS_STACK = 'stack' in new NativeDOMException(1, 2);

	// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
	var descriptor = NativeDOMException && DESCRIPTORS$5 && Object.getOwnPropertyDescriptor(global$4, DOM_EXCEPTION$1);

	// Bun ~ 0.1.1 DOMException have incorrect descriptor and we can't redefine it
	// https://github.com/Jarred-Sumner/bun/issues/399
	var BUGGY_DESCRIPTOR = !!descriptor && !(descriptor.writable && descriptor.configurable);

	var FORCED_CONSTRUCTOR = ERROR_HAS_STACK && !BUGGY_DESCRIPTOR && !DOM_EXCEPTION_HAS_STACK;

	// `DOMException` constructor patch for `.stack` where it's required
	// https://webidl.spec.whatwg.org/#es-DOMException-specialness
	$$h({ global: true, constructor: true, forced: FORCED_CONSTRUCTOR }, { // TODO: fix export logic
	  DOMException: FORCED_CONSTRUCTOR ? $DOMException : NativeDOMException
	});

	var PolyfilledDOMException = getBuiltIn$2(DOM_EXCEPTION$1);
	var PolyfilledDOMExceptionPrototype = PolyfilledDOMException.prototype;

	if (PolyfilledDOMExceptionPrototype.constructor !== PolyfilledDOMException) {
	  {
	    defineProperty$1(PolyfilledDOMExceptionPrototype, 'constructor', createPropertyDescriptor$1(1, PolyfilledDOMException));
	  }

	  for (var key in DOMExceptionConstants) if (hasOwn$2(DOMExceptionConstants, key)) {
	    var constant = DOMExceptionConstants[key];
	    var constantName = constant.s;
	    if (!hasOwn$2(PolyfilledDOMException, constantName)) {
	      defineProperty$1(PolyfilledDOMException, constantName, createPropertyDescriptor$1(6, constant.c));
	    }
	  }
	}

	var getBuiltIn$1 = getBuiltIn$i;
	var setToStringTag$1 = setToStringTag$b;

	var DOM_EXCEPTION = 'DOMException';

	setToStringTag$1(getBuiltIn$1(DOM_EXCEPTION), DOM_EXCEPTION);

	var defineWellKnownSymbol = wellKnownSymbolDefine;

	// `Symbol.hasInstance` well-known symbol
	// https://tc39.es/ecma262/#sec-symbol.hasinstance
	defineWellKnownSymbol('hasInstance');

	var isCallable = isCallable$t;
	var isObject = isObject$r;
	var definePropertyModule = objectDefineProperty;
	var getPrototypeOf$1 = objectGetPrototypeOf$1;
	var wellKnownSymbol$2 = wellKnownSymbol$v;
	var makeBuiltIn = makeBuiltIn$4.exports;

	var HAS_INSTANCE = wellKnownSymbol$2('hasInstance');
	var FunctionPrototype = Function.prototype;

	// `Function.prototype[@@hasInstance]` method
	// https://tc39.es/ecma262/#sec-function.prototype-@@hasinstance
	if (!(HAS_INSTANCE in FunctionPrototype)) {
	  definePropertyModule.f(FunctionPrototype, HAS_INSTANCE, { value: makeBuiltIn(function (O) {
	    if (!isCallable(this) || !isObject(O)) return false;
	    var P = this.prototype;
	    if (!isObject(P)) return O instanceof this;
	    // for environment w/o native `@@hasInstance` logic enough `instanceof`, but add this:
	    while (O = getPrototypeOf$1(O)) if (P === O) return true;
	    return false;
	  }, HAS_INSTANCE) });
	}

	var global$3 = global$K;

	var globalIsFinite = global$3.isFinite;

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	// eslint-disable-next-line es/no-number-isfinite -- safe
	var numberIsFinite$1 = Number.isFinite || function isFinite(it) {
	  return typeof it == 'number' && globalIsFinite(it);
	};

	var $$g = _export;
	var numberIsFinite = numberIsFinite$1;

	// `Number.isFinite` method
	// https://tc39.es/ecma262/#sec-number.isfinite
	$$g({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

	var $$f = _export;

	var log$1 = Math.log;
	var LN2 = Math.LN2;

	// `Math.log2` method
	// https://tc39.es/ecma262/#sec-math.log2
	$$f({ target: 'Math', stat: true }, {
	  log2: function log2(x) {
	    return log$1(x) / LN2;
	  }
	});

	var log = Math.log;
	var LOG10E = Math.LOG10E;

	// eslint-disable-next-line es/no-math-log10 -- safe
	var mathLog10 = Math.log10 || function log10(x) {
	  return log(x) * LOG10E;
	};

	var $$e = _export;
	var log10 = mathLog10;

	// `Math.log10` method
	// https://tc39.es/ecma262/#sec-math.log10
	$$e({ target: 'Math', stat: true }, {
	  log10: log10
	});

	var $$d = _export;
	var call$4 = functionCall;

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	$$d({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return call$4(URL.prototype.toString, this);
	  }
	});

	var apply$1 = functionApply$1;
	var call$3 = functionCall;
	var uncurryThis$4 = functionUncurryThis;
	var fixRegExpWellKnownSymbolLogic$2 = fixRegexpWellKnownSymbolLogic;
	var anObject$4 = anObject$r;
	var isNullOrUndefined$2 = isNullOrUndefined$b;
	var isRegExp$1 = isRegexp;
	var requireObjectCoercible$2 = requireObjectCoercible$d;
	var speciesConstructor = speciesConstructor$3;
	var advanceStringIndex$1 = advanceStringIndex$3;
	var toLength$1 = toLength$a;
	var toString$4 = toString$k;
	var getMethod$2 = getMethod$7;
	var arraySlice = arraySliceSimple;
	var callRegExpExec = regexpExecAbstract;
	var regexpExec = regexpExec$3;
	var stickyHelpers$1 = regexpStickyHelpers;
	var fails$7 = fails$X;

	var UNSUPPORTED_Y$1 = stickyHelpers$1.UNSUPPORTED_Y;
	var MAX_UINT32 = 0xFFFFFFFF;
	var min = Math.min;
	var $push = [].push;
	var exec$1 = uncurryThis$4(/./.exec);
	var push$3 = uncurryThis$4($push);
	var stringSlice$1 = uncurryThis$4(''.slice);

	// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
	// Weex JS has frozen built-in prototypes, so use try / catch wrapper
	var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails$7(function () {
	  // eslint-disable-next-line regexp/no-empty-group -- required for testing
	  var re = /(?:)/;
	  var originalExec = re.exec;
	  re.exec = function () { return originalExec.apply(this, arguments); };
	  var result = 'ab'.split(re);
	  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
	});

	// @@split logic
	fixRegExpWellKnownSymbolLogic$2('split', function (SPLIT, nativeSplit, maybeCallNative) {
	  var internalSplit;
	  if (
	    'abbc'.split(/(b)*/)[1] == 'c' ||
	    // eslint-disable-next-line regexp/no-empty-group -- required for testing
	    'test'.split(/(?:)/, -1).length != 4 ||
	    'ab'.split(/(?:ab)*/).length != 2 ||
	    '.'.split(/(.?)(.?)/).length != 4 ||
	    // eslint-disable-next-line regexp/no-empty-capturing-group, regexp/no-empty-group -- required for testing
	    '.'.split(/()()/).length > 1 ||
	    ''.split(/.?/).length
	  ) {
	    // based on es5-shim implementation, need to rework it
	    internalSplit = function (separator, limit) {
	      var string = toString$4(requireObjectCoercible$2(this));
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (separator === undefined) return [string];
	      // If `separator` is not a regex, use native split
	      if (!isRegExp$1(separator)) {
	        return call$3(nativeSplit, string, separator, lim);
	      }
	      var output = [];
	      var flags = (separator.ignoreCase ? 'i' : '') +
	                  (separator.multiline ? 'm' : '') +
	                  (separator.unicode ? 'u' : '') +
	                  (separator.sticky ? 'y' : '');
	      var lastLastIndex = 0;
	      // Make `global` and avoid `lastIndex` issues by working with a copy
	      var separatorCopy = new RegExp(separator.source, flags + 'g');
	      var match, lastIndex, lastLength;
	      while (match = call$3(regexpExec, separatorCopy, string)) {
	        lastIndex = separatorCopy.lastIndex;
	        if (lastIndex > lastLastIndex) {
	          push$3(output, stringSlice$1(string, lastLastIndex, match.index));
	          if (match.length > 1 && match.index < string.length) apply$1($push, output, arraySlice(match, 1));
	          lastLength = match[0].length;
	          lastLastIndex = lastIndex;
	          if (output.length >= lim) break;
	        }
	        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
	      }
	      if (lastLastIndex === string.length) {
	        if (lastLength || !exec$1(separatorCopy, '')) push$3(output, '');
	      } else push$3(output, stringSlice$1(string, lastLastIndex));
	      return output.length > lim ? arraySlice(output, 0, lim) : output;
	    };
	  // Chakra, V8
	  } else if ('0'.split(undefined, 0).length) {
	    internalSplit = function (separator, limit) {
	      return separator === undefined && limit === 0 ? [] : call$3(nativeSplit, this, separator, limit);
	    };
	  } else internalSplit = nativeSplit;

	  return [
	    // `String.prototype.split` method
	    // https://tc39.es/ecma262/#sec-string.prototype.split
	    function split(separator, limit) {
	      var O = requireObjectCoercible$2(this);
	      var splitter = isNullOrUndefined$2(separator) ? undefined : getMethod$2(separator, SPLIT);
	      return splitter
	        ? call$3(splitter, separator, O, limit)
	        : call$3(internalSplit, toString$4(O), separator, limit);
	    },
	    // `RegExp.prototype[@@split]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@split
	    //
	    // NOTE: This cannot be properly polyfilled in engines that don't support
	    // the 'y' flag.
	    function (string, limit) {
	      var rx = anObject$4(this);
	      var S = toString$4(string);
	      var res = maybeCallNative(internalSplit, rx, S, limit, internalSplit !== nativeSplit);

	      if (res.done) return res.value;

	      var C = speciesConstructor(rx, RegExp);

	      var unicodeMatching = rx.unicode;
	      var flags = (rx.ignoreCase ? 'i' : '') +
	                  (rx.multiline ? 'm' : '') +
	                  (rx.unicode ? 'u' : '') +
	                  (UNSUPPORTED_Y$1 ? 'g' : 'y');

	      // ^(? + rx + ) is needed, in combination with some S slicing, to
	      // simulate the 'y' flag.
	      var splitter = new C(UNSUPPORTED_Y$1 ? '^(?:' + rx.source + ')' : rx, flags);
	      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
	      if (lim === 0) return [];
	      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
	      var p = 0;
	      var q = 0;
	      var A = [];
	      while (q < S.length) {
	        splitter.lastIndex = UNSUPPORTED_Y$1 ? 0 : q;
	        var z = callRegExpExec(splitter, UNSUPPORTED_Y$1 ? stringSlice$1(S, q) : S);
	        var e;
	        if (
	          z === null ||
	          (e = min(toLength$1(splitter.lastIndex + (UNSUPPORTED_Y$1 ? q : 0)), S.length)) === p
	        ) {
	          q = advanceStringIndex$1(S, q, unicodeMatching);
	        } else {
	          push$3(A, stringSlice$1(S, p, q));
	          if (A.length === lim) return A;
	          for (var i = 1; i <= z.length - 1; i++) {
	            push$3(A, z[i]);
	            if (A.length === lim) return A;
	          }
	          q = p = e;
	        }
	      }
	      push$3(A, stringSlice$1(S, p));
	      return A;
	    }
	  ];
	}, !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC, UNSUPPORTED_Y$1);

	var call$2 = functionCall;
	var fixRegExpWellKnownSymbolLogic$1 = fixRegexpWellKnownSymbolLogic;
	var anObject$3 = anObject$r;
	var isNullOrUndefined$1 = isNullOrUndefined$b;
	var toLength = toLength$a;
	var toString$3 = toString$k;
	var requireObjectCoercible$1 = requireObjectCoercible$d;
	var getMethod$1 = getMethod$7;
	var advanceStringIndex = advanceStringIndex$3;
	var regExpExec$1 = regexpExecAbstract;

	// @@match logic
	fixRegExpWellKnownSymbolLogic$1('match', function (MATCH, nativeMatch, maybeCallNative) {
	  return [
	    // `String.prototype.match` method
	    // https://tc39.es/ecma262/#sec-string.prototype.match
	    function match(regexp) {
	      var O = requireObjectCoercible$1(this);
	      var matcher = isNullOrUndefined$1(regexp) ? undefined : getMethod$1(regexp, MATCH);
	      return matcher ? call$2(matcher, regexp, O) : new RegExp(regexp)[MATCH](toString$3(O));
	    },
	    // `RegExp.prototype[@@match]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
	    function (string) {
	      var rx = anObject$3(this);
	      var S = toString$3(string);
	      var res = maybeCallNative(nativeMatch, rx, S);

	      if (res.done) return res.value;

	      if (!rx.global) return regExpExec$1(rx, S);

	      var fullUnicode = rx.unicode;
	      rx.lastIndex = 0;
	      var A = [];
	      var n = 0;
	      var result;
	      while ((result = regExpExec$1(rx, S)) !== null) {
	        var matchStr = toString$3(result[0]);
	        A[n] = matchStr;
	        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
	        n++;
	      }
	      return n === 0 ? null : A;
	    }
	  ];
	});

	var $$c = _export;
	var hasOwn$1 = hasOwnProperty_1;

	// `Object.hasOwn` method
	// https://github.com/tc39/proposal-accessible-object-hasownproperty
	$$c({ target: 'Object', stat: true }, {
	  hasOwn: hasOwn$1
	});

	var $$b = _export;
	var fails$6 = fails$X;
	var getOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;

	// eslint-disable-next-line es/no-object-getownpropertynames -- required for testing
	var FAILS_ON_PRIMITIVES = fails$6(function () { return !Object.getOwnPropertyNames(1); });

	// `Object.getOwnPropertyNames` method
	// https://tc39.es/ecma262/#sec-object.getownpropertynames
	$$b({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  getOwnPropertyNames: getOwnPropertyNames$1
	});

	var $$a = _export;
	var global$2 = global$K;
	var setToStringTag = setToStringTag$b;

	$$a({ global: true }, { Reflect: {} });

	// Reflect[@@toStringTag] property
	// https://tc39.es/ecma262/#sec-reflect-@@tostringtag
	setToStringTag(global$2.Reflect, 'Reflect', true);

	var $$9 = _export;
	var functionApply = functionApply$1;
	var aCallable$1 = aCallable$e;
	var anObject$2 = anObject$r;
	var fails$5 = fails$X;

	// MS Edge argumentsList argument is optional
	var OPTIONAL_ARGUMENTS_LIST = !fails$5(function () {
	  // eslint-disable-next-line es/no-reflect -- required for testing
	  Reflect.apply(function () { /* empty */ });
	});

	// `Reflect.apply` method
	// https://tc39.es/ecma262/#sec-reflect.apply
	$$9({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
	  apply: function apply(target, thisArgument, argumentsList) {
	    return functionApply(aCallable$1(target), thisArgument, anObject$2(argumentsList));
	  }
	});

	var DESCRIPTORS$4 = descriptors;
	var uncurryThis$3 = functionUncurryThis;
	var objectKeys$1 = objectKeys$4;
	var toIndexedObject = toIndexedObject$e;
	var $propertyIsEnumerable = objectPropertyIsEnumerable.f;

	var propertyIsEnumerable = uncurryThis$3($propertyIsEnumerable);
	var push$2 = uncurryThis$3([].push);

	// `Object.{ entries, values }` methods implementation
	var createMethod = function (TO_ENTRIES) {
	  return function (it) {
	    var O = toIndexedObject(it);
	    var keys = objectKeys$1(O);
	    var length = keys.length;
	    var i = 0;
	    var result = [];
	    var key;
	    while (length > i) {
	      key = keys[i++];
	      if (!DESCRIPTORS$4 || propertyIsEnumerable(O, key)) {
	        push$2(result, TO_ENTRIES ? [key, O[key]] : O[key]);
	      }
	    }
	    return result;
	  };
	};

	var objectToArray = {
	  // `Object.entries` method
	  // https://tc39.es/ecma262/#sec-object.entries
	  entries: createMethod(true),
	  // `Object.values` method
	  // https://tc39.es/ecma262/#sec-object.values
	  values: createMethod(false)
	};

	var $$8 = _export;
	var $entries = objectToArray.entries;

	// `Object.entries` method
	// https://tc39.es/ecma262/#sec-object.entries
	$$8({ target: 'Object', stat: true }, {
	  entries: function entries(O) {
	    return $entries(O);
	  }
	});

	var PROPER_FUNCTION_NAME = functionName.PROPER;
	var fails$4 = fails$X;
	var whitespaces = whitespaces$2;

	var non = '\u200B\u0085\u180E';

	// check that a method works with the correct list
	// of whitespaces and has a correct name
	var stringTrimForced = function (METHOD_NAME) {
	  return fails$4(function () {
	    return !!whitespaces[METHOD_NAME]()
	      || non[METHOD_NAME]() !== non
	      || (PROPER_FUNCTION_NAME && whitespaces[METHOD_NAME].name !== METHOD_NAME);
	  });
	};

	var $$7 = _export;
	var $trim = stringTrim.trim;
	var forcedStringTrimMethod = stringTrimForced;

	// `String.prototype.trim` method
	// https://tc39.es/ecma262/#sec-string.prototype.trim
	$$7({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
	  trim: function trim() {
	    return $trim(this);
	  }
	});

	var $$6 = _export;
	var uncurryThis$2 = functionUncurryThis;
	var aCallable = aCallable$e;
	var toObject$1 = toObject$j;
	var lengthOfArrayLike = lengthOfArrayLike$n;
	var deletePropertyOrThrow = deletePropertyOrThrow$3;
	var toString$2 = toString$k;
	var fails$3 = fails$X;
	var internalSort = arraySort;
	var arrayMethodIsStrict = arrayMethodIsStrict$4;
	var FF = engineFfVersion;
	var IE_OR_EDGE = engineIsIeOrEdge;
	var V8 = engineV8Version;
	var WEBKIT = engineWebkitVersion;

	var test = [];
	var nativeSort = uncurryThis$2(test.sort);
	var push$1 = uncurryThis$2(test.push);

	// IE8-
	var FAILS_ON_UNDEFINED = fails$3(function () {
	  test.sort(undefined);
	});
	// V8 bug
	var FAILS_ON_NULL = fails$3(function () {
	  test.sort(null);
	});
	// Old WebKit
	var STRICT_METHOD = arrayMethodIsStrict('sort');

	var STABLE_SORT = !fails$3(function () {
	  // feature detection can be too slow, so check engines versions
	  if (V8) return V8 < 70;
	  if (FF && FF > 3) return;
	  if (IE_OR_EDGE) return true;
	  if (WEBKIT) return WEBKIT < 603;

	  var result = '';
	  var code, chr, value, index;

	  // generate an array with more 512 elements (Chakra and old V8 fails only in this case)
	  for (code = 65; code < 76; code++) {
	    chr = String.fromCharCode(code);

	    switch (code) {
	      case 66: case 69: case 70: case 72: value = 3; break;
	      case 68: case 71: value = 4; break;
	      default: value = 2;
	    }

	    for (index = 0; index < 47; index++) {
	      test.push({ k: chr + index, v: value });
	    }
	  }

	  test.sort(function (a, b) { return b.v - a.v; });

	  for (index = 0; index < test.length; index++) {
	    chr = test[index].k.charAt(0);
	    if (result.charAt(result.length - 1) !== chr) result += chr;
	  }

	  return result !== 'DGBEFHACIJK';
	});

	var FORCED$1 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD || !STABLE_SORT;

	var getSortCompare = function (comparefn) {
	  return function (x, y) {
	    if (y === undefined) return -1;
	    if (x === undefined) return 1;
	    if (comparefn !== undefined) return +comparefn(x, y) || 0;
	    return toString$2(x) > toString$2(y) ? 1 : -1;
	  };
	};

	// `Array.prototype.sort` method
	// https://tc39.es/ecma262/#sec-array.prototype.sort
	$$6({ target: 'Array', proto: true, forced: FORCED$1 }, {
	  sort: function sort(comparefn) {
	    if (comparefn !== undefined) aCallable(comparefn);

	    var array = toObject$1(this);

	    if (STABLE_SORT) return comparefn === undefined ? nativeSort(array) : nativeSort(array, comparefn);

	    var items = [];
	    var arrayLength = lengthOfArrayLike(array);
	    var itemsLength, index;

	    for (index = 0; index < arrayLength; index++) {
	      if (index in array) push$1(items, array[index]);
	    }

	    internalSort(items, getSortCompare(comparefn));

	    itemsLength = lengthOfArrayLike(items);
	    index = 0;

	    while (index < itemsLength) array[index] = items[index++];
	    while (index < arrayLength) deletePropertyOrThrow(array, index++);

	    return array;
	  }
	});

	var DESCRIPTORS$3 = descriptors;
	var uncurryThis$1 = functionUncurryThis;
	var call$1 = functionCall;
	var fails$2 = fails$X;
	var objectKeys = objectKeys$4;
	var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
	var propertyIsEnumerableModule = objectPropertyIsEnumerable;
	var toObject = toObject$j;
	var IndexedObject = indexedObject;

	// eslint-disable-next-line es/no-object-assign -- safe
	var $assign = Object.assign;
	// eslint-disable-next-line es/no-object-defineproperty -- required for testing
	var defineProperty = Object.defineProperty;
	var concat = uncurryThis$1([].concat);

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	var objectAssign = !$assign || fails$2(function () {
	  // should have correct order of operations (Edge bug)
	  if (DESCRIPTORS$3 && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line es/no-symbol -- safe
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
	  var propertyIsEnumerable = propertyIsEnumerableModule.f;
	  while (argumentsLength > index) {
	    var S = IndexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? concat(objectKeys(S), getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!DESCRIPTORS$3 || call$1(propertyIsEnumerable, S, key)) T[key] = S[key];
	    }
	  } return T;
	} : $assign;

	var $$5 = _export;
	var assign = objectAssign;

	// `Object.assign` method
	// https://tc39.es/ecma262/#sec-object.assign
	// eslint-disable-next-line es/no-object-assign -- required for testing
	$$5({ target: 'Object', stat: true, arity: 2, forced: Object.assign !== assign }, {
	  assign: assign
	});

	var $$4 = _export;
	var $find = arrayIteration.find;
	var addToUnscopables = addToUnscopables$7;

	var FIND = 'find';
	var SKIPS_HOLES = true;

	// Shouldn't skip holes
	if (FIND in []) Array(1)[FIND](function () { SKIPS_HOLES = false; });

	// `Array.prototype.find` method
	// https://tc39.es/ecma262/#sec-array.prototype.find
	$$4({ target: 'Array', proto: true, forced: SKIPS_HOLES }, {
	  find: function find(callbackfn /* , that = undefined */) {
	    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables(FIND);

	var $$3 = _export;
	var isPrototypeOf$1 = objectIsPrototypeOf;
	var getPrototypeOf = objectGetPrototypeOf$1;
	var setPrototypeOf = objectSetPrototypeOf;
	var copyConstructorProperties = copyConstructorProperties$4;
	var create = objectCreate;
	var createNonEnumerableProperty$1 = createNonEnumerableProperty$d;
	var createPropertyDescriptor = createPropertyDescriptor$a;
	var clearErrorStack = errorStackClear;
	var installErrorCause = installErrorCause$2;
	var iterate = iterate$6;
	var normalizeStringArgument = normalizeStringArgument$5;
	var wellKnownSymbol$1 = wellKnownSymbol$v;
	var ERROR_STACK_INSTALLABLE = errorStackInstallable;

	var TO_STRING_TAG = wellKnownSymbol$1('toStringTag');
	var $Error = Error;
	var push = [].push;

	var $AggregateError$1 = function AggregateError(errors, message /* , options */) {
	  var options = arguments.length > 2 ? arguments[2] : undefined;
	  var isInstance = isPrototypeOf$1(AggregateErrorPrototype, this);
	  var that;
	  if (setPrototypeOf) {
	    that = setPrototypeOf($Error(), isInstance ? getPrototypeOf(this) : AggregateErrorPrototype);
	  } else {
	    that = isInstance ? this : create(AggregateErrorPrototype);
	    createNonEnumerableProperty$1(that, TO_STRING_TAG, 'Error');
	  }
	  if (message !== undefined) createNonEnumerableProperty$1(that, 'message', normalizeStringArgument(message));
	  if (ERROR_STACK_INSTALLABLE) createNonEnumerableProperty$1(that, 'stack', clearErrorStack(that.stack, 1));
	  installErrorCause(that, options);
	  var errorsArray = [];
	  iterate(errors, push, { that: errorsArray });
	  createNonEnumerableProperty$1(that, 'errors', errorsArray);
	  return that;
	};

	if (setPrototypeOf) setPrototypeOf($AggregateError$1, $Error);
	else copyConstructorProperties($AggregateError$1, $Error, { name: true });

	var AggregateErrorPrototype = $AggregateError$1.prototype = create($Error.prototype, {
	  constructor: createPropertyDescriptor(1, $AggregateError$1),
	  message: createPropertyDescriptor(1, ''),
	  name: createPropertyDescriptor(1, 'AggregateError')
	});

	// `AggregateError` constructor
	// https://tc39.es/ecma262/#sec-aggregate-error-constructor
	$$3({ global: true, constructor: true, arity: 2 }, {
	  AggregateError: $AggregateError$1
	});

	var $$2 = _export;
	var getBuiltIn = getBuiltIn$i;
	var apply = functionApply$1;
	var fails$1 = fails$X;
	var wrapErrorConstructorWithCause = wrapErrorConstructorWithCause$2;

	var AGGREGATE_ERROR = 'AggregateError';
	var $AggregateError = getBuiltIn(AGGREGATE_ERROR);

	var FORCED = !fails$1(function () {
	  return $AggregateError([1]).errors[0] !== 1;
	}) && fails$1(function () {
	  return $AggregateError([1], AGGREGATE_ERROR, { cause: 7 }).cause !== 7;
	});

	// https://github.com/tc39/proposal-error-cause
	$$2({ global: true, constructor: true, arity: 2, forced: FORCED }, {
	  AggregateError: wrapErrorConstructorWithCause(AGGREGATE_ERROR, function (init) {
	    // eslint-disable-next-line no-unused-vars -- required for functions `.length`
	    return function AggregateError(errors, message) { return apply(init, this, arguments); };
	  }, FORCED, true)
	});

	var DESCRIPTORS$2 = descriptors;
	var global$1 = global$K;
	var uncurryThis = functionUncurryThis;
	var isForced = isForced_1;
	var inheritIfRequired = inheritIfRequired$6;
	var createNonEnumerableProperty = createNonEnumerableProperty$d;
	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var isPrototypeOf = objectIsPrototypeOf;
	var isRegExp = isRegexp;
	var toString$1 = toString$k;
	var getRegExpFlags = regexpGetFlags;
	var stickyHelpers = regexpStickyHelpers;
	var proxyAccessor = proxyAccessor$2;
	var defineBuiltIn = defineBuiltIn$h;
	var fails = fails$X;
	var hasOwn = hasOwnProperty_1;
	var enforceInternalState = internalState.enforce;
	var setSpecies = setSpecies$5;
	var wellKnownSymbol = wellKnownSymbol$v;
	var UNSUPPORTED_DOT_ALL$1 = regexpUnsupportedDotAll;
	var UNSUPPORTED_NCG = regexpUnsupportedNcg;

	var MATCH = wellKnownSymbol('match');
	var NativeRegExp = global$1.RegExp;
	var RegExpPrototype$2 = NativeRegExp.prototype;
	var SyntaxError = global$1.SyntaxError;
	var exec = uncurryThis(RegExpPrototype$2.exec);
	var charAt = uncurryThis(''.charAt);
	var replace = uncurryThis(''.replace);
	var stringIndexOf = uncurryThis(''.indexOf);
	var stringSlice = uncurryThis(''.slice);
	// TODO: Use only proper RegExpIdentifierName
	var IS_NCG = /^\?<[^\s\d!#%&*+<=>@^][^\s!#%&*+<=>@^]*>/;
	var re1 = /a/g;
	var re2 = /a/g;

	// "new" should create a new object, old webkit bug
	var CORRECT_NEW = new NativeRegExp(re1) !== re1;

	var MISSED_STICKY$1 = stickyHelpers.MISSED_STICKY;
	var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y;

	var BASE_FORCED = DESCRIPTORS$2 &&
	  (!CORRECT_NEW || MISSED_STICKY$1 || UNSUPPORTED_DOT_ALL$1 || UNSUPPORTED_NCG || fails(function () {
	    re2[MATCH] = false;
	    // RegExp constructor can alter flags and IsRegExp works correct with @@match
	    return NativeRegExp(re1) != re1 || NativeRegExp(re2) == re2 || NativeRegExp(re1, 'i') != '/a/i';
	  }));

	var handleDotAll = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var brackets = false;
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt(string, index);
	    if (chr === '\\') {
	      result += chr + charAt(string, ++index);
	      continue;
	    }
	    if (!brackets && chr === '.') {
	      result += '[\\s\\S]';
	    } else {
	      if (chr === '[') {
	        brackets = true;
	      } else if (chr === ']') {
	        brackets = false;
	      } result += chr;
	    }
	  } return result;
	};

	var handleNCG = function (string) {
	  var length = string.length;
	  var index = 0;
	  var result = '';
	  var named = [];
	  var names = {};
	  var brackets = false;
	  var ncg = false;
	  var groupid = 0;
	  var groupname = '';
	  var chr;
	  for (; index <= length; index++) {
	    chr = charAt(string, index);
	    if (chr === '\\') {
	      chr = chr + charAt(string, ++index);
	    } else if (chr === ']') {
	      brackets = false;
	    } else if (!brackets) switch (true) {
	      case chr === '[':
	        brackets = true;
	        break;
	      case chr === '(':
	        if (exec(IS_NCG, stringSlice(string, index + 1))) {
	          index += 2;
	          ncg = true;
	        }
	        result += chr;
	        groupid++;
	        continue;
	      case chr === '>' && ncg:
	        if (groupname === '' || hasOwn(names, groupname)) {
	          throw new SyntaxError('Invalid capture group name');
	        }
	        names[groupname] = true;
	        named[named.length] = [groupname, groupid];
	        ncg = false;
	        groupname = '';
	        continue;
	    }
	    if (ncg) groupname += chr;
	    else result += chr;
	  } return [result, named];
	};

	// `RegExp` constructor
	// https://tc39.es/ecma262/#sec-regexp-constructor
	if (isForced('RegExp', BASE_FORCED)) {
	  var RegExpWrapper = function RegExp(pattern, flags) {
	    var thisIsRegExp = isPrototypeOf(RegExpPrototype$2, this);
	    var patternIsRegExp = isRegExp(pattern);
	    var flagsAreUndefined = flags === undefined;
	    var groups = [];
	    var rawPattern = pattern;
	    var rawFlags, dotAll, sticky, handled, result, state;

	    if (!thisIsRegExp && patternIsRegExp && flagsAreUndefined && pattern.constructor === RegExpWrapper) {
	      return pattern;
	    }

	    if (patternIsRegExp || isPrototypeOf(RegExpPrototype$2, pattern)) {
	      pattern = pattern.source;
	      if (flagsAreUndefined) flags = getRegExpFlags(rawPattern);
	    }

	    pattern = pattern === undefined ? '' : toString$1(pattern);
	    flags = flags === undefined ? '' : toString$1(flags);
	    rawPattern = pattern;

	    if (UNSUPPORTED_DOT_ALL$1 && 'dotAll' in re1) {
	      dotAll = !!flags && stringIndexOf(flags, 's') > -1;
	      if (dotAll) flags = replace(flags, /s/g, '');
	    }

	    rawFlags = flags;

	    if (MISSED_STICKY$1 && 'sticky' in re1) {
	      sticky = !!flags && stringIndexOf(flags, 'y') > -1;
	      if (sticky && UNSUPPORTED_Y) flags = replace(flags, /y/g, '');
	    }

	    if (UNSUPPORTED_NCG) {
	      handled = handleNCG(pattern);
	      pattern = handled[0];
	      groups = handled[1];
	    }

	    result = inheritIfRequired(NativeRegExp(pattern, flags), thisIsRegExp ? this : RegExpPrototype$2, RegExpWrapper);

	    if (dotAll || sticky || groups.length) {
	      state = enforceInternalState(result);
	      if (dotAll) {
	        state.dotAll = true;
	        state.raw = RegExpWrapper(handleDotAll(pattern), rawFlags);
	      }
	      if (sticky) state.sticky = true;
	      if (groups.length) state.groups = groups;
	    }

	    if (pattern !== rawPattern) try {
	      // fails in old engines, but we have no alternatives for unsupported regex syntax
	      createNonEnumerableProperty(result, 'source', rawPattern === '' ? '(?:)' : rawPattern);
	    } catch (error) { /* empty */ }

	    return result;
	  };

	  for (var keys = getOwnPropertyNames(NativeRegExp), index = 0; keys.length > index;) {
	    proxyAccessor(RegExpWrapper, NativeRegExp, keys[index++]);
	  }

	  RegExpPrototype$2.constructor = RegExpWrapper;
	  RegExpWrapper.prototype = RegExpPrototype$2;
	  defineBuiltIn(global$1, 'RegExp', RegExpWrapper, { constructor: true });
	}

	// https://tc39.es/ecma262/#sec-get-regexp-@@species
	setSpecies('RegExp');

	var DESCRIPTORS$1 = descriptors;
	var UNSUPPORTED_DOT_ALL = regexpUnsupportedDotAll;
	var classof$1 = classofRaw$2;
	var defineBuiltInAccessor$1 = defineBuiltInAccessor$3;
	var getInternalState$1 = internalState.get;

	var RegExpPrototype$1 = RegExp.prototype;
	var $TypeError$1 = TypeError;

	// `RegExp.prototype.dotAll` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.dotall
	if (DESCRIPTORS$1 && UNSUPPORTED_DOT_ALL) {
	  defineBuiltInAccessor$1(RegExpPrototype$1, 'dotAll', {
	    configurable: true,
	    get: function dotAll() {
	      if (this === RegExpPrototype$1) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (classof$1(this) === 'RegExp') {
	        return !!getInternalState$1(this).dotAll;
	      }
	      throw $TypeError$1('Incompatible receiver, RegExp required');
	    }
	  });
	}

	var DESCRIPTORS = descriptors;
	var MISSED_STICKY = regexpStickyHelpers.MISSED_STICKY;
	var classof = classofRaw$2;
	var defineBuiltInAccessor = defineBuiltInAccessor$3;
	var getInternalState = internalState.get;

	var RegExpPrototype = RegExp.prototype;
	var $TypeError = TypeError;

	// `RegExp.prototype.sticky` getter
	// https://tc39.es/ecma262/#sec-get-regexp.prototype.sticky
	if (DESCRIPTORS && MISSED_STICKY) {
	  defineBuiltInAccessor(RegExpPrototype, 'sticky', {
	    configurable: true,
	    get: function sticky() {
	      if (this === RegExpPrototype) return undefined;
	      // We can't use InternalStateModule.getterFor because
	      // we don't add metadata for regexps created by a literal.
	      if (classof(this) === 'RegExp') {
	        return !!getInternalState(this).sticky;
	      }
	      throw $TypeError('Incompatible receiver, RegExp required');
	    }
	  });
	}

	var $$1 = _export;
	var anObject$1 = anObject$r;
	var objectGetPrototypeOf = objectGetPrototypeOf$1;
	var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

	// `Reflect.getPrototypeOf` method
	// https://tc39.es/ecma262/#sec-reflect.getprototypeof
	$$1({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
	  getPrototypeOf: function getPrototypeOf(target) {
	    return objectGetPrototypeOf(anObject$1(target));
	  }
	});

	// `SameValue` abstract operation
	// https://tc39.es/ecma262/#sec-samevalue
	// eslint-disable-next-line es/no-object-is -- safe
	var sameValue$1 = Object.is || function is(x, y) {
	  // eslint-disable-next-line no-self-compare -- NaN check
	  return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
	};

	var call = functionCall;
	var fixRegExpWellKnownSymbolLogic = fixRegexpWellKnownSymbolLogic;
	var anObject = anObject$r;
	var isNullOrUndefined = isNullOrUndefined$b;
	var requireObjectCoercible = requireObjectCoercible$d;
	var sameValue = sameValue$1;
	var toString = toString$k;
	var getMethod = getMethod$7;
	var regExpExec = regexpExecAbstract;

	// @@search logic
	fixRegExpWellKnownSymbolLogic('search', function (SEARCH, nativeSearch, maybeCallNative) {
	  return [
	    // `String.prototype.search` method
	    // https://tc39.es/ecma262/#sec-string.prototype.search
	    function search(regexp) {
	      var O = requireObjectCoercible(this);
	      var searcher = isNullOrUndefined(regexp) ? undefined : getMethod(regexp, SEARCH);
	      return searcher ? call(searcher, regexp, O) : new RegExp(regexp)[SEARCH](toString(O));
	    },
	    // `RegExp.prototype[@@search]` method
	    // https://tc39.es/ecma262/#sec-regexp.prototype-@@search
	    function (string) {
	      var rx = anObject(this);
	      var S = toString(string);
	      var res = maybeCallNative(nativeSearch, rx, S);

	      if (res.done) return res.value;

	      var previousLastIndex = rx.lastIndex;
	      if (!sameValue(previousLastIndex, 0)) rx.lastIndex = 0;
	      var result = regExpExec(rx, S);
	      if (!sameValue(rx.lastIndex, previousLastIndex)) rx.lastIndex = previousLastIndex;
	      return result === null ? -1 : result.index;
	    }
	  ];
	});

	var $ = _export;
	var sign = mathSign;

	// `Math.sign` method
	// https://tc39.es/ecma262/#sec-math.sign
	$({ target: 'Math', stat: true }, {
	  sign: sign
	});

	/*!
	 * SJS 6.13.0
	 */

	!function(){function e(e,t){return (t||"")+" (SystemJS https://github.com/systemjs/systemjs/blob/main/docs/errors.md#"+e+")"}function t(e,t){if(-1!==e.indexOf("\\")&&(e=e.replace(S,"/")),"/"===e[0]&&"/"===e[1])return t.slice(0,t.indexOf(":")+1)+e;if("."===e[0]&&("/"===e[1]||"."===e[1]&&("/"===e[2]||2===e.length&&(e+="/"))||1===e.length&&(e+="/"))||"/"===e[0]){var r,n=t.slice(0,t.indexOf(":")+1);if(r="/"===t[n.length+1]?"file:"!==n?(r=t.slice(n.length+2)).slice(r.indexOf("/")+1):t.slice(8):t.slice(n.length+("/"===t[n.length])),"/"===e[0])return t.slice(0,t.length-r.length-1)+e;for(var i=r.slice(0,r.lastIndexOf("/")+1)+e,o=[],s=-1,c=0;c<i.length;c++)-1!==s?"/"===i[c]&&(o.push(i.slice(s,c+1)),s=-1):"."===i[c]?"."!==i[c+1]||"/"!==i[c+2]&&c+2!==i.length?"/"===i[c+1]||c+1===i.length?c+=1:s=c:(o.pop(),c+=2):s=c;return -1!==s&&o.push(i.slice(s)),t.slice(0,t.length-r.length)+o.join("")}}function r(e,r){return t(e,r)||(-1!==e.indexOf(":")?e:t("./"+e,r))}function n(e,r,n,i,o){for(var s in e){var f=t(s,n)||s,a=e[s];if("string"==typeof a){var l=u(i,t(a,n)||a,o);l?r[f]=l:c("W1",s,a);}}}function i(e,t,i){var o;for(o in e.imports&&n(e.imports,i.imports,t,i,null),e.scopes||{}){var s=r(o,t);n(e.scopes[o],i.scopes[s]||(i.scopes[s]={}),t,i,s);}for(o in e.depcache||{})i.depcache[r(o,t)]=e.depcache[o];for(o in e.integrity||{})i.integrity[r(o,t)]=e.integrity[o];}function o(e,t){if(t[e])return e;var r=e.length;do{var n=e.slice(0,r+1);if(n in t)return n}while(-1!==(r=e.lastIndexOf("/",r-1)))}function s(e,t){var r=o(e,t);if(r){var n=t[r];if(null===n)return;if(!(e.length>r.length&&"/"!==n[n.length-1]))return n+e.slice(r.length);c("W2",r,n);}}function c(t,r,n){console.warn(e(t,[n,r].join(", ")));}function u(e,t,r){for(var n=e.scopes,i=r&&o(r,n);i;){var c=s(t,n[i]);if(c)return c;i=o(i.slice(0,i.lastIndexOf("/")),n);}return s(t,e.imports)||-1!==t.indexOf(":")&&t}function f(){this[b]={};}function a(t,r,n){var i=t[b][r];if(i)return i;var o=[],s=Object.create(null);j&&Object.defineProperty(s,j,{value:"Module"});var c=Promise.resolve().then((function(){return t.instantiate(r,n)})).then((function(n){if(!n)throw Error(e(2,r));var c=n[1]((function(e,t){i.h=!0;var r=!1;if("string"==typeof e)e in s&&s[e]===t||(s[e]=t,r=!0);else {for(var n in e)t=e[n],n in s&&s[n]===t||(s[n]=t,r=!0);e&&e.__esModule&&(s.__esModule=e.__esModule);}if(r)for(var c=0;c<o.length;c++){var u=o[c];u&&u(s);}return t}),2===n[1].length?{import:function(e){return t.import(e,r)},meta:t.createContext(r)}:void 0);return i.e=c.execute||function(){},[n[0],c.setters||[]]}),(function(e){throw i.e=null,i.er=e,e})),u=c.then((function(e){return Promise.all(e[0].map((function(n,i){var o=e[1][i];return Promise.resolve(t.resolve(n,r)).then((function(e){var n=a(t,e,r);return Promise.resolve(n.I).then((function(){return o&&(n.i.push(o),!n.h&&n.I||o(n.n)),n}))}))}))).then((function(e){i.d=e;}))}));return i=t[b][r]={id:r,i:o,n:s,I:c,L:u,h:!1,d:void 0,e:void 0,er:void 0,E:void 0,C:void 0,p:void 0}}function l(e,t,r,n){if(!n[t.id])return n[t.id]=!0,Promise.resolve(t.L).then((function(){return t.p&&null!==t.p.e||(t.p=r),Promise.all(t.d.map((function(t){return l(e,t,r,n)})))})).catch((function(e){if(t.er)throw e;throw t.e=null,e}))}function h(e,t){return t.C=l(e,t,t,{}).then((function(){return d(e,t,{})})).then((function(){return t.n}))}function d(e,t,r){function n(){try{var e=o.call(I);if(e)return e=e.then((function(){t.C=t.n,t.E=null;}),(function(e){throw t.er=e,t.E=null,e})),t.E=e;t.C=t.n,t.L=t.I=void 0;}catch(r){throw t.er=r,r}}if(!r[t.id]){if(r[t.id]=!0,!t.e){if(t.er)throw t.er;return t.E?t.E:void 0}var i,o=t.e;return t.e=null,t.d.forEach((function(n){try{var o=d(e,n,r);o&&(i=i||[]).push(o);}catch(s){throw t.er=s,s}})),i?Promise.all(i).then(n):n()}}function v(){[].forEach.call(document.querySelectorAll("script"),(function(t){if(!t.sp)if("systemjs-module"===t.type){if(t.sp=!0,!t.src)return;System.import("import:"===t.src.slice(0,7)?t.src.slice(7):r(t.src,p)).catch((function(e){if(e.message.indexOf("https://github.com/systemjs/systemjs/blob/main/docs/errors.md#3")>-1){var r=document.createEvent("Event");r.initEvent("error",!1,!1),t.dispatchEvent(r);}return Promise.reject(e)}));}else if("systemjs-importmap"===t.type){t.sp=!0;var n=t.src?(System.fetch||fetch)(t.src,{integrity:t.integrity,passThrough:!0}).then((function(e){if(!e.ok)throw Error(e.status);return e.text()})).catch((function(r){return r.message=e("W4",t.src)+"\n"+r.message,console.warn(r),"function"==typeof t.onerror&&t.onerror(),"{}"})):t.innerHTML;M=M.then((function(){return n})).then((function(r){!function(t,r,n){var o={};try{o=JSON.parse(r);}catch(s){console.warn(Error(e("W5")));}i(o,n,t);}(R,r,t.src||p);}));}}));}var p,m="undefined"!=typeof Symbol,g="undefined"!=typeof self,y="undefined"!=typeof document,E=g?self:commonjsGlobal;if(y){var w=document.querySelector("base[href]");w&&(p=w.href);}if(!p&&"undefined"!=typeof location){var x=(p=location.href.split("#")[0].split("?")[0]).lastIndexOf("/");-1!==x&&(p=p.slice(0,x+1));}var O,S=/\\/g,j=m&&Symbol.toStringTag,b=m?Symbol():"@",P=f.prototype;P.import=function(e,t){var r=this;return Promise.resolve(r.prepareImport()).then((function(){return r.resolve(e,t)})).then((function(e){var t=a(r,e);return t.C||h(r,t)}))},P.createContext=function(e){var t=this;return {url:e,resolve:function(r,n){return Promise.resolve(t.resolve(r,n||e))}}},P.register=function(e,t){O=[e,t];},P.getRegister=function(){var e=O;return O=void 0,e};var I=Object.freeze(Object.create(null));E.System=new f;var L,C,M=Promise.resolve(),R={imports:{},scopes:{},depcache:{},integrity:{}},T=y;if(P.prepareImport=function(e){return (T||e)&&(v(),T=!1),M},y&&(v(),window.addEventListener("DOMContentLoaded",v)),P.addImportMap=function(e,t){i(e,t||p,R);},y){window.addEventListener("error",(function(e){W=e.filename,q=e.error;}));var _=location.origin;}P.createScript=function(e){var t=document.createElement("script");t.async=!0,e.indexOf(_+"/")&&(t.crossOrigin="anonymous");var r=R.integrity[e];return r&&(t.integrity=r),t.src=e,t};var W,q,k={},A=P.register;P.register=function(e,t){if(y&&"loading"===document.readyState&&"string"!=typeof e){var r=document.querySelectorAll("script[src]"),n=r[r.length-1];if(n){L=e;var i=this;C=setTimeout((function(){k[n.src]=[e,t],i.import(n.src);}));}}else L=void 0;return A.call(this,e,t)},P.instantiate=function(t,r){var n=k[t];if(n)return delete k[t],n;var i=this;return Promise.resolve(P.createScript(t)).then((function(n){return new Promise((function(o,s){n.addEventListener("error",(function(){s(Error(e(3,[t,r].join(", "))));})),n.addEventListener("load",(function(){if(document.head.removeChild(n),W===t)s(q);else {var e=i.getRegister(t);e&&e[0]===L&&clearTimeout(C),o(e);}})),document.head.appendChild(n);}))}))},P.shouldFetch=function(){return !1},"undefined"!=typeof fetch&&(P.fetch=fetch);var F=P.instantiate,J=/^(text|application)\/(x-)?javascript(;|$)/;P.instantiate=function(t,r){var n=this;return this.shouldFetch(t)?this.fetch(t,{credentials:"same-origin",integrity:R.integrity[t]}).then((function(i){if(!i.ok)throw Error(e(7,[i.status,i.statusText,t,r].join(", ")));var o=i.headers.get("content-type");if(!o||!J.test(o))throw Error(e(4,o));return i.text().then((function(e){return e.indexOf("//# sourceURL=")<0&&(e+="\n//# sourceURL="+t),(0, eval)(e),n.getRegister(t)}))})):F.apply(this,arguments)},P.resolve=function(r,n){return u(R,t(r,n=n||p)||r,n)||function(t,r){throw Error(e(8,[t,r].join(", ")))}(r,n)};var U=P.instantiate;P.instantiate=function(e,t){var r=R.depcache[e];if(r)for(var n=0;n<r.length;n++)a(this,this.resolve(r[n],e),e);return U.call(this,e,t)},g&&"function"==typeof importScripts&&(P.instantiate=function(e){var t=this;return Promise.resolve().then((function(){return importScripts(e),t.getRegister(e)}))});}();

})();
