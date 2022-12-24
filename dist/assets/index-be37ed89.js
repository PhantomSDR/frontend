function __vite_legacy_guard() {
  import("data:text/javascript,");
}
;
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const app = "";
function noop() {
}
function assign$2(tar, src2) {
  for (const k in src2)
    tar[k] = src2[k];
  return tar;
}
function run$1(fn2) {
  return fn2();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run$1);
}
function is_function(thing) {
  return typeof thing === "function";
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || (a && typeof a === "object" || typeof a === "function");
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn2) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn2);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn2) {
  return definition[1] && fn2 ? assign$2($$scope.ctx.slice(), definition[1](fn2(ctx))) : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn2) {
  if (definition[2] && fn2) {
    const lets = definition[2](fn2(dirty));
    if ($$scope.dirty === void 0) {
      return lets;
    }
    if (typeof lets === "object") {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
  if (slot_changes) {
    const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function destroy_each(iterations, detaching) {
  for (let i = 0; i < iterations.length; i += 1) {
    if (iterations[i])
      iterations[i].d(detaching);
  }
}
function element(name) {
  return document.createElement(name);
}
function svg_element(name) {
  return document.createElementNS("http://www.w3.org/2000/svg", name);
}
function text(data2) {
  return document.createTextNode(data2);
}
function space() {
  return text(" ");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function self$1(fn2) {
  return function(event) {
    if (event.target === this)
      fn2.call(this, event);
  };
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function to_number(value) {
  return value === "" ? null : +value;
}
function children(element2) {
  return Array.from(element2.childNodes);
}
function set_data(text2, data2) {
  data2 = "" + data2;
  if (text2.wholeText !== data2)
    text2.data = data2;
}
function set_input_value(input, value) {
  input.value = value == null ? "" : value;
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? "important" : "");
  }
}
function select_option(select, value) {
  for (let i = 0; i < select.options.length; i += 1) {
    const option = select.options[i];
    if (option.__value === value) {
      option.selected = true;
      return;
    }
  }
  select.selectedIndex = -1;
}
function select_value(select) {
  const selected_option = select.querySelector(":checked") || select.options[0];
  return selected_option && selected_option.__value;
}
let crossorigin;
function is_crossorigin() {
  if (crossorigin === void 0) {
    crossorigin = false;
    try {
      if (typeof window !== "undefined" && window.parent) {
        void window.parent.document;
      }
    } catch (error) {
      crossorigin = true;
    }
  }
  return crossorigin;
}
function add_resize_listener(node, fn2) {
  const computed_style = getComputedStyle(node);
  if (computed_style.position === "static") {
    node.style.position = "relative";
  }
  const iframe = element("iframe");
  iframe.setAttribute("style", "display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  const crossorigin2 = is_crossorigin();
  let unsubscribe;
  if (crossorigin2) {
    iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}<\/script>";
    unsubscribe = listen(window, "message", (event) => {
      if (event.source === iframe.contentWindow)
        fn2();
    });
  } else {
    iframe.src = "about:blank";
    iframe.onload = () => {
      unsubscribe = listen(iframe.contentWindow, "resize", fn2);
    };
  }
  append(node, iframe);
  return () => {
    if (crossorigin2) {
      unsubscribe();
    } else if (unsubscribe && iframe.contentWindow) {
      unsubscribe();
    }
    detach(iframe);
  };
}
function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
  const e = document.createEvent("CustomEvent");
  e.initCustomEvent(type, bubbles, cancelable, detail);
  return e;
}
let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function beforeUpdate(fn2) {
  get_current_component().$$.before_update.push(fn2);
}
function onMount(fn2) {
  get_current_component().$$.on_mount.push(fn2);
}
function afterUpdate(fn2) {
  get_current_component().$$.after_update.push(fn2);
}
function onDestroy(fn2) {
  get_current_component().$$.on_destroy.push(fn2);
}
function createEventDispatcher() {
  const component = get_current_component();
  return (type, detail, { cancelable = false } = {}) => {
    const callbacks = component.$$.callbacks[type];
    if (callbacks) {
      const event = custom_event(type, detail, { cancelable });
      callbacks.slice().forEach((fn2) => {
        fn2.call(component, event);
      });
      return !event.defaultPrevented;
    }
    return true;
  };
}
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    callbacks.slice().forEach((fn2) => fn2.call(this, event));
  }
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn2) {
  render_callbacks.push(fn2);
}
function add_flush_callback(fn2) {
  flush_callbacks.push(fn2);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = /* @__PURE__ */ new Set();
let outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
const globals = typeof window !== "undefined" ? window : typeof globalThis !== "undefined" ? globalThis : global;
function destroy_block(block, lookup) {
  block.d(1);
  lookup.delete(block.key);
}
function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block2, next, get_context) {
  let o = old_blocks.length;
  let n = list.length;
  let i = o;
  const old_indexes = {};
  while (i--)
    old_indexes[old_blocks[i].key] = i;
  const new_blocks = [];
  const new_lookup = /* @__PURE__ */ new Map();
  const deltas = /* @__PURE__ */ new Map();
  i = n;
  while (i--) {
    const child_ctx = get_context(ctx, list, i);
    const key = get_key(child_ctx);
    let block = lookup.get(key);
    if (!block) {
      block = create_each_block2(key, child_ctx);
      block.c();
    } else if (dynamic) {
      block.p(child_ctx, dirty);
    }
    new_lookup.set(key, new_blocks[i] = block);
    if (key in old_indexes)
      deltas.set(key, Math.abs(i - old_indexes[key]));
  }
  const will_move = /* @__PURE__ */ new Set();
  const did_move = /* @__PURE__ */ new Set();
  function insert2(block) {
    transition_in(block, 1);
    block.m(node, next);
    lookup.set(block.key, block);
    next = block.first;
    n--;
  }
  while (o && n) {
    const new_block = new_blocks[n - 1];
    const old_block = old_blocks[o - 1];
    const new_key = new_block.key;
    const old_key = old_block.key;
    if (new_block === old_block) {
      next = new_block.first;
      o--;
      n--;
    } else if (!new_lookup.has(old_key)) {
      destroy(old_block, lookup);
      o--;
    } else if (!lookup.has(new_key) || will_move.has(new_key)) {
      insert2(new_block);
    } else if (did_move.has(old_key)) {
      o--;
    } else if (deltas.get(new_key) > deltas.get(old_key)) {
      did_move.add(new_key);
      insert2(new_block);
    } else {
      will_move.add(old_key);
      o--;
    }
  }
  while (o--) {
    const old_block = old_blocks[o];
    if (!new_lookup.has(old_block.key))
      destroy(old_block, lookup);
  }
  while (n)
    insert2(new_blocks[n - 1]);
  return new_blocks;
}
function bind$4(component, name, callback, value) {
  const index = component.$$.props[name];
  if (index !== void 0) {
    component.$$.bound[index] = callback;
    if (value === void 0) {
      callback(component.$$.ctx[index]);
    }
  }
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run$1).filter(is_function);
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}
function init$1(component, options, instance2, create_fragment2, not_equal, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: [],
    props,
    update: noop,
    not_equal,
    bound: blank_object(),
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if (!$$.skip_bound && $$.bound[i])
        $$.bound[i](value);
      if (ready)
        make_dirty(component, i);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      $$.fragment && $$.fragment.c();
    }
    if (options.intro)
      transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
var toggleSelection = function() {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function() {
    };
  }
  var active = document.activeElement;
  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }
  switch (active.tagName.toUpperCase()) {
    case "INPUT":
    case "TEXTAREA":
      active.blur();
      break;
    default:
      active = null;
      break;
  }
  selection.removeAllRanges();
  return function() {
    selection.type === "Caret" && selection.removeAllRanges();
    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }
    active && active.focus();
  };
};
var deselectCurrent = toggleSelection;
var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
};
var defaultMessage = "Copy to clipboard: #{key}, Enter";
function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}
function copy(text2, options) {
  var debug, message, reselectPrevious, range, selection, mark, success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();
    range = document.createRange();
    selection = document.getSelection();
    mark = document.createElement("span");
    mark.textContent = text2;
    mark.ariaHidden = "true";
    mark.style.all = "unset";
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    mark.style.whiteSpace = "pre";
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function(e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") {
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format2 = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
          window.clipboardData.setData(format2, text2);
        } else {
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text2);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });
    document.body.appendChild(mark);
    range.selectNodeContents(mark);
    selection.addRange(range);
    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err2) {
    debug && console.error("unable to copy using execCommand: ", err2);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text2);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err3) {
      debug && console.error("unable to copy using clipboardData: ", err3);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text2);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }
    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }
  return success;
}
var copyToClipboard = copy;
var efficientRollingStats = {};
(function(exports) {
  function RollingMin(WindowSize) {
    var DequeIndex = [], DequeValue = [], CurrentIndex = 0, T = WindowSize;
    function atEveryStepDo(CurrentValue) {
      if (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        DequeValue.shift();
      }
      while (DequeValue.length !== 0 && DequeValue[DequeValue.length - 1] > CurrentValue) {
        DequeIndex.pop();
        DequeValue.pop();
      }
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      CurrentIndex++;
      return DequeValue[0];
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
      CurrentIndex = 0;
    };
    return atEveryStepDo;
  }
  function RollingMax(WindowSize) {
    var DequeIndex = [], DequeValue = [], CurrentIndex = 0, T = WindowSize;
    function atEveryStepDo(CurrentValue) {
      if (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        DequeValue.shift();
      }
      while (DequeValue.length !== 0 && DequeValue[DequeValue.length - 1] < CurrentValue) {
        DequeIndex.pop();
        DequeValue.pop();
      }
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      CurrentIndex++;
      return DequeValue[0];
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
      CurrentIndex = 0;
    };
    return atEveryStepDo;
  }
  function RollingAvg(WindowSize) {
    var DequeValue = [], T = WindowSize, Sum2 = 0, prev2;
    function atEveryStepDo(CurrentValue) {
      if (DequeValue.length >= T) {
        Sum2 -= DequeValue.shift();
      }
      if (CurrentValue || CurrentValue === 0) {
        DequeValue.push(CurrentValue);
        Sum2 += CurrentValue;
      } else
        return prev2;
      return prev2 = DequeValue.length == 0 ? 0 : Sum2 / DequeValue.length;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      Sum2 = 0;
      DequeValue.splice(0, DequeValue.length);
    };
    return atEveryStepDo;
  }
  function RollingMinIndex(WindowSize) {
    var DequeIndex = [], DequeValue = [], T = WindowSize;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        DequeValue.shift();
      }
      while (DequeValue.length !== 0 && DequeValue[DequeValue.length - 1] > CurrentValue) {
        DequeIndex.pop();
        DequeValue.pop();
      }
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      return DequeValue[0];
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
    };
    return atEveryStepDo;
  }
  function RollingMaxIndex(WindowSize) {
    var DequeIndex = [], DequeValue = [], T = WindowSize;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        DequeValue.shift();
      }
      while (DequeValue.length !== 0 && DequeValue[DequeValue.length - 1] < CurrentValue) {
        DequeIndex.pop();
        DequeValue.pop();
      }
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      return DequeValue[0];
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
    };
    return atEveryStepDo;
  }
  function RollingAvgIndex(WindowSize) {
    var DequeIndex = [], DequeValue = [], T = WindowSize, Sum2 = 0;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        Sum2 -= DequeValue.shift();
      }
      if (CurrentValue || CurrentValue === 0) {
        DequeIndex.push(CurrentIndex);
        DequeValue.push(CurrentValue);
        Sum2 += CurrentValue;
      } else
        return prev;
      return prev = DequeValue.length == 0 ? 0 : Sum2 / DequeValue.length;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
      Sum2 = 0;
    };
    return atEveryStepDo;
  }
  function sortedIndex(array, value) {
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (array[mid] < value)
        low = mid + 1;
      else
        high = mid;
    }
    return low;
  }
  function RollingMedian(WindowSize) {
    var DequeValue = [], T = WindowSize, SortedValues = [], LsortedIndex = sortedIndex;
    var prevmedian, findcenter = null, Sum2 = 0, Sum22 = 0, Sum3 = 0, Sum4 = 0, findmoments = null;
    function atEveryStepDo(CurrentValue) {
      if (DequeValue.length >= T) {
        var value = DequeValue.shift();
        var v = value, vv = v * v, vvv = vv * v, vvvv = vvv * v;
        Sum2 -= v;
        Sum22 -= vv;
        Sum3 -= vvv;
        Sum4 -= vvvv;
        var x = LsortedIndex(SortedValues, value);
        if (SortedValues[x] == value)
          SortedValues.splice(x, 1);
      }
      if (CurrentValue || CurrentValue === 0) {
        DequeValue.push(CurrentValue);
        SortedValues.splice(LsortedIndex(SortedValues, CurrentValue), 0, CurrentValue);
        findcenter = null;
        findmoments = null;
        var v = CurrentValue, vv = v * v, vvv = vv * v, vvvv = vvv * v;
        Sum2 += v;
        Sum22 += vv;
        Sum3 += vvv;
        Sum4 += vvvv;
      } else
        return prevmedian;
      if (SortedValues.length == 0)
        return prevmedian;
      if (SortedValues.length & 1)
        return prevmedian = SortedValues[SortedValues.length - 1 >>> 1];
      else {
        var half = (SortedValues.length >>> 1) - 1;
        return prevmedian = (SortedValues[half] + SortedValues[half + 1]) / 2;
      }
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeValue.splice(0, DequeValue.length);
      SortedValues.splice(0, SortedValues.length);
      findcenter = null;
      Sum2 = 0;
      Sum22 = 0;
      Sum3 = 0;
      Sum4 = 0;
      findmoments = null;
    };
    atEveryStepDo.avg = function() {
      return Sum2 / DequeValue.length;
    };
    atEveryStepDo.sum = function() {
      return Sum2;
    };
    atEveryStepDo.min = function() {
      return SortedValues[0];
    };
    atEveryStepDo.q1 = function() {
      if (SortedValues.length == 1)
        return SortedValues[0];
      if (SortedValues.length == 2)
        return SortedValues[0] * 0.75 + SortedValues[1] * 0.25;
      if (SortedValues.length == 3)
        return SortedValues[0] * 0.5 + SortedValues[1] * 0.5;
      if ((SortedValues.length - 1) % 4 == 0) {
        var n = SortedValues.length - 1 >> 2;
        return SortedValues[n - 1] * 0.25 + SortedValues[n] * 0.75;
      }
      if ((SortedValues.length - 3) % 4 == 0) {
        var n = SortedValues.length - 3 >> 2;
        return SortedValues[n] * 0.75 + SortedValues[n + 1] * 0.25;
      }
    };
    atEveryStepDo.moments_avg = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.average;
    };
    atEveryStepDo.variance = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.variance;
    };
    atEveryStepDo.standardDeviation = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.standardDeviation;
    };
    atEveryStepDo.skew = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.skew;
    };
    atEveryStepDo.kurtosis = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.kurtosis;
    };
    atEveryStepDo.exkurtosis = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.exkurtosis;
    };
    atEveryStepDo.moments = function() {
      var o = {};
      if (this.c > 0) {
        var c = DequeValue.length, ex = Sum2 / c, exx = Sum22 / c, exxx = Sum3 / c, exxxx = Sum4 / c, m1 = ex, m2 = Sum22 / c - ex;
        m3 = exxx - 3 * exx * ex + 2 * ex * ex * ex;
        m4 = exxxx - 3 * exxx * ex + 6 * exx * ex * ex - -3 * ex * ex * ex * ex;
        o.average = m1;
        o.variance = m2;
        o.standardDeviation = Math.pow(o.variance, 0.5);
        if (c > 2) {
          o.skew = Math.pow(c * (c - 1), 0.5) / (c - 2) * m3 / Math.pow(m2, 1.5);
        }
        if (m2 > 0) {
          o.exkurtosis = m4 / m2 / m2 - 3;
          o.kurtosis = m4 / m2 / m2;
        }
      }
      return o;
    };
    atEveryStepDo.median = function() {
      return prevmedian;
    };
    atEveryStepDo.q3 = function() {
      if (SortedValues.length == 1)
        return SortedValues[0];
      if (SortedValues.length == 2)
        return SortedValues[0] * 0.25 + SortedValues[1] * 0.75;
      if (SortedValues.length == 3)
        return SortedValues[1] * 0.5 + SortedValues[2] * 0.5;
      if ((SortedValues.length - 1) % 4 == 0) {
        var n3 = (SortedValues.length - 1 >> 2) * 3;
        return SortedValues[n3] * 0.75 + SortedValues[n3 + 1] * 0.25;
      }
      if ((SortedValues.length - 3) % 4 == 0) {
        var n3 = (SortedValues.length - 3 >> 2) * 3;
        return SortedValues[n3 + 1] * 0.25 + SortedValues[n3 + 2] * 0.75;
      }
    };
    atEveryStepDo.max = function() {
      return SortedValues[SortedValues.length - 1];
    };
    atEveryStepDo.center = function() {
      return (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2;
    };
    atEveryStepDo.medianskew = function() {
      return SortedValues[SortedValues.length - 1] - prevmedian - (prevmedian - SortedValues[0]);
    };
    atEveryStepDo.medianskew_bowleys_coef = function() {
      return (SortedValues[SortedValues.length - 1] - prevmedian) * (prevmedian - SortedValues[0]) / (SortedValues[SortedValues.length - 1] - SortedValues[0]);
    };
    atEveryStepDo.mediankurt = function() {
      var p90 = Math.round((SortedValues.length - 1) * 0.9);
      var p10 = Math.round((SortedValues.length - 1) * 0.1);
      return (SortedValues[SortedValues.length - 1] - prevmedian) * (prevmedian - SortedValues[0]) / (SortedValues[p90] - SortedValues[p10]);
    };
    atEveryStepDo.pabovecenter = function() {
      if (findcenter === null)
        findcenter = LsortedIndex(SortedValues, (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2);
      return (SortedValues.length - 1 - findcenter) / (SortedValues.length - 1);
    };
    atEveryStepDo.pbelowcenter = function() {
      if (findcenter === null)
        findcenter = LsortedIndex(SortedValues, (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2);
      return findcenter / (SortedValues.length - 1);
    };
    return atEveryStepDo;
  }
  function RollingMedianIndex(WindowSize) {
    var DequeValue = [], DequeIndex = [], T = WindowSize, SortedValues = [], LsortedIndex = sortedIndex;
    var prevmedian, findcenter = null, Sum2 = 0, Sum22 = 0, Sum3 = 0, Sum4 = 0, findmoments = null;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        var value = DequeValue.shift();
        var v = value, vv = v * v, vvv = vv * v, vvvv = vvv * v;
        Sum2 -= v;
        Sum22 -= vv;
        Sum3 -= vvv;
        Sum4 -= vvvv;
        var x = LsortedIndex(SortedValues, value);
        if (SortedValues[x] == value)
          SortedValues.splice(x, 1);
      }
      if (CurrentValue || CurrentValue === 0) {
        DequeIndex.push(CurrentIndex);
        DequeValue.push(CurrentValue);
        SortedValues.splice(LsortedIndex(SortedValues, CurrentValue), 0, CurrentValue);
        findcenter = null;
        findmoments = null;
        var v = CurrentValue, vv = v * v, vvv = vv * v, vvvv = vvv * v;
        Sum2 += v;
        Sum22 += vv;
        Sum3 += vvv;
        Sum4 += vvvv;
      } else
        return prevmedian;
      if (SortedValues.length == 0)
        return prevmedian;
      if (SortedValues.length & 1)
        return prevmedian = SortedValues[SortedValues.length - 1 >>> 1];
      else {
        var half = (SortedValues.length >>> 1) - 1;
        return prevmedian = (SortedValues[half] + SortedValues[half + 1]) / 2;
      }
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeValue.splice(0, DequeValue.length);
      DequeIndex.splice(0, DequeIndex.length);
      SortedValues.splice(0, SortedValues.length);
      findcenter = null;
      Sum2 = 0;
      Sum22 = 0;
      Sum3 = 0;
      Sum4 = 0;
      findmoments = null;
    };
    atEveryStepDo.avg = function() {
      return Sum2 / DequeValue.length;
    };
    atEveryStepDo.sum = function() {
      return Sum2;
    };
    atEveryStepDo.min = function() {
      return SortedValues[0];
    };
    atEveryStepDo.q1 = function() {
      if (SortedValues.length == 1)
        return SortedValues[0];
      if (SortedValues.length == 2)
        return SortedValues[0] * 0.75 + SortedValues[1] * 0.25;
      if (SortedValues.length == 3)
        return SortedValues[0] * 0.5 + SortedValues[1] * 0.5;
      if ((SortedValues.length - 1) % 4 == 0) {
        var n = SortedValues.length - 1 >> 2;
        return SortedValues[n - 1] * 0.25 + SortedValues[n] * 0.75;
      }
      if ((SortedValues.length - 3) % 4 == 0) {
        var n = SortedValues.length - 3 >> 2;
        return SortedValues[n] * 0.75 + SortedValues[n + 1] * 0.25;
      }
    };
    atEveryStepDo.moments_avg = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.average;
    };
    atEveryStepDo.variance = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.variance;
    };
    atEveryStepDo.standardDeviation = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.standardDeviation;
    };
    atEveryStepDo.skew = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.skew;
    };
    atEveryStepDo.kurtosis = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.kurtosis;
    };
    atEveryStepDo.exkurtosis = function() {
      if (findmoments === null)
        findmoments = atEveryStepDo.moments();
      return findmoments.exkurtosis;
    };
    atEveryStepDo.moments = function() {
      var o = {};
      if (this.c > 0) {
        var c = DequeValue.length, ex = Sum2 / c, exx = Sum22 / c, exxx = Sum3 / c, exxxx = Sum4 / c, m1 = ex, m2 = Sum22 / c - ex;
        m3 = exxx - 3 * exx * ex + 2 * ex * ex * ex;
        m4 = exxxx - 3 * exxx * ex + 6 * exx * ex * ex - -3 * ex * ex * ex * ex;
        o.average = m1;
        o.variance = m2;
        o.standardDeviation = Math.pow(o.variance, 0.5);
        if (c > 2) {
          o.skew = Math.pow(c * (c - 1), 0.5) / (c - 2) * m3 / Math.pow(m2, 1.5);
        }
        if (m2 > 0) {
          o.exkurtosis = m4 / m2 / m2 - 3;
          o.kurtosis = m4 / m2 / m2;
        }
      }
      return o;
    };
    atEveryStepDo.median = function() {
      return prevmedian;
    };
    atEveryStepDo.q3 = function() {
      if (SortedValues.length == 1)
        return SortedValues[0];
      if (SortedValues.length == 2)
        return SortedValues[0] * 0.25 + SortedValues[1] * 0.75;
      if (SortedValues.length == 3)
        return SortedValues[1] * 0.5 + SortedValues[2] * 0.5;
      if ((SortedValues.length - 1) % 4 == 0) {
        var n3 = (SortedValues.length - 1 >> 2) * 3;
        return SortedValues[n3] * 0.75 + SortedValues[n3 + 1] * 0.25;
      }
      if ((SortedValues.length - 3) % 4 == 0) {
        var n3 = (SortedValues.length - 3 >> 2) * 3;
        return SortedValues[n3 + 1] * 0.25 + SortedValues[n3 + 2] * 0.75;
      }
    };
    atEveryStepDo.max = function() {
      return SortedValues[SortedValues.length - 1];
    };
    atEveryStepDo.center = function() {
      return (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2;
    };
    atEveryStepDo.medianskew = function() {
      return SortedValues[SortedValues.length - 1] - prevmedian - (prevmedian - SortedValues[0]);
    };
    atEveryStepDo.medianskew_bowleys_coef = function() {
      return (SortedValues[SortedValues.length - 1] - prevmedian) * (prevmedian - SortedValues[0]) / (SortedValues[SortedValues.length - 1] - SortedValues[0]);
    };
    atEveryStepDo.mediankurt = function() {
      var p90 = Math.round((SortedValues.length - 1) * 0.9);
      var p10 = Math.round((SortedValues.length - 1) * 0.1);
      return (SortedValues[SortedValues.length - 1] - prevmedian) * (prevmedian - SortedValues[0]) / (SortedValues[p90] - SortedValues[p10]);
    };
    atEveryStepDo.pabovecenter = function() {
      if (findcenter === null)
        findcenter = LsortedIndex(SortedValues, (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2);
      return (SortedValues.length - 1 - findcenter) / (SortedValues.length - 1);
    };
    atEveryStepDo.pbelowcenter = function() {
      if (findcenter === null)
        findcenter = LsortedIndex(SortedValues, (SortedValues[0] + SortedValues[SortedValues.length - 1]) / 2);
      return findcenter / (SortedValues.length - 1);
    };
    return atEveryStepDo;
  }
  function RollingSumPerIndex(WindowSize, UsualIndexSkipBetweenOccations) {
    var DequeIndex = [], DequeValue = [], T = WindowSize, Sum2 = 0, PrevIndex = false, U = UsualIndexSkipBetweenOccations;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T && DequeIndex[0] != CurrentIndex) {
        PrevIndex = DequeIndex.shift();
        Sum2 -= DequeValue.shift();
      }
      if (PrevIndex === false)
        PrevIndex = CurrentIndex - U;
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      Sum2 += CurrentValue;
      var Div = CurrentIndex - PrevIndex;
      if (Div == 0)
        Div = U;
      return Sum2 / Div;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.setUsualIndexSkipBetweenOccations = function(UsualIndexSkipBetweenOccations2) {
      U = UsualIndexSkipBetweenOccations2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
      Sum2 = 0;
      PrevIndex = false;
    };
    return atEveryStepDo;
  }
  function Delay(WindowSize, UndefinedValue) {
    var DequeValue = [], T = WindowSize, U = UndefinedValue;
    function atEveryStepDo(CurrentValue) {
      var ret = U;
      if (DequeValue.length == T) {
        ret = DequeValue.shift();
      }
      DequeValue.push(CurrentValue);
      return ret;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.setUndefinedValue = function(WindowSize2) {
      U = UndefinedValue;
    };
    atEveryStepDo.reset = function(WindowSize2) {
      DequeValue.splice(0, DequeValue.length);
    };
    return atEveryStepDo;
  }
  function HideFirst(WindowSize, UndefinedValue) {
    var DequeValue = 1, T = WindowSize + 1, U = UndefinedValue;
    function atEveryStepDo(CurrentValue) {
      if (DequeValue == T) {
        return CurrentValue;
      }
      DequeValue++;
      return U;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2 + 1;
    };
    atEveryStepDo.setUndefinedValue = function(WindowSize2) {
      U = UndefinedValue;
    };
    atEveryStepDo.reset = function() {
      DequeValue = 0;
    };
    return atEveryStepDo;
  }
  function DelayIndex(WindowSize, UsualIndexSkipBetweenOccations, UndefinedValue) {
    var DequeIndex = [], DequeValue = [], T = WindowSize, PrevValue = UndefinedValue;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      DequeIndex.push(CurrentIndex);
      DequeValue.push(CurrentValue);
      if (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        PrevValue = DequeValue.shift();
        while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
          DequeIndex.shift();
          DequeValue.shift();
        }
      }
      return PrevValue;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.setUsualIndexSkipBetweenOccations = function(UsualIndexSkipBetweenOccations2) {
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequeValue.splice(0, DequeValue.length);
      PrevValue = UndefinedValue;
    };
    return atEveryStepDo;
  }
  function PositiveLately(WindowSize) {
    var PositiveCount = -1;
    function atEveryStepDo(CurrentValue) {
      if (CurrentValue > 0)
        PositiveCount = 0;
      if (PositiveCount >= 0)
        PositiveCount++;
      if (PositiveCount > WindowSize)
        PositiveCount = -1;
      return PositiveCount > 0;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
    };
    atEveryStepDo.reset = function() {
      PositiveCount = -1;
    };
    return atEveryStepDo;
  }
  function PositiveLatelyIndex(WindowSize) {
    var T = WindowSize, PrevIndex = false, PositiveCount = -1;
    function atEveryStepDo(CurrentValue, CurrentIndex) {
      if (CurrentValue > 0) {
        PrevIndex = CurrentIndex;
        PositiveCount = 0;
      }
      if (PositiveCount >= 0)
        PositiveCount++;
      if (PrevIndex != false && PrevIndex <= CurrentIndex - T)
        PositiveCount = -1;
      return PositiveCount > 0;
    }
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      PrevIndex = false;
      PositiveCount = -1;
    };
    return atEveryStepDo;
  }
  function Histogram(PreRoundingMultiplier) {
    var RD = PreRoundingMultiplier, hist = /* @__PURE__ */ new Map();
    function atEveryStepDo(CurrentPosition, CurrentAmount = 1) {
      var CurrentPositionRound = parseFloat((Math.round(CurrentPosition * RD) / RD).toFixed(12));
      if (hist.has(CurrentPositionRound))
        hist.set(CurrentPositionRound, parseFloat((hist.get(CurrentPositionRound) + CurrentAmount).toFixed(12)));
      else
        hist.set(CurrentPositionRound, CurrentAmount);
      return hist;
    }
    atEveryStepDo.hist = hist;
    atEveryStepDo.reset = function() {
      hist.clear();
    };
    return atEveryStepDo;
  }
  function RollingHistogram(WindowSize, PreRoundingMultiplier) {
    var DequePosition = [], DequeAmount = [], T = WindowSize, RD = PreRoundingMultiplier, hist = /* @__PURE__ */ new Map();
    function atEveryStepDo(CurrentPosition, CurrentAmount = 1) {
      if (DequePosition.length >= T) {
        var prevpos = DequePosition.shift();
        var prevamount = DequeAmount.shift();
        var newamount = parseFloat((hist.get(prevpos) - prevamount).toFixed(12));
        if (newamount !== 0)
          hist.set(prevpos, newamount);
        else
          hist.delete(prevpos);
      }
      var CurrentPositionRound = parseFloat((Math.round(CurrentPosition * RD) / RD).toFixed(12));
      DequePosition.push(CurrentPositionRound);
      DequeAmount.push(CurrentAmount);
      if (hist.has(CurrentPositionRound))
        hist.set(CurrentPositionRound, parseFloat((hist.get(CurrentPositionRound) + CurrentAmount).toFixed(12)));
      else
        hist.set(CurrentPositionRound, CurrentAmount);
      return hist;
    }
    atEveryStepDo.hist = hist;
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      Sum = 0;
      DequePosition.splice(0, DequePosition.length);
    };
    return atEveryStepDo;
  }
  function RollingHistogramIndex(WindowSize, PreRoundingMultiplier) {
    var DequeIndex = [], DequePosition = [], DequeAmount = [], T = WindowSize, RD = PreRoundingMultiplier, hist = /* @__PURE__ */ new Map();
    function atEveryStepDo(CurrentPosition, CurrentIndex, CurrentAmount = 1) {
      if (!CurrentAmount && CurrentAmount !== 0 || !CurrentPosition && CurrentPosition !== 0)
        return hist;
      while (DequeIndex.length !== 0 && DequeIndex[0] <= CurrentIndex - T) {
        DequeIndex.shift();
        var prevpos = DequePosition.shift();
        var prevamount = DequeAmount.shift();
        if (!prevpos && prevpos !== 0)
          console.log("nana1", { prevamount, prevpos });
        if (!prevamount && prevamount !== 0)
          console.log("nana2", { prevamount, prevpos });
        if (hist.has(prevpos)) {
          var newamount = parseFloat((hist.get(prevpos) - prevamount).toFixed(12));
          if (!newamount && newamount !== 0)
            console.log("nana3", { newamount, prevamount, prevpos });
          if (newamount !== 0)
            hist.set(prevpos, newamount);
          else
            hist.delete(prevpos);
        }
      }
      var CurrentPositionRound = parseFloat((Math.round(CurrentPosition * RD) / RD).toFixed(12));
      DequePosition.push(CurrentPositionRound);
      DequeAmount.push(CurrentAmount);
      DequeIndex.push(CurrentIndex);
      if (hist.has(CurrentPositionRound)) {
        let newamount2 = parseFloat((hist.get(CurrentPositionRound) + CurrentAmount).toFixed(12));
        hist.set(CurrentPositionRound, newamount2);
      } else
        hist.set(CurrentPositionRound, CurrentAmount);
      return hist;
    }
    atEveryStepDo.hist = hist;
    atEveryStepDo.setWindowSize = function(WindowSize2) {
      T = WindowSize2;
    };
    atEveryStepDo.reset = function() {
      DequeIndex.splice(0, DequeIndex.length);
      DequePosition.splice(0, DequePosition.length);
      Sum = 0;
    };
    return atEveryStepDo;
  }
  var Stats = exports;
  function AllStats(size, delay, timesize, usualtime, timedelay) {
    var list = [], add = function(v) {
      list.push(v);
      return v;
    };
    var avgtime = add(Stats.RollingAvg(size)), stdev = add(Stats.RollingAvg(size)), zavg = add(Stats.RollingAvg(size)), median = add(Stats.RollingMedian(size)), mstdev = add(Stats.RollingAvg(size)), mzavg = add(Stats.RollingAvg(size)), tzavg = add(Stats.RollingAvgIndex(timesize)), tstdev = add(Stats.RollingAvgIndex(timesize)), tmedian = add(Stats.RollingMedianIndex(timesize)), tmzavg = add(Stats.RollingAvgIndex(timesize)), tmstdev = add(Stats.RollingAvgIndex(timesize)), tsum = add(Stats.RollingSumPerIndex(timesize, usualtime)), value_delay = add(Stats.Delay(delay)), tvalue_delay = add(Stats.DelayIndex(timedelay, usualtime)), index_delay = add(Stats.Delay(delay)), tindex_delay = add(Stats.DelayIndex(timedelay, usualtime)), prev2 = false, count = 0, tcount = 0;
    function stats(n, t) {
      var o = {};
      o.median = median(n);
      o.min = median.min();
      o.max = median.max();
      o.q1 = median.q1();
      o.q3 = median.q3();
      o.avg = median.avg();
      o.stdev = Math.sqrt(stdev(Math.pow(n - o.avg, 2)));
      o.z = o.stdev == 0 ? 0 : (n - o.avg) / o.stdev;
      o.zavg = zavg(o.z);
      o.mstdev = Math.sqrt(mstdev(Math.pow(n - o.median, 2)));
      o.mz = o.mstdev == 0 ? 0 : 0.6745 * (n - o.median) / o.mstdev;
      o.mzavg = mzavg(o.mz);
      o.tmedian = tmedian(n, t);
      o.tmin = tmedian.min();
      o.tmax = tmedian.max();
      o.tavg = tmedian.avg();
      o.tcenter = tmedian.center();
      o.tq1 = tmedian.q1();
      o.tq3 = tmedian.q3();
      o.tsum = tsum(n, t);
      o.tstdev = Math.sqrt(tstdev(Math.pow(n - o.tavg, 2), t));
      o.tz = o.tstdev == 0 ? 0 : (n - o.tavg) / o.tstdev;
      o.tzavg = tzavg(o.tz, t);
      o.tmstdev = Math.sqrt(tmstdev(Math.pow(n - o.tmedian, 2), t));
      o.tmz = o.tmstdev == 0 ? 0 : 0.6745 * (n - o.tmedian) / o.tmstdev;
      o.tmzavg = tmzavg(o.tmz, t);
      if (prev2 === false)
        prev2 = t - usualtime;
      var delta = t - prev2;
      prev2 = t;
      o.avgtime = avgtime(delta);
      o.count = count;
      count++;
      o.tcount = tcount;
      tcount += delta;
      o.value_delay = value_delay(n);
      o.tvalue_delay = tvalue_delay(n, t);
      o.index_delay = index_delay(t);
      o.tindex_delay = tindex_delay(t, t);
      return o;
    }
    stats.reset = function() {
      for (var i = 0; i < list.length; i++) {
        list[i].reset();
      }
      prev2 = false;
      count = 0;
    };
    return stats;
  }
  function SimpleStats(size, delay) {
    var min2 = Stats.RollingMin(size), max2 = Stats.RollingMax(size), avg = Stats.RollingAvg(size), value_delay = Stats.Delay(delay);
    function stats(n) {
      var o = {};
      o.min = min2(n);
      o.max = max2(n);
      o.avg = avg(n);
      o.value_delay = value_delay(n);
      return o;
    }
    stats.reset = function() {
      min2.reset();
      max2.reset();
      avg.reset();
      value_delay.reset();
    };
    return stats;
  }
  function SimpleStatsNoDelay(size) {
    var min2 = Stats.RollingMin(size), max2 = Stats.RollingMax(size), avg = Stats.RollingAvg(size);
    function stats(n) {
      var o = {};
      o.min = min2(n);
      o.max = max2(n);
      o.avg = avg(n);
      return o;
    }
    stats.reset = function() {
      min2.reset();
      max2.reset();
      avg.reset();
    };
    return stats;
  }
  exports.RollingMin = RollingMin;
  exports.RollingMax = RollingMax;
  exports.RollingAvg = RollingAvg;
  exports.RollingMedian = RollingMedian;
  exports.RollingMinIndex = RollingMinIndex;
  exports.RollingMaxIndex = RollingMaxIndex;
  exports.RollingAvgIndex = RollingAvgIndex;
  exports.RollingMedianIndex = RollingMedianIndex;
  exports.RollingSumPerIndex = RollingSumPerIndex;
  exports.Delay = Delay;
  exports.DelayIndex = DelayIndex;
  exports.AllStats = AllStats;
  exports.SimpleStats = SimpleStats;
  exports.SimpleStatsNoDelay = SimpleStatsNoDelay;
  exports.PositiveLately = PositiveLately;
  exports.PositiveLatelyIndex = PositiveLatelyIndex;
  exports.Histogram = Histogram;
  exports.RollingHistogram = RollingHistogram;
  exports.RollingHistogramIndex = RollingHistogramIndex;
  exports.HideFirst = HideFirst;
})(efficientRollingStats);
function create_fragment$8(ctx) {
  let label;
  let input;
  let t0;
  let div;
  let t1;
  let mounted;
  let dispose;
  return {
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      div = element("div");
      t1 = text(ctx[1]);
      attr(input, "type", "checkbox");
      attr(input, "class", "hidden peer");
      attr(input, "autocomplete", "off");
      attr(div, "class", "basic-button");
      attr(div, "type", "button");
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = ctx[0];
      append(label, t0);
      append(label, div);
      append(div, t1);
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[4]),
          listen(input, "change", ctx[3]),
          listen(label, "click", ctx[2])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        input.checked = ctx2[0];
      }
      if (dirty & 2)
        set_data(t1, ctx2[1]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(label);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$8($$self, $$props, $$invalidate) {
  let { name } = $$props;
  let { checked } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input_change_handler() {
    checked = this.checked;
    $$invalidate(0, checked);
  }
  $$self.$$set = ($$props2) => {
    if ("name" in $$props2)
      $$invalidate(1, name = $$props2.name);
    if ("checked" in $$props2)
      $$invalidate(0, checked = $$props2.checked);
  };
  return [checked, name, click_handler, change_handler, input_change_handler];
}
class CheckButton extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$8, create_fragment$8, safe_not_equal, { name: 1, checked: 0 });
  }
}
function create_fragment$7(ctx) {
  let label;
  let input;
  let t0;
  let div;
  let t1;
  let t2;
  let t3;
  let t4;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = ctx[3].default;
  const default_slot = create_slot(default_slot_template, ctx, ctx[2], null);
  return {
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      div = element("div");
      t1 = text(" ");
      t2 = text(ctx[1]);
      t3 = text(" ");
      t4 = space();
      if (default_slot)
        default_slot.c();
      attr(input, "type", "checkbox");
      attr(input, "class", "hidden peer");
      attr(input, "autocomplete", "off");
      attr(div, "class", "basic-button line-through thick-line-through peer-checked:no-underline");
      attr(div, "type", "button");
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = ctx[0];
      append(label, t0);
      append(label, div);
      append(div, t1);
      append(div, t2);
      append(div, t3);
      append(label, t4);
      if (default_slot) {
        default_slot.m(label, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[6]),
          listen(input, "change", ctx[5]),
          listen(label, "click", ctx[4])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        input.checked = ctx2[0];
      }
      if (!current || dirty & 2)
        set_data(t2, ctx2[1]);
      if (default_slot) {
        if (default_slot.p && (!current || dirty & 4)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx2,
            ctx2[2],
            !current ? get_all_dirty_from_scope(ctx2[2]) : get_slot_changes(default_slot_template, ctx2[2], dirty, null),
            null
          );
        }
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(label);
      if (default_slot)
        default_slot.d(detaching);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$7($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let { name } = $$props;
  let { checked } = $$props;
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function change_handler(event) {
    bubble.call(this, $$self, event);
  }
  function input_change_handler() {
    checked = this.checked;
    $$invalidate(0, checked);
  }
  $$self.$$set = ($$props2) => {
    if ("name" in $$props2)
      $$invalidate(1, name = $$props2.name);
    if ("checked" in $$props2)
      $$invalidate(0, checked = $$props2.checked);
    if ("$$scope" in $$props2)
      $$invalidate(2, $$scope = $$props2.$$scope);
  };
  return [
    checked,
    name,
    $$scope,
    slots,
    click_handler,
    change_handler,
    input_change_handler
  ];
}
class LineThroughButton extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$7, create_fragment$7, safe_not_equal, { name: 1, checked: 0 });
  }
}
const scriptRel = "modulepreload";
const assetsURL = function(dep) {
  return "/" + dep;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule());
};
let A, I, B;
const g = { env: { emscripten_notify_memory_growth: function(A2) {
  B = new Uint8Array(I.exports.memory.buffer);
} } };
class Q {
  init() {
    return A || (A = "undefined" != typeof fetch ? fetch("data:application/wasm;base64," + C).then((A2) => A2.arrayBuffer()).then((A2) => WebAssembly.instantiate(A2, g)).then(this._init) : WebAssembly.instantiate(Buffer.from(C, "base64"), g).then(this._init), A);
  }
  _init(A2) {
    I = A2.instance, g.env.emscripten_notify_memory_growth(0);
  }
  decode(A2, g2 = 0) {
    if (!I)
      throw new Error("ZSTDDecoder: Await .init() before decoding.");
    const Q2 = A2.byteLength, C2 = I.exports.malloc(Q2);
    B.set(A2, C2), g2 = g2 || Number(I.exports.ZSTD_findDecompressedSize(C2, Q2));
    const E = I.exports.malloc(g2), i = I.exports.ZSTD_decompress(E, g2, C2, Q2), D = B.slice(E, E + i);
    return I.exports.free(C2), I.exports.free(E), D;
  }
}
const C = "AGFzbQEAAAABpQEVYAF/AX9gAn9/AGADf39/AX9gBX9/f39/AX9gAX8AYAJ/fwF/YAR/f39/AX9gA39/fwBgBn9/f39/fwF/YAd/f39/f39/AX9gAn9/AX5gAn5+AX5gAABgBX9/f39/AGAGf39/f39/AGAIf39/f39/f38AYAl/f39/f39/f38AYAABf2AIf39/f39/f38Bf2ANf39/f39/f39/f39/fwF/YAF/AX4CJwEDZW52H2Vtc2NyaXB0ZW5fbm90aWZ5X21lbW9yeV9ncm93dGgABANpaAEFAAAFAgEFCwACAQABAgIFBQcAAwABDgsBAQcAEhMHAAUBDAQEAAANBwQCAgYCBAgDAwMDBgEACQkHBgICAAYGAgQUBwYGAwIGAAMCAQgBBwUGCgoEEQAEBAEIAwgDBQgDEA8IAAcABAUBcAECAgUEAQCAAgYJAX8BQaCgwAILB2AHBm1lbW9yeQIABm1hbGxvYwAoBGZyZWUAJgxaU1REX2lzRXJyb3IAaBlaU1REX2ZpbmREZWNvbXByZXNzZWRTaXplAFQPWlNURF9kZWNvbXByZXNzAEoGX3N0YXJ0ACQJBwEAQQELASQKussBaA8AIAAgACgCBCABajYCBAsZACAAKAIAIAAoAgRBH3F0QQAgAWtBH3F2CwgAIABBiH9LC34BBH9BAyEBIAAoAgQiA0EgTQRAIAAoAggiASAAKAIQTwRAIAAQDQ8LIAAoAgwiAiABRgRAQQFBAiADQSBJGw8LIAAgASABIAJrIANBA3YiBCABIARrIAJJIgEbIgJrIgQ2AgggACADIAJBA3RrNgIEIAAgBCgAADYCAAsgAQsUAQF/IAAgARACIQIgACABEAEgAgv3AQECfyACRQRAIABCADcCACAAQQA2AhAgAEIANwIIQbh/DwsgACABNgIMIAAgAUEEajYCECACQQRPBEAgACABIAJqIgFBfGoiAzYCCCAAIAMoAAA2AgAgAUF/ai0AACIBBEAgAEEIIAEQFGs2AgQgAg8LIABBADYCBEF/DwsgACABNgIIIAAgAS0AACIDNgIAIAJBfmoiBEEBTQRAIARBAWtFBEAgACABLQACQRB0IANyIgM2AgALIAAgAS0AAUEIdCADajYCAAsgASACakF/ai0AACIBRQRAIABBADYCBEFsDwsgAEEoIAEQFCACQQN0ams2AgQgAgsWACAAIAEpAAA3AAAgACABKQAINwAICy8BAX8gAUECdEGgHWooAgAgACgCAEEgIAEgACgCBGprQR9xdnEhAiAAIAEQASACCyEAIAFCz9bTvtLHq9lCfiAAfEIfiUKHla+vmLbem55/fgsdAQF/IAAoAgggACgCDEYEfyAAKAIEQSBGBUEACwuCBAEDfyACQYDAAE8EQCAAIAEgAhBnIAAPCyAAIAJqIQMCQCAAIAFzQQNxRQRAAkAgAkEBSARAIAAhAgwBCyAAQQNxRQRAIAAhAgwBCyAAIQIDQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADTw0BIAJBA3ENAAsLAkAgA0F8cSIEQcAASQ0AIAIgBEFAaiIFSw0AA0AgAiABKAIANgIAIAIgASgCBDYCBCACIAEoAgg2AgggAiABKAIMNgIMIAIgASgCEDYCECACIAEoAhQ2AhQgAiABKAIYNgIYIAIgASgCHDYCHCACIAEoAiA2AiAgAiABKAIkNgIkIAIgASgCKDYCKCACIAEoAiw2AiwgAiABKAIwNgIwIAIgASgCNDYCNCACIAEoAjg2AjggAiABKAI8NgI8IAFBQGshASACQUBrIgIgBU0NAAsLIAIgBE8NAQNAIAIgASgCADYCACABQQRqIQEgAkEEaiICIARJDQALDAELIANBBEkEQCAAIQIMAQsgA0F8aiIEIABJBEAgACECDAELIAAhAgNAIAIgAS0AADoAACACIAEtAAE6AAEgAiABLQACOgACIAIgAS0AAzoAAyABQQRqIQEgAkEEaiICIARNDQALCyACIANJBEADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAsMACAAIAEpAAA3AAALQQECfyAAKAIIIgEgACgCEEkEQEEDDwsgACAAKAIEIgJBB3E2AgQgACABIAJBA3ZrIgE2AgggACABKAAANgIAQQALDAAgACABKAIANgAAC/cCAQJ/AkAgACABRg0AAkAgASACaiAASwRAIAAgAmoiBCABSw0BCyAAIAEgAhALDwsgACABc0EDcSEDAkACQCAAIAFJBEAgAwRAIAAhAwwDCyAAQQNxRQRAIAAhAwwCCyAAIQMDQCACRQ0EIAMgAS0AADoAACABQQFqIQEgAkF/aiECIANBAWoiA0EDcQ0ACwwBCwJAIAMNACAEQQNxBEADQCACRQ0FIAAgAkF/aiICaiIDIAEgAmotAAA6AAAgA0EDcQ0ACwsgAkEDTQ0AA0AgACACQXxqIgJqIAEgAmooAgA2AgAgAkEDSw0ACwsgAkUNAgNAIAAgAkF/aiICaiABIAJqLQAAOgAAIAINAAsMAgsgAkEDTQ0AIAIhBANAIAMgASgCADYCACABQQRqIQEgA0EEaiEDIARBfGoiBEEDSw0ACyACQQNxIQILIAJFDQADQCADIAEtAAA6AAAgA0EBaiEDIAFBAWohASACQX9qIgINAAsLIAAL8wICAn8BfgJAIAJFDQAgACACaiIDQX9qIAE6AAAgACABOgAAIAJBA0kNACADQX5qIAE6AAAgACABOgABIANBfWogAToAACAAIAE6AAIgAkEHSQ0AIANBfGogAToAACAAIAE6AAMgAkEJSQ0AIABBACAAa0EDcSIEaiIDIAFB/wFxQYGChAhsIgE2AgAgAyACIARrQXxxIgRqIgJBfGogATYCACAEQQlJDQAgAyABNgIIIAMgATYCBCACQXhqIAE2AgAgAkF0aiABNgIAIARBGUkNACADIAE2AhggAyABNgIUIAMgATYCECADIAE2AgwgAkFwaiABNgIAIAJBbGogATYCACACQWhqIAE2AgAgAkFkaiABNgIAIAQgA0EEcUEYciIEayICQSBJDQAgAa0iBUIghiAFhCEFIAMgBGohAQNAIAEgBTcDGCABIAU3AxAgASAFNwMIIAEgBTcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAIajYCACADCy8BAn8gACgCBCAAKAIAQQJ0aiICLQACIQMgACACLwEAIAEgAi0AAxAFajYCACADCx8AIAAgASACKAIEEAg2AgAgARAEGiAAIAJBCGo2AgQLCAAgAGdBH3MLugUBDX8jAEEQayIKJAACfyAEQQNNBEAgCkEANgIMIApBDGogAyAEEAsaIAAgASACIApBDGpBBBAVIgBBbCAAEAMbIAAgACAESxsMAQsgAEEAIAEoAgBBAXRBAmoQECENQVQgAygAACIGQQ9xIgBBCksNABogAiAAQQVqNgIAIAMgBGoiAkF8aiEMIAJBeWohDiACQXtqIRAgAEEGaiELQQQhBSAGQQR2IQRBICAAdCIAQQFyIQkgASgCACEPQQAhAiADIQYCQANAIAlBAkggAiAPS3JFBEAgAiEHAkAgCARAA0AgBEH//wNxQf//A0YEQCAHQRhqIQcgBiAQSQR/IAZBAmoiBigAACAFdgUgBUEQaiEFIARBEHYLIQQMAQsLA0AgBEEDcSIIQQNGBEAgBUECaiEFIARBAnYhBCAHQQNqIQcMAQsLIAcgCGoiByAPSw0EIAVBAmohBQNAIAIgB0kEQCANIAJBAXRqQQA7AQAgAkEBaiECDAELCyAGIA5LQQAgBiAFQQN1aiIHIAxLG0UEQCAHKAAAIAVBB3EiBXYhBAwCCyAEQQJ2IQQLIAYhBwsCfyALQX9qIAQgAEF/anEiBiAAQQF0QX9qIgggCWsiEUkNABogBCAIcSIEQQAgESAEIABIG2shBiALCyEIIA0gAkEBdGogBkF/aiIEOwEAIAlBASAGayAEIAZBAUgbayEJA0AgCSAASARAIABBAXUhACALQX9qIQsMAQsLAn8gByAOS0EAIAcgBSAIaiIFQQN1aiIGIAxLG0UEQCAFQQdxDAELIAUgDCIGIAdrQQN0awshBSACQQFqIQIgBEUhCCAGKAAAIAVBH3F2IQQMAQsLQWwgCUEBRyAFQSBKcg0BGiABIAJBf2o2AgAgBiAFQQdqQQN1aiADawwBC0FQCyEAIApBEGokACAACwkAQQFBBSAAGwsMACAAIAEoAAA2AAALqgMBCn8jAEHwAGsiCiQAIAJBAWohDiAAQQhqIQtBgIAEIAVBf2p0QRB1IQxBACECQQEhBkEBIAV0IglBf2oiDyEIA0AgAiAORkUEQAJAIAEgAkEBdCINai8BACIHQf//A0YEQCALIAhBA3RqIAI2AgQgCEF/aiEIQQEhBwwBCyAGQQAgDCAHQRB0QRB1ShshBgsgCiANaiAHOwEAIAJBAWohAgwBCwsgACAFNgIEIAAgBjYCACAJQQN2IAlBAXZqQQNqIQxBACEAQQAhBkEAIQIDQCAGIA5GBEADQAJAIAAgCUYNACAKIAsgAEEDdGoiASgCBCIGQQF0aiICIAIvAQAiAkEBajsBACABIAUgAhAUayIIOgADIAEgAiAIQf8BcXQgCWs7AQAgASAEIAZBAnQiAmooAgA6AAIgASACIANqKAIANgIEIABBAWohAAwBCwsFIAEgBkEBdGouAQAhDUEAIQcDQCAHIA1ORQRAIAsgAkEDdGogBjYCBANAIAIgDGogD3EiAiAISw0ACyAHQQFqIQcMAQsLIAZBAWohBgwBCwsgCkHwAGokAAsjAEIAIAEQCSAAhUKHla+vmLbem55/fkLj3MqV/M7y9YV/fAsQACAAQn43AwggACABNgIACyQBAX8gAARAIAEoAgQiAgRAIAEoAgggACACEQEADwsgABAmCwsfACAAIAEgAi8BABAINgIAIAEQBBogACACQQRqNgIEC0oBAX9BoCAoAgAiASAAaiIAQX9MBEBBiCBBMDYCAEF/DwsCQCAAPwBBEHRNDQAgABBmDQBBiCBBMDYCAEF/DwtBoCAgADYCACABC9cBAQh/Qbp/IQoCQCACKAIEIgggAigCACIJaiIOIAEgAGtLDQBBbCEKIAkgBCADKAIAIgtrSw0AIAAgCWoiBCACKAIIIgxrIQ0gACABQWBqIg8gCyAJQQAQKSADIAkgC2o2AgACQAJAIAwgBCAFa00EQCANIQUMAQsgDCAEIAZrSw0CIAcgDSAFayIAaiIBIAhqIAdNBEAgBCABIAgQDxoMAgsgBCABQQAgAGsQDyEBIAIgACAIaiIINgIEIAEgAGshBAsgBCAPIAUgCEEBECkLIA4hCgsgCgubAgEBfyMAQYABayINJAAgDSADNgJ8AkAgAkEDSwRAQX8hCQwBCwJAAkACQAJAIAJBAWsOAwADAgELIAZFBEBBuH8hCQwEC0FsIQkgBS0AACICIANLDQMgACAHIAJBAnQiAmooAgAgAiAIaigCABA7IAEgADYCAEEBIQkMAwsgASAJNgIAQQAhCQwCCyAKRQRAQWwhCQwCC0EAIQkgC0UgDEEZSHINAUEIIAR0QQhqIQBBACECA0AgAiAATw0CIAJBQGshAgwAAAsAC0FsIQkgDSANQfwAaiANQfgAaiAFIAYQFSICEAMNACANKAJ4IgMgBEsNACAAIA0gDSgCfCAHIAggAxAYIAEgADYCACACIQkLIA1BgAFqJAAgCQsLACAAIAEgAhALGgsQACAALwAAIAAtAAJBEHRyCy8AAn9BuH8gAUEISQ0AGkFyIAAoAAQiAEF3Sw0AGkG4fyAAQQhqIgAgACABSxsLCwkAIAAgATsAAAsDAAELigYBBX8gACAAKAIAIgVBfnE2AgBBACAAIAVBAXZqQYQgKAIAIgQgAEYbIQECQAJAIAAoAgQiAkUNACACKAIAIgNBAXENACACQQhqIgUgA0EBdkF4aiIDQQggA0EISxtnQR9zQQJ0QYAfaiIDKAIARgRAIAMgAigCDDYCAAsgAigCCCIDBEAgAyACKAIMNgIECyACKAIMIgMEQCADIAIoAgg2AgALIAIgAigCACAAKAIAQX5xajYCAEGEICEAAkACQCABRQ0AIAEgAjYCBCABKAIAIgNBAXENASADQQF2QXhqIgNBCCADQQhLG2dBH3NBAnRBgB9qIgMoAgAgAUEIakYEQCADIAEoAgw2AgALIAEoAggiAwRAIAMgASgCDDYCBAsgASgCDCIDBEAgAyABKAIINgIAQYQgKAIAIQQLIAIgAigCACABKAIAQX5xajYCACABIARGDQAgASABKAIAQQF2akEEaiEACyAAIAI2AgALIAIoAgBBAXZBeGoiAEEIIABBCEsbZ0Efc0ECdEGAH2oiASgCACEAIAEgBTYCACACIAA2AgwgAkEANgIIIABFDQEgACAFNgIADwsCQCABRQ0AIAEoAgAiAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAigCACABQQhqRgRAIAIgASgCDDYCAAsgASgCCCICBEAgAiABKAIMNgIECyABKAIMIgIEQCACIAEoAgg2AgBBhCAoAgAhBAsgACAAKAIAIAEoAgBBfnFqIgI2AgACQCABIARHBEAgASABKAIAQQF2aiAANgIEIAAoAgAhAgwBC0GEICAANgIACyACQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgIoAgAhASACIABBCGoiAjYCACAAIAE2AgwgAEEANgIIIAFFDQEgASACNgIADwsgBUEBdkF4aiIBQQggAUEISxtnQR9zQQJ0QYAfaiICKAIAIQEgAiAAQQhqIgI2AgAgACABNgIMIABBADYCCCABRQ0AIAEgAjYCAAsLDgAgAARAIABBeGoQJQsLgAIBA38CQCAAQQ9qQXhxQYQgKAIAKAIAQQF2ayICEB1Bf0YNAAJAQYQgKAIAIgAoAgAiAUEBcQ0AIAFBAXZBeGoiAUEIIAFBCEsbZ0Efc0ECdEGAH2oiASgCACAAQQhqRgRAIAEgACgCDDYCAAsgACgCCCIBBEAgASAAKAIMNgIECyAAKAIMIgFFDQAgASAAKAIINgIAC0EBIQEgACAAKAIAIAJBAXRqIgI2AgAgAkEBcQ0AIAJBAXZBeGoiAkEIIAJBCEsbZ0Efc0ECdEGAH2oiAygCACECIAMgAEEIaiIDNgIAIAAgAjYCDCAAQQA2AgggAkUNACACIAM2AgALIAELtwIBA38CQAJAIABBASAAGyICEDgiAA0AAkACQEGEICgCACIARQ0AIAAoAgAiA0EBcQ0AIAAgA0EBcjYCACADQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgEoAgAgAEEIakYEQCABIAAoAgw2AgALIAAoAggiAQRAIAEgACgCDDYCBAsgACgCDCIBBEAgASAAKAIINgIACyACECchAkEAIQFBhCAoAgAhACACDQEgACAAKAIAQX5xNgIAQQAPCyACQQ9qQXhxIgMQHSICQX9GDQIgAkEHakF4cSIAIAJHBEAgACACaxAdQX9GDQMLAkBBhCAoAgAiAUUEQEGAICAANgIADAELIAAgATYCBAtBhCAgADYCACAAIANBAXRBAXI2AgAMAQsgAEUNAQsgAEEIaiEBCyABC7kDAQJ/IAAgA2ohBQJAIANBB0wEQANAIAAgBU8NAiAAIAItAAA6AAAgAEEBaiEAIAJBAWohAgwAAAsACyAEQQFGBEACQCAAIAJrIgZBB00EQCAAIAItAAA6AAAgACACLQABOgABIAAgAi0AAjoAAiAAIAItAAM6AAMgAEEEaiACIAZBAnQiBkHAHmooAgBqIgIQFyACIAZB4B5qKAIAayECDAELIAAgAhAMCyACQQhqIQIgAEEIaiEACwJAAkACQAJAIAUgAU0EQCAAIANqIQEgBEEBRyAAIAJrQQ9Kcg0BA0AgACACEAwgAkEIaiECIABBCGoiACABSQ0ACwwFCyAAIAFLBEAgACEBDAQLIARBAUcgACACa0EPSnINASAAIQMgAiEEA0AgAyAEEAwgBEEIaiEEIANBCGoiAyABSQ0ACwwCCwNAIAAgAhAHIAJBEGohAiAAQRBqIgAgAUkNAAsMAwsgACEDIAIhBANAIAMgBBAHIARBEGohBCADQRBqIgMgAUkNAAsLIAIgASAAa2ohAgsDQCABIAVPDQEgASACLQAAOgAAIAFBAWohASACQQFqIQIMAAALAAsLQQECfyAAIAAoArjgASIDNgLE4AEgACgCvOABIQQgACABNgK84AEgACABIAJqNgK44AEgACABIAQgA2tqNgLA4AELpgEBAX8gACAAKALs4QEQFjYCyOABIABCADcD+OABIABCADcDuOABIABBwOABakIANwMAIABBqNAAaiIBQYyAgOAANgIAIABBADYCmOIBIABCADcDiOEBIABCAzcDgOEBIABBrNABakHgEikCADcCACAAQbTQAWpB6BIoAgA2AgAgACABNgIMIAAgAEGYIGo2AgggACAAQaAwajYCBCAAIABBEGo2AgALYQEBf0G4fyEDAkAgAUEDSQ0AIAIgABAhIgFBA3YiADYCCCACIAFBAXE2AgQgAiABQQF2QQNxIgM2AgACQCADQX9qIgFBAksNAAJAIAFBAWsOAgEAAgtBbA8LIAAhAwsgAwsMACAAIAEgAkEAEC4LiAQCA38CfiADEBYhBCAAQQBBKBAQIQAgBCACSwRAIAQPCyABRQRAQX8PCwJAAkAgA0EBRg0AIAEoAAAiBkGo6r5pRg0AQXYhAyAGQXBxQdDUtMIBRw0BQQghAyACQQhJDQEgAEEAQSgQECEAIAEoAAQhASAAQQE2AhQgACABrTcDAEEADwsgASACIAMQLyIDIAJLDQAgACADNgIYQXIhAyABIARqIgVBf2otAAAiAkEIcQ0AIAJBIHEiBkUEQEFwIQMgBS0AACIFQacBSw0BIAVBB3GtQgEgBUEDdkEKaq2GIgdCA4h+IAd8IQggBEEBaiEECyACQQZ2IQMgAkECdiEFAkAgAkEDcUF/aiICQQJLBEBBACECDAELAkACQAJAIAJBAWsOAgECAAsgASAEai0AACECIARBAWohBAwCCyABIARqLwAAIQIgBEECaiEEDAELIAEgBGooAAAhAiAEQQRqIQQLIAVBAXEhBQJ+AkACQAJAIANBf2oiA0ECTQRAIANBAWsOAgIDAQtCfyAGRQ0DGiABIARqMQAADAMLIAEgBGovAACtQoACfAwCCyABIARqKAAArQwBCyABIARqKQAACyEHIAAgBTYCICAAIAI2AhwgACAHNwMAQQAhAyAAQQA2AhQgACAHIAggBhsiBzcDCCAAIAdCgIAIIAdCgIAIVBs+AhALIAMLWwEBf0G4fyEDIAIQFiICIAFNBH8gACACakF/ai0AACIAQQNxQQJ0QaAeaigCACACaiAAQQZ2IgFBAnRBsB5qKAIAaiAAQSBxIgBFaiABRSAAQQV2cWoFQbh/CwsdACAAKAKQ4gEQWiAAQQA2AqDiASAAQgA3A5DiAQu1AwEFfyMAQZACayIKJABBuH8hBgJAIAVFDQAgBCwAACIIQf8BcSEHAkAgCEF/TARAIAdBgn9qQQF2IgggBU8NAkFsIQYgB0GBf2oiBUGAAk8NAiAEQQFqIQdBACEGA0AgBiAFTwRAIAUhBiAIIQcMAwUgACAGaiAHIAZBAXZqIgQtAABBBHY6AAAgACAGQQFyaiAELQAAQQ9xOgAAIAZBAmohBgwBCwAACwALIAcgBU8NASAAIARBAWogByAKEFMiBhADDQELIAYhBEEAIQYgAUEAQTQQECEJQQAhBQNAIAQgBkcEQCAAIAZqIggtAAAiAUELSwRAQWwhBgwDBSAJIAFBAnRqIgEgASgCAEEBajYCACAGQQFqIQZBASAILQAAdEEBdSAFaiEFDAILAAsLQWwhBiAFRQ0AIAUQFEEBaiIBQQxLDQAgAyABNgIAQQFBASABdCAFayIDEBQiAXQgA0cNACAAIARqIAFBAWoiADoAACAJIABBAnRqIgAgACgCAEEBajYCACAJKAIEIgBBAkkgAEEBcXINACACIARBAWo2AgAgB0EBaiEGCyAKQZACaiQAIAYLxhEBDH8jAEHwAGsiBSQAQWwhCwJAIANBCkkNACACLwAAIQogAi8AAiEJIAIvAAQhByAFQQhqIAQQDgJAIAMgByAJIApqakEGaiIMSQ0AIAUtAAohCCAFQdgAaiACQQZqIgIgChAGIgsQAw0BIAVBQGsgAiAKaiICIAkQBiILEAMNASAFQShqIAIgCWoiAiAHEAYiCxADDQEgBUEQaiACIAdqIAMgDGsQBiILEAMNASAAIAFqIg9BfWohECAEQQRqIQZBASELIAAgAUEDakECdiIDaiIMIANqIgIgA2oiDiEDIAIhBCAMIQcDQCALIAMgEElxBEAgACAGIAVB2ABqIAgQAkECdGoiCS8BADsAACAFQdgAaiAJLQACEAEgCS0AAyELIAcgBiAFQUBrIAgQAkECdGoiCS8BADsAACAFQUBrIAktAAIQASAJLQADIQogBCAGIAVBKGogCBACQQJ0aiIJLwEAOwAAIAVBKGogCS0AAhABIAktAAMhCSADIAYgBUEQaiAIEAJBAnRqIg0vAQA7AAAgBUEQaiANLQACEAEgDS0AAyENIAAgC2oiCyAGIAVB2ABqIAgQAkECdGoiAC8BADsAACAFQdgAaiAALQACEAEgAC0AAyEAIAcgCmoiCiAGIAVBQGsgCBACQQJ0aiIHLwEAOwAAIAVBQGsgBy0AAhABIActAAMhByAEIAlqIgkgBiAFQShqIAgQAkECdGoiBC8BADsAACAFQShqIAQtAAIQASAELQADIQQgAyANaiIDIAYgBUEQaiAIEAJBAnRqIg0vAQA7AAAgBUEQaiANLQACEAEgACALaiEAIAcgCmohByAEIAlqIQQgAyANLQADaiEDIAVB2ABqEA0gBUFAaxANciAFQShqEA1yIAVBEGoQDXJFIQsMAQsLIAQgDksgByACS3INAEFsIQsgACAMSw0BIAxBfWohCQNAQQAgACAJSSAFQdgAahAEGwRAIAAgBiAFQdgAaiAIEAJBAnRqIgovAQA7AAAgBUHYAGogCi0AAhABIAAgCi0AA2oiACAGIAVB2ABqIAgQAkECdGoiCi8BADsAACAFQdgAaiAKLQACEAEgACAKLQADaiEADAEFIAxBfmohCgNAIAVB2ABqEAQgACAKS3JFBEAgACAGIAVB2ABqIAgQAkECdGoiCS8BADsAACAFQdgAaiAJLQACEAEgACAJLQADaiEADAELCwNAIAAgCk0EQCAAIAYgBUHYAGogCBACQQJ0aiIJLwEAOwAAIAVB2ABqIAktAAIQASAAIAktAANqIQAMAQsLAkAgACAMTw0AIAAgBiAFQdgAaiAIEAIiAEECdGoiDC0AADoAACAMLQADQQFGBEAgBUHYAGogDC0AAhABDAELIAUoAlxBH0sNACAFQdgAaiAGIABBAnRqLQACEAEgBSgCXEEhSQ0AIAVBIDYCXAsgAkF9aiEMA0BBACAHIAxJIAVBQGsQBBsEQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiIAIAYgBUFAayAIEAJBAnRqIgcvAQA7AAAgBUFAayAHLQACEAEgACAHLQADaiEHDAEFIAJBfmohDANAIAVBQGsQBCAHIAxLckUEQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiEHDAELCwNAIAcgDE0EQCAHIAYgBUFAayAIEAJBAnRqIgAvAQA7AAAgBUFAayAALQACEAEgByAALQADaiEHDAELCwJAIAcgAk8NACAHIAYgBUFAayAIEAIiAEECdGoiAi0AADoAACACLQADQQFGBEAgBUFAayACLQACEAEMAQsgBSgCREEfSw0AIAVBQGsgBiAAQQJ0ai0AAhABIAUoAkRBIUkNACAFQSA2AkQLIA5BfWohAgNAQQAgBCACSSAFQShqEAQbBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2oiACAGIAVBKGogCBACQQJ0aiIELwEAOwAAIAVBKGogBC0AAhABIAAgBC0AA2ohBAwBBSAOQX5qIQIDQCAFQShqEAQgBCACS3JFBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2ohBAwBCwsDQCAEIAJNBEAgBCAGIAVBKGogCBACQQJ0aiIALwEAOwAAIAVBKGogAC0AAhABIAQgAC0AA2ohBAwBCwsCQCAEIA5PDQAgBCAGIAVBKGogCBACIgBBAnRqIgItAAA6AAAgAi0AA0EBRgRAIAVBKGogAi0AAhABDAELIAUoAixBH0sNACAFQShqIAYgAEECdGotAAIQASAFKAIsQSFJDQAgBUEgNgIsCwNAQQAgAyAQSSAFQRBqEAQbBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2oiACAGIAVBEGogCBACQQJ0aiICLwEAOwAAIAVBEGogAi0AAhABIAAgAi0AA2ohAwwBBSAPQX5qIQIDQCAFQRBqEAQgAyACS3JFBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2ohAwwBCwsDQCADIAJNBEAgAyAGIAVBEGogCBACQQJ0aiIALwEAOwAAIAVBEGogAC0AAhABIAMgAC0AA2ohAwwBCwsCQCADIA9PDQAgAyAGIAVBEGogCBACIgBBAnRqIgItAAA6AAAgAi0AA0EBRgRAIAVBEGogAi0AAhABDAELIAUoAhRBH0sNACAFQRBqIAYgAEECdGotAAIQASAFKAIUQSFJDQAgBUEgNgIUCyABQWwgBUHYAGoQCiAFQUBrEApxIAVBKGoQCnEgBUEQahAKcRshCwwJCwAACwALAAALAAsAAAsACwAACwALQWwhCwsgBUHwAGokACALC7UEAQ5/IwBBEGsiBiQAIAZBBGogABAOQVQhBQJAIARB3AtJDQAgBi0ABCEHIANB8ARqQQBB7AAQECEIIAdBDEsNACADQdwJaiIJIAggBkEIaiAGQQxqIAEgAhAxIhAQA0UEQCAGKAIMIgQgB0sNASADQdwFaiEPIANBpAVqIREgAEEEaiESIANBqAVqIQEgBCEFA0AgBSICQX9qIQUgCCACQQJ0aigCAEUNAAsgAkEBaiEOQQEhBQNAIAUgDk9FBEAgCCAFQQJ0IgtqKAIAIQwgASALaiAKNgIAIAVBAWohBSAKIAxqIQoMAQsLIAEgCjYCAEEAIQUgBigCCCELA0AgBSALRkUEQCABIAUgCWotAAAiDEECdGoiDSANKAIAIg1BAWo2AgAgDyANQQF0aiINIAw6AAEgDSAFOgAAIAVBAWohBQwBCwtBACEBIANBADYCqAUgBEF/cyAHaiEJQQEhBQNAIAUgDk9FBEAgCCAFQQJ0IgtqKAIAIQwgAyALaiABNgIAIAwgBSAJanQgAWohASAFQQFqIQUMAQsLIAcgBEEBaiIBIAJrIgRrQQFqIQgDQEEBIQUgBCAIT0UEQANAIAUgDk9FBEAgBUECdCIJIAMgBEE0bGpqIAMgCWooAgAgBHY2AgAgBUEBaiEFDAELCyAEQQFqIQQMAQsLIBIgByAPIAogESADIAIgARBkIAZBAToABSAGIAc6AAYgACAGKAIENgIACyAQIQULIAZBEGokACAFC8ENAQt/IwBB8ABrIgUkAEFsIQkCQCADQQpJDQAgAi8AACEKIAIvAAIhDCACLwAEIQYgBUEIaiAEEA4CQCADIAYgCiAMampBBmoiDUkNACAFLQAKIQcgBUHYAGogAkEGaiICIAoQBiIJEAMNASAFQUBrIAIgCmoiAiAMEAYiCRADDQEgBUEoaiACIAxqIgIgBhAGIgkQAw0BIAVBEGogAiAGaiADIA1rEAYiCRADDQEgACABaiIOQX1qIQ8gBEEEaiEGQQEhCSAAIAFBA2pBAnYiAmoiCiACaiIMIAJqIg0hAyAMIQQgCiECA0AgCSADIA9JcQRAIAYgBUHYAGogBxACQQF0aiIILQAAIQsgBUHYAGogCC0AARABIAAgCzoAACAGIAVBQGsgBxACQQF0aiIILQAAIQsgBUFAayAILQABEAEgAiALOgAAIAYgBUEoaiAHEAJBAXRqIggtAAAhCyAFQShqIAgtAAEQASAEIAs6AAAgBiAFQRBqIAcQAkEBdGoiCC0AACELIAVBEGogCC0AARABIAMgCzoAACAGIAVB2ABqIAcQAkEBdGoiCC0AACELIAVB2ABqIAgtAAEQASAAIAs6AAEgBiAFQUBrIAcQAkEBdGoiCC0AACELIAVBQGsgCC0AARABIAIgCzoAASAGIAVBKGogBxACQQF0aiIILQAAIQsgBUEoaiAILQABEAEgBCALOgABIAYgBUEQaiAHEAJBAXRqIggtAAAhCyAFQRBqIAgtAAEQASADIAs6AAEgA0ECaiEDIARBAmohBCACQQJqIQIgAEECaiEAIAkgBUHYAGoQDUVxIAVBQGsQDUVxIAVBKGoQDUVxIAVBEGoQDUVxIQkMAQsLIAQgDUsgAiAMS3INAEFsIQkgACAKSw0BIApBfWohCQNAIAVB2ABqEAQgACAJT3JFBEAgBiAFQdgAaiAHEAJBAXRqIggtAAAhCyAFQdgAaiAILQABEAEgACALOgAAIAYgBUHYAGogBxACQQF0aiIILQAAIQsgBUHYAGogCC0AARABIAAgCzoAASAAQQJqIQAMAQsLA0AgBUHYAGoQBCAAIApPckUEQCAGIAVB2ABqIAcQAkEBdGoiCS0AACEIIAVB2ABqIAktAAEQASAAIAg6AAAgAEEBaiEADAELCwNAIAAgCkkEQCAGIAVB2ABqIAcQAkEBdGoiCS0AACEIIAVB2ABqIAktAAEQASAAIAg6AAAgAEEBaiEADAELCyAMQX1qIQADQCAFQUBrEAQgAiAAT3JFBEAgBiAFQUBrIAcQAkEBdGoiCi0AACEJIAVBQGsgCi0AARABIAIgCToAACAGIAVBQGsgBxACQQF0aiIKLQAAIQkgBUFAayAKLQABEAEgAiAJOgABIAJBAmohAgwBCwsDQCAFQUBrEAQgAiAMT3JFBEAgBiAFQUBrIAcQAkEBdGoiAC0AACEKIAVBQGsgAC0AARABIAIgCjoAACACQQFqIQIMAQsLA0AgAiAMSQRAIAYgBUFAayAHEAJBAXRqIgAtAAAhCiAFQUBrIAAtAAEQASACIAo6AAAgAkEBaiECDAELCyANQX1qIQADQCAFQShqEAQgBCAAT3JFBEAgBiAFQShqIAcQAkEBdGoiAi0AACEKIAVBKGogAi0AARABIAQgCjoAACAGIAVBKGogBxACQQF0aiICLQAAIQogBUEoaiACLQABEAEgBCAKOgABIARBAmohBAwBCwsDQCAFQShqEAQgBCANT3JFBEAgBiAFQShqIAcQAkEBdGoiAC0AACECIAVBKGogAC0AARABIAQgAjoAACAEQQFqIQQMAQsLA0AgBCANSQRAIAYgBUEoaiAHEAJBAXRqIgAtAAAhAiAFQShqIAAtAAEQASAEIAI6AAAgBEEBaiEEDAELCwNAIAVBEGoQBCADIA9PckUEQCAGIAVBEGogBxACQQF0aiIALQAAIQIgBUEQaiAALQABEAEgAyACOgAAIAYgBUEQaiAHEAJBAXRqIgAtAAAhAiAFQRBqIAAtAAEQASADIAI6AAEgA0ECaiEDDAELCwNAIAVBEGoQBCADIA5PckUEQCAGIAVBEGogBxACQQF0aiIALQAAIQIgBUEQaiAALQABEAEgAyACOgAAIANBAWohAwwBCwsDQCADIA5JBEAgBiAFQRBqIAcQAkEBdGoiAC0AACECIAVBEGogAC0AARABIAMgAjoAACADQQFqIQMMAQsLIAFBbCAFQdgAahAKIAVBQGsQCnEgBUEoahAKcSAFQRBqEApxGyEJDAELQWwhCQsgBUHwAGokACAJC8oCAQR/IwBBIGsiBSQAIAUgBBAOIAUtAAIhByAFQQhqIAIgAxAGIgIQA0UEQCAEQQRqIQIgACABaiIDQX1qIQQDQCAFQQhqEAQgACAET3JFBEAgAiAFQQhqIAcQAkEBdGoiBi0AACEIIAVBCGogBi0AARABIAAgCDoAACACIAVBCGogBxACQQF0aiIGLQAAIQggBUEIaiAGLQABEAEgACAIOgABIABBAmohAAwBCwsDQCAFQQhqEAQgACADT3JFBEAgAiAFQQhqIAcQAkEBdGoiBC0AACEGIAVBCGogBC0AARABIAAgBjoAACAAQQFqIQAMAQsLA0AgACADT0UEQCACIAVBCGogBxACQQF0aiIELQAAIQYgBUEIaiAELQABEAEgACAGOgAAIABBAWohAAwBCwsgAUFsIAVBCGoQChshAgsgBUEgaiQAIAILtgMBCX8jAEEQayIGJAAgBkEANgIMIAZBADYCCEFUIQQCQAJAIANBQGsiDCADIAZBCGogBkEMaiABIAIQMSICEAMNACAGQQRqIAAQDiAGKAIMIgcgBi0ABEEBaksNASAAQQRqIQogBkEAOgAFIAYgBzoABiAAIAYoAgQ2AgAgB0EBaiEJQQEhBANAIAQgCUkEQCADIARBAnRqIgEoAgAhACABIAU2AgAgACAEQX9qdCAFaiEFIARBAWohBAwBCwsgB0EBaiEHQQAhBSAGKAIIIQkDQCAFIAlGDQEgAyAFIAxqLQAAIgRBAnRqIgBBASAEdEEBdSILIAAoAgAiAWoiADYCACAHIARrIQhBACEEAkAgC0EDTQRAA0AgBCALRg0CIAogASAEakEBdGoiACAIOgABIAAgBToAACAEQQFqIQQMAAALAAsDQCABIABPDQEgCiABQQF0aiIEIAg6AAEgBCAFOgAAIAQgCDoAAyAEIAU6AAIgBCAIOgAFIAQgBToABCAEIAg6AAcgBCAFOgAGIAFBBGohAQwAAAsACyAFQQFqIQUMAAALAAsgAiEECyAGQRBqJAAgBAutAQECfwJAQYQgKAIAIABHIAAoAgBBAXYiAyABa0F4aiICQXhxQQhHcgR/IAIFIAMQJ0UNASACQQhqC0EQSQ0AIAAgACgCACICQQFxIAAgAWpBD2pBeHEiASAAa0EBdHI2AgAgASAANgIEIAEgASgCAEEBcSAAIAJBAXZqIAFrIgJBAXRyNgIAQYQgIAEgAkH/////B3FqQQRqQYQgKAIAIABGGyABNgIAIAEQJQsLygIBBX8CQAJAAkAgAEEIIABBCEsbZ0EfcyAAaUEBR2oiAUEESSAAIAF2cg0AIAFBAnRB/B5qKAIAIgJFDQADQCACQXhqIgMoAgBBAXZBeGoiBSAATwRAIAIgBUEIIAVBCEsbZ0Efc0ECdEGAH2oiASgCAEYEQCABIAIoAgQ2AgALDAMLIARBHksNASAEQQFqIQQgAigCBCICDQALC0EAIQMgAUEgTw0BA0AgAUECdEGAH2ooAgAiAkUEQCABQR5LIQIgAUEBaiEBIAJFDQEMAwsLIAIgAkF4aiIDKAIAQQF2QXhqIgFBCCABQQhLG2dBH3NBAnRBgB9qIgEoAgBGBEAgASACKAIENgIACwsgAigCACIBBEAgASACKAIENgIECyACKAIEIgEEQCABIAIoAgA2AgALIAMgAygCAEEBcjYCACADIAAQNwsgAwvhCwINfwV+IwBB8ABrIgckACAHIAAoAvDhASIINgJcIAEgAmohDSAIIAAoAoDiAWohDwJAAkAgBUUEQCABIQQMAQsgACgCxOABIRAgACgCwOABIREgACgCvOABIQ4gAEEBNgKM4QFBACEIA0AgCEEDRwRAIAcgCEECdCICaiAAIAJqQazQAWooAgA2AkQgCEEBaiEIDAELC0FsIQwgB0EYaiADIAQQBhADDQEgB0EsaiAHQRhqIAAoAgAQEyAHQTRqIAdBGGogACgCCBATIAdBPGogB0EYaiAAKAIEEBMgDUFgaiESIAEhBEEAIQwDQCAHKAIwIAcoAixBA3RqKQIAIhRCEIinQf8BcSEIIAcoAkAgBygCPEEDdGopAgAiFUIQiKdB/wFxIQsgBygCOCAHKAI0QQN0aikCACIWQiCIpyEJIBVCIIghFyAUQiCIpyECAkAgFkIQiKdB/wFxIgNBAk8EQAJAIAZFIANBGUlyRQRAIAkgB0EYaiADQSAgBygCHGsiCiAKIANLGyIKEAUgAyAKayIDdGohCSAHQRhqEAQaIANFDQEgB0EYaiADEAUgCWohCQwBCyAHQRhqIAMQBSAJaiEJIAdBGGoQBBoLIAcpAkQhGCAHIAk2AkQgByAYNwNIDAELAkAgA0UEQCACBEAgBygCRCEJDAMLIAcoAkghCQwBCwJAAkAgB0EYakEBEAUgCSACRWpqIgNBA0YEQCAHKAJEQX9qIgMgA0VqIQkMAQsgA0ECdCAHaigCRCIJIAlFaiEJIANBAUYNAQsgByAHKAJINgJMCwsgByAHKAJENgJIIAcgCTYCRAsgF6chAyALBEAgB0EYaiALEAUgA2ohAwsgCCALakEUTwRAIAdBGGoQBBoLIAgEQCAHQRhqIAgQBSACaiECCyAHQRhqEAQaIAcgB0EYaiAUQhiIp0H/AXEQCCAUp0H//wNxajYCLCAHIAdBGGogFUIYiKdB/wFxEAggFadB//8DcWo2AjwgB0EYahAEGiAHIAdBGGogFkIYiKdB/wFxEAggFqdB//8DcWo2AjQgByACNgJgIAcoAlwhCiAHIAk2AmggByADNgJkAkACQAJAIAQgAiADaiILaiASSw0AIAIgCmoiEyAPSw0AIA0gBGsgC0Egak8NAQsgByAHKQNoNwMQIAcgBykDYDcDCCAEIA0gB0EIaiAHQdwAaiAPIA4gESAQEB4hCwwBCyACIARqIQggBCAKEAcgAkERTwRAIARBEGohAgNAIAIgCkEQaiIKEAcgAkEQaiICIAhJDQALCyAIIAlrIQIgByATNgJcIAkgCCAOa0sEQCAJIAggEWtLBEBBbCELDAILIBAgAiAOayICaiIKIANqIBBNBEAgCCAKIAMQDxoMAgsgCCAKQQAgAmsQDyEIIAcgAiADaiIDNgJkIAggAmshCCAOIQILIAlBEE8EQCADIAhqIQMDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALDAELAkAgCUEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgCUECdCIDQcAeaigCAGoiAhAXIAIgA0HgHmooAgBrIQIgBygCZCEDDAELIAggAhAMCyADQQlJDQAgAyAIaiEDIAhBCGoiCCACQQhqIgJrQQ9MBEADQCAIIAIQDCACQQhqIQIgCEEIaiIIIANJDQAMAgALAAsDQCAIIAIQByACQRBqIQIgCEEQaiIIIANJDQALCyAHQRhqEAQaIAsgDCALEAMiAhshDCAEIAQgC2ogAhshBCAFQX9qIgUNAAsgDBADDQFBbCEMIAdBGGoQBEECSQ0BQQAhCANAIAhBA0cEQCAAIAhBAnQiAmpBrNABaiACIAdqKAJENgIAIAhBAWohCAwBCwsgBygCXCEIC0G6fyEMIA8gCGsiACANIARrSw0AIAQEfyAEIAggABALIABqBUEACyABayEMCyAHQfAAaiQAIAwLkRcCFn8FfiMAQdABayIHJAAgByAAKALw4QEiCDYCvAEgASACaiESIAggACgCgOIBaiETAkACQCAFRQRAIAEhAwwBCyAAKALE4AEhESAAKALA4AEhFSAAKAK84AEhDyAAQQE2AozhAUEAIQgDQCAIQQNHBEAgByAIQQJ0IgJqIAAgAmpBrNABaigCADYCVCAIQQFqIQgMAQsLIAcgETYCZCAHIA82AmAgByABIA9rNgJoQWwhECAHQShqIAMgBBAGEAMNASAFQQQgBUEESBshFyAHQTxqIAdBKGogACgCABATIAdBxABqIAdBKGogACgCCBATIAdBzABqIAdBKGogACgCBBATQQAhBCAHQeAAaiEMIAdB5ABqIQoDQCAHQShqEARBAksgBCAXTnJFBEAgBygCQCAHKAI8QQN0aikCACIdQhCIp0H/AXEhCyAHKAJQIAcoAkxBA3RqKQIAIh5CEIinQf8BcSEJIAcoAkggBygCREEDdGopAgAiH0IgiKchCCAeQiCIISAgHUIgiKchAgJAIB9CEIinQf8BcSIDQQJPBEACQCAGRSADQRlJckUEQCAIIAdBKGogA0EgIAcoAixrIg0gDSADSxsiDRAFIAMgDWsiA3RqIQggB0EoahAEGiADRQ0BIAdBKGogAxAFIAhqIQgMAQsgB0EoaiADEAUgCGohCCAHQShqEAQaCyAHKQJUISEgByAINgJUIAcgITcDWAwBCwJAIANFBEAgAgRAIAcoAlQhCAwDCyAHKAJYIQgMAQsCQAJAIAdBKGpBARAFIAggAkVqaiIDQQNGBEAgBygCVEF/aiIDIANFaiEIDAELIANBAnQgB2ooAlQiCCAIRWohCCADQQFGDQELIAcgBygCWDYCXAsLIAcgBygCVDYCWCAHIAg2AlQLICCnIQMgCQRAIAdBKGogCRAFIANqIQMLIAkgC2pBFE8EQCAHQShqEAQaCyALBEAgB0EoaiALEAUgAmohAgsgB0EoahAEGiAHIAcoAmggAmoiCSADajYCaCAKIAwgCCAJSxsoAgAhDSAHIAdBKGogHUIYiKdB/wFxEAggHadB//8DcWo2AjwgByAHQShqIB5CGIinQf8BcRAIIB6nQf//A3FqNgJMIAdBKGoQBBogB0EoaiAfQhiIp0H/AXEQCCEOIAdB8ABqIARBBHRqIgsgCSANaiAIazYCDCALIAg2AgggCyADNgIEIAsgAjYCACAHIA4gH6dB//8DcWo2AkQgBEEBaiEEDAELCyAEIBdIDQEgEkFgaiEYIAdB4ABqIRogB0HkAGohGyABIQMDQCAHQShqEARBAksgBCAFTnJFBEAgBygCQCAHKAI8QQN0aikCACIdQhCIp0H/AXEhCyAHKAJQIAcoAkxBA3RqKQIAIh5CEIinQf8BcSEIIAcoAkggBygCREEDdGopAgAiH0IgiKchCSAeQiCIISAgHUIgiKchDAJAIB9CEIinQf8BcSICQQJPBEACQCAGRSACQRlJckUEQCAJIAdBKGogAkEgIAcoAixrIgogCiACSxsiChAFIAIgCmsiAnRqIQkgB0EoahAEGiACRQ0BIAdBKGogAhAFIAlqIQkMAQsgB0EoaiACEAUgCWohCSAHQShqEAQaCyAHKQJUISEgByAJNgJUIAcgITcDWAwBCwJAIAJFBEAgDARAIAcoAlQhCQwDCyAHKAJYIQkMAQsCQAJAIAdBKGpBARAFIAkgDEVqaiICQQNGBEAgBygCVEF/aiICIAJFaiEJDAELIAJBAnQgB2ooAlQiCSAJRWohCSACQQFGDQELIAcgBygCWDYCXAsLIAcgBygCVDYCWCAHIAk2AlQLICCnIRQgCARAIAdBKGogCBAFIBRqIRQLIAggC2pBFE8EQCAHQShqEAQaCyALBEAgB0EoaiALEAUgDGohDAsgB0EoahAEGiAHIAcoAmggDGoiGSAUajYCaCAbIBogCSAZSxsoAgAhHCAHIAdBKGogHUIYiKdB/wFxEAggHadB//8DcWo2AjwgByAHQShqIB5CGIinQf8BcRAIIB6nQf//A3FqNgJMIAdBKGoQBBogByAHQShqIB9CGIinQf8BcRAIIB+nQf//A3FqNgJEIAcgB0HwAGogBEEDcUEEdGoiDSkDCCIdNwPIASAHIA0pAwAiHjcDwAECQAJAAkAgBygCvAEiDiAepyICaiIWIBNLDQAgAyAHKALEASIKIAJqIgtqIBhLDQAgEiADayALQSBqTw0BCyAHIAcpA8gBNwMQIAcgBykDwAE3AwggAyASIAdBCGogB0G8AWogEyAPIBUgERAeIQsMAQsgAiADaiEIIAMgDhAHIAJBEU8EQCADQRBqIQIDQCACIA5BEGoiDhAHIAJBEGoiAiAISQ0ACwsgCCAdpyIOayECIAcgFjYCvAEgDiAIIA9rSwRAIA4gCCAVa0sEQEFsIQsMAgsgESACIA9rIgJqIhYgCmogEU0EQCAIIBYgChAPGgwCCyAIIBZBACACaxAPIQggByACIApqIgo2AsQBIAggAmshCCAPIQILIA5BEE8EQCAIIApqIQoDQCAIIAIQByACQRBqIQIgCEEQaiIIIApJDQALDAELAkAgDkEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgDkECdCIKQcAeaigCAGoiAhAXIAIgCkHgHmooAgBrIQIgBygCxAEhCgwBCyAIIAIQDAsgCkEJSQ0AIAggCmohCiAIQQhqIgggAkEIaiICa0EPTARAA0AgCCACEAwgAkEIaiECIAhBCGoiCCAKSQ0ADAIACwALA0AgCCACEAcgAkEQaiECIAhBEGoiCCAKSQ0ACwsgCxADBEAgCyEQDAQFIA0gDDYCACANIBkgHGogCWs2AgwgDSAJNgIIIA0gFDYCBCAEQQFqIQQgAyALaiEDDAILAAsLIAQgBUgNASAEIBdrIQtBACEEA0AgCyAFSARAIAcgB0HwAGogC0EDcUEEdGoiAikDCCIdNwPIASAHIAIpAwAiHjcDwAECQAJAAkAgBygCvAEiDCAepyICaiIKIBNLDQAgAyAHKALEASIJIAJqIhBqIBhLDQAgEiADayAQQSBqTw0BCyAHIAcpA8gBNwMgIAcgBykDwAE3AxggAyASIAdBGGogB0G8AWogEyAPIBUgERAeIRAMAQsgAiADaiEIIAMgDBAHIAJBEU8EQCADQRBqIQIDQCACIAxBEGoiDBAHIAJBEGoiAiAISQ0ACwsgCCAdpyIGayECIAcgCjYCvAEgBiAIIA9rSwRAIAYgCCAVa0sEQEFsIRAMAgsgESACIA9rIgJqIgwgCWogEU0EQCAIIAwgCRAPGgwCCyAIIAxBACACaxAPIQggByACIAlqIgk2AsQBIAggAmshCCAPIQILIAZBEE8EQCAIIAlqIQYDQCAIIAIQByACQRBqIQIgCEEQaiIIIAZJDQALDAELAkAgBkEHTQRAIAggAi0AADoAACAIIAItAAE6AAEgCCACLQACOgACIAggAi0AAzoAAyAIQQRqIAIgBkECdCIGQcAeaigCAGoiAhAXIAIgBkHgHmooAgBrIQIgBygCxAEhCQwBCyAIIAIQDAsgCUEJSQ0AIAggCWohBiAIQQhqIgggAkEIaiICa0EPTARAA0AgCCACEAwgAkEIaiECIAhBCGoiCCAGSQ0ADAIACwALA0AgCCACEAcgAkEQaiECIAhBEGoiCCAGSQ0ACwsgEBADDQMgC0EBaiELIAMgEGohAwwBCwsDQCAEQQNHBEAgACAEQQJ0IgJqQazQAWogAiAHaigCVDYCACAEQQFqIQQMAQsLIAcoArwBIQgLQbp/IRAgEyAIayIAIBIgA2tLDQAgAwR/IAMgCCAAEAsgAGoFQQALIAFrIRALIAdB0AFqJAAgEAslACAAQgA3AgAgAEEAOwEIIABBADoACyAAIAE2AgwgACACOgAKC7QFAQN/IwBBMGsiBCQAIABB/wFqIgVBfWohBgJAIAMvAQIEQCAEQRhqIAEgAhAGIgIQAw0BIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahASOgAAIAMgBEEIaiAEQRhqEBI6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0FIAEgBEEQaiAEQRhqEBI6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBSABIARBCGogBEEYahASOgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEjoAACABIAJqIABrIQIMAwsgAyAEQRBqIARBGGoQEjoAAiADIARBCGogBEEYahASOgADIANBBGohAwwAAAsACyAEQRhqIAEgAhAGIgIQAw0AIARBEGogBEEYaiADEBwgBEEIaiAEQRhqIAMQHCAAIQMDQAJAIARBGGoQBCADIAZPckUEQCADIARBEGogBEEYahAROgAAIAMgBEEIaiAEQRhqEBE6AAEgBEEYahAERQ0BIANBAmohAwsgBUF+aiEFAn8DQEG6fyECIAMiASAFSw0EIAEgBEEQaiAEQRhqEBE6AAAgAUEBaiEDIARBGGoQBEEDRgRAQQIhAiAEQQhqDAILIAMgBUsNBCABIARBCGogBEEYahAROgABIAFBAmohA0EDIQIgBEEYahAEQQNHDQALIARBEGoLIQUgAyAFIARBGGoQEToAACABIAJqIABrIQIMAgsgAyAEQRBqIARBGGoQEToAAiADIARBCGogBEEYahAROgADIANBBGohAwwAAAsACyAEQTBqJAAgAgtpAQF/An8CQAJAIAJBB00NACABKAAAQbfIwuF+Rw0AIAAgASgABDYCmOIBQWIgAEEQaiABIAIQPiIDEAMNAhogAEKBgICAEDcDiOEBIAAgASADaiACIANrECoMAQsgACABIAIQKgtBAAsLrQMBBn8jAEGAAWsiAyQAQWIhCAJAIAJBCUkNACAAQZjQAGogAUEIaiIEIAJBeGogAEGY0AAQMyIFEAMiBg0AIANBHzYCfCADIANB/ABqIANB+ABqIAQgBCAFaiAGGyIEIAEgAmoiAiAEaxAVIgUQAw0AIAMoAnwiBkEfSw0AIAMoAngiB0EJTw0AIABBiCBqIAMgBkGAC0GADCAHEBggA0E0NgJ8IAMgA0H8AGogA0H4AGogBCAFaiIEIAIgBGsQFSIFEAMNACADKAJ8IgZBNEsNACADKAJ4IgdBCk8NACAAQZAwaiADIAZBgA1B4A4gBxAYIANBIzYCfCADIANB/ABqIANB+ABqIAQgBWoiBCACIARrEBUiBRADDQAgAygCfCIGQSNLDQAgAygCeCIHQQpPDQAgACADIAZBwBBB0BEgBxAYIAQgBWoiBEEMaiIFIAJLDQAgAiAFayEFQQAhAgNAIAJBA0cEQCAEKAAAIgZBf2ogBU8NAiAAIAJBAnRqQZzQAWogBjYCACACQQFqIQIgBEEEaiEEDAELCyAEIAFrIQgLIANBgAFqJAAgCAtGAQN/IABBCGohAyAAKAIEIQJBACEAA0AgACACdkUEQCABIAMgAEEDdGotAAJBFktqIQEgAEEBaiEADAELCyABQQggAmt0C4YDAQV/Qbh/IQcCQCADRQ0AIAItAAAiBEUEQCABQQA2AgBBAUG4fyADQQFGGw8LAn8gAkEBaiIFIARBGHRBGHUiBkF/Sg0AGiAGQX9GBEAgA0EDSA0CIAUvAABBgP4BaiEEIAJBA2oMAQsgA0ECSA0BIAItAAEgBEEIdHJBgIB+aiEEIAJBAmoLIQUgASAENgIAIAVBAWoiASACIANqIgNLDQBBbCEHIABBEGogACAFLQAAIgVBBnZBI0EJIAEgAyABa0HAEEHQEUHwEiAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBmCBqIABBCGogBUEEdkEDcUEfQQggASABIAZqIAgbIgEgAyABa0GAC0GADEGAFyAAKAKM4QEgACgCnOIBIAQQHyIGEAMiCA0AIABBoDBqIABBBGogBUECdkEDcUE0QQkgASABIAZqIAgbIgEgAyABa0GADUHgDkGQGSAAKAKM4QEgACgCnOIBIAQQHyIAEAMNACAAIAFqIAJrIQcLIAcLrQMBCn8jAEGABGsiCCQAAn9BUiACQf8BSw0AGkFUIANBDEsNABogAkEBaiELIABBBGohCUGAgAQgA0F/anRBEHUhCkEAIQJBASEEQQEgA3QiB0F/aiIMIQUDQCACIAtGRQRAAkAgASACQQF0Ig1qLwEAIgZB//8DRgRAIAkgBUECdGogAjoAAiAFQX9qIQVBASEGDAELIARBACAKIAZBEHRBEHVKGyEECyAIIA1qIAY7AQAgAkEBaiECDAELCyAAIAQ7AQIgACADOwEAIAdBA3YgB0EBdmpBA2ohBkEAIQRBACECA0AgBCALRkUEQCABIARBAXRqLgEAIQpBACEAA0AgACAKTkUEQCAJIAJBAnRqIAQ6AAIDQCACIAZqIAxxIgIgBUsNAAsgAEEBaiEADAELCyAEQQFqIQQMAQsLQX8gAg0AGkEAIQIDfyACIAdGBH9BAAUgCCAJIAJBAnRqIgAtAAJBAXRqIgEgAS8BACIBQQFqOwEAIAAgAyABEBRrIgU6AAMgACABIAVB/wFxdCAHazsBACACQQFqIQIMAQsLCyEFIAhBgARqJAAgBQvjBgEIf0FsIQcCQCACQQNJDQACQAJAAkACQCABLQAAIgNBA3EiCUEBaw4DAwEAAgsgACgCiOEBDQBBYg8LIAJBBUkNAkEDIQYgASgAACEFAn8CQAJAIANBAnZBA3EiCEF+aiIEQQFNBEAgBEEBaw0BDAILIAVBDnZB/wdxIQQgBUEEdkH/B3EhAyAIRQwCCyAFQRJ2IQRBBCEGIAVBBHZB//8AcSEDQQAMAQsgBUEEdkH//w9xIgNBgIAISw0DIAEtAARBCnQgBUEWdnIhBEEFIQZBAAshBSAEIAZqIgogAksNAgJAIANBgQZJDQAgACgCnOIBRQ0AQQAhAgNAIAJBg4ABSw0BIAJBQGshAgwAAAsACwJ/IAlBA0YEQCABIAZqIQEgAEHw4gFqIQIgACgCDCEGIAUEQCACIAMgASAEIAYQXwwCCyACIAMgASAEIAYQXQwBCyAAQbjQAWohAiABIAZqIQEgAEHw4gFqIQYgAEGo0ABqIQggBQRAIAggBiADIAEgBCACEF4MAQsgCCAGIAMgASAEIAIQXAsQAw0CIAAgAzYCgOIBIABBATYCiOEBIAAgAEHw4gFqNgLw4QEgCUECRgRAIAAgAEGo0ABqNgIMCyAAIANqIgBBiOMBakIANwAAIABBgOMBakIANwAAIABB+OIBakIANwAAIABB8OIBakIANwAAIAoPCwJ/AkACQAJAIANBAnZBA3FBf2oiBEECSw0AIARBAWsOAgACAQtBASEEIANBA3YMAgtBAiEEIAEvAABBBHYMAQtBAyEEIAEQIUEEdgsiAyAEaiIFQSBqIAJLBEAgBSACSw0CIABB8OIBaiABIARqIAMQCyEBIAAgAzYCgOIBIAAgATYC8OEBIAEgA2oiAEIANwAYIABCADcAECAAQgA3AAggAEIANwAAIAUPCyAAIAM2AoDiASAAIAEgBGo2AvDhASAFDwsCfwJAAkACQCADQQJ2QQNxQX9qIgRBAksNACAEQQFrDgIAAgELQQEhByADQQN2DAILQQIhByABLwAAQQR2DAELIAJBBEkgARAhIgJBj4CAAUtyDQFBAyEHIAJBBHYLIQIgAEHw4gFqIAEgB2otAAAgAkEgahAQIQEgACACNgKA4gEgACABNgLw4QEgB0EBaiEHCyAHC0sAIABC+erQ0OfJoeThADcDICAAQgA3AxggAELP1tO+0ser2UI3AxAgAELW64Lu6v2J9eAANwMIIABCADcDACAAQShqQQBBKBAQGgviAgICfwV+IABBKGoiASAAKAJIaiECAn4gACkDACIDQiBaBEAgACkDECIEQgeJIAApAwgiBUIBiXwgACkDGCIGQgyJfCAAKQMgIgdCEol8IAUQGSAEEBkgBhAZIAcQGQwBCyAAKQMYQsXP2bLx5brqJ3wLIAN8IQMDQCABQQhqIgAgAk0EQEIAIAEpAAAQCSADhUIbiUKHla+vmLbem55/fkLj3MqV/M7y9YV/fCEDIAAhAQwBCwsCQCABQQRqIgAgAksEQCABIQAMAQsgASgAAK1Ch5Wvr5i23puef34gA4VCF4lCz9bTvtLHq9lCfkL5893xmfaZqxZ8IQMLA0AgACACSQRAIAAxAABCxc/ZsvHluuonfiADhUILiUKHla+vmLbem55/fiEDIABBAWohAAwBCwsgA0IhiCADhULP1tO+0ser2UJ+IgNCHYggA4VC+fPd8Zn2masWfiIDQiCIIAOFC+8CAgJ/BH4gACAAKQMAIAKtfDcDAAJAAkAgACgCSCIDIAJqIgRBH00EQCABRQ0BIAAgA2pBKGogASACECAgACgCSCACaiEEDAELIAEgAmohAgJ/IAMEQCAAQShqIgQgA2ogAUEgIANrECAgACAAKQMIIAQpAAAQCTcDCCAAIAApAxAgACkAMBAJNwMQIAAgACkDGCAAKQA4EAk3AxggACAAKQMgIABBQGspAAAQCTcDICAAKAJIIQMgAEEANgJIIAEgA2tBIGohAQsgAUEgaiACTQsEQCACQWBqIQMgACkDICEFIAApAxghBiAAKQMQIQcgACkDCCEIA0AgCCABKQAAEAkhCCAHIAEpAAgQCSEHIAYgASkAEBAJIQYgBSABKQAYEAkhBSABQSBqIgEgA00NAAsgACAFNwMgIAAgBjcDGCAAIAc3AxAgACAINwMICyABIAJPDQEgAEEoaiABIAIgAWsiBBAgCyAAIAQ2AkgLCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQEBogAwVBun8LCy8BAX8gAEUEQEG2f0EAIAMbDwtBun8hBCADIAFNBH8gACACIAMQCxogAwVBun8LC6gCAQZ/IwBBEGsiByQAIABB2OABaikDAEKAgIAQViEIQbh/IQUCQCAEQf//B0sNACAAIAMgBBBCIgUQAyIGDQAgACgCnOIBIQkgACAHQQxqIAMgAyAFaiAGGyIKIARBACAFIAYbayIGEEAiAxADBEAgAyEFDAELIAcoAgwhBCABRQRAQbp/IQUgBEEASg0BCyAGIANrIQUgAyAKaiEDAkAgCQRAIABBADYCnOIBDAELAkACQAJAIARBBUgNACAAQdjgAWopAwBCgICACFgNAAwBCyAAQQA2ApziAQwBCyAAKAIIED8hBiAAQQA2ApziASAGQRRPDQELIAAgASACIAMgBSAEIAgQOSEFDAELIAAgASACIAMgBSAEIAgQOiEFCyAHQRBqJAAgBQtnACAAQdDgAWogASACIAAoAuzhARAuIgEQAwRAIAEPC0G4fyECAkAgAQ0AIABB7OABaigCACIBBEBBYCECIAAoApjiASABRw0BC0EAIQIgAEHw4AFqKAIARQ0AIABBkOEBahBDCyACCycBAX8QVyIERQRAQUAPCyAEIAAgASACIAMgBBBLEE8hACAEEFYgAAs/AQF/AkACQAJAIAAoAqDiAUEBaiIBQQJLDQAgAUEBaw4CAAECCyAAEDBBAA8LIABBADYCoOIBCyAAKAKU4gELvAMCB38BfiMAQRBrIgkkAEG4fyEGAkAgBCgCACIIQQVBCSAAKALs4QEiBRtJDQAgAygCACIHQQFBBSAFGyAFEC8iBRADBEAgBSEGDAELIAggBUEDakkNACAAIAcgBRBJIgYQAw0AIAEgAmohCiAAQZDhAWohCyAIIAVrIQIgBSAHaiEHIAEhBQNAIAcgAiAJECwiBhADDQEgAkF9aiICIAZJBEBBuH8hBgwCCyAJKAIAIghBAksEQEFsIQYMAgsgB0EDaiEHAn8CQAJAAkAgCEEBaw4CAgABCyAAIAUgCiAFayAHIAYQSAwCCyAFIAogBWsgByAGEEcMAQsgBSAKIAVrIActAAAgCSgCCBBGCyIIEAMEQCAIIQYMAgsgACgC8OABBEAgCyAFIAgQRQsgAiAGayECIAYgB2ohByAFIAhqIQUgCSgCBEUNAAsgACkD0OABIgxCf1IEQEFsIQYgDCAFIAFrrFINAQsgACgC8OABBEBBaiEGIAJBBEkNASALEEQhDCAHKAAAIAynRw0BIAdBBGohByACQXxqIQILIAMgBzYCACAEIAI2AgAgBSABayEGCyAJQRBqJAAgBgsuACAAECsCf0EAQQAQAw0AGiABRSACRXJFBEBBYiAAIAEgAhA9EAMNARoLQQALCzcAIAEEQCAAIAAoAsTgASABKAIEIAEoAghqRzYCnOIBCyAAECtBABADIAFFckUEQCAAIAEQWwsL0QIBB38jAEEQayIGJAAgBiAENgIIIAYgAzYCDCAFBEAgBSgCBCEKIAUoAgghCQsgASEIAkACQANAIAAoAuzhARAWIQsCQANAIAQgC0kNASADKAAAQXBxQdDUtMIBRgRAIAMgBBAiIgcQAw0EIAQgB2shBCADIAdqIQMMAQsLIAYgAzYCDCAGIAQ2AggCQCAFBEAgACAFEE5BACEHQQAQA0UNAQwFCyAAIAogCRBNIgcQAw0ECyAAIAgQUCAMQQFHQQAgACAIIAIgBkEMaiAGQQhqEEwiByIDa0EAIAMQAxtBCkdyRQRAQbh/IQcMBAsgBxADDQMgAiAHayECIAcgCGohCEEBIQwgBigCDCEDIAYoAgghBAwBCwsgBiADNgIMIAYgBDYCCEG4fyEHIAQNASAIIAFrIQcMAQsgBiADNgIMIAYgBDYCCAsgBkEQaiQAIAcLRgECfyABIAAoArjgASICRwRAIAAgAjYCxOABIAAgATYCuOABIAAoArzgASEDIAAgATYCvOABIAAgASADIAJrajYCwOABCwutAgIEfwF+IwBBQGoiBCQAAkACQCACQQhJDQAgASgAAEFwcUHQ1LTCAUcNACABIAIQIiEBIABCADcDCCAAQQA2AgQgACABNgIADAELIARBGGogASACEC0iAxADBEAgACADEBoMAQsgAwRAIABBuH8QGgwBCyACIAQoAjAiA2shAiABIANqIQMDQAJAIAAgAyACIARBCGoQLCIFEAMEfyAFBSACIAVBA2oiBU8NAUG4fwsQGgwCCyAGQQFqIQYgAiAFayECIAMgBWohAyAEKAIMRQ0ACyAEKAI4BEAgAkEDTQRAIABBuH8QGgwCCyADQQRqIQMLIAQoAighAiAEKQMYIQcgAEEANgIEIAAgAyABazYCACAAIAIgBmytIAcgB0J/URs3AwgLIARBQGskAAslAQF/IwBBEGsiAiQAIAIgACABEFEgAigCACEAIAJBEGokACAAC30BBH8jAEGQBGsiBCQAIARB/wE2AggCQCAEQRBqIARBCGogBEEMaiABIAIQFSIGEAMEQCAGIQUMAQtBVCEFIAQoAgwiB0EGSw0AIAMgBEEQaiAEKAIIIAcQQSIFEAMNACAAIAEgBmogAiAGayADEDwhBQsgBEGQBGokACAFC4cBAgJ/An5BABAWIQMCQANAIAEgA08EQAJAIAAoAABBcHFB0NS0wgFGBEAgACABECIiAhADRQ0BQn4PCyAAIAEQVSIEQn1WDQMgBCAFfCIFIARUIQJCfiEEIAINAyAAIAEQUiICEAMNAwsgASACayEBIAAgAmohAAwBCwtCfiAFIAEbIQQLIAQLPwIBfwF+IwBBMGsiAiQAAn5CfiACQQhqIAAgARAtDQAaQgAgAigCHEEBRg0AGiACKQMICyEDIAJBMGokACADC40BAQJ/IwBBMGsiASQAAkAgAEUNACAAKAKI4gENACABIABB/OEBaigCADYCKCABIAApAvThATcDICAAEDAgACgCqOIBIQIgASABKAIoNgIYIAEgASkDIDcDECACIAFBEGoQGyAAQQA2AqjiASABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALKgECfyMAQRBrIgAkACAAQQA2AgggAEIANwMAIAAQWCEBIABBEGokACABC4cBAQN/IwBBEGsiAiQAAkAgACgCAEUgACgCBEVzDQAgAiAAKAIINgIIIAIgACkCADcDAAJ/IAIoAgAiAQRAIAIoAghBqOMJIAERBQAMAQtBqOMJECgLIgFFDQAgASAAKQIANwL04QEgAUH84QFqIAAoAgg2AgAgARBZIAEhAwsgAkEQaiQAIAMLywEBAn8jAEEgayIBJAAgAEGBgIDAADYCtOIBIABBADYCiOIBIABBADYC7OEBIABCADcDkOIBIABBADYCpOMJIABBADYC3OIBIABCADcCzOIBIABBADYCvOIBIABBADYCxOABIABCADcCnOIBIABBpOIBakIANwIAIABBrOIBakEANgIAIAFCADcCECABQgA3AhggASABKQMYNwMIIAEgASkDEDcDACABKAIIQQh2QQFxIQIgAEEANgLg4gEgACACNgKM4gEgAUEgaiQAC3YBA38jAEEwayIBJAAgAARAIAEgAEHE0AFqIgIoAgA2AiggASAAKQK80AE3AyAgACgCACEDIAEgAigCADYCGCABIAApArzQATcDECADIAFBEGoQGyABIAEoAig2AgggASABKQMgNwMAIAAgARAbCyABQTBqJAALzAEBAX8gACABKAK00AE2ApjiASAAIAEoAgQiAjYCwOABIAAgAjYCvOABIAAgAiABKAIIaiICNgK44AEgACACNgLE4AEgASgCuNABBEAgAEKBgICAEDcDiOEBIAAgAUGk0ABqNgIMIAAgAUGUIGo2AgggACABQZwwajYCBCAAIAFBDGo2AgAgAEGs0AFqIAFBqNABaigCADYCACAAQbDQAWogAUGs0AFqKAIANgIAIABBtNABaiABQbDQAWooAgA2AgAPCyAAQgA3A4jhAQs7ACACRQRAQbp/DwsgBEUEQEFsDwsgAiAEEGAEQCAAIAEgAiADIAQgBRBhDwsgACABIAIgAyAEIAUQZQtGAQF/IwBBEGsiBSQAIAVBCGogBBAOAn8gBS0ACQRAIAAgASACIAMgBBAyDAELIAAgASACIAMgBBA0CyEAIAVBEGokACAACzQAIAAgAyAEIAUQNiIFEAMEQCAFDwsgBSAESQR/IAEgAiADIAVqIAQgBWsgABA1BUG4fwsLRgEBfyMAQRBrIgUkACAFQQhqIAQQDgJ/IAUtAAkEQCAAIAEgAiADIAQQYgwBCyAAIAEgAiADIAQQNQshACAFQRBqJAAgAAtZAQF/QQ8hAiABIABJBEAgAUEEdCAAbiECCyAAQQh2IgEgAkEYbCIAQYwIaigCAGwgAEGICGooAgBqIgJBA3YgAmogAEGACGooAgAgAEGECGooAgAgAWxqSQs3ACAAIAMgBCAFQYAQEDMiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQMgVBuH8LC78DAQN/IwBBIGsiBSQAIAVBCGogAiADEAYiAhADRQRAIAAgAWoiB0F9aiEGIAUgBBAOIARBBGohAiAFLQACIQMDQEEAIAAgBkkgBUEIahAEGwRAIAAgAiAFQQhqIAMQAkECdGoiBC8BADsAACAFQQhqIAQtAAIQASAAIAQtAANqIgQgAiAFQQhqIAMQAkECdGoiAC8BADsAACAFQQhqIAAtAAIQASAEIAAtAANqIQAMAQUgB0F+aiEEA0AgBUEIahAEIAAgBEtyRQRAIAAgAiAFQQhqIAMQAkECdGoiBi8BADsAACAFQQhqIAYtAAIQASAAIAYtAANqIQAMAQsLA0AgACAES0UEQCAAIAIgBUEIaiADEAJBAnRqIgYvAQA7AAAgBUEIaiAGLQACEAEgACAGLQADaiEADAELCwJAIAAgB08NACAAIAIgBUEIaiADEAIiA0ECdGoiAC0AADoAACAALQADQQFGBEAgBUEIaiAALQACEAEMAQsgBSgCDEEfSw0AIAVBCGogAiADQQJ0ai0AAhABIAUoAgxBIUkNACAFQSA2AgwLIAFBbCAFQQhqEAobIQILCwsgBUEgaiQAIAILkgIBBH8jAEFAaiIJJAAgCSADQTQQCyEDAkAgBEECSA0AIAMgBEECdGooAgAhCSADQTxqIAgQIyADQQE6AD8gAyACOgA+QQAhBCADKAI8IQoDQCAEIAlGDQEgACAEQQJ0aiAKNgEAIARBAWohBAwAAAsAC0EAIQkDQCAGIAlGRQRAIAMgBSAJQQF0aiIKLQABIgtBAnRqIgwoAgAhBCADQTxqIAotAABBCHQgCGpB//8DcRAjIANBAjoAPyADIAcgC2siCiACajoAPiAEQQEgASAKa3RqIQogAygCPCELA0AgACAEQQJ0aiALNgEAIARBAWoiBCAKSQ0ACyAMIAo2AgAgCUEBaiEJDAELCyADQUBrJAALowIBCX8jAEHQAGsiCSQAIAlBEGogBUE0EAsaIAcgBmshDyAHIAFrIRADQAJAIAMgCkcEQEEBIAEgByACIApBAXRqIgYtAAEiDGsiCGsiC3QhDSAGLQAAIQ4gCUEQaiAMQQJ0aiIMKAIAIQYgCyAPTwRAIAAgBkECdGogCyAIIAUgCEE0bGogCCAQaiIIQQEgCEEBShsiCCACIAQgCEECdGooAgAiCEEBdGogAyAIayAHIA4QYyAGIA1qIQgMAgsgCUEMaiAOECMgCUEBOgAPIAkgCDoADiAGIA1qIQggCSgCDCELA0AgBiAITw0CIAAgBkECdGogCzYBACAGQQFqIQYMAAALAAsgCUHQAGokAA8LIAwgCDYCACAKQQFqIQoMAAALAAs0ACAAIAMgBCAFEDYiBRADBEAgBQ8LIAUgBEkEfyABIAIgAyAFaiAEIAVrIAAQNAVBuH8LCyMAIAA/AEEQdGtB//8DakEQdkAAQX9GBEBBAA8LQQAQAEEBCzsBAX8gAgRAA0AgACABIAJBgCAgAkGAIEkbIgMQCyEAIAFBgCBqIQEgAEGAIGohACACIANrIgINAAsLCwYAIAAQAwsLqBUJAEGICAsNAQAAAAEAAAACAAAAAgBBoAgLswYBAAAAAQAAAAIAAAACAAAAJgAAAIIAAAAhBQAASgAAAGcIAAAmAAAAwAEAAIAAAABJBQAASgAAAL4IAAApAAAALAIAAIAAAABJBQAASgAAAL4IAAAvAAAAygIAAIAAAACKBQAASgAAAIQJAAA1AAAAcwMAAIAAAACdBQAASgAAAKAJAAA9AAAAgQMAAIAAAADrBQAASwAAAD4KAABEAAAAngMAAIAAAABNBgAASwAAAKoKAABLAAAAswMAAIAAAADBBgAATQAAAB8NAABNAAAAUwQAAIAAAAAjCAAAUQAAAKYPAABUAAAAmQQAAIAAAABLCQAAVwAAALESAABYAAAA2gQAAIAAAABvCQAAXQAAACMUAABUAAAARQUAAIAAAABUCgAAagAAAIwUAABqAAAArwUAAIAAAAB2CQAAfAAAAE4QAAB8AAAA0gIAAIAAAABjBwAAkQAAAJAHAACSAAAAAAAAAAEAAAABAAAABQAAAA0AAAAdAAAAPQAAAH0AAAD9AAAA/QEAAP0DAAD9BwAA/Q8AAP0fAAD9PwAA/X8AAP3/AAD9/wEA/f8DAP3/BwD9/w8A/f8fAP3/PwD9/38A/f//AP3//wH9//8D/f//B/3//w/9//8f/f//P/3//38AAAAAAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAAAYAAAAGQAAABoAAAAbAAAAHAAAAB0AAAAeAAAAHwAAAAMAAAAEAAAABQAAAAYAAAAHAAAACAAAAAkAAAAKAAAACwAAAAwAAAANAAAADgAAAA8AAAAQAAAAEQAAABIAAAATAAAAFAAAABUAAAAWAAAAFwAAABgAAAAZAAAAGgAAABsAAAAcAAAAHQAAAB4AAAAfAAAAIAAAACEAAAAiAAAAIwAAACUAAAAnAAAAKQAAACsAAAAvAAAAMwAAADsAAABDAAAAUwAAAGMAAACDAAAAAwEAAAMCAAADBAAAAwgAAAMQAAADIAAAA0AAAAOAAAADAAEAQeAPC1EBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAEAAAABQAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAAOAAAADwAAABAAQcQQC4sBAQAAAAIAAAADAAAABAAAAAUAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAABIAAAAUAAAAFgAAABgAAAAcAAAAIAAAACgAAAAwAAAAQAAAAIAAAAAAAQAAAAIAAAAEAAAACAAAABAAAAAgAAAAQAAAAIAAAAAAAQBBkBIL5gQBAAAAAQAAAAEAAAABAAAAAgAAAAIAAAADAAAAAwAAAAQAAAAGAAAABwAAAAgAAAAJAAAACgAAAAsAAAAMAAAADQAAAA4AAAAPAAAAEAAAAAEAAAAEAAAACAAAAAAAAAABAAEBBgAAAAAAAAQAAAAAEAAABAAAAAAgAAAFAQAAAAAAAAUDAAAAAAAABQQAAAAAAAAFBgAAAAAAAAUHAAAAAAAABQkAAAAAAAAFCgAAAAAAAAUMAAAAAAAABg4AAAAAAAEFEAAAAAAAAQUUAAAAAAABBRYAAAAAAAIFHAAAAAAAAwUgAAAAAAAEBTAAAAAgAAYFQAAAAAAABwWAAAAAAAAIBgABAAAAAAoGAAQAAAAADAYAEAAAIAAABAAAAAAAAAAEAQAAAAAAAAUCAAAAIAAABQQAAAAAAAAFBQAAACAAAAUHAAAAAAAABQgAAAAgAAAFCgAAAAAAAAULAAAAAAAABg0AAAAgAAEFEAAAAAAAAQUSAAAAIAABBRYAAAAAAAIFGAAAACAAAwUgAAAAAAADBSgAAAAAAAYEQAAAABAABgRAAAAAIAAHBYAAAAAAAAkGAAIAAAAACwYACAAAMAAABAAAAAAQAAAEAQAAACAAAAUCAAAAIAAABQMAAAAgAAAFBQAAACAAAAUGAAAAIAAABQgAAAAgAAAFCQAAACAAAAULAAAAIAAABQwAAAAAAAAGDwAAACAAAQUSAAAAIAABBRQAAAAgAAIFGAAAACAAAgUcAAAAIAADBSgAAAAgAAQFMAAAAAAAEAYAAAEAAAAPBgCAAAAAAA4GAEAAAAAADQYAIABBgBcLhwIBAAEBBQAAAAAAAAUAAAAAAAAGBD0AAAAAAAkF/QEAAAAADwX9fwAAAAAVBf3/HwAAAAMFBQAAAAAABwR9AAAAAAAMBf0PAAAAABIF/f8DAAAAFwX9/38AAAAFBR0AAAAAAAgE/QAAAAAADgX9PwAAAAAUBf3/DwAAAAIFAQAAABAABwR9AAAAAAALBf0HAAAAABEF/f8BAAAAFgX9/z8AAAAEBQ0AAAAQAAgE/QAAAAAADQX9HwAAAAATBf3/BwAAAAEFAQAAABAABgQ9AAAAAAAKBf0DAAAAABAF/f8AAAAAHAX9//8PAAAbBf3//wcAABoF/f//AwAAGQX9//8BAAAYBf3//wBBkBkLhgQBAAEBBgAAAAAAAAYDAAAAAAAABAQAAAAgAAAFBQAAAAAAAAUGAAAAAAAABQgAAAAAAAAFCQAAAAAAAAULAAAAAAAABg0AAAAAAAAGEAAAAAAAAAYTAAAAAAAABhYAAAAAAAAGGQAAAAAAAAYcAAAAAAAABh8AAAAAAAAGIgAAAAAAAQYlAAAAAAABBikAAAAAAAIGLwAAAAAAAwY7AAAAAAAEBlMAAAAAAAcGgwAAAAAACQYDAgAAEAAABAQAAAAAAAAEBQAAACAAAAUGAAAAAAAABQcAAAAgAAAFCQAAAAAAAAUKAAAAAAAABgwAAAAAAAAGDwAAAAAAAAYSAAAAAAAABhUAAAAAAAAGGAAAAAAAAAYbAAAAAAAABh4AAAAAAAAGIQAAAAAAAQYjAAAAAAABBicAAAAAAAIGKwAAAAAAAwYzAAAAAAAEBkMAAAAAAAUGYwAAAAAACAYDAQAAIAAABAQAAAAwAAAEBAAAABAAAAQFAAAAIAAABQcAAAAgAAAFCAAAACAAAAUKAAAAIAAABQsAAAAAAAAGDgAAAAAAAAYRAAAAAAAABhQAAAAAAAAGFwAAAAAAAAYaAAAAAAAABh0AAAAAAAAGIAAAAAAAEAYDAAEAAAAPBgOAAAAAAA4GA0AAAAAADQYDIAAAAAAMBgMQAAAAAAsGAwgAAAAACgYDBABBpB0L2QEBAAAAAwAAAAcAAAAPAAAAHwAAAD8AAAB/AAAA/wAAAP8BAAD/AwAA/wcAAP8PAAD/HwAA/z8AAP9/AAD//wAA//8BAP//AwD//wcA//8PAP//HwD//z8A//9/AP///wD///8B////A////wf///8P////H////z////9/AAAAAAEAAAACAAAABAAAAAAAAAACAAAABAAAAAgAAAAAAAAAAQAAAAIAAAABAAAABAAAAAQAAAAEAAAABAAAAAgAAAAIAAAACAAAAAcAAAAIAAAACQAAAAoAAAALAEGgIAsDwBBQ";
const getCrcTable = (crcTable, crcInitialValueFunction, crcFunction) => {
  for (let byte = 0; byte < crcTable.length; byte++) {
    let crc = crcInitialValueFunction(byte);
    for (let bit = 8; bit > 0; bit--)
      crc = crcFunction(crc);
    crcTable[byte] = crc;
  }
  return crcTable;
};
getCrcTable(
  new Uint8Array(256),
  (b) => b,
  (crc) => crc & 128 ? 7 ^ crc << 1 : crc << 1
);
const flacCrc16Table = [
  getCrcTable(
    new Uint16Array(256),
    (b) => b << 8,
    (crc) => crc << 1 ^ (crc & 1 << 15 ? 32773 : 0)
  )
];
const crc32Table = [
  getCrcTable(
    new Uint32Array(256),
    (b) => b,
    (crc) => crc >>> 1 ^ (crc & 1) * 3988292384
  )
];
for (let i = 0; i < 15; i++) {
  flacCrc16Table.push(new Uint16Array(256));
  crc32Table.push(new Uint32Array(256));
  for (let j = 0; j <= 255; j++) {
    flacCrc16Table[i + 1][j] = flacCrc16Table[0][flacCrc16Table[i][j] >>> 8] ^ flacCrc16Table[i][j] << 8;
    crc32Table[i + 1][j] = crc32Table[i][j] >>> 8 ^ crc32Table[0][crc32Table[i][j] & 255];
  }
}
const reserved = "reserved";
const mappingJoin = ", ";
const front = "front";
const side = "side";
const rear = "rear";
const left$1 = "left";
const center = "center";
const right$1 = "right";
const channelMappings = [
  "",
  front + " ",
  side + " ",
  rear + " "
].map(
  (x) => [
    [left$1, right$1],
    [left$1, right$1, center],
    [left$1, center, right$1],
    [center, left$1, right$1],
    [center]
  ].flatMap((y) => y.map((z) => x + z).join(mappingJoin))
);
const lfe = "LFE";
const monophonic = "monophonic (mono)";
const stereo = "stereo";
const surround = "surround";
const channels = [
  monophonic,
  stereo,
  `linear ${surround}`,
  "quadraphonic",
  `5.0 ${surround}`,
  `5.1 ${surround}`,
  `6.1 ${surround}`,
  `7.1 ${surround}`
];
const getChannelMapping = (channelCount, ...mappings) => `${channels[channelCount - 1]} (${mappings.join(mappingJoin)})`;
[
  monophonic,
  getChannelMapping(2, channelMappings[0][0]),
  getChannelMapping(3, channelMappings[0][2]),
  getChannelMapping(4, channelMappings[1][0], channelMappings[3][0]),
  getChannelMapping(5, channelMappings[1][2], channelMappings[3][0]),
  getChannelMapping(6, channelMappings[1][2], channelMappings[3][0], lfe),
  getChannelMapping(7, channelMappings[1][2], channelMappings[2][0], channelMappings[3][4], lfe),
  getChannelMapping(8, channelMappings[1][2], channelMappings[2][0], channelMappings[3][0], lfe)
];
({
  0: { channels: 0, description: "Defined in AOT Specific Config" },
  64: { channels: 1, description: monophonic },
  128: { channels: 2, description: getChannelMapping(2, channelMappings[0][0]) },
  192: { channels: 3, description: getChannelMapping(3, channelMappings[1][3]) },
  256: { channels: 4, description: getChannelMapping(4, channelMappings[1][3], channelMappings[3][4]) },
  320: { channels: 5, description: getChannelMapping(5, channelMappings[1][3], channelMappings[3][0]) },
  384: { channels: 6, description: getChannelMapping(6, channelMappings[1][3], channelMappings[3][0], lfe) },
  448: { channels: 8, description: getChannelMapping(8, channelMappings[1][3], channelMappings[2][0], channelMappings[3][0], lfe) }
});
({
  0: { channels: 1, description: monophonic },
  16: { channels: 2, description: getChannelMapping(2, channelMappings[0][0]) },
  32: { channels: 3, description: getChannelMapping(3, channelMappings[0][1]) },
  48: { channels: 4, description: getChannelMapping(4, channelMappings[1][0], channelMappings[3][0]) },
  64: { channels: 5, description: getChannelMapping(5, channelMappings[1][1], channelMappings[3][0]) },
  80: { channels: 6, description: getChannelMapping(6, channelMappings[1][1], lfe, channelMappings[3][0]) },
  96: { channels: 7, description: getChannelMapping(7, channelMappings[1][1], lfe, channelMappings[3][4], channelMappings[2][0]) },
  112: { channels: 8, description: getChannelMapping(8, channelMappings[1][1], lfe, channelMappings[3][0], channelMappings[2][0]) },
  128: { channels: 2, description: `${stereo} (left, diff)` },
  144: { channels: 2, description: `${stereo} (diff, right)` },
  160: { channels: 2, description: `${stereo} (avg, diff)` },
  176: reserved,
  192: reserved,
  208: reserved,
  224: reserved,
  240: reserved
});
var ab = ArrayBuffer, u8 = Uint8Array, u16 = Uint16Array, i16 = Int16Array, i32 = Int32Array;
var slc = function(v, s, e) {
  if (u8.prototype.slice)
    return u8.prototype.slice.call(v, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  var n = new u8(e - s);
  n.set(v.subarray(s, e));
  return n;
};
var fill = function(v, n, s, e) {
  if (u8.prototype.fill)
    return u8.prototype.fill.call(v, n, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  for (; s < e; ++s)
    v[s] = n;
  return v;
};
var cpw = function(v, t, s, e) {
  if (u8.prototype.copyWithin)
    return u8.prototype.copyWithin.call(v, t, s, e);
  if (s == null || s < 0)
    s = 0;
  if (e == null || e > v.length)
    e = v.length;
  while (s < e) {
    v[t++] = v[s++];
  }
};
var ZstdErrorCode = {
  InvalidData: 0,
  WindowSizeTooLarge: 1,
  InvalidBlockType: 2,
  FSEAccuracyTooHigh: 3,
  DistanceTooFarBack: 4,
  UnexpectedEOF: 5
};
var ec = [
  "invalid zstd data",
  "window size too large (>2046MB)",
  "invalid block type",
  "FSE accuracy too high",
  "match distance too far back",
  "unexpected EOF"
];
var err = function(ind, msg, nt) {
  var e = new Error(msg || ec[ind]);
  e.code = ind;
  if (Error.captureStackTrace)
    Error.captureStackTrace(e, err);
  if (!nt)
    throw e;
  return e;
};
var rb = function(d, b, n) {
  var i = 0, o = 0;
  for (; i < n; ++i)
    o |= d[b++] << (i << 3);
  return o;
};
var b4 = function(d, b) {
  return (d[b] | d[b + 1] << 8 | d[b + 2] << 16 | d[b + 3] << 24) >>> 0;
};
var rzfh = function(dat, w) {
  var n3 = dat[0] | dat[1] << 8 | dat[2] << 16;
  if (n3 == 3126568 && dat[3] == 253) {
    var flg = dat[4];
    var ss = flg >> 5 & 1, cc = flg >> 2 & 1, df = flg & 3, fcf = flg >> 6;
    if (flg & 8)
      err(0);
    var bt = 6 - ss;
    var db = df == 3 ? 4 : df;
    var di = rb(dat, bt, db);
    bt += db;
    var fsb = fcf ? 1 << fcf : ss;
    var fss = rb(dat, bt, fsb) + (fcf == 1 && 256);
    var ws = fss;
    if (!ss) {
      var wb = 1 << 10 + (dat[5] >> 3);
      ws = wb + (wb >> 3) * (dat[5] & 7);
    }
    if (ws > 2145386496)
      err(1);
    var buf = new u8((w == 1 ? fss || ws : w ? 0 : ws) + 12);
    buf[0] = 1, buf[4] = 4, buf[8] = 8;
    return {
      b: bt + fsb,
      y: 0,
      l: 0,
      d: di,
      w: w && w != 1 ? w : buf.subarray(12),
      e: ws,
      o: new i32(buf.buffer, 0, 3),
      u: fss,
      c: cc,
      m: Math.min(131072, ws)
    };
  } else if ((n3 >> 4 | dat[3] << 20) == 25481893) {
    return b4(dat, 4) + 8;
  }
  err(0);
};
var msb = function(val) {
  var bits = 0;
  for (; 1 << bits <= val; ++bits)
    ;
  return bits - 1;
};
var rfse = function(dat, bt, mal) {
  var tpos = (bt << 3) + 4;
  var al = (dat[bt] & 15) + 5;
  if (al > mal)
    err(3);
  var sz = 1 << al;
  var probs = sz, sym = -1, re = -1, i = -1, ht = sz;
  var buf = new ab(512 + (sz << 2));
  var freq = new i16(buf, 0, 256);
  var dstate = new u16(buf, 0, 256);
  var nstate = new u16(buf, 512, sz);
  var bb1 = 512 + (sz << 1);
  var syms = new u8(buf, bb1, sz);
  var nbits = new u8(buf, bb1 + sz);
  while (sym < 255 && probs > 0) {
    var bits = msb(probs + 1);
    var cbt = tpos >> 3;
    var msk = (1 << bits + 1) - 1;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (tpos & 7) & msk;
    var msk1fb = (1 << bits) - 1;
    var msv = msk - probs - 1;
    var sval = val & msk1fb;
    if (sval < msv)
      tpos += bits, val = sval;
    else {
      tpos += bits + 1;
      if (val > msk1fb)
        val -= msv;
    }
    freq[++sym] = --val;
    if (val == -1) {
      probs += val;
      syms[--ht] = sym;
    } else
      probs -= val;
    if (!val) {
      do {
        var rbt = tpos >> 3;
        re = (dat[rbt] | dat[rbt + 1] << 8) >> (tpos & 7) & 3;
        tpos += 2;
        sym += re;
      } while (re == 3);
    }
  }
  if (sym > 255 || probs)
    err(0);
  var sympos = 0;
  var sstep = (sz >> 1) + (sz >> 3) + 3;
  var smask = sz - 1;
  for (var s = 0; s <= sym; ++s) {
    var sf = freq[s];
    if (sf < 1) {
      dstate[s] = -sf;
      continue;
    }
    for (i = 0; i < sf; ++i) {
      syms[sympos] = s;
      do {
        sympos = sympos + sstep & smask;
      } while (sympos >= ht);
    }
  }
  if (sympos)
    err(0);
  for (i = 0; i < sz; ++i) {
    var ns = dstate[syms[i]]++;
    var nb = nbits[i] = al - msb(ns);
    nstate[i] = (ns << nb) - sz;
  }
  return [tpos + 7 >> 3, {
    b: al,
    s: syms,
    n: nbits,
    t: nstate
  }];
};
var rhu = function(dat, bt) {
  var i = 0, wc = -1;
  var buf = new u8(292), hb = dat[bt];
  var hw = buf.subarray(0, 256);
  var rc = buf.subarray(256, 268);
  var ri = new u16(buf.buffer, 268);
  if (hb < 128) {
    var _a = rfse(dat, bt + 1, 6), ebt = _a[0], fdt = _a[1];
    bt += hb;
    var epos = ebt << 3;
    var lb = dat[bt];
    if (!lb)
      err(0);
    var st1 = 0, st2 = 0, btr1 = fdt.b, btr2 = btr1;
    var fpos = (++bt << 3) - 8 + msb(lb);
    for (; ; ) {
      fpos -= btr1;
      if (fpos < epos)
        break;
      var cbt = fpos >> 3;
      st1 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr1) - 1;
      hw[++wc] = fdt.s[st1];
      fpos -= btr2;
      if (fpos < epos)
        break;
      cbt = fpos >> 3;
      st2 += (dat[cbt] | dat[cbt + 1] << 8) >> (fpos & 7) & (1 << btr2) - 1;
      hw[++wc] = fdt.s[st2];
      btr1 = fdt.n[st1];
      st1 = fdt.t[st1];
      btr2 = fdt.n[st2];
      st2 = fdt.t[st2];
    }
    if (++wc > 255)
      err(0);
  } else {
    wc = hb - 127;
    for (; i < wc; i += 2) {
      var byte = dat[++bt];
      hw[i] = byte >> 4;
      hw[i + 1] = byte & 15;
    }
    ++bt;
  }
  var wes = 0;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    if (wt > 11)
      err(0);
    wes += wt && 1 << wt - 1;
  }
  var mb = msb(wes) + 1;
  var ts = 1 << mb;
  var rem = ts - wes;
  if (rem & rem - 1)
    err(0);
  hw[wc++] = msb(rem) + 1;
  for (i = 0; i < wc; ++i) {
    var wt = hw[i];
    ++rc[hw[i] = wt && mb + 1 - wt];
  }
  var hbuf = new u8(ts << 1);
  var syms = hbuf.subarray(0, ts), nb = hbuf.subarray(ts);
  ri[mb] = 0;
  for (i = mb; i > 0; --i) {
    var pv = ri[i];
    fill(nb, i, pv, ri[i - 1] = pv + rc[i] * (1 << mb - i));
  }
  if (ri[0] != ts)
    err(0);
  for (i = 0; i < wc; ++i) {
    var bits = hw[i];
    if (bits) {
      var code = ri[bits];
      fill(syms, i, code, ri[bits] = code + (1 << mb - bits));
    }
  }
  return [bt, {
    n: nb,
    b: mb,
    s: syms
  }];
};
var dllt = rfse(/* @__PURE__ */ new u8([
  81,
  16,
  99,
  140,
  49,
  198,
  24,
  99,
  12,
  33,
  196,
  24,
  99,
  102,
  102,
  134,
  70,
  146,
  4
]), 0, 6)[1];
var dmlt = rfse(/* @__PURE__ */ new u8([
  33,
  20,
  196,
  24,
  99,
  140,
  33,
  132,
  16,
  66,
  8,
  33,
  132,
  16,
  66,
  8,
  33,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  68,
  36,
  9
]), 0, 6)[1];
var doct = rfse(/* @__PURE__ */ new u8([
  32,
  132,
  16,
  66,
  102,
  70,
  68,
  68,
  68,
  68,
  36,
  73,
  2
]), 0, 5)[1];
var b2bl = function(b, s) {
  var len = b.length, bl = new i32(len);
  for (var i = 0; i < len; ++i) {
    bl[i] = s;
    s += 1 << b[i];
  }
  return bl;
};
var llb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  134678020,
  202050057,
  269422093
])).buffer, 0, 36);
var llbl = /* @__PURE__ */ b2bl(llb, 0);
var mlb = /* @__PURE__ */ new u8((/* @__PURE__ */ new i32([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  16843009,
  50528770,
  117769220,
  185207048,
  252579084,
  16
])).buffer, 0, 53);
var mlbl = /* @__PURE__ */ b2bl(mlb, 3);
var dhu = function(dat, out, hu) {
  var len = dat.length, ss = out.length, lb = dat[len - 1], msk = (1 << hu.b) - 1, eb = -hu.b;
  if (!lb)
    err(0);
  var st = 0, btr = hu.b, pos = (len << 3) - 8 + msb(lb) - btr, i = -1;
  for (; pos > eb && i < ss; ) {
    var cbt = pos >> 3;
    var val = (dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (pos & 7);
    st = (st << btr | val) & msk;
    out[++i] = hu.s[st];
    pos -= btr = hu.n[st];
  }
  if (pos != eb || i + 1 != ss)
    err(0);
};
var dhu4 = function(dat, out, hu) {
  var bt = 6;
  var ss = out.length, sz1 = ss + 3 >> 2, sz2 = sz1 << 1, sz3 = sz1 + sz2;
  dhu(dat.subarray(bt, bt += dat[0] | dat[1] << 8), out.subarray(0, sz1), hu);
  dhu(dat.subarray(bt, bt += dat[2] | dat[3] << 8), out.subarray(sz1, sz2), hu);
  dhu(dat.subarray(bt, bt += dat[4] | dat[5] << 8), out.subarray(sz2, sz3), hu);
  dhu(dat.subarray(bt), out.subarray(sz3), hu);
};
var rzb = function(dat, st, out) {
  var _a;
  var bt = st.b;
  var b0 = dat[bt], btype = b0 >> 1 & 3;
  st.l = b0 & 1;
  var sz = b0 >> 3 | dat[bt + 1] << 5 | dat[bt + 2] << 13;
  var ebt = (bt += 3) + sz;
  if (btype == 1) {
    if (bt >= dat.length)
      return;
    st.b = bt + 1;
    if (out) {
      fill(out, dat[bt], st.y, st.y += sz);
      return out;
    }
    return fill(new u8(sz), dat[bt]);
  }
  if (ebt > dat.length)
    return;
  if (btype == 0) {
    st.b = ebt;
    if (out) {
      out.set(dat.subarray(bt, ebt), st.y);
      st.y += sz;
      return out;
    }
    return slc(dat, bt, ebt);
  }
  if (btype == 2) {
    var b3 = dat[bt], lbt = b3 & 3, sf = b3 >> 2 & 3;
    var lss = b3 >> 4, lcs = 0, s4 = 0;
    if (lbt < 2) {
      if (sf & 1)
        lss |= dat[++bt] << 4 | (sf & 2 && dat[++bt] << 12);
      else
        lss = b3 >> 3;
    } else {
      s4 = sf;
      if (sf < 2)
        lss |= (dat[++bt] & 63) << 4, lcs = dat[bt] >> 6 | dat[++bt] << 2;
      else if (sf == 2)
        lss |= dat[++bt] << 4 | (dat[++bt] & 3) << 12, lcs = dat[bt] >> 2 | dat[++bt] << 6;
      else
        lss |= dat[++bt] << 4 | (dat[++bt] & 63) << 12, lcs = dat[bt] >> 6 | dat[++bt] << 2 | dat[++bt] << 10;
    }
    ++bt;
    var buf = out ? out.subarray(st.y, st.y + st.m) : new u8(st.m);
    var spl = buf.length - lss;
    if (lbt == 0)
      buf.set(dat.subarray(bt, bt += lss), spl);
    else if (lbt == 1)
      fill(buf, dat[bt++], spl);
    else {
      var hu = st.h;
      if (lbt == 2) {
        var hud = rhu(dat, bt);
        lcs += bt - (bt = hud[0]);
        st.h = hu = hud[1];
      } else if (!hu)
        err(0);
      (s4 ? dhu4 : dhu)(dat.subarray(bt, bt += lcs), buf.subarray(spl), hu);
    }
    var ns = dat[bt++];
    if (ns) {
      if (ns == 255)
        ns = (dat[bt++] | dat[bt++] << 8) + 32512;
      else if (ns > 127)
        ns = ns - 128 << 8 | dat[bt++];
      var scm = dat[bt++];
      if (scm & 3)
        err(0);
      var dts = [dmlt, doct, dllt];
      for (var i = 2; i > -1; --i) {
        var md = scm >> (i << 1) + 2 & 3;
        if (md == 1) {
          var rbuf = new u8([0, 0, dat[bt++]]);
          dts[i] = {
            s: rbuf.subarray(2, 3),
            n: rbuf.subarray(0, 1),
            t: new u16(rbuf.buffer, 0, 1),
            b: 0
          };
        } else if (md == 2) {
          _a = rfse(dat, bt, 9 - (i & 1)), bt = _a[0], dts[i] = _a[1];
        } else if (md == 3) {
          if (!st.t)
            err(0);
          dts[i] = st.t[i];
        }
      }
      var _b = st.t = dts, mlt = _b[0], oct = _b[1], llt = _b[2];
      var lb = dat[ebt - 1];
      if (!lb)
        err(0);
      var spos = (ebt << 3) - 8 + msb(lb) - llt.b, cbt = spos >> 3, oubt = 0;
      var lst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << llt.b) - 1;
      cbt = (spos -= oct.b) >> 3;
      var ost = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << oct.b) - 1;
      cbt = (spos -= mlt.b) >> 3;
      var mst = (dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mlt.b) - 1;
      for (++ns; --ns; ) {
        var llc = llt.s[lst];
        var lbtr = llt.n[lst];
        var mlc = mlt.s[mst];
        var mbtr = mlt.n[mst];
        var ofc = oct.s[ost];
        var obtr = oct.n[ost];
        cbt = (spos -= ofc) >> 3;
        var ofp = 1 << ofc;
        var off = ofp + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16 | dat[cbt + 3] << 24) >>> (spos & 7) & ofp - 1);
        cbt = (spos -= mlb[mlc]) >> 3;
        var ml = mlbl[mlc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << mlb[mlc]) - 1);
        cbt = (spos -= llb[llc]) >> 3;
        var ll = llbl[llc] + ((dat[cbt] | dat[cbt + 1] << 8 | dat[cbt + 2] << 16) >> (spos & 7) & (1 << llb[llc]) - 1);
        cbt = (spos -= lbtr) >> 3;
        lst = llt.t[lst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << lbtr) - 1);
        cbt = (spos -= mbtr) >> 3;
        mst = mlt.t[mst] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << mbtr) - 1);
        cbt = (spos -= obtr) >> 3;
        ost = oct.t[ost] + ((dat[cbt] | dat[cbt + 1] << 8) >> (spos & 7) & (1 << obtr) - 1);
        if (off > 3) {
          st.o[2] = st.o[1];
          st.o[1] = st.o[0];
          st.o[0] = off -= 3;
        } else {
          var idx = off - (ll != 0);
          if (idx) {
            off = idx == 3 ? st.o[0] - 1 : st.o[idx];
            if (idx > 1)
              st.o[2] = st.o[1];
            st.o[1] = st.o[0];
            st.o[0] = off;
          } else
            off = st.o[0];
        }
        for (var i = 0; i < ll; ++i) {
          buf[oubt + i] = buf[spl + i];
        }
        oubt += ll, spl += ll;
        var stin = oubt - off;
        if (stin < 0) {
          var len = -stin;
          var bs = st.e + stin;
          if (len > ml)
            len = ml;
          for (var i = 0; i < len; ++i) {
            buf[oubt + i] = st.w[bs + i];
          }
          oubt += len, ml -= len, stin = 0;
        }
        for (var i = 0; i < ml; ++i) {
          buf[oubt + i] = buf[stin + i];
        }
        oubt += ml;
      }
      if (oubt != spl) {
        while (spl < buf.length) {
          buf[oubt++] = buf[spl++];
        }
      } else
        oubt = buf.length;
      if (out)
        st.y += oubt;
      else
        buf = slc(buf, 0, oubt);
    } else {
      if (out) {
        st.y += lss;
        if (spl) {
          for (var i = 0; i < lss; ++i) {
            buf[i] = buf[spl + i];
          }
        }
      } else if (spl)
        buf = slc(buf, spl);
    }
    st.b = ebt;
    return buf;
  }
  err(2);
};
var cct = function(bufs, ol) {
  if (bufs.length == 1)
    return bufs[0];
  var buf = new u8(ol);
  for (var i = 0, b = 0; i < bufs.length; ++i) {
    var chk = bufs[i];
    buf.set(chk, b);
    b += chk.length;
  }
  return buf;
};
function decompress(dat, buf) {
  var bt = 0, bufs = [], nb = +!buf, ol = 0;
  for (; dat.length; ) {
    var st = rzfh(dat, nb || buf);
    if (typeof st == "object") {
      if (nb) {
        buf = null;
        if (st.w.length == st.u) {
          bufs.push(buf = st.w);
          ol += st.u;
        }
      } else {
        bufs.push(buf);
        st.e = 0;
      }
      for (; !st.l; ) {
        var blk = rzb(dat, st, buf);
        if (!blk)
          err(5);
        if (buf)
          st.e = st.y;
        else {
          bufs.push(blk);
          ol += blk.length;
          cpw(st.w, 0, blk.length);
          st.w.set(blk, st.w.length - blk.length);
        }
      }
      bt = st.b + st.c * 4;
    } else
      bt = st;
    dat = dat.subarray(bt);
  }
  return cct(bufs, ol);
}
var Decompress = /* @__PURE__ */ function() {
  function Decompress2(ondata) {
    this.ondata = ondata;
    this.c = [];
    this.l = 0;
    this.z = 0;
  }
  Decompress2.prototype.push = function(chunk, final) {
    if (typeof this.s == "number") {
      var sub = Math.min(chunk.length, this.s);
      chunk = chunk.subarray(sub);
      this.s -= sub;
    }
    var sl = chunk.length;
    var ncs = sl + this.l;
    if (!this.s) {
      if (final) {
        if (!ncs)
          return;
        if (ncs < 5)
          err(5);
      } else if (ncs < 18) {
        this.c.push(chunk);
        this.l = ncs;
        return;
      }
      if (this.l) {
        this.c.push(chunk);
        chunk = cct(this.c, ncs);
        this.c = [];
        this.l = 0;
      }
      if (typeof (this.s = rzfh(chunk)) == "number")
        return this.push(chunk, final);
    }
    if (typeof this.s != "number") {
      if (ncs < (this.z || 4)) {
        if (final)
          err(5);
        this.c.push(chunk);
        this.l = ncs;
        return;
      }
      if (this.l) {
        this.c.push(chunk);
        chunk = cct(this.c, ncs);
        this.c = [];
        this.l = 0;
      }
      if (!this.z && ncs < (this.z = chunk[this.s.b] & 2 ? 5 : 4 + (chunk[this.s.b] >> 3 | chunk[this.s.b + 1] << 5 | chunk[this.s.b + 2] << 13))) {
        if (final)
          err(5);
        this.c.push(chunk);
        this.l = ncs;
        return;
      } else
        this.z = 0;
      for (; ; ) {
        var blk = rzb(chunk, this.s);
        if (!blk) {
          if (final)
            err(5);
          var adc = chunk.subarray(this.s.b);
          this.s.b = 0;
          this.c.push(adc), this.l += adc.length;
          return;
        } else {
          this.ondata(blk, false);
          cpw(this.s.w, 0, blk.length);
          this.s.w.set(blk, this.s.w.length - blk.length);
        }
        if (this.s.l) {
          var rest = chunk.subarray(this.s.b);
          this.s = this.s.c * 4;
          this.push(rest, final);
          return;
        }
      }
    }
  };
  return Decompress2;
}();
const fzstd = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ZstdErrorCode,
  decompress,
  Decompress
}, Symbol.toStringTag, { value: "Module" }));
const getLiquidDSP = function(LiquidDSP2) {
  const DSP = {};
  DSP.LiquidDSP = LiquidDSP2;
  DSP.estimate_req_filter_len = LiquidDSP2.cwrap("estimate_req_filter_len", "number", ["number", "number"]);
  DSP.liquid_firdes_kaiser = LiquidDSP2.cwrap("liquid_firdes_kaiser", "number", ["number", "number", "number", "number", "number"]);
  DSP.firfilt_rrrf_create = LiquidDSP2.cwrap("firfilt_rrrf_create", "number", ["number", "number"]);
  DSP.firfilt_rrrf_execute_block = LiquidDSP2.cwrap("firfilt_rrrf_execute_block", "number", ["number", "number", "number", "number"]);
  DSP.firfilt_rrrf_destroy = LiquidDSP2.cwrap("firfilt_rrrf_destroy", "number", ["number"]);
  DSP.resamp_rrrf_create = LiquidDSP2.cwrap("resamp_rrrf_create", "number", ["number", "number", "number", "number", "number"]);
  DSP.getFloat32Array = (offset2, length) => {
    return new Float32Array(new Float32Array(LiquidDSP2.HEAPU8.buffer, offset2, length));
  };
  DSP.FirDesKaiser = (ft, fc, As, mu) => {
    const hLen = DSP.estimate_req_filter_len(ft, As);
    const h = LiquidDSP2._malloc(4 * hLen);
    DSP.liquid_firdes_kaiser(hLen, fc, As, mu, h);
    const arr = DSP.getFloat32Array(h, hLen);
    LiquidDSP2._free(h);
    return arr;
  };
  DSP.FirFilt = function(h) {
    this.h = LiquidDSP2._malloc(h.length * 4);
    new Float32Array(LiquidDSP2.HEAPU8.buffer, h, h.length).set(h);
    this.q = DSP.firfilt_rrrf_create(this.h, h.length);
    this.in = LiquidDSP2._malloc(4 * 16384);
    this.inarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.in, 16384);
    this.execute = (arr) => {
      this.inarr.set(arr);
      DSP.firfilt_rrrf_execute_block(this.q, this.in, arr.length, this.in);
      arr = DSP.getFloat32Array(this.in, arr.length);
      return arr;
    };
    this.destroy = () => {
      LiquidDSP2._free(this.h);
      LiquidDSP2._free(this.in);
      DSP.firfilt_rrrf_destroy(this.q);
    };
  };
  DSP.Resamp = function(r, m, fc, As, N) {
    this.q = LiquidDSP2._resamp_rrrf_create(r, m, fc, As, N);
    this.in = LiquidDSP2._malloc(4 * 16384);
    this.out = LiquidDSP2._malloc(4 * 16384);
    this.inarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.in, 16384);
    this.outarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.out, 16384);
    this.outlen = LiquidDSP2._malloc(4);
    this.execute = (arr) => {
      this.inarr.set(arr);
      LiquidDSP2._resamp_rrrf_execute_block(this.q, this.in, arr.length, this.out, this.outlen);
      arr = DSP.getFloat32Array(this.out, LiquidDSP2.getValue(this.outlen, "i32"));
      return arr;
    };
    this.destroy = () => {
      LiquidDSP2._free(this.in);
      LiquidDSP2._free(this.out);
      LiquidDSP2._resamp_rrrf_destroy(this.q);
    };
  };
  DSP.MsResamp = function(r, As) {
    this.q = LiquidDSP2._msresamp_rrrf_create(r, As);
    this.in = LiquidDSP2._malloc(4 * 16384);
    this.out = LiquidDSP2._malloc(4 * 16384);
    this.inarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.in, 16384);
    this.outarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.out, 16384);
    this.outlen = LiquidDSP2._malloc(4);
    this.execute = (arr) => {
      this.inarr.set(arr);
      LiquidDSP2._msresamp_rrrf_execute(this.q, this.in, arr.length, this.out, this.outlen);
      arr = DSP.getFloat32Array(this.out, LiquidDSP2.getValue(this.outlen, "i32"));
      return arr;
    };
    this.destroy = () => {
      LiquidDSP2._free(this.in);
      LiquidDSP2._free(this.out);
      LiquidDSP2._msresamp_rrrf_destroy(this.q);
    };
  };
  DSP.AGC = function() {
    this.q = LiquidDSP2._agc_rrrf_create();
    this.in = LiquidDSP2._malloc(4 * 16384);
    this.inarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.in, 16384);
    this.execute = (arr) => {
      this.inarr.set(arr);
      LiquidDSP2._agc_rrrf_execute_block(this.q, this.in, arr.length, this.in);
      arr = DSP.getFloat32Array(this.in, arr.length);
      return arr;
    };
    this.destroy = () => {
      LiquidDSP2._free(this.in);
      LiquidDSP2._agc_rrrf_destroy(this.q);
    };
  };
  DSP.WBFMStereo = function(fs) {
    this.wbfm = new LiquidDSP2.WBFMStereo(fs);
    this.in = LiquidDSP2._malloc(4 * 16384);
    this.outl = LiquidDSP2._malloc(4 * 16384);
    this.outr = LiquidDSP2._malloc(4 * 16384);
    this.inarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.in, 16384);
    this.outlarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.outl, 16384);
    this.outrarr = new Float32Array(LiquidDSP2.HEAPU8.buffer, this.outr, 16384);
    this.execute = (arr) => {
      this.inarr.set(arr);
      this.wbfm.execute(this.in, arr.length, this.outl, this.outr);
      return [DSP.getFloat32Array(this.outl, arr.length), DSP.getFloat32Array(this.outr, arr.length)];
    };
    this.destroy = () => {
      this.wbfm.destroy();
    };
  };
  return DSP;
};
var jsDSPModule = function() {
  var _scriptDir = typeof document !== "undefined" && document.currentScript ? document.currentScript.src : void 0;
  return function(jsDSPModule2) {
    jsDSPModule2 = jsDSPModule2 || {};
    var Module = typeof jsDSPModule2 !== "undefined" ? jsDSPModule2 : {};
    var readyPromiseResolve, readyPromiseReject;
    Module["ready"] = new Promise(function(resolve, reject) {
      readyPromiseResolve = resolve;
      readyPromiseReject = reject;
    });
    var moduleOverrides = {};
    var key;
    for (key in Module) {
      if (Module.hasOwnProperty(key)) {
        moduleOverrides[key] = Module[key];
      }
    }
    var ENVIRONMENT_IS_WEB = typeof window === "object";
    var ENVIRONMENT_IS_WORKER = typeof importScripts === "function";
    typeof process === "object" && typeof process.versions === "object" && typeof process.versions.node === "string";
    var scriptDirectory = "";
    function locateFile(path2) {
      if (Module["locateFile"]) {
        return Module["locateFile"](path2, scriptDirectory);
      }
      return scriptDirectory + path2;
    }
    var readBinary;
    if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
      if (ENVIRONMENT_IS_WORKER) {
        scriptDirectory = self.location.href;
      } else if (typeof document !== "undefined" && document.currentScript) {
        scriptDirectory = document.currentScript.src;
      }
      if (_scriptDir) {
        scriptDirectory = _scriptDir;
      }
      if (scriptDirectory.indexOf("blob:") !== 0) {
        scriptDirectory = scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1);
      } else {
        scriptDirectory = "";
      }
      {
        if (ENVIRONMENT_IS_WORKER) {
          readBinary = function(url) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url, false);
            xhr.responseType = "arraybuffer";
            xhr.send(null);
            return new Uint8Array(xhr.response);
          };
        }
      }
    }
    var out = Module["print"] || console.log.bind(console);
    var err2 = Module["printErr"] || console.warn.bind(console);
    for (key in moduleOverrides) {
      if (moduleOverrides.hasOwnProperty(key)) {
        Module[key] = moduleOverrides[key];
      }
    }
    moduleOverrides = null;
    if (Module["arguments"])
      Module["arguments"];
    if (Module["thisProgram"])
      Module["thisProgram"];
    if (Module["quit"])
      Module["quit"];
    var wasmBinary;
    if (Module["wasmBinary"])
      wasmBinary = Module["wasmBinary"];
    Module["noExitRuntime"] || true;
    if (typeof WebAssembly !== "object") {
      abort("no native wasm support detected");
    }
    function setValue(ptr, value, type, noSafe) {
      type = type || "i8";
      if (type.charAt(type.length - 1) === "*")
        type = "i32";
      switch (type) {
        case "i1":
          HEAP8[ptr >> 0] = value;
          break;
        case "i8":
          HEAP8[ptr >> 0] = value;
          break;
        case "i16":
          HEAP16[ptr >> 1] = value;
          break;
        case "i32":
          HEAP32[ptr >> 2] = value;
          break;
        case "i64":
          tempI64 = [value >>> 0, (tempDouble = value, +Math.abs(tempDouble) >= 1 ? tempDouble > 0 ? (Math.min(+Math.floor(tempDouble / 4294967296), 4294967295) | 0) >>> 0 : ~~+Math.ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[ptr >> 2] = tempI64[0], HEAP32[ptr + 4 >> 2] = tempI64[1];
          break;
        case "float":
          HEAPF32[ptr >> 2] = value;
          break;
        case "double":
          HEAPF64[ptr >> 3] = value;
          break;
        default:
          abort("invalid type for setValue: " + type);
      }
    }
    function getValue(ptr, type, noSafe) {
      type = type || "i8";
      if (type.charAt(type.length - 1) === "*")
        type = "i32";
      switch (type) {
        case "i1":
          return HEAP8[ptr >> 0];
        case "i8":
          return HEAP8[ptr >> 0];
        case "i16":
          return HEAP16[ptr >> 1];
        case "i32":
          return HEAP32[ptr >> 2];
        case "i64":
          return HEAP32[ptr >> 2];
        case "float":
          return HEAPF32[ptr >> 2];
        case "double":
          return Number(HEAPF64[ptr >> 3]);
        default:
          abort("invalid type for getValue: " + type);
      }
      return null;
    }
    var wasmMemory;
    var ABORT = false;
    function assert(condition, text2) {
      if (!condition) {
        abort("Assertion failed: " + text2);
      }
    }
    function getCFunc(ident) {
      var func = Module["_" + ident];
      assert(func, "Cannot call unknown function " + ident + ", make sure it is exported");
      return func;
    }
    function ccall(ident, returnType, argTypes, args, opts) {
      var toC = { "string": function(str) {
        var ret2 = 0;
        if (str !== null && str !== void 0 && str !== 0) {
          var len = (str.length << 2) + 1;
          ret2 = stackAlloc(len);
          stringToUTF8(str, ret2, len);
        }
        return ret2;
      }, "array": function(arr) {
        var ret2 = stackAlloc(arr.length);
        writeArrayToMemory(arr, ret2);
        return ret2;
      } };
      function convertReturnValue(ret2) {
        if (returnType === "string")
          return UTF8ToString(ret2);
        if (returnType === "boolean")
          return Boolean(ret2);
        return ret2;
      }
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0)
              stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func.apply(null, cArgs);
      function onDone(ret2) {
        if (stack !== 0)
          stackRestore(stack);
        return convertReturnValue(ret2);
      }
      ret = onDone(ret);
      return ret;
    }
    function cwrap(ident, returnType, argTypes, opts) {
      argTypes = argTypes || [];
      var numericArgs = argTypes.every(function(type) {
        return type === "number";
      });
      var numericRet = returnType !== "string";
      if (numericRet && numericArgs && !opts) {
        return getCFunc(ident);
      }
      return function() {
        return ccall(ident, returnType, argTypes, arguments);
      };
    }
    var UTF8Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf8") : void 0;
    function UTF8ArrayToString(heap, idx, maxBytesToRead) {
      var endIdx = idx + maxBytesToRead;
      var endPtr = idx;
      while (heap[endPtr] && !(endPtr >= endIdx))
        ++endPtr;
      if (endPtr - idx > 16 && heap.subarray && UTF8Decoder) {
        return UTF8Decoder.decode(heap.subarray(idx, endPtr));
      } else {
        var str = "";
        while (idx < endPtr) {
          var u0 = heap[idx++];
          if (!(u0 & 128)) {
            str += String.fromCharCode(u0);
            continue;
          }
          var u1 = heap[idx++] & 63;
          if ((u0 & 224) == 192) {
            str += String.fromCharCode((u0 & 31) << 6 | u1);
            continue;
          }
          var u2 = heap[idx++] & 63;
          if ((u0 & 240) == 224) {
            u0 = (u0 & 15) << 12 | u1 << 6 | u2;
          } else {
            u0 = (u0 & 7) << 18 | u1 << 12 | u2 << 6 | heap[idx++] & 63;
          }
          if (u0 < 65536) {
            str += String.fromCharCode(u0);
          } else {
            var ch = u0 - 65536;
            str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
          }
        }
      }
      return str;
    }
    function UTF8ToString(ptr, maxBytesToRead) {
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead) : "";
    }
    function stringToUTF8Array(str, heap, outIdx, maxBytesToWrite) {
      if (!(maxBytesToWrite > 0))
        return 0;
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343) {
          var u1 = str.charCodeAt(++i);
          u = 65536 + ((u & 1023) << 10) | u1 & 1023;
        }
        if (u <= 127) {
          if (outIdx >= endIdx)
            break;
          heap[outIdx++] = u;
        } else if (u <= 2047) {
          if (outIdx + 1 >= endIdx)
            break;
          heap[outIdx++] = 192 | u >> 6;
          heap[outIdx++] = 128 | u & 63;
        } else if (u <= 65535) {
          if (outIdx + 2 >= endIdx)
            break;
          heap[outIdx++] = 224 | u >> 12;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        } else {
          if (outIdx + 3 >= endIdx)
            break;
          heap[outIdx++] = 240 | u >> 18;
          heap[outIdx++] = 128 | u >> 12 & 63;
          heap[outIdx++] = 128 | u >> 6 & 63;
          heap[outIdx++] = 128 | u & 63;
        }
      }
      heap[outIdx] = 0;
      return outIdx - startIdx;
    }
    function stringToUTF8(str, outPtr, maxBytesToWrite) {
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    }
    function lengthBytesUTF8(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var u = str.charCodeAt(i);
        if (u >= 55296 && u <= 57343)
          u = 65536 + ((u & 1023) << 10) | str.charCodeAt(++i) & 1023;
        if (u <= 127)
          ++len;
        else if (u <= 2047)
          len += 2;
        else if (u <= 65535)
          len += 3;
        else
          len += 4;
      }
      return len;
    }
    var UTF16Decoder = typeof TextDecoder !== "undefined" ? new TextDecoder("utf-16le") : void 0;
    function UTF16ToString(ptr, maxBytesToRead) {
      var endPtr = ptr;
      var idx = endPtr >> 1;
      var maxIdx = idx + maxBytesToRead / 2;
      while (!(idx >= maxIdx) && HEAPU16[idx])
        ++idx;
      endPtr = idx << 1;
      if (endPtr - ptr > 32 && UTF16Decoder) {
        return UTF16Decoder.decode(HEAPU8.subarray(ptr, endPtr));
      } else {
        var str = "";
        for (var i = 0; !(i >= maxBytesToRead / 2); ++i) {
          var codeUnit = HEAP16[ptr + i * 2 >> 1];
          if (codeUnit == 0)
            break;
          str += String.fromCharCode(codeUnit);
        }
        return str;
      }
    }
    function stringToUTF16(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === void 0) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 2)
        return 0;
      maxBytesToWrite -= 2;
      var startPtr = outPtr;
      var numCharsToWrite = maxBytesToWrite < str.length * 2 ? maxBytesToWrite / 2 : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        var codeUnit = str.charCodeAt(i);
        HEAP16[outPtr >> 1] = codeUnit;
        outPtr += 2;
      }
      HEAP16[outPtr >> 1] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF16(str) {
      return str.length * 2;
    }
    function UTF32ToString(ptr, maxBytesToRead) {
      var i = 0;
      var str = "";
      while (!(i >= maxBytesToRead / 4)) {
        var utf32 = HEAP32[ptr + i * 4 >> 2];
        if (utf32 == 0)
          break;
        ++i;
        if (utf32 >= 65536) {
          var ch = utf32 - 65536;
          str += String.fromCharCode(55296 | ch >> 10, 56320 | ch & 1023);
        } else {
          str += String.fromCharCode(utf32);
        }
      }
      return str;
    }
    function stringToUTF32(str, outPtr, maxBytesToWrite) {
      if (maxBytesToWrite === void 0) {
        maxBytesToWrite = 2147483647;
      }
      if (maxBytesToWrite < 4)
        return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343) {
          var trailSurrogate = str.charCodeAt(++i);
          codeUnit = 65536 + ((codeUnit & 1023) << 10) | trailSurrogate & 1023;
        }
        HEAP32[outPtr >> 2] = codeUnit;
        outPtr += 4;
        if (outPtr + 4 > endPtr)
          break;
      }
      HEAP32[outPtr >> 2] = 0;
      return outPtr - startPtr;
    }
    function lengthBytesUTF32(str) {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codeUnit = str.charCodeAt(i);
        if (codeUnit >= 55296 && codeUnit <= 57343)
          ++i;
        len += 4;
      }
      return len;
    }
    function writeArrayToMemory(array, buffer2) {
      HEAP8.set(array, buffer2);
    }
    var buffer, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
    function updateGlobalBufferAndViews(buf) {
      buffer = buf;
      Module["HEAP8"] = HEAP8 = new Int8Array(buf);
      Module["HEAP16"] = HEAP16 = new Int16Array(buf);
      Module["HEAP32"] = HEAP32 = new Int32Array(buf);
      Module["HEAPU8"] = HEAPU8 = new Uint8Array(buf);
      Module["HEAPU16"] = HEAPU16 = new Uint16Array(buf);
      Module["HEAPU32"] = HEAPU32 = new Uint32Array(buf);
      Module["HEAPF32"] = HEAPF32 = new Float32Array(buf);
      Module["HEAPF64"] = HEAPF64 = new Float64Array(buf);
    }
    Module["INITIAL_MEMORY"] || 8388608;
    var wasmTable;
    var __ATPRERUN__ = [];
    var __ATINIT__ = [];
    var __ATPOSTRUN__ = [];
    function preRun() {
      if (Module["preRun"]) {
        if (typeof Module["preRun"] == "function")
          Module["preRun"] = [Module["preRun"]];
        while (Module["preRun"].length) {
          addOnPreRun(Module["preRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPRERUN__);
    }
    function initRuntime() {
      callRuntimeCallbacks(__ATINIT__);
    }
    function postRun() {
      if (Module["postRun"]) {
        if (typeof Module["postRun"] == "function")
          Module["postRun"] = [Module["postRun"]];
        while (Module["postRun"].length) {
          addOnPostRun(Module["postRun"].shift());
        }
      }
      callRuntimeCallbacks(__ATPOSTRUN__);
    }
    function addOnPreRun(cb) {
      __ATPRERUN__.unshift(cb);
    }
    function addOnInit(cb) {
      __ATINIT__.unshift(cb);
    }
    function addOnPostRun(cb) {
      __ATPOSTRUN__.unshift(cb);
    }
    var runDependencies = 0;
    var dependenciesFulfilled = null;
    function addRunDependency(id2) {
      runDependencies++;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
    }
    function removeRunDependency(id2) {
      runDependencies--;
      if (Module["monitorRunDependencies"]) {
        Module["monitorRunDependencies"](runDependencies);
      }
      if (runDependencies == 0) {
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback();
        }
      }
    }
    Module["preloadedImages"] = {};
    Module["preloadedAudios"] = {};
    function abort(what) {
      {
        if (Module["onAbort"]) {
          Module["onAbort"](what);
        }
      }
      what = "Aborted(" + what + ")";
      err2(what);
      ABORT = true;
      what += ". Build with -s ASSERTIONS=1 for more info.";
      var e = new WebAssembly.RuntimeError(what);
      readyPromiseReject(e);
      throw e;
    }
    var dataURIPrefix = "data:application/octet-stream;base64,";
    function isDataURI(filename) {
      return filename.startsWith(dataURIPrefix);
    }
    var wasmBinaryFile;
    wasmBinaryFile = "jsDSP.wasm";
    if (!isDataURI(wasmBinaryFile)) {
      wasmBinaryFile = locateFile(wasmBinaryFile);
    }
    function getBinary(file) {
      try {
        if (file == wasmBinaryFile && wasmBinary) {
          return new Uint8Array(wasmBinary);
        }
        if (readBinary) {
          return readBinary(file);
        } else {
          throw "both async and sync fetching of the wasm failed";
        }
      } catch (err3) {
        abort(err3);
      }
    }
    function getBinaryPromise() {
      if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
        if (typeof fetch === "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            if (!response["ok"]) {
              throw "failed to load wasm binary file at '" + wasmBinaryFile + "'";
            }
            return response["arrayBuffer"]();
          }).catch(function() {
            return getBinary(wasmBinaryFile);
          });
        }
      }
      return Promise.resolve().then(function() {
        return getBinary(wasmBinaryFile);
      });
    }
    function createWasm() {
      var info = { "a": asmLibraryArg };
      function receiveInstance(instance2, module) {
        var exports2 = instance2.exports;
        Module["asm"] = exports2;
        wasmMemory = Module["asm"]["I"];
        updateGlobalBufferAndViews(wasmMemory.buffer);
        wasmTable = Module["asm"]["na"];
        addOnInit(Module["asm"]["J"]);
        removeRunDependency();
      }
      addRunDependency();
      function receiveInstantiationResult(result) {
        receiveInstance(result["instance"]);
      }
      function instantiateArrayBuffer(receiver) {
        return getBinaryPromise().then(function(binary) {
          return WebAssembly.instantiate(binary, info);
        }).then(function(instance2) {
          return instance2;
        }).then(receiver, function(reason) {
          err2("failed to asynchronously prepare wasm: " + reason);
          abort(reason);
        });
      }
      function instantiateAsync() {
        if (!wasmBinary && typeof WebAssembly.instantiateStreaming === "function" && !isDataURI(wasmBinaryFile) && typeof fetch === "function") {
          return fetch(wasmBinaryFile, { credentials: "same-origin" }).then(function(response) {
            var result = WebAssembly.instantiateStreaming(response, info);
            return result.then(receiveInstantiationResult, function(reason) {
              err2("wasm streaming compile failed: " + reason);
              err2("falling back to ArrayBuffer instantiation");
              return instantiateArrayBuffer(receiveInstantiationResult);
            });
          });
        } else {
          return instantiateArrayBuffer(receiveInstantiationResult);
        }
      }
      if (Module["instantiateWasm"]) {
        try {
          var exports = Module["instantiateWasm"](info, receiveInstance);
          return exports;
        } catch (e) {
          err2("Module.instantiateWasm callback failed with error: " + e);
          return false;
        }
      }
      instantiateAsync().catch(readyPromiseReject);
      return {};
    }
    var tempDouble;
    var tempI64;
    function callRuntimeCallbacks(callbacks) {
      while (callbacks.length > 0) {
        var callback = callbacks.shift();
        if (typeof callback == "function") {
          callback(Module);
          continue;
        }
        var func = callback.func;
        if (typeof func === "number") {
          if (callback.arg === void 0) {
            getWasmTableEntry(func)();
          } else {
            getWasmTableEntry(func)(callback.arg);
          }
        } else {
          func(callback.arg === void 0 ? null : callback.arg);
        }
      }
    }
    var wasmTableMirror = [];
    function getWasmTableEntry(funcPtr) {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        if (funcPtr >= wasmTableMirror.length)
          wasmTableMirror.length = funcPtr + 1;
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      return func;
    }
    function ___assert_fail(condition, filename, line, func) {
      abort("Assertion failed: " + UTF8ToString(condition) + ", at: " + [filename ? UTF8ToString(filename) : "unknown filename", line, func ? UTF8ToString(func) : "unknown function"]);
    }
    function __embind_register_bigint(primitiveType, name, size, minRange, maxRange) {
    }
    function getShiftFromSize(size) {
      switch (size) {
        case 1:
          return 0;
        case 2:
          return 1;
        case 4:
          return 2;
        case 8:
          return 3;
        default:
          throw new TypeError("Unknown type size: " + size);
      }
    }
    function embind_init_charCodes() {
      var codes = new Array(256);
      for (var i = 0; i < 256; ++i) {
        codes[i] = String.fromCharCode(i);
      }
      embind_charCodes = codes;
    }
    var embind_charCodes = void 0;
    function readLatin1String(ptr) {
      var ret = "";
      var c = ptr;
      while (HEAPU8[c]) {
        ret += embind_charCodes[HEAPU8[c++]];
      }
      return ret;
    }
    var awaitingDependencies = {};
    var registeredTypes = {};
    var typeDependencies = {};
    var char_0 = 48;
    var char_9 = 57;
    function makeLegalFunctionName(name) {
      if (void 0 === name) {
        return "_unknown";
      }
      name = name.replace(/[^a-zA-Z0-9_]/g, "$");
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return "_" + name;
      } else {
        return name;
      }
    }
    function createNamedFunction(name, body) {
      name = makeLegalFunctionName(name);
      return new Function("body", "return function " + name + '() {\n    "use strict";    return body.apply(this, arguments);\n};\n')(body);
    }
    function extendError(baseErrorType, errorName) {
      var errorClass = createNamedFunction(errorName, function(message) {
        this.name = errorName;
        this.message = message;
        var stack = new Error(message).stack;
        if (stack !== void 0) {
          this.stack = this.toString() + "\n" + stack.replace(/^Error(:[^\n]*)?\n/, "");
        }
      });
      errorClass.prototype = Object.create(baseErrorType.prototype);
      errorClass.prototype.constructor = errorClass;
      errorClass.prototype.toString = function() {
        if (this.message === void 0) {
          return this.name;
        } else {
          return this.name + ": " + this.message;
        }
      };
      return errorClass;
    }
    var BindingError = void 0;
    function throwBindingError(message) {
      throw new BindingError(message);
    }
    var InternalError = void 0;
    function throwInternalError(message) {
      throw new InternalError(message);
    }
    function whenDependentTypesAreResolved(myTypes, dependentTypes, getTypeConverters) {
      myTypes.forEach(function(type) {
        typeDependencies[type] = dependentTypes;
      });
      function onComplete(typeConverters2) {
        var myTypeConverters = getTypeConverters(typeConverters2);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError("Mismatched type converter count");
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      dependentTypes.forEach(function(dt, i) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(function() {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      });
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    }
    function registerType(rawType, registeredInstance, options) {
      options = options || {};
      if (!("argPackAdvance" in registeredInstance)) {
        throw new TypeError("registerType registeredInstance requires argPackAdvance");
      }
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError('type "' + name + '" must have a positive integer typeid pointer');
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError("Cannot register type '" + name + "' twice");
        }
      }
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach(function(cb) {
          cb();
        });
      }
    }
    function __embind_register_bool(rawType, name, size, trueValue, falseValue) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": function(wt) {
        return !!wt;
      }, "toWireType": function(destructors, o) {
        return o ? trueValue : falseValue;
      }, "argPackAdvance": 8, "readValueFromPointer": function(pointer) {
        var heap;
        if (size === 1) {
          heap = HEAP8;
        } else if (size === 2) {
          heap = HEAP16;
        } else if (size === 4) {
          heap = HEAP32;
        } else {
          throw new TypeError("Unknown boolean type size: " + name);
        }
        return this["fromWireType"](heap[pointer >> shift]);
      }, destructorFunction: null });
    }
    function ClassHandle_isAliasOf(other) {
      if (!(this instanceof ClassHandle)) {
        return false;
      }
      if (!(other instanceof ClassHandle)) {
        return false;
      }
      var leftClass = this.$$.ptrType.registeredClass;
      var left2 = this.$$.ptr;
      var rightClass = other.$$.ptrType.registeredClass;
      var right2 = other.$$.ptr;
      while (leftClass.baseClass) {
        left2 = leftClass.upcast(left2);
        leftClass = leftClass.baseClass;
      }
      while (rightClass.baseClass) {
        right2 = rightClass.upcast(right2);
        rightClass = rightClass.baseClass;
      }
      return leftClass === rightClass && left2 === right2;
    }
    function shallowCopyInternalPointer(o) {
      return { count: o.count, deleteScheduled: o.deleteScheduled, preservePointerOnDelete: o.preservePointerOnDelete, ptr: o.ptr, ptrType: o.ptrType, smartPtr: o.smartPtr, smartPtrType: o.smartPtrType };
    }
    function throwInstanceAlreadyDeleted(obj) {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + " instance already deleted");
    }
    var finalizationGroup = false;
    function detachFinalizer(handle) {
    }
    function runDestructor($$) {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    }
    function releaseClassHandle($$) {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    }
    function attachFinalizer(handle) {
      if ("undefined" === typeof FinalizationGroup) {
        attachFinalizer = function(handle2) {
          return handle2;
        };
        return handle;
      }
      finalizationGroup = new FinalizationGroup(function(iter) {
        for (var result = iter.next(); !result.done; result = iter.next()) {
          var $$ = result.value;
          if (!$$.ptr) {
            console.warn("object already deleted: " + $$.ptr);
          } else {
            releaseClassHandle($$);
          }
        }
      });
      attachFinalizer = function(handle2) {
        finalizationGroup.register(handle2, handle2.$$, handle2.$$);
        return handle2;
      };
      detachFinalizer = function(handle2) {
        finalizationGroup.unregister(handle2.$$);
      };
      return attachFinalizer(handle);
    }
    function ClassHandle_clone() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.preservePointerOnDelete) {
        this.$$.count.value += 1;
        return this;
      } else {
        var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), { $$: { value: shallowCopyInternalPointer(this.$$) } }));
        clone.$$.count.value += 1;
        clone.$$.deleteScheduled = false;
        return clone;
      }
    }
    function ClassHandle_delete() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      detachFinalizer(this);
      releaseClassHandle(this.$$);
      if (!this.$$.preservePointerOnDelete) {
        this.$$.smartPtr = void 0;
        this.$$.ptr = void 0;
      }
    }
    function ClassHandle_isDeleted() {
      return !this.$$.ptr;
    }
    var delayFunction = void 0;
    var deletionQueue = [];
    function flushPendingDeletes() {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj["delete"]();
      }
    }
    function ClassHandle_deleteLater() {
      if (!this.$$.ptr) {
        throwInstanceAlreadyDeleted(this);
      }
      if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
        throwBindingError("Object already scheduled for deletion");
      }
      deletionQueue.push(this);
      if (deletionQueue.length === 1 && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
      this.$$.deleteScheduled = true;
      return this;
    }
    function init_ClassHandle() {
      ClassHandle.prototype["isAliasOf"] = ClassHandle_isAliasOf;
      ClassHandle.prototype["clone"] = ClassHandle_clone;
      ClassHandle.prototype["delete"] = ClassHandle_delete;
      ClassHandle.prototype["isDeleted"] = ClassHandle_isDeleted;
      ClassHandle.prototype["deleteLater"] = ClassHandle_deleteLater;
    }
    function ClassHandle() {
    }
    var registeredPointers = {};
    function ensureOverloadTable(proto, methodName, humanName) {
      if (void 0 === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        proto[methodName] = function() {
          if (!proto[methodName].overloadTable.hasOwnProperty(arguments.length)) {
            throwBindingError("Function '" + humanName + "' called with an invalid number of arguments (" + arguments.length + ") - expects one of (" + proto[methodName].overloadTable + ")!");
          }
          return proto[methodName].overloadTable[arguments.length].apply(this, arguments);
        };
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    }
    function exposePublicSymbol(name, value, numArguments) {
      if (Module.hasOwnProperty(name)) {
        if (void 0 === numArguments || void 0 !== Module[name].overloadTable && void 0 !== Module[name].overloadTable[numArguments]) {
          throwBindingError("Cannot register public name '" + name + "' twice");
        }
        ensureOverloadTable(Module, name, name);
        if (Module.hasOwnProperty(numArguments)) {
          throwBindingError("Cannot register multiple overloads of a function with the same number of arguments (" + numArguments + ")!");
        }
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        if (void 0 !== numArguments) {
          Module[name].numArguments = numArguments;
        }
      }
    }
    function RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
    function upcastPointer(ptr, ptrClass, desiredClass) {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError("Expected null or instance of " + desiredClass.name + ", got an instance of " + ptrClass.name);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    }
    function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      if (this.isSmartPointer) {
        if (void 0 === handle.$$.smartPtr) {
          throwBindingError("Passing raw pointer to smart pointer is illegal");
        }
        switch (this.sharingPolicy) {
          case 0:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError("Cannot convert argument of type " + (handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name) + " to parameter type " + this.name);
            }
            break;
          case 1:
            ptr = handle.$$.smartPtr;
            break;
          case 2:
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle["clone"]();
              ptr = this.rawShare(ptr, Emval.toHandle(function() {
                clonedHandle["delete"]();
              }));
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
          default:
            throwBindingError("Unsupporting sharing policy");
        }
      }
      return ptr;
    }
    function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError("null is not a valid " + this.name);
        }
        return 0;
      }
      if (!handle.$$) {
        throwBindingError('Cannot pass "' + _embind_repr(handle) + '" as a ' + this.name);
      }
      if (!handle.$$.ptr) {
        throwBindingError("Cannot pass deleted object as a pointer of type " + this.name);
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError("Cannot convert argument of type " + handle.$$.ptrType.name + " to parameter type " + this.name);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
    function simpleReadValueFromPointer(pointer) {
      return this["fromWireType"](HEAPU32[pointer >> 2]);
    }
    function RegisteredPointer_getPointee(ptr) {
      if (this.rawGetPointee) {
        ptr = this.rawGetPointee(ptr);
      }
      return ptr;
    }
    function RegisteredPointer_destructor(ptr) {
      if (this.rawDestructor) {
        this.rawDestructor(ptr);
      }
    }
    function RegisteredPointer_deleteObject(handle) {
      if (handle !== null) {
        handle["delete"]();
      }
    }
    function downcastPointer(ptr, ptrClass, desiredClass) {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (void 0 === desiredClass.baseClass) {
        return null;
      }
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    }
    function getInheritedInstanceCount() {
      return Object.keys(registeredInstances).length;
    }
    function getLiveInheritedInstances() {
      var rv = [];
      for (var k in registeredInstances) {
        if (registeredInstances.hasOwnProperty(k)) {
          rv.push(registeredInstances[k]);
        }
      }
      return rv;
    }
    function setDelayFunction(fn2) {
      delayFunction = fn2;
      if (deletionQueue.length && delayFunction) {
        delayFunction(flushPendingDeletes);
      }
    }
    function init_embind() {
      Module["getInheritedInstanceCount"] = getInheritedInstanceCount;
      Module["getLiveInheritedInstances"] = getLiveInheritedInstances;
      Module["flushPendingDeletes"] = flushPendingDeletes;
      Module["setDelayFunction"] = setDelayFunction;
    }
    var registeredInstances = {};
    function getBasestPointer(class_, ptr) {
      if (ptr === void 0) {
        throwBindingError("ptr should not be undefined");
      }
      while (class_.baseClass) {
        ptr = class_.upcast(ptr);
        class_ = class_.baseClass;
      }
      return ptr;
    }
    function getInheritedInstance(class_, ptr) {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    }
    function makeClassHandle(prototype, record) {
      if (!record.ptrType || !record.ptr) {
        throwInternalError("makeClassHandle requires ptr and ptrType");
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError("Both smartPtrType and smartPtr must be specified");
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, { $$: { value: record } }));
    }
    function RegisteredPointer_fromWireType(ptr) {
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (void 0 !== registeredInstance) {
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance["clone"]();
        } else {
          var rv = registeredInstance["clone"]();
          this.destructor(ptr);
          return rv;
        }
      }
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this.pointeeType, ptr: rawPointer, smartPtrType: this, smartPtr: ptr });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, { ptrType: this, ptr });
        }
      }
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(rawPointer, this.registeredClass, toType.registeredClass);
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp, smartPtrType: this, smartPtr: ptr });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, { ptrType: toType, ptr: dp });
      }
    }
    function init_RegisteredPointer() {
      RegisteredPointer.prototype.getPointee = RegisteredPointer_getPointee;
      RegisteredPointer.prototype.destructor = RegisteredPointer_destructor;
      RegisteredPointer.prototype["argPackAdvance"] = 8;
      RegisteredPointer.prototype["readValueFromPointer"] = simpleReadValueFromPointer;
      RegisteredPointer.prototype["deleteObject"] = RegisteredPointer_deleteObject;
      RegisteredPointer.prototype["fromWireType"] = RegisteredPointer_fromWireType;
    }
    function RegisteredPointer(name, registeredClass, isReference, isConst, isSmartPointer, pointeeType, sharingPolicy, rawGetPointee, rawConstructor, rawShare, rawDestructor) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
      if (!isSmartPointer && registeredClass.baseClass === void 0) {
        if (isConst) {
          this["toWireType"] = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this["toWireType"] = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this["toWireType"] = genericPointerToWireType;
      }
    }
    function replacePublicSymbol(name, value, numArguments) {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError("Replacing nonexistant public symbol");
      }
      if (void 0 !== Module[name].overloadTable && void 0 !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    }
    function dynCallLegacy(sig, ptr, args) {
      var f = Module["dynCall_" + sig];
      return args && args.length ? f.apply(null, [ptr].concat(args)) : f.call(null, ptr);
    }
    function dynCall(sig, ptr, args) {
      if (sig.includes("j")) {
        return dynCallLegacy(sig, ptr, args);
      }
      return getWasmTableEntry(ptr).apply(null, args);
    }
    function getDynCaller(sig, ptr) {
      var argCache = [];
      return function() {
        argCache.length = arguments.length;
        for (var i = 0; i < arguments.length; i++) {
          argCache[i] = arguments[i];
        }
        return dynCall(sig, ptr, argCache);
      };
    }
    function embind__requireFunction(signature, rawFunction) {
      signature = readLatin1String(signature);
      function makeDynCaller() {
        if (signature.includes("j")) {
          return getDynCaller(signature, rawFunction);
        }
        return getWasmTableEntry(rawFunction);
      }
      var fp = makeDynCaller();
      if (typeof fp !== "function") {
        throwBindingError("unknown function pointer with signature " + signature + ": " + rawFunction);
      }
      return fp;
    }
    var UnboundTypeError = void 0;
    function getTypeName(type) {
      var ptr = ___getTypeName(type);
      var rv = readLatin1String(ptr);
      _free(ptr);
      return rv;
    }
    function throwUnboundTypeError(message, types) {
      var unboundTypes = [];
      var seen2 = {};
      function visit(type) {
        if (seen2[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen2[type] = true;
      }
      types.forEach(visit);
      throw new UnboundTypeError(message + ": " + unboundTypes.map(getTypeName).join([", "]));
    }
    function __embind_register_class(rawType, rawPointerType, rawConstPointerType, baseClassRawType, getActualTypeSignature, getActualType, upcastSignature, upcast, downcastSignature, downcast, name, destructorSignature, rawDestructor) {
      name = readLatin1String(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      if (upcast) {
        upcast = embind__requireFunction(upcastSignature, upcast);
      }
      if (downcast) {
        downcast = embind__requireFunction(downcastSignature, downcast);
      }
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
      exposePublicSymbol(legalFunctionName, function() {
        throwUnboundTypeError("Cannot construct " + name + " due to unbound types", [baseClassRawType]);
      });
      whenDependentTypesAreResolved([rawType, rawPointerType, rawConstPointerType], baseClassRawType ? [baseClassRawType] : [], function(base) {
        base = base[0];
        var baseClass;
        var basePrototype;
        if (baseClassRawType) {
          baseClass = base.registeredClass;
          basePrototype = baseClass.instancePrototype;
        } else {
          basePrototype = ClassHandle.prototype;
        }
        var constructor = createNamedFunction(legalFunctionName, function() {
          if (Object.getPrototypeOf(this) !== instancePrototype) {
            throw new BindingError("Use 'new' to construct " + name);
          }
          if (void 0 === registeredClass.constructor_body) {
            throw new BindingError(name + " has no accessible constructor");
          }
          var body = registeredClass.constructor_body[arguments.length];
          if (void 0 === body) {
            throw new BindingError("Tried to invoke ctor of " + name + " with invalid number of parameters (" + arguments.length + ") - expected (" + Object.keys(registeredClass.constructor_body).toString() + ") parameters instead!");
          }
          return body.apply(this, arguments);
        });
        var instancePrototype = Object.create(basePrototype, { constructor: { value: constructor } });
        constructor.prototype = instancePrototype;
        var registeredClass = new RegisteredClass(name, constructor, instancePrototype, rawDestructor, baseClass, getActualType, upcast, downcast);
        var referenceConverter = new RegisteredPointer(name, registeredClass, true, false, false);
        var pointerConverter = new RegisteredPointer(name + "*", registeredClass, false, false, false);
        var constPointerConverter = new RegisteredPointer(name + " const*", registeredClass, false, true, false);
        registeredPointers[rawType] = { pointerType: pointerConverter, constPointerType: constPointerConverter };
        replacePublicSymbol(legalFunctionName, constructor);
        return [referenceConverter, pointerConverter, constPointerConverter];
      });
    }
    function heap32VectorToArray(count, firstElement) {
      var array = [];
      for (var i = 0; i < count; i++) {
        array.push(HEAP32[(firstElement >> 2) + i]);
      }
      return array;
    }
    function runDestructors(destructors) {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    }
    function __embind_register_class_constructor(rawClassType, argCount, rawArgTypesAddr, invokerSignature, invoker, rawConstructor) {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = "constructor " + classType.name;
        if (void 0 === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (void 0 !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError("Cannot register multiple constructors with identical number of parameters (" + (argCount - 1) + ") for class '" + classType.name + "'! Overload resolution is currently only performed using the parameter count, not actual type info!");
        }
        classType.registeredClass.constructor_body[argCount - 1] = function unboundTypeHandler() {
          throwUnboundTypeError("Cannot construct " + classType.name + " due to unbound types", rawArgTypes);
        };
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
          return [];
        });
        return [];
      });
    }
    function new_(constructor, argumentList) {
      if (!(constructor instanceof Function)) {
        throw new TypeError("new_ called with constructor type " + typeof constructor + " which is not a function");
      }
      var dummy = createNamedFunction(constructor.name || "unknownFunctionName", function() {
      });
      dummy.prototype = constructor.prototype;
      var obj = new dummy();
      var r = constructor.apply(obj, argumentList);
      return r instanceof Object ? r : obj;
    }
    function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc) {
      var argCount = argTypes.length;
      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
      var isClassMethodFunc = argTypes[1] !== null && classType !== null;
      var needsDestructorStack = false;
      for (var i = 1; i < argTypes.length; ++i) {
        if (argTypes[i] !== null && argTypes[i].destructorFunction === void 0) {
          needsDestructorStack = true;
          break;
        }
      }
      var returns = argTypes[0].name !== "void";
      var argsList = "";
      var argsListWired = "";
      for (var i = 0; i < argCount - 2; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        argsListWired += (i !== 0 ? ", " : "") + "arg" + i + "Wired";
      }
      var invokerFnBody = "return function " + makeLegalFunctionName(humanName) + "(" + argsList + ") {\nif (arguments.length !== " + (argCount - 2) + ") {\nthrowBindingError('function " + humanName + " called with ' + arguments.length + ' arguments, expected " + (argCount - 2) + " args!');\n}\n";
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["throwBindingError", "invoker", "fn", "runDestructors", "retType", "classParam"];
      var args2 = [throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, argTypes[0], argTypes[1]];
      if (isClassMethodFunc) {
        invokerFnBody += "var thisWired = classParam.toWireType(" + dtorStack + ", this);\n";
      }
      for (var i = 0; i < argCount - 2; ++i) {
        invokerFnBody += "var arg" + i + "Wired = argType" + i + ".toWireType(" + dtorStack + ", arg" + i + "); // " + argTypes[i + 2].name + "\n";
        args1.push("argType" + i);
        args2.push(argTypes[i + 2]);
      }
      if (isClassMethodFunc) {
        argsListWired = "thisWired" + (argsListWired.length > 0 ? ", " : "") + argsListWired;
      }
      invokerFnBody += (returns ? "var rv = " : "") + "invoker(fn" + (argsListWired.length > 0 ? ", " : "") + argsListWired + ");\n";
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc ? 1 : 2; i < argTypes.length; ++i) {
          var paramName = i === 1 ? "thisWired" : "arg" + (i - 2) + "Wired";
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody += paramName + "_dtor(" + paramName + "); // " + argTypes[i].name + "\n";
            args1.push(paramName + "_dtor");
            args2.push(argTypes[i].destructorFunction);
          }
        }
      }
      if (returns) {
        invokerFnBody += "var ret = retType.fromWireType(rv);\nreturn ret;\n";
      }
      invokerFnBody += "}\n";
      args1.push(invokerFnBody);
      var invokerFunction = new_(Function, args1).apply(null, args2);
      return invokerFunction;
    }
    function __embind_register_class_function(rawClassType, methodName, argCount, rawArgTypesAddr, invokerSignature, rawInvoker, context, isPureVirtual) {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = readLatin1String(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker);
      whenDependentTypesAreResolved([], [rawClassType], function(classType) {
        classType = classType[0];
        var humanName = classType.name + "." + methodName;
        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
        function unboundTypesHandler() {
          throwUnboundTypeError("Cannot call " + humanName + " due to unbound types", rawArgTypes);
        }
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (void 0 === method || void 0 === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2) {
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
        whenDependentTypesAreResolved([], rawArgTypes, function(argTypes) {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context);
          if (void 0 === proto[methodName].overloadTable) {
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
          return [];
        });
        return [];
      });
    }
    function validateThis(this_, classType, humanName) {
      if (!(this_ instanceof Object)) {
        throwBindingError(humanName + ' with invalid "this": ' + this_);
      }
      if (!(this_ instanceof classType.registeredClass.constructor)) {
        throwBindingError(humanName + ' incompatible with "this" of type ' + this_.constructor.name);
      }
      if (!this_.$$.ptr) {
        throwBindingError("cannot call emscripten binding method " + humanName + " on deleted object");
      }
      return upcastPointer(this_.$$.ptr, this_.$$.ptrType.registeredClass, classType.registeredClass);
    }
    function __embind_register_class_property(classType, fieldName, getterReturnType, getterSignature, getter, getterContext, setterArgumentType, setterSignature, setter, setterContext) {
      fieldName = readLatin1String(fieldName);
      getter = embind__requireFunction(getterSignature, getter);
      whenDependentTypesAreResolved([], [classType], function(classType2) {
        classType2 = classType2[0];
        var humanName = classType2.name + "." + fieldName;
        var desc = { get: function() {
          throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
        }, enumerable: true, configurable: true };
        if (setter) {
          desc.set = function() {
            throwUnboundTypeError("Cannot access " + humanName + " due to unbound types", [getterReturnType, setterArgumentType]);
          };
        } else {
          desc.set = function(v) {
            throwBindingError(humanName + " is a read-only property");
          };
        }
        Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc);
        whenDependentTypesAreResolved([], setter ? [getterReturnType, setterArgumentType] : [getterReturnType], function(types) {
          var getterReturnType2 = types[0];
          var desc2 = { get: function() {
            var ptr = validateThis(this, classType2, humanName + " getter");
            return getterReturnType2["fromWireType"](getter(getterContext, ptr));
          }, enumerable: true };
          if (setter) {
            setter = embind__requireFunction(setterSignature, setter);
            var setterArgumentType2 = types[1];
            desc2.set = function(v) {
              var ptr = validateThis(this, classType2, humanName + " setter");
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType2["toWireType"](destructors, v));
              runDestructors(destructors);
            };
          }
          Object.defineProperty(classType2.registeredClass.instancePrototype, fieldName, desc2);
          return [];
        });
        return [];
      });
    }
    var emval_free_list = [];
    var emval_handle_array = [{}, { value: void 0 }, { value: null }, { value: true }, { value: false }];
    function __emval_decref(handle) {
      if (handle > 4 && 0 === --emval_handle_array[handle].refcount) {
        emval_handle_array[handle] = void 0;
        emval_free_list.push(handle);
      }
    }
    function count_emval_handles() {
      var count = 0;
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== void 0) {
          ++count;
        }
      }
      return count;
    }
    function get_first_emval() {
      for (var i = 5; i < emval_handle_array.length; ++i) {
        if (emval_handle_array[i] !== void 0) {
          return emval_handle_array[i];
        }
      }
      return null;
    }
    function init_emval() {
      Module["count_emval_handles"] = count_emval_handles;
      Module["get_first_emval"] = get_first_emval;
    }
    var Emval = { toValue: function(handle) {
      if (!handle) {
        throwBindingError("Cannot use deleted val. handle = " + handle);
      }
      return emval_handle_array[handle].value;
    }, toHandle: function(value) {
      switch (value) {
        case void 0: {
          return 1;
        }
        case null: {
          return 2;
        }
        case true: {
          return 3;
        }
        case false: {
          return 4;
        }
        default: {
          var handle = emval_free_list.length ? emval_free_list.pop() : emval_handle_array.length;
          emval_handle_array[handle] = { refcount: 1, value };
          return handle;
        }
      }
    } };
    function __embind_register_emval(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": function(handle) {
        var rv = Emval.toValue(handle);
        __emval_decref(handle);
        return rv;
      }, "toWireType": function(destructors, value) {
        return Emval.toHandle(value);
      }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: null });
    }
    function _embind_repr(v) {
      if (v === null) {
        return "null";
      }
      var t = typeof v;
      if (t === "object" || t === "array" || t === "function") {
        return v.toString();
      } else {
        return "" + v;
      }
    }
    function floatReadValueFromPointer(name, shift) {
      switch (shift) {
        case 2:
          return function(pointer) {
            return this["fromWireType"](HEAPF32[pointer >> 2]);
          };
        case 3:
          return function(pointer) {
            return this["fromWireType"](HEAPF64[pointer >> 3]);
          };
        default:
          throw new TypeError("Unknown float type: " + name);
      }
    }
    function __embind_register_float(rawType, name, size) {
      var shift = getShiftFromSize(size);
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": function(value) {
        return value;
      }, "toWireType": function(destructors, value) {
        return value;
      }, "argPackAdvance": 8, "readValueFromPointer": floatReadValueFromPointer(name, shift), destructorFunction: null });
    }
    function integerReadValueFromPointer(name, shift, signed) {
      switch (shift) {
        case 0:
          return signed ? function readS8FromPointer(pointer) {
            return HEAP8[pointer];
          } : function readU8FromPointer(pointer) {
            return HEAPU8[pointer];
          };
        case 1:
          return signed ? function readS16FromPointer(pointer) {
            return HEAP16[pointer >> 1];
          } : function readU16FromPointer(pointer) {
            return HEAPU16[pointer >> 1];
          };
        case 2:
          return signed ? function readS32FromPointer(pointer) {
            return HEAP32[pointer >> 2];
          } : function readU32FromPointer(pointer) {
            return HEAPU32[pointer >> 2];
          };
        default:
          throw new TypeError("Unknown integer type: " + name);
      }
    }
    function __embind_register_integer(primitiveType, name, size, minRange, maxRange) {
      name = readLatin1String(name);
      if (maxRange === -1) {
        maxRange = 4294967295;
      }
      var shift = getShiftFromSize(size);
      var fromWireType = function(value) {
        return value;
      };
      if (minRange === 0) {
        var bitshift = 32 - 8 * size;
        fromWireType = function(value) {
          return value << bitshift >>> bitshift;
        };
      }
      var isUnsignedType = name.includes("unsigned");
      registerType(primitiveType, { name, "fromWireType": fromWireType, "toWireType": function(destructors, value) {
        if (typeof value !== "number" && typeof value !== "boolean") {
          throw new TypeError('Cannot convert "' + _embind_repr(value) + '" to ' + this.name);
        }
        if (value < minRange || value > maxRange) {
          throw new TypeError('Passing a number "' + _embind_repr(value) + '" from JS side to C/C++ side to an argument of type "' + name + '", which is outside the valid range [' + minRange + ", " + maxRange + "]!");
        }
        return isUnsignedType ? value >>> 0 : value | 0;
      }, "argPackAdvance": 8, "readValueFromPointer": integerReadValueFromPointer(name, shift, minRange !== 0), destructorFunction: null });
    }
    function __embind_register_memory_view(rawType, dataTypeIndex, name) {
      var typeMapping = [Int8Array, Uint8Array, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array];
      var TA = typeMapping[dataTypeIndex];
      function decodeMemoryView(handle) {
        handle = handle >> 2;
        var heap = HEAPU32;
        var size = heap[handle];
        var data2 = heap[handle + 1];
        return new TA(buffer, data2, size);
      }
      name = readLatin1String(name);
      registerType(rawType, { name, "fromWireType": decodeMemoryView, "argPackAdvance": 8, "readValueFromPointer": decodeMemoryView }, { ignoreDuplicateRegistrations: true });
    }
    function __embind_register_std_string(rawType, name) {
      name = readLatin1String(name);
      var stdStringIsUTF8 = name === "std::string";
      registerType(rawType, { name, "fromWireType": function(value) {
        var length = HEAPU32[value >> 2];
        var str;
        if (stdStringIsUTF8) {
          var decodeStartPtr = value + 4;
          for (var i = 0; i <= length; ++i) {
            var currentBytePtr = value + 4 + i;
            if (i == length || HEAPU8[currentBytePtr] == 0) {
              var maxRead = currentBytePtr - decodeStartPtr;
              var stringSegment = UTF8ToString(decodeStartPtr, maxRead);
              if (str === void 0) {
                str = stringSegment;
              } else {
                str += String.fromCharCode(0);
                str += stringSegment;
              }
              decodeStartPtr = currentBytePtr + 1;
            }
          }
        } else {
          var a = new Array(length);
          for (var i = 0; i < length; ++i) {
            a[i] = String.fromCharCode(HEAPU8[value + 4 + i]);
          }
          str = a.join("");
        }
        _free(value);
        return str;
      }, "toWireType": function(destructors, value) {
        if (value instanceof ArrayBuffer) {
          value = new Uint8Array(value);
        }
        var getLength;
        var valueIsOfTypeString = typeof value === "string";
        if (!(valueIsOfTypeString || value instanceof Uint8Array || value instanceof Uint8ClampedArray || value instanceof Int8Array)) {
          throwBindingError("Cannot pass non-string to std::string");
        }
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          getLength = function() {
            return lengthBytesUTF8(value);
          };
        } else {
          getLength = function() {
            return value.length;
          };
        }
        var length = getLength();
        var ptr = _malloc(4 + length + 1);
        HEAPU32[ptr >> 2] = length;
        if (stdStringIsUTF8 && valueIsOfTypeString) {
          stringToUTF8(value, ptr + 4, length + 1);
        } else {
          if (valueIsOfTypeString) {
            for (var i = 0; i < length; ++i) {
              var charCode = value.charCodeAt(i);
              if (charCode > 255) {
                _free(ptr);
                throwBindingError("String has UTF-16 code units that do not fit in 8 bits");
              }
              HEAPU8[ptr + 4 + i] = charCode;
            }
          } else {
            for (var i = 0; i < length; ++i) {
              HEAPU8[ptr + 4 + i] = value[i];
            }
          }
        }
        if (destructors !== null) {
          destructors.push(_free, ptr);
        }
        return ptr;
      }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
        _free(ptr);
      } });
    }
    function __embind_register_std_wstring(rawType, charSize, name) {
      name = readLatin1String(name);
      var decodeString, encodeString, getHeap, lengthBytesUTF, shift;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
        getHeap = function() {
          return HEAPU16;
        };
        shift = 1;
      } else if (charSize === 4) {
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
        getHeap = function() {
          return HEAPU32;
        };
        shift = 2;
      }
      registerType(rawType, { name, "fromWireType": function(value) {
        var length = HEAPU32[value >> 2];
        var HEAP = getHeap();
        var str;
        var decodeStartPtr = value + 4;
        for (var i = 0; i <= length; ++i) {
          var currentBytePtr = value + 4 + i * charSize;
          if (i == length || HEAP[currentBytePtr >> shift] == 0) {
            var maxReadBytes = currentBytePtr - decodeStartPtr;
            var stringSegment = decodeString(decodeStartPtr, maxReadBytes);
            if (str === void 0) {
              str = stringSegment;
            } else {
              str += String.fromCharCode(0);
              str += stringSegment;
            }
            decodeStartPtr = currentBytePtr + charSize;
          }
        }
        _free(value);
        return str;
      }, "toWireType": function(destructors, value) {
        if (!(typeof value === "string")) {
          throwBindingError("Cannot pass non-string to C++ string type " + name);
        }
        var length = lengthBytesUTF(value);
        var ptr = _malloc(4 + length + charSize);
        HEAPU32[ptr >> 2] = length >> shift;
        encodeString(value, ptr + 4, length + charSize);
        if (destructors !== null) {
          destructors.push(_free, ptr);
        }
        return ptr;
      }, "argPackAdvance": 8, "readValueFromPointer": simpleReadValueFromPointer, destructorFunction: function(ptr) {
        _free(ptr);
      } });
    }
    function __embind_register_void(rawType, name) {
      name = readLatin1String(name);
      registerType(rawType, { isVoid: true, name, "argPackAdvance": 0, "fromWireType": function() {
        return void 0;
      }, "toWireType": function(destructors, o) {
        return void 0;
      } });
    }
    function requireRegisteredType(rawType, humanName) {
      var impl = registeredTypes[rawType];
      if (void 0 === impl) {
        throwBindingError(humanName + " has unknown type " + getTypeName(rawType));
      }
      return impl;
    }
    function __emval_as(handle, returnType, destructorsRef) {
      handle = Emval.toValue(handle);
      returnType = requireRegisteredType(returnType, "emval::as");
      var destructors = [];
      var rd = Emval.toHandle(destructors);
      HEAP32[destructorsRef >> 2] = rd;
      return returnType["toWireType"](destructors, handle);
    }
    var emval_symbols = {};
    function getStringOrSymbol(address) {
      var symbol = emval_symbols[address];
      if (symbol === void 0) {
        return readLatin1String(address);
      } else {
        return symbol;
      }
    }
    var emval_methodCallers = [];
    function __emval_call_void_method(caller, handle, methodName, args) {
      caller = emval_methodCallers[caller];
      handle = Emval.toValue(handle);
      methodName = getStringOrSymbol(methodName);
      caller(handle, methodName, null, args);
    }
    function __emval_addMethodCaller(caller) {
      var id2 = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id2;
    }
    function __emval_lookupTypes(argCount, argTypes) {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAP32[(argTypes >> 2) + i], "parameter " + i);
      }
      return a;
    }
    var emval_registeredMethods = [];
    function __emval_get_method_caller(argCount, argTypes) {
      var types = __emval_lookupTypes(argCount, argTypes);
      var retType = types[0];
      var signatureName = retType.name + "_$" + types.slice(1).map(function(t) {
        return t.name;
      }).join("_") + "$";
      var returnId = emval_registeredMethods[signatureName];
      if (returnId !== void 0) {
        return returnId;
      }
      var params = ["retType"];
      var args = [retType];
      var argsList = "";
      for (var i = 0; i < argCount - 1; ++i) {
        argsList += (i !== 0 ? ", " : "") + "arg" + i;
        params.push("argType" + i);
        args.push(types[1 + i]);
      }
      var functionName2 = makeLegalFunctionName("methodCaller_" + signatureName);
      var functionBody = "return function " + functionName2 + "(handle, name, destructors, args) {\n";
      var offset2 = 0;
      for (var i = 0; i < argCount - 1; ++i) {
        functionBody += "    var arg" + i + " = argType" + i + ".readValueFromPointer(args" + (offset2 ? "+" + offset2 : "") + ");\n";
        offset2 += types[i + 1]["argPackAdvance"];
      }
      functionBody += "    var rv = handle[name](" + argsList + ");\n";
      for (var i = 0; i < argCount - 1; ++i) {
        if (types[i + 1]["deleteObject"]) {
          functionBody += "    argType" + i + ".deleteObject(arg" + i + ");\n";
        }
      }
      if (!retType.isVoid) {
        functionBody += "    return retType.toWireType(destructors, rv);\n";
      }
      functionBody += "};\n";
      params.push(functionBody);
      var invokerFunction = new_(Function, params).apply(null, args);
      returnId = __emval_addMethodCaller(invokerFunction);
      emval_registeredMethods[signatureName] = returnId;
      return returnId;
    }
    function __emval_get_property(handle, key2) {
      handle = Emval.toValue(handle);
      key2 = Emval.toValue(key2);
      return Emval.toHandle(handle[key2]);
    }
    function __emval_incref(handle) {
      if (handle > 4) {
        emval_handle_array[handle].refcount += 1;
      }
    }
    function __emval_new_array() {
      return Emval.toHandle([]);
    }
    function __emval_new_cstring(v) {
      return Emval.toHandle(getStringOrSymbol(v));
    }
    function __emval_new_object() {
      return Emval.toHandle({});
    }
    function __emval_run_destructors(handle) {
      var destructors = Emval.toValue(handle);
      runDestructors(destructors);
      __emval_decref(handle);
    }
    function __emval_set_property(handle, key2, value) {
      handle = Emval.toValue(handle);
      key2 = Emval.toValue(key2);
      value = Emval.toValue(value);
      handle[key2] = value;
    }
    function __emval_take_value(type, argv) {
      type = requireRegisteredType(type, "_emval_take_value");
      var v = type["readValueFromPointer"](argv);
      return Emval.toHandle(v);
    }
    function _abort() {
      abort("");
    }
    function _emscripten_get_heap_max() {
      return HEAPU8.length;
    }
    function _emscripten_memcpy_big(dest, src2, num) {
      HEAPU8.copyWithin(dest, src2, src2 + num);
    }
    function abortOnCannotGrowMemory(requestedSize) {
      abort("OOM");
    }
    function _emscripten_resize_heap(requestedSize) {
      HEAPU8.length;
      abortOnCannotGrowMemory();
    }
    var SYSCALLS = { mappings: {}, buffers: [null, [], []], printChar: function(stream, curr) {
      var buffer2 = SYSCALLS.buffers[stream];
      if (curr === 0 || curr === 10) {
        (stream === 1 ? out : err2)(UTF8ArrayToString(buffer2, 0));
        buffer2.length = 0;
      } else {
        buffer2.push(curr);
      }
    }, varargs: void 0, get: function() {
      SYSCALLS.varargs += 4;
      var ret = HEAP32[SYSCALLS.varargs - 4 >> 2];
      return ret;
    }, getStr: function(ptr) {
      var ret = UTF8ToString(ptr);
      return ret;
    }, get64: function(low, high) {
      return low;
    } };
    function _fd_close(fd) {
      return 0;
    }
    function _fd_seek(fd, offset_low, offset_high, whence, newOffset) {
    }
    function _fd_write(fd, iov, iovcnt, pnum) {
      var num = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAP32[iov >> 2];
        var len = HEAP32[iov + 4 >> 2];
        iov += 8;
        for (var j = 0; j < len; j++) {
          SYSCALLS.printChar(fd, HEAPU8[ptr + j]);
        }
        num += len;
      }
      HEAP32[pnum >> 2] = num;
      return 0;
    }
    function _setTempRet0(val) {
    }
    embind_init_charCodes();
    BindingError = Module["BindingError"] = extendError(Error, "BindingError");
    InternalError = Module["InternalError"] = extendError(Error, "InternalError");
    init_ClassHandle();
    init_RegisteredPointer();
    init_embind();
    UnboundTypeError = Module["UnboundTypeError"] = extendError(Error, "UnboundTypeError");
    init_emval();
    var asmLibraryArg = { "k": ___assert_fail, "y": __embind_register_bigint, "E": __embind_register_bool, "t": __embind_register_class, "r": __embind_register_class_constructor, "l": __embind_register_class_function, "G": __embind_register_class_property, "D": __embind_register_emval, "p": __embind_register_float, "c": __embind_register_integer, "b": __embind_register_memory_view, "q": __embind_register_std_string, "n": __embind_register_std_wstring, "F": __embind_register_void, "v": __emval_as, "g": __emval_call_void_method, "a": __emval_decref, "f": __emval_get_method_caller, "w": __emval_get_property, "h": __emval_incref, "s": __emval_new_array, "d": __emval_new_cstring, "H": __emval_new_object, "u": __emval_run_destructors, "i": __emval_set_property, "e": __emval_take_value, "j": _abort, "C": _emscripten_get_heap_max, "z": _emscripten_memcpy_big, "m": _emscripten_resize_heap, "A": _fd_close, "x": _fd_seek, "B": _fd_write, "o": _setTempRet0 };
    createWasm();
    Module["___wasm_call_ctors"] = function() {
      return (Module["___wasm_call_ctors"] = Module["asm"]["J"]).apply(null, arguments);
    };
    Module["_wdsp_anr_create"] = function() {
      return (Module["_wdsp_anr_create"] = Module["asm"]["K"]).apply(null, arguments);
    };
    Module["_wdsp_anr_filter"] = function() {
      return (Module["_wdsp_anr_filter"] = Module["asm"]["L"]).apply(null, arguments);
    };
    Module["_wdsp_anr_destroy"] = function() {
      return (Module["_wdsp_anr_destroy"] = Module["asm"]["M"]).apply(null, arguments);
    };
    var _free = Module["_free"] = function() {
      return (_free = Module["_free"] = Module["asm"]["N"]).apply(null, arguments);
    };
    Module["_wild_nb_init"] = function() {
      return (Module["_wild_nb_init"] = Module["asm"]["O"]).apply(null, arguments);
    };
    Module["_wild_nb_blank"] = function() {
      return (Module["_wild_nb_blank"] = Module["asm"]["P"]).apply(null, arguments);
    };
    Module["_wild_nb_destroy"] = function() {
      return (Module["_wild_nb_destroy"] = Module["asm"]["Q"]).apply(null, arguments);
    };
    Module["_nr_spectral_init"] = function() {
      return (Module["_nr_spectral_init"] = Module["asm"]["R"]).apply(null, arguments);
    };
    var _malloc = Module["_malloc"] = function() {
      return (_malloc = Module["_malloc"] = Module["asm"]["S"]).apply(null, arguments);
    };
    Module["_nr_spectral_process"] = function() {
      return (Module["_nr_spectral_process"] = Module["asm"]["T"]).apply(null, arguments);
    };
    Module["_agc_rrrf_create"] = function() {
      return (Module["_agc_rrrf_create"] = Module["asm"]["U"]).apply(null, arguments);
    };
    Module["_agc_rrrf_destroy"] = function() {
      return (Module["_agc_rrrf_destroy"] = Module["asm"]["V"]).apply(null, arguments);
    };
    Module["_agc_rrrf_execute_block"] = function() {
      return (Module["_agc_rrrf_execute_block"] = Module["asm"]["W"]).apply(null, arguments);
    };
    Module["_firfilt_rrrf_create"] = function() {
      return (Module["_firfilt_rrrf_create"] = Module["asm"]["X"]).apply(null, arguments);
    };
    Module["_firfilt_rrrf_destroy"] = function() {
      return (Module["_firfilt_rrrf_destroy"] = Module["asm"]["Y"]).apply(null, arguments);
    };
    Module["_firfilt_rrrf_execute_block"] = function() {
      return (Module["_firfilt_rrrf_execute_block"] = Module["asm"]["Z"]).apply(null, arguments);
    };
    Module["_msresamp_rrrf_create"] = function() {
      return (Module["_msresamp_rrrf_create"] = Module["asm"]["_"]).apply(null, arguments);
    };
    Module["_resamp_rrrf_create"] = function() {
      return (Module["_resamp_rrrf_create"] = Module["asm"]["$"]).apply(null, arguments);
    };
    Module["_msresamp_rrrf_destroy"] = function() {
      return (Module["_msresamp_rrrf_destroy"] = Module["asm"]["aa"]).apply(null, arguments);
    };
    Module["_resamp_rrrf_destroy"] = function() {
      return (Module["_resamp_rrrf_destroy"] = Module["asm"]["ba"]).apply(null, arguments);
    };
    Module["_msresamp_rrrf_execute"] = function() {
      return (Module["_msresamp_rrrf_execute"] = Module["asm"]["ca"]).apply(null, arguments);
    };
    Module["_resamp_rrrf_execute_block"] = function() {
      return (Module["_resamp_rrrf_execute_block"] = Module["asm"]["da"]).apply(null, arguments);
    };
    Module["_estimate_req_filter_len"] = function() {
      return (Module["_estimate_req_filter_len"] = Module["asm"]["ea"]).apply(null, arguments);
    };
    Module["_liquid_firdes_kaiser"] = function() {
      return (Module["_liquid_firdes_kaiser"] = Module["asm"]["fa"]).apply(null, arguments);
    };
    Module["_fx_flac_size"] = function() {
      return (Module["_fx_flac_size"] = Module["asm"]["ga"]).apply(null, arguments);
    };
    Module["_fx_flac_init"] = function() {
      return (Module["_fx_flac_init"] = Module["asm"]["ha"]).apply(null, arguments);
    };
    Module["_fx_flac_reset"] = function() {
      return (Module["_fx_flac_reset"] = Module["asm"]["ia"]).apply(null, arguments);
    };
    Module["_fx_flac_get_state"] = function() {
      return (Module["_fx_flac_get_state"] = Module["asm"]["ja"]).apply(null, arguments);
    };
    Module["_fx_flac_get_streaminfo"] = function() {
      return (Module["_fx_flac_get_streaminfo"] = Module["asm"]["ka"]).apply(null, arguments);
    };
    Module["_fx_flac_alloc_default"] = function() {
      return (Module["_fx_flac_alloc_default"] = Module["asm"]["la"]).apply(null, arguments);
    };
    Module["_fx_flac_process"] = function() {
      return (Module["_fx_flac_process"] = Module["asm"]["ma"]).apply(null, arguments);
    };
    Module["_opus_decoder_create"] = function() {
      return (Module["_opus_decoder_create"] = Module["asm"]["oa"]).apply(null, arguments);
    };
    Module["_opus_decode"] = function() {
      return (Module["_opus_decode"] = Module["asm"]["pa"]).apply(null, arguments);
    };
    Module["_opus_decoder_destroy"] = function() {
      return (Module["_opus_decoder_destroy"] = Module["asm"]["qa"]).apply(null, arguments);
    };
    var ___getTypeName = Module["___getTypeName"] = function() {
      return (___getTypeName = Module["___getTypeName"] = Module["asm"]["ra"]).apply(null, arguments);
    };
    Module["___embind_register_native_and_builtin_types"] = function() {
      return (Module["___embind_register_native_and_builtin_types"] = Module["asm"]["sa"]).apply(null, arguments);
    };
    Module["_memcpy"] = function() {
      return (Module["_memcpy"] = Module["asm"]["ta"]).apply(null, arguments);
    };
    var stackSave = Module["stackSave"] = function() {
      return (stackSave = Module["stackSave"] = Module["asm"]["ua"]).apply(null, arguments);
    };
    var stackRestore = Module["stackRestore"] = function() {
      return (stackRestore = Module["stackRestore"] = Module["asm"]["va"]).apply(null, arguments);
    };
    var stackAlloc = Module["stackAlloc"] = function() {
      return (stackAlloc = Module["stackAlloc"] = Module["asm"]["wa"]).apply(null, arguments);
    };
    Module["dynCall_jiji"] = function() {
      return (Module["dynCall_jiji"] = Module["asm"]["xa"]).apply(null, arguments);
    };
    Module["ccall"] = ccall;
    Module["cwrap"] = cwrap;
    Module["setValue"] = setValue;
    Module["getValue"] = getValue;
    var calledRun;
    dependenciesFulfilled = function runCaller() {
      if (!calledRun)
        run2();
      if (!calledRun)
        dependenciesFulfilled = runCaller;
    };
    function run2(args) {
      if (runDependencies > 0) {
        return;
      }
      preRun();
      if (runDependencies > 0) {
        return;
      }
      function doRun() {
        if (calledRun)
          return;
        calledRun = true;
        Module["calledRun"] = true;
        if (ABORT)
          return;
        initRuntime();
        readyPromiseResolve(Module);
        if (Module["onRuntimeInitialized"])
          Module["onRuntimeInitialized"]();
        postRun();
      }
      if (Module["setStatus"]) {
        Module["setStatus"]("Running...");
        setTimeout(function() {
          setTimeout(function() {
            Module["setStatus"]("");
          }, 1);
          doRun();
        }, 1);
      } else {
        doRun();
      }
    }
    Module["run"] = run2;
    if (Module["preInit"]) {
      if (typeof Module["preInit"] == "function")
        Module["preInit"] = [Module["preInit"]];
      while (Module["preInit"].length > 0) {
        Module["preInit"].pop()();
      }
    }
    run2();
    return jsDSPModule2.ready;
  };
}();
class FoxenFlacDecoder {
  constructor(jsDSP2) {
    this.flac = jsDSP2._fx_flac_alloc_default();
    this.jsDSP = jsDSP2;
    this.inbuf = jsDSP2._malloc(16384);
    this.inptr = 0;
    this.inarr = new Uint8Array(jsDSP2.HEAPU8.buffer, this.inbuf, 16384);
    this.outbuf = jsDSP2._malloc(16384 * 4);
    this.outarr = new Int32Array(jsDSP2.HEAPU8.buffer, this.outbuf, 16384);
    this.inlen = jsDSP2._malloc(4);
    this.outlen = jsDSP2._malloc(4);
  }
  decode(buf) {
    this.inarr.set(buf, this.inptr);
    const buflen = buf.length;
    this.jsDSP.setValue(this.inlen, buflen, "i32");
    this.jsDSP.setValue(this.outlen, 16384, "i32");
    this.jsDSP._fx_flac_process(this.flac, this.inbuf, this.inlen, this.outbuf, this.outlen);
    const outlen = this.jsDSP.getValue(this.outlen, "i32");
    const inlen = this.jsDSP.getValue(this.inlen, "i32");
    this.inptr = buflen - inlen;
    const retarr = new Int16Array(outlen);
    for (let i = 0; i < outlen; i++) {
      retarr[i] = this.outarr[i] >>> 16;
    }
    return retarr;
  }
  destroy() {
    this.jsDSP._free(this.flac);
  }
}
const jsDSPWasm = "/assets/jsDSP-2684bc7b.wasm";
const jsDSPMem = "/assets/jsDSPnoWasm.js-e7d1f77b.mem";
const hasWasm = (() => {
  try {
    if (typeof WebAssembly === "object" && typeof WebAssembly.instantiate === "function") {
      const module = new WebAssembly.Module(Uint8Array.of(0, 97, 115, 109, 1, 0, 0, 0));
      if (module instanceof WebAssembly.Module) {
        return new WebAssembly.Instance(module) instanceof WebAssembly.Instance;
      }
    }
  } catch (e) {
  }
  return false;
})();
if (!window.crypto) {
  window.crypto = window.msCrypto;
}
let jsDSP;
let LiquidDSP;
let ZSTDSimpleDecode;
function createFlacDecoder() {
  return new FoxenFlacDecoder(jsDSP);
}
function createOpusDecoder(samplerate) {
  const decoder = new OpusWasmDecoder(samplerate);
  return decoder;
}
class OpusWasmDecoder {
  constructor(samplerate) {
    this.err = jsDSP._malloc(4);
    this.opusout = jsDSP._malloc(2048);
    this.opusin = jsDSP._malloc(2048);
    this.opusinarr = new Uint8Array(jsDSP.HEAPU8.buffer, this.opusin, 2048);
    this.opusoutarr = new Uint16Array(jsDSP.HEAPU8.buffer, this.opusout, 2048 / 2);
    this.decoder = jsDSP._opus_decoder_create(samplerate, 1, this.err);
    this.first = true;
  }
  decode(array) {
    this.opusinarr.set(array);
    const decoded = jsDSP._opus_decode(this.decoder, this.opusin, array.length, this.opusout, 16384, 0);
    return new Int16Array(this.opusoutarr.slice(0, decoded));
  }
  destroy() {
    jsDSP._free(this.err);
    jsDSP._free(this.opusin);
    jsDSP._free(this.opusout);
    jsDSP._opus_decoder_destroy(this.decoder);
  }
}
const zstdPromise = function zstdInit() {
  if (hasWasm) {
    const decoder = new Q();
    return decoder.init().then(() => {
      ZSTDSimpleDecode = (ZSTDEncoded) => {
        return decoder.decode(ZSTDEncoded);
      };
    });
  } else {
    ZSTDSimpleDecode = (ZSTDEncoded) => {
      return decompress(ZSTDEncoded);
    };
    return Promise.resolve(fzstd);
  }
}();
const jsDSPOptions = {
  locateFile(path2, prefix) {
    if (path2.endsWith(".mem"))
      return jsDSPMem;
    if (path2.endsWith(".wasm"))
      return jsDSPWasm;
    return prefix + path2;
  }
};
const jsDSPPromise = function initjsDSP() {
  if (hasWasm) {
    return jsDSPModule(jsDSPOptions).then((jsDSPModule2) => {
      jsDSP = jsDSPModule2;
      LiquidDSP = getLiquidDSP(jsDSPModule2);
      return LiquidDSP;
    });
  } else {
    window.Atomics = window.Atomics || {
      add(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] += value;
        return val;
      },
      and(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] &= value;
        return val;
      },
      exchange(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] = value;
        return val;
      },
      load(typedArray, index) {
        return typedArray[index];
      },
      or(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] |= value;
        return val;
      },
      store(typedArray, index, value) {
        typedArray[index] = value;
        return value;
      },
      sub(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] -= value;
        return val;
      },
      xor(typedArray, index, value) {
        const val = typedArray[index];
        typedArray[index] ^= value;
        return val;
      }
    };
    return __vitePreload(() => import("./jsDSPnoWasm-96428903.js"), true ? [] : void 0).then((jsDSP2) => {
      return jsDSP2.default(jsDSPOptions);
    }).then((jsDSPModule2) => {
      jsDSP = jsDSPModule2;
      LiquidDSP = getLiquidDSP(jsDSPModule2);
      return LiquidDSP;
    });
  }
}();
async function liquidDSPMsResampCreateJS(fromSamplerate, toSampleRate, channels2) {
  const resampler = new LiquidDSP.MsResamp(toSampleRate / fromSamplerate, 60);
  resampler.resample = resampler.execute;
  return resampler;
}
const createResampler = liquidDSPMsResampCreateJS;
class ZstdWaterfallDecoder {
  decode(array) {
    const compressedArray = new Uint8Array(array).subarray(8);
    const header = new Uint32Array(array.slice(0, 8));
    array = new Int8Array(ZSTDSimpleDecode(compressedArray));
    return [[array, header[0], header[1]]];
  }
}
class AV1WaterfallDecoder {
  constructor() {
    this.dav1d = new jsDSP.Dav1dDecoder();
  }
  decode(array) {
    const decoded = this.dav1d.dav1d_decode(new Uint8Array(array));
    this.dav1d.dav1d_picture_free();
    if (typeof decoded === "string") {
      console.log(decoded);
      return [];
    }
    const waterfallArr = [];
    const metadata = new Uint32Array(ZSTDSimpleDecode(decoded.itut_t35).slice(0).buffer);
    for (let i = 0; i < decoded.height; i++) {
      const arr = new Int8Array(metadata[i * 4 + 2]);
      const stride = decoded.stride[0];
      for (let j = 0; j < arr.length; j++) {
        arr[j] = decoded.plane[0][stride * i + j] ^ 128;
      }
      waterfallArr.push([arr, metadata[i * 4 + 0], metadata[i * 4 + 1]]);
    }
    return waterfallArr;
  }
}
async function initWrappers() {
  return Promise.all([zstdPromise, jsDSPPromise]);
}
function getNoiseProcessors(jsDSP2) {
  const wdsp_anr_create = jsDSP2.cwrap("wdsp_anr_create", "number", ["number", "number", "number", "number", "number"]);
  const wdsp_anr_destroy = jsDSP2.cwrap("wdsp_anr_destroy", "void", ["number"]);
  class WdspANR {
    constructor(nr_type, taps, dly, gain, leakage) {
      this.nr_type = nr_type;
      this.wdsp_anr = wdsp_anr_create(nr_type, taps, dly, gain, leakage);
      this.fptr = jsDSP2._malloc(16384 * 4);
      this.farr = new Float32Array(jsDSP2.HEAPU8.buffer, this.fptr, 16384);
    }
    filter(arr) {
      this.farr.set(arr);
      jsDSP2._wdsp_anr_filter(this.wdsp_anr, this.nr_type, arr.length, this.fptr, this.fptr);
      arr.set(this.farr.subarray(0, arr.length));
      return arr;
    }
    destroy() {
      jsDSP2._free(this.fptr);
      wdsp_anr_destroy(this.wdsp_anr);
    }
  }
  const wild_nb_init = jsDSP2.cwrap("wild_nb_init", "number", ["number", "number", "number"]);
  const wild_nb_destroy = jsDSP2.cwrap("wild_nb_destroy", "void", ["number"]);
  class WildNB {
    constructor(thresh, taps, samples) {
      this.wild_nb = wild_nb_init(thresh, taps, samples);
      this.fptr = jsDSP2._malloc(16384 * 4);
      this.farr = new Float32Array(jsDSP2.HEAPU8.buffer, this.fptr, 16384);
    }
    filter(arr) {
      this.farr.set(arr);
      jsDSP2._wild_nb_blank(this.wild_nb, arr.length, this.fptr);
      arr.set(this.farr.subarray(0, arr.length));
      return arr;
    }
    destroy() {
      jsDSP2._free(this.fptr);
      wild_nb_destroy(this.wild_nb);
    }
  }
  const nr_spectral_init = jsDSP2.cwrap("nr_spectral_init", "number", ["number", "number", "number", "number"]);
  const nr_spectral_destroy = jsDSP2.cwrap("wild_nb_destroy", "void", ["number"]);
  class SpectralNR {
    constructor(snd_rate, gain, alpha, asnr) {
      this.spectral_nr = nr_spectral_init(snd_rate, gain, alpha, asnr);
      this.fptr = jsDSP2._malloc(16384 * 4);
      this.farr = new Float32Array(jsDSP2.HEAPU8.buffer, this.fptr, 16384);
    }
    filter(arr) {
      this.farr.set(arr);
      jsDSP2._nr_spectral_process(this.spectral_nr, arr.length, this.fptr, this.fptr);
      arr.set(this.farr.subarray(0, arr.length));
      return arr;
    }
    destroy() {
      jsDSP2._free(this.fptr);
      nr_spectral_destroy(this.spectral_nr);
    }
  }
  const noise = {};
  noise.WdspANR = WdspANR;
  noise.WildNB = WildNB;
  noise.SpectralNR = SpectralNR;
  return noise;
}
class AudioProcessor {
  constructor() {
    this.NoiseProcessors = getNoiseProcessors(jsDSP);
    this.nrobj = new this.NoiseProcessors.WdspANR(1, 64, 32, 1024e-7, 0.128);
    this.anobj = new this.NoiseProcessors.WdspANR(0, 64, 32, 1024e-7, 0.128);
    this.nbobj = new this.NoiseProcessors.WildNB(0.95, 10, 7);
    this.nr = false;
    this.an = false;
    this.nb = false;
  }
  process(arr) {
    if (this.nr)
      arr = this.nrobj.filter(arr);
    if (this.nb)
      arr = this.nbobj.filter(arr);
    if (this.an)
      arr = this.anobj.filter(arr);
    return arr;
  }
  setNR(nr) {
    this.nr = nr;
  }
  setNB(nb) {
    this.nb = nb;
  }
  setAN(an) {
    this.an = an;
  }
}
const LiveMovingAverage = {
  push: function(val) {
    if ("number" !== typeof val)
      throw new Error("val must be a number.");
    this.sum -= this.data[this.dataI];
    this.sum += val;
    this.data[this.dataI] = val;
    this.dataI = (this.dataI + 1) % this.size;
    return this;
  },
  get: function() {
    return this.sum / this.size;
  }
};
const createWindow$1 = (size, fill2 = 0) => {
  if ("number" !== typeof size)
    throw new Error("size must be a number.");
  if ("number" !== typeof fill2)
    throw new Error("fill must be a number.");
  const w = Object.create(LiveMovingAverage);
  w.sum = size * fill2;
  w.size = size;
  w.data = new Array(size);
  w.data.fill(fill2);
  w.dataI = 0;
  return w;
};
var liveMovingAverage = createWindow$1;
const createExtendedExponentialRampToValueAutomationEvent = (value, endTime, insertTime) => {
  return { endTime, insertTime, type: "exponentialRampToValue", value };
};
const createExtendedLinearRampToValueAutomationEvent = (value, endTime, insertTime) => {
  return { endTime, insertTime, type: "linearRampToValue", value };
};
const createSetValueAutomationEvent = (value, startTime) => {
  return { startTime, type: "setValue", value };
};
const createSetValueCurveAutomationEvent = (values, startTime, duration) => {
  return { duration, startTime, type: "setValueCurve", values };
};
const getTargetValueAtTime = (time, valueAtStartTime, { startTime, target, timeConstant }) => {
  return target + (valueAtStartTime - target) * Math.exp((startTime - time) / timeConstant);
};
const isExponentialRampToValueAutomationEvent = (automationEvent) => {
  return automationEvent.type === "exponentialRampToValue";
};
const isLinearRampToValueAutomationEvent = (automationEvent) => {
  return automationEvent.type === "linearRampToValue";
};
const isAnyRampToValueAutomationEvent = (automationEvent) => {
  return isExponentialRampToValueAutomationEvent(automationEvent) || isLinearRampToValueAutomationEvent(automationEvent);
};
const isSetValueAutomationEvent = (automationEvent) => {
  return automationEvent.type === "setValue";
};
const isSetValueCurveAutomationEvent = (automationEvent) => {
  return automationEvent.type === "setValueCurve";
};
const getValueOfAutomationEventAtIndexAtTime = (automationEvents, index, time, defaultValue) => {
  const automationEvent = automationEvents[index];
  return automationEvent === void 0 ? defaultValue : isAnyRampToValueAutomationEvent(automationEvent) || isSetValueAutomationEvent(automationEvent) ? automationEvent.value : isSetValueCurveAutomationEvent(automationEvent) ? automationEvent.values[automationEvent.values.length - 1] : getTargetValueAtTime(time, getValueOfAutomationEventAtIndexAtTime(automationEvents, index - 1, automationEvent.startTime, defaultValue), automationEvent);
};
const getEndTimeAndValueOfPreviousAutomationEvent = (automationEvents, index, currentAutomationEvent, nextAutomationEvent, defaultValue) => {
  return currentAutomationEvent === void 0 ? [nextAutomationEvent.insertTime, defaultValue] : isAnyRampToValueAutomationEvent(currentAutomationEvent) ? [currentAutomationEvent.endTime, currentAutomationEvent.value] : isSetValueAutomationEvent(currentAutomationEvent) ? [currentAutomationEvent.startTime, currentAutomationEvent.value] : isSetValueCurveAutomationEvent(currentAutomationEvent) ? [
    currentAutomationEvent.startTime + currentAutomationEvent.duration,
    currentAutomationEvent.values[currentAutomationEvent.values.length - 1]
  ] : [
    currentAutomationEvent.startTime,
    getValueOfAutomationEventAtIndexAtTime(automationEvents, index - 1, currentAutomationEvent.startTime, defaultValue)
  ];
};
const isCancelAndHoldAutomationEvent = (automationEvent) => {
  return automationEvent.type === "cancelAndHold";
};
const isCancelScheduledValuesAutomationEvent = (automationEvent) => {
  return automationEvent.type === "cancelScheduledValues";
};
const getEventTime = (automationEvent) => {
  if (isCancelAndHoldAutomationEvent(automationEvent) || isCancelScheduledValuesAutomationEvent(automationEvent)) {
    return automationEvent.cancelTime;
  }
  if (isExponentialRampToValueAutomationEvent(automationEvent) || isLinearRampToValueAutomationEvent(automationEvent)) {
    return automationEvent.endTime;
  }
  return automationEvent.startTime;
};
const getExponentialRampValueAtTime = (time, startTime, valueAtStartTime, { endTime, value }) => {
  if (valueAtStartTime === value) {
    return value;
  }
  if (0 < valueAtStartTime && 0 < value || valueAtStartTime < 0 && value < 0) {
    return valueAtStartTime * (value / valueAtStartTime) ** ((time - startTime) / (endTime - startTime));
  }
  return 0;
};
const getLinearRampValueAtTime = (time, startTime, valueAtStartTime, { endTime, value }) => {
  return valueAtStartTime + (time - startTime) / (endTime - startTime) * (value - valueAtStartTime);
};
const interpolateValue = (values, theoreticIndex) => {
  const lowerIndex = Math.floor(theoreticIndex);
  const upperIndex = Math.ceil(theoreticIndex);
  if (lowerIndex === upperIndex) {
    return values[lowerIndex];
  }
  return (1 - (theoreticIndex - lowerIndex)) * values[lowerIndex] + (1 - (upperIndex - theoreticIndex)) * values[upperIndex];
};
const getValueCurveValueAtTime = (time, { duration, startTime, values }) => {
  const theoreticIndex = (time - startTime) / duration * (values.length - 1);
  return interpolateValue(values, theoreticIndex);
};
const isSetTargetAutomationEvent = (automationEvent) => {
  return automationEvent.type === "setTarget";
};
class AutomationEventList {
  constructor(defaultValue) {
    this._automationEvents = [];
    this._currenTime = 0;
    this._defaultValue = defaultValue;
  }
  [Symbol.iterator]() {
    return this._automationEvents[Symbol.iterator]();
  }
  add(automationEvent) {
    const eventTime = getEventTime(automationEvent);
    if (isCancelAndHoldAutomationEvent(automationEvent) || isCancelScheduledValuesAutomationEvent(automationEvent)) {
      const index = this._automationEvents.findIndex((currentAutomationEvent) => {
        if (isCancelScheduledValuesAutomationEvent(automationEvent) && isSetValueCurveAutomationEvent(currentAutomationEvent)) {
          return currentAutomationEvent.startTime + currentAutomationEvent.duration >= eventTime;
        }
        return getEventTime(currentAutomationEvent) >= eventTime;
      });
      const removedAutomationEvent = this._automationEvents[index];
      if (index !== -1) {
        this._automationEvents = this._automationEvents.slice(0, index);
      }
      if (isCancelAndHoldAutomationEvent(automationEvent)) {
        const lastAutomationEvent = this._automationEvents[this._automationEvents.length - 1];
        if (removedAutomationEvent !== void 0 && isAnyRampToValueAutomationEvent(removedAutomationEvent)) {
          if (isSetTargetAutomationEvent(lastAutomationEvent)) {
            throw new Error("The internal list is malformed.");
          }
          const startTime = isSetValueCurveAutomationEvent(lastAutomationEvent) ? lastAutomationEvent.startTime + lastAutomationEvent.duration : getEventTime(lastAutomationEvent);
          const startValue = isSetValueCurveAutomationEvent(lastAutomationEvent) ? lastAutomationEvent.values[lastAutomationEvent.values.length - 1] : lastAutomationEvent.value;
          const value = isExponentialRampToValueAutomationEvent(removedAutomationEvent) ? getExponentialRampValueAtTime(eventTime, startTime, startValue, removedAutomationEvent) : getLinearRampValueAtTime(eventTime, startTime, startValue, removedAutomationEvent);
          const truncatedAutomationEvent = isExponentialRampToValueAutomationEvent(removedAutomationEvent) ? createExtendedExponentialRampToValueAutomationEvent(value, eventTime, this._currenTime) : createExtendedLinearRampToValueAutomationEvent(value, eventTime, this._currenTime);
          this._automationEvents.push(truncatedAutomationEvent);
        }
        if (lastAutomationEvent !== void 0 && isSetTargetAutomationEvent(lastAutomationEvent)) {
          this._automationEvents.push(createSetValueAutomationEvent(this.getValue(eventTime), eventTime));
        }
        if (lastAutomationEvent !== void 0 && isSetValueCurveAutomationEvent(lastAutomationEvent) && lastAutomationEvent.startTime + lastAutomationEvent.duration > eventTime) {
          this._automationEvents[this._automationEvents.length - 1] = createSetValueCurveAutomationEvent(new Float32Array([6, 7]), lastAutomationEvent.startTime, eventTime - lastAutomationEvent.startTime);
        }
      }
    } else {
      const index = this._automationEvents.findIndex((currentAutomationEvent) => getEventTime(currentAutomationEvent) > eventTime);
      const previousAutomationEvent = index === -1 ? this._automationEvents[this._automationEvents.length - 1] : this._automationEvents[index - 1];
      if (previousAutomationEvent !== void 0 && isSetValueCurveAutomationEvent(previousAutomationEvent) && getEventTime(previousAutomationEvent) + previousAutomationEvent.duration > eventTime) {
        return false;
      }
      const persistentAutomationEvent = isExponentialRampToValueAutomationEvent(automationEvent) ? createExtendedExponentialRampToValueAutomationEvent(automationEvent.value, automationEvent.endTime, this._currenTime) : isLinearRampToValueAutomationEvent(automationEvent) ? createExtendedLinearRampToValueAutomationEvent(automationEvent.value, eventTime, this._currenTime) : automationEvent;
      if (index === -1) {
        this._automationEvents.push(persistentAutomationEvent);
      } else {
        if (isSetValueCurveAutomationEvent(automationEvent) && eventTime + automationEvent.duration > getEventTime(this._automationEvents[index])) {
          return false;
        }
        this._automationEvents.splice(index, 0, persistentAutomationEvent);
      }
    }
    return true;
  }
  flush(time) {
    const index = this._automationEvents.findIndex((currentAutomationEvent) => getEventTime(currentAutomationEvent) > time);
    if (index > 1) {
      const remainingAutomationEvents = this._automationEvents.slice(index - 1);
      const firstRemainingAutomationEvent = remainingAutomationEvents[0];
      if (isSetTargetAutomationEvent(firstRemainingAutomationEvent)) {
        remainingAutomationEvents.unshift(createSetValueAutomationEvent(getValueOfAutomationEventAtIndexAtTime(this._automationEvents, index - 2, firstRemainingAutomationEvent.startTime, this._defaultValue), firstRemainingAutomationEvent.startTime));
      }
      this._automationEvents = remainingAutomationEvents;
    }
  }
  getValue(time) {
    if (this._automationEvents.length === 0) {
      return this._defaultValue;
    }
    const indexOfNextEvent = this._automationEvents.findIndex((automationEvent) => getEventTime(automationEvent) > time);
    const nextAutomationEvent = this._automationEvents[indexOfNextEvent];
    const indexOfCurrentEvent = (indexOfNextEvent === -1 ? this._automationEvents.length : indexOfNextEvent) - 1;
    const currentAutomationEvent = this._automationEvents[indexOfCurrentEvent];
    if (currentAutomationEvent !== void 0 && isSetTargetAutomationEvent(currentAutomationEvent) && (nextAutomationEvent === void 0 || !isAnyRampToValueAutomationEvent(nextAutomationEvent) || nextAutomationEvent.insertTime > time)) {
      return getTargetValueAtTime(time, getValueOfAutomationEventAtIndexAtTime(this._automationEvents, indexOfCurrentEvent - 1, currentAutomationEvent.startTime, this._defaultValue), currentAutomationEvent);
    }
    if (currentAutomationEvent !== void 0 && isSetValueAutomationEvent(currentAutomationEvent) && (nextAutomationEvent === void 0 || !isAnyRampToValueAutomationEvent(nextAutomationEvent))) {
      return currentAutomationEvent.value;
    }
    if (currentAutomationEvent !== void 0 && isSetValueCurveAutomationEvent(currentAutomationEvent) && (nextAutomationEvent === void 0 || !isAnyRampToValueAutomationEvent(nextAutomationEvent) || currentAutomationEvent.startTime + currentAutomationEvent.duration > time)) {
      if (time < currentAutomationEvent.startTime + currentAutomationEvent.duration) {
        return getValueCurveValueAtTime(time, currentAutomationEvent);
      }
      return currentAutomationEvent.values[currentAutomationEvent.values.length - 1];
    }
    if (currentAutomationEvent !== void 0 && isAnyRampToValueAutomationEvent(currentAutomationEvent) && (nextAutomationEvent === void 0 || !isAnyRampToValueAutomationEvent(nextAutomationEvent))) {
      return currentAutomationEvent.value;
    }
    if (nextAutomationEvent !== void 0 && isExponentialRampToValueAutomationEvent(nextAutomationEvent)) {
      const [startTime, value] = getEndTimeAndValueOfPreviousAutomationEvent(this._automationEvents, indexOfCurrentEvent, currentAutomationEvent, nextAutomationEvent, this._defaultValue);
      return getExponentialRampValueAtTime(time, startTime, value, nextAutomationEvent);
    }
    if (nextAutomationEvent !== void 0 && isLinearRampToValueAutomationEvent(nextAutomationEvent)) {
      const [startTime, value] = getEndTimeAndValueOfPreviousAutomationEvent(this._automationEvents, indexOfCurrentEvent, currentAutomationEvent, nextAutomationEvent, this._defaultValue);
      return getLinearRampValueAtTime(time, startTime, value, nextAutomationEvent);
    }
    return this._defaultValue;
  }
}
const createCancelAndHoldAutomationEvent = (cancelTime) => {
  return { cancelTime, type: "cancelAndHold" };
};
const createCancelScheduledValuesAutomationEvent = (cancelTime) => {
  return { cancelTime, type: "cancelScheduledValues" };
};
const createExponentialRampToValueAutomationEvent = (value, endTime) => {
  return { endTime, type: "exponentialRampToValue", value };
};
const createLinearRampToValueAutomationEvent = (value, endTime) => {
  return { endTime, type: "linearRampToValue", value };
};
const createSetTargetAutomationEvent = (target, startTime, timeConstant) => {
  return { startTime, target, timeConstant, type: "setTarget" };
};
const createAddActiveInputConnectionToAudioNode = (insertElementInSet2) => {
  return (activeInputs, source, [output, input, eventListener], ignoreDuplicates) => {
    insertElementInSet2(activeInputs[input], [source, output, eventListener], (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output, ignoreDuplicates);
  };
};
const createAddAudioNodeConnections = (audioNodeConnectionsStore) => {
  return (audioNode, audioNodeRenderer, nativeAudioNode) => {
    const activeInputs = [];
    for (let i = 0; i < nativeAudioNode.numberOfInputs; i += 1) {
      activeInputs.push(/* @__PURE__ */ new Set());
    }
    audioNodeConnectionsStore.set(audioNode, {
      activeInputs,
      outputs: /* @__PURE__ */ new Set(),
      passiveInputs: /* @__PURE__ */ new WeakMap(),
      renderer: audioNodeRenderer
    });
  };
};
const createAddAudioParamConnections = (audioParamConnectionsStore) => {
  return (audioParam, audioParamRenderer) => {
    audioParamConnectionsStore.set(audioParam, { activeInputs: /* @__PURE__ */ new Set(), passiveInputs: /* @__PURE__ */ new WeakMap(), renderer: audioParamRenderer });
  };
};
const ACTIVE_AUDIO_NODE_STORE = /* @__PURE__ */ new WeakSet();
const AUDIO_NODE_CONNECTIONS_STORE = /* @__PURE__ */ new WeakMap();
const AUDIO_NODE_STORE = /* @__PURE__ */ new WeakMap();
const AUDIO_PARAM_CONNECTIONS_STORE = /* @__PURE__ */ new WeakMap();
const AUDIO_PARAM_STORE = /* @__PURE__ */ new WeakMap();
const CONTEXT_STORE = /* @__PURE__ */ new WeakMap();
const EVENT_LISTENERS = /* @__PURE__ */ new WeakMap();
const CYCLE_COUNTERS = /* @__PURE__ */ new WeakMap();
const getValueForKey = (map, key) => {
  const value = map.get(key);
  if (value === void 0) {
    throw new Error("A value with the given key could not be found.");
  }
  return value;
};
const pickElementFromSet = (set2, predicate) => {
  const matchingElements = Array.from(set2).filter(predicate);
  if (matchingElements.length > 1) {
    throw Error("More than one element was found.");
  }
  if (matchingElements.length === 0) {
    throw Error("No element was found.");
  }
  const [matchingElement] = matchingElements;
  set2.delete(matchingElement);
  return matchingElement;
};
const deletePassiveInputConnectionToAudioNode = (passiveInputs, source, output, input) => {
  const passiveInputConnections = getValueForKey(passiveInputs, source);
  const matchingConnection = pickElementFromSet(passiveInputConnections, (passiveInputConnection) => passiveInputConnection[0] === output && passiveInputConnection[1] === input);
  if (passiveInputConnections.size === 0) {
    passiveInputs.delete(source);
  }
  return matchingConnection;
};
const getEventListenersOfAudioNode = (audioNode) => {
  return getValueForKey(EVENT_LISTENERS, audioNode);
};
const setInternalStateToActive = (audioNode) => {
  if (ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
    throw new Error("The AudioNode is already stored.");
  }
  ACTIVE_AUDIO_NODE_STORE.add(audioNode);
  getEventListenersOfAudioNode(audioNode).forEach((eventListener) => eventListener(true));
};
const isAudioWorkletNode = (audioNode) => {
  return "port" in audioNode;
};
const setInternalStateToPassive = (audioNode) => {
  if (!ACTIVE_AUDIO_NODE_STORE.has(audioNode)) {
    throw new Error("The AudioNode is not stored.");
  }
  ACTIVE_AUDIO_NODE_STORE.delete(audioNode);
  getEventListenersOfAudioNode(audioNode).forEach((eventListener) => eventListener(false));
};
const setInternalStateToPassiveWhenNecessary = (audioNode, activeInputs) => {
  if (!isAudioWorkletNode(audioNode) && activeInputs.every((connections) => connections.size === 0)) {
    setInternalStateToPassive(audioNode);
  }
};
const createAddConnectionToAudioNode = (addActiveInputConnectionToAudioNode2, addPassiveInputConnectionToAudioNode2, connectNativeAudioNodeToNativeAudioNode2, deleteActiveInputConnectionToAudioNode2, disconnectNativeAudioNodeFromNativeAudioNode2, getAudioNodeConnections2, getAudioNodeTailTime2, getEventListenersOfAudioNode2, getNativeAudioNode2, insertElementInSet2, isActiveAudioNode2, isPartOfACycle2, isPassiveAudioNode2) => {
  const tailTimeTimeoutIds = /* @__PURE__ */ new WeakMap();
  return (source, destination, output, input, isOffline) => {
    const { activeInputs, passiveInputs } = getAudioNodeConnections2(destination);
    const { outputs } = getAudioNodeConnections2(source);
    const eventListeners2 = getEventListenersOfAudioNode2(source);
    const eventListener = (isActive) => {
      const nativeDestinationAudioNode = getNativeAudioNode2(destination);
      const nativeSourceAudioNode = getNativeAudioNode2(source);
      if (isActive) {
        const partialConnection = deletePassiveInputConnectionToAudioNode(passiveInputs, source, output, input);
        addActiveInputConnectionToAudioNode2(activeInputs, source, partialConnection, false);
        if (!isOffline && !isPartOfACycle2(source)) {
          connectNativeAudioNodeToNativeAudioNode2(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);
        }
        if (isPassiveAudioNode2(destination)) {
          setInternalStateToActive(destination);
        }
      } else {
        const partialConnection = deleteActiveInputConnectionToAudioNode2(activeInputs, source, output, input);
        addPassiveInputConnectionToAudioNode2(passiveInputs, input, partialConnection, false);
        if (!isOffline && !isPartOfACycle2(source)) {
          disconnectNativeAudioNodeFromNativeAudioNode2(nativeSourceAudioNode, nativeDestinationAudioNode, output, input);
        }
        const tailTime = getAudioNodeTailTime2(destination);
        if (tailTime === 0) {
          if (isActiveAudioNode2(destination)) {
            setInternalStateToPassiveWhenNecessary(destination, activeInputs);
          }
        } else {
          const tailTimeTimeoutId = tailTimeTimeoutIds.get(destination);
          if (tailTimeTimeoutId !== void 0) {
            clearTimeout(tailTimeTimeoutId);
          }
          tailTimeTimeoutIds.set(destination, setTimeout(() => {
            if (isActiveAudioNode2(destination)) {
              setInternalStateToPassiveWhenNecessary(destination, activeInputs);
            }
          }, tailTime * 1e3));
        }
      }
    };
    if (insertElementInSet2(outputs, [destination, output, input], (outputConnection) => outputConnection[0] === destination && outputConnection[1] === output && outputConnection[2] === input, true)) {
      eventListeners2.add(eventListener);
      if (isActiveAudioNode2(source)) {
        addActiveInputConnectionToAudioNode2(activeInputs, source, [output, input, eventListener], true);
      } else {
        addPassiveInputConnectionToAudioNode2(passiveInputs, input, [source, output, eventListener], true);
      }
      return true;
    }
    return false;
  };
};
const createAddPassiveInputConnectionToAudioNode = (insertElementInSet2) => {
  return (passiveInputs, input, [source, output, eventListener], ignoreDuplicates) => {
    const passiveInputConnections = passiveInputs.get(source);
    if (passiveInputConnections === void 0) {
      passiveInputs.set(source, /* @__PURE__ */ new Set([[output, input, eventListener]]));
    } else {
      insertElementInSet2(passiveInputConnections, [output, input, eventListener], (passiveInputConnection) => passiveInputConnection[0] === output && passiveInputConnection[1] === input, ignoreDuplicates);
    }
  };
};
const createAddSilentConnection = (createNativeGainNode2) => {
  return (nativeContext, nativeAudioScheduledSourceNode) => {
    const nativeGainNode = createNativeGainNode2(nativeContext, {
      channelCount: 1,
      channelCountMode: "explicit",
      channelInterpretation: "discrete",
      gain: 0
    });
    nativeAudioScheduledSourceNode.connect(nativeGainNode).connect(nativeContext.destination);
    const disconnect = () => {
      nativeAudioScheduledSourceNode.removeEventListener("ended", disconnect);
      nativeAudioScheduledSourceNode.disconnect(nativeGainNode);
      nativeGainNode.disconnect();
    };
    nativeAudioScheduledSourceNode.addEventListener("ended", disconnect);
  };
};
const isOwnedByContext = (nativeAudioNode, nativeContext) => {
  return nativeAudioNode.context === nativeContext;
};
const testAudioBufferCopyChannelMethodsOutOfBoundsSupport = (nativeAudioBuffer) => {
  try {
    nativeAudioBuffer.copyToChannel(new Float32Array(1), 0, -1);
  } catch (e) {
    return false;
  }
  return true;
};
const createIndexSizeError = () => new DOMException("", "IndexSizeError");
const wrapAudioBufferGetChannelDataMethod = (audioBuffer) => {
  audioBuffer.getChannelData = ((getChannelData) => {
    return (channel2) => {
      try {
        return getChannelData.call(audioBuffer, channel2);
      } catch (err2) {
        if (err2.code === 12) {
          throw createIndexSizeError();
        }
        throw err2;
      }
    };
  })(audioBuffer.getChannelData);
};
const DEFAULT_OPTIONS$5 = {
  numberOfChannels: 1
};
const createAudioBufferConstructor = (audioBufferStore2, cacheTestResult2, createNotSupportedError2, nativeAudioBufferConstructor2, nativeOfflineAudioContextConstructor2, testNativeAudioBufferConstructorSupport, wrapAudioBufferCopyChannelMethods2, wrapAudioBufferCopyChannelMethodsOutOfBounds2) => {
  let nativeOfflineAudioContext = null;
  return class AudioBuffer {
    constructor(options) {
      if (nativeOfflineAudioContextConstructor2 === null) {
        throw new Error("Missing the native OfflineAudioContext constructor.");
      }
      const { length, numberOfChannels, sampleRate } = { ...DEFAULT_OPTIONS$5, ...options };
      if (nativeOfflineAudioContext === null) {
        nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor2(1, 1, 44100);
      }
      const audioBuffer = nativeAudioBufferConstructor2 !== null && cacheTestResult2(testNativeAudioBufferConstructorSupport, testNativeAudioBufferConstructorSupport) ? new nativeAudioBufferConstructor2({ length, numberOfChannels, sampleRate }) : nativeOfflineAudioContext.createBuffer(numberOfChannels, length, sampleRate);
      if (audioBuffer.numberOfChannels === 0) {
        throw createNotSupportedError2();
      }
      if (typeof audioBuffer.copyFromChannel !== "function") {
        wrapAudioBufferCopyChannelMethods2(audioBuffer);
        wrapAudioBufferGetChannelDataMethod(audioBuffer);
      } else if (!cacheTestResult2(testAudioBufferCopyChannelMethodsOutOfBoundsSupport, () => testAudioBufferCopyChannelMethodsOutOfBoundsSupport(audioBuffer))) {
        wrapAudioBufferCopyChannelMethodsOutOfBounds2(audioBuffer);
      }
      audioBufferStore2.add(audioBuffer);
      return audioBuffer;
    }
    static [Symbol.hasInstance](instance2) {
      return instance2 !== null && typeof instance2 === "object" && Object.getPrototypeOf(instance2) === AudioBuffer.prototype || audioBufferStore2.has(instance2);
    }
  };
};
const MOST_NEGATIVE_SINGLE_FLOAT = -34028234663852886e22;
const MOST_POSITIVE_SINGLE_FLOAT = -MOST_NEGATIVE_SINGLE_FLOAT;
const isActiveAudioNode = (audioNode) => ACTIVE_AUDIO_NODE_STORE.has(audioNode);
const DEFAULT_OPTIONS$4 = {
  buffer: null,
  channelCount: 2,
  channelCountMode: "max",
  channelInterpretation: "speakers",
  loop: false,
  loopEnd: 0,
  loopStart: 0,
  playbackRate: 1
};
const createAudioBufferSourceNodeConstructor = (audioNodeConstructor2, createAudioBufferSourceNodeRenderer2, createAudioParam2, createInvalidStateError2, createNativeAudioBufferSourceNode2, getNativeContext2, isNativeOfflineAudioContext2, wrapEventListener2) => {
  return class AudioBufferSourceNode extends audioNodeConstructor2 {
    constructor(context, options) {
      const nativeContext = getNativeContext2(context);
      const mergedOptions = { ...DEFAULT_OPTIONS$4, ...options };
      const nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode2(nativeContext, mergedOptions);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      const audioBufferSourceNodeRenderer = isOffline ? createAudioBufferSourceNodeRenderer2() : null;
      super(context, false, nativeAudioBufferSourceNode, audioBufferSourceNodeRenderer);
      this._audioBufferSourceNodeRenderer = audioBufferSourceNodeRenderer;
      this._isBufferNullified = false;
      this._isBufferSet = mergedOptions.buffer !== null;
      this._nativeAudioBufferSourceNode = nativeAudioBufferSourceNode;
      this._onended = null;
      this._playbackRate = createAudioParam2(this, isOffline, nativeAudioBufferSourceNode.playbackRate, MOST_POSITIVE_SINGLE_FLOAT, MOST_NEGATIVE_SINGLE_FLOAT);
    }
    get buffer() {
      if (this._isBufferNullified) {
        return null;
      }
      return this._nativeAudioBufferSourceNode.buffer;
    }
    set buffer(value) {
      this._nativeAudioBufferSourceNode.buffer = value;
      if (value !== null) {
        if (this._isBufferSet) {
          throw createInvalidStateError2();
        }
        this._isBufferSet = true;
      }
    }
    get loop() {
      return this._nativeAudioBufferSourceNode.loop;
    }
    set loop(value) {
      this._nativeAudioBufferSourceNode.loop = value;
    }
    get loopEnd() {
      return this._nativeAudioBufferSourceNode.loopEnd;
    }
    set loopEnd(value) {
      this._nativeAudioBufferSourceNode.loopEnd = value;
    }
    get loopStart() {
      return this._nativeAudioBufferSourceNode.loopStart;
    }
    set loopStart(value) {
      this._nativeAudioBufferSourceNode.loopStart = value;
    }
    get onended() {
      return this._onended;
    }
    set onended(value) {
      const wrappedListener = typeof value === "function" ? wrapEventListener2(this, value) : null;
      this._nativeAudioBufferSourceNode.onended = wrappedListener;
      const nativeOnEnded = this._nativeAudioBufferSourceNode.onended;
      this._onended = nativeOnEnded !== null && nativeOnEnded === wrappedListener ? value : nativeOnEnded;
    }
    get playbackRate() {
      return this._playbackRate;
    }
    start(when = 0, offset2 = 0, duration) {
      this._nativeAudioBufferSourceNode.start(when, offset2, duration);
      if (this._audioBufferSourceNodeRenderer !== null) {
        this._audioBufferSourceNodeRenderer.start = duration === void 0 ? [when, offset2] : [when, offset2, duration];
      }
      if (this.context.state !== "closed") {
        setInternalStateToActive(this);
        const resetInternalStateToPassive = () => {
          this._nativeAudioBufferSourceNode.removeEventListener("ended", resetInternalStateToPassive);
          if (isActiveAudioNode(this)) {
            setInternalStateToPassive(this);
          }
        };
        this._nativeAudioBufferSourceNode.addEventListener("ended", resetInternalStateToPassive);
      }
    }
    stop(when = 0) {
      this._nativeAudioBufferSourceNode.stop(when);
      if (this._audioBufferSourceNodeRenderer !== null) {
        this._audioBufferSourceNodeRenderer.stop = when;
      }
    }
  };
};
const createAudioBufferSourceNodeRendererFactory = (connectAudioParam2, createNativeAudioBufferSourceNode2, getNativeAudioNode2, renderAutomation2, renderInputsOfAudioNode2) => {
  return () => {
    const renderedNativeAudioBufferSourceNodes = /* @__PURE__ */ new WeakMap();
    let start2 = null;
    let stop = null;
    const createAudioBufferSourceNode = async (proxy, nativeOfflineAudioContext) => {
      let nativeAudioBufferSourceNode = getNativeAudioNode2(proxy);
      const nativeAudioBufferSourceNodeIsOwnedByContext = isOwnedByContext(nativeAudioBufferSourceNode, nativeOfflineAudioContext);
      if (!nativeAudioBufferSourceNodeIsOwnedByContext) {
        const options = {
          buffer: nativeAudioBufferSourceNode.buffer,
          channelCount: nativeAudioBufferSourceNode.channelCount,
          channelCountMode: nativeAudioBufferSourceNode.channelCountMode,
          channelInterpretation: nativeAudioBufferSourceNode.channelInterpretation,
          loop: nativeAudioBufferSourceNode.loop,
          loopEnd: nativeAudioBufferSourceNode.loopEnd,
          loopStart: nativeAudioBufferSourceNode.loopStart,
          playbackRate: nativeAudioBufferSourceNode.playbackRate.value
        };
        nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode2(nativeOfflineAudioContext, options);
        if (start2 !== null) {
          nativeAudioBufferSourceNode.start(...start2);
        }
        if (stop !== null) {
          nativeAudioBufferSourceNode.stop(stop);
        }
      }
      renderedNativeAudioBufferSourceNodes.set(nativeOfflineAudioContext, nativeAudioBufferSourceNode);
      if (!nativeAudioBufferSourceNodeIsOwnedByContext) {
        await renderAutomation2(nativeOfflineAudioContext, proxy.playbackRate, nativeAudioBufferSourceNode.playbackRate);
      } else {
        await connectAudioParam2(nativeOfflineAudioContext, proxy.playbackRate, nativeAudioBufferSourceNode.playbackRate);
      }
      await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeAudioBufferSourceNode);
      return nativeAudioBufferSourceNode;
    };
    return {
      set start(value) {
        start2 = value;
      },
      set stop(value) {
        stop = value;
      },
      render(proxy, nativeOfflineAudioContext) {
        const renderedNativeAudioBufferSourceNode = renderedNativeAudioBufferSourceNodes.get(nativeOfflineAudioContext);
        if (renderedNativeAudioBufferSourceNode !== void 0) {
          return Promise.resolve(renderedNativeAudioBufferSourceNode);
        }
        return createAudioBufferSourceNode(proxy, nativeOfflineAudioContext);
      }
    };
  };
};
const isAudioBufferSourceNode = (audioNode) => {
  return "playbackRate" in audioNode;
};
const isBiquadFilterNode = (audioNode) => {
  return "frequency" in audioNode && "gain" in audioNode;
};
const isConstantSourceNode = (audioNode) => {
  return "offset" in audioNode;
};
const isGainNode = (audioNode) => {
  return !("frequency" in audioNode) && "gain" in audioNode;
};
const isOscillatorNode = (audioNode) => {
  return "detune" in audioNode && "frequency" in audioNode;
};
const isStereoPannerNode = (audioNode) => {
  return "pan" in audioNode;
};
const getAudioNodeConnections = (audioNode) => {
  return getValueForKey(AUDIO_NODE_CONNECTIONS_STORE, audioNode);
};
const getAudioParamConnections = (audioParam) => {
  return getValueForKey(AUDIO_PARAM_CONNECTIONS_STORE, audioParam);
};
const deactivateActiveAudioNodeInputConnections = (audioNode, trace) => {
  const { activeInputs } = getAudioNodeConnections(audioNode);
  activeInputs.forEach((connections) => connections.forEach(([source]) => {
    if (!trace.includes(audioNode)) {
      deactivateActiveAudioNodeInputConnections(source, [...trace, audioNode]);
    }
  }));
  const audioParams = isAudioBufferSourceNode(audioNode) ? [
    audioNode.playbackRate
  ] : isAudioWorkletNode(audioNode) ? Array.from(audioNode.parameters.values()) : isBiquadFilterNode(audioNode) ? [audioNode.Q, audioNode.detune, audioNode.frequency, audioNode.gain] : isConstantSourceNode(audioNode) ? [audioNode.offset] : isGainNode(audioNode) ? [audioNode.gain] : isOscillatorNode(audioNode) ? [audioNode.detune, audioNode.frequency] : isStereoPannerNode(audioNode) ? [audioNode.pan] : [];
  for (const audioParam of audioParams) {
    const audioParamConnections = getAudioParamConnections(audioParam);
    if (audioParamConnections !== void 0) {
      audioParamConnections.activeInputs.forEach(([source]) => deactivateActiveAudioNodeInputConnections(source, trace));
    }
  }
  if (isActiveAudioNode(audioNode)) {
    setInternalStateToPassive(audioNode);
  }
};
const deactivateAudioGraph = (context) => {
  deactivateActiveAudioNodeInputConnections(context.destination, []);
};
const isValidLatencyHint = (latencyHint) => {
  return latencyHint === void 0 || typeof latencyHint === "number" || typeof latencyHint === "string" && (latencyHint === "balanced" || latencyHint === "interactive" || latencyHint === "playback");
};
const createAudioDestinationNodeConstructor = (audioNodeConstructor2, createAudioDestinationNodeRenderer2, createIndexSizeError2, createInvalidStateError2, createNativeAudioDestinationNode, getNativeContext2, isNativeOfflineAudioContext2, renderInputsOfAudioNode2) => {
  return class AudioDestinationNode extends audioNodeConstructor2 {
    constructor(context, channelCount) {
      const nativeContext = getNativeContext2(context);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      const nativeAudioDestinationNode = createNativeAudioDestinationNode(nativeContext, channelCount, isOffline);
      const audioDestinationNodeRenderer = isOffline ? createAudioDestinationNodeRenderer2(renderInputsOfAudioNode2) : null;
      super(context, false, nativeAudioDestinationNode, audioDestinationNodeRenderer);
      this._isNodeOfNativeOfflineAudioContext = isOffline;
      this._nativeAudioDestinationNode = nativeAudioDestinationNode;
    }
    get channelCount() {
      return this._nativeAudioDestinationNode.channelCount;
    }
    set channelCount(value) {
      if (this._isNodeOfNativeOfflineAudioContext) {
        throw createInvalidStateError2();
      }
      if (value > this._nativeAudioDestinationNode.maxChannelCount) {
        throw createIndexSizeError2();
      }
      this._nativeAudioDestinationNode.channelCount = value;
    }
    get channelCountMode() {
      return this._nativeAudioDestinationNode.channelCountMode;
    }
    set channelCountMode(value) {
      if (this._isNodeOfNativeOfflineAudioContext) {
        throw createInvalidStateError2();
      }
      this._nativeAudioDestinationNode.channelCountMode = value;
    }
    get maxChannelCount() {
      return this._nativeAudioDestinationNode.maxChannelCount;
    }
  };
};
const createAudioDestinationNodeRenderer = (renderInputsOfAudioNode2) => {
  const renderedNativeAudioDestinationNodes = /* @__PURE__ */ new WeakMap();
  const createAudioDestinationNode = async (proxy, nativeOfflineAudioContext) => {
    const nativeAudioDestinationNode = nativeOfflineAudioContext.destination;
    renderedNativeAudioDestinationNodes.set(nativeOfflineAudioContext, nativeAudioDestinationNode);
    await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeAudioDestinationNode);
    return nativeAudioDestinationNode;
  };
  return {
    render(proxy, nativeOfflineAudioContext) {
      const renderedNativeAudioDestinationNode = renderedNativeAudioDestinationNodes.get(nativeOfflineAudioContext);
      if (renderedNativeAudioDestinationNode !== void 0) {
        return Promise.resolve(renderedNativeAudioDestinationNode);
      }
      return createAudioDestinationNode(proxy, nativeOfflineAudioContext);
    }
  };
};
const createAudioListenerFactory = (createAudioParam2, createNativeChannelMergerNode2, createNativeConstantSourceNode2, createNativeScriptProcessorNode2, createNotSupportedError2, getFirstSample2, isNativeOfflineAudioContext2, overwriteAccessors2) => {
  return (context, nativeContext) => {
    const nativeListener = nativeContext.listener;
    const createFakeAudioParams = () => {
      const buffer = new Float32Array(1);
      const channelMergerNode = createNativeChannelMergerNode2(nativeContext, {
        channelCount: 1,
        channelCountMode: "explicit",
        channelInterpretation: "speakers",
        numberOfInputs: 9
      });
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      let isScriptProcessorNodeCreated = false;
      let lastOrientation = [0, 0, -1, 0, 1, 0];
      let lastPosition = [0, 0, 0];
      const createScriptProcessorNode = () => {
        if (isScriptProcessorNodeCreated) {
          return;
        }
        isScriptProcessorNodeCreated = true;
        const scriptProcessorNode = createNativeScriptProcessorNode2(nativeContext, 256, 9, 0);
        scriptProcessorNode.onaudioprocess = ({ inputBuffer }) => {
          const orientation = [
            getFirstSample2(inputBuffer, buffer, 0),
            getFirstSample2(inputBuffer, buffer, 1),
            getFirstSample2(inputBuffer, buffer, 2),
            getFirstSample2(inputBuffer, buffer, 3),
            getFirstSample2(inputBuffer, buffer, 4),
            getFirstSample2(inputBuffer, buffer, 5)
          ];
          if (orientation.some((value, index) => value !== lastOrientation[index])) {
            nativeListener.setOrientation(...orientation);
            lastOrientation = orientation;
          }
          const positon = [
            getFirstSample2(inputBuffer, buffer, 6),
            getFirstSample2(inputBuffer, buffer, 7),
            getFirstSample2(inputBuffer, buffer, 8)
          ];
          if (positon.some((value, index) => value !== lastPosition[index])) {
            nativeListener.setPosition(...positon);
            lastPosition = positon;
          }
        };
        channelMergerNode.connect(scriptProcessorNode);
      };
      const createSetOrientation = (index) => (value) => {
        if (value !== lastOrientation[index]) {
          lastOrientation[index] = value;
          nativeListener.setOrientation(...lastOrientation);
        }
      };
      const createSetPosition = (index) => (value) => {
        if (value !== lastPosition[index]) {
          lastPosition[index] = value;
          nativeListener.setPosition(...lastPosition);
        }
      };
      const createFakeAudioParam = (input, initialValue, setValue) => {
        const constantSourceNode = createNativeConstantSourceNode2(nativeContext, {
          channelCount: 1,
          channelCountMode: "explicit",
          channelInterpretation: "discrete",
          offset: initialValue
        });
        constantSourceNode.connect(channelMergerNode, 0, input);
        constantSourceNode.start();
        Object.defineProperty(constantSourceNode.offset, "defaultValue", {
          get() {
            return initialValue;
          }
        });
        const audioParam = createAudioParam2({ context }, isOffline, constantSourceNode.offset, MOST_POSITIVE_SINGLE_FLOAT, MOST_NEGATIVE_SINGLE_FLOAT);
        overwriteAccessors2(audioParam, "value", (get2) => () => get2.call(audioParam), (set2) => (value) => {
          try {
            set2.call(audioParam, value);
          } catch (err2) {
            if (err2.code !== 9) {
              throw err2;
            }
          }
          createScriptProcessorNode();
          if (isOffline) {
            setValue(value);
          }
        });
        audioParam.cancelAndHoldAtTime = ((cancelAndHoldAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = cancelAndHoldAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.cancelAndHoldAtTime);
        audioParam.cancelScheduledValues = ((cancelScheduledValues) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = cancelScheduledValues.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.cancelScheduledValues);
        audioParam.exponentialRampToValueAtTime = ((exponentialRampToValueAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = exponentialRampToValueAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.exponentialRampToValueAtTime);
        audioParam.linearRampToValueAtTime = ((linearRampToValueAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = linearRampToValueAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.linearRampToValueAtTime);
        audioParam.setTargetAtTime = ((setTargetAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = setTargetAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.setTargetAtTime);
        audioParam.setValueAtTime = ((setValueAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = setValueAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.setValueAtTime);
        audioParam.setValueCurveAtTime = ((setValueCurveAtTime) => {
          if (isOffline) {
            return () => {
              throw createNotSupportedError2();
            };
          }
          return (...args) => {
            const value = setValueCurveAtTime.apply(audioParam, args);
            createScriptProcessorNode();
            return value;
          };
        })(audioParam.setValueCurveAtTime);
        return audioParam;
      };
      return {
        forwardX: createFakeAudioParam(0, 0, createSetOrientation(0)),
        forwardY: createFakeAudioParam(1, 0, createSetOrientation(1)),
        forwardZ: createFakeAudioParam(2, -1, createSetOrientation(2)),
        positionX: createFakeAudioParam(6, 0, createSetPosition(0)),
        positionY: createFakeAudioParam(7, 0, createSetPosition(1)),
        positionZ: createFakeAudioParam(8, 0, createSetPosition(2)),
        upX: createFakeAudioParam(3, 0, createSetOrientation(3)),
        upY: createFakeAudioParam(4, 1, createSetOrientation(4)),
        upZ: createFakeAudioParam(5, 0, createSetOrientation(5))
      };
    };
    const { forwardX, forwardY, forwardZ, positionX, positionY, positionZ, upX, upY, upZ } = nativeListener.forwardX === void 0 ? createFakeAudioParams() : nativeListener;
    return {
      get forwardX() {
        return forwardX;
      },
      get forwardY() {
        return forwardY;
      },
      get forwardZ() {
        return forwardZ;
      },
      get positionX() {
        return positionX;
      },
      get positionY() {
        return positionY;
      },
      get positionZ() {
        return positionZ;
      },
      get upX() {
        return upX;
      },
      get upY() {
        return upY;
      },
      get upZ() {
        return upZ;
      }
    };
  };
};
const isAudioNode = (audioNodeOrAudioParam) => {
  return "context" in audioNodeOrAudioParam;
};
const isAudioNodeOutputConnection = (outputConnection) => {
  return isAudioNode(outputConnection[0]);
};
const insertElementInSet = (set2, element2, predicate, ignoreDuplicates) => {
  for (const lmnt of set2) {
    if (predicate(lmnt)) {
      if (ignoreDuplicates) {
        return false;
      }
      throw Error("The set contains at least one similar element.");
    }
  }
  set2.add(element2);
  return true;
};
const addActiveInputConnectionToAudioParam = (activeInputs, source, [output, eventListener], ignoreDuplicates) => {
  insertElementInSet(activeInputs, [source, output, eventListener], (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output, ignoreDuplicates);
};
const addPassiveInputConnectionToAudioParam = (passiveInputs, [source, output, eventListener], ignoreDuplicates) => {
  const passiveInputConnections = passiveInputs.get(source);
  if (passiveInputConnections === void 0) {
    passiveInputs.set(source, /* @__PURE__ */ new Set([[output, eventListener]]));
  } else {
    insertElementInSet(passiveInputConnections, [output, eventListener], (passiveInputConnection) => passiveInputConnection[0] === output, ignoreDuplicates);
  }
};
const isNativeAudioNodeFaker = (nativeAudioNodeOrNativeAudioNodeFaker) => {
  return "inputs" in nativeAudioNodeOrNativeAudioNodeFaker;
};
const connectNativeAudioNodeToNativeAudioNode = (nativeSourceAudioNode, nativeDestinationAudioNode, output, input) => {
  if (isNativeAudioNodeFaker(nativeDestinationAudioNode)) {
    const fakeNativeDestinationAudioNode = nativeDestinationAudioNode.inputs[input];
    nativeSourceAudioNode.connect(fakeNativeDestinationAudioNode, output, 0);
    return [fakeNativeDestinationAudioNode, output, 0];
  }
  nativeSourceAudioNode.connect(nativeDestinationAudioNode, output, input);
  return [nativeDestinationAudioNode, output, input];
};
const deleteActiveInputConnection = (activeInputConnections, source, output) => {
  for (const activeInputConnection of activeInputConnections) {
    if (activeInputConnection[0] === source && activeInputConnection[1] === output) {
      activeInputConnections.delete(activeInputConnection);
      return activeInputConnection;
    }
  }
  return null;
};
const deleteActiveInputConnectionToAudioParam = (activeInputs, source, output) => {
  return pickElementFromSet(activeInputs, (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output);
};
const deleteEventListenerOfAudioNode = (audioNode, eventListener) => {
  const eventListeners2 = getEventListenersOfAudioNode(audioNode);
  if (!eventListeners2.delete(eventListener)) {
    throw new Error("Missing the expected event listener.");
  }
};
const deletePassiveInputConnectionToAudioParam = (passiveInputs, source, output) => {
  const passiveInputConnections = getValueForKey(passiveInputs, source);
  const matchingConnection = pickElementFromSet(passiveInputConnections, (passiveInputConnection) => passiveInputConnection[0] === output);
  if (passiveInputConnections.size === 0) {
    passiveInputs.delete(source);
  }
  return matchingConnection;
};
const disconnectNativeAudioNodeFromNativeAudioNode = (nativeSourceAudioNode, nativeDestinationAudioNode, output, input) => {
  if (isNativeAudioNodeFaker(nativeDestinationAudioNode)) {
    nativeSourceAudioNode.disconnect(nativeDestinationAudioNode.inputs[input], output, 0);
  } else {
    nativeSourceAudioNode.disconnect(nativeDestinationAudioNode, output, input);
  }
};
const getNativeAudioNode = (audioNode) => {
  return getValueForKey(AUDIO_NODE_STORE, audioNode);
};
const getNativeAudioParam = (audioParam) => {
  return getValueForKey(AUDIO_PARAM_STORE, audioParam);
};
const isPartOfACycle = (audioNode) => {
  return CYCLE_COUNTERS.has(audioNode);
};
const isPassiveAudioNode = (audioNode) => {
  return !ACTIVE_AUDIO_NODE_STORE.has(audioNode);
};
const testAudioNodeDisconnectMethodSupport = (nativeAudioContext, nativeAudioWorkletNodeConstructor2) => {
  return new Promise((resolve) => {
    if (nativeAudioWorkletNodeConstructor2 !== null) {
      resolve(true);
    } else {
      const analyzer = nativeAudioContext.createScriptProcessor(256, 1, 1);
      const dummy = nativeAudioContext.createGain();
      const ones = nativeAudioContext.createBuffer(1, 2, 44100);
      const channelData = ones.getChannelData(0);
      channelData[0] = 1;
      channelData[1] = 1;
      const source = nativeAudioContext.createBufferSource();
      source.buffer = ones;
      source.loop = true;
      source.connect(analyzer).connect(nativeAudioContext.destination);
      source.connect(dummy);
      source.disconnect(dummy);
      analyzer.onaudioprocess = (event) => {
        const chnnlDt = event.inputBuffer.getChannelData(0);
        if (Array.prototype.some.call(chnnlDt, (sample) => sample === 1)) {
          resolve(true);
        } else {
          resolve(false);
        }
        source.stop();
        analyzer.onaudioprocess = null;
        source.disconnect(analyzer);
        analyzer.disconnect(nativeAudioContext.destination);
      };
      source.start();
    }
  });
};
const visitEachAudioNodeOnce = (cycles, visitor) => {
  const counts = /* @__PURE__ */ new Map();
  for (const cycle of cycles) {
    for (const audioNode of cycle) {
      const count = counts.get(audioNode);
      counts.set(audioNode, count === void 0 ? 1 : count + 1);
    }
  }
  counts.forEach((count, audioNode) => visitor(audioNode, count));
};
const isNativeAudioNode$1 = (nativeAudioNodeOrAudioParam) => {
  return "context" in nativeAudioNodeOrAudioParam;
};
const wrapAudioNodeDisconnectMethod = (nativeAudioNode) => {
  const connections = /* @__PURE__ */ new Map();
  nativeAudioNode.connect = ((connect) => {
    return (destination, output = 0, input = 0) => {
      const returnValue = isNativeAudioNode$1(destination) ? connect(destination, output, input) : connect(destination, output);
      const connectionsToDestination = connections.get(destination);
      if (connectionsToDestination === void 0) {
        connections.set(destination, [{ input, output }]);
      } else {
        if (connectionsToDestination.every((connection) => connection.input !== input || connection.output !== output)) {
          connectionsToDestination.push({ input, output });
        }
      }
      return returnValue;
    };
  })(nativeAudioNode.connect.bind(nativeAudioNode));
  nativeAudioNode.disconnect = ((disconnect) => {
    return (destinationOrOutput, output, input) => {
      disconnect.apply(nativeAudioNode);
      if (destinationOrOutput === void 0) {
        connections.clear();
      } else if (typeof destinationOrOutput === "number") {
        for (const [destination, connectionsToDestination] of connections) {
          const filteredConnections = connectionsToDestination.filter((connection) => connection.output !== destinationOrOutput);
          if (filteredConnections.length === 0) {
            connections.delete(destination);
          } else {
            connections.set(destination, filteredConnections);
          }
        }
      } else if (connections.has(destinationOrOutput)) {
        if (output === void 0) {
          connections.delete(destinationOrOutput);
        } else {
          const connectionsToDestination = connections.get(destinationOrOutput);
          if (connectionsToDestination !== void 0) {
            const filteredConnections = connectionsToDestination.filter((connection) => connection.output !== output && (connection.input !== input || input === void 0));
            if (filteredConnections.length === 0) {
              connections.delete(destinationOrOutput);
            } else {
              connections.set(destinationOrOutput, filteredConnections);
            }
          }
        }
      }
      for (const [destination, connectionsToDestination] of connections) {
        connectionsToDestination.forEach((connection) => {
          if (isNativeAudioNode$1(destination)) {
            nativeAudioNode.connect(destination, connection.output, connection.input);
          } else {
            nativeAudioNode.connect(destination, connection.output);
          }
        });
      }
    };
  })(nativeAudioNode.disconnect);
};
const addConnectionToAudioParamOfAudioContext = (source, destination, output, isOffline) => {
  const { activeInputs, passiveInputs } = getAudioParamConnections(destination);
  const { outputs } = getAudioNodeConnections(source);
  const eventListeners2 = getEventListenersOfAudioNode(source);
  const eventListener = (isActive) => {
    const nativeAudioNode = getNativeAudioNode(source);
    const nativeAudioParam = getNativeAudioParam(destination);
    if (isActive) {
      const partialConnection = deletePassiveInputConnectionToAudioParam(passiveInputs, source, output);
      addActiveInputConnectionToAudioParam(activeInputs, source, partialConnection, false);
      if (!isOffline && !isPartOfACycle(source)) {
        nativeAudioNode.connect(nativeAudioParam, output);
      }
    } else {
      const partialConnection = deleteActiveInputConnectionToAudioParam(activeInputs, source, output);
      addPassiveInputConnectionToAudioParam(passiveInputs, partialConnection, false);
      if (!isOffline && !isPartOfACycle(source)) {
        nativeAudioNode.disconnect(nativeAudioParam, output);
      }
    }
  };
  if (insertElementInSet(outputs, [destination, output], (outputConnection) => outputConnection[0] === destination && outputConnection[1] === output, true)) {
    eventListeners2.add(eventListener);
    if (isActiveAudioNode(source)) {
      addActiveInputConnectionToAudioParam(activeInputs, source, [output, eventListener], true);
    } else {
      addPassiveInputConnectionToAudioParam(passiveInputs, [source, output, eventListener], true);
    }
    return true;
  }
  return false;
};
const deleteInputConnectionOfAudioNode = (source, destination, output, input) => {
  const { activeInputs, passiveInputs } = getAudioNodeConnections(destination);
  const activeInputConnection = deleteActiveInputConnection(activeInputs[input], source, output);
  if (activeInputConnection === null) {
    const passiveInputConnection = deletePassiveInputConnectionToAudioNode(passiveInputs, source, output, input);
    return [passiveInputConnection[2], false];
  }
  return [activeInputConnection[2], true];
};
const deleteInputConnectionOfAudioParam = (source, destination, output) => {
  const { activeInputs, passiveInputs } = getAudioParamConnections(destination);
  const activeInputConnection = deleteActiveInputConnection(activeInputs, source, output);
  if (activeInputConnection === null) {
    const passiveInputConnection = deletePassiveInputConnectionToAudioParam(passiveInputs, source, output);
    return [passiveInputConnection[1], false];
  }
  return [activeInputConnection[2], true];
};
const deleteInputsOfAudioNode = (source, isOffline, destination, output, input) => {
  const [listener2, isActive] = deleteInputConnectionOfAudioNode(source, destination, output, input);
  if (listener2 !== null) {
    deleteEventListenerOfAudioNode(source, listener2);
    if (isActive && !isOffline && !isPartOfACycle(source)) {
      disconnectNativeAudioNodeFromNativeAudioNode(getNativeAudioNode(source), getNativeAudioNode(destination), output, input);
    }
  }
  if (isActiveAudioNode(destination)) {
    const { activeInputs } = getAudioNodeConnections(destination);
    setInternalStateToPassiveWhenNecessary(destination, activeInputs);
  }
};
const deleteInputsOfAudioParam = (source, isOffline, destination, output) => {
  const [listener2, isActive] = deleteInputConnectionOfAudioParam(source, destination, output);
  if (listener2 !== null) {
    deleteEventListenerOfAudioNode(source, listener2);
    if (isActive && !isOffline && !isPartOfACycle(source)) {
      getNativeAudioNode(source).disconnect(getNativeAudioParam(destination), output);
    }
  }
};
const deleteAnyConnection = (source, isOffline) => {
  const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
  const destinations = [];
  for (const outputConnection of audioNodeConnectionsOfSource.outputs) {
    if (isAudioNodeOutputConnection(outputConnection)) {
      deleteInputsOfAudioNode(source, isOffline, ...outputConnection);
    } else {
      deleteInputsOfAudioParam(source, isOffline, ...outputConnection);
    }
    destinations.push(outputConnection[0]);
  }
  audioNodeConnectionsOfSource.outputs.clear();
  return destinations;
};
const deleteConnectionAtOutput = (source, isOffline, output) => {
  const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
  const destinations = [];
  for (const outputConnection of audioNodeConnectionsOfSource.outputs) {
    if (outputConnection[1] === output) {
      if (isAudioNodeOutputConnection(outputConnection)) {
        deleteInputsOfAudioNode(source, isOffline, ...outputConnection);
      } else {
        deleteInputsOfAudioParam(source, isOffline, ...outputConnection);
      }
      destinations.push(outputConnection[0]);
      audioNodeConnectionsOfSource.outputs.delete(outputConnection);
    }
  }
  return destinations;
};
const deleteConnectionToDestination = (source, isOffline, destination, output, input) => {
  const audioNodeConnectionsOfSource = getAudioNodeConnections(source);
  return Array.from(audioNodeConnectionsOfSource.outputs).filter((outputConnection) => outputConnection[0] === destination && (output === void 0 || outputConnection[1] === output) && (input === void 0 || outputConnection[2] === input)).map((outputConnection) => {
    if (isAudioNodeOutputConnection(outputConnection)) {
      deleteInputsOfAudioNode(source, isOffline, ...outputConnection);
    } else {
      deleteInputsOfAudioParam(source, isOffline, ...outputConnection);
    }
    audioNodeConnectionsOfSource.outputs.delete(outputConnection);
    return outputConnection[0];
  });
};
const createAudioNodeConstructor = (addAudioNodeConnections, addConnectionToAudioNode, cacheTestResult2, createIncrementCycleCounter, createIndexSizeError2, createInvalidAccessError2, createNotSupportedError2, decrementCycleCounter, detectCycles, eventTargetConstructor2, getNativeContext2, isNativeAudioContext2, isNativeAudioNode2, isNativeAudioParam2, isNativeOfflineAudioContext2, nativeAudioWorkletNodeConstructor2) => {
  return class AudioNode extends eventTargetConstructor2 {
    constructor(context, isActive, nativeAudioNode, audioNodeRenderer) {
      super(nativeAudioNode);
      this._context = context;
      this._nativeAudioNode = nativeAudioNode;
      const nativeContext = getNativeContext2(context);
      if (isNativeAudioContext2(nativeContext) && true !== cacheTestResult2(testAudioNodeDisconnectMethodSupport, () => {
        return testAudioNodeDisconnectMethodSupport(nativeContext, nativeAudioWorkletNodeConstructor2);
      })) {
        wrapAudioNodeDisconnectMethod(nativeAudioNode);
      }
      AUDIO_NODE_STORE.set(this, nativeAudioNode);
      EVENT_LISTENERS.set(this, /* @__PURE__ */ new Set());
      if (context.state !== "closed" && isActive) {
        setInternalStateToActive(this);
      }
      addAudioNodeConnections(this, audioNodeRenderer, nativeAudioNode);
    }
    get channelCount() {
      return this._nativeAudioNode.channelCount;
    }
    set channelCount(value) {
      this._nativeAudioNode.channelCount = value;
    }
    get channelCountMode() {
      return this._nativeAudioNode.channelCountMode;
    }
    set channelCountMode(value) {
      this._nativeAudioNode.channelCountMode = value;
    }
    get channelInterpretation() {
      return this._nativeAudioNode.channelInterpretation;
    }
    set channelInterpretation(value) {
      this._nativeAudioNode.channelInterpretation = value;
    }
    get context() {
      return this._context;
    }
    get numberOfInputs() {
      return this._nativeAudioNode.numberOfInputs;
    }
    get numberOfOutputs() {
      return this._nativeAudioNode.numberOfOutputs;
    }
    connect(destination, output = 0, input = 0) {
      if (output < 0 || output >= this._nativeAudioNode.numberOfOutputs) {
        throw createIndexSizeError2();
      }
      const nativeContext = getNativeContext2(this._context);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      if (isNativeAudioNode2(destination) || isNativeAudioParam2(destination)) {
        throw createInvalidAccessError2();
      }
      if (isAudioNode(destination)) {
        const nativeDestinationAudioNode = getNativeAudioNode(destination);
        try {
          const connection = connectNativeAudioNodeToNativeAudioNode(this._nativeAudioNode, nativeDestinationAudioNode, output, input);
          const isPassive = isPassiveAudioNode(this);
          if (isOffline || isPassive) {
            this._nativeAudioNode.disconnect(...connection);
          }
          if (this.context.state !== "closed" && !isPassive && isPassiveAudioNode(destination)) {
            setInternalStateToActive(destination);
          }
        } catch (err2) {
          if (err2.code === 12) {
            throw createInvalidAccessError2();
          }
          throw err2;
        }
        const isNewConnectionToAudioNode = addConnectionToAudioNode(this, destination, output, input, isOffline);
        if (isNewConnectionToAudioNode) {
          const cycles = detectCycles([this], destination);
          visitEachAudioNodeOnce(cycles, createIncrementCycleCounter(isOffline));
        }
        return destination;
      }
      const nativeAudioParam = getNativeAudioParam(destination);
      if (nativeAudioParam.name === "playbackRate" && nativeAudioParam.maxValue === 1024) {
        throw createNotSupportedError2();
      }
      try {
        this._nativeAudioNode.connect(nativeAudioParam, output);
        if (isOffline || isPassiveAudioNode(this)) {
          this._nativeAudioNode.disconnect(nativeAudioParam, output);
        }
      } catch (err2) {
        if (err2.code === 12) {
          throw createInvalidAccessError2();
        }
        throw err2;
      }
      const isNewConnectionToAudioParam = addConnectionToAudioParamOfAudioContext(this, destination, output, isOffline);
      if (isNewConnectionToAudioParam) {
        const cycles = detectCycles([this], destination);
        visitEachAudioNodeOnce(cycles, createIncrementCycleCounter(isOffline));
      }
    }
    disconnect(destinationOrOutput, output, input) {
      let destinations;
      const nativeContext = getNativeContext2(this._context);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      if (destinationOrOutput === void 0) {
        destinations = deleteAnyConnection(this, isOffline);
      } else if (typeof destinationOrOutput === "number") {
        if (destinationOrOutput < 0 || destinationOrOutput >= this.numberOfOutputs) {
          throw createIndexSizeError2();
        }
        destinations = deleteConnectionAtOutput(this, isOffline, destinationOrOutput);
      } else {
        if (output !== void 0 && (output < 0 || output >= this.numberOfOutputs)) {
          throw createIndexSizeError2();
        }
        if (isAudioNode(destinationOrOutput) && input !== void 0 && (input < 0 || input >= destinationOrOutput.numberOfInputs)) {
          throw createIndexSizeError2();
        }
        destinations = deleteConnectionToDestination(this, isOffline, destinationOrOutput, output, input);
        if (destinations.length === 0) {
          throw createInvalidAccessError2();
        }
      }
      for (const destination of destinations) {
        const cycles = detectCycles([this], destination);
        visitEachAudioNodeOnce(cycles, decrementCycleCounter);
      }
    }
  };
};
const createAudioParamFactory = (addAudioParamConnections, audioParamAudioNodeStore2, audioParamStore, createAudioParamRenderer2, createCancelAndHoldAutomationEvent2, createCancelScheduledValuesAutomationEvent2, createExponentialRampToValueAutomationEvent2, createLinearRampToValueAutomationEvent2, createSetTargetAutomationEvent2, createSetValueAutomationEvent2, createSetValueCurveAutomationEvent2, nativeAudioContextConstructor2, setValueAtTimeUntilPossible2) => {
  return (audioNode, isAudioParamOfOfflineAudioContext, nativeAudioParam, maxValue = null, minValue = null) => {
    const automationEventList = new AutomationEventList(nativeAudioParam.defaultValue);
    const audioParamRenderer = isAudioParamOfOfflineAudioContext ? createAudioParamRenderer2(automationEventList) : null;
    const audioParam = {
      get defaultValue() {
        return nativeAudioParam.defaultValue;
      },
      get maxValue() {
        return maxValue === null ? nativeAudioParam.maxValue : maxValue;
      },
      get minValue() {
        return minValue === null ? nativeAudioParam.minValue : minValue;
      },
      get value() {
        return nativeAudioParam.value;
      },
      set value(value) {
        nativeAudioParam.value = value;
        audioParam.setValueAtTime(value, audioNode.context.currentTime);
      },
      cancelAndHoldAtTime(cancelTime) {
        if (typeof nativeAudioParam.cancelAndHoldAtTime === "function") {
          if (audioParamRenderer === null) {
            automationEventList.flush(audioNode.context.currentTime);
          }
          automationEventList.add(createCancelAndHoldAutomationEvent2(cancelTime));
          nativeAudioParam.cancelAndHoldAtTime(cancelTime);
        } else {
          const previousLastEvent = Array.from(automationEventList).pop();
          if (audioParamRenderer === null) {
            automationEventList.flush(audioNode.context.currentTime);
          }
          automationEventList.add(createCancelAndHoldAutomationEvent2(cancelTime));
          const currentLastEvent = Array.from(automationEventList).pop();
          nativeAudioParam.cancelScheduledValues(cancelTime);
          if (previousLastEvent !== currentLastEvent && currentLastEvent !== void 0) {
            if (currentLastEvent.type === "exponentialRampToValue") {
              nativeAudioParam.exponentialRampToValueAtTime(currentLastEvent.value, currentLastEvent.endTime);
            } else if (currentLastEvent.type === "linearRampToValue") {
              nativeAudioParam.linearRampToValueAtTime(currentLastEvent.value, currentLastEvent.endTime);
            } else if (currentLastEvent.type === "setValue") {
              nativeAudioParam.setValueAtTime(currentLastEvent.value, currentLastEvent.startTime);
            } else if (currentLastEvent.type === "setValueCurve") {
              nativeAudioParam.setValueCurveAtTime(currentLastEvent.values, currentLastEvent.startTime, currentLastEvent.duration);
            }
          }
        }
        return audioParam;
      },
      cancelScheduledValues(cancelTime) {
        if (audioParamRenderer === null) {
          automationEventList.flush(audioNode.context.currentTime);
        }
        automationEventList.add(createCancelScheduledValuesAutomationEvent2(cancelTime));
        nativeAudioParam.cancelScheduledValues(cancelTime);
        return audioParam;
      },
      exponentialRampToValueAtTime(value, endTime) {
        if (value === 0) {
          throw new RangeError();
        }
        if (!Number.isFinite(endTime) || endTime < 0) {
          throw new RangeError();
        }
        if (audioParamRenderer === null) {
          automationEventList.flush(audioNode.context.currentTime);
        }
        automationEventList.add(createExponentialRampToValueAutomationEvent2(value, endTime));
        nativeAudioParam.exponentialRampToValueAtTime(value, endTime);
        return audioParam;
      },
      linearRampToValueAtTime(value, endTime) {
        if (audioParamRenderer === null) {
          automationEventList.flush(audioNode.context.currentTime);
        }
        automationEventList.add(createLinearRampToValueAutomationEvent2(value, endTime));
        nativeAudioParam.linearRampToValueAtTime(value, endTime);
        return audioParam;
      },
      setTargetAtTime(target, startTime, timeConstant) {
        if (audioParamRenderer === null) {
          automationEventList.flush(audioNode.context.currentTime);
        }
        automationEventList.add(createSetTargetAutomationEvent2(target, startTime, timeConstant));
        nativeAudioParam.setTargetAtTime(target, startTime, timeConstant);
        return audioParam;
      },
      setValueAtTime(value, startTime) {
        if (audioParamRenderer === null) {
          automationEventList.flush(audioNode.context.currentTime);
        }
        automationEventList.add(createSetValueAutomationEvent2(value, startTime));
        nativeAudioParam.setValueAtTime(value, startTime);
        return audioParam;
      },
      setValueCurveAtTime(values, startTime, duration) {
        const convertedValues = values instanceof Float32Array ? values : new Float32Array(values);
        if (nativeAudioContextConstructor2 !== null && nativeAudioContextConstructor2.name === "webkitAudioContext") {
          const endTime = startTime + duration;
          const sampleRate = audioNode.context.sampleRate;
          const firstSample = Math.ceil(startTime * sampleRate);
          const lastSample = Math.floor(endTime * sampleRate);
          const numberOfInterpolatedValues = lastSample - firstSample;
          const interpolatedValues = new Float32Array(numberOfInterpolatedValues);
          for (let i = 0; i < numberOfInterpolatedValues; i += 1) {
            const theoreticIndex = (convertedValues.length - 1) / duration * ((firstSample + i) / sampleRate - startTime);
            const lowerIndex = Math.floor(theoreticIndex);
            const upperIndex = Math.ceil(theoreticIndex);
            interpolatedValues[i] = lowerIndex === upperIndex ? convertedValues[lowerIndex] : (1 - (theoreticIndex - lowerIndex)) * convertedValues[lowerIndex] + (1 - (upperIndex - theoreticIndex)) * convertedValues[upperIndex];
          }
          if (audioParamRenderer === null) {
            automationEventList.flush(audioNode.context.currentTime);
          }
          automationEventList.add(createSetValueCurveAutomationEvent2(interpolatedValues, startTime, duration));
          nativeAudioParam.setValueCurveAtTime(interpolatedValues, startTime, duration);
          const timeOfLastSample = lastSample / sampleRate;
          if (timeOfLastSample < endTime) {
            setValueAtTimeUntilPossible2(audioParam, interpolatedValues[interpolatedValues.length - 1], timeOfLastSample);
          }
          setValueAtTimeUntilPossible2(audioParam, convertedValues[convertedValues.length - 1], endTime);
        } else {
          if (audioParamRenderer === null) {
            automationEventList.flush(audioNode.context.currentTime);
          }
          automationEventList.add(createSetValueCurveAutomationEvent2(convertedValues, startTime, duration));
          nativeAudioParam.setValueCurveAtTime(convertedValues, startTime, duration);
        }
        return audioParam;
      }
    };
    audioParamStore.set(audioParam, nativeAudioParam);
    audioParamAudioNodeStore2.set(audioParam, audioNode);
    addAudioParamConnections(audioParam, audioParamRenderer);
    return audioParam;
  };
};
const createAudioParamRenderer = (automationEventList) => {
  return {
    replay(audioParam) {
      for (const automationEvent of automationEventList) {
        if (automationEvent.type === "exponentialRampToValue") {
          const { endTime, value } = automationEvent;
          audioParam.exponentialRampToValueAtTime(value, endTime);
        } else if (automationEvent.type === "linearRampToValue") {
          const { endTime, value } = automationEvent;
          audioParam.linearRampToValueAtTime(value, endTime);
        } else if (automationEvent.type === "setTarget") {
          const { startTime, target, timeConstant } = automationEvent;
          audioParam.setTargetAtTime(target, startTime, timeConstant);
        } else if (automationEvent.type === "setValue") {
          const { startTime, value } = automationEvent;
          audioParam.setValueAtTime(value, startTime);
        } else if (automationEvent.type === "setValueCurve") {
          const { duration, startTime, values } = automationEvent;
          audioParam.setValueCurveAtTime(values, startTime, duration);
        } else {
          throw new Error("Can't apply an unknown automation.");
        }
      }
    }
  };
};
const createCacheTestResult = (ongoingTests, testResults) => {
  return (tester, test) => {
    const cachedTestResult = testResults.get(tester);
    if (cachedTestResult !== void 0) {
      return cachedTestResult;
    }
    const ongoingTest = ongoingTests.get(tester);
    if (ongoingTest !== void 0) {
      return ongoingTest;
    }
    try {
      const synchronousTestResult = test();
      if (synchronousTestResult instanceof Promise) {
        ongoingTests.set(tester, synchronousTestResult);
        return synchronousTestResult.catch(() => false).then((finalTestResult) => {
          ongoingTests.delete(tester);
          testResults.set(tester, finalTestResult);
          return finalTestResult;
        });
      }
      testResults.set(tester, synchronousTestResult);
      return synchronousTestResult;
    } catch (e) {
      testResults.set(tester, false);
      return false;
    }
  };
};
const createConnectAudioParam = (renderInputsOfAudioParam2) => {
  return (nativeOfflineAudioContext, audioParam, nativeAudioParam) => {
    return renderInputsOfAudioParam2(audioParam, nativeOfflineAudioContext, nativeAudioParam);
  };
};
const createConvertNumberToUnsignedLong = (unit32Array) => {
  return (value) => {
    unit32Array[0] = value;
    return unit32Array[0];
  };
};
const DEFAULT_OPTIONS$3 = {
  buffer: null,
  channelCount: 2,
  channelCountMode: "clamped-max",
  channelInterpretation: "speakers",
  disableNormalization: false
};
const createConvolverNodeConstructor = (audioNodeConstructor2, createConvolverNodeRenderer2, createNativeConvolverNode2, getNativeContext2, isNativeOfflineAudioContext2, setAudioNodeTailTime2) => {
  return class ConvolverNode extends audioNodeConstructor2 {
    constructor(context, options) {
      const nativeContext = getNativeContext2(context);
      const mergedOptions = { ...DEFAULT_OPTIONS$3, ...options };
      const nativeConvolverNode = createNativeConvolverNode2(nativeContext, mergedOptions);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      const convolverNodeRenderer = isOffline ? createConvolverNodeRenderer2() : null;
      super(context, false, nativeConvolverNode, convolverNodeRenderer);
      this._isBufferNullified = false;
      this._nativeConvolverNode = nativeConvolverNode;
      if (mergedOptions.buffer !== null) {
        setAudioNodeTailTime2(this, mergedOptions.buffer.duration);
      }
    }
    get buffer() {
      if (this._isBufferNullified) {
        return null;
      }
      return this._nativeConvolverNode.buffer;
    }
    set buffer(value) {
      this._nativeConvolverNode.buffer = value;
      if (value === null && this._nativeConvolverNode.buffer !== null) {
        const nativeContext = this._nativeConvolverNode.context;
        this._nativeConvolverNode.buffer = nativeContext.createBuffer(1, 1, nativeContext.sampleRate);
        this._isBufferNullified = true;
        setAudioNodeTailTime2(this, 0);
      } else {
        this._isBufferNullified = false;
        setAudioNodeTailTime2(this, this._nativeConvolverNode.buffer === null ? 0 : this._nativeConvolverNode.buffer.duration);
      }
    }
    get normalize() {
      return this._nativeConvolverNode.normalize;
    }
    set normalize(value) {
      this._nativeConvolverNode.normalize = value;
    }
  };
};
const createConvolverNodeRendererFactory = (createNativeConvolverNode2, getNativeAudioNode2, renderInputsOfAudioNode2) => {
  return () => {
    const renderedNativeConvolverNodes = /* @__PURE__ */ new WeakMap();
    const createConvolverNode = async (proxy, nativeOfflineAudioContext) => {
      let nativeConvolverNode = getNativeAudioNode2(proxy);
      const nativeConvolverNodeIsOwnedByContext = isOwnedByContext(nativeConvolverNode, nativeOfflineAudioContext);
      if (!nativeConvolverNodeIsOwnedByContext) {
        const options = {
          buffer: nativeConvolverNode.buffer,
          channelCount: nativeConvolverNode.channelCount,
          channelCountMode: nativeConvolverNode.channelCountMode,
          channelInterpretation: nativeConvolverNode.channelInterpretation,
          disableNormalization: !nativeConvolverNode.normalize
        };
        nativeConvolverNode = createNativeConvolverNode2(nativeOfflineAudioContext, options);
      }
      renderedNativeConvolverNodes.set(nativeOfflineAudioContext, nativeConvolverNode);
      if (isNativeAudioNodeFaker(nativeConvolverNode)) {
        await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeConvolverNode.inputs[0]);
      } else {
        await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeConvolverNode);
      }
      return nativeConvolverNode;
    };
    return {
      render(proxy, nativeOfflineAudioContext) {
        const renderedNativeConvolverNode = renderedNativeConvolverNodes.get(nativeOfflineAudioContext);
        if (renderedNativeConvolverNode !== void 0) {
          return Promise.resolve(renderedNativeConvolverNode);
        }
        return createConvolverNode(proxy, nativeOfflineAudioContext);
      }
    };
  };
};
const createDecrementCycleCounter = (connectNativeAudioNodeToNativeAudioNode2, cycleCounters, getAudioNodeConnections2, getNativeAudioNode2, getNativeAudioParam2, getNativeContext2, isActiveAudioNode2, isNativeOfflineAudioContext2) => {
  return (audioNode, count) => {
    const cycleCounter = cycleCounters.get(audioNode);
    if (cycleCounter === void 0) {
      throw new Error("Missing the expected cycle count.");
    }
    const nativeContext = getNativeContext2(audioNode.context);
    const isOffline = isNativeOfflineAudioContext2(nativeContext);
    if (cycleCounter === count) {
      cycleCounters.delete(audioNode);
      if (!isOffline && isActiveAudioNode2(audioNode)) {
        const nativeSourceAudioNode = getNativeAudioNode2(audioNode);
        const { outputs } = getAudioNodeConnections2(audioNode);
        for (const output of outputs) {
          if (isAudioNodeOutputConnection(output)) {
            const nativeDestinationAudioNode = getNativeAudioNode2(output[0]);
            connectNativeAudioNodeToNativeAudioNode2(nativeSourceAudioNode, nativeDestinationAudioNode, output[1], output[2]);
          } else {
            const nativeDestinationAudioParam = getNativeAudioParam2(output[0]);
            nativeSourceAudioNode.connect(nativeDestinationAudioParam, output[1]);
          }
        }
      }
    } else {
      cycleCounters.set(audioNode, cycleCounter - count);
    }
  };
};
const createDeleteActiveInputConnectionToAudioNode = (pickElementFromSet2) => {
  return (activeInputs, source, output, input) => {
    return pickElementFromSet2(activeInputs[input], (activeInputConnection) => activeInputConnection[0] === source && activeInputConnection[1] === output);
  };
};
const isDelayNode = (audioNode) => {
  return "delayTime" in audioNode;
};
const createDetectCycles = (audioParamAudioNodeStore2, getAudioNodeConnections2, getValueForKey2) => {
  return function detectCycles(chain, nextLink) {
    const audioNode = isAudioNode(nextLink) ? nextLink : getValueForKey2(audioParamAudioNodeStore2, nextLink);
    if (isDelayNode(audioNode)) {
      return [];
    }
    if (chain[0] === audioNode) {
      return [chain];
    }
    if (chain.includes(audioNode)) {
      return [];
    }
    const { outputs } = getAudioNodeConnections2(audioNode);
    return Array.from(outputs).map((outputConnection) => detectCycles([...chain, audioNode], outputConnection[0])).reduce((mergedCycles, nestedCycles) => mergedCycles.concat(nestedCycles), []);
  };
};
const createEventTargetConstructor = (wrapEventListener2) => {
  return class EventTarget {
    constructor(_nativeEventTarget) {
      this._nativeEventTarget = _nativeEventTarget;
      this._listeners = /* @__PURE__ */ new WeakMap();
    }
    addEventListener(type, listener2, options) {
      if (listener2 !== null) {
        let wrappedEventListener = this._listeners.get(listener2);
        if (wrappedEventListener === void 0) {
          wrappedEventListener = wrapEventListener2(this, listener2);
          if (typeof listener2 === "function") {
            this._listeners.set(listener2, wrappedEventListener);
          }
        }
        this._nativeEventTarget.addEventListener(type, wrappedEventListener, options);
      }
    }
    dispatchEvent(event) {
      return this._nativeEventTarget.dispatchEvent(event);
    }
    removeEventListener(type, listener2, options) {
      const wrappedEventListener = listener2 === null ? void 0 : this._listeners.get(listener2);
      this._nativeEventTarget.removeEventListener(type, wrappedEventListener === void 0 ? null : wrappedEventListener, options);
    }
  };
};
const DEFAULT_OPTIONS$2 = {
  channelCount: 2,
  channelCountMode: "max",
  channelInterpretation: "speakers",
  gain: 1
};
const createGainNodeConstructor = (audioNodeConstructor2, createAudioParam2, createGainNodeRenderer2, createNativeGainNode2, getNativeContext2, isNativeOfflineAudioContext2) => {
  return class GainNode extends audioNodeConstructor2 {
    constructor(context, options) {
      const nativeContext = getNativeContext2(context);
      const mergedOptions = { ...DEFAULT_OPTIONS$2, ...options };
      const nativeGainNode = createNativeGainNode2(nativeContext, mergedOptions);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      const gainNodeRenderer = isOffline ? createGainNodeRenderer2() : null;
      super(context, false, nativeGainNode, gainNodeRenderer);
      this._gain = createAudioParam2(this, isOffline, nativeGainNode.gain, MOST_POSITIVE_SINGLE_FLOAT, MOST_NEGATIVE_SINGLE_FLOAT);
    }
    get gain() {
      return this._gain;
    }
  };
};
const createGainNodeRendererFactory = (connectAudioParam2, createNativeGainNode2, getNativeAudioNode2, renderAutomation2, renderInputsOfAudioNode2) => {
  return () => {
    const renderedNativeGainNodes = /* @__PURE__ */ new WeakMap();
    const createGainNode = async (proxy, nativeOfflineAudioContext) => {
      let nativeGainNode = getNativeAudioNode2(proxy);
      const nativeGainNodeIsOwnedByContext = isOwnedByContext(nativeGainNode, nativeOfflineAudioContext);
      if (!nativeGainNodeIsOwnedByContext) {
        const options = {
          channelCount: nativeGainNode.channelCount,
          channelCountMode: nativeGainNode.channelCountMode,
          channelInterpretation: nativeGainNode.channelInterpretation,
          gain: nativeGainNode.gain.value
        };
        nativeGainNode = createNativeGainNode2(nativeOfflineAudioContext, options);
      }
      renderedNativeGainNodes.set(nativeOfflineAudioContext, nativeGainNode);
      if (!nativeGainNodeIsOwnedByContext) {
        await renderAutomation2(nativeOfflineAudioContext, proxy.gain, nativeGainNode.gain);
      } else {
        await connectAudioParam2(nativeOfflineAudioContext, proxy.gain, nativeGainNode.gain);
      }
      await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeGainNode);
      return nativeGainNode;
    };
    return {
      render(proxy, nativeOfflineAudioContext) {
        const renderedNativeGainNode = renderedNativeGainNodes.get(nativeOfflineAudioContext);
        if (renderedNativeGainNode !== void 0) {
          return Promise.resolve(renderedNativeGainNode);
        }
        return createGainNode(proxy, nativeOfflineAudioContext);
      }
    };
  };
};
const createGetAudioNodeRenderer = (getAudioNodeConnections2) => {
  return (audioNode) => {
    const audioNodeConnections = getAudioNodeConnections2(audioNode);
    if (audioNodeConnections.renderer === null) {
      throw new Error("Missing the renderer of the given AudioNode in the audio graph.");
    }
    return audioNodeConnections.renderer;
  };
};
const createGetAudioNodeTailTime = (audioNodeTailTimeStore2) => {
  return (audioNode) => {
    var _a;
    return (_a = audioNodeTailTimeStore2.get(audioNode)) !== null && _a !== void 0 ? _a : 0;
  };
};
const createGetAudioParamRenderer = (getAudioParamConnections2) => {
  return (audioParam) => {
    const audioParamConnections = getAudioParamConnections2(audioParam);
    if (audioParamConnections.renderer === null) {
      throw new Error("Missing the renderer of the given AudioParam in the audio graph.");
    }
    return audioParamConnections.renderer;
  };
};
const createInvalidStateError = () => new DOMException("", "InvalidStateError");
const createGetNativeContext = (contextStore) => {
  return (context) => {
    const nativeContext = contextStore.get(context);
    if (nativeContext === void 0) {
      throw createInvalidStateError();
    }
    return nativeContext;
  };
};
const createInvalidAccessError = () => new DOMException("", "InvalidAccessError");
const wrapIIRFilterNodeGetFrequencyResponseMethod = (nativeIIRFilterNode) => {
  nativeIIRFilterNode.getFrequencyResponse = ((getFrequencyResponse) => {
    return (frequencyHz, magResponse, phaseResponse) => {
      if (frequencyHz.length !== magResponse.length || magResponse.length !== phaseResponse.length) {
        throw createInvalidAccessError();
      }
      return getFrequencyResponse.call(nativeIIRFilterNode, frequencyHz, magResponse, phaseResponse);
    };
  })(nativeIIRFilterNode.getFrequencyResponse);
};
const DEFAULT_OPTIONS$1 = {
  channelCount: 2,
  channelCountMode: "max",
  channelInterpretation: "speakers"
};
const createIIRFilterNodeConstructor = (audioNodeConstructor2, createNativeIIRFilterNode2, createIIRFilterNodeRenderer2, getNativeContext2, isNativeOfflineAudioContext2, setAudioNodeTailTime2) => {
  return class IIRFilterNode extends audioNodeConstructor2 {
    constructor(context, options) {
      const nativeContext = getNativeContext2(context);
      const isOffline = isNativeOfflineAudioContext2(nativeContext);
      const mergedOptions = { ...DEFAULT_OPTIONS$1, ...options };
      const nativeIIRFilterNode = createNativeIIRFilterNode2(nativeContext, isOffline ? null : context.baseLatency, mergedOptions);
      const iirFilterNodeRenderer = isOffline ? createIIRFilterNodeRenderer2(mergedOptions.feedback, mergedOptions.feedforward) : null;
      super(context, false, nativeIIRFilterNode, iirFilterNodeRenderer);
      wrapIIRFilterNodeGetFrequencyResponseMethod(nativeIIRFilterNode);
      this._nativeIIRFilterNode = nativeIIRFilterNode;
      setAudioNodeTailTime2(this, 1);
    }
    getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
      return this._nativeIIRFilterNode.getFrequencyResponse(frequencyHz, magResponse, phaseResponse);
    }
  };
};
const filterBuffer = (feedback, feedbackLength, feedforward, feedforwardLength, minLength, xBuffer, yBuffer, bufferIndex, bufferLength, input, output) => {
  const inputLength = input.length;
  let i = bufferIndex;
  for (let j = 0; j < inputLength; j += 1) {
    let y = feedforward[0] * input[j];
    for (let k = 1; k < minLength; k += 1) {
      const x = i - k & bufferLength - 1;
      y += feedforward[k] * xBuffer[x];
      y -= feedback[k] * yBuffer[x];
    }
    for (let k = minLength; k < feedforwardLength; k += 1) {
      y += feedforward[k] * xBuffer[i - k & bufferLength - 1];
    }
    for (let k = minLength; k < feedbackLength; k += 1) {
      y -= feedback[k] * yBuffer[i - k & bufferLength - 1];
    }
    xBuffer[i] = input[j];
    yBuffer[i] = y;
    i = i + 1 & bufferLength - 1;
    output[j] = y;
  }
  return i;
};
const filterFullBuffer = (renderedBuffer, nativeOfflineAudioContext, feedback, feedforward) => {
  const convertedFeedback = feedback instanceof Float64Array ? feedback : new Float64Array(feedback);
  const convertedFeedforward = feedforward instanceof Float64Array ? feedforward : new Float64Array(feedforward);
  const feedbackLength = convertedFeedback.length;
  const feedforwardLength = convertedFeedforward.length;
  const minLength = Math.min(feedbackLength, feedforwardLength);
  if (convertedFeedback[0] !== 1) {
    for (let i = 0; i < feedbackLength; i += 1) {
      convertedFeedforward[i] /= convertedFeedback[0];
    }
    for (let i = 1; i < feedforwardLength; i += 1) {
      convertedFeedback[i] /= convertedFeedback[0];
    }
  }
  const bufferLength = 32;
  const xBuffer = new Float32Array(bufferLength);
  const yBuffer = new Float32Array(bufferLength);
  const filteredBuffer = nativeOfflineAudioContext.createBuffer(renderedBuffer.numberOfChannels, renderedBuffer.length, renderedBuffer.sampleRate);
  const numberOfChannels = renderedBuffer.numberOfChannels;
  for (let i = 0; i < numberOfChannels; i += 1) {
    const input = renderedBuffer.getChannelData(i);
    const output = filteredBuffer.getChannelData(i);
    xBuffer.fill(0);
    yBuffer.fill(0);
    filterBuffer(convertedFeedback, feedbackLength, convertedFeedforward, feedforwardLength, minLength, xBuffer, yBuffer, 0, bufferLength, input, output);
  }
  return filteredBuffer;
};
const createIIRFilterNodeRendererFactory = (createNativeAudioBufferSourceNode2, getNativeAudioNode2, nativeOfflineAudioContextConstructor2, renderInputsOfAudioNode2, renderNativeOfflineAudioContext2) => {
  return (feedback, feedforward) => {
    const renderedNativeAudioNodes = /* @__PURE__ */ new WeakMap();
    let filteredBufferPromise = null;
    const createAudioNode = async (proxy, nativeOfflineAudioContext) => {
      let nativeAudioBufferSourceNode = null;
      let nativeIIRFilterNode = getNativeAudioNode2(proxy);
      const nativeIIRFilterNodeIsOwnedByContext = isOwnedByContext(nativeIIRFilterNode, nativeOfflineAudioContext);
      if (nativeOfflineAudioContext.createIIRFilter === void 0) {
        nativeAudioBufferSourceNode = createNativeAudioBufferSourceNode2(nativeOfflineAudioContext, {
          buffer: null,
          channelCount: 2,
          channelCountMode: "max",
          channelInterpretation: "speakers",
          loop: false,
          loopEnd: 0,
          loopStart: 0,
          playbackRate: 1
        });
      } else if (!nativeIIRFilterNodeIsOwnedByContext) {
        nativeIIRFilterNode = nativeOfflineAudioContext.createIIRFilter(feedforward, feedback);
      }
      renderedNativeAudioNodes.set(nativeOfflineAudioContext, nativeAudioBufferSourceNode === null ? nativeIIRFilterNode : nativeAudioBufferSourceNode);
      if (nativeAudioBufferSourceNode !== null) {
        if (filteredBufferPromise === null) {
          if (nativeOfflineAudioContextConstructor2 === null) {
            throw new Error("Missing the native OfflineAudioContext constructor.");
          }
          const partialOfflineAudioContext = new nativeOfflineAudioContextConstructor2(
            proxy.context.destination.channelCount,
            proxy.context.length,
            nativeOfflineAudioContext.sampleRate
          );
          filteredBufferPromise = (async () => {
            await renderInputsOfAudioNode2(proxy, partialOfflineAudioContext, partialOfflineAudioContext.destination);
            const renderedBuffer = await renderNativeOfflineAudioContext2(partialOfflineAudioContext);
            return filterFullBuffer(renderedBuffer, nativeOfflineAudioContext, feedback, feedforward);
          })();
        }
        const filteredBuffer = await filteredBufferPromise;
        nativeAudioBufferSourceNode.buffer = filteredBuffer;
        nativeAudioBufferSourceNode.start(0);
        return nativeAudioBufferSourceNode;
      }
      await renderInputsOfAudioNode2(proxy, nativeOfflineAudioContext, nativeIIRFilterNode);
      return nativeIIRFilterNode;
    };
    return {
      render(proxy, nativeOfflineAudioContext) {
        const renderedNativeAudioNode = renderedNativeAudioNodes.get(nativeOfflineAudioContext);
        if (renderedNativeAudioNode !== void 0) {
          return Promise.resolve(renderedNativeAudioNode);
        }
        return createAudioNode(proxy, nativeOfflineAudioContext);
      }
    };
  };
};
const createIncrementCycleCounterFactory = (cycleCounters, disconnectNativeAudioNodeFromNativeAudioNode2, getAudioNodeConnections2, getNativeAudioNode2, getNativeAudioParam2, isActiveAudioNode2) => {
  return (isOffline) => {
    return (audioNode, count) => {
      const cycleCounter = cycleCounters.get(audioNode);
      if (cycleCounter === void 0) {
        if (!isOffline && isActiveAudioNode2(audioNode)) {
          const nativeSourceAudioNode = getNativeAudioNode2(audioNode);
          const { outputs } = getAudioNodeConnections2(audioNode);
          for (const output of outputs) {
            if (isAudioNodeOutputConnection(output)) {
              const nativeDestinationAudioNode = getNativeAudioNode2(output[0]);
              disconnectNativeAudioNodeFromNativeAudioNode2(nativeSourceAudioNode, nativeDestinationAudioNode, output[1], output[2]);
            } else {
              const nativeDestinationAudioParam = getNativeAudioParam2(output[0]);
              nativeSourceAudioNode.disconnect(nativeDestinationAudioParam, output[1]);
            }
          }
        }
        cycleCounters.set(audioNode, count);
      } else {
        cycleCounters.set(audioNode, cycleCounter + count);
      }
    };
  };
};
const createIsNativeAudioContext = (nativeAudioContextConstructor2) => {
  return (anything) => {
    return nativeAudioContextConstructor2 !== null && anything instanceof nativeAudioContextConstructor2;
  };
};
const createIsNativeAudioNode = (window2) => {
  return (anything) => {
    return window2 !== null && typeof window2.AudioNode === "function" && anything instanceof window2.AudioNode;
  };
};
const createIsNativeAudioParam = (window2) => {
  return (anything) => {
    return window2 !== null && typeof window2.AudioParam === "function" && anything instanceof window2.AudioParam;
  };
};
const createIsNativeOfflineAudioContext = (nativeOfflineAudioContextConstructor2) => {
  return (anything) => {
    return nativeOfflineAudioContextConstructor2 !== null && anything instanceof nativeOfflineAudioContextConstructor2;
  };
};
const createIsSecureContext = (window2) => window2 !== null && window2.isSecureContext;
const createMinimalAudioContextConstructor = (createInvalidStateError2, createNotSupportedError2, createUnknownError2, minimalBaseAudioContextConstructor2, nativeAudioContextConstructor2) => {
  return class MinimalAudioContext extends minimalBaseAudioContextConstructor2 {
    constructor(options = {}) {
      if (nativeAudioContextConstructor2 === null) {
        throw new Error("Missing the native AudioContext constructor.");
      }
      let nativeAudioContext;
      try {
        nativeAudioContext = new nativeAudioContextConstructor2(options);
      } catch (err2) {
        if (err2.code === 12 && err2.message === "sampleRate is not in range") {
          throw createNotSupportedError2();
        }
        throw err2;
      }
      if (nativeAudioContext === null) {
        throw createUnknownError2();
      }
      if (!isValidLatencyHint(options.latencyHint)) {
        throw new TypeError(`The provided value '${options.latencyHint}' is not a valid enum value of type AudioContextLatencyCategory.`);
      }
      if (options.sampleRate !== void 0 && nativeAudioContext.sampleRate !== options.sampleRate) {
        throw createNotSupportedError2();
      }
      super(nativeAudioContext, 2);
      const { latencyHint } = options;
      const { sampleRate } = nativeAudioContext;
      this._baseLatency = typeof nativeAudioContext.baseLatency === "number" ? nativeAudioContext.baseLatency : latencyHint === "balanced" ? 512 / sampleRate : latencyHint === "interactive" || latencyHint === void 0 ? 256 / sampleRate : latencyHint === "playback" ? 1024 / sampleRate : Math.max(2, Math.min(128, Math.round(latencyHint * sampleRate / 128))) * 128 / sampleRate;
      this._nativeAudioContext = nativeAudioContext;
      if (nativeAudioContextConstructor2.name === "webkitAudioContext") {
        this._nativeGainNode = nativeAudioContext.createGain();
        this._nativeOscillatorNode = nativeAudioContext.createOscillator();
        this._nativeGainNode.gain.value = 1e-37;
        this._nativeOscillatorNode.connect(this._nativeGainNode).connect(nativeAudioContext.destination);
        this._nativeOscillatorNode.start();
      } else {
        this._nativeGainNode = null;
        this._nativeOscillatorNode = null;
      }
      this._state = null;
      if (nativeAudioContext.state === "running") {
        this._state = "suspended";
        const revokeState = () => {
          if (this._state === "suspended") {
            this._state = null;
          }
          nativeAudioContext.removeEventListener("statechange", revokeState);
        };
        nativeAudioContext.addEventListener("statechange", revokeState);
      }
    }
    get baseLatency() {
      return this._baseLatency;
    }
    get state() {
      return this._state !== null ? this._state : this._nativeAudioContext.state;
    }
    close() {
      if (this.state === "closed") {
        return this._nativeAudioContext.close().then(() => {
          throw createInvalidStateError2();
        });
      }
      if (this._state === "suspended") {
        this._state = null;
      }
      return this._nativeAudioContext.close().then(() => {
        if (this._nativeGainNode !== null && this._nativeOscillatorNode !== null) {
          this._nativeOscillatorNode.stop();
          this._nativeGainNode.disconnect();
          this._nativeOscillatorNode.disconnect();
        }
        deactivateAudioGraph(this);
      });
    }
    resume() {
      if (this._state === "suspended") {
        return new Promise((resolve, reject) => {
          const resolvePromise = () => {
            this._nativeAudioContext.removeEventListener("statechange", resolvePromise);
            if (this._nativeAudioContext.state === "running") {
              resolve();
            } else {
              this.resume().then(resolve, reject);
            }
          };
          this._nativeAudioContext.addEventListener("statechange", resolvePromise);
        });
      }
      return this._nativeAudioContext.resume().catch((err2) => {
        if (err2 === void 0 || err2.code === 15) {
          throw createInvalidStateError2();
        }
        throw err2;
      });
    }
    suspend() {
      return this._nativeAudioContext.suspend().catch((err2) => {
        if (err2 === void 0) {
          throw createInvalidStateError2();
        }
        throw err2;
      });
    }
  };
};
const createMinimalBaseAudioContextConstructor = (audioDestinationNodeConstructor2, createAudioListener2, eventTargetConstructor2, isNativeOfflineAudioContext2, unrenderedAudioWorkletNodeStore2, wrapEventListener2) => {
  return class MinimalBaseAudioContext extends eventTargetConstructor2 {
    constructor(_nativeContext, numberOfChannels) {
      super(_nativeContext);
      this._nativeContext = _nativeContext;
      CONTEXT_STORE.set(this, _nativeContext);
      if (isNativeOfflineAudioContext2(_nativeContext)) {
        unrenderedAudioWorkletNodeStore2.set(_nativeContext, /* @__PURE__ */ new Set());
      }
      this._destination = new audioDestinationNodeConstructor2(this, numberOfChannels);
      this._listener = createAudioListener2(this, _nativeContext);
      this._onstatechange = null;
    }
    get currentTime() {
      return this._nativeContext.currentTime;
    }
    get destination() {
      return this._destination;
    }
    get listener() {
      return this._listener;
    }
    get onstatechange() {
      return this._onstatechange;
    }
    set onstatechange(value) {
      const wrappedListener = typeof value === "function" ? wrapEventListener2(this, value) : null;
      this._nativeContext.onstatechange = wrappedListener;
      const nativeOnStateChange = this._nativeContext.onstatechange;
      this._onstatechange = nativeOnStateChange !== null && nativeOnStateChange === wrappedListener ? value : nativeOnStateChange;
    }
    get sampleRate() {
      return this._nativeContext.sampleRate;
    }
    get state() {
      return this._nativeContext.state;
    }
  };
};
const testPromiseSupport = (nativeContext) => {
  const uint32Array = new Uint32Array([1179011410, 40, 1163280727, 544501094, 16, 131073, 44100, 176400, 1048580, 1635017060, 4, 0]);
  try {
    const promise = nativeContext.decodeAudioData(uint32Array.buffer, () => {
    });
    if (promise === void 0) {
      return false;
    }
    promise.catch(() => {
    });
    return true;
  } catch (e) {
  }
  return false;
};
const createMonitorConnections = (insertElementInSet2, isNativeAudioNode2) => {
  return (nativeAudioNode, whenConnected, whenDisconnected) => {
    const connections = /* @__PURE__ */ new Set();
    nativeAudioNode.connect = ((connect) => {
      return (destination, output = 0, input = 0) => {
        const wasDisconnected = connections.size === 0;
        if (isNativeAudioNode2(destination)) {
          connect.call(nativeAudioNode, destination, output, input);
          insertElementInSet2(connections, [destination, output, input], (connection) => connection[0] === destination && connection[1] === output && connection[2] === input, true);
          if (wasDisconnected) {
            whenConnected();
          }
          return destination;
        }
        connect.call(nativeAudioNode, destination, output);
        insertElementInSet2(connections, [destination, output], (connection) => connection[0] === destination && connection[1] === output, true);
        if (wasDisconnected) {
          whenConnected();
        }
        return;
      };
    })(nativeAudioNode.connect);
    nativeAudioNode.disconnect = ((disconnect) => {
      return (destinationOrOutput, output, input) => {
        const wasConnected = connections.size > 0;
        if (destinationOrOutput === void 0) {
          disconnect.apply(nativeAudioNode);
          connections.clear();
        } else if (typeof destinationOrOutput === "number") {
          disconnect.call(nativeAudioNode, destinationOrOutput);
          for (const connection of connections) {
            if (connection[1] === destinationOrOutput) {
              connections.delete(connection);
            }
          }
        } else {
          if (isNativeAudioNode2(destinationOrOutput)) {
            disconnect.call(nativeAudioNode, destinationOrOutput, output, input);
          } else {
            disconnect.call(nativeAudioNode, destinationOrOutput, output);
          }
          for (const connection of connections) {
            if (connection[0] === destinationOrOutput && (output === void 0 || connection[1] === output) && (input === void 0 || connection[2] === input)) {
              connections.delete(connection);
            }
          }
        }
        const isDisconnected = connections.size === 0;
        if (wasConnected && isDisconnected) {
          whenDisconnected();
        }
      };
    })(nativeAudioNode.disconnect);
    return nativeAudioNode;
  };
};
const assignNativeAudioNodeOption = (nativeAudioNode, options, option) => {
  const value = options[option];
  if (value !== void 0 && value !== nativeAudioNode[option]) {
    nativeAudioNode[option] = value;
  }
};
const assignNativeAudioNodeOptions = (nativeAudioNode, options) => {
  assignNativeAudioNodeOption(nativeAudioNode, options, "channelCount");
  assignNativeAudioNodeOption(nativeAudioNode, options, "channelCountMode");
  assignNativeAudioNodeOption(nativeAudioNode, options, "channelInterpretation");
};
const createNativeAudioBufferConstructor = (window2) => {
  if (window2 === null) {
    return null;
  }
  if (window2.hasOwnProperty("AudioBuffer")) {
    return window2.AudioBuffer;
  }
  return null;
};
const assignNativeAudioNodeAudioParamValue = (nativeAudioNode, options, audioParam) => {
  const value = options[audioParam];
  if (value !== void 0 && value !== nativeAudioNode[audioParam].value) {
    nativeAudioNode[audioParam].value = value;
  }
};
const wrapAudioBufferSourceNodeStartMethodConsecutiveCalls = (nativeAudioBufferSourceNode) => {
  nativeAudioBufferSourceNode.start = ((start2) => {
    let isScheduled = false;
    return (when = 0, offset2 = 0, duration) => {
      if (isScheduled) {
        throw createInvalidStateError();
      }
      start2.call(nativeAudioBufferSourceNode, when, offset2, duration);
      isScheduled = true;
    };
  })(nativeAudioBufferSourceNode.start);
};
const wrapAudioScheduledSourceNodeStartMethodNegativeParameters = (nativeAudioScheduledSourceNode) => {
  nativeAudioScheduledSourceNode.start = ((start2) => {
    return (when = 0, offset2 = 0, duration) => {
      if (typeof duration === "number" && duration < 0 || offset2 < 0 || when < 0) {
        throw new RangeError("The parameters can't be negative.");
      }
      start2.call(nativeAudioScheduledSourceNode, when, offset2, duration);
    };
  })(nativeAudioScheduledSourceNode.start);
};
const wrapAudioScheduledSourceNodeStopMethodNegativeParameters = (nativeAudioScheduledSourceNode) => {
  nativeAudioScheduledSourceNode.stop = ((stop) => {
    return (when = 0) => {
      if (when < 0) {
        throw new RangeError("The parameter can't be negative.");
      }
      stop.call(nativeAudioScheduledSourceNode, when);
    };
  })(nativeAudioScheduledSourceNode.stop);
};
const createNativeAudioBufferSourceNodeFactory = (addSilentConnection2, cacheTestResult2, testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport2, testAudioBufferSourceNodeStartMethodOffsetClampingSupport2, testAudioBufferSourceNodeStopMethodNullifiedBufferSupport2, testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2, testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport2, testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2, wrapAudioBufferSourceNodeStartMethodOffsetClampling, wrapAudioBufferSourceNodeStopMethodNullifiedBuffer, wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls2) => {
  return (nativeContext, options) => {
    const nativeAudioBufferSourceNode = nativeContext.createBufferSource();
    assignNativeAudioNodeOptions(nativeAudioBufferSourceNode, options);
    assignNativeAudioNodeAudioParamValue(nativeAudioBufferSourceNode, options, "playbackRate");
    assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, "buffer");
    assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, "loop");
    assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, "loopEnd");
    assignNativeAudioNodeOption(nativeAudioBufferSourceNode, options, "loopStart");
    if (!cacheTestResult2(testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport2, () => testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport2(nativeContext))) {
      wrapAudioBufferSourceNodeStartMethodConsecutiveCalls(nativeAudioBufferSourceNode);
    }
    if (!cacheTestResult2(testAudioBufferSourceNodeStartMethodOffsetClampingSupport2, () => testAudioBufferSourceNodeStartMethodOffsetClampingSupport2(nativeContext))) {
      wrapAudioBufferSourceNodeStartMethodOffsetClampling(nativeAudioBufferSourceNode);
    }
    if (!cacheTestResult2(testAudioBufferSourceNodeStopMethodNullifiedBufferSupport2, () => testAudioBufferSourceNodeStopMethodNullifiedBufferSupport2(nativeContext))) {
      wrapAudioBufferSourceNodeStopMethodNullifiedBuffer(nativeAudioBufferSourceNode, nativeContext);
    }
    if (!cacheTestResult2(testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2, () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2(nativeContext))) {
      wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeAudioBufferSourceNode);
    }
    if (!cacheTestResult2(testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport2, () => testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport2(nativeContext))) {
      wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls2(nativeAudioBufferSourceNode, nativeContext);
    }
    if (!cacheTestResult2(testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2, () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2(nativeContext))) {
      wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeAudioBufferSourceNode);
    }
    addSilentConnection2(nativeContext, nativeAudioBufferSourceNode);
    return nativeAudioBufferSourceNode;
  };
};
const createNativeAudioContextConstructor = (window2) => {
  if (window2 === null) {
    return null;
  }
  if (window2.hasOwnProperty("AudioContext")) {
    return window2.AudioContext;
  }
  return window2.hasOwnProperty("webkitAudioContext") ? window2.webkitAudioContext : null;
};
const createNativeAudioDestinationNodeFactory = (createNativeGainNode2, overwriteAccessors2) => {
  return (nativeContext, channelCount, isNodeOfNativeOfflineAudioContext) => {
    const nativeAudioDestinationNode = nativeContext.destination;
    if (nativeAudioDestinationNode.channelCount !== channelCount) {
      try {
        nativeAudioDestinationNode.channelCount = channelCount;
      } catch (e) {
      }
    }
    if (isNodeOfNativeOfflineAudioContext && nativeAudioDestinationNode.channelCountMode !== "explicit") {
      nativeAudioDestinationNode.channelCountMode = "explicit";
    }
    if (nativeAudioDestinationNode.maxChannelCount === 0) {
      Object.defineProperty(nativeAudioDestinationNode, "maxChannelCount", {
        value: channelCount
      });
    }
    const gainNode = createNativeGainNode2(nativeContext, {
      channelCount,
      channelCountMode: nativeAudioDestinationNode.channelCountMode,
      channelInterpretation: nativeAudioDestinationNode.channelInterpretation,
      gain: 1
    });
    overwriteAccessors2(gainNode, "channelCount", (get2) => () => get2.call(gainNode), (set2) => (value) => {
      set2.call(gainNode, value);
      try {
        nativeAudioDestinationNode.channelCount = value;
      } catch (err2) {
        if (value > nativeAudioDestinationNode.maxChannelCount) {
          throw err2;
        }
      }
    });
    overwriteAccessors2(gainNode, "channelCountMode", (get2) => () => get2.call(gainNode), (set2) => (value) => {
      set2.call(gainNode, value);
      nativeAudioDestinationNode.channelCountMode = value;
    });
    overwriteAccessors2(gainNode, "channelInterpretation", (get2) => () => get2.call(gainNode), (set2) => (value) => {
      set2.call(gainNode, value);
      nativeAudioDestinationNode.channelInterpretation = value;
    });
    Object.defineProperty(gainNode, "maxChannelCount", {
      get: () => nativeAudioDestinationNode.maxChannelCount
    });
    gainNode.connect(nativeAudioDestinationNode);
    return gainNode;
  };
};
const createNativeAudioWorkletNodeConstructor = (window2) => {
  if (window2 === null) {
    return null;
  }
  return window2.hasOwnProperty("AudioWorkletNode") ? window2.AudioWorkletNode : null;
};
const computeBufferSize = (baseLatency, sampleRate) => {
  if (baseLatency === null) {
    return 512;
  }
  return Math.max(512, Math.min(16384, Math.pow(2, Math.round(Math.log2(baseLatency * sampleRate)))));
};
const createNativeChannelMergerNodeFactory = (nativeAudioContextConstructor2, wrapChannelMergerNode2) => {
  return (nativeContext, options) => {
    const nativeChannelMergerNode = nativeContext.createChannelMerger(options.numberOfInputs);
    if (nativeAudioContextConstructor2 !== null && nativeAudioContextConstructor2.name === "webkitAudioContext") {
      wrapChannelMergerNode2(nativeContext, nativeChannelMergerNode);
    }
    assignNativeAudioNodeOptions(nativeChannelMergerNode, options);
    return nativeChannelMergerNode;
  };
};
const createNativeConstantSourceNodeFactory = (addSilentConnection2, cacheTestResult2, createNativeConstantSourceNodeFaker2, testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2, testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2) => {
  return (nativeContext, options) => {
    if (nativeContext.createConstantSource === void 0) {
      return createNativeConstantSourceNodeFaker2(nativeContext, options);
    }
    const nativeConstantSourceNode = nativeContext.createConstantSource();
    assignNativeAudioNodeOptions(nativeConstantSourceNode, options);
    assignNativeAudioNodeAudioParamValue(nativeConstantSourceNode, options, "offset");
    if (!cacheTestResult2(testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2, () => testAudioScheduledSourceNodeStartMethodNegativeParametersSupport2(nativeContext))) {
      wrapAudioScheduledSourceNodeStartMethodNegativeParameters(nativeConstantSourceNode);
    }
    if (!cacheTestResult2(testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2, () => testAudioScheduledSourceNodeStopMethodNegativeParametersSupport2(nativeContext))) {
      wrapAudioScheduledSourceNodeStopMethodNegativeParameters(nativeConstantSourceNode);
    }
    addSilentConnection2(nativeContext, nativeConstantSourceNode);
    return nativeConstantSourceNode;
  };
};
const interceptConnections = (original, interceptor) => {
  original.connect = interceptor.connect.bind(interceptor);
  original.disconnect = interceptor.disconnect.bind(interceptor);
  return original;
};
const createNativeConstantSourceNodeFakerFactory = (addSilentConnection2, createNativeAudioBufferSourceNode2, createNativeGainNode2, monitorConnections2) => {
  return (nativeContext, { offset: offset2, ...audioNodeOptions }) => {
    const audioBuffer = nativeContext.createBuffer(1, 2, 44100);
    const audioBufferSourceNode = createNativeAudioBufferSourceNode2(nativeContext, {
      buffer: null,
      channelCount: 2,
      channelCountMode: "max",
      channelInterpretation: "speakers",
      loop: false,
      loopEnd: 0,
      loopStart: 0,
      playbackRate: 1
    });
    const gainNode = createNativeGainNode2(nativeContext, { ...audioNodeOptions, gain: offset2 });
    const channelData = audioBuffer.getChannelData(0);
    channelData[0] = 1;
    channelData[1] = 1;
    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.loop = true;
    const nativeConstantSourceNodeFaker = {
      get bufferSize() {
        return void 0;
      },
      get channelCount() {
        return gainNode.channelCount;
      },
      set channelCount(value) {
        gainNode.channelCount = value;
      },
      get channelCountMode() {
        return gainNode.channelCountMode;
      },
      set channelCountMode(value) {
        gainNode.channelCountMode = value;
      },
      get channelInterpretation() {
        return gainNode.channelInterpretation;
      },
      set channelInterpretation(value) {
        gainNode.channelInterpretation = value;
      },
      get context() {
        return gainNode.context;
      },
      get inputs() {
        return [];
      },
      get numberOfInputs() {
        return audioBufferSourceNode.numberOfInputs;
      },
      get numberOfOutputs() {
        return gainNode.numberOfOutputs;
      },
      get offset() {
        return gainNode.gain;
      },
      get onended() {
        return audioBufferSourceNode.onended;
      },
      set onended(value) {
        audioBufferSourceNode.onended = value;
      },
      addEventListener(...args) {
        return audioBufferSourceNode.addEventListener(args[0], args[1], args[2]);
      },
      dispatchEvent(...args) {
        return audioBufferSourceNode.dispatchEvent(args[0]);
      },
      removeEventListener(...args) {
        return audioBufferSourceNode.removeEventListener(args[0], args[1], args[2]);
      },
      start(when = 0) {
        audioBufferSourceNode.start.call(audioBufferSourceNode, when);
      },
      stop(when = 0) {
        audioBufferSourceNode.stop.call(audioBufferSourceNode, when);
      }
    };
    const whenConnected = () => audioBufferSourceNode.connect(gainNode);
    const whenDisconnected = () => audioBufferSourceNode.disconnect(gainNode);
    addSilentConnection2(nativeContext, audioBufferSourceNode);
    return monitorConnections2(interceptConnections(nativeConstantSourceNodeFaker, gainNode), whenConnected, whenDisconnected);
  };
};
const createNativeConvolverNodeFactory = (createNotSupportedError2, overwriteAccessors2) => {
  return (nativeContext, options) => {
    const nativeConvolverNode = nativeContext.createConvolver();
    assignNativeAudioNodeOptions(nativeConvolverNode, options);
    if (options.disableNormalization === nativeConvolverNode.normalize) {
      nativeConvolverNode.normalize = !options.disableNormalization;
    }
    assignNativeAudioNodeOption(nativeConvolverNode, options, "buffer");
    if (options.channelCount > 2) {
      throw createNotSupportedError2();
    }
    overwriteAccessors2(nativeConvolverNode, "channelCount", (get2) => () => get2.call(nativeConvolverNode), (set2) => (value) => {
      if (value > 2) {
        throw createNotSupportedError2();
      }
      return set2.call(nativeConvolverNode, value);
    });
    if (options.channelCountMode === "max") {
      throw createNotSupportedError2();
    }
    overwriteAccessors2(nativeConvolverNode, "channelCountMode", (get2) => () => get2.call(nativeConvolverNode), (set2) => (value) => {
      if (value === "max") {
        throw createNotSupportedError2();
      }
      return set2.call(nativeConvolverNode, value);
    });
    return nativeConvolverNode;
  };
};
const createNativeGainNode = (nativeContext, options) => {
  const nativeGainNode = nativeContext.createGain();
  assignNativeAudioNodeOptions(nativeGainNode, options);
  assignNativeAudioNodeAudioParamValue(nativeGainNode, options, "gain");
  return nativeGainNode;
};
const createNativeIIRFilterNodeFactory = (createNativeIIRFilterNodeFaker2) => {
  return (nativeContext, baseLatency, options) => {
    if (nativeContext.createIIRFilter === void 0) {
      return createNativeIIRFilterNodeFaker2(nativeContext, baseLatency, options);
    }
    const nativeIIRFilterNode = nativeContext.createIIRFilter(options.feedforward, options.feedback);
    assignNativeAudioNodeOptions(nativeIIRFilterNode, options);
    return nativeIIRFilterNode;
  };
};
function divide(a, b) {
  const denominator = b[0] * b[0] + b[1] * b[1];
  return [(a[0] * b[0] + a[1] * b[1]) / denominator, (a[1] * b[0] - a[0] * b[1]) / denominator];
}
function multiply(a, b) {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function evaluatePolynomial(coefficient, z) {
  let result = [0, 0];
  for (let i = coefficient.length - 1; i >= 0; i -= 1) {
    result = multiply(result, z);
    result[0] += coefficient[i];
  }
  return result;
}
const createNativeIIRFilterNodeFakerFactory = (createInvalidAccessError2, createInvalidStateError2, createNativeScriptProcessorNode2, createNotSupportedError2) => {
  return (nativeContext, baseLatency, { channelCount, channelCountMode, channelInterpretation, feedback, feedforward }) => {
    const bufferSize = computeBufferSize(baseLatency, nativeContext.sampleRate);
    const convertedFeedback = feedback instanceof Float64Array ? feedback : new Float64Array(feedback);
    const convertedFeedforward = feedforward instanceof Float64Array ? feedforward : new Float64Array(feedforward);
    const feedbackLength = convertedFeedback.length;
    const feedforwardLength = convertedFeedforward.length;
    const minLength = Math.min(feedbackLength, feedforwardLength);
    if (feedbackLength === 0 || feedbackLength > 20) {
      throw createNotSupportedError2();
    }
    if (convertedFeedback[0] === 0) {
      throw createInvalidStateError2();
    }
    if (feedforwardLength === 0 || feedforwardLength > 20) {
      throw createNotSupportedError2();
    }
    if (convertedFeedforward[0] === 0) {
      throw createInvalidStateError2();
    }
    if (convertedFeedback[0] !== 1) {
      for (let i = 0; i < feedforwardLength; i += 1) {
        convertedFeedforward[i] /= convertedFeedback[0];
      }
      for (let i = 1; i < feedbackLength; i += 1) {
        convertedFeedback[i] /= convertedFeedback[0];
      }
    }
    const scriptProcessorNode = createNativeScriptProcessorNode2(nativeContext, bufferSize, channelCount, channelCount);
    scriptProcessorNode.channelCount = channelCount;
    scriptProcessorNode.channelCountMode = channelCountMode;
    scriptProcessorNode.channelInterpretation = channelInterpretation;
    const bufferLength = 32;
    const bufferIndexes = [];
    const xBuffers = [];
    const yBuffers = [];
    for (let i = 0; i < channelCount; i += 1) {
      bufferIndexes.push(0);
      const xBuffer = new Float32Array(bufferLength);
      const yBuffer = new Float32Array(bufferLength);
      xBuffer.fill(0);
      yBuffer.fill(0);
      xBuffers.push(xBuffer);
      yBuffers.push(yBuffer);
    }
    scriptProcessorNode.onaudioprocess = (event) => {
      const inputBuffer = event.inputBuffer;
      const outputBuffer = event.outputBuffer;
      const numberOfChannels = inputBuffer.numberOfChannels;
      for (let i = 0; i < numberOfChannels; i += 1) {
        const input = inputBuffer.getChannelData(i);
        const output = outputBuffer.getChannelData(i);
        bufferIndexes[i] = filterBuffer(convertedFeedback, feedbackLength, convertedFeedforward, feedforwardLength, minLength, xBuffers[i], yBuffers[i], bufferIndexes[i], bufferLength, input, output);
      }
    };
    const nyquist = nativeContext.sampleRate / 2;
    const nativeIIRFilterNodeFaker = {
      get bufferSize() {
        return bufferSize;
      },
      get channelCount() {
        return scriptProcessorNode.channelCount;
      },
      set channelCount(value) {
        scriptProcessorNode.channelCount = value;
      },
      get channelCountMode() {
        return scriptProcessorNode.channelCountMode;
      },
      set channelCountMode(value) {
        scriptProcessorNode.channelCountMode = value;
      },
      get channelInterpretation() {
        return scriptProcessorNode.channelInterpretation;
      },
      set channelInterpretation(value) {
        scriptProcessorNode.channelInterpretation = value;
      },
      get context() {
        return scriptProcessorNode.context;
      },
      get inputs() {
        return [scriptProcessorNode];
      },
      get numberOfInputs() {
        return scriptProcessorNode.numberOfInputs;
      },
      get numberOfOutputs() {
        return scriptProcessorNode.numberOfOutputs;
      },
      addEventListener(...args) {
        return scriptProcessorNode.addEventListener(args[0], args[1], args[2]);
      },
      dispatchEvent(...args) {
        return scriptProcessorNode.dispatchEvent(args[0]);
      },
      getFrequencyResponse(frequencyHz, magResponse, phaseResponse) {
        if (frequencyHz.length !== magResponse.length || magResponse.length !== phaseResponse.length) {
          throw createInvalidAccessError2();
        }
        const length = frequencyHz.length;
        for (let i = 0; i < length; i += 1) {
          const omega = -Math.PI * (frequencyHz[i] / nyquist);
          const z = [Math.cos(omega), Math.sin(omega)];
          const numerator = evaluatePolynomial(convertedFeedforward, z);
          const denominator = evaluatePolynomial(convertedFeedback, z);
          const response = divide(numerator, denominator);
          magResponse[i] = Math.sqrt(response[0] * response[0] + response[1] * response[1]);
          phaseResponse[i] = Math.atan2(response[1], response[0]);
        }
      },
      removeEventListener(...args) {
        return scriptProcessorNode.removeEventListener(args[0], args[1], args[2]);
      }
    };
    return interceptConnections(nativeIIRFilterNodeFaker, scriptProcessorNode);
  };
};
const createNativeOfflineAudioContextConstructor = (window2) => {
  if (window2 === null) {
    return null;
  }
  if (window2.hasOwnProperty("OfflineAudioContext")) {
    return window2.OfflineAudioContext;
  }
  return window2.hasOwnProperty("webkitOfflineAudioContext") ? window2.webkitOfflineAudioContext : null;
};
const createNativeScriptProcessorNode = (nativeContext, bufferSize, numberOfInputChannels, numberOfOutputChannels) => {
  return nativeContext.createScriptProcessor(bufferSize, numberOfInputChannels, numberOfOutputChannels);
};
const createNotSupportedError = () => new DOMException("", "NotSupportedError");
const createRenderAutomation = (getAudioParamRenderer, renderInputsOfAudioParam2) => {
  return (nativeOfflineAudioContext, audioParam, nativeAudioParam) => {
    const audioParamRenderer = getAudioParamRenderer(audioParam);
    audioParamRenderer.replay(nativeAudioParam);
    return renderInputsOfAudioParam2(audioParam, nativeOfflineAudioContext, nativeAudioParam);
  };
};
const createRenderInputsOfAudioNode = (getAudioNodeConnections2, getAudioNodeRenderer2, isPartOfACycle2) => {
  return async (audioNode, nativeOfflineAudioContext, nativeAudioNode) => {
    const audioNodeConnections = getAudioNodeConnections2(audioNode);
    await Promise.all(audioNodeConnections.activeInputs.map((connections, input) => Array.from(connections).map(async ([source, output]) => {
      const audioNodeRenderer = getAudioNodeRenderer2(source);
      const renderedNativeAudioNode = await audioNodeRenderer.render(source, nativeOfflineAudioContext);
      const destination = audioNode.context.destination;
      if (!isPartOfACycle2(source) && (audioNode !== destination || !isPartOfACycle2(audioNode))) {
        renderedNativeAudioNode.connect(nativeAudioNode, output, input);
      }
    })).reduce((allRenderingPromises, renderingPromises) => [...allRenderingPromises, ...renderingPromises], []));
  };
};
const createRenderInputsOfAudioParam = (getAudioNodeRenderer2, getAudioParamConnections2, isPartOfACycle2) => {
  return async (audioParam, nativeOfflineAudioContext, nativeAudioParam) => {
    const audioParamConnections = getAudioParamConnections2(audioParam);
    await Promise.all(Array.from(audioParamConnections.activeInputs).map(async ([source, output]) => {
      const audioNodeRenderer = getAudioNodeRenderer2(source);
      const renderedNativeAudioNode = await audioNodeRenderer.render(source, nativeOfflineAudioContext);
      if (!isPartOfACycle2(source)) {
        renderedNativeAudioNode.connect(nativeAudioParam, output);
      }
    }));
  };
};
const createRenderNativeOfflineAudioContext = (cacheTestResult2, createNativeGainNode2, createNativeScriptProcessorNode2, testOfflineAudioContextCurrentTimeSupport) => {
  return (nativeOfflineAudioContext) => {
    if (cacheTestResult2(testPromiseSupport, () => testPromiseSupport(nativeOfflineAudioContext))) {
      return Promise.resolve(cacheTestResult2(testOfflineAudioContextCurrentTimeSupport, testOfflineAudioContextCurrentTimeSupport)).then((isOfflineAudioContextCurrentTimeSupported) => {
        if (!isOfflineAudioContextCurrentTimeSupported) {
          const scriptProcessorNode = createNativeScriptProcessorNode2(nativeOfflineAudioContext, 512, 0, 1);
          nativeOfflineAudioContext.oncomplete = () => {
            scriptProcessorNode.onaudioprocess = null;
            scriptProcessorNode.disconnect();
          };
          scriptProcessorNode.onaudioprocess = () => nativeOfflineAudioContext.currentTime;
          scriptProcessorNode.connect(nativeOfflineAudioContext.destination);
        }
        return nativeOfflineAudioContext.startRendering();
      });
    }
    return new Promise((resolve) => {
      const gainNode = createNativeGainNode2(nativeOfflineAudioContext, {
        channelCount: 1,
        channelCountMode: "explicit",
        channelInterpretation: "discrete",
        gain: 0
      });
      nativeOfflineAudioContext.oncomplete = (event) => {
        gainNode.disconnect();
        resolve(event.renderedBuffer);
      };
      gainNode.connect(nativeOfflineAudioContext.destination);
      nativeOfflineAudioContext.startRendering();
    });
  };
};
const createSetAudioNodeTailTime = (audioNodeTailTimeStore2) => {
  return (audioNode, tailTime) => audioNodeTailTimeStore2.set(audioNode, tailTime);
};
const createTestAudioBufferConstructorSupport = (nativeAudioBufferConstructor2) => {
  return () => {
    if (nativeAudioBufferConstructor2 === null) {
      return false;
    }
    try {
      new nativeAudioBufferConstructor2({ length: 1, sampleRate: 44100 });
    } catch (e) {
      return false;
    }
    return true;
  };
};
const createTestOfflineAudioContextCurrentTimeSupport = (createNativeGainNode2, nativeOfflineAudioContextConstructor2) => {
  return () => {
    if (nativeOfflineAudioContextConstructor2 === null) {
      return Promise.resolve(false);
    }
    const nativeOfflineAudioContext = new nativeOfflineAudioContextConstructor2(1, 1, 44100);
    const gainNode = createNativeGainNode2(nativeOfflineAudioContext, {
      channelCount: 1,
      channelCountMode: "explicit",
      channelInterpretation: "discrete",
      gain: 0
    });
    return new Promise((resolve) => {
      nativeOfflineAudioContext.oncomplete = () => {
        gainNode.disconnect();
        resolve(nativeOfflineAudioContext.currentTime !== 0);
      };
      nativeOfflineAudioContext.startRendering();
    });
  };
};
const createUnknownError = () => new DOMException("", "UnknownError");
const createWindow = () => typeof window === "undefined" ? null : window;
const createWrapAudioBufferCopyChannelMethods = (convertNumberToUnsignedLong2, createIndexSizeError2) => {
  return (audioBuffer) => {
    audioBuffer.copyFromChannel = (destination, channelNumberAsNumber, bufferOffsetAsNumber = 0) => {
      const bufferOffset = convertNumberToUnsignedLong2(bufferOffsetAsNumber);
      const channelNumber = convertNumberToUnsignedLong2(channelNumberAsNumber);
      if (channelNumber >= audioBuffer.numberOfChannels) {
        throw createIndexSizeError2();
      }
      const audioBufferLength = audioBuffer.length;
      const channelData = audioBuffer.getChannelData(channelNumber);
      const destinationLength = destination.length;
      for (let i = bufferOffset < 0 ? -bufferOffset : 0; i + bufferOffset < audioBufferLength && i < destinationLength; i += 1) {
        destination[i] = channelData[i + bufferOffset];
      }
    };
    audioBuffer.copyToChannel = (source, channelNumberAsNumber, bufferOffsetAsNumber = 0) => {
      const bufferOffset = convertNumberToUnsignedLong2(bufferOffsetAsNumber);
      const channelNumber = convertNumberToUnsignedLong2(channelNumberAsNumber);
      if (channelNumber >= audioBuffer.numberOfChannels) {
        throw createIndexSizeError2();
      }
      const audioBufferLength = audioBuffer.length;
      const channelData = audioBuffer.getChannelData(channelNumber);
      const sourceLength = source.length;
      for (let i = bufferOffset < 0 ? -bufferOffset : 0; i + bufferOffset < audioBufferLength && i < sourceLength; i += 1) {
        channelData[i + bufferOffset] = source[i];
      }
    };
  };
};
const createWrapAudioBufferCopyChannelMethodsOutOfBounds = (convertNumberToUnsignedLong2) => {
  return (audioBuffer) => {
    audioBuffer.copyFromChannel = ((copyFromChannel) => {
      return (destination, channelNumberAsNumber, bufferOffsetAsNumber = 0) => {
        const bufferOffset = convertNumberToUnsignedLong2(bufferOffsetAsNumber);
        const channelNumber = convertNumberToUnsignedLong2(channelNumberAsNumber);
        if (bufferOffset < audioBuffer.length) {
          return copyFromChannel.call(audioBuffer, destination, channelNumber, bufferOffset);
        }
      };
    })(audioBuffer.copyFromChannel);
    audioBuffer.copyToChannel = ((copyToChannel) => {
      return (source, channelNumberAsNumber, bufferOffsetAsNumber = 0) => {
        const bufferOffset = convertNumberToUnsignedLong2(bufferOffsetAsNumber);
        const channelNumber = convertNumberToUnsignedLong2(channelNumberAsNumber);
        if (bufferOffset < audioBuffer.length) {
          return copyToChannel.call(audioBuffer, source, channelNumber, bufferOffset);
        }
      };
    })(audioBuffer.copyToChannel);
  };
};
const createWrapAudioBufferSourceNodeStopMethodNullifiedBuffer = (overwriteAccessors2) => {
  return (nativeAudioBufferSourceNode, nativeContext) => {
    const nullifiedBuffer = nativeContext.createBuffer(1, 1, 44100);
    if (nativeAudioBufferSourceNode.buffer === null) {
      nativeAudioBufferSourceNode.buffer = nullifiedBuffer;
    }
    overwriteAccessors2(nativeAudioBufferSourceNode, "buffer", (get2) => () => {
      const value = get2.call(nativeAudioBufferSourceNode);
      return value === nullifiedBuffer ? null : value;
    }, (set2) => (value) => {
      return set2.call(nativeAudioBufferSourceNode, value === null ? nullifiedBuffer : value);
    });
  };
};
const createWrapChannelMergerNode = (createInvalidStateError2, monitorConnections2) => {
  return (nativeContext, channelMergerNode) => {
    channelMergerNode.channelCount = 1;
    channelMergerNode.channelCountMode = "explicit";
    Object.defineProperty(channelMergerNode, "channelCount", {
      get: () => 1,
      set: () => {
        throw createInvalidStateError2();
      }
    });
    Object.defineProperty(channelMergerNode, "channelCountMode", {
      get: () => "explicit",
      set: () => {
        throw createInvalidStateError2();
      }
    });
    const audioBufferSourceNode = nativeContext.createBufferSource();
    const whenConnected = () => {
      const length = channelMergerNode.numberOfInputs;
      for (let i = 0; i < length; i += 1) {
        audioBufferSourceNode.connect(channelMergerNode, 0, i);
      }
    };
    const whenDisconnected = () => audioBufferSourceNode.disconnect(channelMergerNode);
    monitorConnections2(channelMergerNode, whenConnected, whenDisconnected);
  };
};
const getFirstSample = (audioBuffer, buffer, channelNumber) => {
  if (audioBuffer.copyFromChannel === void 0) {
    return audioBuffer.getChannelData(channelNumber)[0];
  }
  audioBuffer.copyFromChannel(buffer, channelNumber);
  return buffer[0];
};
const overwriteAccessors = (object, property, createGetter, createSetter) => {
  let prototype = object;
  while (!prototype.hasOwnProperty(property)) {
    prototype = Object.getPrototypeOf(prototype);
  }
  const { get: get2, set: set2 } = Object.getOwnPropertyDescriptor(prototype, property);
  Object.defineProperty(object, property, { get: createGetter(get2), set: createSetter(set2) });
};
const setValueAtTimeUntilPossible = (audioParam, value, startTime) => {
  try {
    audioParam.setValueAtTime(value, startTime);
  } catch (err2) {
    if (err2.code !== 9) {
      throw err2;
    }
    setValueAtTimeUntilPossible(audioParam, value, startTime + 1e-7);
  }
};
const testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport = (nativeContext) => {
  const nativeAudioBufferSourceNode = nativeContext.createBufferSource();
  nativeAudioBufferSourceNode.start();
  try {
    nativeAudioBufferSourceNode.start();
  } catch (e) {
    return true;
  }
  return false;
};
const testAudioBufferSourceNodeStartMethodOffsetClampingSupport = (nativeContext) => {
  const nativeAudioBufferSourceNode = nativeContext.createBufferSource();
  const nativeAudioBuffer = nativeContext.createBuffer(1, 1, 44100);
  nativeAudioBufferSourceNode.buffer = nativeAudioBuffer;
  try {
    nativeAudioBufferSourceNode.start(0, 1);
  } catch (e) {
    return false;
  }
  return true;
};
const testAudioBufferSourceNodeStopMethodNullifiedBufferSupport = (nativeContext) => {
  const nativeAudioBufferSourceNode = nativeContext.createBufferSource();
  nativeAudioBufferSourceNode.start();
  try {
    nativeAudioBufferSourceNode.stop();
  } catch (e) {
    return false;
  }
  return true;
};
const testAudioScheduledSourceNodeStartMethodNegativeParametersSupport = (nativeContext) => {
  const nativeAudioBufferSourceNode = nativeContext.createOscillator();
  try {
    nativeAudioBufferSourceNode.start(-1);
  } catch (err2) {
    return err2 instanceof RangeError;
  }
  return false;
};
const testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport = (nativeContext) => {
  const nativeAudioBuffer = nativeContext.createBuffer(1, 1, 44100);
  const nativeAudioBufferSourceNode = nativeContext.createBufferSource();
  nativeAudioBufferSourceNode.buffer = nativeAudioBuffer;
  nativeAudioBufferSourceNode.start();
  nativeAudioBufferSourceNode.stop();
  try {
    nativeAudioBufferSourceNode.stop();
    return true;
  } catch (e) {
    return false;
  }
};
const testAudioScheduledSourceNodeStopMethodNegativeParametersSupport = (nativeContext) => {
  const nativeAudioBufferSourceNode = nativeContext.createOscillator();
  try {
    nativeAudioBufferSourceNode.stop(-1);
  } catch (err2) {
    return err2 instanceof RangeError;
  }
  return false;
};
const wrapAudioBufferSourceNodeStartMethodOffsetClamping = (nativeAudioBufferSourceNode) => {
  nativeAudioBufferSourceNode.start = ((start2) => {
    return (when = 0, offset2 = 0, duration) => {
      const buffer = nativeAudioBufferSourceNode.buffer;
      const clampedOffset = buffer === null ? offset2 : Math.min(buffer.duration, offset2);
      if (buffer !== null && clampedOffset > buffer.duration - 0.5 / nativeAudioBufferSourceNode.context.sampleRate) {
        start2.call(nativeAudioBufferSourceNode, when, 0, 0);
      } else {
        start2.call(nativeAudioBufferSourceNode, when, clampedOffset, duration);
      }
    };
  })(nativeAudioBufferSourceNode.start);
};
const wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls = (nativeAudioScheduledSourceNode, nativeContext) => {
  const nativeGainNode = nativeContext.createGain();
  nativeAudioScheduledSourceNode.connect(nativeGainNode);
  const disconnectGainNode = ((disconnect) => {
    return () => {
      disconnect.call(nativeAudioScheduledSourceNode, nativeGainNode);
      nativeAudioScheduledSourceNode.removeEventListener("ended", disconnectGainNode);
    };
  })(nativeAudioScheduledSourceNode.disconnect);
  nativeAudioScheduledSourceNode.addEventListener("ended", disconnectGainNode);
  interceptConnections(nativeAudioScheduledSourceNode, nativeGainNode);
  nativeAudioScheduledSourceNode.stop = ((stop) => {
    let isStopped = false;
    return (when = 0) => {
      if (isStopped) {
        try {
          stop.call(nativeAudioScheduledSourceNode, when);
        } catch (e) {
          nativeGainNode.gain.setValueAtTime(0, when);
        }
      } else {
        stop.call(nativeAudioScheduledSourceNode, when);
        isStopped = true;
      }
    };
  })(nativeAudioScheduledSourceNode.stop);
};
const wrapEventListener = (target, eventListener) => {
  return (event) => {
    const descriptor = { value: target };
    Object.defineProperties(event, {
      currentTarget: descriptor,
      target: descriptor
    });
    if (typeof eventListener === "function") {
      return eventListener.call(target, event);
    }
    return eventListener.handleEvent.call(target, event);
  };
};
const addActiveInputConnectionToAudioNode = createAddActiveInputConnectionToAudioNode(insertElementInSet);
const addPassiveInputConnectionToAudioNode = createAddPassiveInputConnectionToAudioNode(insertElementInSet);
const deleteActiveInputConnectionToAudioNode = createDeleteActiveInputConnectionToAudioNode(pickElementFromSet);
const audioNodeTailTimeStore = /* @__PURE__ */ new WeakMap();
const getAudioNodeTailTime = createGetAudioNodeTailTime(audioNodeTailTimeStore);
const cacheTestResult = createCacheTestResult(/* @__PURE__ */ new Map(), /* @__PURE__ */ new WeakMap());
const window$1 = createWindow();
const getAudioNodeRenderer = createGetAudioNodeRenderer(getAudioNodeConnections);
const renderInputsOfAudioNode = createRenderInputsOfAudioNode(getAudioNodeConnections, getAudioNodeRenderer, isPartOfACycle);
const getNativeContext = createGetNativeContext(CONTEXT_STORE);
const nativeOfflineAudioContextConstructor = createNativeOfflineAudioContextConstructor(window$1);
const isNativeOfflineAudioContext = createIsNativeOfflineAudioContext(nativeOfflineAudioContextConstructor);
const audioParamAudioNodeStore = /* @__PURE__ */ new WeakMap();
const eventTargetConstructor = createEventTargetConstructor(wrapEventListener);
const nativeAudioContextConstructor = createNativeAudioContextConstructor(window$1);
const isNativeAudioContext = createIsNativeAudioContext(nativeAudioContextConstructor);
const isNativeAudioNode = createIsNativeAudioNode(window$1);
const isNativeAudioParam = createIsNativeAudioParam(window$1);
const nativeAudioWorkletNodeConstructor = createNativeAudioWorkletNodeConstructor(window$1);
const audioNodeConstructor = createAudioNodeConstructor(createAddAudioNodeConnections(AUDIO_NODE_CONNECTIONS_STORE), createAddConnectionToAudioNode(addActiveInputConnectionToAudioNode, addPassiveInputConnectionToAudioNode, connectNativeAudioNodeToNativeAudioNode, deleteActiveInputConnectionToAudioNode, disconnectNativeAudioNodeFromNativeAudioNode, getAudioNodeConnections, getAudioNodeTailTime, getEventListenersOfAudioNode, getNativeAudioNode, insertElementInSet, isActiveAudioNode, isPartOfACycle, isPassiveAudioNode), cacheTestResult, createIncrementCycleCounterFactory(CYCLE_COUNTERS, disconnectNativeAudioNodeFromNativeAudioNode, getAudioNodeConnections, getNativeAudioNode, getNativeAudioParam, isActiveAudioNode), createIndexSizeError, createInvalidAccessError, createNotSupportedError, createDecrementCycleCounter(connectNativeAudioNodeToNativeAudioNode, CYCLE_COUNTERS, getAudioNodeConnections, getNativeAudioNode, getNativeAudioParam, getNativeContext, isActiveAudioNode, isNativeOfflineAudioContext), createDetectCycles(audioParamAudioNodeStore, getAudioNodeConnections, getValueForKey), eventTargetConstructor, getNativeContext, isNativeAudioContext, isNativeAudioNode, isNativeAudioParam, isNativeOfflineAudioContext, nativeAudioWorkletNodeConstructor);
const audioBufferStore = /* @__PURE__ */ new WeakSet();
const nativeAudioBufferConstructor = createNativeAudioBufferConstructor(window$1);
const convertNumberToUnsignedLong = createConvertNumberToUnsignedLong(new Uint32Array(1));
const wrapAudioBufferCopyChannelMethods = createWrapAudioBufferCopyChannelMethods(convertNumberToUnsignedLong, createIndexSizeError);
const wrapAudioBufferCopyChannelMethodsOutOfBounds = createWrapAudioBufferCopyChannelMethodsOutOfBounds(convertNumberToUnsignedLong);
const audioBufferConstructor = createAudioBufferConstructor(audioBufferStore, cacheTestResult, createNotSupportedError, nativeAudioBufferConstructor, nativeOfflineAudioContextConstructor, createTestAudioBufferConstructorSupport(nativeAudioBufferConstructor), wrapAudioBufferCopyChannelMethods, wrapAudioBufferCopyChannelMethodsOutOfBounds);
const addSilentConnection = createAddSilentConnection(createNativeGainNode);
const renderInputsOfAudioParam = createRenderInputsOfAudioParam(getAudioNodeRenderer, getAudioParamConnections, isPartOfACycle);
const connectAudioParam = createConnectAudioParam(renderInputsOfAudioParam);
const createNativeAudioBufferSourceNode = createNativeAudioBufferSourceNodeFactory(addSilentConnection, cacheTestResult, testAudioBufferSourceNodeStartMethodConsecutiveCallsSupport, testAudioBufferSourceNodeStartMethodOffsetClampingSupport, testAudioBufferSourceNodeStopMethodNullifiedBufferSupport, testAudioScheduledSourceNodeStartMethodNegativeParametersSupport, testAudioScheduledSourceNodeStopMethodConsecutiveCallsSupport, testAudioScheduledSourceNodeStopMethodNegativeParametersSupport, wrapAudioBufferSourceNodeStartMethodOffsetClamping, createWrapAudioBufferSourceNodeStopMethodNullifiedBuffer(overwriteAccessors), wrapAudioScheduledSourceNodeStopMethodConsecutiveCalls);
const renderAutomation = createRenderAutomation(createGetAudioParamRenderer(getAudioParamConnections), renderInputsOfAudioParam);
const createAudioBufferSourceNodeRenderer = createAudioBufferSourceNodeRendererFactory(connectAudioParam, createNativeAudioBufferSourceNode, getNativeAudioNode, renderAutomation, renderInputsOfAudioNode);
const createAudioParam = createAudioParamFactory(createAddAudioParamConnections(AUDIO_PARAM_CONNECTIONS_STORE), audioParamAudioNodeStore, AUDIO_PARAM_STORE, createAudioParamRenderer, createCancelAndHoldAutomationEvent, createCancelScheduledValuesAutomationEvent, createExponentialRampToValueAutomationEvent, createLinearRampToValueAutomationEvent, createSetTargetAutomationEvent, createSetValueAutomationEvent, createSetValueCurveAutomationEvent, nativeAudioContextConstructor, setValueAtTimeUntilPossible);
const audioBufferSourceNodeConstructor = createAudioBufferSourceNodeConstructor(audioNodeConstructor, createAudioBufferSourceNodeRenderer, createAudioParam, createInvalidStateError, createNativeAudioBufferSourceNode, getNativeContext, isNativeOfflineAudioContext, wrapEventListener);
const audioDestinationNodeConstructor = createAudioDestinationNodeConstructor(audioNodeConstructor, createAudioDestinationNodeRenderer, createIndexSizeError, createInvalidStateError, createNativeAudioDestinationNodeFactory(createNativeGainNode, overwriteAccessors), getNativeContext, isNativeOfflineAudioContext, renderInputsOfAudioNode);
const setAudioNodeTailTime = createSetAudioNodeTailTime(audioNodeTailTimeStore);
const monitorConnections = createMonitorConnections(insertElementInSet, isNativeAudioNode);
const wrapChannelMergerNode = createWrapChannelMergerNode(createInvalidStateError, monitorConnections);
const createNativeChannelMergerNode = createNativeChannelMergerNodeFactory(nativeAudioContextConstructor, wrapChannelMergerNode);
const createNativeConstantSourceNodeFaker = createNativeConstantSourceNodeFakerFactory(addSilentConnection, createNativeAudioBufferSourceNode, createNativeGainNode, monitorConnections);
const createNativeConstantSourceNode = createNativeConstantSourceNodeFactory(addSilentConnection, cacheTestResult, createNativeConstantSourceNodeFaker, testAudioScheduledSourceNodeStartMethodNegativeParametersSupport, testAudioScheduledSourceNodeStopMethodNegativeParametersSupport);
const createNativeConvolverNode = createNativeConvolverNodeFactory(createNotSupportedError, overwriteAccessors);
const createConvolverNodeRenderer = createConvolverNodeRendererFactory(createNativeConvolverNode, getNativeAudioNode, renderInputsOfAudioNode);
const convolverNodeConstructor = createConvolverNodeConstructor(audioNodeConstructor, createConvolverNodeRenderer, createNativeConvolverNode, getNativeContext, isNativeOfflineAudioContext, setAudioNodeTailTime);
const createGainNodeRenderer = createGainNodeRendererFactory(connectAudioParam, createNativeGainNode, getNativeAudioNode, renderAutomation, renderInputsOfAudioNode);
const gainNodeConstructor = createGainNodeConstructor(audioNodeConstructor, createAudioParam, createGainNodeRenderer, createNativeGainNode, getNativeContext, isNativeOfflineAudioContext);
const createNativeIIRFilterNodeFaker = createNativeIIRFilterNodeFakerFactory(createInvalidAccessError, createInvalidStateError, createNativeScriptProcessorNode, createNotSupportedError);
const renderNativeOfflineAudioContext = createRenderNativeOfflineAudioContext(cacheTestResult, createNativeGainNode, createNativeScriptProcessorNode, createTestOfflineAudioContextCurrentTimeSupport(createNativeGainNode, nativeOfflineAudioContextConstructor));
const createIIRFilterNodeRenderer = createIIRFilterNodeRendererFactory(createNativeAudioBufferSourceNode, getNativeAudioNode, nativeOfflineAudioContextConstructor, renderInputsOfAudioNode, renderNativeOfflineAudioContext);
const createNativeIIRFilterNode = createNativeIIRFilterNodeFactory(createNativeIIRFilterNodeFaker);
const iIRFilterNodeConstructor = createIIRFilterNodeConstructor(audioNodeConstructor, createNativeIIRFilterNode, createIIRFilterNodeRenderer, getNativeContext, isNativeOfflineAudioContext, setAudioNodeTailTime);
const createAudioListener = createAudioListenerFactory(createAudioParam, createNativeChannelMergerNode, createNativeConstantSourceNode, createNativeScriptProcessorNode, createNotSupportedError, getFirstSample, isNativeOfflineAudioContext, overwriteAccessors);
const unrenderedAudioWorkletNodeStore = /* @__PURE__ */ new WeakMap();
const minimalBaseAudioContextConstructor = createMinimalBaseAudioContextConstructor(audioDestinationNodeConstructor, createAudioListener, eventTargetConstructor, isNativeOfflineAudioContext, unrenderedAudioWorkletNodeStore, wrapEventListener);
createIsSecureContext(window$1);
const minimalAudioContextConstructor = createMinimalAudioContextConstructor(createInvalidStateError, createNotSupportedError, createUnknownError, minimalBaseAudioContextConstructor, nativeAudioContextConstructor);
class SpectrumAudio {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.playAmount = 0;
    this.playMovingAverage = [];
    this.playSampleLength = 1;
    this.audioQueue = [];
    this.demodulation = "USB";
    this.mute = false;
    this.squelchMute = false;
    this.squelch = false;
    this.squelchThreshold = 0;
    this.power = 1;
    const userGestureFunc = () => {
      if (this.audioCtx && this.audioCtx.state !== "running") {
        this.audioCtx.resume();
      }
      document.documentElement.removeEventListener("mousedown", userGestureFunc);
    };
    document.documentElement.addEventListener("mousedown", userGestureFunc);
    this.mode = 0;
    this.d = 10;
    this.v = 10;
    this.n2 = 10;
    this.n1 = 10;
    this.var = 10;
    this.highThres = 1;
    this.lastdebug = 0;
  }
  async init() {
    if (this.promise) {
      return this.promise;
    }
    this.audioProcessor = new AudioProcessor();
    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    this.audioSocket = new WebSocket(this.endpoint);
    this.audioSocket.binaryType = "arraybuffer";
    this.firstAudioMessage = true;
    this.audioSocket.onmessage = this.socketMessageInitial.bind(this);
    return this.promise;
  }
  stop() {
    this.audioSocket.close();
    this.decoder.destroy();
    if (this.resampler) {
      this.resampler.destroy();
    }
  }
  initAudio(settings2) {
    const sampleRate = this.audioOutputSps;
    try {
      this.audioCtx = new minimalAudioContextConstructor({
        sampleRate
      });
    } catch (e) {
      this.resolvePromise();
      return;
    }
    if (settings2.audio_compression === "flac") {
      this.decoder = createFlacDecoder();
    } else if (settings2.audio_compression === "opus") {
      this.decoder = createOpusDecoder(Math.min(this.trueAudioSps, 48e3));
    }
    this.audioStartTime = this.audioCtx.currentTime;
    this.playTime = this.audioCtx.currentTime + 0.1;
    this.playStartTime = this.audioCtx.currentTime;
    this.gainNode = new gainNodeConstructor(this.audioCtx);
    this.setGain(10);
    this.gainNode.connect(this.audioCtx.destination);
    this.convolverNode = new convolverNodeConstructor(this.audioCtx);
    this.setLowpass(15e3);
    this.convolverNode.connect(this.gainNode);
    this.audioInputNode = this.convolverNode;
    if (this.trueAudioSps > 96e3) {
      createResampler(this.trueAudioSps, 96e3).then((src2) => {
        this.resampler = src2;
        this.resolvePromise(settings2);
      });
    } else {
      this.resolvePromise(settings2);
    }
  }
  setFIRFilter(fir) {
    const firAudioBuffer = new audioBufferConstructor({ length: fir.length, numberOfChannels: 1, sampleRate: this.audioOutputSps });
    firAudioBuffer.copyToChannel(fir, 0, 0);
    this.convolverNode.buffer = firAudioBuffer;
  }
  setLowpass(lowpass) {
    const sampleRate = this.audioOutputSps;
    if (lowpass >= sampleRate / 2) {
      lowpass = sampleRate / 2;
    }
    const fir = LiquidDSP.FirDesKaiser(1e3 / sampleRate, lowpass / sampleRate, 60, 0);
    this.setFIRFilter(fir);
  }
  setFmDeemph(tau) {
    if (tau === 0) {
      this.audioInputNode = this.convolverNode;
      return;
    }
    const wc = 1 / tau;
    const fs = this.audioOutputSps;
    const wca = 2 * fs * Math.tan(wc / (2 * fs));
    const k = -wca / (2 * fs);
    const z1 = -1;
    const p1 = (1 + k) / (1 - k);
    const b0 = -k / (1 - k);
    const feedForwardTaps = [b0 * 1, b0 * -z1];
    const feedBackwardTaps = [1, -p1];
    this.fmDeemphNode = new iIRFilterNodeConstructor(this.audioCtx, { feedforward: feedForwardTaps, feedback: feedBackwardTaps });
    this.fmDeemphNode.connect(this.convolverNode);
    this.audioInputNode = this.fmDeemphNode;
  }
  socketMessageInitial(event) {
    const settings2 = JSON.parse(event.data);
    this.settings = settings2;
    this.fftSize = settings2.fft_size;
    this.audioMaxSize = settings2.fft_result_size;
    this.baseFreq = settings2.basefreq;
    this.totalBandwidth = settings2.total_bandwidth;
    this.sps = settings2.sps;
    this.audioOverlap = settings2.fft_overlap / 2;
    this.audioMaxSps = settings2.audio_max_sps;
    this.audioL = settings2.defaults.l;
    this.audioM = settings2.defaults.m;
    this.audioR = settings2.defaults.r;
    const targetFFTBins = Math.ceil(this.audioMaxSps * this.audioMaxSize / this.sps / 4) * 4;
    this.trueAudioSps = targetFFTBins / this.audioMaxSize * this.sps;
    this.audioOutputSps = Math.min(this.audioMaxSps, 96e3);
    this.audioSocket.onmessage = this.socketMessage.bind(this);
    this.initAudio(settings2);
    console.log("Audio Samplerate: ", this.trueAudioSps);
  }
  socketMessage(event) {
    if (event.data instanceof ArrayBuffer) {
      const floats = new Float64Array(event.data.slice(0, 3 * 8));
      const bytes = new Uint8Array(event.data);
      const receivedPower = floats[2];
      this.power = 0.5 * this.power + 0.5 * receivedPower || 1;
      const dBpower = 20 * Math.log10(Math.sqrt(this.power) / 2);
      this.dBPower = dBpower;
      if (this.squelch && dBpower < this.squelchThreshold) {
        this.squelchMute = true;
      } else {
        this.squelchMute = false;
      }
      if (!this.audioCtx)
        return;
      const encodedArray = bytes.subarray(3 * 8);
      this.decode(encodedArray);
    }
  }
  decode(encoded) {
    let sample = new Int16Array();
    try {
      sample = this.decoder.decode(encoded);
    } catch (err2) {
      return;
    }
    if (sample.length === 0) {
      return;
    }
    let pcmArray = new Float32Array(sample);
    pcmArray = pcmArray.map((x) => x / 65536);
    this.intervals = this.intervals || liveMovingAverage(1e4, 0);
    this.lens = this.lens || liveMovingAverage(1e4, 0);
    this.lastReceived = this.lastReceived || 0;
    if (this.lastReceived === 0) {
      this.lastReceived = performance.now();
    } else {
      const curReceived = performance.now();
      const delay = curReceived - this.lastReceived;
      this.intervals.push(delay);
      this.lastReceived = curReceived;
      this.lens.push(pcmArray.length);
      let updatedv = true;
      if (this.mode === 0) {
        if (Math.abs(delay - this.n1) > Math.abs(this.v) * 2 + 800) {
          this.var = 0;
          this.mode = 1;
        }
      } else {
        this.var = this.var / 2 + Math.abs((2 * delay - this.n1 - this.n2) / 8);
        if (this.var <= 63) {
          this.mode = 0;
          updatedv = false;
        }
      }
      if (updatedv) {
        if (this.mode === 0) {
          this.d = 0.125 * delay + 0.875 * this.d;
        } else {
          this.d = this.d + delay - this.n1;
        }
        this.v = 0.125 * Math.abs(delay - this.d) + 0.875 * this.v;
      }
      this.n2 = this.n1;
      this.n1 = delay;
    }
    this.pcmArray = pcmArray;
    if (this.signalDecoder) {
      this.signalDecoder.decode(pcmArray);
    }
    if (this.resampler) {
      pcmArray = this.resampler.resample(pcmArray);
    }
    pcmArray = this.audioProcessor.process(pcmArray);
    this.playAudio(pcmArray);
  }
  updateAudioParams() {
    this.audioSocket.send(JSON.stringify({
      cmd: "window",
      l: this.audioL,
      m: this.audioM,
      r: this.audioR
    }));
  }
  setAudioDemodulation(demodulation) {
    this.demodulation = demodulation;
    this.audioSocket.send(JSON.stringify({
      cmd: "demodulation",
      demodulation
    }));
  }
  setAudioRange(audioL, audioM, audioR) {
    this.audioL = audioL;
    this.audioM = audioM;
    this.audioR = audioR;
    this.updateAudioParams();
  }
  getAudioRange() {
    return [this.audioL, this.audioM, this.audioR];
  }
  setAudioOptions(options) {
    this.audioOptions = options;
    this.audioSocket.send(JSON.stringify({
      cmd: "options",
      options
    }));
  }
  setGain(gain) {
    this.gain = gain;
    this.gainNode.gain.value = gain;
  }
  setMute(mute) {
    if (mute === this.mute) {
      return;
    }
    this.mute = mute;
    this.audioSocket.send(JSON.stringify({
      cmd: "mute",
      mute
    }));
  }
  setSquelch(squelch) {
    this.squelch = squelch;
  }
  setSquelchThreshold(squelchThreshold) {
    this.squelchThreshold = squelchThreshold;
  }
  getPowerDb() {
    return this.dBPower;
  }
  setUserID(userID) {
    this.audioSocket.send(JSON.stringify({
      cmd: "userid",
      userid: userID
    }));
  }
  setSignalDecoder(decoder) {
    this.signalDecoder = decoder;
  }
  getSignalDecoder() {
    return this.signalDecoder;
  }
  playAudio(pcmArray) {
    if (this.mute || this.squelchMute && this.squelch) {
      return;
    }
    if (this.audioCtx.state !== "running") {
      return;
    }
    const curPlayTime = this.playPCM(pcmArray, this.playTime, this.audioOutputSps, 1);
    if (this.playTime - this.audioCtx.currentTime <= curPlayTime) {
      this.playTime = this.audioCtx.currentTime + (this.d + 4 * this.v) / 1e3;
      console.log("underrun");
    } else if (this.playTime - this.audioCtx.currentTime > 2) {
      this.playTime = this.audioCtx.currentTime + (this.d + 4 * this.v) / 1e3;
      console.log("overrun");
    }
  }
  playPCM(buffer, playTime, sampleRate, scale) {
    if (!this.audioInputNode) {
      return;
    }
    const source = new audioBufferSourceNodeConstructor(this.audioCtx);
    const audioBuffer = new audioBufferConstructor({ length: buffer.length, numberOfChannels: 1, sampleRate: this.audioOutputSps });
    audioBuffer.copyToChannel(buffer, 0, 0);
    source.buffer = audioBuffer;
    source.start(playTime);
    this.playTime += audioBuffer.duration;
    source.connect(this.audioInputNode);
    return audioBuffer.duration;
  }
}
var colorScale$1 = {
  "jet": [{ "index": 0, "rgb": [0, 0, 131] }, { "index": 0.125, "rgb": [0, 60, 170] }, { "index": 0.375, "rgb": [5, 255, 255] }, { "index": 0.625, "rgb": [255, 255, 0] }, { "index": 0.875, "rgb": [250, 0, 0] }, { "index": 1, "rgb": [128, 0, 0] }],
  "hsv": [{ "index": 0, "rgb": [255, 0, 0] }, { "index": 0.169, "rgb": [253, 255, 2] }, { "index": 0.173, "rgb": [247, 255, 2] }, { "index": 0.337, "rgb": [0, 252, 4] }, { "index": 0.341, "rgb": [0, 252, 10] }, { "index": 0.506, "rgb": [1, 249, 255] }, { "index": 0.671, "rgb": [2, 0, 253] }, { "index": 0.675, "rgb": [8, 0, 253] }, { "index": 0.839, "rgb": [255, 0, 251] }, { "index": 0.843, "rgb": [255, 0, 245] }, { "index": 1, "rgb": [255, 0, 6] }],
  "hot": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.3, "rgb": [230, 0, 0] }, { "index": 0.6, "rgb": [255, 210, 0] }, { "index": 1, "rgb": [255, 255, 255] }],
  "spring": [{ "index": 0, "rgb": [255, 0, 255] }, { "index": 1, "rgb": [255, 255, 0] }],
  "summer": [{ "index": 0, "rgb": [0, 128, 102] }, { "index": 1, "rgb": [255, 255, 102] }],
  "autumn": [{ "index": 0, "rgb": [255, 0, 0] }, { "index": 1, "rgb": [255, 255, 0] }],
  "winter": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 1, "rgb": [0, 255, 128] }],
  "bone": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.376, "rgb": [84, 84, 116] }, { "index": 0.753, "rgb": [169, 200, 200] }, { "index": 1, "rgb": [255, 255, 255] }],
  "copper": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.804, "rgb": [255, 160, 102] }, { "index": 1, "rgb": [255, 199, 127] }],
  "greys": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 1, "rgb": [255, 255, 255] }],
  "yignbu": [{ "index": 0, "rgb": [8, 29, 88] }, { "index": 0.125, "rgb": [37, 52, 148] }, { "index": 0.25, "rgb": [34, 94, 168] }, { "index": 0.375, "rgb": [29, 145, 192] }, { "index": 0.5, "rgb": [65, 182, 196] }, { "index": 0.625, "rgb": [127, 205, 187] }, { "index": 0.75, "rgb": [199, 233, 180] }, { "index": 0.875, "rgb": [237, 248, 217] }, { "index": 1, "rgb": [255, 255, 217] }],
  "greens": [{ "index": 0, "rgb": [0, 68, 27] }, { "index": 0.125, "rgb": [0, 109, 44] }, { "index": 0.25, "rgb": [35, 139, 69] }, { "index": 0.375, "rgb": [65, 171, 93] }, { "index": 0.5, "rgb": [116, 196, 118] }, { "index": 0.625, "rgb": [161, 217, 155] }, { "index": 0.75, "rgb": [199, 233, 192] }, { "index": 0.875, "rgb": [229, 245, 224] }, { "index": 1, "rgb": [247, 252, 245] }],
  "yiorrd": [{ "index": 0, "rgb": [128, 0, 38] }, { "index": 0.125, "rgb": [189, 0, 38] }, { "index": 0.25, "rgb": [227, 26, 28] }, { "index": 0.375, "rgb": [252, 78, 42] }, { "index": 0.5, "rgb": [253, 141, 60] }, { "index": 0.625, "rgb": [254, 178, 76] }, { "index": 0.75, "rgb": [254, 217, 118] }, { "index": 0.875, "rgb": [255, 237, 160] }, { "index": 1, "rgb": [255, 255, 204] }],
  "bluered": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 1, "rgb": [255, 0, 0] }],
  "rdbu": [{ "index": 0, "rgb": [5, 10, 172] }, { "index": 0.35, "rgb": [106, 137, 247] }, { "index": 0.5, "rgb": [190, 190, 190] }, { "index": 0.6, "rgb": [220, 170, 132] }, { "index": 0.7, "rgb": [230, 145, 90] }, { "index": 1, "rgb": [178, 10, 28] }],
  "picnic": [{ "index": 0, "rgb": [0, 0, 255] }, { "index": 0.1, "rgb": [51, 153, 255] }, { "index": 0.2, "rgb": [102, 204, 255] }, { "index": 0.3, "rgb": [153, 204, 255] }, { "index": 0.4, "rgb": [204, 204, 255] }, { "index": 0.5, "rgb": [255, 255, 255] }, { "index": 0.6, "rgb": [255, 204, 255] }, { "index": 0.7, "rgb": [255, 153, 255] }, { "index": 0.8, "rgb": [255, 102, 204] }, { "index": 0.9, "rgb": [255, 102, 102] }, { "index": 1, "rgb": [255, 0, 0] }],
  "rainbow": [{ "index": 0, "rgb": [150, 0, 90] }, { "index": 0.125, "rgb": [0, 0, 200] }, { "index": 0.25, "rgb": [0, 25, 255] }, { "index": 0.375, "rgb": [0, 152, 255] }, { "index": 0.5, "rgb": [44, 255, 150] }, { "index": 0.625, "rgb": [151, 255, 0] }, { "index": 0.75, "rgb": [255, 234, 0] }, { "index": 0.875, "rgb": [255, 111, 0] }, { "index": 1, "rgb": [255, 0, 0] }],
  "portland": [{ "index": 0, "rgb": [12, 51, 131] }, { "index": 0.25, "rgb": [10, 136, 186] }, { "index": 0.5, "rgb": [242, 211, 56] }, { "index": 0.75, "rgb": [242, 143, 56] }, { "index": 1, "rgb": [217, 30, 30] }],
  "blackbody": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.2, "rgb": [230, 0, 0] }, { "index": 0.4, "rgb": [230, 210, 0] }, { "index": 0.7, "rgb": [255, 255, 255] }, { "index": 1, "rgb": [160, 200, 255] }],
  "earth": [{ "index": 0, "rgb": [0, 0, 130] }, { "index": 0.1, "rgb": [0, 180, 180] }, { "index": 0.2, "rgb": [40, 210, 40] }, { "index": 0.4, "rgb": [230, 230, 50] }, { "index": 0.6, "rgb": [120, 70, 20] }, { "index": 1, "rgb": [255, 255, 255] }],
  "electric": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.15, "rgb": [30, 0, 100] }, { "index": 0.4, "rgb": [120, 0, 100] }, { "index": 0.6, "rgb": [160, 90, 0] }, { "index": 0.8, "rgb": [230, 200, 0] }, { "index": 1, "rgb": [255, 250, 220] }],
  "alpha": [{ "index": 0, "rgb": [255, 255, 255, 0] }, { "index": 1, "rgb": [255, 255, 255, 1] }],
  "viridis": [{ "index": 0, "rgb": [68, 1, 84] }, { "index": 0.13, "rgb": [71, 44, 122] }, { "index": 0.25, "rgb": [59, 81, 139] }, { "index": 0.38, "rgb": [44, 113, 142] }, { "index": 0.5, "rgb": [33, 144, 141] }, { "index": 0.63, "rgb": [39, 173, 129] }, { "index": 0.75, "rgb": [92, 200, 99] }, { "index": 0.88, "rgb": [170, 220, 50] }, { "index": 1, "rgb": [253, 231, 37] }],
  "inferno": [{ "index": 0, "rgb": [0, 0, 4] }, { "index": 0.13, "rgb": [31, 12, 72] }, { "index": 0.25, "rgb": [85, 15, 109] }, { "index": 0.38, "rgb": [136, 34, 106] }, { "index": 0.5, "rgb": [186, 54, 85] }, { "index": 0.63, "rgb": [227, 89, 51] }, { "index": 0.75, "rgb": [249, 140, 10] }, { "index": 0.88, "rgb": [249, 201, 50] }, { "index": 1, "rgb": [252, 255, 164] }],
  "magma": [{ "index": 0, "rgb": [0, 0, 4] }, { "index": 0.13, "rgb": [28, 16, 68] }, { "index": 0.25, "rgb": [79, 18, 123] }, { "index": 0.38, "rgb": [129, 37, 129] }, { "index": 0.5, "rgb": [181, 54, 122] }, { "index": 0.63, "rgb": [229, 80, 100] }, { "index": 0.75, "rgb": [251, 135, 97] }, { "index": 0.88, "rgb": [254, 194, 135] }, { "index": 1, "rgb": [252, 253, 191] }],
  "plasma": [{ "index": 0, "rgb": [13, 8, 135] }, { "index": 0.13, "rgb": [75, 3, 161] }, { "index": 0.25, "rgb": [125, 3, 168] }, { "index": 0.38, "rgb": [168, 34, 150] }, { "index": 0.5, "rgb": [203, 70, 121] }, { "index": 0.63, "rgb": [229, 107, 93] }, { "index": 0.75, "rgb": [248, 148, 65] }, { "index": 0.88, "rgb": [253, 195, 40] }, { "index": 1, "rgb": [240, 249, 33] }],
  "warm": [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.13, "rgb": [172, 0, 187] }, { "index": 0.25, "rgb": [219, 0, 170] }, { "index": 0.38, "rgb": [255, 0, 130] }, { "index": 0.5, "rgb": [255, 63, 74] }, { "index": 0.63, "rgb": [255, 123, 0] }, { "index": 0.75, "rgb": [234, 176, 0] }, { "index": 0.88, "rgb": [190, 228, 0] }, { "index": 1, "rgb": [147, 255, 0] }],
  "cool": [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.13, "rgb": [116, 0, 218] }, { "index": 0.25, "rgb": [98, 74, 237] }, { "index": 0.38, "rgb": [68, 146, 231] }, { "index": 0.5, "rgb": [0, 204, 197] }, { "index": 0.63, "rgb": [0, 247, 146] }, { "index": 0.75, "rgb": [0, 255, 88] }, { "index": 0.88, "rgb": [40, 255, 8] }, { "index": 1, "rgb": [147, 255, 0] }],
  "rainbow-soft": [{ "index": 0, "rgb": [125, 0, 179] }, { "index": 0.1, "rgb": [199, 0, 180] }, { "index": 0.2, "rgb": [255, 0, 121] }, { "index": 0.3, "rgb": [255, 108, 0] }, { "index": 0.4, "rgb": [222, 194, 0] }, { "index": 0.5, "rgb": [150, 255, 0] }, { "index": 0.6, "rgb": [0, 255, 55] }, { "index": 0.7, "rgb": [0, 246, 150] }, { "index": 0.8, "rgb": [50, 167, 222] }, { "index": 0.9, "rgb": [103, 51, 235] }, { "index": 1, "rgb": [124, 0, 186] }],
  "bathymetry": [{ "index": 0, "rgb": [40, 26, 44] }, { "index": 0.13, "rgb": [59, 49, 90] }, { "index": 0.25, "rgb": [64, 76, 139] }, { "index": 0.38, "rgb": [63, 110, 151] }, { "index": 0.5, "rgb": [72, 142, 158] }, { "index": 0.63, "rgb": [85, 174, 163] }, { "index": 0.75, "rgb": [120, 206, 163] }, { "index": 0.88, "rgb": [187, 230, 172] }, { "index": 1, "rgb": [253, 254, 204] }],
  "cdom": [{ "index": 0, "rgb": [47, 15, 62] }, { "index": 0.13, "rgb": [87, 23, 86] }, { "index": 0.25, "rgb": [130, 28, 99] }, { "index": 0.38, "rgb": [171, 41, 96] }, { "index": 0.5, "rgb": [206, 67, 86] }, { "index": 0.63, "rgb": [230, 106, 84] }, { "index": 0.75, "rgb": [242, 149, 103] }, { "index": 0.88, "rgb": [249, 193, 135] }, { "index": 1, "rgb": [254, 237, 176] }],
  "chlorophyll": [{ "index": 0, "rgb": [18, 36, 20] }, { "index": 0.13, "rgb": [25, 63, 41] }, { "index": 0.25, "rgb": [24, 91, 59] }, { "index": 0.38, "rgb": [13, 119, 72] }, { "index": 0.5, "rgb": [18, 148, 80] }, { "index": 0.63, "rgb": [80, 173, 89] }, { "index": 0.75, "rgb": [132, 196, 122] }, { "index": 0.88, "rgb": [175, 221, 162] }, { "index": 1, "rgb": [215, 249, 208] }],
  "density": [{ "index": 0, "rgb": [54, 14, 36] }, { "index": 0.13, "rgb": [89, 23, 80] }, { "index": 0.25, "rgb": [110, 45, 132] }, { "index": 0.38, "rgb": [120, 77, 178] }, { "index": 0.5, "rgb": [120, 113, 213] }, { "index": 0.63, "rgb": [115, 151, 228] }, { "index": 0.75, "rgb": [134, 185, 227] }, { "index": 0.88, "rgb": [177, 214, 227] }, { "index": 1, "rgb": [230, 241, 241] }],
  "freesurface-blue": [{ "index": 0, "rgb": [30, 4, 110] }, { "index": 0.13, "rgb": [47, 14, 176] }, { "index": 0.25, "rgb": [41, 45, 236] }, { "index": 0.38, "rgb": [25, 99, 212] }, { "index": 0.5, "rgb": [68, 131, 200] }, { "index": 0.63, "rgb": [114, 156, 197] }, { "index": 0.75, "rgb": [157, 181, 203] }, { "index": 0.88, "rgb": [200, 208, 216] }, { "index": 1, "rgb": [241, 237, 236] }],
  "freesurface-red": [{ "index": 0, "rgb": [60, 9, 18] }, { "index": 0.13, "rgb": [100, 17, 27] }, { "index": 0.25, "rgb": [142, 20, 29] }, { "index": 0.38, "rgb": [177, 43, 27] }, { "index": 0.5, "rgb": [192, 87, 63] }, { "index": 0.63, "rgb": [205, 125, 105] }, { "index": 0.75, "rgb": [216, 162, 148] }, { "index": 0.88, "rgb": [227, 199, 193] }, { "index": 1, "rgb": [241, 237, 236] }],
  "oxygen": [{ "index": 0, "rgb": [64, 5, 5] }, { "index": 0.13, "rgb": [106, 6, 15] }, { "index": 0.25, "rgb": [144, 26, 7] }, { "index": 0.38, "rgb": [168, 64, 3] }, { "index": 0.5, "rgb": [188, 100, 4] }, { "index": 0.63, "rgb": [206, 136, 11] }, { "index": 0.75, "rgb": [220, 174, 25] }, { "index": 0.88, "rgb": [231, 215, 44] }, { "index": 1, "rgb": [248, 254, 105] }],
  "par": [{ "index": 0, "rgb": [51, 20, 24] }, { "index": 0.13, "rgb": [90, 32, 35] }, { "index": 0.25, "rgb": [129, 44, 34] }, { "index": 0.38, "rgb": [159, 68, 25] }, { "index": 0.5, "rgb": [182, 99, 19] }, { "index": 0.63, "rgb": [199, 134, 22] }, { "index": 0.75, "rgb": [212, 171, 35] }, { "index": 0.88, "rgb": [221, 210, 54] }, { "index": 1, "rgb": [225, 253, 75] }],
  "phase": [{ "index": 0, "rgb": [145, 105, 18] }, { "index": 0.13, "rgb": [184, 71, 38] }, { "index": 0.25, "rgb": [186, 58, 115] }, { "index": 0.38, "rgb": [160, 71, 185] }, { "index": 0.5, "rgb": [110, 97, 218] }, { "index": 0.63, "rgb": [50, 123, 164] }, { "index": 0.75, "rgb": [31, 131, 110] }, { "index": 0.88, "rgb": [77, 129, 34] }, { "index": 1, "rgb": [145, 105, 18] }],
  "salinity": [{ "index": 0, "rgb": [42, 24, 108] }, { "index": 0.13, "rgb": [33, 50, 162] }, { "index": 0.25, "rgb": [15, 90, 145] }, { "index": 0.38, "rgb": [40, 118, 137] }, { "index": 0.5, "rgb": [59, 146, 135] }, { "index": 0.63, "rgb": [79, 175, 126] }, { "index": 0.75, "rgb": [120, 203, 104] }, { "index": 0.88, "rgb": [193, 221, 100] }, { "index": 1, "rgb": [253, 239, 154] }],
  "temperature": [{ "index": 0, "rgb": [4, 35, 51] }, { "index": 0.13, "rgb": [23, 51, 122] }, { "index": 0.25, "rgb": [85, 59, 157] }, { "index": 0.38, "rgb": [129, 79, 143] }, { "index": 0.5, "rgb": [175, 95, 130] }, { "index": 0.63, "rgb": [222, 112, 101] }, { "index": 0.75, "rgb": [249, 146, 66] }, { "index": 0.88, "rgb": [249, 196, 65] }, { "index": 1, "rgb": [232, 250, 91] }],
  "turbidity": [{ "index": 0, "rgb": [34, 31, 27] }, { "index": 0.13, "rgb": [65, 50, 41] }, { "index": 0.25, "rgb": [98, 69, 52] }, { "index": 0.38, "rgb": [131, 89, 57] }, { "index": 0.5, "rgb": [161, 112, 59] }, { "index": 0.63, "rgb": [185, 140, 66] }, { "index": 0.75, "rgb": [202, 174, 88] }, { "index": 0.88, "rgb": [216, 209, 126] }, { "index": 1, "rgb": [233, 246, 171] }],
  "velocity-blue": [{ "index": 0, "rgb": [17, 32, 64] }, { "index": 0.13, "rgb": [35, 52, 116] }, { "index": 0.25, "rgb": [29, 81, 156] }, { "index": 0.38, "rgb": [31, 113, 162] }, { "index": 0.5, "rgb": [50, 144, 169] }, { "index": 0.63, "rgb": [87, 173, 176] }, { "index": 0.75, "rgb": [149, 196, 189] }, { "index": 0.88, "rgb": [203, 221, 211] }, { "index": 1, "rgb": [254, 251, 230] }],
  "velocity-green": [{ "index": 0, "rgb": [23, 35, 19] }, { "index": 0.13, "rgb": [24, 64, 38] }, { "index": 0.25, "rgb": [11, 95, 45] }, { "index": 0.38, "rgb": [39, 123, 35] }, { "index": 0.5, "rgb": [95, 146, 12] }, { "index": 0.63, "rgb": [152, 165, 18] }, { "index": 0.75, "rgb": [201, 186, 69] }, { "index": 0.88, "rgb": [233, 216, 137] }, { "index": 1, "rgb": [255, 253, 205] }],
  "cubehelix": [{ "index": 0, "rgb": [0, 0, 0] }, { "index": 0.07, "rgb": [22, 5, 59] }, { "index": 0.13, "rgb": [60, 4, 105] }, { "index": 0.2, "rgb": [109, 1, 135] }, { "index": 0.27, "rgb": [161, 0, 147] }, { "index": 0.33, "rgb": [210, 2, 142] }, { "index": 0.4, "rgb": [251, 11, 123] }, { "index": 0.47, "rgb": [255, 29, 97] }, { "index": 0.53, "rgb": [255, 54, 69] }, { "index": 0.6, "rgb": [255, 85, 46] }, { "index": 0.67, "rgb": [255, 120, 34] }, { "index": 0.73, "rgb": [255, 157, 37] }, { "index": 0.8, "rgb": [241, 191, 57] }, { "index": 0.87, "rgb": [224, 220, 93] }, { "index": 0.93, "rgb": [218, 241, 142] }, { "index": 1, "rgb": [227, 253, 198] }]
};
function lerp$1(v0, v1, t) {
  return v0 * (1 - t) + v1 * t;
}
var lerp_1 = lerp$1;
var colorScale = colorScale$1;
var lerp = lerp_1;
var colormap = createColormap;
function createColormap(spec) {
  var indicies, fromrgba, torgba, nsteps, cmap, colormap2, format2, nshades, colors, alpha, i;
  if (!spec)
    spec = {};
  nshades = (spec.nshades || 72) - 1;
  format2 = spec.format || "hex";
  colormap2 = spec.colormap;
  if (!colormap2)
    colormap2 = "jet";
  if (typeof colormap2 === "string") {
    colormap2 = colormap2.toLowerCase();
    if (!colorScale[colormap2]) {
      throw Error(colormap2 + " not a supported colorscale");
    }
    cmap = colorScale[colormap2];
  } else if (Array.isArray(colormap2)) {
    cmap = colormap2.slice();
  } else {
    throw Error("unsupported colormap option", colormap2);
  }
  if (cmap.length > nshades + 1) {
    throw new Error(
      colormap2 + " map requires nshades to be at least size " + cmap.length
    );
  }
  if (!Array.isArray(spec.alpha)) {
    if (typeof spec.alpha === "number") {
      alpha = [spec.alpha, spec.alpha];
    } else {
      alpha = [1, 1];
    }
  } else if (spec.alpha.length !== 2) {
    alpha = [1, 1];
  } else {
    alpha = spec.alpha.slice();
  }
  indicies = cmap.map(function(c) {
    return Math.round(c.index * nshades);
  });
  alpha[0] = Math.min(Math.max(alpha[0], 0), 1);
  alpha[1] = Math.min(Math.max(alpha[1], 0), 1);
  var steps = cmap.map(function(c, i2) {
    var index = cmap[i2].index;
    var rgba = cmap[i2].rgb.slice();
    if (rgba.length === 4 && rgba[3] >= 0 && rgba[3] <= 1) {
      return rgba;
    }
    rgba[3] = alpha[0] + (alpha[1] - alpha[0]) * index;
    return rgba;
  });
  var colors = [];
  for (i = 0; i < indicies.length - 1; ++i) {
    nsteps = indicies[i + 1] - indicies[i];
    fromrgba = steps[i];
    torgba = steps[i + 1];
    for (var j = 0; j < nsteps; j++) {
      var amt = j / nsteps;
      colors.push([
        Math.round(lerp(fromrgba[0], torgba[0], amt)),
        Math.round(lerp(fromrgba[1], torgba[1], amt)),
        Math.round(lerp(fromrgba[2], torgba[2], amt)),
        lerp(fromrgba[3], torgba[3], amt)
      ]);
    }
  }
  colors.push(cmap[cmap.length - 1].rgb.concat(alpha[1]));
  if (format2 === "hex")
    colors = colors.map(rgb2hex);
  else if (format2 === "rgbaString")
    colors = colors.map(rgbaStr);
  else if (format2 === "float")
    colors = colors.map(rgb2float);
  return colors;
}
function rgb2float(rgba) {
  return [
    rgba[0] / 255,
    rgba[1] / 255,
    rgba[2] / 255,
    rgba[3]
  ];
}
function rgb2hex(rgba) {
  var dig, hex = "#";
  for (var i = 0; i < 3; ++i) {
    dig = rgba[i];
    dig = dig.toString(16);
    hex += ("00" + dig).substr(dig.length);
  }
  return hex;
}
function rgbaStr(rgba) {
  return "rgba(" + rgba.join(",") + ")";
}
const turboColormap = [
  [0.18995, 0.07176, 0.23217],
  [0.19483, 0.08339, 0.26149],
  [0.19956, 0.09498, 0.29024],
  [0.20415, 0.10652, 0.31844],
  [0.2086, 0.11802, 0.34607],
  [0.21291, 0.12947, 0.37314],
  [0.21708, 0.14087, 0.39964],
  [0.22111, 0.15223, 0.42558],
  [0.225, 0.16354, 0.45096],
  [0.22875, 0.17481, 0.47578],
  [0.23236, 0.18603, 0.50004],
  [0.23582, 0.1972, 0.52373],
  [0.23915, 0.20833, 0.54686],
  [0.24234, 0.21941, 0.56942],
  [0.24539, 0.23044, 0.59142],
  [0.2483, 0.24143, 0.61286],
  [0.25107, 0.25237, 0.63374],
  [0.25369, 0.26327, 0.65406],
  [0.25618, 0.27412, 0.67381],
  [0.25853, 0.28492, 0.693],
  [0.26074, 0.29568, 0.71162],
  [0.2628, 0.30639, 0.72968],
  [0.26473, 0.31706, 0.74718],
  [0.26652, 0.32768, 0.76412],
  [0.26816, 0.33825, 0.7805],
  [0.26967, 0.34878, 0.79631],
  [0.27103, 0.35926, 0.81156],
  [0.27226, 0.3697, 0.82624],
  [0.27334, 0.38008, 0.84037],
  [0.27429, 0.39043, 0.85393],
  [0.27509, 0.40072, 0.86692],
  [0.27576, 0.41097, 0.87936],
  [0.27628, 0.42118, 0.89123],
  [0.27667, 0.43134, 0.90254],
  [0.27691, 0.44145, 0.91328],
  [0.27701, 0.45152, 0.92347],
  [0.27698, 0.46153, 0.93309],
  [0.2768, 0.47151, 0.94214],
  [0.27648, 0.48144, 0.95064],
  [0.27603, 0.49132, 0.95857],
  [0.27543, 0.50115, 0.96594],
  [0.27469, 0.51094, 0.97275],
  [0.27381, 0.52069, 0.97899],
  [0.27273, 0.5304, 0.98461],
  [0.27106, 0.54015, 0.9893],
  [0.26878, 0.54995, 0.99303],
  [0.26592, 0.55979, 0.99583],
  [0.26252, 0.56967, 0.99773],
  [0.25862, 0.57958, 0.99876],
  [0.25425, 0.5895, 0.99896],
  [0.24946, 0.59943, 0.99835],
  [0.24427, 0.60937, 0.99697],
  [0.23874, 0.61931, 0.99485],
  [0.23288, 0.62923, 0.99202],
  [0.22676, 0.63913, 0.98851],
  [0.22039, 0.64901, 0.98436],
  [0.21382, 0.65886, 0.97959],
  [0.20708, 0.66866, 0.97423],
  [0.20021, 0.67842, 0.96833],
  [0.19326, 0.68812, 0.9619],
  [0.18625, 0.69775, 0.95498],
  [0.17923, 0.70732, 0.94761],
  [0.17223, 0.7168, 0.93981],
  [0.16529, 0.7262, 0.93161],
  [0.15844, 0.73551, 0.92305],
  [0.15173, 0.74472, 0.91416],
  [0.14519, 0.75381, 0.90496],
  [0.13886, 0.76279, 0.8955],
  [0.13278, 0.77165, 0.8858],
  [0.12698, 0.78037, 0.8759],
  [0.12151, 0.78896, 0.86581],
  [0.11639, 0.7974, 0.85559],
  [0.11167, 0.80569, 0.84525],
  [0.10738, 0.81381, 0.83484],
  [0.10357, 0.82177, 0.82437],
  [0.10026, 0.82955, 0.81389],
  [0.0975, 0.83714, 0.80342],
  [0.09532, 0.84455, 0.79299],
  [0.09377, 0.85175, 0.78264],
  [0.09287, 0.85875, 0.7724],
  [0.09267, 0.86554, 0.7623],
  [0.0932, 0.87211, 0.75237],
  [0.09451, 0.87844, 0.74265],
  [0.09662, 0.88454, 0.73316],
  [0.09958, 0.8904, 0.72393],
  [0.10342, 0.896, 0.715],
  [0.10815, 0.90142, 0.70599],
  [0.11374, 0.90673, 0.69651],
  [0.12014, 0.91193, 0.6866],
  [0.12733, 0.91701, 0.67627],
  [0.13526, 0.92197, 0.66556],
  [0.14391, 0.9268, 0.65448],
  [0.15323, 0.93151, 0.64308],
  [0.16319, 0.93609, 0.63137],
  [0.17377, 0.94053, 0.61938],
  [0.18491, 0.94484, 0.60713],
  [0.19659, 0.94901, 0.59466],
  [0.20877, 0.95304, 0.58199],
  [0.22142, 0.95692, 0.56914],
  [0.23449, 0.96065, 0.55614],
  [0.24797, 0.96423, 0.54303],
  [0.2618, 0.96765, 0.52981],
  [0.27597, 0.97092, 0.51653],
  [0.29042, 0.97403, 0.50321],
  [0.30513, 0.97697, 0.48987],
  [0.32006, 0.97974, 0.47654],
  [0.33517, 0.98234, 0.46325],
  [0.35043, 0.98477, 0.45002],
  [0.36581, 0.98702, 0.43688],
  [0.38127, 0.98909, 0.42386],
  [0.39678, 0.99098, 0.41098],
  [0.41229, 0.99268, 0.39826],
  [0.42778, 0.99419, 0.38575],
  [0.44321, 0.99551, 0.37345],
  [0.45854, 0.99663, 0.3614],
  [0.47375, 0.99755, 0.34963],
  [0.48879, 0.99828, 0.33816],
  [0.50362, 0.99879, 0.32701],
  [0.51822, 0.9991, 0.31622],
  [0.53255, 0.99919, 0.30581],
  [0.54658, 0.99907, 0.29581],
  [0.56026, 0.99873, 0.28623],
  [0.57357, 0.99817, 0.27712],
  [0.58646, 0.99739, 0.26849],
  [0.59891, 0.99638, 0.26038],
  [0.61088, 0.99514, 0.2528],
  [0.62233, 0.99366, 0.24579],
  [0.63323, 0.99195, 0.23937],
  [0.64362, 0.98999, 0.23356],
  [0.65394, 0.98775, 0.22835],
  [0.66428, 0.98524, 0.2237],
  [0.67462, 0.98246, 0.2196],
  [0.68494, 0.97941, 0.21602],
  [0.69525, 0.9761, 0.21294],
  [0.70553, 0.97255, 0.21032],
  [0.71577, 0.96875, 0.20815],
  [0.72596, 0.9647, 0.2064],
  [0.7361, 0.96043, 0.20504],
  [0.74617, 0.95593, 0.20406],
  [0.75617, 0.95121, 0.20343],
  [0.76608, 0.94627, 0.20311],
  [0.77591, 0.94113, 0.2031],
  [0.78563, 0.93579, 0.20336],
  [0.79524, 0.93025, 0.20386],
  [0.80473, 0.92452, 0.20459],
  [0.8141, 0.91861, 0.20552],
  [0.82333, 0.91253, 0.20663],
  [0.83241, 0.90627, 0.20788],
  [0.84133, 0.89986, 0.20926],
  [0.8501, 0.89328, 0.21074],
  [0.85868, 0.88655, 0.2123],
  [0.86709, 0.87968, 0.21391],
  [0.8753, 0.87267, 0.21555],
  [0.88331, 0.86553, 0.21719],
  [0.89112, 0.85826, 0.2188],
  [0.8987, 0.85087, 0.22038],
  [0.90605, 0.84337, 0.22188],
  [0.91317, 0.83576, 0.22328],
  [0.92004, 0.82806, 0.22456],
  [0.92666, 0.82025, 0.2257],
  [0.93301, 0.81236, 0.22667],
  [0.93909, 0.80439, 0.22744],
  [0.94489, 0.79634, 0.228],
  [0.95039, 0.78823, 0.22831],
  [0.9556, 0.78005, 0.22836],
  [0.96049, 0.77181, 0.22811],
  [0.96507, 0.76352, 0.22754],
  [0.96931, 0.75519, 0.22663],
  [0.97323, 0.74682, 0.22536],
  [0.97679, 0.73842, 0.22369],
  [0.98, 0.73, 0.22161],
  [0.98289, 0.7214, 0.21918],
  [0.98549, 0.7125, 0.2165],
  [0.98781, 0.7033, 0.21358],
  [0.98986, 0.69382, 0.21043],
  [0.99163, 0.68408, 0.20706],
  [0.99314, 0.67408, 0.20348],
  [0.99438, 0.66386, 0.19971],
  [0.99535, 0.65341, 0.19577],
  [0.99607, 0.64277, 0.19165],
  [0.99654, 0.63193, 0.18738],
  [0.99675, 0.62093, 0.18297],
  [0.99672, 0.60977, 0.17842],
  [0.99644, 0.59846, 0.17376],
  [0.99593, 0.58703, 0.16899],
  [0.99517, 0.57549, 0.16412],
  [0.99419, 0.56386, 0.15918],
  [0.99297, 0.55214, 0.15417],
  [0.99153, 0.54036, 0.1491],
  [0.98987, 0.52854, 0.14398],
  [0.98799, 0.51667, 0.13883],
  [0.9859, 0.50479, 0.13367],
  [0.9836, 0.49291, 0.12849],
  [0.98108, 0.48104, 0.12332],
  [0.97837, 0.4692, 0.11817],
  [0.97545, 0.4574, 0.11305],
  [0.97234, 0.44565, 0.10797],
  [0.96904, 0.43399, 0.10294],
  [0.96555, 0.42241, 0.09798],
  [0.96187, 0.41093, 0.0931],
  [0.95801, 0.39958, 0.08831],
  [0.95398, 0.38836, 0.08362],
  [0.94977, 0.37729, 0.07905],
  [0.94538, 0.36638, 0.07461],
  [0.94084, 0.35566, 0.07031],
  [0.93612, 0.34513, 0.06616],
  [0.93125, 0.33482, 0.06218],
  [0.92623, 0.32473, 0.05837],
  [0.92105, 0.31489, 0.05475],
  [0.91572, 0.3053, 0.05134],
  [0.91024, 0.29599, 0.04814],
  [0.90463, 0.28696, 0.04516],
  [0.89888, 0.27824, 0.04243],
  [0.89298, 0.26981, 0.03993],
  [0.88691, 0.26152, 0.03753],
  [0.88066, 0.25334, 0.03521],
  [0.87422, 0.24526, 0.03297],
  [0.8676, 0.2373, 0.03082],
  [0.86079, 0.22945, 0.02875],
  [0.8538, 0.2217, 0.02677],
  [0.84662, 0.21407, 0.02487],
  [0.83926, 0.20654, 0.02305],
  [0.83172, 0.19912, 0.02131],
  [0.82399, 0.19182, 0.01966],
  [0.81608, 0.18462, 0.01809],
  [0.80799, 0.17753, 0.0166],
  [0.79971, 0.17055, 0.0152],
  [0.79125, 0.16368, 0.01387],
  [0.7826, 0.15693, 0.01264],
  [0.77377, 0.15028, 0.01148],
  [0.76476, 0.14374, 0.01041],
  [0.75556, 0.13731, 942e-5],
  [0.74617, 0.13098, 851e-5],
  [0.73661, 0.12477, 769e-5],
  [0.72686, 0.11867, 695e-5],
  [0.71692, 0.11268, 629e-5],
  [0.7068, 0.1068, 571e-5],
  [0.6965, 0.10102, 522e-5],
  [0.68602, 0.09536, 481e-5],
  [0.67535, 0.0898, 449e-5],
  [0.66449, 0.08436, 424e-5],
  [0.65345, 0.07902, 408e-5],
  [0.64223, 0.0738, 401e-5],
  [0.63082, 0.06868, 401e-5],
  [0.61923, 0.06367, 41e-4],
  [0.60746, 0.05878, 427e-5],
  [0.5955, 0.05399, 453e-5],
  [0.58336, 0.04931, 486e-5],
  [0.57103, 0.04474, 529e-5],
  [0.55852, 0.04028, 579e-5],
  [0.54583, 0.03593, 638e-5],
  [0.53295, 0.03169, 705e-5],
  [0.51989, 0.02756, 78e-4],
  [0.50664, 0.02354, 863e-5],
  [0.49321, 0.01963, 955e-5],
  [0.4796, 0.01583, 0.01055]
];
const gqrxData = [];
for (let i = 0; i < 256; i++) {
  if (i < 20) {
    gqrxData.push([0, 0, 0]);
  } else if (i >= 20 && i < 70) {
    gqrxData.push([0, 0, 140 * (i - 20) / 50]);
  } else if (i >= 70 && i < 100) {
    gqrxData.push([60 * (i - 70) / 30, 125 * (i - 70) / 30, 115 * (i - 70) / 30 + 140]);
  } else if (i >= 100 && i < 150) {
    gqrxData.push([195 * (i - 100) / 50 + 60, 130 * (i - 100) / 50 + 125, 255 - 255 * (i - 100) / 50]);
  } else if (i >= 150 && i < 250) {
    gqrxData.push([255, 255 - 255 * (i - 150) / 100, 0]);
  } else if (i >= 250) {
    gqrxData.push([255, 255 * (i - 250) / 5, 255 * (i - 250) / 5]);
  }
  gqrxData[i] = gqrxData[i].map((x) => x / 255);
}
const definedColormaps = {
  turbo: turboColormap,
  gqrx: gqrxData
};
const availableColormaps = [
  "turbo",
  "gqrx",
  ...Object.keys(colorScale$1)
];
function computeColormapArray(colormap2) {
  return colormap2.map((rgb) => {
    const rgbcolor = new Uint8ClampedArray(4);
    if (rgb.length < 4) {
      rgb = [...rgb, 255];
    }
    rgbcolor.set(rgb.map((x) => Math.round(x * 255)));
    return rgbcolor;
  });
}
function drawColormapPreview(name, elem) {
  const ctx = elem.getContext("2d");
  const height = elem.height;
  const colormapArray = computeColormapArray(getColormap(name));
  for (let i = 0; i < 256; i++) {
    const [r, g2, b, a] = colormapArray[i];
    ctx.fillStyle = `rgba(${r}, ${g2}, ${b}, ${a})`;
    ctx.fillRect(i, 0, 1, height);
  }
}
function getColormap(name) {
  let colors;
  if (name in definedColormaps) {
    colors = definedColormaps[name];
  } else {
    colors = colormap({
      colormap: name,
      nshades: 256,
      format: "float",
      alpha: 1
    });
  }
  return colors;
}
function Deque(capacity) {
  this._capacity = getCapacity(capacity);
  this._length = 0;
  this._front = 0;
  if (isArray$4(capacity)) {
    var len = capacity.length;
    for (var i = 0; i < len; ++i) {
      this[i] = capacity[i];
    }
    this._length = len;
  }
}
Deque.prototype.toArray = function Deque$toArray() {
  var len = this._length;
  var ret = new Array(len);
  var front2 = this._front;
  var capacity = this._capacity;
  for (var j = 0; j < len; ++j) {
    ret[j] = this[front2 + j & capacity - 1];
  }
  return ret;
};
Deque.prototype.push = function Deque$push(item) {
  var argsLength = arguments.length;
  var length = this._length;
  if (argsLength > 1) {
    var capacity = this._capacity;
    if (length + argsLength > capacity) {
      for (var i = 0; i < argsLength; ++i) {
        this._checkCapacity(length + 1);
        var j = this._front + length & this._capacity - 1;
        this[j] = arguments[i];
        length++;
        this._length = length;
      }
      return length;
    } else {
      var j = this._front;
      for (var i = 0; i < argsLength; ++i) {
        this[j + length & capacity - 1] = arguments[i];
        j++;
      }
      this._length = length + argsLength;
      return length + argsLength;
    }
  }
  if (argsLength === 0)
    return length;
  this._checkCapacity(length + 1);
  var i = this._front + length & this._capacity - 1;
  this[i] = item;
  this._length = length + 1;
  return length + 1;
};
Deque.prototype.pop = function Deque$pop() {
  var length = this._length;
  if (length === 0) {
    return void 0;
  }
  var i = this._front + length - 1 & this._capacity - 1;
  var ret = this[i];
  this[i] = void 0;
  this._length = length - 1;
  return ret;
};
Deque.prototype.shift = function Deque$shift() {
  var length = this._length;
  if (length === 0) {
    return void 0;
  }
  var front2 = this._front;
  var ret = this[front2];
  this[front2] = void 0;
  this._front = front2 + 1 & this._capacity - 1;
  this._length = length - 1;
  return ret;
};
Deque.prototype.unshift = function Deque$unshift(item) {
  var length = this._length;
  var argsLength = arguments.length;
  if (argsLength > 1) {
    var capacity = this._capacity;
    if (length + argsLength > capacity) {
      for (var i = argsLength - 1; i >= 0; i--) {
        this._checkCapacity(length + 1);
        var capacity = this._capacity;
        var j = (this._front - 1 & capacity - 1 ^ capacity) - capacity;
        this[j] = arguments[i];
        length++;
        this._length = length;
        this._front = j;
      }
      return length;
    } else {
      var front2 = this._front;
      for (var i = argsLength - 1; i >= 0; i--) {
        var j = (front2 - 1 & capacity - 1 ^ capacity) - capacity;
        this[j] = arguments[i];
        front2 = j;
      }
      this._front = front2;
      this._length = length + argsLength;
      return length + argsLength;
    }
  }
  if (argsLength === 0)
    return length;
  this._checkCapacity(length + 1);
  var capacity = this._capacity;
  var i = (this._front - 1 & capacity - 1 ^ capacity) - capacity;
  this[i] = item;
  this._length = length + 1;
  this._front = i;
  return length + 1;
};
Deque.prototype.peekBack = function Deque$peekBack() {
  var length = this._length;
  if (length === 0) {
    return void 0;
  }
  var index = this._front + length - 1 & this._capacity - 1;
  return this[index];
};
Deque.prototype.peekFront = function Deque$peekFront() {
  if (this._length === 0) {
    return void 0;
  }
  return this[this._front];
};
Deque.prototype.get = function Deque$get(index) {
  var i = index;
  if (i !== (i | 0)) {
    return void 0;
  }
  var len = this._length;
  if (i < 0) {
    i = i + len;
  }
  if (i < 0 || i >= len) {
    return void 0;
  }
  return this[this._front + i & this._capacity - 1];
};
Deque.prototype.isEmpty = function Deque$isEmpty() {
  return this._length === 0;
};
Deque.prototype.clear = function Deque$clear() {
  var len = this._length;
  var front2 = this._front;
  var capacity = this._capacity;
  for (var j = 0; j < len; ++j) {
    this[front2 + j & capacity - 1] = void 0;
  }
  this._length = 0;
  this._front = 0;
};
Deque.prototype.toString = function Deque$toString() {
  return this.toArray().toString();
};
Deque.prototype.valueOf = Deque.prototype.toString;
Deque.prototype.removeFront = Deque.prototype.shift;
Deque.prototype.removeBack = Deque.prototype.pop;
Deque.prototype.insertFront = Deque.prototype.unshift;
Deque.prototype.insertBack = Deque.prototype.push;
Deque.prototype.enqueue = Deque.prototype.push;
Deque.prototype.dequeue = Deque.prototype.shift;
Deque.prototype.toJSON = Deque.prototype.toArray;
Object.defineProperty(Deque.prototype, "length", {
  get: function() {
    return this._length;
  },
  set: function() {
    throw new RangeError("");
  }
});
Deque.prototype._checkCapacity = function Deque$_checkCapacity(size) {
  if (this._capacity < size) {
    this._resizeTo(getCapacity(this._capacity * 1.5 + 16));
  }
};
Deque.prototype._resizeTo = function Deque$_resizeTo(capacity) {
  var oldCapacity = this._capacity;
  this._capacity = capacity;
  var front2 = this._front;
  var length = this._length;
  if (front2 + length > oldCapacity) {
    var moveItemsCount = front2 + length & oldCapacity - 1;
    arrayMove(this, 0, this, oldCapacity, moveItemsCount);
  }
};
var isArray$4 = Array.isArray;
function arrayMove(src2, srcIndex, dst, dstIndex, len) {
  for (var j = 0; j < len; ++j) {
    dst[j + dstIndex] = src2[j + srcIndex];
    src2[j + srcIndex] = void 0;
  }
}
function pow2AtLeast(n) {
  n = n >>> 0;
  n = n - 1;
  n = n | n >> 1;
  n = n | n >> 2;
  n = n | n >> 4;
  n = n | n >> 8;
  n = n | n >> 16;
  return n + 1;
}
function getCapacity(capacity) {
  if (typeof capacity !== "number") {
    if (isArray$4(capacity)) {
      capacity = capacity.length;
    } else {
      return 16;
    }
  }
  return pow2AtLeast(
    Math.min(
      Math.max(16, capacity),
      1073741824
    )
  );
}
var deque = Deque;
var check = function(it) {
  return it && it.Math == Math && it;
};
var global$f = check(typeof globalThis == "object" && globalThis) || check(typeof window == "object" && window) || check(typeof self == "object" && self) || check(typeof commonjsGlobal == "object" && commonjsGlobal) || function() {
  return this;
}() || Function("return this")();
var objectGetOwnPropertyDescriptor = {};
var fails$9 = function(exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};
var fails$8 = fails$9;
var descriptors = !fails$8(function() {
  return Object.defineProperty({}, 1, { get: function() {
    return 7;
  } })[1] != 7;
});
var fails$7 = fails$9;
var functionBindNative = !fails$7(function() {
  var test = function() {
  }.bind();
  return typeof test != "function" || test.hasOwnProperty("prototype");
});
var NATIVE_BIND$3 = functionBindNative;
var call$5 = Function.prototype.call;
var functionCall = NATIVE_BIND$3 ? call$5.bind(call$5) : function() {
  return call$5.apply(call$5, arguments);
};
var objectPropertyIsEnumerable = {};
var $propertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);
objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor$1(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;
var createPropertyDescriptor$2 = function(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value
  };
};
var NATIVE_BIND$2 = functionBindNative;
var FunctionPrototype$2 = Function.prototype;
var call$4 = FunctionPrototype$2.call;
var uncurryThisWithBind = NATIVE_BIND$2 && FunctionPrototype$2.bind.bind(call$4, call$4);
var functionUncurryThis = NATIVE_BIND$2 ? uncurryThisWithBind : function(fn2) {
  return function() {
    return call$4.apply(fn2, arguments);
  };
};
var uncurryThis$a = functionUncurryThis;
var toString$1 = uncurryThis$a({}.toString);
var stringSlice = uncurryThis$a("".slice);
var classofRaw$1 = function(it) {
  return stringSlice(toString$1(it), 8, -1);
};
var uncurryThis$9 = functionUncurryThis;
var fails$6 = fails$9;
var classof$1 = classofRaw$1;
var $Object$2 = Object;
var split$1 = uncurryThis$9("".split);
var indexedObject = fails$6(function() {
  return !$Object$2("z").propertyIsEnumerable(0);
}) ? function(it) {
  return classof$1(it) == "String" ? split$1(it, "") : $Object$2(it);
} : $Object$2;
var isNullOrUndefined$2 = function(it) {
  return it === null || it === void 0;
};
var isNullOrUndefined$1 = isNullOrUndefined$2;
var $TypeError$8 = TypeError;
var requireObjectCoercible$2 = function(it) {
  if (isNullOrUndefined$1(it))
    throw $TypeError$8("Can't call method on " + it);
  return it;
};
var IndexedObject = indexedObject;
var requireObjectCoercible$1 = requireObjectCoercible$2;
var toIndexedObject$3 = function(it) {
  return IndexedObject(requireObjectCoercible$1(it));
};
var documentAll$2 = typeof document == "object" && document.all;
var IS_HTMLDDA = typeof documentAll$2 == "undefined" && documentAll$2 !== void 0;
var documentAll_1 = {
  all: documentAll$2,
  IS_HTMLDDA
};
var $documentAll$1 = documentAll_1;
var documentAll$1 = $documentAll$1.all;
var isCallable$b = $documentAll$1.IS_HTMLDDA ? function(argument) {
  return typeof argument == "function" || argument === documentAll$1;
} : function(argument) {
  return typeof argument == "function";
};
var isCallable$a = isCallable$b;
var $documentAll = documentAll_1;
var documentAll = $documentAll.all;
var isObject$5 = $documentAll.IS_HTMLDDA ? function(it) {
  return typeof it == "object" ? it !== null : isCallable$a(it) || it === documentAll;
} : function(it) {
  return typeof it == "object" ? it !== null : isCallable$a(it);
};
var global$e = global$f;
var isCallable$9 = isCallable$b;
var aFunction = function(argument) {
  return isCallable$9(argument) ? argument : void 0;
};
var getBuiltIn$4 = function(namespace, method) {
  return arguments.length < 2 ? aFunction(global$e[namespace]) : global$e[namespace] && global$e[namespace][method];
};
var uncurryThis$8 = functionUncurryThis;
var objectIsPrototypeOf = uncurryThis$8({}.isPrototypeOf);
var getBuiltIn$3 = getBuiltIn$4;
var engineUserAgent = getBuiltIn$3("navigator", "userAgent") || "";
var global$d = global$f;
var userAgent$1 = engineUserAgent;
var process$2 = global$d.process;
var Deno = global$d.Deno;
var versions = process$2 && process$2.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;
if (v8) {
  match = v8.split(".");
  version = match[0] > 0 && match[0] < 4 ? 1 : +(match[0] + match[1]);
}
if (!version && userAgent$1) {
  match = userAgent$1.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent$1.match(/Chrome\/(\d+)/);
    if (match)
      version = +match[1];
  }
}
var engineV8Version = version;
var V8_VERSION = engineV8Version;
var fails$5 = fails$9;
var symbolConstructorDetection = !!Object.getOwnPropertySymbols && !fails$5(function() {
  var symbol = Symbol();
  return !String(symbol) || !(Object(symbol) instanceof Symbol) || !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});
var NATIVE_SYMBOL$1 = symbolConstructorDetection;
var useSymbolAsUid = NATIVE_SYMBOL$1 && !Symbol.sham && typeof Symbol.iterator == "symbol";
var getBuiltIn$2 = getBuiltIn$4;
var isCallable$8 = isCallable$b;
var isPrototypeOf = objectIsPrototypeOf;
var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;
var $Object$1 = Object;
var isSymbol$3 = USE_SYMBOL_AS_UID$1 ? function(it) {
  return typeof it == "symbol";
} : function(it) {
  var $Symbol = getBuiltIn$2("Symbol");
  return isCallable$8($Symbol) && isPrototypeOf($Symbol.prototype, $Object$1(it));
};
var $String$1 = String;
var tryToString$1 = function(argument) {
  try {
    return $String$1(argument);
  } catch (error) {
    return "Object";
  }
};
var isCallable$7 = isCallable$b;
var tryToString = tryToString$1;
var $TypeError$7 = TypeError;
var aCallable$2 = function(argument) {
  if (isCallable$7(argument))
    return argument;
  throw $TypeError$7(tryToString(argument) + " is not a function");
};
var aCallable$1 = aCallable$2;
var isNullOrUndefined = isNullOrUndefined$2;
var getMethod$1 = function(V, P) {
  var func = V[P];
  return isNullOrUndefined(func) ? void 0 : aCallable$1(func);
};
var call$3 = functionCall;
var isCallable$6 = isCallable$b;
var isObject$4 = isObject$5;
var $TypeError$6 = TypeError;
var ordinaryToPrimitive$1 = function(input, pref) {
  var fn2, val;
  if (pref === "string" && isCallable$6(fn2 = input.toString) && !isObject$4(val = call$3(fn2, input)))
    return val;
  if (isCallable$6(fn2 = input.valueOf) && !isObject$4(val = call$3(fn2, input)))
    return val;
  if (pref !== "string" && isCallable$6(fn2 = input.toString) && !isObject$4(val = call$3(fn2, input)))
    return val;
  throw $TypeError$6("Can't convert object to primitive value");
};
var shared$3 = { exports: {} };
var global$c = global$f;
var defineProperty$1 = Object.defineProperty;
var defineGlobalProperty$3 = function(key, value) {
  try {
    defineProperty$1(global$c, key, { value, configurable: true, writable: true });
  } catch (error) {
    global$c[key] = value;
  }
  return value;
};
var global$b = global$f;
var defineGlobalProperty$2 = defineGlobalProperty$3;
var SHARED = "__core-js_shared__";
var store$3 = global$b[SHARED] || defineGlobalProperty$2(SHARED, {});
var sharedStore = store$3;
var store$2 = sharedStore;
(shared$3.exports = function(key, value) {
  return store$2[key] || (store$2[key] = value !== void 0 ? value : {});
})("versions", []).push({
  version: "3.26.1",
  mode: "global",
  copyright: "© 2014-2022 Denis Pushkarev (zloirock.ru)",
  license: "https://github.com/zloirock/core-js/blob/v3.26.1/LICENSE",
  source: "https://github.com/zloirock/core-js"
});
var requireObjectCoercible = requireObjectCoercible$2;
var $Object = Object;
var toObject$1 = function(argument) {
  return $Object(requireObjectCoercible(argument));
};
var uncurryThis$7 = functionUncurryThis;
var toObject = toObject$1;
var hasOwnProperty = uncurryThis$7({}.hasOwnProperty);
var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty(toObject(it), key);
};
var uncurryThis$6 = functionUncurryThis;
var id = 0;
var postfix = Math.random();
var toString = uncurryThis$6(1 .toString);
var uid$2 = function(key) {
  return "Symbol(" + (key === void 0 ? "" : key) + ")_" + toString(++id + postfix, 36);
};
var global$a = global$f;
var shared$2 = shared$3.exports;
var hasOwn$9 = hasOwnProperty_1;
var uid$1 = uid$2;
var NATIVE_SYMBOL = symbolConstructorDetection;
var USE_SYMBOL_AS_UID = useSymbolAsUid;
var WellKnownSymbolsStore = shared$2("wks");
var Symbol$1 = global$a.Symbol;
var symbolFor = Symbol$1 && Symbol$1["for"];
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;
var wellKnownSymbol$1 = function(name) {
  if (!hasOwn$9(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == "string")) {
    var description = "Symbol." + name;
    if (NATIVE_SYMBOL && hasOwn$9(Symbol$1, name)) {
      WellKnownSymbolsStore[name] = Symbol$1[name];
    } else if (USE_SYMBOL_AS_UID && symbolFor) {
      WellKnownSymbolsStore[name] = symbolFor(description);
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol(description);
    }
  }
  return WellKnownSymbolsStore[name];
};
var call$2 = functionCall;
var isObject$3 = isObject$5;
var isSymbol$2 = isSymbol$3;
var getMethod = getMethod$1;
var ordinaryToPrimitive = ordinaryToPrimitive$1;
var wellKnownSymbol = wellKnownSymbol$1;
var $TypeError$5 = TypeError;
var TO_PRIMITIVE = wellKnownSymbol("toPrimitive");
var toPrimitive$1 = function(input, pref) {
  if (!isObject$3(input) || isSymbol$2(input))
    return input;
  var exoticToPrim = getMethod(input, TO_PRIMITIVE);
  var result;
  if (exoticToPrim) {
    if (pref === void 0)
      pref = "default";
    result = call$2(exoticToPrim, input, pref);
    if (!isObject$3(result) || isSymbol$2(result))
      return result;
    throw $TypeError$5("Can't convert object to primitive value");
  }
  if (pref === void 0)
    pref = "number";
  return ordinaryToPrimitive(input, pref);
};
var toPrimitive = toPrimitive$1;
var isSymbol$1 = isSymbol$3;
var toPropertyKey$2 = function(argument) {
  var key = toPrimitive(argument, "string");
  return isSymbol$1(key) ? key : key + "";
};
var global$9 = global$f;
var isObject$2 = isObject$5;
var document$1 = global$9.document;
var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);
var documentCreateElement = function(it) {
  return EXISTS$1 ? document$1.createElement(it) : {};
};
var DESCRIPTORS$6 = descriptors;
var fails$4 = fails$9;
var createElement$1 = documentCreateElement;
var ie8DomDefine = !DESCRIPTORS$6 && !fails$4(function() {
  return Object.defineProperty(createElement$1("div"), "a", {
    get: function() {
      return 7;
    }
  }).a != 7;
});
var DESCRIPTORS$5 = descriptors;
var call$1 = functionCall;
var propertyIsEnumerableModule = objectPropertyIsEnumerable;
var createPropertyDescriptor$1 = createPropertyDescriptor$2;
var toIndexedObject$2 = toIndexedObject$3;
var toPropertyKey$1 = toPropertyKey$2;
var hasOwn$8 = hasOwnProperty_1;
var IE8_DOM_DEFINE$1 = ie8DomDefine;
var $getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;
objectGetOwnPropertyDescriptor.f = DESCRIPTORS$5 ? $getOwnPropertyDescriptor$1 : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject$2(O);
  P = toPropertyKey$1(P);
  if (IE8_DOM_DEFINE$1)
    try {
      return $getOwnPropertyDescriptor$1(O, P);
    } catch (error) {
    }
  if (hasOwn$8(O, P))
    return createPropertyDescriptor$1(!call$1(propertyIsEnumerableModule.f, O, P), O[P]);
};
var objectDefineProperty = {};
var DESCRIPTORS$4 = descriptors;
var fails$3 = fails$9;
var v8PrototypeDefineBug = DESCRIPTORS$4 && fails$3(function() {
  return Object.defineProperty(function() {
  }, "prototype", {
    value: 42,
    writable: false
  }).prototype != 42;
});
var isObject$1 = isObject$5;
var $String = String;
var $TypeError$4 = TypeError;
var anObject$2 = function(argument) {
  if (isObject$1(argument))
    return argument;
  throw $TypeError$4($String(argument) + " is not an object");
};
var DESCRIPTORS$3 = descriptors;
var IE8_DOM_DEFINE = ie8DomDefine;
var V8_PROTOTYPE_DEFINE_BUG = v8PrototypeDefineBug;
var anObject$1 = anObject$2;
var toPropertyKey = toPropertyKey$2;
var $TypeError$3 = TypeError;
var $defineProperty = Object.defineProperty;
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var ENUMERABLE = "enumerable";
var CONFIGURABLE$1 = "configurable";
var WRITABLE = "writable";
objectDefineProperty.f = DESCRIPTORS$3 ? V8_PROTOTYPE_DEFINE_BUG ? function defineProperty(O, P, Attributes) {
  anObject$1(O);
  P = toPropertyKey(P);
  anObject$1(Attributes);
  if (typeof O === "function" && P === "prototype" && "value" in Attributes && WRITABLE in Attributes && !Attributes[WRITABLE]) {
    var current = $getOwnPropertyDescriptor(O, P);
    if (current && current[WRITABLE]) {
      O[P] = Attributes.value;
      Attributes = {
        configurable: CONFIGURABLE$1 in Attributes ? Attributes[CONFIGURABLE$1] : current[CONFIGURABLE$1],
        enumerable: ENUMERABLE in Attributes ? Attributes[ENUMERABLE] : current[ENUMERABLE],
        writable: false
      };
    }
  }
  return $defineProperty(O, P, Attributes);
} : $defineProperty : function defineProperty2(O, P, Attributes) {
  anObject$1(O);
  P = toPropertyKey(P);
  anObject$1(Attributes);
  if (IE8_DOM_DEFINE)
    try {
      return $defineProperty(O, P, Attributes);
    } catch (error) {
    }
  if ("get" in Attributes || "set" in Attributes)
    throw $TypeError$3("Accessors not supported");
  if ("value" in Attributes)
    O[P] = Attributes.value;
  return O;
};
var DESCRIPTORS$2 = descriptors;
var definePropertyModule$2 = objectDefineProperty;
var createPropertyDescriptor = createPropertyDescriptor$2;
var createNonEnumerableProperty$2 = DESCRIPTORS$2 ? function(object, key, value) {
  return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
} : function(object, key, value) {
  object[key] = value;
  return object;
};
var makeBuiltIn$2 = { exports: {} };
var DESCRIPTORS$1 = descriptors;
var hasOwn$7 = hasOwnProperty_1;
var FunctionPrototype$1 = Function.prototype;
var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;
var EXISTS = hasOwn$7(FunctionPrototype$1, "name");
var PROPER = EXISTS && function something() {
}.name === "something";
var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || DESCRIPTORS$1 && getDescriptor(FunctionPrototype$1, "name").configurable);
var functionName = {
  EXISTS,
  PROPER,
  CONFIGURABLE
};
var uncurryThis$5 = functionUncurryThis;
var isCallable$5 = isCallable$b;
var store$1 = sharedStore;
var functionToString$1 = uncurryThis$5(Function.toString);
if (!isCallable$5(store$1.inspectSource)) {
  store$1.inspectSource = function(it) {
    return functionToString$1(it);
  };
}
var inspectSource$1 = store$1.inspectSource;
var global$8 = global$f;
var isCallable$4 = isCallable$b;
var WeakMap$2 = global$8.WeakMap;
var weakMapBasicDetection = isCallable$4(WeakMap$2) && /native code/.test(String(WeakMap$2));
var shared$1 = shared$3.exports;
var uid = uid$2;
var keys = shared$1("keys");
var sharedKey$1 = function(key) {
  return keys[key] || (keys[key] = uid(key));
};
var hiddenKeys$3 = {};
var NATIVE_WEAK_MAP = weakMapBasicDetection;
var global$7 = global$f;
var isObject = isObject$5;
var createNonEnumerableProperty$1 = createNonEnumerableProperty$2;
var hasOwn$6 = hasOwnProperty_1;
var shared = sharedStore;
var sharedKey = sharedKey$1;
var hiddenKeys$2 = hiddenKeys$3;
var OBJECT_ALREADY_INITIALIZED = "Object already initialized";
var TypeError$1 = global$7.TypeError;
var WeakMap$1 = global$7.WeakMap;
var set$1, get, has$4;
var enforce = function(it) {
  return has$4(it) ? get(it) : set$1(it, {});
};
var getterFor = function(TYPE) {
  return function(it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError$1("Incompatible receiver, " + TYPE + " required");
    }
    return state;
  };
};
if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap$1());
  store.get = store.get;
  store.has = store.has;
  store.set = store.set;
  set$1 = function(it, metadata) {
    if (store.has(it))
      throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    store.set(it, metadata);
    return metadata;
  };
  get = function(it) {
    return store.get(it) || {};
  };
  has$4 = function(it) {
    return store.has(it);
  };
} else {
  var STATE = sharedKey("state");
  hiddenKeys$2[STATE] = true;
  set$1 = function(it, metadata) {
    if (hasOwn$6(it, STATE))
      throw TypeError$1(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty$1(it, STATE, metadata);
    return metadata;
  };
  get = function(it) {
    return hasOwn$6(it, STATE) ? it[STATE] : {};
  };
  has$4 = function(it) {
    return hasOwn$6(it, STATE);
  };
}
var internalState = {
  set: set$1,
  get,
  has: has$4,
  enforce,
  getterFor
};
var fails$2 = fails$9;
var isCallable$3 = isCallable$b;
var hasOwn$5 = hasOwnProperty_1;
var DESCRIPTORS = descriptors;
var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;
var inspectSource = inspectSource$1;
var InternalStateModule = internalState;
var enforceInternalState = InternalStateModule.enforce;
var getInternalState = InternalStateModule.get;
var defineProperty3 = Object.defineProperty;
var CONFIGURABLE_LENGTH = DESCRIPTORS && !fails$2(function() {
  return defineProperty3(function() {
  }, "length", { value: 8 }).length !== 8;
});
var TEMPLATE = String(String).split("String");
var makeBuiltIn$1 = makeBuiltIn$2.exports = function(value, name, options) {
  if (String(name).slice(0, 7) === "Symbol(") {
    name = "[" + String(name).replace(/^Symbol\(([^)]*)\)/, "$1") + "]";
  }
  if (options && options.getter)
    name = "get " + name;
  if (options && options.setter)
    name = "set " + name;
  if (!hasOwn$5(value, "name") || CONFIGURABLE_FUNCTION_NAME && value.name !== name) {
    if (DESCRIPTORS)
      defineProperty3(value, "name", { value: name, configurable: true });
    else
      value.name = name;
  }
  if (CONFIGURABLE_LENGTH && options && hasOwn$5(options, "arity") && value.length !== options.arity) {
    defineProperty3(value, "length", { value: options.arity });
  }
  try {
    if (options && hasOwn$5(options, "constructor") && options.constructor) {
      if (DESCRIPTORS)
        defineProperty3(value, "prototype", { writable: false });
    } else if (value.prototype)
      value.prototype = void 0;
  } catch (error) {
  }
  var state = enforceInternalState(value);
  if (!hasOwn$5(state, "source")) {
    state.source = TEMPLATE.join(typeof name == "string" ? name : "");
  }
  return value;
};
Function.prototype.toString = makeBuiltIn$1(function toString2() {
  return isCallable$3(this) && getInternalState(this).source || inspectSource(this);
}, "toString");
var isCallable$2 = isCallable$b;
var definePropertyModule$1 = objectDefineProperty;
var makeBuiltIn = makeBuiltIn$2.exports;
var defineGlobalProperty$1 = defineGlobalProperty$3;
var defineBuiltIn$1 = function(O, key, value, options) {
  if (!options)
    options = {};
  var simple = options.enumerable;
  var name = options.name !== void 0 ? options.name : key;
  if (isCallable$2(value))
    makeBuiltIn(value, name, options);
  if (options.global) {
    if (simple)
      O[key] = value;
    else
      defineGlobalProperty$1(key, value);
  } else {
    try {
      if (!options.unsafe)
        delete O[key];
      else if (O[key])
        simple = true;
    } catch (error) {
    }
    if (simple)
      O[key] = value;
    else
      definePropertyModule$1.f(O, key, {
        value,
        enumerable: false,
        configurable: !options.nonConfigurable,
        writable: !options.nonWritable
      });
  }
  return O;
};
var objectGetOwnPropertyNames = {};
var ceil = Math.ceil;
var floor = Math.floor;
var mathTrunc = Math.trunc || function trunc(x) {
  var n = +x;
  return (n > 0 ? floor : ceil)(n);
};
var trunc2 = mathTrunc;
var toIntegerOrInfinity$2 = function(argument) {
  var number = +argument;
  return number !== number || number === 0 ? 0 : trunc2(number);
};
var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;
var max$1 = Math.max;
var min$2 = Math.min;
var toAbsoluteIndex$1 = function(index, length) {
  var integer = toIntegerOrInfinity$1(index);
  return integer < 0 ? max$1(integer + length, 0) : min$2(integer, length);
};
var toIntegerOrInfinity = toIntegerOrInfinity$2;
var min$1 = Math.min;
var toLength$1 = function(argument) {
  return argument > 0 ? min$1(toIntegerOrInfinity(argument), 9007199254740991) : 0;
};
var toLength = toLength$1;
var lengthOfArrayLike$1 = function(obj) {
  return toLength(obj.length);
};
var toIndexedObject$1 = toIndexedObject$3;
var toAbsoluteIndex = toAbsoluteIndex$1;
var lengthOfArrayLike = lengthOfArrayLike$1;
var createMethod = function(IS_INCLUDES) {
  return function($this, el, fromIndex) {
    var O = toIndexedObject$1($this);
    var length = lengthOfArrayLike(O);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    if (IS_INCLUDES && el != el)
      while (length > index) {
        value = O[index++];
        if (value != value)
          return true;
      }
    else
      for (; length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el)
          return IS_INCLUDES || index || 0;
      }
    return !IS_INCLUDES && -1;
  };
};
var arrayIncludes = {
  includes: createMethod(true),
  indexOf: createMethod(false)
};
var uncurryThis$4 = functionUncurryThis;
var hasOwn$4 = hasOwnProperty_1;
var toIndexedObject = toIndexedObject$3;
var indexOf$1 = arrayIncludes.indexOf;
var hiddenKeys$1 = hiddenKeys$3;
var push$1 = uncurryThis$4([].push);
var objectKeysInternal = function(object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O)
    !hasOwn$4(hiddenKeys$1, key) && hasOwn$4(O, key) && push$1(result, key);
  while (names.length > i)
    if (hasOwn$4(O, key = names[i++])) {
      ~indexOf$1(result, key) || push$1(result, key);
    }
  return result;
};
var enumBugKeys$1 = [
  "constructor",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "toLocaleString",
  "toString",
  "valueOf"
];
var internalObjectKeys = objectKeysInternal;
var enumBugKeys = enumBugKeys$1;
var hiddenKeys = enumBugKeys.concat("length", "prototype");
objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};
var objectGetOwnPropertySymbols = {};
objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;
var getBuiltIn$1 = getBuiltIn$4;
var uncurryThis$3 = functionUncurryThis;
var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
var anObject = anObject$2;
var concat = uncurryThis$3([].concat);
var ownKeys$1 = getBuiltIn$1("Reflect", "ownKeys") || function ownKeys(it) {
  var keys2 = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? concat(keys2, getOwnPropertySymbols(it)) : keys2;
};
var hasOwn$3 = hasOwnProperty_1;
var ownKeys2 = ownKeys$1;
var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
var definePropertyModule = objectDefineProperty;
var copyConstructorProperties$1 = function(target, source, exceptions) {
  var keys2 = ownKeys2(source);
  var defineProperty4 = definePropertyModule.f;
  var getOwnPropertyDescriptor3 = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys2.length; i++) {
    var key = keys2[i];
    if (!hasOwn$3(target, key) && !(exceptions && hasOwn$3(exceptions, key))) {
      defineProperty4(target, key, getOwnPropertyDescriptor3(source, key));
    }
  }
};
var fails$1 = fails$9;
var isCallable$1 = isCallable$b;
var replacement = /#|\.prototype\./;
var isForced$1 = function(feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true : value == NATIVE ? false : isCallable$1(detection) ? fails$1(detection) : !!detection;
};
var normalize = isForced$1.normalize = function(string) {
  return String(string).replace(replacement, ".").toLowerCase();
};
var data = isForced$1.data = {};
var NATIVE = isForced$1.NATIVE = "N";
var POLYFILL = isForced$1.POLYFILL = "P";
var isForced_1 = isForced$1;
var global$6 = global$f;
var getOwnPropertyDescriptor2 = objectGetOwnPropertyDescriptor.f;
var createNonEnumerableProperty = createNonEnumerableProperty$2;
var defineBuiltIn = defineBuiltIn$1;
var defineGlobalProperty = defineGlobalProperty$3;
var copyConstructorProperties = copyConstructorProperties$1;
var isForced = isForced_1;
var _export = function(options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global$6;
  } else if (STATIC) {
    target = global$6[TARGET] || defineGlobalProperty(TARGET, {});
  } else {
    target = (global$6[TARGET] || {}).prototype;
  }
  if (target)
    for (key in source) {
      sourceProperty = source[key];
      if (options.dontCallGetSet) {
        descriptor = getOwnPropertyDescriptor2(target, key);
        targetProperty = descriptor && descriptor.value;
      } else
        targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? "." : "#") + key, options.forced);
      if (!FORCED && targetProperty !== void 0) {
        if (typeof sourceProperty == typeof targetProperty)
          continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      if (options.sham || targetProperty && targetProperty.sham) {
        createNonEnumerableProperty(sourceProperty, "sham", true);
      }
      defineBuiltIn(target, key, sourceProperty, options);
    }
};
var NATIVE_BIND$1 = functionBindNative;
var FunctionPrototype = Function.prototype;
var apply$1 = FunctionPrototype.apply;
var call = FunctionPrototype.call;
var functionApply = typeof Reflect == "object" && Reflect.apply || (NATIVE_BIND$1 ? call.bind(apply$1) : function() {
  return call.apply(apply$1, arguments);
});
var classofRaw = classofRaw$1;
var uncurryThis$2 = functionUncurryThis;
var functionUncurryThisClause = function(fn2) {
  if (classofRaw(fn2) === "Function")
    return uncurryThis$2(fn2);
};
var uncurryThis$1 = functionUncurryThisClause;
var aCallable = aCallable$2;
var NATIVE_BIND = functionBindNative;
var bind$3 = uncurryThis$1(uncurryThis$1.bind);
var functionBindContext = function(fn2, that) {
  aCallable(fn2);
  return that === void 0 ? fn2 : NATIVE_BIND ? bind$3(fn2, that) : function() {
    return fn2.apply(that, arguments);
  };
};
var getBuiltIn = getBuiltIn$4;
var html$1 = getBuiltIn("document", "documentElement");
var uncurryThis = functionUncurryThis;
var arraySlice$1 = uncurryThis([].slice);
var $TypeError$2 = TypeError;
var validateArgumentsLength$1 = function(passed, required) {
  if (passed < required)
    throw $TypeError$2("Not enough arguments");
  return passed;
};
var userAgent = engineUserAgent;
var engineIsIos = /(?:ipad|iphone|ipod).*applewebkit/i.test(userAgent);
var classof = classofRaw$1;
var global$5 = global$f;
var engineIsNode = classof(global$5.process) == "process";
var global$4 = global$f;
var apply = functionApply;
var bind$2 = functionBindContext;
var isCallable = isCallable$b;
var hasOwn$2 = hasOwnProperty_1;
var fails = fails$9;
var html = html$1;
var arraySlice = arraySlice$1;
var createElement = documentCreateElement;
var validateArgumentsLength = validateArgumentsLength$1;
var IS_IOS = engineIsIos;
var IS_NODE = engineIsNode;
var set = global$4.setImmediate;
var clear = global$4.clearImmediate;
var process$1 = global$4.process;
var Dispatch = global$4.Dispatch;
var Function$1 = global$4.Function;
var MessageChannel = global$4.MessageChannel;
var String$1 = global$4.String;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = "onreadystatechange";
var $location, defer, channel, port;
try {
  $location = global$4.location;
} catch (error) {
}
var run = function(id2) {
  if (hasOwn$2(queue, id2)) {
    var fn2 = queue[id2];
    delete queue[id2];
    fn2();
  }
};
var runner = function(id2) {
  return function() {
    run(id2);
  };
};
var listener = function(event) {
  run(event.data);
};
var post = function(id2) {
  global$4.postMessage(String$1(id2), $location.protocol + "//" + $location.host);
};
if (!set || !clear) {
  set = function setImmediate2(handler) {
    validateArgumentsLength(arguments.length, 1);
    var fn2 = isCallable(handler) ? handler : Function$1(handler);
    var args = arraySlice(arguments, 1);
    queue[++counter] = function() {
      apply(fn2, void 0, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate2(id2) {
    delete queue[id2];
  };
  if (IS_NODE) {
    defer = function(id2) {
      process$1.nextTick(runner(id2));
    };
  } else if (Dispatch && Dispatch.now) {
    defer = function(id2) {
      Dispatch.now(runner(id2));
    };
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind$2(port.postMessage, port);
  } else if (global$4.addEventListener && isCallable(global$4.postMessage) && !global$4.importScripts && $location && $location.protocol !== "file:" && !fails(post)) {
    defer = post;
    global$4.addEventListener("message", listener, false);
  } else if (ONREADYSTATECHANGE in createElement("script")) {
    defer = function(id2) {
      html.appendChild(createElement("script"))[ONREADYSTATECHANGE] = function() {
        html.removeChild(this);
        run(id2);
      };
    };
  } else {
    defer = function(id2) {
      setTimeout(runner(id2), 0);
    };
  }
}
var task = {
  set,
  clear
};
var $$1 = _export;
var global$3 = global$f;
var clearImmediate$1 = task.clear;
$$1({ global: true, bind: true, enumerable: true, forced: global$3.clearImmediate !== clearImmediate$1 }, {
  clearImmediate: clearImmediate$1
});
var $ = _export;
var global$2 = global$f;
var setImmediate$1 = task.set;
$({ global: true, bind: true, enumerable: true, forced: global$2.setImmediate !== setImmediate$1 }, {
  setImmediate: setImmediate$1
});
var global$1 = global$f;
var path$2 = global$1;
var path$1 = path$2;
path$1.setImmediate;
var path = path$2;
path.clearImmediate;
class SpectrumWaterfall {
  constructor(endpoint, settings2) {
    this.endpoint = endpoint;
    this.spectrum = false;
    this.waterfall = false;
    this.waterfallQueue = new deque(10);
    this.drawnWaterfallQueue = new deque(1024);
    this.lagTime = 0;
    this.spectrumAlpha = 0.5;
    this.spectrumFiltered = [[-1, -1], [0]];
    this.waterfallColourShift = 80;
    this.colormap = [];
    this.setColormap("gqrx");
    this.clients = {};
    this.clientColormap = computeColormapArray(getColormap("rainbow"));
    this.updateTimeout = setTimeout(() => {
    }, 0);
    this.lineResets = 0;
  }
  initCanvas(settings2) {
    this.canvasElem = settings2.canvasElem;
    this.ctx = this.canvasElem.getContext("2d");
    this.canvasWidth = this.canvasElem.width;
    this.canvasHeight = this.canvasElem.height;
    this.backgroundColor = window.getComputedStyle(document.body, null).getPropertyValue("background-color");
    this.curLine = this.canvasHeight / 2;
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
    this.graduationCanvasElem = settings2.graduationCanvasElem;
    this.graduationCtx = this.graduationCanvasElem.getContext("2d");
    this.spectrumCanvasElem = settings2.spectrumCanvasElem;
    this.spectrumCtx = this.spectrumCanvasElem.getContext("2d");
    this.spectrumCanvasElem.addEventListener("mousemove", this.spectrumMouseMove.bind(this));
    this.spectrumCanvasElem.addEventListener("mouseleave", this.spectrumMouseLeave.bind(this));
    this.tempCanvasElem = document.createElement("canvas");
    this.tempCtx = this.tempCanvasElem.getContext("2d");
    this.tempCanvasElem.width = this.canvasWidth;
    this.tempCanvasElem.height = 200;
    this.waterfall = true;
  }
  async init() {
    if (this.promise) {
      return this.promise;
    }
    this.waterfallSocket = new WebSocket(this.endpoint);
    this.waterfallSocket.binaryType = "arraybuffer";
    this.firstWaterfallMessage = true;
    this.waterfallSocket.onmessage = this.socketMessageInitial.bind(this);
    this.promise = new Promise((resolve, reject) => {
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    return this.promise;
  }
  stop() {
    this.waterfallSocket.close();
  }
  socketMessageInitial(event) {
    if (!(event.data instanceof ArrayBuffer)) {
      const settings2 = JSON.parse(event.data);
      if (!settings2.fft_size) {
        return;
      }
      this.waterfallMaxSize = settings2.fft_result_size;
      this.fftSize = settings2.fft_size;
      this.baseFreq = settings2.basefreq;
      this.sps = settings2.sps;
      this.totalBandwidth = settings2.total_bandwidth;
      this.overlap = settings2.overlap;
      this.canvasElem.width = settings2.waterfall_size;
      this.spectrumCanvasElem.width = settings2.waterfall_size;
      this.tempCanvasElem.width = settings2.waterfall_size;
      this.graduationCanvasElem.width = settings2.waterfall_size;
      this.canvasElem.height = this.canvasElem.parentElement.clientHeight * 2;
      this.canvasWidth = this.canvasElem.width;
      this.canvasHeight = this.canvasElem.height;
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, this.canvasElem.width, this.canvasElem.height);
      const skipNum = Math.max(1, Math.floor(this.sps / this.fftSize / 10) * 2);
      const waterfallFPS = this.sps / this.fftSize / (skipNum / 2);
      console.log("Waterfall FPS: " + waterfallFPS);
      this.waterfallDrawInterval = setInterval(() => {
        requestAnimationFrame(this.drawSpectrogram.bind(this));
      }, 1e3 / waterfallFPS);
      this.waterfallL = 0;
      this.waterfallR = this.waterfallMaxSize;
      this.waterfallSocket.onmessage = this.socketMessage.bind(this);
      this.firstWaterfallMessage = false;
      if (settings2.waterfall_compression === "av1") {
        this.waterfallDecoder = new AV1WaterfallDecoder();
      } else if (settings2.waterfall_compression === "zstd") {
        this.waterfallDecoder = new ZstdWaterfallDecoder();
      }
      this.updateGraduation();
      this.resolvePromise(settings2);
    }
  }
  socketMessage(event) {
    if (event.data instanceof ArrayBuffer) {
      this.enqueueSpectrogram(event.data);
    }
  }
  getMouseX(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    return (evt.clientX - rect.left) * scaleX;
  }
  enqueueSpectrogram(array) {
    if (!this.waterfall && !this.spectrum) {
      this.waterfallQueue.clear();
      return;
    }
    if (this.waterfallQueue.length > 20) {
      this.waterfallQueue.pop();
      this.waterfallQueue.pop();
    }
    this.waterfallDecoder.decode(array).forEach((element2) => {
      this.waterfallQueue.unshift(element2);
    });
  }
  transformValue(x) {
    return Math.min(Math.max(x + this.waterfallColourShift, 0), 255);
  }
  idxToFreq(idx) {
    return idx / this.waterfallMaxSize * this.totalBandwidth + this.baseFreq;
  }
  idxToCanvasX(idx) {
    return (idx - this.waterfallL) / (this.waterfallR - this.waterfallL) * this.canvasWidth;
  }
  canvasXtoFreq(x) {
    const idx = x / this.canvasWidth * (this.waterfallR - this.waterfallL) + this.waterfallL;
    return this.idxToFreq(idx);
  }
  freqToIdx(freq) {
    return (freq - this.baseFreq) / this.totalBandwidth * this.waterfallMaxSize;
  }
  calculateOffsets(waterfallArray, curL, curR) {
    const pxPerIdx = this.canvasWidth / (this.waterfallR - this.waterfallL);
    const pxL = (curL - this.waterfallL) * pxPerIdx;
    const pxR = (curR - this.waterfallL) * pxPerIdx;
    const arr = new Uint8Array(waterfallArray.length);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = this.transformValue(waterfallArray[i]);
    }
    return [arr, pxL, pxR];
  }
  drawSpectrogram() {
    if (this.waterfallQueue.length === 0) {
      return;
    }
    const [waterfallArray, curL, curR] = this.waterfallQueue.pop();
    const [arr, pxL, pxR] = this.calculateOffsets(waterfallArray, curL, curR);
    if (this.waterfall) {
      this.drawWaterfall(arr, pxL, pxR, curL, curR);
    }
    if (this.spectrum) {
      this.drawSpectrum(arr, pxL, pxR, curL, curR);
    }
    this.drawnWaterfallQueue.unshift([waterfallArray, curL, curR]);
    if (this.drawnWaterfallQueue.length > this.canvasHeight) {
      this.drawnWaterfallQueue.pop();
    }
  }
  async redrawWaterfall() {
    const toDraw = this.drawnWaterfallQueue.toArray();
    const curLineReset = this.lineResets;
    const curLine = this.curLine;
    const drawLine = (i) => {
      const toDrawLine = curLine + 1 + i + (this.lineResets - curLineReset) * this.canvasHeight / 2;
      const [waterfallArray, curL, curR] = toDraw[i];
      const [arr, pxL, pxR] = this.calculateOffsets(waterfallArray, curL, curR);
      this.drawWaterfallLine(arr, pxL, pxR, toDrawLine);
      if (i + 1 < toDraw.length) {
        this.updateImmediate = setImmediate(() => drawLine(i + 1));
      }
    };
    clearImmediate(this.updateImmediate);
    if (toDraw.length) {
      drawLine(0);
    }
  }
  drawWaterfallLine(arr, pxL, pxR, line) {
    const colorarr = this.ctx.createImageData(arr.length, 1);
    const bmparr = new Uint8Array(arr.length * 4);
    for (let i = 0; i < arr.length; i++) {
      colorarr.data.set(this.colormap[arr[i]], i * 4);
      bmparr[i * 4 + 0] = 255;
      bmparr[i * 4 + 1] = this.colormap[arr[i]][2];
      bmparr[i * 4 + 2] = this.colormap[arr[i]][1];
      bmparr[i * 4 + 3] = this.colormap[arr[i]][0];
    }
    this.ctx.putImageData(colorarr, 0, 0);
    this.ctx.drawImage(this.canvasElem, 0, 0, arr.length, 1, pxL, line, pxR - pxL, 1);
  }
  drawWaterfall(arr, pxL, pxR, curL, curR) {
    this.drawWaterfallLine(arr, pxL, pxR, this.curLine);
    this.canvasElem.style.transform = `translate3d(0, -${(this.curLine + 1) / this.canvasHeight * 100}%, 0)`;
    if (this.curLine === 0) {
      this.ctx.drawImage(this.canvasElem, 0, this.canvasHeight / 2);
      this.curLine = this.canvasHeight / 2;
      this.lineResets++;
    }
    this.curLine -= 1;
  }
  drawSpectrum(arr, pxL, pxR, curL, curR) {
    if (curL !== this.spectrumFiltered[0][0] || curR !== this.spectrumFiltered[0][1]) {
      this.spectrumFiltered[1] = arr;
      this.spectrumFiltered[0] = [curL, curR];
    }
    for (let i = 0; i < arr.length; i++) {
      this.spectrumFiltered[1][i] = this.spectrumAlpha * arr[i] + (1 - this.spectrumAlpha) * this.spectrumFiltered[1][i];
    }
    arr = this.spectrumFiltered[1];
    const pixels = (pxR - pxL) / arr.length;
    arr = arr.map((x) => 255 - x);
    this.spectrumCtx.clearRect(0, 0, this.spectrumCanvasElem.width, this.spectrumCanvasElem.height);
    this.spectrumCtx.strokeStyle = "yellow";
    this.spectrumCtx.fillStyle = "yellow";
    this.spectrumCtx.beginPath();
    this.spectrumCtx.moveTo(pxL, arr[0] / 2);
    arr.forEach((x, i) => {
      this.spectrumCtx.lineTo(pxL + pixels / 2 + i * pixels, x / 2);
    });
    this.spectrumCtx.lineTo(pxR, arr[arr.length - 1] / 2);
    this.spectrumCtx.stroke();
    if (this.spectrumFreq) {
      this.spectrumCtx.fillText((this.spectrumFreq / 1e6).toFixed(8) + " MHz", 10, 10);
      this.spectrumCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      this.spectrumCtx.beginPath();
      this.spectrumCtx.moveTo(this.spectrumX, 0);
      this.spectrumCtx.lineTo(this.spectrumX, 128);
      this.spectrumCtx.stroke();
    }
  }
  updateGraduation() {
    const freqL = this.idxToFreq(this.waterfallL);
    const freqR = this.idxToFreq(this.waterfallR);
    let graduationSpacing = 1;
    while ((freqR - freqL) / graduationSpacing > 5) {
      graduationSpacing *= 10;
    }
    graduationSpacing /= 10;
    this.graduationCtx.fillStyle = "white";
    this.graduationCtx.strokeStyle = "white";
    this.graduationCtx.clearRect(0, 0, this.graduationCanvasElem.width, this.graduationCanvasElem.height);
    let freqLStart = freqL;
    if (freqL % graduationSpacing !== 0) {
      freqLStart = freqL + (graduationSpacing - freqL % graduationSpacing);
    }
    let minimumTrailingZeros = 5;
    for (let freqStart = freqLStart; freqStart <= freqR; freqStart += graduationSpacing) {
      const trailingZeros = freqStart.toString().match(/0*$/g)[0].length;
      minimumTrailingZeros = Math.min(minimumTrailingZeros, trailingZeros);
    }
    this.graduationCtx.font = "15px Arial";
    for (; freqLStart <= freqR; freqLStart += graduationSpacing) {
      const middlePixel = (freqLStart - freqL) / (freqR - freqL) * this.canvasWidth;
      let lineHeight = 5;
      let printFreq = false;
      if (freqLStart % (graduationSpacing * 10) === 0) {
        lineHeight = 10;
        printFreq = true;
      } else if (freqLStart % (graduationSpacing * 5) === 0) {
        lineHeight = 7;
        printFreq = true;
      }
      if (printFreq) {
        this.graduationCtx.textAlign = "center";
        this.graduationCtx.fillText((freqLStart / 1e6).toFixed(6 - minimumTrailingZeros) + " MHz", middlePixel, 10);
      }
      this.graduationCtx.beginPath();
      this.graduationCtx.moveTo(middlePixel, 10 + 0);
      this.graduationCtx.lineTo(middlePixel, 10 + lineHeight);
      this.graduationCtx.stroke();
    }
    this.drawClients();
  }
  setClients(clients) {
    this.clients = clients;
  }
  drawClients() {
    Object.entries(this.clients).filter(([_, x]) => x[1] < this.waterfallR && x[1] >= this.waterfallL).forEach(([id2, range]) => {
      const midOffset = this.idxToCanvasX(range[1]);
      const [r, g2, b, a] = this.clientColormap[parseInt(id2.substring(0, 2), 16)];
      this.graduationCtx.fillStyle = `rgba(${r}, ${g2}, ${b}, ${a})`;
      this.graduationCtx.strokeStyle = `rgba(${r}, ${g2}, ${b}, ${a})`;
      this.graduationCtx.beginPath();
      this.graduationCtx.moveTo(midOffset, 0);
      this.graduationCtx.lineTo(midOffset + 2, 5);
      this.graduationCtx.stroke();
      this.graduationCtx.beginPath();
      this.graduationCtx.moveTo(midOffset, 0);
      this.graduationCtx.lineTo(midOffset - 2, 5);
      this.graduationCtx.stroke();
    });
  }
  setWaterfallRange(waterfallL, waterfallR) {
    if (waterfallL >= waterfallR) {
      return;
    }
    const width = waterfallR - waterfallL;
    if (waterfallL < 0 && waterfallR > this.waterfallMaxSize) {
      waterfallL = 0;
      waterfallR = this.waterfallMaxSize;
    } else if (waterfallL < 0) {
      waterfallL = 0;
      waterfallR = width;
    } else if (waterfallR > this.waterfallMaxSize) {
      waterfallR = this.waterfallMaxSize;
      waterfallL = waterfallR - width;
    }
    const prevL = this.waterfallL;
    const prevR = this.waterfallR;
    this.waterfallL = waterfallL;
    this.waterfallR = waterfallR;
    this.waterfallSocket.send(JSON.stringify({
      cmd: "window",
      l: this.waterfallL,
      r: this.waterfallR
    }));
    const newCanvasX1 = this.idxToCanvasX(prevL);
    const newCanvasX2 = this.idxToCanvasX(prevR);
    const newCanvasWidth = newCanvasX2 - newCanvasX1;
    this.ctx.drawImage(this.canvasElem, 0, 0, this.canvasWidth, this.canvasHeight, newCanvasX1, 0, newCanvasWidth, this.canvasHeight);
    if (prevR - prevL <= waterfallR - waterfallL) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, newCanvasX1, this.canvasHeight);
      this.ctx.fillRect(newCanvasX2, 0, this.canvasWidth - newCanvasX2, this.canvasHeight);
    }
    this.updateGraduation();
    this.resetRedrawTimeout(500);
  }
  getWaterfallRange() {
    return [this.waterfallL, this.waterfallR];
  }
  setWaterfallLagTime(lagTime) {
    this.lagTime = Math.max(0, lagTime);
  }
  setOffset(offset2) {
    this.waterfallColourShift = offset2;
    this.resetRedrawTimeout(100);
  }
  setAlpha(alpha) {
    this.spectrumAlpha = alpha;
  }
  setColormapArray(colormap2) {
    this.colormap = computeColormapArray(colormap2);
  }
  setColormap(name) {
    this.setColormapArray(getColormap(name));
    this.resetRedrawTimeout(50);
  }
  setUserID(userID) {
    this.waterfallSocket.send(JSON.stringify({
      cmd: "userid",
      userid: userID
    }));
  }
  setSpectrum(spectrum) {
    this.spectrum = spectrum;
  }
  setWaterfall(waterfall2) {
    this.waterfall = waterfall2;
  }
  resetRedrawTimeout(timeout) {
    if (this.updateTimeout !== void 0) {
      clearTimeout(this.updateTimeout);
    }
    this.updateTimeout = setTimeout(this.redrawWaterfall.bind(this), timeout);
  }
  canvasWheel(e) {
    const x = (e.coords || { x: this.getMouseX(this.spectrumCanvasElem, e) }).x;
    e.preventDefault();
    const zoomAmount = e.deltaY || e.scale;
    const l = this.waterfallL;
    const r = this.waterfallR;
    const scale = e.scaleAmount || 0.85;
    if (r - l <= 128 && zoomAmount < 0) {
      return false;
    }
    const centerfreq = (r - l) * x / this.canvasWidth + l;
    let widthL = centerfreq - l;
    let widthR = r - centerfreq;
    if (zoomAmount < 0) {
      widthL *= scale;
      widthR *= scale;
    } else if (zoomAmount > 0) {
      widthL *= 1 / scale;
      widthR *= 1 / scale;
    }
    const waterfallL = Math.round(centerfreq - widthL);
    const waterfallR = Math.round(centerfreq + widthR);
    this.setWaterfallRange(waterfallL, waterfallR);
    return false;
  }
  mouseMove(e) {
    const mouseMovement = e.movementX;
    const frequencyMovement = Math.round(mouseMovement / this.canvasElem.getBoundingClientRect().width * (this.waterfallR - this.waterfallL));
    if (!frequencyMovement) {
      return;
    }
    const newL = this.waterfallL - frequencyMovement;
    const newR = this.waterfallR - frequencyMovement;
    this.setWaterfallRange(newL, newR);
  }
  spectrumMouseMove(e) {
    const x = this.getMouseX(this.spectrumCanvasElem, e);
    const freq = this.canvasXtoFreq(x);
    this.spectrumFreq = freq;
    this.spectrumX = x;
  }
  spectrumMouseLeave(e) {
    this.spectrumFreq = void 0;
    this.spectrumX = void 0;
  }
}
class SpectrumEvent {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.signalClients = {};
    this.lastModified = performance.now();
  }
  init() {
    if (this.promise) {
      return this.promise;
    }
    this.eventSocket = new WebSocket(this.endpoint);
    this.eventSocket.binaryType = "arraybuffer";
    this.eventSocket.onmessage = this.socketMessage.bind(this);
    this.promise = new Promise((resolve, reject) => {
      this.eventSocket.onopen = resolve;
      this.resolvePromise = resolve;
      this.rejectPromise = reject;
    });
    return this.promise;
  }
  socketMessage(event) {
    const data2 = JSON.parse(event.data);
    this.data = data2;
    if ("signal_list" in data2) {
      this.signalClients = data2.signal_list;
    }
    if ("signal_changes" in data2) {
      const signalChanges = data2.signal_changes;
      for (const [user, range] of Object.entries(signalChanges)) {
        if (range[0] === -1 && range[1] === -1) {
          delete this.signalClients[user];
        } else {
          this.signalClients[user] = range;
        }
      }
    }
    this.lastModified = performance.now();
  }
  setUserID(userID) {
    this.eventSocket.send(JSON.stringify({
      cmd: "userid",
      userid: userID
    }));
  }
  getSignalClients() {
    return this.signalClients;
  }
  getLastModified() {
    return this.lastModified;
  }
}
let nanoid = (size = 21) => crypto.getRandomValues(new Uint8Array(size)).reduce((id2, byte) => {
  byte &= 63;
  if (byte < 36) {
    id2 += byte.toString(36);
  } else if (byte < 62) {
    id2 += (byte - 26).toString(36).toUpperCase();
  } else if (byte > 62) {
    id2 += "-";
  } else {
    id2 += "_";
  }
  return id2;
}, "");
let settings;
const location$1 = window.location;
const baseUri = `${location$1.protocol.replace("http", "ws")}//${location$1.host}`;
const waterfall = new SpectrumWaterfall(baseUri + "/waterfall");
const audio = new SpectrumAudio(baseUri + "/audio");
const events = new SpectrumEvent(baseUri + "/events");
async function init() {
  await initWrappers();
  await Promise.all([waterfall.init(), audio.init(), events.init()]);
  settings = audio.settings;
  const id2 = nanoid();
  [waterfall, audio, events].forEach((s) => {
    s.setUserID(id2);
  });
}
function frequencyToWaterfallOffset(frequency) {
  const [waterfallL, waterfallR] = waterfall.getWaterfallRange();
  const frequencyOffset = frequency - FFTOffsetToFrequency(waterfallL);
  return frequencyOffset / ((waterfallR - waterfallL) / settings.fft_result_size * settings.total_bandwidth);
}
function waterfallOffsetToFrequency(offset2) {
  const [waterfallL, waterfallR] = waterfall.getWaterfallRange();
  const frequencyOffset = offset2 * ((waterfallR - waterfallL) / settings.fft_result_size) * settings.total_bandwidth;
  return frequencyOffset + FFTOffsetToFrequency(waterfallL);
}
function frequencyToFFTOffset(frequency) {
  const offset2 = (frequency - settings.basefreq) / settings.total_bandwidth;
  return offset2 * settings.fft_result_size;
}
function FFTOffsetToFrequency(offset2) {
  const frequency = offset2 / settings.fft_result_size * settings.total_bandwidth;
  return frequency + settings.basefreq;
}
function bandwidthToWaterfallOffset(bandwidth) {
  const [waterfallL, waterfallR] = waterfall.getWaterfallRange();
  return bandwidth / settings.total_bandwidth * settings.fft_result_size / (waterfallR - waterfallL);
}
function getMaximumBandwidth() {
  return audio.trueAudioSps;
}
function getFrequencyView() {
  return waterfall.getWaterfallRange().map(FFTOffsetToFrequency);
}
function create_fragment$6(ctx) {
  let div4;
  let div3;
  let div1;
  let svg0;
  let line0;
  let line1;
  let t0;
  let div0;
  let t1;
  let svg1;
  let line2;
  let line3;
  let t2;
  let div2;
  let div4_resize_listener;
  let mounted;
  let dispose;
  return {
    c() {
      div4 = element("div");
      div3 = element("div");
      div1 = element("div");
      svg0 = svg_element("svg");
      line0 = svg_element("line");
      line1 = svg_element("line");
      t0 = space();
      div0 = element("div");
      t1 = space();
      svg1 = svg_element("svg");
      line2 = svg_element("line");
      line3 = svg_element("line");
      t2 = space();
      div2 = element("div");
      attr(line0, "x1", "100%");
      attr(line0, "y1", "20%");
      attr(line0, "x2", "20%");
      attr(line0, "y2", "100%");
      attr(line0, "class", "stroke-current text-yellow-500 stroke-1 group-hover:stroke-2");
      attr(line1, "x1", "0%");
      attr(line1, "y1", "100%");
      attr(line1, "x2", "20%");
      attr(line1, "y2", "100%");
      attr(line1, "class", "stroke-current text-yellow-500 stroke-1 group-hover:stroke-2");
      attr(svg0, "class", "h-5 w-2 inline absolute group cursor-w-resize z-0");
      set_style(svg0, "right", "100%");
      attr(div0, "class", "w-full h-px bg-yellow-500 align-middle absolute z-10");
      set_style(div0, "top", "20%");
      attr(line2, "x1", "0%");
      attr(line2, "y1", "20%");
      attr(line2, "x2", "80%");
      attr(line2, "y2", "100%");
      attr(line2, "class", "stroke-current text-yellow-500 stroke-1 group-hover:stroke-2");
      attr(line3, "x1", "80%");
      attr(line3, "y1", "100%");
      attr(line3, "x2", "100%");
      attr(line3, "y2", "100%");
      attr(line3, "class", "stroke-current text-yellow-500 stroke-1 group-hover:stroke-2");
      attr(svg1, "class", "h-5 w-2 inline absolute group cursor-e-resize z-0");
      set_style(svg1, "left", "100%");
      attr(div1, "class", "h-full absolute cursor-ew-resize z-10");
      attr(div1, "style", ctx[3]);
      attr(div2, "class", "h-full w-1 bg-transparent mx-auto cursor-ew-resize z-10");
      attr(div3, "class", "h-full w-px bg-yellow-500");
      attr(div3, "style", ctx[2]);
      attr(div4, "class", "w-full h-5 bg-black");
      add_render_callback(() => ctx[21].call(div4));
    },
    m(target, anchor) {
      insert(target, div4, anchor);
      append(div4, div3);
      append(div3, div1);
      append(div1, svg0);
      append(svg0, line0);
      append(svg0, line1);
      append(div1, t0);
      append(div1, div0);
      append(div1, t1);
      append(div1, svg1);
      append(svg1, line2);
      append(svg1, line3);
      append(div3, t2);
      append(div3, div2);
      ctx[20](div4);
      div4_resize_listener = add_resize_listener(div4, ctx[21].bind(div4));
      if (!mounted) {
        dispose = [
          listen(window, "mouseup", ctx[6]),
          listen(window, "mousemove", ctx[5]),
          listen(svg0, "mousedown", ctx[16]),
          listen(svg1, "mousedown", ctx[17]),
          listen(div1, "mousedown", self$1(ctx[18])),
          listen(div2, "mousedown", self$1(ctx[19])),
          listen(div4, "wheel", ctx[15]),
          listen(div4, "mousedown", self$1(ctx[22]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 8) {
        attr(div1, "style", ctx2[3]);
      }
      if (dirty & 4) {
        attr(div3, "style", ctx2[2]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div4);
      ctx[20](null);
      div4_resize_listener();
      mounted = false;
      run_all(dispose);
    }
  };
}
const NoDrag = 0;
const All = 1;
const Left = 2;
const Right = 3;
const Click = 4;
function instance$6($$self, $$props, $$invalidate) {
  const dispatch = createEventDispatcher();
  let draggingState = NoDrag;
  let draggingOffset;
  let draggingTotal;
  let passbandWidth;
  let passbandParent;
  let passbandOffset = -1e3;
  let passbandLeftOffset;
  let passbandRightOffset;
  let maximumSideband;
  let maximumSidebandOffset;
  let cssPassbandOffset;
  let cssPassband;
  function handleMoveStart(e, state) {
    draggingState = state;
    draggingTotal = 0;
    if (draggingState === All) {
      draggingOffset = e.clientX - passbandOffset * passbandWidth;
    } else if (draggingState === Left) {
      draggingOffset = e.clientX - (passbandOffset + passbandLeftOffset) * passbandWidth;
    } else if (draggingState === Right) {
      draggingOffset = e.clientX - (passbandOffset + passbandRightOffset) * passbandWidth;
    }
  }
  function handleMove(e) {
    if (draggingState === Click) {
      draggingTotal += e.movementX;
    } else if (draggingState !== NoDrag) {
      const zero = passbandParent.getBoundingClientRect().x;
      const offsetX = e.clientX - zero - draggingOffset;
      if (draggingState === All) {
        $$invalidate(11, passbandOffset = Math.min(Math.max(-passbandLeftOffset * passbandWidth, offsetX), passbandWidth - passbandRightOffset * passbandWidth) / passbandWidth);
      } else if (draggingState === Left) {
        $$invalidate(12, passbandLeftOffset = Math.min(Math.max(-maximumSidebandOffset, offsetX - passbandOffset * passbandWidth), passbandRightOffset * passbandWidth) / passbandWidth);
      } else if (draggingState === Right) {
        $$invalidate(13, passbandRightOffset = Math.min(Math.max(passbandLeftOffset * passbandWidth, offsetX - passbandOffset * passbandWidth), maximumSidebandOffset) / passbandWidth);
      }
      dispatchPassbandChange();
    }
  }
  function handleMoveEnd(e) {
    if (draggingState === Click && draggingTotal < 5) {
      handlePassbandClick(e);
    }
    draggingState = NoDrag;
    $$invalidate(11, passbandOffset);
  }
  function handlePassbandClick(e) {
    const zero = passbandParent.getBoundingClientRect().x;
    const offsetX = e.clientX - zero;
    $$invalidate(11, passbandOffset = offsetX / passbandWidth);
    dispatchPassbandChange();
  }
  function getOffsetFromEvent(e) {
    const zero = passbandParent.getBoundingClientRect().x;
    const offsetX = e.clientX - zero;
    return offsetX / passbandWidth;
  }
  let dispatchTime = 0;
  function dispatchPassbandChange() {
    const message = [
      passbandOffset + passbandLeftOffset,
      passbandOffset,
      passbandOffset + passbandRightOffset
    ];
    const currentTime = Date.now();
    if (currentTime - dispatchTime > 50) {
      dispatch("change", message);
      dispatchTime = currentTime;
    }
  }
  function changePassband(offsets) {
    const [l, m, r] = offsets;
    $$invalidate(11, passbandOffset = m);
    $$invalidate(12, passbandLeftOffset = l - m);
    $$invalidate(13, passbandRightOffset = r - m);
  }
  function updatePassbandLimits() {
    $$invalidate(14, maximumSideband = bandwidthToWaterfallOffset(getMaximumBandwidth()));
  }
  onMount(() => {
  });
  function wheel_handler(event) {
    bubble.call(this, $$self, event);
  }
  const mousedown_handler = (e) => handleMoveStart(e, Left);
  const mousedown_handler_1 = (e) => handleMoveStart(e, Right);
  const mousedown_handler_2 = (e) => handleMoveStart(e, All);
  const mousedown_handler_3 = (e) => handleMoveStart(e, All);
  function div4_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      passbandParent = $$value;
      $$invalidate(1, passbandParent);
    });
  }
  function div4_elementresize_handler() {
    passbandWidth = this.clientWidth;
    $$invalidate(0, passbandWidth);
  }
  const mousedown_handler_4 = (e) => handleMoveStart(e, Click);
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 16385) {
      maximumSidebandOffset = Math.floor(maximumSideband * passbandWidth) / 2;
    }
    if ($$self.$$.dirty & 2049) {
      $$invalidate(2, cssPassbandOffset = `transform: translate3d(${passbandOffset * passbandWidth - 0.5}px, 0, 0)`);
    }
    if ($$self.$$.dirty & 12289) {
      $$invalidate(3, cssPassband = `transform: translate3d(${passbandLeftOffset * passbandWidth + 0.5}px, 0, 0); width: ${(passbandRightOffset - passbandLeftOffset) * passbandWidth}px`);
    }
  };
  return [
    passbandWidth,
    passbandParent,
    cssPassbandOffset,
    cssPassband,
    handleMoveStart,
    handleMove,
    handleMoveEnd,
    handlePassbandClick,
    getOffsetFromEvent,
    changePassband,
    updatePassbandLimits,
    passbandOffset,
    passbandLeftOffset,
    passbandRightOffset,
    maximumSideband,
    wheel_handler,
    mousedown_handler,
    mousedown_handler_1,
    mousedown_handler_2,
    mousedown_handler_3,
    div4_binding,
    div4_elementresize_handler,
    mousedown_handler_4
  ];
}
class PassbandTuner extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$6, create_fragment$6, safe_not_equal, {
      handlePassbandClick: 7,
      getOffsetFromEvent: 8,
      changePassband: 9,
      updatePassbandLimits: 10
    });
  }
  get handlePassbandClick() {
    return this.$$.ctx[7];
  }
  get getOffsetFromEvent() {
    return this.$$.ctx[8];
  }
  get changePassband() {
    return this.$$.ctx[9];
  }
  get updatePassbandLimits() {
    return this.$$.ctx[10];
  }
}
/*!
 * is-number <https://github.com/jonschlinkert/is-number>
 *
 * Copyright (c) 2014-present, Jon Schlinkert.
 * Released under the MIT License.
 */
var isNumber$1 = function(num) {
  if (typeof num === "number") {
    return num - num === 0;
  }
  if (typeof num === "string" && num.trim() !== "") {
    return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
  }
  return false;
};
const FrequencyInput_svelte_svelte_type_style_lang = "";
function create_fragment$5(ctx) {
  let div;
  let input;
  let t0;
  let span;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      input = element("input");
      t0 = space();
      span = element("span");
      span.textContent = `${frequencyUnit}`;
      attr(input, "type", "number");
      attr(input, "class", "text-2xl font-mono text-white bg-transparent text-center appearance-none svelte-1n8n5wk");
      attr(span, "class", "text-white m-2 text-2xl");
      attr(div, "class", "w-full md-2 items-center bg-black");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, input);
      set_input_value(input, ctx[0]);
      append(div, t0);
      append(div, span);
      if (!mounted) {
        dispose = [
          listen(input, "input", ctx[6]),
          listen(input, "change", ctx[1])
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 1 && to_number(input.value) !== ctx2[0]) {
        set_input_value(input, ctx2[0]);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      mounted = false;
      run_all(dispose);
    }
  };
}
const frequencyUnit = "MHz";
function instance$5($$self, $$props, $$invalidate) {
  const dispatch = createEventDispatcher();
  let frequency = 0;
  let frequencyDecimals;
  let frequencyDisplay;
  const frequencyUnitMappings = { Hz: 0, kHz: 3, MHz: 6, GHz: 9 };
  function handleFrequencyChange(e) {
    if (!isNumber$1(frequencyDisplay)) {
      updateDisplay();
      return;
    }
    let enteredFrequency = parseFloat(frequencyDisplay);
    enteredFrequency *= Math.pow(10, frequencyDecimals);
    if (checkFrequency(enteredFrequency)) {
      $$invalidate(5, frequency = enteredFrequency);
      dispatch("change", enteredFrequency);
    }
    updateDisplay();
  }
  function updateDisplay(f) {
    $$invalidate(0, frequencyDisplay = (frequency / Math.pow(10, frequencyDecimals)).toFixed(frequencyDecimals));
  }
  function checkFrequency(f) {
    const lo = audio.baseFreq;
    const hi = lo + audio.totalBandwidth;
    return f >= lo && f < hi;
  }
  function setFrequency(f) {
    if (checkFrequency(f)) {
      $$invalidate(5, frequency = f);
    }
  }
  function getFrequency() {
    return frequency;
  }
  function updateFrequencyLimits(lo, hi) {
  }
  updateDisplay();
  function input_input_handler() {
    frequencyDisplay = to_number(this.value);
    $$invalidate(0, frequencyDisplay);
  }
  $$self.$$.update = () => {
    if ($$self.$$.dirty & 32) {
      updateDisplay();
    }
  };
  frequencyDecimals = frequencyUnitMappings[frequencyUnit];
  return [
    frequencyDisplay,
    handleFrequencyChange,
    setFrequency,
    getFrequency,
    updateFrequencyLimits,
    frequency,
    input_input_handler
  ];
}
class FrequencyInput extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$5, create_fragment$5, safe_not_equal, {
      setFrequency: 2,
      getFrequency: 3,
      updateFrequencyLimits: 4
    });
  }
  get setFrequency() {
    return this.$$.ctx[2];
  }
  get getFrequency() {
    return this.$$.ctx[3];
  }
  get updateFrequencyLimits() {
    return this.$$.ctx[4];
  }
}
function ge(a, y, c, l, h) {
  var i = h + 1;
  while (l <= h) {
    var m = l + h >>> 1, x = a[m];
    var p = c !== void 0 ? c(x, y) : x - y;
    if (p >= 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function gt(a, y, c, l, h) {
  var i = h + 1;
  while (l <= h) {
    var m = l + h >>> 1, x = a[m];
    var p = c !== void 0 ? c(x, y) : x - y;
    if (p > 0) {
      i = m;
      h = m - 1;
    } else {
      l = m + 1;
    }
  }
  return i;
}
function lt(a, y, c, l, h) {
  var i = l - 1;
  while (l <= h) {
    var m = l + h >>> 1, x = a[m];
    var p = c !== void 0 ? c(x, y) : x - y;
    if (p < 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function le(a, y, c, l, h) {
  var i = l - 1;
  while (l <= h) {
    var m = l + h >>> 1, x = a[m];
    var p = c !== void 0 ? c(x, y) : x - y;
    if (p <= 0) {
      i = m;
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return i;
}
function eq(a, y, c, l, h) {
  while (l <= h) {
    var m = l + h >>> 1, x = a[m];
    var p = c !== void 0 ? c(x, y) : x - y;
    if (p === 0) {
      return m;
    }
    if (p <= 0) {
      l = m + 1;
    } else {
      h = m - 1;
    }
  }
  return -1;
}
function norm(a, y, c, l, h, f) {
  if (typeof c === "function") {
    return f(a, y, c, l === void 0 ? 0 : l | 0, h === void 0 ? a.length - 1 : h | 0);
  }
  return f(a, y, void 0, c === void 0 ? 0 : c | 0, l === void 0 ? a.length - 1 : l | 0);
}
var searchBounds = {
  ge: function(a, y, c, l, h) {
    return norm(a, y, c, l, h, ge);
  },
  gt: function(a, y, c, l, h) {
    return norm(a, y, c, l, h, gt);
  },
  lt: function(a, y, c, l, h) {
    return norm(a, y, c, l, h, lt);
  },
  le: function(a, y, c, l, h) {
    return norm(a, y, c, l, h, le);
  },
  eq: function(a, y, c, l, h) {
    return norm(a, y, c, l, h, eq);
  }
};
const builtinShortwave = [
  {
    f: 2485e3,
    d: "Vanuatu Broadcasting and Television Corporation",
    m: "AM"
  },
  {
    f: 3185e3,
    d: "Blue Ridge Communications, Inc.",
    m: "AM"
  },
  {
    f: 3195e3,
    d: "Blue Ridge Communications, Inc.\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 3215e3,
    d: "Blue Ridge Communications, Inc.\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 3265e3,
    d: "Allan H. Weiner",
    m: "AM"
  },
  {
    f: 3325e3,
    d: "Radio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 39e5,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 3915e3,
    d: "BBC Worldservice",
    m: "AM"
  },
  {
    f: 393e4,
    d: "The Overcomer Ministry",
    m: "AM"
  },
  {
    f: 3945e3,
    d: "Vanuatu Broadcasting and Television Corporation",
    m: "AM"
  },
  {
    f: 395e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 3955e3,
    d: "BBC Worldservice\nChannel 292 (Germany)\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 396e4,
    d: "BBC Worldservice",
    m: "AM"
  },
  {
    f: 3965e3,
    d: "TDF (France)",
    m: "AM"
  },
  {
    f: 3975e3,
    d: "Shortwave Radio Services (Germany)",
    m: "AM"
  },
  {
    f: 3985e3,
    d: "China National Radio\nRadio 700",
    m: "AM"
  },
  {
    f: 399e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 3995e3,
    d: "Media Broadcast GmbH\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 45e5,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 475e4,
    d: "China National Radio\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 476e4,
    d: "All India Radio\nTrans World Radio",
    m: "AM"
  },
  {
    f: 48e5,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 482e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 483e4,
    d: "Mongol Radio & Television",
    m: "AM"
  },
  {
    f: 4835e3,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 484e4,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 485e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 487e4,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 4895e3,
    d: "Mongol Radio & Television",
    m: "AM"
  },
  {
    f: 4905e3,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 492e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 493e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 495e4,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 496e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 4965e3,
    d: "Voice of Hope",
    m: "AM"
  },
  {
    f: 498e4,
    d: "China National Radio\nRadio Miami International",
    m: "AM"
  },
  {
    f: 499e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 501e4,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 502e4,
    d: "Solomon Islands Broadcasting",
    m: "AM"
  },
  {
    f: 504e4,
    d: "All India Radio\nVanuatu Broadcasting and Television Corporation",
    m: "AM"
  },
  {
    f: 505e4,
    d: "All India Radio\nBlue Ridge Communications, Inc.\nChina National Radio",
    m: "AM"
  },
  {
    f: 506e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 5085e3,
    d: "Leap of Faith, Inc.",
    m: "AM"
  },
  {
    f: 513e4,
    d: "Allan H. Weiner",
    m: "AM"
  },
  {
    f: 58e5,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 582e4,
    d: "Encompass Digital Media Services\nFor new organization",
    m: "AM"
  },
  {
    f: 583e4,
    d: "Leap of Faith, Inc.",
    m: "AM"
  },
  {
    f: 5835e3,
    d: "Pakistan Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 5845e3,
    d: "BBC Worldservice",
    m: "AM"
  },
  {
    f: 585e4,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 586e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 5875e3,
    d: "BBC Worldservice\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 588e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 5885e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 589e4,
    d: "BBC Worldservice\nPakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 5895e3,
    d: "BBC Worldservice\nFor new organization\nIBRA Radio\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 59e5,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 5905e3,
    d: "China Radio International\nDeutscher Wetterdienst",
    m: "AM"
  },
  {
    f: 591e4,
    d: "China Radio International\nHFCC, Intl. Radio for Disaster Relief project\nRadio Romania International",
    m: "AM"
  },
  {
    f: 5915e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 592e4,
    d: "Korean Broadcasting System\nLeSea Broadcasting Corporation\nRadio Romania International\nVoice of Russia\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 5925e3,
    d: "China National Radio\nDeutsche Welle\nIslamic Republic of Iran Broadcasting\nRadio France Internationale\nRadio Romania International\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 593e4,
    d: "BBC Worldservice\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nMedia Broadcast GmbH\nRadio Romania International\nWorld Music Radio",
    m: "AM"
  },
  {
    f: 5935e3,
    d: "BBC Worldservice\nChina National Radio\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nMedia Broadcast GmbH\nVoice of Russia\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 594e4,
    d: "IBRA Radio\nIslamic Republic of Iran Broadcasting\nRadio Romania International\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 5945e3,
    d: "BBC Worldservice\nChina National Radio\nEncompass Digital Media Services\nMedia Broadcast GmbH\nTurkish Radio-TV Corp\nVoice of Russia",
    m: "AM"
  },
  {
    f: 595e4,
    d: "Korean Broadcasting System\nMedia Broadcast GmbH\nRadio Miami International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 5955e3,
    d: "Abu Dhabi Media Company\nBroccoli Trash Metal & Grunge, Netherlands\nChina Radio International\nJapan International Communications\nRadio Romania International",
    m: "AM"
  },
  {
    f: 596e4,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nMedia Broadcast GmbH\nMinistry of Information - State of Kuwait\nRadio France Internationale\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 5965e3,
    d: "China National Radio\nChina Radio International\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 597e4,
    d: "China National Radio\nChina Radio International\nEternal Word Television Network, Inc.\nIslamic Republic of Iran Broadcasting\nRadio208\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 5975e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nKorean Broadcasting System\nRadio New Zealand\nRadio Republic of Indonesia\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 598e4,
    d: "BBC Worldservice\nChina Radio International\nMedia Broadcast GmbH\nRadio OZ-Viola\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nVatican Radio",
    m: "AM"
  },
  {
    f: 5985e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nJapan International Communications\nNippon Hoso Kyokai\nRadio Miami International\nRadio Republic of Indonesia\nTelediffusion d'Algerie\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 599e4,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nRadio Romania International\nStudio Denakker",
    m: "AM"
  },
  {
    f: 5995e3,
    d: "China National Radio\nMedia Broadcast GmbH\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 6e6,
    d: "All India Radio\nChina National Radio\nFor new organization\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nNippon Hoso Kyokai\nTurkish Radio-TV Corp\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6005e3,
    d: "BBC Worldservice\nFor new organization\nRadio 700\nRadio Delta International\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 601e4,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nFor new organization\nVatican Radio",
    m: "AM"
  },
  {
    f: 6015e3,
    d: "China National Radio\nKorean Broadcasting System\nThe Overcomer Ministry\nVoice of Russia",
    m: "AM"
  },
  {
    f: 602e4,
    d: "China Radio International\nJapan International Communications\nKorean Broadcasting System\nRadio Delta International\nRadio Romania International\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 6025e3,
    d: "China National Radio\nChina Radio International\nRadio Republic of Indonesia\nRadio Romania International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 603e4,
    d: "All India Radio\nChina National Radio\nMedia Broadcast GmbH\nRadio Romania International\nRadio SWS (Germany)\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 6035e3,
    d: "China National Radio\nFar East Broadcasting Company",
    m: "AM"
  },
  {
    f: 604e4,
    d: "China National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System\nRadio France Internationale\nRadio Romania International\nTelediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6045e3,
    d: "Encompass Digital Media Services\nJapan International Communications\nMedia Broadcast GmbH\nRadio 700",
    m: "AM"
  },
  {
    f: 605e4,
    d: "China National Radio\nMinistry of Information - State of Kuwait\nRadio Television Malaysia\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 6055e3,
    d: "Adventist World Radio\nChina Radio International\nKorean Broadcasting System\nMedia Broadcast GmbH\nNihon Short-wave Broadc. Co.\nRadio OZ-Viola",
    m: "AM"
  },
  {
    f: 606e4,
    d: "China National Radio\nChina Radio International\nFor new organization\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nTelediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 6065e3,
    d: "Adventist World Radio\nChina National Radio\nChina Radio International\nKorean Broadcasting System\nVoice of Hope",
    m: "AM"
  },
  {
    f: 607e4,
    d: "Abu Dhabi Media Company\nChannel 292 (Germany)\nChina Radio International\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nMedia Broadcast GmbH\nOesterreichischer Rundfunk\nRadio Republic of Indonesia\nTurkish Radio-TV Corp\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6075e3,
    d: "China National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 608e4,
    d: "China National Radio\nChina Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 6085e3,
    d: "All India Radio\nJapan International Communications\nRadio 700",
    m: "AM"
  },
  {
    f: 609e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nChina Radio International\nKorean Broadcasting System\nNippon Hoso Kyokai\nPlummer Applications\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6095e3,
    d: "BBC Worldservice\nChina Radio International\nJapan International Communications\nKorean Broadcasting System\nMedia Broadcast GmbH\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 61e5,
    d: "All India Radio\nChina Radio International\nKorean Broadcasting System\nRadio Television Malaysia\nTrans World Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6105e3,
    d: "China National Radio\nChina Radio International\nNippon Hoso Kyokai\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 611e4,
    d: "All India Radio\nChina National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nVoice of Russia\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 6115e3,
    d: "China Radio International\nJapan International Communications\nNihon Short-wave Broadc. Co.\nRadio New Zealand\nSE-TA 2 (Germany)\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 612e4,
    d: "Adventist World Radio\nChina National Radio\nMedia Broadcast GmbH\nTurkish Radio-TV Corp\nVoice of Russia",
    m: "AM"
  },
  {
    f: 6125e3,
    d: "China National Radio\nRadio Europe Netherlands\nRadio Republic of Indonesia\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 613e4,
    d: "Adventist World Radio\nChina National Radio\nJapan International Communications",
    m: "AM"
  },
  {
    f: 6135e3,
    d: "BBC Worldservice\nChina Radio International\nJapan International Communications\nKorean Broadcasting System\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 614e4,
    d: "BBC Worldservice\nChina Radio International\nMedia Broadcast GmbH\nRadio Onda ASBL\nTelediffusion d'Algerie\nVatican Radio",
    m: "AM"
  },
  {
    f: 6145e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nJapan International Communications\nMedia Broadcast GmbH\nRadio Romania International\nTelediffusion d'Algerie\nVoice of Russia",
    m: "AM"
  },
  {
    f: 615e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina Radio International\nEuropa 24 (Germany)\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 6155e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nFor new organization\nKorean Broadcasting System\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nOesterreichischer Rundfunk",
    m: "AM"
  },
  {
    f: 616e4,
    d: "Allan H. Weiner\nChina Radio International\nShortwave Radio Services (Germany)",
    m: "AM"
  },
  {
    f: 6165e3,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nNippon Hoso Kyokai\nTrans World Radio\nVoice of Russia\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 617e4,
    d: "Far East Broadcasting Company\nKorean Broadcasting System\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 6175e3,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 618e4,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nDeutscher Wetterdienst\nEncompass Digital Media Services\nJapan International Communications\nKoode Radio International\nRadio Romania International\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 6185e3,
    d: "Adventist World Radio\nChina Radio International\nRadio Piepzender\nRadio Republic of Indonesia\nVatican Radio",
    m: "AM"
  },
  {
    f: 619e4,
    d: "China National Radio\nChina Radio International\nNippon Hoso Kyokai\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 6195e3,
    d: "BBC Worldservice\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 62e5,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 624e4,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 7205e3,
    d: "China National Radio\nChina Radio International\nRadio France Internationale\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 721e4,
    d: "China National Radio\nChina Radio International\nVoice of Russia\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 7215e3,
    d: "China National Radio\nChina Radio International\nFor new organization\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 722e4,
    d: "China National Radio\nChina Radio International\nDeutsche Welle\nMedia Broadcast GmbH\nRadio Romania International\nRockpower\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 7225e3,
    d: "Abu Dhabi Media Company\nAdventist World Radio\nChina National Radio\nChina Radio International\nFor new organization\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nRadio Miami International\nVatican Radio",
    m: "AM"
  },
  {
    f: 723e4,
    d: "China National Radio\nDeutsche Welle\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nVatican Radio",
    m: "AM"
  },
  {
    f: 7235e3,
    d: "China Radio International\nDeutsche Welle\nKorean Broadcasting System\nRadio Republic of Indonesia\nRadio Romania International\nVatican Radio",
    m: "AM"
  },
  {
    f: 724e4,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nKorean Broadcasting System\nRadio Republic of Indonesia\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 7245e3,
    d: "China National Radio\nChina Radio International\nFor new organization\nJapan International Communications\nNippon Hoso Kyokai\nRadio France Internationale\nRadio Russia\nTrans World Radio\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 725e4,
    d: "China Radio International\nJapan International Communications\nKorean Broadcasting System\nMinistry of Information - State of Kuwait\nTelediffusion d'Algerie\nVatican Radio",
    m: "AM"
  },
  {
    f: 7255e3,
    d: "China National Radio\nChina Radio International\nKorean Broadcasting System\nMedia Broadcast GmbH\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 726e4,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nMongol Radio & Television\nVanuatu Broadcasting and Television Corporation",
    m: "AM"
  },
  {
    f: 7265e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nNippon Hoso Kyokai\nTDF (France)\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 727e4,
    d: "Adventist World Radio\nChina National Radio\nJapan International Communications\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 7275e3,
    d: "China National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 728e4,
    d: "Japan International Communications\nTrans World Radio\nTurkish Radio-TV Corp\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 7285e3,
    d: "BBC Worldservice\nChina Radio International\nJapan International Communications\nRadio New Zealand\nTurkish Radio-TV Corp\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 729e4,
    d: "ANTI, Milano\nAbu Dhabi Media Company\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nIslamic Republic of Iran Broadcasting\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7295e3,
    d: "All India Radio\nBBC Worldservice\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nJapan International Communications\nMedia Broadcast GmbH\nRadio France Internationale\nRadio Republic of Indonesia\nRadio Television Malaysia\nTelediffusion d'Algerie\nVoice of Russia",
    m: "AM"
  },
  {
    f: 73e5,
    d: "Adventist World Radio\nBBC Worldservice\nChina National Radio\nChina Radio International\nHCJB Australia\nIslamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 7305e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nKorean Broadcasting System\nVatican Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 731e4,
    d: "China National Radio\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nRadio 700\nRadio Romania International",
    m: "AM"
  },
  {
    f: 7315e3,
    d: "China National Radio\nChina Radio International\nEncompass Digital Media Services\nFree Press Unlimited (Amsterdam)\nLeSea Broadcasting Corporation\nMedia Broadcast GmbH\nTelediffusion d'Algerie\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 732e4,
    d: "China Radio International\nJapan International Communications\nRadio Romania International\nVatican Radio",
    m: "AM"
  },
  {
    f: 7325e3,
    d: "Adventist World Radio\nChina Radio International\nJapan International Communications\nMedia Broadcast GmbH\nRadio Romania International",
    m: "AM"
  },
  {
    f: 733e4,
    d: "China Radio International\nJapan International Communications\nMedia Broadcast GmbH\nRadio New Zealand\nRadio Romania International",
    m: "AM"
  },
  {
    f: 7335e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nJapan International Communications\nLeSea Broadcasting Corporation\nTelediffusion d'Algerie\nVoice of Russia",
    m: "AM"
  },
  {
    f: 734e4,
    d: "China National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nJapan International Communications\nMedia Broadcast GmbH\nRadio Delta International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7345e3,
    d: "China National Radio\nChina Radio International\nFor new organization\nJapan International Communications\nRadio Romania International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 735e4,
    d: "Adventist World Radio\nBroadcast Belgium\nChina National Radio\nChina Radio International\nMedia Broadcast GmbH\nRadio 700\nRadio Romania International",
    m: "AM"
  },
  {
    f: 7355e3,
    d: "BBC Worldservice\nChina Radio International\nIslamic Republic of Iran Broadcasting\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 736e4,
    d: "Broadcast Belgium\nChina National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nRadio Romania International\nVatican Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 7365e3,
    d: "China National Radio\nChina Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)\nVatican Radio\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 737e4,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nRadio Romania International\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 7375e3,
    d: "China National Radio\nJapan International Communications\nMedia Broadcast GmbH\nRadio Romania International\nTelediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 738e4,
    d: "China Radio International\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nRadio France Internationale\nWorld International Broadcasters, Inc.",
    m: "AM"
  },
  {
    f: 7385e3,
    d: "China National Radio\nChina Radio International\nJapan International Communications\nLeSea Broadcasting Corporation\nVoice of Russia",
    m: "AM"
  },
  {
    f: 739e4,
    d: "China Radio International\nRadio France Internationale\nRadio New Zealand\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 7395e3,
    d: "China Radio International\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 74e5,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 741e4,
    d: "Adventist World Radio\nChina National Radio\nChina Radio International\nJapan International Communications\nMedia Broadcast GmbH\nRadio Romania International\nTrans World Radio\nVatican Radio",
    m: "AM"
  },
  {
    f: 7415e3,
    d: "China Radio International\nSPW Radio Warsaw - Transatlantic Radio Station Cultural Park Association (Poland)",
    m: "AM"
  },
  {
    f: 742e4,
    d: "China National Radio\nChina Radio International\nRadio Romania International\nVatican Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 7425e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nRadio Piepzender\nVoice of Russia",
    m: "AM"
  },
  {
    f: 743e4,
    d: "China National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nSPW Radio Warsaw - Transatlantic Radio Station Cultural Park Association (Poland)\nVoice of Greece",
    m: "AM"
  },
  {
    f: 7435e3,
    d: "China Radio International\nJapan International Communications\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 744e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 7445e3,
    d: "BBC Worldservice\nChina Radio International\nKorean Broadcasting System\nNippon Hoso Kyokai\nRadio Piepzender\nVoice of Russia",
    m: "AM"
  },
  {
    f: 745e4,
    d: "China National Radio\nNippon Hoso Kyokai\nVoice of Greece",
    m: "AM"
  },
  {
    f: 7455e3,
    d: "Broadcast Belgium\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 746e4,
    d: "Pakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7465e3,
    d: "BBC Worldservice\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 747e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7475e3,
    d: "NBS of Thailand\nPakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)\nVoice of Greece",
    m: "AM"
  },
  {
    f: 748e4,
    d: "For new organization\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7485e3,
    d: "BBC Worldservice\nVatican Radio",
    m: "AM"
  },
  {
    f: 749e4,
    d: "Allan H. Weiner\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 7495e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 75e5,
    d: "Trans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7505e3,
    d: "For new organization\nLeSea Broadcasting Corporation\nWRNO Worldwide, Inc.",
    m: "AM"
  },
  {
    f: 751e4,
    d: "IBRA Radio\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7515e3,
    d: "Broadcast Belgium\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 752e4,
    d: "LeSea Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 7525e3,
    d: "Encompass Digital Media Services\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 753e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7535e3,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 754e4,
    d: "Pakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7545e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 755e4,
    d: "BBC Worldservice\nEncompass Digital Media Services\nFor new organization",
    m: "AM"
  },
  {
    f: 7555e3,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 756e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7565e3,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 757e4,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 758e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 7585e3,
    d: "Encompass Digital Media Services\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 759e4,
    d: "For new organization\nTrans World Radio",
    m: "AM"
  },
  {
    f: 773e4,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 778e4,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 9265e3,
    d: "World International Broadcasters, Inc.",
    m: "AM"
  },
  {
    f: 9275e3,
    d: "Assemblies of Yahweh\nFar East Broadcasting Company",
    m: "AM"
  },
  {
    f: 93e5,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 9305e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9315e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9325e3,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 933e4,
    d: "Allan H. Weiner",
    m: "AM"
  },
  {
    f: 9335e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9345e3,
    d: "Far East Broadcasting Company",
    m: "AM"
  },
  {
    f: 935e4,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 9355e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 937e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 938e4,
    d: "Trans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9385e3,
    d: "Eternal Word Television Network, Inc.\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 939e4,
    d: "Islamic Republic of Iran Broadcasting\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9395e3,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 94e5,
    d: "Far East Broadcasting Company\nFor new organization",
    m: "AM"
  },
  {
    f: 9405e3,
    d: "Far East Broadcasting Company",
    m: "AM"
  },
  {
    f: 941e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nChina Radio International\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9415e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 942e4,
    d: "China National Radio\nIslamic Republic of Iran Broadcasting\nVoice of Greece\nVoice of Russia",
    m: "AM"
  },
  {
    f: 943e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 944e4,
    d: "BBC Worldservice\nChina Radio International\nEgypt Radio & TV Union\nFar East Broadcasting Company\nMedia Broadcast GmbH\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9445e3,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 945e4,
    d: "Adventist World Radio\nChina Radio International\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9455e3,
    d: "China Radio International\nJapan International Communications\nRadio Miami International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 946e4,
    d: "Adventist World Radio\nChina Radio International\nJapan International Communications\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9465e3,
    d: "BBC Worldservice\nFor new organization\nMedia Broadcast GmbH\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 947e4,
    d: "Adventist Broadcasting Service, Inc.\nChina National Radio\nChina Radio International\nEternal Word Television Network, Inc.\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9475e3,
    d: "Islamic Republic of Iran Broadcasting\nLeap of Faith, Inc.\nMedia Broadcast GmbH\nPhilippines Broadcasting Service",
    m: "AM"
  },
  {
    f: 948e4,
    d: "Abu Dhabi Media Company\nChina National Radio\nFor new organization\nNippon Hoso Kyokai\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9485e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 949e4,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nFor new organization\nMedia Broadcast GmbH\nRadio Miami International\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9495e3,
    d: "Adventist World Radio\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 95e5,
    d: "China National Radio\nTelediffusion d'Algerie\nTrans World Radio\nVoice of Russia\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 9505e3,
    d: "LeSea Broadcasting Corporation\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 951e4,
    d: "ANTI, Milano\nAdventist World Radio\nBBC Worldservice\nChina National Radio\nEgypt Radio & TV Union\nIslamic Republic of Iran Broadcasting\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9515e3,
    d: "Adventist World Radio\nChina National Radio\nChina Radio International\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 952e4,
    d: "China National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 9525e3,
    d: "Broadcast Belgium\nChina Radio International\nKorean Broadcasting System\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 953e4,
    d: "China National Radio\nIslamic Republic of Iran Broadcasting\nRadio Onda ASBL\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 9535e3,
    d: "China Radio International\nEncompass Digital Media Services\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 954e4,
    d: "BBC Worldservice\nChina Radio International\nFar East Broadcasting Company\nIBRA Radio\nMedia Broadcast GmbH\nPakistan Broadcasting Corporation\nVoice of Russia\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 9545e3,
    d: "BBC Worldservice\nChina National Radio\nEgypt Radio & TV Union\nRadio Republic of Indonesia\nSolomon Islands Broadcasting",
    m: "AM"
  },
  {
    f: 955e4,
    d: "Broadcast Belgium\nChina Radio International\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 9555e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nDeutsche Welle",
    m: "AM"
  },
  {
    f: 956e4,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nMedia Broadcast GmbH\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 9565e3,
    d: "China Radio International\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 957e4,
    d: "China National Radio\nChina Radio International\nDeutsche Welle\nKorean Broadcasting System\nMedia Broadcast GmbH\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 9575e3,
    d: "Pakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 958e4,
    d: "BBC Worldservice\nChina National Radio\nKorean Broadcasting System\nNippon Hoso Kyokai\nVatican Radio\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 9585e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina Radio International\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 959e4,
    d: "China Radio International\nMedia Broadcast GmbH\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9595e3,
    d: "Nihon Short-wave Broadc. Co.\nTurkish Radio-TV Corp\nVatican Radio",
    m: "AM"
  },
  {
    f: 96e5,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nRadio Romania International",
    m: "AM"
  },
  {
    f: 9605e3,
    d: "LeSea Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 961e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina National Radio\nChina Radio International\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nRadio Romania International\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 9615e3,
    d: "Abu Dhabi Media Company\nChina Radio International\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 962e4,
    d: "All India Radio\nChina National Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nRadio Romania International\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9625e3,
    d: "Nippon Hoso Kyokai\nTurkish Radio-TV Corp\nVoice of Russia\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 963e4,
    d: "Abu Dhabi Media Company\nAdventist World Radio\nChina National Radio\nChina Radio International\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 9635e3,
    d: "Encompass Digital Media Services\nRadio France Internationale\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 964e4,
    d: "China Radio International\nKorean Broadcasting System\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9645e3,
    d: "Adventist Broadcasting Service, Inc.\nChina National Radio\nChina Radio International\nKorean Broadcasting System\nVatican Radio",
    m: "AM"
  },
  {
    f: 965e4,
    d: "Voice of Russia",
    m: "AM"
  },
  {
    f: 9655e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nNippon Hoso Kyokai\nVoice of Russia",
    m: "AM"
  },
  {
    f: 966e4,
    d: "China National Radio\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 9665e3,
    d: "China National Radio\nChina Radio International\nRadio France Internationale\nTelediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 967e4,
    d: "Channel 292 (Germany)\nNippon Hoso Kyokai\nPakistan Broadcasting Corporation\nRadio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9675e3,
    d: "Broadcast Belgium\nChina National Radio\nChina Radio International\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 968e4,
    d: "China National Radio\nNippon Hoso Kyokai\nRadio France Internationale\nRadio Republic of Indonesia\nVoice of Hope\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 9685e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 969e4,
    d: "China Radio International\nEncompass Digital Media Services\nJapan International Communications\nKorean Broadcasting System\nRadio Exterior de Espana\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9695e3,
    d: "China Radio International\nJapan International Communications\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 97e5,
    d: "For new organization\nNippon Hoso Kyokai\nRadio New Zealand\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9705e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nEncompass Digital Media Services\nVatican Radio",
    m: "AM"
  },
  {
    f: 971e4,
    d: "China National Radio\nChina Radio International\nRadio France Internationale\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 9715e3,
    d: "Media Broadcast GmbH\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 972e4,
    d: "Abu Dhabi Media Company\nAdventist Broadcasting Service, Inc.\nChina National Radio\nChina Radio International\nUnited States Agency for Global Media (USAGM)\nVatican Radio\nWorld Christian Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 9725e3,
    d: "Islamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 973e4,
    d: "China National Radio\nChina Radio International\nEgypt Radio & TV Union\nMinistry of Information - State of Kuwait\nVoice of Russia\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 9735e3,
    d: "China National Radio\nRadio France Internationale",
    m: "AM"
  },
  {
    f: 974e4,
    d: "Adventist Broadcasting Service, Inc.\nBBC Worldservice\nDeutsche Welle\nKorean Broadcasting System\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nRadio Romania International\nTelediffusion d'Algerie\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9745e3,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nPakistan Broadcasting Corporation\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 975e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nKorean Broadcasting System\nMinistry of Information - State of Kuwait\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9755e3,
    d: "China National Radio\nKorean Broadcasting System\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 976e4,
    d: "China Radio International\nNihon Short-wave Broadc. Co.\nNippon Hoso Kyokai\nRadio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9765e3,
    d: "Adventist World Radio\nChina Radio International\nMedia Broadcast GmbH\nRadio New Zealand\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 977e4,
    d: "Adventist World Radio\nChina Radio International\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 9775e3,
    d: "China National Radio\nIBRA Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 978e4,
    d: "China National Radio\nRadio New Zealand\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 9785e3,
    d: "China National Radio\nChina Radio International\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 979e4,
    d: "Radio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9795e3,
    d: "China Radio International\nFar East Broadcasting Company\nNippon Hoso Kyokai\nPakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 98e5,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nBBC Worldservice\nChina Radio International\nEncompass Digital Media Services\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9805e3,
    d: "Adventist World Radio\nKorean Broadcasting System\nRadio France Internationale",
    m: "AM"
  },
  {
    f: 981e4,
    d: "China National Radio\nEgypt Radio & TV Union\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System\nMedia Broadcast GmbH\nRadio France Internationale\nRadio Romania International\nVatican Radio",
    m: "AM"
  },
  {
    f: 982e4,
    d: "BBC Worldservice\nChina National Radio\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9825e3,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 983e4,
    d: "China National Radio\nDeutsche Welle\nLeSea Broadcasting Corporation\nMedia Broadcast GmbH\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9835e3,
    d: "Islamic Republic of Iran Broadcasting\nNippon Hoso Kyokai\nRadio Television Malaysia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 984e4,
    d: "Abu Dhabi Media Company\nLeSea Broadcasting Corporation\nTurkish Radio-TV Corp\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 9845e3,
    d: "China National Radio\nVoice of Russia\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 985e4,
    d: "China National Radio\nMedia Broadcast GmbH\nVoice of Russia\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 9855e3,
    d: "China Radio International\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 986e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina National Radio\nChina Radio International\nHCJB Australia\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9865e3,
    d: "China Radio International\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 987e4,
    d: "China Radio International\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9875e3,
    d: "Adventist World Radio\nChina Radio International\nFar East Broadcasting Company\nJapan International Communications\nVoice of Russia",
    m: "AM"
  },
  {
    f: 988e4,
    d: "China Radio International\nKorean Broadcasting System\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9885e3,
    d: "Adventist World Radio\nChina National Radio\nEgypt Radio & TV Union\nUnited States Agency for Global Media (USAGM)\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 989e4,
    d: "China National Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 9895e3,
    d: "Abu Dhabi Media Company\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 99e5,
    d: "BBC Worldservice\nBroadcast Belgium\nChina National Radio\nEgypt Radio & TV Union\nFor new organization\nPakistan Broadcasting Corporation\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 991e4,
    d: "BBC Worldservice\nFor new organization\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9915e3,
    d: "BBC Worldservice\nFor new organization\nVoice of Greece",
    m: "AM"
  },
  {
    f: 992e4,
    d: "Far East Broadcasting Company\nFor new organization",
    m: "AM"
  },
  {
    f: 9925e3,
    d: "Media Broadcast GmbH\nPhilippines Broadcasting Service",
    m: "AM"
  },
  {
    f: 993e4,
    d: "Leap of Faith, Inc.\nRepublic of Palau\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9935e3,
    d: "Voice of Greece",
    m: "AM"
  },
  {
    f: 994e4,
    d: "Egypt Radio & TV Union\nFar East Broadcasting Company\nLeap of Faith, Inc.\nNBS of Thailand\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 995e4,
    d: "All India Radio\nFor new organization\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 9955e3,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 9965e3,
    d: "Republic of Palau\nTrans World Radio",
    m: "AM"
  },
  {
    f: 9975e3,
    d: "Broadcast Belgium\nTrans World Radio\nUnited States Agency for Global Media (USAGM)\nVoice of Hope",
    m: "AM"
  },
  {
    f: 998e4,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 9985e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 999e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1151e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1152e4,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 11525e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1153e4,
    d: "Broadcast Belgium\nPakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1154e4,
    d: "Broadcast Belgium",
    m: "AM"
  },
  {
    f: 1155e4,
    d: "Pakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1156e4,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 1157e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1159e4,
    d: "Trans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 116e5,
    d: "China National Radio\nFar East Broadcasting Company\nThe Overcomer Ministry",
    m: "AM"
  },
  {
    f: 1161e4,
    d: "China National Radio\nChina Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 1162e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina National Radio\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nVatican Radio",
    m: "AM"
  },
  {
    f: 1163e4,
    d: "China National Radio\nFor new organization\nMinistry of Information - State of Kuwait\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 11635e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1164e4,
    d: "Adventist World Radio\nChina Radio International\nFree Press Unlimited (Amsterdam)",
    m: "AM"
  },
  {
    f: 11645e3,
    d: "Voice of Greece",
    m: "AM"
  },
  {
    f: 1165e4,
    d: "China Radio International\nFree Press Unlimited (Amsterdam)\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 11655e3,
    d: "Abu Dhabi Media Company\nFor new organization\nIBRA Radio",
    m: "AM"
  },
  {
    f: 1166e4,
    d: "BBC Worldservice\nChina National Radio\nEncompass Digital Media Services\nRadio Romania International\nTrans World Radio\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11665e3,
    d: "Radio Television Malaysia",
    m: "AM"
  },
  {
    f: 1167e4,
    d: "China National Radio\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11675e3,
    d: "Radio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1168e4,
    d: "China National Radio\nChina Radio International\nVoice of Hope",
    m: "AM"
  },
  {
    f: 11685e3,
    d: "China National Radio\nRadio Exterior de Espana\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1169e4,
    d: "Adventist Broadcasting Service, Inc.\nChina Radio International\nMalagasy Glabal Business S.A.\nRadio New Zealand",
    m: "AM"
  },
  {
    f: 11695e3,
    d: "China National Radio\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 117e5,
    d: "China Radio International\nFor new organization\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nRadio France Internationale",
    m: "AM"
  },
  {
    f: 11705e3,
    d: "Malagasy Glabal Business S.A.",
    m: "AM"
  },
  {
    f: 1171e4,
    d: "China National Radio\nChina Radio International\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 11715e3,
    d: "Korean Broadcasting System",
    m: "AM"
  },
  {
    f: 1172e4,
    d: "Adventist World Radio\nChina National Radio\nChina Radio International\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 11725e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina Radio International\nKorean Broadcasting System\nNippon Hoso Kyokai\nRadio New Zealand\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1173e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 11735e3,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 1174e4,
    d: "China National Radio\nChina Radio International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1175e4,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International\nFar East Broadcasting Company\nPakistan Broadcasting Corporation\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11755e3,
    d: "Adventist World Radio",
    m: "AM"
  },
  {
    f: 1176e4,
    d: "China National Radio\nChina Radio International\nRadio France Internationale\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11765e3,
    d: "Radio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1177e4,
    d: "China National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 11775e3,
    d: "Abu Dhabi Media Company\nChina National Radio\nPlummer Applications\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1178e4,
    d: "China Radio International\nIslamic Republic of Iran Broadcasting\nRadio France Internationale\nRadio Romania International\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11785e3,
    d: "China Radio International\nKorean Broadcasting System\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 1179e4,
    d: "China Radio International\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nRadio Romania International",
    m: "AM"
  },
  {
    f: 11795e3,
    d: "China Radio International\nKorean Broadcasting System\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 118e5,
    d: "China National Radio\nDeutsche Welle\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11805e3,
    d: "China Radio International\nPakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1181e4,
    d: "BBC Worldservice\nChina National Radio\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 11815e3,
    d: "Nippon Hoso Kyokai\nTurkish Radio-TV Corp\nVatican Radio",
    m: "AM"
  },
  {
    f: 1182e4,
    d: "China Radio International\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11825e3,
    d: "BBC Worldservice\nHCJB Australia\nLeSea Broadcasting Corporation\nNippon Hoso Kyokai\nRadio Romania International\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 1183e4,
    d: "Deutsche Welle\nEncompass Digital Media Services",
    m: "AM"
  },
  {
    f: 1184e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 1185e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nKorean Broadcasting System\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 11855e3,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1186e4,
    d: "China National Radio\nChina Radio International\nRadio Republic of Indonesia\nTrans World Radio\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 11865e3,
    d: "HCJB Australia\nPakistan Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 1187e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nBBC Worldservice\nChina Radio International\nKorean Broadcasting System\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11875e3,
    d: "China Radio International\nHCJB Australia\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nRadio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1188e4,
    d: "Adventist World Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 11885e3,
    d: "China National Radio\nChina Radio International\nRadio Republic of Indonesia\nRadio Television Malaysia\nUnited States Agency for Global Media (USAGM)\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 1189e4,
    d: "United States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 11895e3,
    d: "China Radio International\nKorean Broadcasting System\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 119e5,
    d: "China Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 11905e3,
    d: "BBC Worldservice\nChina National Radio\nHCJB Australia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1191e4,
    d: "Abu Dhabi Media Company\nChina Radio International\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11915e3,
    d: "China National Radio\nMedia Broadcast GmbH\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1192e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 11925e3,
    d: "All India Radio\nChina National Radio\nChina Radio International\nNippon Hoso Kyokai\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 1193e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11935e3,
    d: "China National Radio\nUnited States Agency for Global Media (USAGM)\nVatican Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1194e4,
    d: "Radio Exterior de Espana\nVoice of Russia",
    m: "AM"
  },
  {
    f: 11945e3,
    d: "BBC Worldservice\nChina Radio International\nHCJB Australia\nMedia Broadcast GmbH\nNippon Hoso Kyokai\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1195e4,
    d: "China National Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11955e3,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina Radio International\nMedia Broadcast GmbH\nRadio Russia\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 1196e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 11965e3,
    d: "IBRA Radio\nTrans World Radio\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 1197e4,
    d: "China National Radio\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 11975e3,
    d: "China Radio International\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1198e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina Radio International\nDeutsche Welle\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 11985e3,
    d: "Adventist World Radio",
    m: "AM"
  },
  {
    f: 1199e4,
    d: "China National Radio\nChina Radio International\nDeutsche Welle",
    m: "AM"
  },
  {
    f: 11995e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina Radio International\nDeutsche Welle\nRadio France Internationale\nTelediffusion d'Algerie\nTrans World Radio",
    m: "AM"
  },
  {
    f: 12e6,
    d: "Voice of Vietnam",
    m: "AM"
  },
  {
    f: 12005e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1201e4,
    d: "China National Radio\nEncompass Digital Media Services\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 12015e3,
    d: "China Radio International\nMongol Radio & Television\nRadio Russia",
    m: "AM"
  },
  {
    f: 1202e4,
    d: "Adventist World Radio\nFor new organization\nNippon Hoso Kyokai\nVoice of Vietnam",
    m: "AM"
  },
  {
    f: 1203e4,
    d: "China Radio International\nRadio Exterior de Espana\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 12035e3,
    d: "China Radio International\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1204e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 12045e3,
    d: "China National Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1205e4,
    d: "Encompass Digital Media Services\nEternal Word Television Network, Inc.\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 12055e3,
    d: "China National Radio\nFar East Broadcasting Company\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1206e4,
    d: "Voice of Russia",
    m: "AM"
  },
  {
    f: 12065e3,
    d: "BBC Worldservice\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1207e4,
    d: "China Radio International\nFar East Broadcasting Company\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 12075e3,
    d: "Trans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1208e4,
    d: "Adventist Broadcasting Service, Inc.\nChina National Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 12085e3,
    d: "Adventist Broadcasting Service, Inc.\nFor new organization\nMongol Radio & Television",
    m: "AM"
  },
  {
    f: 12095e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nFar East Broadcasting Company",
    m: "AM"
  },
  {
    f: 121e5,
    d: "The Overcomer Ministry",
    m: "AM"
  },
  {
    f: 1211e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1212e4,
    d: "Far East Broadcasting Company\nPhilippines Broadcasting Service\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 12125e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1214e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1216e4,
    d: "For new organization\nWNQM, Inc.",
    m: "AM"
  },
  {
    f: 1218e4,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 1357e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1358e4,
    d: "Abu Dhabi Media Company\nChina Radio International\nTrans World Radio\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1359e4,
    d: "Abu Dhabi Media Company\nChina Radio International\nMedia Broadcast GmbH\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 136e5,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 13605e3,
    d: "Telediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 1361e4,
    d: "China National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1362e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 1363e4,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International\nPakistan Broadcasting Corporation\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1364e4,
    d: "China Radio International\nTelediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 13645e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1365e4,
    d: "China Radio International\nMinistry of Information - State of Kuwait\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 13655e3,
    d: "China Radio International\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 1366e4,
    d: "Abu Dhabi Media Company\nChina Radio International\nMedia Broadcast GmbH\nRadio Miami International",
    m: "AM"
  },
  {
    f: 13665e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1367e4,
    d: "China National Radio\nChina Radio International\nKorean Broadcasting System\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 13675e3,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 13685e3,
    d: "China Radio International\nRadio France Internationale\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1369e4,
    d: "Islamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 13695e3,
    d: "Radio France Internationale",
    m: "AM"
  },
  {
    f: 137e5,
    d: "China National Radio\nFor new organization",
    m: "AM"
  },
  {
    f: 13705e3,
    d: "Korean Broadcasting System",
    m: "AM"
  },
  {
    f: 1371e4,
    d: "All India Radio\nBroadcast Belgium\nChina National Radio\nIslamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nRadio Miami International\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 13715e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1372e4,
    d: "China Radio International\nRadio Romania International",
    m: "AM"
  },
  {
    f: 13725e3,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 1373e4,
    d: "Broadcast Belgium\nChina Radio International\nNippon Hoso Kyokai\nRadio New Zealand\nRadio Romania International",
    m: "AM"
  },
  {
    f: 1374e4,
    d: "BBC Worldservice\nChina Radio International\nPakistan Broadcasting Corporation\nRadio France Internationale\nVoice of the Andes",
    m: "AM"
  },
  {
    f: 1375e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina Radio International\nNBS of Thailand\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 13755e3,
    d: "Radio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 1376e4,
    d: "World Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 13765e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1377e4,
    d: "Abu Dhabi Media Company\nChina National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 13775e3,
    d: "Deutsche Welle",
    m: "AM"
  },
  {
    f: 1378e4,
    d: "China Radio International\nMedia Broadcast GmbH\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1379e4,
    d: "BBC Worldservice\nChina Radio International\nIslamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 13795e3,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 138e5,
    d: "China Radio International\nMedia Broadcast GmbH\nThe Overcomer Ministry\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1381e4,
    d: "China Radio International\nDeutsche Welle\nTrans World Radio",
    m: "AM"
  },
  {
    f: 1382e4,
    d: "Islamic Republic of Iran Broadcasting\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 13825e3,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 1383e4,
    d: "United States Agency for Global Media (USAGM)\nVatican Radio",
    m: "AM"
  },
  {
    f: 1384e4,
    d: "Allan H. Weiner\nNippon Hoso Kyokai\nRadio New Zealand\nTDF (France)",
    m: "AM"
  },
  {
    f: 13845e3,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 1385e4,
    d: "BBC Worldservice\nChina National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 13855e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1386e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 13865e3,
    d: "BBC Worldservice\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1387e4,
    d: "Far East Broadcasting Company",
    m: "AM"
  },
  {
    f: 1503e4,
    d: "All India Radio",
    m: "AM"
  },
  {
    f: 151e5,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 15105e3,
    d: "Trans World Radio",
    m: "AM"
  },
  {
    f: 1511e4,
    d: "China Radio International\nMinistry of Information - State of Kuwait\nRadio Exterior de Espana\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15115e3,
    d: "The Overcomer Ministry",
    m: "AM"
  },
  {
    f: 1512e4,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15125e3,
    d: "China Radio International\nRadio Republic of Indonesia",
    m: "AM"
  },
  {
    f: 1513e4,
    d: "China Radio International\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 15135e3,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1514e4,
    d: "Islamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 15145e3,
    d: "Adventist World Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1515e4,
    d: "Free Press Unlimited (Amsterdam)\nMedia Broadcast GmbH\nRadio Republic of Indonesia\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15155e3,
    d: "Korean Broadcasting System\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1516e4,
    d: "China Radio International\nKorean Broadcasting System",
    m: "AM"
  },
  {
    f: 1517e4,
    d: "ANTI, Milano\nBroadcast Belgium\nChina Radio International",
    m: "AM"
  },
  {
    f: 15175e3,
    d: "Broadcast Belgium",
    m: "AM"
  },
  {
    f: 1518e4,
    d: "China National Radio\nChina Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15185e3,
    d: "All India Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1519e4,
    d: "China Radio International\nPhilippines Broadcasting Service",
    m: "AM"
  },
  {
    f: 15195e3,
    d: "Deutsche Welle\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 152e5,
    d: "Radio Romania International\nTrans World Radio",
    m: "AM"
  },
  {
    f: 15205e3,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 1521e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina Radio International\nKorean Broadcasting System\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 15215e3,
    d: "Abu Dhabi Media Company\nAdventist Broadcasting Service, Inc.\nDeutsche Welle\nFar East Broadcasting Company\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 1522e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 15225e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1523e4,
    d: "Deutsche Welle",
    m: "AM"
  },
  {
    f: 15235e3,
    d: "Media Broadcast GmbH\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1524e4,
    d: "Islamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 15245e3,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 1525e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 15255e3,
    d: "Adventist Broadcasting Service, Inc.\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1526e4,
    d: "China Radio International\nIBRA Radio\nMedia Broadcast GmbH\nRadio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15265e3,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 1527e4,
    d: "China National Radio\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15275e3,
    d: "Deutsche Welle",
    m: "AM"
  },
  {
    f: 1528e4,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 15285e3,
    d: "Media Broadcast GmbH\nRadio Miami International",
    m: "AM"
  },
  {
    f: 1529e4,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 15295e3,
    d: "Radio Television Malaysia",
    m: "AM"
  },
  {
    f: 153e5,
    d: "Media Broadcast GmbH\nRadio France Internationale",
    m: "AM"
  },
  {
    f: 1531e4,
    d: "Adventist World Radio\nBBC Worldservice",
    m: "AM"
  },
  {
    f: 1532e4,
    d: "China National Radio\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 15325e3,
    d: "Adventist Broadcasting Service, Inc.\nNippon Hoso Kyokai\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1533e4,
    d: "Far East Broadcasting Company\nRadio Miami International",
    m: "AM"
  },
  {
    f: 15335e3,
    d: "BBC Worldservice\nChina Radio International\nThe Overcomer Ministry",
    m: "AM"
  },
  {
    f: 1534e4,
    d: "China Radio International\nRadio Miami International",
    m: "AM"
  },
  {
    f: 1535e4,
    d: "China Radio International\nDeutsche Welle\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 15355e3,
    d: "Adventist World Radio",
    m: "AM"
  },
  {
    f: 1536e4,
    d: "Abu Dhabi Media Company\nAdventist World Radio\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 15365e3,
    d: "Adventist Broadcasting Service, Inc.",
    m: "AM"
  },
  {
    f: 1537e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 15375e3,
    d: "Telediffusion d'Algerie",
    m: "AM"
  },
  {
    f: 1538e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 1539e4,
    d: "China National Radio\nDeutsche Welle\nRadio Exterior de Espana\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 154e5,
    d: "Abu Dhabi Media Company\nBBC Worldservice",
    m: "AM"
  },
  {
    f: 1541e4,
    d: "Adventist World Radio\nHCJB Australia",
    m: "AM"
  },
  {
    f: 15415e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1542e4,
    d: "Abu Dhabi Media Company\nAdventist Broadcasting Service, Inc.\nAdventist World Radio\nBBC Worldservice\nFar East Broadcasting Company\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 15425e3,
    d: "China Radio International\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1543e4,
    d: "Adventist World Radio\nChina Radio International\nRadio Romania International",
    m: "AM"
  },
  {
    f: 15435e3,
    d: "China Radio International\nFar East Broadcasting Company",
    m: "AM"
  },
  {
    f: 1544e4,
    d: "Adventist World Radio\nChina Radio International\nIslamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 15445e3,
    d: "Adventist World Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1545e4,
    d: "Adventist Broadcasting Service, Inc.\nFar East Broadcasting Company\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15455e3,
    d: "Radio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1546e4,
    d: "Radio Romania International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15465e3,
    d: "China National Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1547e4,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 1548e4,
    d: "China National Radio\nEncompass Digital Media Services\nTurkish Radio-TV Corp",
    m: "AM"
  },
  {
    f: 15485e3,
    d: "TDF (France)",
    m: "AM"
  },
  {
    f: 1549e4,
    d: "Abu Dhabi Media Company\nAdventist World Radio\nBBC Worldservice\nIBRA Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 155e5,
    d: "Adventist Broadcasting Service, Inc.\nChina National Radio\nRadio Exterior de Espana",
    m: "AM"
  },
  {
    f: 15505e3,
    d: "TDF (France)",
    m: "AM"
  },
  {
    f: 15515e3,
    d: "Adventist World Radio\nFor new organization\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 1552e4,
    d: "Adventist World Radio\nVoice of Russia",
    m: "AM"
  },
  {
    f: 15525e3,
    d: "China Radio International\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 1553e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nLeSea Broadcasting Corporation\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 1554e4,
    d: "China National Radio\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 1555e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nChina National Radio\nChina Radio International\nFree Press Unlimited (Amsterdam)",
    m: "AM"
  },
  {
    f: 15555e3,
    d: "Hill Radio International",
    m: "AM"
  },
  {
    f: 1556e4,
    d: "China Radio International\nFar East Broadcasting Company\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15565e3,
    d: "Encompass Digital Media Services\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 1557e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 15575e3,
    d: "Korean Broadcasting System\nVatican Radio",
    m: "AM"
  },
  {
    f: 1558e4,
    d: "Adventist Broadcasting Service, Inc.\nFar East Broadcasting Company\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1559e4,
    d: "Nippon Hoso Kyokai\nWRNO Worldwide, Inc.",
    m: "AM"
  },
  {
    f: 15595e3,
    d: "Vatican Radio",
    m: "AM"
  },
  {
    f: 156e5,
    d: "For new organization\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15605e3,
    d: "Adventist World Radio\nVatican Radio",
    m: "AM"
  },
  {
    f: 1561e4,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio\nEternal Word Television Network, Inc.\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15615e3,
    d: "Adventist Broadcasting Service, Inc.",
    m: "AM"
  },
  {
    f: 1562e4,
    d: "BBC Worldservice\nChina Radio International\nFar East Broadcasting Company\nMedia Broadcast GmbH\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 15625e3,
    d: "Adventist Broadcasting Service, Inc.\nAdventist World Radio",
    m: "AM"
  },
  {
    f: 1563e4,
    d: "Pakistan Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 1564e4,
    d: "Far East Broadcasting Company\nPhilippines Broadcasting Service\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1565e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 15665e3,
    d: "Adventist Broadcasting Service, Inc.\nChina Radio International\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1568e4,
    d: "Adventist World Radio\nRepublic of Palau",
    m: "AM"
  },
  {
    f: 15685e3,
    d: "BBC Worldservice",
    m: "AM"
  },
  {
    f: 1569e4,
    d: "Encompass Digital Media Services\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 157e5,
    d: "The Overcomer Ministry",
    m: "AM"
  },
  {
    f: 15705e3,
    d: "Adventist World Radio",
    m: "AM"
  },
  {
    f: 1571e4,
    d: "China National Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15715e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1572e4,
    d: "Nippon Hoso Kyokai\nRadio New Zealand",
    m: "AM"
  },
  {
    f: 1573e4,
    d: "Pakistan Broadcasting Corporation\nTelediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 15735e3,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 15745e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1575e4,
    d: "World International Broadcasters, Inc.",
    m: "AM"
  },
  {
    f: 15755e3,
    d: "For new organization\nNippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 15765e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1577e4,
    d: "Media Broadcast GmbH\nRadio Miami International",
    m: "AM"
  },
  {
    f: 1578e4,
    d: "Allan H. Weiner",
    m: "AM"
  },
  {
    f: 15785e3,
    d: "BitExpress (Germany)",
    m: "AM"
  },
  {
    f: 1579e4,
    d: "World Music Radio",
    m: "AM"
  },
  {
    f: 15795e3,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 1581e4,
    d: "Leap of Faith, Inc.",
    m: "AM"
  },
  {
    f: 15825e3,
    d: "WNQM, Inc.",
    m: "AM"
  },
  {
    f: 17485e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1749e4,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 175e5,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 1751e4,
    d: "China Radio International\nThe Overcomer Ministry",
    m: "AM"
  },
  {
    f: 1752e4,
    d: "Allan H. Weiner\nChina Radio International\nVatican Radio",
    m: "AM"
  },
  {
    f: 17525e3,
    d: "Adventist Broadcasting Service, Inc.\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1753e4,
    d: "Media Broadcast GmbH\nTelediffusion d'Algerie\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)\nWorld Christian Broadcasting (USA)",
    m: "AM"
  },
  {
    f: 1754e4,
    d: "China Radio International\nVatican Radio",
    m: "AM"
  },
  {
    f: 17545e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1755e4,
    d: "China National Radio\nMinistry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 1756e4,
    d: "Nippon Hoso Kyokai",
    m: "AM"
  },
  {
    f: 17565e3,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 1757e4,
    d: "Adventist World Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 1758e4,
    d: "China National Radio\nMedia Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17585e3,
    d: "Nippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17595e3,
    d: "China National Radio\nIslamic Republic of Iran Broadcasting",
    m: "AM"
  },
  {
    f: 176e5,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 17605e3,
    d: "China National Radio\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 17615e3,
    d: "China Radio International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 1762e4,
    d: "Radio France Internationale",
    m: "AM"
  },
  {
    f: 17625e3,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 1763e4,
    d: "China Radio International\nMedia Broadcast GmbH\nNBS of Thailand",
    m: "AM"
  },
  {
    f: 1764e4,
    d: "BBC Worldservice\nChina Radio International\nNBS of Thailand\nRadio Romania International",
    m: "AM"
  },
  {
    f: 17645e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1765e4,
    d: "Adventist Broadcasting Service, Inc.\nChina Radio International\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 17655e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1766e4,
    d: "Radio France Internationale\nTDF (France)\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1767e4,
    d: "China Radio International\nVoice of Russia",
    m: "AM"
  },
  {
    f: 17675e3,
    d: "Radio New Zealand\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1768e4,
    d: "Abu Dhabi Media Company\nChina Radio International\nTrans World Radio\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1769e4,
    d: "China Radio International\nRadio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 177e5,
    d: "For new organization\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1771e4,
    d: "All India Radio\nChina Radio International",
    m: "AM"
  },
  {
    f: 17715e3,
    d: "Radio Exterior de Espana",
    m: "AM"
  },
  {
    f: 1772e4,
    d: "China Radio International\nTurkish Radio-TV Corp\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1773e4,
    d: "Adventist World Radio\nChina Radio International\nEncompass Digital Media Services\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17735e3,
    d: "China Radio International",
    m: "AM"
  },
  {
    f: 1774e4,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17745e3,
    d: "Abu Dhabi Media Company\nBBC Worldservice",
    m: "AM"
  },
  {
    f: 1775e4,
    d: "China Radio International\nRadio Romania International",
    m: "AM"
  },
  {
    f: 17755e3,
    d: "Radio Exterior de Espana",
    m: "AM"
  },
  {
    f: 1776e4,
    d: "Ministry of Information - State of Kuwait",
    m: "AM"
  },
  {
    f: 1777e4,
    d: "Adventist World Radio\nChina National Radio\nPakistan Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 17775e3,
    d: "Voice of Hope",
    m: "AM"
  },
  {
    f: 1778e4,
    d: "BBC Worldservice\nRadio Romania International",
    m: "AM"
  },
  {
    f: 1779e4,
    d: "Vatican Radio",
    m: "AM"
  },
  {
    f: 178e5,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nChina National Radio\nDeutsche Welle\nEncompass Digital Media Services\nRadio Republic of Indonesia\nRadio Romania International\nTDF (France)",
    m: "AM"
  },
  {
    f: 1781e4,
    d: "Nippon Hoso Kyokai\nRadio Romania International",
    m: "AM"
  },
  {
    f: 17815e3,
    d: "BBC Worldservice\nChina Radio International\nRadio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1782e4,
    d: "Adventist Broadcasting Service, Inc.\nPakistan Broadcasting Corporation\nPhilippines Broadcasting Service\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1783e4,
    d: "BBC Worldservice\nChina National Radio\nNippon Hoso Kyokai\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1784e4,
    d: "Deutsche Welle\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17845e3,
    d: "Abu Dhabi Media Company\nEncompass Digital Media Services",
    m: "AM"
  },
  {
    f: 1785e4,
    d: "Radio France Internationale\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 17855e3,
    d: "China Radio International\nRadio Exterior de Espana",
    m: "AM"
  },
  {
    f: 1786e4,
    d: "Broadcast Belgium",
    m: "AM"
  },
  {
    f: 17865e3,
    d: "Telediffusion d'Algerie\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1787e4,
    d: "Broadcast Belgium\nMedia Broadcast GmbH",
    m: "AM"
  },
  {
    f: 1788e4,
    d: "China Radio International\nUnited States Agency for Global Media (USAGM)\nVoice of Russia",
    m: "AM"
  },
  {
    f: 17885e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 1789e4,
    d: "China National Radio",
    m: "AM"
  },
  {
    f: 17895e3,
    d: "Pakistan Broadcasting Corporation\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 179e5,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 1895e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 21455e3,
    d: "Media Broadcast GmbH",
    m: "AM"
  },
  {
    f: 2147e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nRadio Romania International",
    m: "AM"
  },
  {
    f: 2148e4,
    d: "Media Broadcast GmbH\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 21485e3,
    d: "Radio France Internationale",
    m: "AM"
  },
  {
    f: 2149e4,
    d: "BBC Worldservice",
    m: "AM"
  },
  {
    f: 21525e3,
    d: "Radio Miami International",
    m: "AM"
  },
  {
    f: 2158e4,
    d: "Radio France Internationale",
    m: "AM"
  },
  {
    f: 216e5,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 2161e4,
    d: "LeSea Broadcasting Corporation",
    m: "AM"
  },
  {
    f: 2162e4,
    d: "Radio Exterior de Espana\nUnited States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 2163e4,
    d: "Abu Dhabi Media Company\nBBC Worldservice\nTrans World Radio",
    m: "AM"
  },
  {
    f: 2169e4,
    d: "Abu Dhabi Media Company\nRadio France Internationale",
    m: "AM"
  },
  {
    f: 217e5,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 2176e4,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 21785e3,
    d: "United States Agency for Global Media (USAGM)",
    m: "AM"
  },
  {
    f: 218e5,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 2184e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 25795e3,
    d: "World Music Radio",
    m: "AM"
  },
  {
    f: 258e5,
    d: "World Music Radio",
    m: "AM"
  },
  {
    f: 25805e3,
    d: "World Music Radio",
    m: "AM"
  },
  {
    f: 26e6,
    d: "For new organization",
    m: "AM"
  },
  {
    f: 2601e4,
    d: "HFCC, Intl. Radio for Disaster Relief project",
    m: "AM"
  },
  {
    f: 2604e4,
    d: "For new organization",
    m: "AM"
  }
];
const builtinAmateur = [];
function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[13] = list[i];
  return child_ctx;
}
function create_each_block$2(key_1, ctx) {
  let div2;
  let div0;
  let t0;
  let div1;
  let t1_value = ctx[13].description + "";
  let t1;
  let t2;
  let mounted;
  let dispose;
  function click_handler_1() {
    return ctx[5](ctx[13]);
  }
  return {
    key: key_1,
    first: null,
    c() {
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = text(t1_value);
      t2 = space();
      attr(div0, "class", "top-0 w-px h-8 z-0 peer bg-yellow-600 absolute");
      attr(div1, "class", "outline-1 outline-black outline-offset-0 outline p-px bg-yellow-400 absolute bottom-0 z-10 group-hover:z-20 hover:z-20 peer-hover:z-20 text-left whitespace-pre whitespace-nowrap text-black text-xs align-middle border border-yellow-600 transform origin-bottom-left overflow-hidden h-auto max-h-full hover:max-h-screen peer-hover:max-h-screen transition-all ease-linear duration-1000");
      attr(div2, "class", "h-4 absolute p-0 group");
      set_style(div2, "left", ctx[13].left * 100 + "%");
      this.first = div2;
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      append(div2, t0);
      append(div2, div1);
      append(div1, t1);
      append(div2, t2);
      if (!mounted) {
        dispose = listen(div2, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty & 1 && t1_value !== (t1_value = ctx[13].description + ""))
        set_data(t1, t1_value);
      if (dirty & 1) {
        set_style(div2, "left", ctx[13].left * 100 + "%");
      }
    },
    d(detaching) {
      if (detaching)
        detach(div2);
      mounted = false;
      dispose();
    }
  };
}
function create_fragment$4(ctx) {
  let div;
  let each_blocks = [];
  let each_1_lookup = /* @__PURE__ */ new Map();
  let mounted;
  let dispose;
  let each_value = ctx[0];
  const get_key = (ctx2) => ctx2[13].frequency;
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context$2(ctx, each_value, i);
    let key = get_key(child_ctx);
    each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "w-full h-4 bg-black relative");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      if (!mounted) {
        dispose = [
          listen(div, "click", self$1(ctx[3])),
          listen(div, "wheel", self$1(ctx[4]))
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      if (dirty & 3) {
        each_value = ctx2[0];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx2, each_value, each_1_lookup, div, destroy_block, create_each_block$2, null, get_each_context$2);
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function frequencyListComparator(a, b) {
  return a[0] - b[0];
}
function instance$4($$self, $$props, $$invalidate) {
  const dispatch = createEventDispatcher();
  const frequencyList = [];
  function insertAll(frequencies) {
    for (const frequency of frequencies) {
      frequencyList.push([
        frequency.f || frequency.frequency,
        frequency.d || frequency.description,
        frequency.m || frequency.modulation
      ]);
    }
  }
  function finalizeList() {
    frequencyList.sort(frequencyListComparator);
  }
  insertAll(builtinShortwave);
  insertAll(builtinAmateur);
  finalizeList();
  function getFrequencyBoundsInRange(lo, hi) {
    return [
      searchBounds.ge(frequencyList, [lo], frequencyListComparator),
      searchBounds.ge(frequencyList, [hi], frequencyListComparator)
    ];
  }
  function getFrequencyInRange(from, to) {
    return frequencyList.slice(from, to).map((x) => ({
      frequency: x[0],
      description: x[1],
      modulation: x[2],
      left: 0
    }));
  }
  let frequencyMarkers = [];
  let frequencyBoundsLo = -1;
  let frequencyBoundsHi = -1;
  function updateFrequencyMarkerPositions() {
    const [frequencyFrom, frequencyTo] = getFrequencyView();
    const [from, to] = getFrequencyBoundsInRange(frequencyFrom, frequencyTo);
    if (frequencyTo - frequencyFrom <= 2e5) {
      if (from !== frequencyBoundsLo || to !== frequencyBoundsHi) {
        frequencyBoundsLo = from;
        frequencyBoundsHi = to;
        $$invalidate(0, frequencyMarkers = getFrequencyInRange(frequencyBoundsLo, frequencyBoundsHi));
      }
    } else {
      $$invalidate(0, frequencyMarkers = []);
    }
    for (let i = 0; i < frequencyMarkers.length; i++) {
      $$invalidate(0, frequencyMarkers[i].left = frequencyToWaterfallOffset(frequencyMarkers[i].frequency), frequencyMarkers);
    }
  }
  function click_handler(event) {
    bubble.call(this, $$self, event);
  }
  function wheel_handler(event) {
    bubble.call(this, $$self, event);
  }
  const click_handler_1 = (frequencyMarker) => dispatch("markerclick", frequencyMarker);
  return [
    frequencyMarkers,
    dispatch,
    updateFrequencyMarkerPositions,
    click_handler,
    wheel_handler,
    click_handler_1
  ];
}
class FrequencyMarkers extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$4, create_fragment$4, safe_not_equal, { updateFrequencyMarkerPositions: 2 });
  }
  get updateFrequencyMarkerPositions() {
    return this.$$.ctx[2];
  }
}
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element2) {
  return element2 ? (element2.nodeName || "").toLowerCase() : null;
}
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}
function isElement$1(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes = state.attributes[name] || {};
    var element2 = state.elements[name];
    if (!isHTMLElement(element2) || !getNodeName(element2)) {
      return;
    }
    Object.assign(element2.style, style);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element2.removeAttribute(name2);
      } else {
        element2.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element2 = state.elements[name];
      var attributes = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element2) || !getNodeName(element2)) {
        return;
      }
      Object.assign(element2.style, style);
      Object.keys(attributes).forEach(function(attribute) {
        element2.removeAttribute(attribute);
      });
    });
  };
}
const applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round$1 = Math.round;
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}
function getBoundingClientRect(element2, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element2.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element2)) {
    scaleX = element2.offsetWidth > 0 ? round$1(clientRect.width) / element2.offsetWidth || 1 : 1;
    scaleY = element2.offsetHeight > 0 ? round$1(clientRect.height) / element2.offsetHeight || 1 : 1;
  }
  var _ref = isElement$1(element2) ? getWindow(element2) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}
function getLayoutRect(element2) {
  var clientRect = getBoundingClientRect(element2);
  var width = element2.offsetWidth;
  var height = element2.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element2.offsetLeft,
    y: element2.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle$1(element2) {
  return getWindow(element2).getComputedStyle(element2);
}
function isTableElement(element2) {
  return ["table", "td", "th"].indexOf(getNodeName(element2)) >= 0;
}
function getDocumentElement(element2) {
  return ((isElement$1(element2) ? element2.ownerDocument : element2.document) || window.document).documentElement;
}
function getParentNode(element2) {
  if (getNodeName(element2) === "html") {
    return element2;
  }
  return element2.assignedSlot || element2.parentNode || (isShadowRoot(element2) ? element2.host : null) || getDocumentElement(element2);
}
function getTrueOffsetParent(element2) {
  if (!isHTMLElement(element2) || getComputedStyle$1(element2).position === "fixed") {
    return null;
  }
  return element2.offsetParent;
}
function getContainingBlock(element2) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element2)) {
    var elementCss = getComputedStyle$1(element2);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element2);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element2) {
  var window2 = getWindow(element2);
  var offsetParent = getTrueOffsetParent(element2);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element2) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$12, value, max$12) {
  return max(min$12, min(value, max$12));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys2) {
  return keys2.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center2 = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center2, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center2, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
const arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win2 = window;
  var dpr = win2.devicePixelRatio || 1;
  return {
    x: round$1(x * dpr) / dpr || 0,
    y: round$1(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win2 = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win2 && win2.visualViewport ? win2.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win2 && win2.visualViewport ? win2.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win2.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
const computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance2 = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance2.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance2.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance2.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance2.update, passive);
    }
  };
}
const eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node) {
  var win2 = getWindow(node);
  var scrollLeft = win2.pageXOffset;
  var scrollTop = win2.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element2) {
  return getBoundingClientRect(getDocumentElement(element2)).left + getWindowScroll(element2).scrollLeft;
}
function getViewportRect(element2, strategy) {
  var win2 = getWindow(element2);
  var html2 = getDocumentElement(element2);
  var visualViewport = win2.visualViewport;
  var width = html2.clientWidth;
  var height = html2.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element2),
    y
  };
}
function getDocumentRect(element2) {
  var _element$ownerDocumen;
  var html2 = getDocumentElement(element2);
  var winScroll = getWindowScroll(element2);
  var body = (_element$ownerDocumen = element2.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html2.scrollWidth, html2.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html2.scrollHeight, html2.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element2);
  var y = -winScroll.scrollTop;
  if (getComputedStyle$1(body || html2).direction === "rtl") {
    x += max(html2.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element2) {
  var _getComputedStyle = getComputedStyle$1(element2), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}
function listScrollParents(element2, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element2);
  var isBody = scrollParent === ((_element$ownerDocumen = element2.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win2 = getWindow(scrollParent);
  var target = isBody ? [win2].concat(win2.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target)));
}
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}
function getInnerBoundingClientRect(element2, strategy) {
  var rect = getBoundingClientRect(element2, false, strategy === "fixed");
  rect.top = rect.top + element2.clientTop;
  rect.left = rect.left + element2.clientLeft;
  rect.bottom = rect.top + element2.clientHeight;
  rect.right = rect.left + element2.clientWidth;
  rect.width = element2.clientWidth;
  rect.height = element2.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element2, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element2, strategy)) : isElement$1(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element2)));
}
function getClippingParents(element2) {
  var clippingParents2 = listScrollParents(getParentNode(element2));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element2).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element2) ? getOffsetParent(element2) : element2;
  if (!isElement$1(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement$1(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element2, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element2) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element2, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element2, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element2 = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element2.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element2.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element2.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element2.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element2[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element2[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element2 = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement$1(element2) ? element2 : element2.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply2 = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply2;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check2) {
      return check2;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check2) {
            return check2;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
const flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side2) {
    return overflow[side2] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
const hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data2 = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data2[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data2;
}
const offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
const popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data2 = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$12 = offset2 + overflow[mainSide];
    var max$12 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$12, tetherMin) : min$12, offset2, tether ? max(max$12, tetherMax) : max$12);
    popperOffsets2[mainAxis] = preventedOffset;
    data2[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data2[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data2;
}
const preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element2) {
  return {
    scrollLeft: element2.scrollLeft,
    scrollTop: element2.scrollTop
  };
}
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}
function isElementScaled(element2) {
  var rect = element2.getBoundingClientRect();
  var scaleX = round$1(rect.width) / element2.offsetWidth || 1;
  var scaleY = round$1(rect.height) / element2.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}
function order(modifiers) {
  var map = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element2) {
    return !(element2 && typeof element2.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance2 = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions, state.options, options2);
        state.scrollParents = {
          reference: isElement$1(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance2.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state.orderedModifiers.length; index++) {
          if (state.reset === true) {
            state.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance: instance2
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance2.forceUpdate();
          resolve(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance2;
    }
    instance2.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance: instance2,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance2;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
const Tooltip_svelte_svelte_type_style_lang = "";
function create_fragment$3(ctx) {
  let div1;
  let t0;
  let t1;
  let div0;
  return {
    c() {
      div1 = element("div");
      t0 = text(ctx[0]);
      t1 = space();
      div0 = element("div");
      attr(div0, "id", "arrow");
      attr(div0, "data-popper-arrow", "");
      attr(div0, "class", "svelte-1qky7dz");
      attr(div1, "id", "tooltip");
      attr(div1, "role", "tooltip");
      attr(div1, "class", "z-50 svelte-1qky7dz");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, t0);
      append(div1, t1);
      append(div1, div0);
      ctx[2](div1);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t0, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div1);
      ctx[2](null);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let { text: text2 } = $$props;
  let tooltip;
  let tooltipPopper = null;
  let parentNode = null;
  function show() {
    if (!tooltipPopper && tooltip) {
      tooltipPopper = createPopper(parentNode, tooltip, {
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, 8] }
          }
        ],
        placement: "bottom"
      });
    }
    tooltip.setAttribute("data-show", "");
  }
  function hide2() {
    tooltip.removeAttribute("data-show");
  }
  onMount(() => {
    parentNode = tooltip.parentElement;
    parentNode.addEventListener("mouseenter", show);
    parentNode.addEventListener("mouseleave", hide2);
  });
  onDestroy(() => {
    parentNode.removeEventListener("mouseenter", show);
    parentNode.removeEventListener("mouseleave", hide2);
  });
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      tooltip = $$value;
      $$invalidate(1, tooltip);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("text" in $$props2)
      $$invalidate(0, text2 = $$props2.text);
  };
  return [text2, tooltip, div1_binding];
}
class Tooltip extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$3, create_fragment$3, safe_not_equal, { text: 0 });
  }
}
const Popover_svelte_svelte_type_style_lang = "";
function create_fragment$2(ctx) {
  let div1;
  let t0;
  let t1;
  let div0;
  return {
    c() {
      div1 = element("div");
      t0 = text(ctx[0]);
      t1 = space();
      div0 = element("div");
      attr(div0, "id", "arrow");
      attr(div0, "data-popper-arrow", "");
      attr(div0, "class", "svelte-1hel9pb");
      attr(div1, "id", "popover");
      attr(div1, "role", "tooltip");
      attr(div1, "class", "z-50 svelte-1hel9pb");
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, t0);
      append(div1, t1);
      append(div1, div0);
      ctx[2](div1);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1)
        set_data(t0, ctx2[0]);
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div1);
      ctx[2](null);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { text: text2 } = $$props;
  let popover;
  let popoverPopper = null;
  let parentNode = null;
  let timeout = null;
  function show() {
    if (!popoverPopper && popover) {
      popoverPopper = createPopper(parentNode, popover, {
        modifiers: [
          {
            name: "offset",
            options: { offset: [0, 8] }
          }
        ],
        placement: "top"
      });
    }
    popover.setAttribute("data-show", "");
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(
      () => {
        popover.removeAttribute("data-show");
      },
      1e3
    );
  }
  onMount(() => {
    parentNode = popover.parentElement;
    parentNode.addEventListener("click", show);
  });
  onDestroy(() => {
    parentNode.removeEventListener("click", show);
  });
  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      popover = $$value;
      $$invalidate(1, popover);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("text" in $$props2)
      $$invalidate(0, text2 = $$props2.text);
  };
  return [text2, popover, div1_binding];
}
class Popover extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0 });
  }
}
function get_each_context$1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[6] = list[i];
  return child_ctx;
}
function create_each_block$1(ctx) {
  let div;
  let t_value = ctx[6] + "";
  let t;
  return {
    c() {
      div = element("div");
      t = text(t_value);
      attr(div, "class", "text-xs text-left font-mono border border-b-1 border-t-0 border-l-0 border-r-0");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, t);
    },
    p(ctx2, dirty) {
      if (dirty & 1 && t_value !== (t_value = ctx2[6] + ""))
        set_data(t, t_value);
    },
    d(detaching) {
      if (detaching)
        detach(div);
    }
  };
}
function create_fragment$1(ctx) {
  let div;
  let each_value = ctx[0].toArray();
  let each_blocks = [];
  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
  }
  return {
    c() {
      div = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(div, "class", "fixed w-full sm:w-1/2 md:w-2/3 lg:w-3/4 h-1/4 bg-white bottom-0 p-1 overflow-y-scroll");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div, null);
      }
      ctx[4](div);
    },
    p(ctx2, [dirty]) {
      if (dirty & 1) {
        each_value = ctx2[0].toArray();
        let i;
        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$1(ctx2, each_value, i);
          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
          } else {
            each_blocks[i] = create_each_block$1(child_ctx);
            each_blocks[i].c();
            each_blocks[i].m(div, null);
          }
        }
        for (; i < each_blocks.length; i += 1) {
          each_blocks[i].d(1);
        }
        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching)
        detach(div);
      destroy_each(each_blocks, detaching);
      ctx[4](null);
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { capacity = 1e3 } = $$props;
  let log = new deque(capacity);
  function addLine(text2) {
    log.push(text2);
    if (log.length > capacity) {
      log.unshift();
    }
    $$invalidate(0, log);
  }
  let loggerDiv;
  let autoscroll;
  beforeUpdate(() => {
    autoscroll = loggerDiv && loggerDiv.offsetHeight + loggerDiv.scrollTop > loggerDiv.scrollHeight - 20;
  });
  afterUpdate(() => {
    if (autoscroll)
      loggerDiv.scrollTo(0, loggerDiv.scrollHeight);
  });
  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      loggerDiv = $$value;
      $$invalidate(1, loggerDiv);
    });
  }
  $$self.$$set = ($$props2) => {
    if ("capacity" in $$props2)
      $$invalidate(2, capacity = $$props2.capacity);
  };
  return [log, loggerDiv, capacity, addLine, div_binding];
}
class Logger extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance$1, create_fragment$1, safe_not_equal, { capacity: 2, addLine: 3 });
  }
  get addLine() {
    return this.$$.ctx[3];
  }
}
/*! Hammer.JS - v2.0.17-rc - 2019-12-16
 * http://naver.github.io/egjs
 *
 * Forked By Naver egjs
 * Copyright (c) hammerjs
 * Licensed under the MIT license */
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
var assign$1;
if (typeof Object.assign !== "function") {
  assign$1 = function assign2(target) {
    if (target === void 0 || target === null) {
      throw new TypeError("Cannot convert undefined or null to object");
    }
    var output = Object(target);
    for (var index = 1; index < arguments.length; index++) {
      var source = arguments[index];
      if (source !== void 0 && source !== null) {
        for (var nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  };
} else {
  assign$1 = Object.assign;
}
var assign$1$1 = assign$1;
var VENDOR_PREFIXES = ["", "webkit", "Moz", "MS", "ms", "o"];
var TEST_ELEMENT = typeof document === "undefined" ? {
  style: {}
} : document.createElement("div");
var TYPE_FUNCTION = "function";
var round = Math.round, abs = Math.abs;
var now = Date.now;
function prefixed(obj, property) {
  var prefix;
  var prop;
  var camelProp = property[0].toUpperCase() + property.slice(1);
  var i = 0;
  while (i < VENDOR_PREFIXES.length) {
    prefix = VENDOR_PREFIXES[i];
    prop = prefix ? prefix + camelProp : property;
    if (prop in obj) {
      return prop;
    }
    i++;
  }
  return void 0;
}
var win;
if (typeof window === "undefined") {
  win = {};
} else {
  win = window;
}
var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, "touchAction");
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== void 0;
function getTouchActionProps() {
  if (!NATIVE_TOUCH_ACTION) {
    return false;
  }
  var touchMap = {};
  var cssSupports = win.CSS && win.CSS.supports;
  ["auto", "manipulation", "pan-y", "pan-x", "pan-x pan-y", "none"].forEach(function(val) {
    return touchMap[val] = cssSupports ? win.CSS.supports("touch-action", val) : true;
  });
  return touchMap;
}
var TOUCH_ACTION_COMPUTE = "compute";
var TOUCH_ACTION_AUTO = "auto";
var TOUCH_ACTION_MANIPULATION = "manipulation";
var TOUCH_ACTION_NONE = "none";
var TOUCH_ACTION_PAN_X = "pan-x";
var TOUCH_ACTION_PAN_Y = "pan-y";
var TOUCH_ACTION_MAP = getTouchActionProps();
var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
var SUPPORT_TOUCH = "ontouchstart" in win;
var SUPPORT_POINTER_EVENTS = prefixed(win, "PointerEvent") !== void 0;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
var INPUT_TYPE_TOUCH = "touch";
var INPUT_TYPE_PEN = "pen";
var INPUT_TYPE_MOUSE = "mouse";
var INPUT_TYPE_KINECT = "kinect";
var COMPUTE_INTERVAL = 25;
var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;
var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;
var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
var PROPS_XY = ["x", "y"];
var PROPS_CLIENT_XY = ["clientX", "clientY"];
function each(obj, iterator, context) {
  var i;
  if (!obj) {
    return;
  }
  if (obj.forEach) {
    obj.forEach(iterator, context);
  } else if (obj.length !== void 0) {
    i = 0;
    while (i < obj.length) {
      iterator.call(context, obj[i], i, obj);
      i++;
    }
  } else {
    for (i in obj) {
      obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
    }
  }
}
function boolOrFn(val, args) {
  if (typeof val === TYPE_FUNCTION) {
    return val.apply(args ? args[0] || void 0 : void 0, args);
  }
  return val;
}
function inStr(str, find) {
  return str.indexOf(find) > -1;
}
function cleanTouchActions(actions) {
  if (inStr(actions, TOUCH_ACTION_NONE)) {
    return TOUCH_ACTION_NONE;
  }
  var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
  var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);
  if (hasPanX && hasPanY) {
    return TOUCH_ACTION_NONE;
  }
  if (hasPanX || hasPanY) {
    return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
  }
  if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
    return TOUCH_ACTION_MANIPULATION;
  }
  return TOUCH_ACTION_AUTO;
}
var TouchAction = /* @__PURE__ */ function() {
  function TouchAction2(manager, value) {
    this.manager = manager;
    this.set(value);
  }
  var _proto = TouchAction2.prototype;
  _proto.set = function set2(value) {
    if (value === TOUCH_ACTION_COMPUTE) {
      value = this.compute();
    }
    if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
      this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
    }
    this.actions = value.toLowerCase().trim();
  };
  _proto.update = function update2() {
    this.set(this.manager.options.touchAction);
  };
  _proto.compute = function compute() {
    var actions = [];
    each(this.manager.recognizers, function(recognizer) {
      if (boolOrFn(recognizer.options.enable, [recognizer])) {
        actions = actions.concat(recognizer.getTouchAction());
      }
    });
    return cleanTouchActions(actions.join(" "));
  };
  _proto.preventDefaults = function preventDefaults(input) {
    var srcEvent = input.srcEvent;
    var direction = input.offsetDirection;
    if (this.manager.session.prevented) {
      srcEvent.preventDefault();
      return;
    }
    var actions = this.actions;
    var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];
    if (hasNone) {
      var isTapPointer = input.pointers.length === 1;
      var isTapMovement = input.distance < 2;
      var isTapTouchTime = input.deltaTime < 250;
      if (isTapPointer && isTapMovement && isTapTouchTime) {
        return;
      }
    }
    if (hasPanX && hasPanY) {
      return;
    }
    if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
      return this.preventSrc(srcEvent);
    }
  };
  _proto.preventSrc = function preventSrc(srcEvent) {
    this.manager.session.prevented = true;
    srcEvent.preventDefault();
  };
  return TouchAction2;
}();
function hasParent(node, parent) {
  while (node) {
    if (node === parent) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}
function getCenter(pointers) {
  var pointersLength = pointers.length;
  if (pointersLength === 1) {
    return {
      x: round(pointers[0].clientX),
      y: round(pointers[0].clientY)
    };
  }
  var x = 0;
  var y = 0;
  var i = 0;
  while (i < pointersLength) {
    x += pointers[i].clientX;
    y += pointers[i].clientY;
    i++;
  }
  return {
    x: round(x / pointersLength),
    y: round(y / pointersLength)
  };
}
function simpleCloneInputData(input) {
  var pointers = [];
  var i = 0;
  while (i < input.pointers.length) {
    pointers[i] = {
      clientX: round(input.pointers[i].clientX),
      clientY: round(input.pointers[i].clientY)
    };
    i++;
  }
  return {
    timeStamp: now(),
    pointers,
    center: getCenter(pointers),
    deltaX: input.deltaX,
    deltaY: input.deltaY
  };
}
function getDistance(p1, p2, props) {
  if (!props) {
    props = PROPS_XY;
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];
  return Math.sqrt(x * x + y * y);
}
function getAngle(p1, p2, props) {
  if (!props) {
    props = PROPS_XY;
  }
  var x = p2[props[0]] - p1[props[0]];
  var y = p2[props[1]] - p1[props[1]];
  return Math.atan2(y, x) * 180 / Math.PI;
}
function getDirection(x, y) {
  if (x === y) {
    return DIRECTION_NONE;
  }
  if (abs(x) >= abs(y)) {
    return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
  }
  return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}
function computeDeltaXY(session, input) {
  var center2 = input.center;
  var offset2 = session.offsetDelta || {};
  var prevDelta = session.prevDelta || {};
  var prevInput = session.prevInput || {};
  if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
    prevDelta = session.prevDelta = {
      x: prevInput.deltaX || 0,
      y: prevInput.deltaY || 0
    };
    offset2 = session.offsetDelta = {
      x: center2.x,
      y: center2.y
    };
  }
  input.deltaX = prevDelta.x + (center2.x - offset2.x);
  input.deltaY = prevDelta.y + (center2.y - offset2.y);
}
function getVelocity(deltaTime, x, y) {
  return {
    x: x / deltaTime || 0,
    y: y / deltaTime || 0
  };
}
function getScale(start2, end2) {
  return getDistance(end2[0], end2[1], PROPS_CLIENT_XY) / getDistance(start2[0], start2[1], PROPS_CLIENT_XY);
}
function getRotation(start2, end2) {
  return getAngle(end2[1], end2[0], PROPS_CLIENT_XY) + getAngle(start2[1], start2[0], PROPS_CLIENT_XY);
}
function computeIntervalInputData(session, input) {
  var last = session.lastInterval || input;
  var deltaTime = input.timeStamp - last.timeStamp;
  var velocity;
  var velocityX;
  var velocityY;
  var direction;
  if (input.eventType !== INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === void 0)) {
    var deltaX = input.deltaX - last.deltaX;
    var deltaY = input.deltaY - last.deltaY;
    var v = getVelocity(deltaTime, deltaX, deltaY);
    velocityX = v.x;
    velocityY = v.y;
    velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
    direction = getDirection(deltaX, deltaY);
    session.lastInterval = input;
  } else {
    velocity = last.velocity;
    velocityX = last.velocityX;
    velocityY = last.velocityY;
    direction = last.direction;
  }
  input.velocity = velocity;
  input.velocityX = velocityX;
  input.velocityY = velocityY;
  input.direction = direction;
}
function computeInputData(manager, input) {
  var session = manager.session;
  var pointers = input.pointers;
  var pointersLength = pointers.length;
  if (!session.firstInput) {
    session.firstInput = simpleCloneInputData(input);
  }
  if (pointersLength > 1 && !session.firstMultiple) {
    session.firstMultiple = simpleCloneInputData(input);
  } else if (pointersLength === 1) {
    session.firstMultiple = false;
  }
  var firstInput = session.firstInput, firstMultiple = session.firstMultiple;
  var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
  var center2 = input.center = getCenter(pointers);
  input.timeStamp = now();
  input.deltaTime = input.timeStamp - firstInput.timeStamp;
  input.angle = getAngle(offsetCenter, center2);
  input.distance = getDistance(offsetCenter, center2);
  computeDeltaXY(session, input);
  input.offsetDirection = getDirection(input.deltaX, input.deltaY);
  var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
  input.overallVelocityX = overallVelocity.x;
  input.overallVelocityY = overallVelocity.y;
  input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
  input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
  input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
  input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
  computeIntervalInputData(session, input);
  var target = manager.element;
  var srcEvent = input.srcEvent;
  var srcEventTarget;
  if (srcEvent.composedPath) {
    srcEventTarget = srcEvent.composedPath()[0];
  } else if (srcEvent.path) {
    srcEventTarget = srcEvent.path[0];
  } else {
    srcEventTarget = srcEvent.target;
  }
  if (hasParent(srcEventTarget, target)) {
    target = srcEventTarget;
  }
  input.target = target;
}
function inputHandler(manager, eventType, input) {
  var pointersLen = input.pointers.length;
  var changedPointersLen = input.changedPointers.length;
  var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
  var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
  input.isFirst = !!isFirst;
  input.isFinal = !!isFinal;
  if (isFirst) {
    manager.session = {};
  }
  input.eventType = eventType;
  computeInputData(manager, input);
  manager.emit("hammer.input", input);
  manager.recognize(input);
  manager.session.prevInput = input;
}
function splitStr(str) {
  return str.trim().split(/\s+/g);
}
function addEventListeners(target, types, handler) {
  each(splitStr(types), function(type) {
    target.addEventListener(type, handler, false);
  });
}
function removeEventListeners(target, types, handler) {
  each(splitStr(types), function(type) {
    target.removeEventListener(type, handler, false);
  });
}
function getWindowForElement(element2) {
  var doc = element2.ownerDocument || element2;
  return doc.defaultView || doc.parentWindow || window;
}
var Input = /* @__PURE__ */ function() {
  function Input2(manager, callback) {
    var self2 = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;
    this.domHandler = function(ev) {
      if (boolOrFn(manager.options.enable, [manager])) {
        self2.handler(ev);
      }
    };
    this.init();
  }
  var _proto = Input2.prototype;
  _proto.handler = function handler() {
  };
  _proto.init = function init2() {
    this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
    this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
    this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
  };
  _proto.destroy = function destroy() {
    this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
    this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
    this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
  };
  return Input2;
}();
function inArray(src2, find, findByKey) {
  if (src2.indexOf && !findByKey) {
    return src2.indexOf(find);
  } else {
    var i = 0;
    while (i < src2.length) {
      if (findByKey && src2[i][findByKey] == find || !findByKey && src2[i] === find) {
        return i;
      }
      i++;
    }
    return -1;
  }
}
var POINTER_INPUT_MAP = {
  pointerdown: INPUT_START,
  pointermove: INPUT_MOVE,
  pointerup: INPUT_END,
  pointercancel: INPUT_CANCEL,
  pointerout: INPUT_CANCEL
};
var IE10_POINTER_TYPE_ENUM = {
  2: INPUT_TYPE_TOUCH,
  3: INPUT_TYPE_PEN,
  4: INPUT_TYPE_MOUSE,
  5: INPUT_TYPE_KINECT
};
var POINTER_ELEMENT_EVENTS = "pointerdown";
var POINTER_WINDOW_EVENTS = "pointermove pointerup pointercancel";
if (win.MSPointerEvent && !win.PointerEvent) {
  POINTER_ELEMENT_EVENTS = "MSPointerDown";
  POINTER_WINDOW_EVENTS = "MSPointerMove MSPointerUp MSPointerCancel";
}
var PointerEventInput = /* @__PURE__ */ function(_Input) {
  _inheritsLoose(PointerEventInput2, _Input);
  function PointerEventInput2() {
    var _this;
    var proto = PointerEventInput2.prototype;
    proto.evEl = POINTER_ELEMENT_EVENTS;
    proto.evWin = POINTER_WINDOW_EVENTS;
    _this = _Input.apply(this, arguments) || this;
    _this.store = _this.manager.session.pointerEvents = [];
    return _this;
  }
  var _proto = PointerEventInput2.prototype;
  _proto.handler = function handler(ev) {
    var store = this.store;
    var removePointer = false;
    var eventTypeNormalized = ev.type.toLowerCase().replace("ms", "");
    var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
    var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
    var isTouch = pointerType === INPUT_TYPE_TOUCH;
    var storeIndex = inArray(store, ev.pointerId, "pointerId");
    if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
      if (storeIndex < 0) {
        store.push(ev);
        storeIndex = store.length - 1;
      }
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
      removePointer = true;
    }
    if (storeIndex < 0) {
      return;
    }
    store[storeIndex] = ev;
    this.callback(this.manager, eventType, {
      pointers: store,
      changedPointers: [ev],
      pointerType,
      srcEvent: ev
    });
    if (removePointer) {
      store.splice(storeIndex, 1);
    }
  };
  return PointerEventInput2;
}(Input);
function toArray(obj) {
  return Array.prototype.slice.call(obj, 0);
}
function uniqueArray(src2, key, sort) {
  var results = [];
  var values = [];
  var i = 0;
  while (i < src2.length) {
    var val = key ? src2[i][key] : src2[i];
    if (inArray(values, val) < 0) {
      results.push(src2[i]);
    }
    values[i] = val;
    i++;
  }
  if (sort) {
    if (!key) {
      results = results.sort();
    } else {
      results = results.sort(function(a, b) {
        return a[key] > b[key];
      });
    }
  }
  return results;
}
var TOUCH_INPUT_MAP = {
  touchstart: INPUT_START,
  touchmove: INPUT_MOVE,
  touchend: INPUT_END,
  touchcancel: INPUT_CANCEL
};
var TOUCH_TARGET_EVENTS = "touchstart touchmove touchend touchcancel";
var TouchInput = /* @__PURE__ */ function(_Input) {
  _inheritsLoose(TouchInput2, _Input);
  function TouchInput2() {
    var _this;
    TouchInput2.prototype.evTarget = TOUCH_TARGET_EVENTS;
    _this = _Input.apply(this, arguments) || this;
    _this.targetIds = {};
    return _this;
  }
  var _proto = TouchInput2.prototype;
  _proto.handler = function handler(ev) {
    var type = TOUCH_INPUT_MAP[ev.type];
    var touches = getTouches.call(this, ev, type);
    if (!touches) {
      return;
    }
    this.callback(this.manager, type, {
      pointers: touches[0],
      changedPointers: touches[1],
      pointerType: INPUT_TYPE_TOUCH,
      srcEvent: ev
    });
  };
  return TouchInput2;
}(Input);
function getTouches(ev, type) {
  var allTouches = toArray(ev.touches);
  var targetIds = this.targetIds;
  if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
    targetIds[allTouches[0].identifier] = true;
    return [allTouches, allTouches];
  }
  var i;
  var targetTouches;
  var changedTouches = toArray(ev.changedTouches);
  var changedTargetTouches = [];
  var target = this.target;
  targetTouches = allTouches.filter(function(touch) {
    return hasParent(touch.target, target);
  });
  if (type === INPUT_START) {
    i = 0;
    while (i < targetTouches.length) {
      targetIds[targetTouches[i].identifier] = true;
      i++;
    }
  }
  i = 0;
  while (i < changedTouches.length) {
    if (targetIds[changedTouches[i].identifier]) {
      changedTargetTouches.push(changedTouches[i]);
    }
    if (type & (INPUT_END | INPUT_CANCEL)) {
      delete targetIds[changedTouches[i].identifier];
    }
    i++;
  }
  if (!changedTargetTouches.length) {
    return;
  }
  return [
    uniqueArray(targetTouches.concat(changedTargetTouches), "identifier", true),
    changedTargetTouches
  ];
}
var MOUSE_INPUT_MAP = {
  mousedown: INPUT_START,
  mousemove: INPUT_MOVE,
  mouseup: INPUT_END
};
var MOUSE_ELEMENT_EVENTS = "mousedown";
var MOUSE_WINDOW_EVENTS = "mousemove mouseup";
var MouseInput = /* @__PURE__ */ function(_Input) {
  _inheritsLoose(MouseInput2, _Input);
  function MouseInput2() {
    var _this;
    var proto = MouseInput2.prototype;
    proto.evEl = MOUSE_ELEMENT_EVENTS;
    proto.evWin = MOUSE_WINDOW_EVENTS;
    _this = _Input.apply(this, arguments) || this;
    _this.pressed = false;
    return _this;
  }
  var _proto = MouseInput2.prototype;
  _proto.handler = function handler(ev) {
    var eventType = MOUSE_INPUT_MAP[ev.type];
    if (eventType & INPUT_START && ev.button === 0) {
      this.pressed = true;
    }
    if (eventType & INPUT_MOVE && ev.which !== 1) {
      eventType = INPUT_END;
    }
    if (!this.pressed) {
      return;
    }
    if (eventType & INPUT_END) {
      this.pressed = false;
    }
    this.callback(this.manager, eventType, {
      pointers: [ev],
      changedPointers: [ev],
      pointerType: INPUT_TYPE_MOUSE,
      srcEvent: ev
    });
  };
  return MouseInput2;
}(Input);
var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;
function setLastTouch(eventData) {
  var _eventData$changedPoi = eventData.changedPointers, touch = _eventData$changedPoi[0];
  if (touch.identifier === this.primaryTouch) {
    var lastTouch = {
      x: touch.clientX,
      y: touch.clientY
    };
    var lts = this.lastTouches;
    this.lastTouches.push(lastTouch);
    var removeLastTouch = function removeLastTouch2() {
      var i = lts.indexOf(lastTouch);
      if (i > -1) {
        lts.splice(i, 1);
      }
    };
    setTimeout(removeLastTouch, DEDUP_TIMEOUT);
  }
}
function recordTouches(eventType, eventData) {
  if (eventType & INPUT_START) {
    this.primaryTouch = eventData.changedPointers[0].identifier;
    setLastTouch.call(this, eventData);
  } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
    setLastTouch.call(this, eventData);
  }
}
function isSyntheticEvent(eventData) {
  var x = eventData.srcEvent.clientX;
  var y = eventData.srcEvent.clientY;
  for (var i = 0; i < this.lastTouches.length; i++) {
    var t = this.lastTouches[i];
    var dx = Math.abs(x - t.x);
    var dy = Math.abs(y - t.y);
    if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
      return true;
    }
  }
  return false;
}
var TouchMouseInput = /* @__PURE__ */ function() {
  var TouchMouseInput2 = /* @__PURE__ */ function(_Input) {
    _inheritsLoose(TouchMouseInput3, _Input);
    function TouchMouseInput3(_manager, callback) {
      var _this;
      _this = _Input.call(this, _manager, callback) || this;
      _this.handler = function(manager, inputEvent, inputData) {
        var isTouch = inputData.pointerType === INPUT_TYPE_TOUCH;
        var isMouse = inputData.pointerType === INPUT_TYPE_MOUSE;
        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
          return;
        }
        if (isTouch) {
          recordTouches.call(_assertThisInitialized(_assertThisInitialized(_this)), inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(_assertThisInitialized(_assertThisInitialized(_this)), inputData)) {
          return;
        }
        _this.callback(manager, inputEvent, inputData);
      };
      _this.touch = new TouchInput(_this.manager, _this.handler);
      _this.mouse = new MouseInput(_this.manager, _this.handler);
      _this.primaryTouch = null;
      _this.lastTouches = [];
      return _this;
    }
    var _proto = TouchMouseInput3.prototype;
    _proto.destroy = function destroy() {
      this.touch.destroy();
      this.mouse.destroy();
    };
    return TouchMouseInput3;
  }(Input);
  return TouchMouseInput2;
}();
function createInputInstance(manager) {
  var Type;
  var inputClass = manager.options.inputClass;
  if (inputClass) {
    Type = inputClass;
  } else if (SUPPORT_POINTER_EVENTS) {
    Type = PointerEventInput;
  } else if (SUPPORT_ONLY_TOUCH) {
    Type = TouchInput;
  } else if (!SUPPORT_TOUCH) {
    Type = MouseInput;
  } else {
    Type = TouchMouseInput;
  }
  return new Type(manager, inputHandler);
}
function invokeArrayArg(arg, fn2, context) {
  if (Array.isArray(arg)) {
    each(arg, context[fn2], context);
    return true;
  }
  return false;
}
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;
var _uniqueId = 1;
function uniqueId() {
  return _uniqueId++;
}
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
  var manager = recognizer.manager;
  if (manager) {
    return manager.get(otherRecognizer);
  }
  return otherRecognizer;
}
function stateStr(state) {
  if (state & STATE_CANCELLED) {
    return "cancel";
  } else if (state & STATE_ENDED) {
    return "end";
  } else if (state & STATE_CHANGED) {
    return "move";
  } else if (state & STATE_BEGAN) {
    return "start";
  }
  return "";
}
var Recognizer = /* @__PURE__ */ function() {
  function Recognizer2(options) {
    if (options === void 0) {
      options = {};
    }
    this.options = _extends({
      enable: true
    }, options);
    this.id = uniqueId();
    this.manager = null;
    this.state = STATE_POSSIBLE;
    this.simultaneous = {};
    this.requireFail = [];
  }
  var _proto = Recognizer2.prototype;
  _proto.set = function set2(options) {
    assign$1$1(this.options, options);
    this.manager && this.manager.touchAction.update();
    return this;
  };
  _proto.recognizeWith = function recognizeWith(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, "recognizeWith", this)) {
      return this;
    }
    var simultaneous = this.simultaneous;
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    if (!simultaneous[otherRecognizer.id]) {
      simultaneous[otherRecognizer.id] = otherRecognizer;
      otherRecognizer.recognizeWith(this);
    }
    return this;
  };
  _proto.dropRecognizeWith = function dropRecognizeWith(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, "dropRecognizeWith", this)) {
      return this;
    }
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    delete this.simultaneous[otherRecognizer.id];
    return this;
  };
  _proto.requireFailure = function requireFailure(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, "requireFailure", this)) {
      return this;
    }
    var requireFail = this.requireFail;
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    if (inArray(requireFail, otherRecognizer) === -1) {
      requireFail.push(otherRecognizer);
      otherRecognizer.requireFailure(this);
    }
    return this;
  };
  _proto.dropRequireFailure = function dropRequireFailure(otherRecognizer) {
    if (invokeArrayArg(otherRecognizer, "dropRequireFailure", this)) {
      return this;
    }
    otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
    var index = inArray(this.requireFail, otherRecognizer);
    if (index > -1) {
      this.requireFail.splice(index, 1);
    }
    return this;
  };
  _proto.hasRequireFailures = function hasRequireFailures() {
    return this.requireFail.length > 0;
  };
  _proto.canRecognizeWith = function canRecognizeWith(otherRecognizer) {
    return !!this.simultaneous[otherRecognizer.id];
  };
  _proto.emit = function emit(input) {
    var self2 = this;
    var state = this.state;
    function emit2(event) {
      self2.manager.emit(event, input);
    }
    if (state < STATE_ENDED) {
      emit2(self2.options.event + stateStr(state));
    }
    emit2(self2.options.event);
    if (input.additionalEvent) {
      emit2(input.additionalEvent);
    }
    if (state >= STATE_ENDED) {
      emit2(self2.options.event + stateStr(state));
    }
  };
  _proto.tryEmit = function tryEmit(input) {
    if (this.canEmit()) {
      return this.emit(input);
    }
    this.state = STATE_FAILED;
  };
  _proto.canEmit = function canEmit() {
    var i = 0;
    while (i < this.requireFail.length) {
      if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
        return false;
      }
      i++;
    }
    return true;
  };
  _proto.recognize = function recognize(inputData) {
    var inputDataClone = assign$1$1({}, inputData);
    if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
      this.reset();
      this.state = STATE_FAILED;
      return;
    }
    if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
      this.state = STATE_POSSIBLE;
    }
    this.state = this.process(inputDataClone);
    if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
      this.tryEmit(inputDataClone);
    }
  };
  _proto.process = function process2(inputData) {
  };
  _proto.getTouchAction = function getTouchAction() {
  };
  _proto.reset = function reset() {
  };
  return Recognizer2;
}();
var TapRecognizer = /* @__PURE__ */ function(_Recognizer) {
  _inheritsLoose(TapRecognizer2, _Recognizer);
  function TapRecognizer2(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _Recognizer.call(this, _extends({
      event: "tap",
      pointers: 1,
      taps: 1,
      interval: 300,
      time: 250,
      threshold: 9,
      posThreshold: 10
    }, options)) || this;
    _this.pTime = false;
    _this.pCenter = false;
    _this._timer = null;
    _this._input = null;
    _this.count = 0;
    return _this;
  }
  var _proto = TapRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    return [TOUCH_ACTION_MANIPULATION];
  };
  _proto.process = function process2(input) {
    var _this2 = this;
    var options = this.options;
    var validPointers = input.pointers.length === options.pointers;
    var validMovement = input.distance < options.threshold;
    var validTouchTime = input.deltaTime < options.time;
    this.reset();
    if (input.eventType & INPUT_START && this.count === 0) {
      return this.failTimeout();
    }
    if (validMovement && validTouchTime && validPointers) {
      if (input.eventType !== INPUT_END) {
        return this.failTimeout();
      }
      var validInterval = this.pTime ? input.timeStamp - this.pTime < options.interval : true;
      var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;
      this.pTime = input.timeStamp;
      this.pCenter = input.center;
      if (!validMultiTap || !validInterval) {
        this.count = 1;
      } else {
        this.count += 1;
      }
      this._input = input;
      var tapCount = this.count % options.taps;
      if (tapCount === 0) {
        if (!this.hasRequireFailures()) {
          return STATE_RECOGNIZED;
        } else {
          this._timer = setTimeout(function() {
            _this2.state = STATE_RECOGNIZED;
            _this2.tryEmit();
          }, options.interval);
          return STATE_BEGAN;
        }
      }
    }
    return STATE_FAILED;
  };
  _proto.failTimeout = function failTimeout() {
    var _this3 = this;
    this._timer = setTimeout(function() {
      _this3.state = STATE_FAILED;
    }, this.options.interval);
    return STATE_FAILED;
  };
  _proto.reset = function reset() {
    clearTimeout(this._timer);
  };
  _proto.emit = function emit() {
    if (this.state === STATE_RECOGNIZED) {
      this._input.tapCount = this.count;
      this.manager.emit(this.options.event, this._input);
    }
  };
  return TapRecognizer2;
}(Recognizer);
var AttrRecognizer = /* @__PURE__ */ function(_Recognizer) {
  _inheritsLoose(AttrRecognizer2, _Recognizer);
  function AttrRecognizer2(options) {
    if (options === void 0) {
      options = {};
    }
    return _Recognizer.call(this, _extends({
      pointers: 1
    }, options)) || this;
  }
  var _proto = AttrRecognizer2.prototype;
  _proto.attrTest = function attrTest(input) {
    var optionPointers = this.options.pointers;
    return optionPointers === 0 || input.pointers.length === optionPointers;
  };
  _proto.process = function process2(input) {
    var state = this.state;
    var eventType = input.eventType;
    var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
    var isValid = this.attrTest(input);
    if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
      return state | STATE_CANCELLED;
    } else if (isRecognized || isValid) {
      if (eventType & INPUT_END) {
        return state | STATE_ENDED;
      } else if (!(state & STATE_BEGAN)) {
        return STATE_BEGAN;
      }
      return state | STATE_CHANGED;
    }
    return STATE_FAILED;
  };
  return AttrRecognizer2;
}(Recognizer);
function directionStr(direction) {
  if (direction === DIRECTION_DOWN) {
    return "down";
  } else if (direction === DIRECTION_UP) {
    return "up";
  } else if (direction === DIRECTION_LEFT) {
    return "left";
  } else if (direction === DIRECTION_RIGHT) {
    return "right";
  }
  return "";
}
var PanRecognizer = /* @__PURE__ */ function(_AttrRecognizer) {
  _inheritsLoose(PanRecognizer2, _AttrRecognizer);
  function PanRecognizer2(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _AttrRecognizer.call(this, _extends({
      event: "pan",
      threshold: 10,
      pointers: 1,
      direction: DIRECTION_ALL
    }, options)) || this;
    _this.pX = null;
    _this.pY = null;
    return _this;
  }
  var _proto = PanRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    var direction = this.options.direction;
    var actions = [];
    if (direction & DIRECTION_HORIZONTAL) {
      actions.push(TOUCH_ACTION_PAN_Y);
    }
    if (direction & DIRECTION_VERTICAL) {
      actions.push(TOUCH_ACTION_PAN_X);
    }
    return actions;
  };
  _proto.directionTest = function directionTest(input) {
    var options = this.options;
    var hasMoved = true;
    var distance = input.distance;
    var direction = input.direction;
    var x = input.deltaX;
    var y = input.deltaY;
    if (!(direction & options.direction)) {
      if (options.direction & DIRECTION_HORIZONTAL) {
        direction = x === 0 ? DIRECTION_NONE : x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        hasMoved = x !== this.pX;
        distance = Math.abs(input.deltaX);
      } else {
        direction = y === 0 ? DIRECTION_NONE : y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
        hasMoved = y !== this.pY;
        distance = Math.abs(input.deltaY);
      }
    }
    input.direction = direction;
    return hasMoved && distance > options.threshold && direction & options.direction;
  };
  _proto.attrTest = function attrTest(input) {
    return AttrRecognizer.prototype.attrTest.call(this, input) && (this.state & STATE_BEGAN || !(this.state & STATE_BEGAN) && this.directionTest(input));
  };
  _proto.emit = function emit(input) {
    this.pX = input.deltaX;
    this.pY = input.deltaY;
    var direction = directionStr(input.direction);
    if (direction) {
      input.additionalEvent = this.options.event + direction;
    }
    _AttrRecognizer.prototype.emit.call(this, input);
  };
  return PanRecognizer2;
}(AttrRecognizer);
var SwipeRecognizer = /* @__PURE__ */ function(_AttrRecognizer) {
  _inheritsLoose(SwipeRecognizer2, _AttrRecognizer);
  function SwipeRecognizer2(options) {
    if (options === void 0) {
      options = {};
    }
    return _AttrRecognizer.call(this, _extends({
      event: "swipe",
      threshold: 10,
      velocity: 0.3,
      direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
      pointers: 1
    }, options)) || this;
  }
  var _proto = SwipeRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    return PanRecognizer.prototype.getTouchAction.call(this);
  };
  _proto.attrTest = function attrTest(input) {
    var direction = this.options.direction;
    var velocity;
    if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
      velocity = input.overallVelocity;
    } else if (direction & DIRECTION_HORIZONTAL) {
      velocity = input.overallVelocityX;
    } else if (direction & DIRECTION_VERTICAL) {
      velocity = input.overallVelocityY;
    }
    return _AttrRecognizer.prototype.attrTest.call(this, input) && direction & input.offsetDirection && input.distance > this.options.threshold && input.maxPointers === this.options.pointers && abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
  };
  _proto.emit = function emit(input) {
    var direction = directionStr(input.offsetDirection);
    if (direction) {
      this.manager.emit(this.options.event + direction, input);
    }
    this.manager.emit(this.options.event, input);
  };
  return SwipeRecognizer2;
}(AttrRecognizer);
var PinchRecognizer = /* @__PURE__ */ function(_AttrRecognizer) {
  _inheritsLoose(PinchRecognizer2, _AttrRecognizer);
  function PinchRecognizer2(options) {
    if (options === void 0) {
      options = {};
    }
    return _AttrRecognizer.call(this, _extends({
      event: "pinch",
      threshold: 0,
      pointers: 2
    }, options)) || this;
  }
  var _proto = PinchRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    return [TOUCH_ACTION_NONE];
  };
  _proto.attrTest = function attrTest(input) {
    return _AttrRecognizer.prototype.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
  };
  _proto.emit = function emit(input) {
    if (input.scale !== 1) {
      var inOut = input.scale < 1 ? "in" : "out";
      input.additionalEvent = this.options.event + inOut;
    }
    _AttrRecognizer.prototype.emit.call(this, input);
  };
  return PinchRecognizer2;
}(AttrRecognizer);
var RotateRecognizer = /* @__PURE__ */ function(_AttrRecognizer) {
  _inheritsLoose(RotateRecognizer2, _AttrRecognizer);
  function RotateRecognizer2(options) {
    if (options === void 0) {
      options = {};
    }
    return _AttrRecognizer.call(this, _extends({
      event: "rotate",
      threshold: 0,
      pointers: 2
    }, options)) || this;
  }
  var _proto = RotateRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    return [TOUCH_ACTION_NONE];
  };
  _proto.attrTest = function attrTest(input) {
    return _AttrRecognizer.prototype.attrTest.call(this, input) && (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
  };
  return RotateRecognizer2;
}(AttrRecognizer);
var PressRecognizer = /* @__PURE__ */ function(_Recognizer) {
  _inheritsLoose(PressRecognizer2, _Recognizer);
  function PressRecognizer2(options) {
    var _this;
    if (options === void 0) {
      options = {};
    }
    _this = _Recognizer.call(this, _extends({
      event: "press",
      pointers: 1,
      time: 251,
      threshold: 9
    }, options)) || this;
    _this._timer = null;
    _this._input = null;
    return _this;
  }
  var _proto = PressRecognizer2.prototype;
  _proto.getTouchAction = function getTouchAction() {
    return [TOUCH_ACTION_AUTO];
  };
  _proto.process = function process2(input) {
    var _this2 = this;
    var options = this.options;
    var validPointers = input.pointers.length === options.pointers;
    var validMovement = input.distance < options.threshold;
    var validTime = input.deltaTime > options.time;
    this._input = input;
    if (!validMovement || !validPointers || input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime) {
      this.reset();
    } else if (input.eventType & INPUT_START) {
      this.reset();
      this._timer = setTimeout(function() {
        _this2.state = STATE_RECOGNIZED;
        _this2.tryEmit();
      }, options.time);
    } else if (input.eventType & INPUT_END) {
      return STATE_RECOGNIZED;
    }
    return STATE_FAILED;
  };
  _proto.reset = function reset() {
    clearTimeout(this._timer);
  };
  _proto.emit = function emit(input) {
    if (this.state !== STATE_RECOGNIZED) {
      return;
    }
    if (input && input.eventType & INPUT_END) {
      this.manager.emit(this.options.event + "up", input);
    } else {
      this._input.timeStamp = now();
      this.manager.emit(this.options.event, this._input);
    }
  };
  return PressRecognizer2;
}(Recognizer);
var defaults$2 = {
  domEvents: false,
  touchAction: TOUCH_ACTION_COMPUTE,
  enable: true,
  inputTarget: null,
  inputClass: null,
  cssProps: {
    userSelect: "none",
    touchSelect: "none",
    touchCallout: "none",
    contentZooming: "none",
    userDrag: "none",
    tapHighlightColor: "rgba(0,0,0,0)"
  }
};
var preset = [[RotateRecognizer, {
  enable: false
}], [PinchRecognizer, {
  enable: false
}, ["rotate"]], [SwipeRecognizer, {
  direction: DIRECTION_HORIZONTAL
}], [PanRecognizer, {
  direction: DIRECTION_HORIZONTAL
}, ["swipe"]], [TapRecognizer], [TapRecognizer, {
  event: "doubletap",
  taps: 2
}, ["tap"]], [PressRecognizer]];
var STOP = 1;
var FORCED_STOP = 2;
function toggleCssProps(manager, add) {
  var element2 = manager.element;
  if (!element2.style) {
    return;
  }
  var prop;
  each(manager.options.cssProps, function(value, name) {
    prop = prefixed(element2.style, name);
    if (add) {
      manager.oldCssProps[prop] = element2.style[prop];
      element2.style[prop] = value;
    } else {
      element2.style[prop] = manager.oldCssProps[prop] || "";
    }
  });
  if (!add) {
    manager.oldCssProps = {};
  }
}
function triggerDomEvent(event, data2) {
  var gestureEvent = document.createEvent("Event");
  gestureEvent.initEvent(event, true, true);
  gestureEvent.gesture = data2;
  data2.target.dispatchEvent(gestureEvent);
}
var Manager = /* @__PURE__ */ function() {
  function Manager2(element2, options) {
    var _this = this;
    this.options = assign$1$1({}, defaults$2, options || {});
    this.options.inputTarget = this.options.inputTarget || element2;
    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};
    this.element = element2;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);
    toggleCssProps(this, true);
    each(this.options.recognizers, function(item) {
      var recognizer = _this.add(new item[0](item[1]));
      item[2] && recognizer.recognizeWith(item[2]);
      item[3] && recognizer.requireFailure(item[3]);
    }, this);
  }
  var _proto = Manager2.prototype;
  _proto.set = function set2(options) {
    assign$1$1(this.options, options);
    if (options.touchAction) {
      this.touchAction.update();
    }
    if (options.inputTarget) {
      this.input.destroy();
      this.input.target = options.inputTarget;
      this.input.init();
    }
    return this;
  };
  _proto.stop = function stop(force) {
    this.session.stopped = force ? FORCED_STOP : STOP;
  };
  _proto.recognize = function recognize(inputData) {
    var session = this.session;
    if (session.stopped) {
      return;
    }
    this.touchAction.preventDefaults(inputData);
    var recognizer;
    var recognizers = this.recognizers;
    var curRecognizer = session.curRecognizer;
    if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
      session.curRecognizer = null;
      curRecognizer = null;
    }
    var i = 0;
    while (i < recognizers.length) {
      recognizer = recognizers[i];
      if (session.stopped !== FORCED_STOP && (!curRecognizer || recognizer === curRecognizer || recognizer.canRecognizeWith(curRecognizer))) {
        recognizer.recognize(inputData);
      } else {
        recognizer.reset();
      }
      if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
        session.curRecognizer = recognizer;
        curRecognizer = recognizer;
      }
      i++;
    }
  };
  _proto.get = function get2(recognizer) {
    if (recognizer instanceof Recognizer) {
      return recognizer;
    }
    var recognizers = this.recognizers;
    for (var i = 0; i < recognizers.length; i++) {
      if (recognizers[i].options.event === recognizer) {
        return recognizers[i];
      }
    }
    return null;
  };
  _proto.add = function add(recognizer) {
    if (invokeArrayArg(recognizer, "add", this)) {
      return this;
    }
    var existing = this.get(recognizer.options.event);
    if (existing) {
      this.remove(existing);
    }
    this.recognizers.push(recognizer);
    recognizer.manager = this;
    this.touchAction.update();
    return recognizer;
  };
  _proto.remove = function remove(recognizer) {
    if (invokeArrayArg(recognizer, "remove", this)) {
      return this;
    }
    var targetRecognizer = this.get(recognizer);
    if (recognizer) {
      var recognizers = this.recognizers;
      var index = inArray(recognizers, targetRecognizer);
      if (index !== -1) {
        recognizers.splice(index, 1);
        this.touchAction.update();
      }
    }
    return this;
  };
  _proto.on = function on(events2, handler) {
    if (events2 === void 0 || handler === void 0) {
      return this;
    }
    var handlers = this.handlers;
    each(splitStr(events2), function(event) {
      handlers[event] = handlers[event] || [];
      handlers[event].push(handler);
    });
    return this;
  };
  _proto.off = function off(events2, handler) {
    if (events2 === void 0) {
      return this;
    }
    var handlers = this.handlers;
    each(splitStr(events2), function(event) {
      if (!handler) {
        delete handlers[event];
      } else {
        handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
      }
    });
    return this;
  };
  _proto.emit = function emit(event, data2) {
    if (this.options.domEvents) {
      triggerDomEvent(event, data2);
    }
    var handlers = this.handlers[event] && this.handlers[event].slice();
    if (!handlers || !handlers.length) {
      return;
    }
    data2.type = event;
    data2.preventDefault = function() {
      data2.srcEvent.preventDefault();
    };
    var i = 0;
    while (i < handlers.length) {
      handlers[i](data2);
      i++;
    }
  };
  _proto.destroy = function destroy() {
    this.element && toggleCssProps(this, false);
    this.handlers = {};
    this.session = {};
    this.input.destroy();
    this.element = null;
  };
  return Manager2;
}();
var SINGLE_TOUCH_INPUT_MAP = {
  touchstart: INPUT_START,
  touchmove: INPUT_MOVE,
  touchend: INPUT_END,
  touchcancel: INPUT_CANCEL
};
var SINGLE_TOUCH_TARGET_EVENTS = "touchstart";
var SINGLE_TOUCH_WINDOW_EVENTS = "touchstart touchmove touchend touchcancel";
var SingleTouchInput = /* @__PURE__ */ function(_Input) {
  _inheritsLoose(SingleTouchInput2, _Input);
  function SingleTouchInput2() {
    var _this;
    var proto = SingleTouchInput2.prototype;
    proto.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    proto.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    _this = _Input.apply(this, arguments) || this;
    _this.started = false;
    return _this;
  }
  var _proto = SingleTouchInput2.prototype;
  _proto.handler = function handler(ev) {
    var type = SINGLE_TOUCH_INPUT_MAP[ev.type];
    if (type === INPUT_START) {
      this.started = true;
    }
    if (!this.started) {
      return;
    }
    var touches = normalizeSingleTouches.call(this, ev, type);
    if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
      this.started = false;
    }
    this.callback(this.manager, type, {
      pointers: touches[0],
      changedPointers: touches[1],
      pointerType: INPUT_TYPE_TOUCH,
      srcEvent: ev
    });
  };
  return SingleTouchInput2;
}(Input);
function normalizeSingleTouches(ev, type) {
  var all = toArray(ev.touches);
  var changed = toArray(ev.changedTouches);
  if (type & (INPUT_END | INPUT_CANCEL)) {
    all = uniqueArray(all.concat(changed), "identifier", true);
  }
  return [all, changed];
}
function deprecate(method, name, message) {
  var deprecationMessage = "DEPRECATED METHOD: " + name + "\n" + message + " AT \n";
  return function() {
    var e = new Error("get-stack-trace");
    var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, "").replace(/^\s+at\s+/gm, "").replace(/^Object.<anonymous>\s*\(/gm, "{anonymous}()@") : "Unknown Stack Trace";
    var log = window.console && (window.console.warn || window.console.log);
    if (log) {
      log.call(window.console, deprecationMessage, stack);
    }
    return method.apply(this, arguments);
  };
}
var extend = deprecate(function(dest, src2, merge3) {
  var keys2 = Object.keys(src2);
  var i = 0;
  while (i < keys2.length) {
    if (!merge3 || merge3 && dest[keys2[i]] === void 0) {
      dest[keys2[i]] = src2[keys2[i]];
    }
    i++;
  }
  return dest;
}, "extend", "Use `assign`.");
var merge$1 = deprecate(function(dest, src2) {
  return extend(dest, src2, true);
}, "merge", "Use `assign`.");
function inherit(child, base, properties) {
  var baseP = base.prototype;
  var childP;
  childP = child.prototype = Object.create(baseP);
  childP.constructor = child;
  childP._super = baseP;
  if (properties) {
    assign$1$1(childP, properties);
  }
}
function bindFn(fn2, context) {
  return function boundFn() {
    return fn2.apply(context, arguments);
  };
}
var Hammer = /* @__PURE__ */ function() {
  var Hammer2 = function Hammer3(element2, options) {
    if (options === void 0) {
      options = {};
    }
    return new Manager(element2, _extends({
      recognizers: preset.concat()
    }, options));
  };
  Hammer2.VERSION = "2.0.17-rc";
  Hammer2.DIRECTION_ALL = DIRECTION_ALL;
  Hammer2.DIRECTION_DOWN = DIRECTION_DOWN;
  Hammer2.DIRECTION_LEFT = DIRECTION_LEFT;
  Hammer2.DIRECTION_RIGHT = DIRECTION_RIGHT;
  Hammer2.DIRECTION_UP = DIRECTION_UP;
  Hammer2.DIRECTION_HORIZONTAL = DIRECTION_HORIZONTAL;
  Hammer2.DIRECTION_VERTICAL = DIRECTION_VERTICAL;
  Hammer2.DIRECTION_NONE = DIRECTION_NONE;
  Hammer2.DIRECTION_DOWN = DIRECTION_DOWN;
  Hammer2.INPUT_START = INPUT_START;
  Hammer2.INPUT_MOVE = INPUT_MOVE;
  Hammer2.INPUT_END = INPUT_END;
  Hammer2.INPUT_CANCEL = INPUT_CANCEL;
  Hammer2.STATE_POSSIBLE = STATE_POSSIBLE;
  Hammer2.STATE_BEGAN = STATE_BEGAN;
  Hammer2.STATE_CHANGED = STATE_CHANGED;
  Hammer2.STATE_ENDED = STATE_ENDED;
  Hammer2.STATE_RECOGNIZED = STATE_RECOGNIZED;
  Hammer2.STATE_CANCELLED = STATE_CANCELLED;
  Hammer2.STATE_FAILED = STATE_FAILED;
  Hammer2.Manager = Manager;
  Hammer2.Input = Input;
  Hammer2.TouchAction = TouchAction;
  Hammer2.TouchInput = TouchInput;
  Hammer2.MouseInput = MouseInput;
  Hammer2.PointerEventInput = PointerEventInput;
  Hammer2.TouchMouseInput = TouchMouseInput;
  Hammer2.SingleTouchInput = SingleTouchInput;
  Hammer2.Recognizer = Recognizer;
  Hammer2.AttrRecognizer = AttrRecognizer;
  Hammer2.Tap = TapRecognizer;
  Hammer2.Pan = PanRecognizer;
  Hammer2.Swipe = SwipeRecognizer;
  Hammer2.Pinch = PinchRecognizer;
  Hammer2.Rotate = RotateRecognizer;
  Hammer2.Press = PressRecognizer;
  Hammer2.on = addEventListeners;
  Hammer2.off = removeEventListeners;
  Hammer2.each = each;
  Hammer2.merge = merge$1;
  Hammer2.extend = extend;
  Hammer2.bindFn = bindFn;
  Hammer2.assign = assign$1$1;
  Hammer2.inherit = inherit;
  Hammer2.bindFn = bindFn;
  Hammer2.prefixed = prefixed;
  Hammer2.toArray = toArray;
  Hammer2.inArray = inArray;
  Hammer2.uniqueArray = uniqueArray;
  Hammer2.splitStr = splitStr;
  Hammer2.boolOrFn = boolOrFn;
  Hammer2.hasParent = hasParent;
  Hammer2.addEventListeners = addEventListeners;
  Hammer2.removeEventListeners = removeEventListeners;
  Hammer2.defaults = assign$1$1({}, defaults$2, {
    preset
  });
  return Hammer2;
}();
const Hammer$1 = Hammer;
function pinch(node) {
  const hammer = new Hammer$1.Manager(node);
  const pinch2 = new Hammer$1.Pinch();
  hammer.add(pinch2);
  hammer.on("pinchmove", function(e) {
    node.dispatchEvent(new CustomEvent("pinchmove", { detail: e }));
  });
  hammer.on("pinchstart", function(e) {
    node.dispatchEvent(new CustomEvent("pinchstart", { detail: e }));
  });
  return {
    destroy() {
    }
  };
}
function pan(node) {
  const hammer = new Hammer$1.Manager(node);
  const pan2 = new Hammer$1.Pan();
  hammer.add(pan2);
  hammer.on("panmove", function(e) {
    node.dispatchEvent(new CustomEvent("panmove", { detail: e }));
  });
  return {
    destroy() {
    }
  };
}
var shams = function hasSymbols() {
  if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
    return false;
  }
  if (typeof Symbol.iterator === "symbol") {
    return true;
  }
  var obj = {};
  var sym = Symbol("test");
  var symObj = Object(sym);
  if (typeof sym === "string") {
    return false;
  }
  if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
    return false;
  }
  if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
    return false;
  }
  var symVal = 42;
  obj[sym] = symVal;
  for (sym in obj) {
    return false;
  }
  if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
    return false;
  }
  if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
    return false;
  }
  var syms = Object.getOwnPropertySymbols(obj);
  if (syms.length !== 1 || syms[0] !== sym) {
    return false;
  }
  if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
    return false;
  }
  if (typeof Object.getOwnPropertyDescriptor === "function") {
    var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
    if (descriptor.value !== symVal || descriptor.enumerable !== true) {
      return false;
    }
  }
  return true;
};
var origSymbol = typeof Symbol !== "undefined" && Symbol;
var hasSymbolSham = shams;
var hasSymbols$1 = function hasNativeSymbols() {
  if (typeof origSymbol !== "function") {
    return false;
  }
  if (typeof Symbol !== "function") {
    return false;
  }
  if (typeof origSymbol("foo") !== "symbol") {
    return false;
  }
  if (typeof Symbol("bar") !== "symbol") {
    return false;
  }
  return hasSymbolSham();
};
var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
var slice = Array.prototype.slice;
var toStr$1 = Object.prototype.toString;
var funcType = "[object Function]";
var implementation$1 = function bind(that) {
  var target = this;
  if (typeof target !== "function" || toStr$1.call(target) !== funcType) {
    throw new TypeError(ERROR_MESSAGE + target);
  }
  var args = slice.call(arguments, 1);
  var bound;
  var binder = function() {
    if (this instanceof bound) {
      var result = target.apply(
        this,
        args.concat(slice.call(arguments))
      );
      if (Object(result) === result) {
        return result;
      }
      return this;
    } else {
      return target.apply(
        that,
        args.concat(slice.call(arguments))
      );
    }
  };
  var boundLength = Math.max(0, target.length - args.length);
  var boundArgs = [];
  for (var i = 0; i < boundLength; i++) {
    boundArgs.push("$" + i);
  }
  bound = Function("binder", "return function (" + boundArgs.join(",") + "){ return binder.apply(this,arguments); }")(binder);
  if (target.prototype) {
    var Empty = function Empty2() {
    };
    Empty.prototype = target.prototype;
    bound.prototype = new Empty();
    Empty.prototype = null;
  }
  return bound;
};
var implementation = implementation$1;
var functionBind = Function.prototype.bind || implementation;
var bind$1 = functionBind;
var src = bind$1.call(Function.call, Object.prototype.hasOwnProperty);
var undefined$1;
var $SyntaxError = SyntaxError;
var $Function = Function;
var $TypeError$1 = TypeError;
var getEvalledConstructor = function(expressionSyntax) {
  try {
    return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
  } catch (e) {
  }
};
var $gOPD = Object.getOwnPropertyDescriptor;
if ($gOPD) {
  try {
    $gOPD({}, "");
  } catch (e) {
    $gOPD = null;
  }
}
var throwTypeError = function() {
  throw new $TypeError$1();
};
var ThrowTypeError = $gOPD ? function() {
  try {
    arguments.callee;
    return throwTypeError;
  } catch (calleeThrows) {
    try {
      return $gOPD(arguments, "callee").get;
    } catch (gOPDthrows) {
      return throwTypeError;
    }
  }
}() : throwTypeError;
var hasSymbols2 = hasSymbols$1();
var getProto = Object.getPrototypeOf || function(x) {
  return x.__proto__;
};
var needsEval = {};
var TypedArray = typeof Uint8Array === "undefined" ? undefined$1 : getProto(Uint8Array);
var INTRINSICS = {
  "%AggregateError%": typeof AggregateError === "undefined" ? undefined$1 : AggregateError,
  "%Array%": Array,
  "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined$1 : ArrayBuffer,
  "%ArrayIteratorPrototype%": hasSymbols2 ? getProto([][Symbol.iterator]()) : undefined$1,
  "%AsyncFromSyncIteratorPrototype%": undefined$1,
  "%AsyncFunction%": needsEval,
  "%AsyncGenerator%": needsEval,
  "%AsyncGeneratorFunction%": needsEval,
  "%AsyncIteratorPrototype%": needsEval,
  "%Atomics%": typeof Atomics === "undefined" ? undefined$1 : Atomics,
  "%BigInt%": typeof BigInt === "undefined" ? undefined$1 : BigInt,
  "%Boolean%": Boolean,
  "%DataView%": typeof DataView === "undefined" ? undefined$1 : DataView,
  "%Date%": Date,
  "%decodeURI%": decodeURI,
  "%decodeURIComponent%": decodeURIComponent,
  "%encodeURI%": encodeURI,
  "%encodeURIComponent%": encodeURIComponent,
  "%Error%": Error,
  "%eval%": eval,
  "%EvalError%": EvalError,
  "%Float32Array%": typeof Float32Array === "undefined" ? undefined$1 : Float32Array,
  "%Float64Array%": typeof Float64Array === "undefined" ? undefined$1 : Float64Array,
  "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined$1 : FinalizationRegistry,
  "%Function%": $Function,
  "%GeneratorFunction%": needsEval,
  "%Int8Array%": typeof Int8Array === "undefined" ? undefined$1 : Int8Array,
  "%Int16Array%": typeof Int16Array === "undefined" ? undefined$1 : Int16Array,
  "%Int32Array%": typeof Int32Array === "undefined" ? undefined$1 : Int32Array,
  "%isFinite%": isFinite,
  "%isNaN%": isNaN,
  "%IteratorPrototype%": hasSymbols2 ? getProto(getProto([][Symbol.iterator]())) : undefined$1,
  "%JSON%": typeof JSON === "object" ? JSON : undefined$1,
  "%Map%": typeof Map === "undefined" ? undefined$1 : Map,
  "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
  "%Math%": Math,
  "%Number%": Number,
  "%Object%": Object,
  "%parseFloat%": parseFloat,
  "%parseInt%": parseInt,
  "%Promise%": typeof Promise === "undefined" ? undefined$1 : Promise,
  "%Proxy%": typeof Proxy === "undefined" ? undefined$1 : Proxy,
  "%RangeError%": RangeError,
  "%ReferenceError%": ReferenceError,
  "%Reflect%": typeof Reflect === "undefined" ? undefined$1 : Reflect,
  "%RegExp%": RegExp,
  "%Set%": typeof Set === "undefined" ? undefined$1 : Set,
  "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols2 ? undefined$1 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
  "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined$1 : SharedArrayBuffer,
  "%String%": String,
  "%StringIteratorPrototype%": hasSymbols2 ? getProto(""[Symbol.iterator]()) : undefined$1,
  "%Symbol%": hasSymbols2 ? Symbol : undefined$1,
  "%SyntaxError%": $SyntaxError,
  "%ThrowTypeError%": ThrowTypeError,
  "%TypedArray%": TypedArray,
  "%TypeError%": $TypeError$1,
  "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined$1 : Uint8Array,
  "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined$1 : Uint8ClampedArray,
  "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined$1 : Uint16Array,
  "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined$1 : Uint32Array,
  "%URIError%": URIError,
  "%WeakMap%": typeof WeakMap === "undefined" ? undefined$1 : WeakMap,
  "%WeakRef%": typeof WeakRef === "undefined" ? undefined$1 : WeakRef,
  "%WeakSet%": typeof WeakSet === "undefined" ? undefined$1 : WeakSet
};
var doEval = function doEval2(name) {
  var value;
  if (name === "%AsyncFunction%") {
    value = getEvalledConstructor("async function () {}");
  } else if (name === "%GeneratorFunction%") {
    value = getEvalledConstructor("function* () {}");
  } else if (name === "%AsyncGeneratorFunction%") {
    value = getEvalledConstructor("async function* () {}");
  } else if (name === "%AsyncGenerator%") {
    var fn2 = doEval2("%AsyncGeneratorFunction%");
    if (fn2) {
      value = fn2.prototype;
    }
  } else if (name === "%AsyncIteratorPrototype%") {
    var gen = doEval2("%AsyncGenerator%");
    if (gen) {
      value = getProto(gen.prototype);
    }
  }
  INTRINSICS[name] = value;
  return value;
};
var LEGACY_ALIASES = {
  "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
  "%ArrayPrototype%": ["Array", "prototype"],
  "%ArrayProto_entries%": ["Array", "prototype", "entries"],
  "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
  "%ArrayProto_keys%": ["Array", "prototype", "keys"],
  "%ArrayProto_values%": ["Array", "prototype", "values"],
  "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
  "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
  "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
  "%BooleanPrototype%": ["Boolean", "prototype"],
  "%DataViewPrototype%": ["DataView", "prototype"],
  "%DatePrototype%": ["Date", "prototype"],
  "%ErrorPrototype%": ["Error", "prototype"],
  "%EvalErrorPrototype%": ["EvalError", "prototype"],
  "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
  "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
  "%FunctionPrototype%": ["Function", "prototype"],
  "%Generator%": ["GeneratorFunction", "prototype"],
  "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
  "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
  "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
  "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
  "%JSONParse%": ["JSON", "parse"],
  "%JSONStringify%": ["JSON", "stringify"],
  "%MapPrototype%": ["Map", "prototype"],
  "%NumberPrototype%": ["Number", "prototype"],
  "%ObjectPrototype%": ["Object", "prototype"],
  "%ObjProto_toString%": ["Object", "prototype", "toString"],
  "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
  "%PromisePrototype%": ["Promise", "prototype"],
  "%PromiseProto_then%": ["Promise", "prototype", "then"],
  "%Promise_all%": ["Promise", "all"],
  "%Promise_reject%": ["Promise", "reject"],
  "%Promise_resolve%": ["Promise", "resolve"],
  "%RangeErrorPrototype%": ["RangeError", "prototype"],
  "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
  "%RegExpPrototype%": ["RegExp", "prototype"],
  "%SetPrototype%": ["Set", "prototype"],
  "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
  "%StringPrototype%": ["String", "prototype"],
  "%SymbolPrototype%": ["Symbol", "prototype"],
  "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
  "%TypedArrayPrototype%": ["TypedArray", "prototype"],
  "%TypeErrorPrototype%": ["TypeError", "prototype"],
  "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
  "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
  "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
  "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
  "%URIErrorPrototype%": ["URIError", "prototype"],
  "%WeakMapPrototype%": ["WeakMap", "prototype"],
  "%WeakSetPrototype%": ["WeakSet", "prototype"]
};
var bind2 = functionBind;
var hasOwn$1 = src;
var $concat$1 = bind2.call(Function.call, Array.prototype.concat);
var $spliceApply = bind2.call(Function.apply, Array.prototype.splice);
var $replace$1 = bind2.call(Function.call, String.prototype.replace);
var $strSlice = bind2.call(Function.call, String.prototype.slice);
var $exec = bind2.call(Function.call, RegExp.prototype.exec);
var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
var reEscapeChar = /\\(\\)?/g;
var stringToPath = function stringToPath2(string) {
  var first = $strSlice(string, 0, 1);
  var last = $strSlice(string, -1);
  if (first === "%" && last !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
  } else if (last === "%" && first !== "%") {
    throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
  }
  var result = [];
  $replace$1(string, rePropName, function(match2, number, quote2, subString) {
    result[result.length] = quote2 ? $replace$1(subString, reEscapeChar, "$1") : number || match2;
  });
  return result;
};
var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
  var intrinsicName = name;
  var alias;
  if (hasOwn$1(LEGACY_ALIASES, intrinsicName)) {
    alias = LEGACY_ALIASES[intrinsicName];
    intrinsicName = "%" + alias[0] + "%";
  }
  if (hasOwn$1(INTRINSICS, intrinsicName)) {
    var value = INTRINSICS[intrinsicName];
    if (value === needsEval) {
      value = doEval(intrinsicName);
    }
    if (typeof value === "undefined" && !allowMissing) {
      throw new $TypeError$1("intrinsic " + name + " exists, but is not available. Please file an issue!");
    }
    return {
      alias,
      name: intrinsicName,
      value
    };
  }
  throw new $SyntaxError("intrinsic " + name + " does not exist!");
};
var getIntrinsic = function GetIntrinsic(name, allowMissing) {
  if (typeof name !== "string" || name.length === 0) {
    throw new $TypeError$1("intrinsic name must be a non-empty string");
  }
  if (arguments.length > 1 && typeof allowMissing !== "boolean") {
    throw new $TypeError$1('"allowMissing" argument must be a boolean');
  }
  if ($exec(/^%?[^%]*%?$/, name) === null) {
    throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
  }
  var parts = stringToPath(name);
  var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
  var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
  var intrinsicRealName = intrinsic.name;
  var value = intrinsic.value;
  var skipFurtherCaching = false;
  var alias = intrinsic.alias;
  if (alias) {
    intrinsicBaseName = alias[0];
    $spliceApply(parts, $concat$1([0, 1], alias));
  }
  for (var i = 1, isOwn = true; i < parts.length; i += 1) {
    var part = parts[i];
    var first = $strSlice(part, 0, 1);
    var last = $strSlice(part, -1);
    if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
      throw new $SyntaxError("property names with quotes must have matching quotes");
    }
    if (part === "constructor" || !isOwn) {
      skipFurtherCaching = true;
    }
    intrinsicBaseName += "." + part;
    intrinsicRealName = "%" + intrinsicBaseName + "%";
    if (hasOwn$1(INTRINSICS, intrinsicRealName)) {
      value = INTRINSICS[intrinsicRealName];
    } else if (value != null) {
      if (!(part in value)) {
        if (!allowMissing) {
          throw new $TypeError$1("base intrinsic for " + name + " exists, but the property is not available.");
        }
        return void 0;
      }
      if ($gOPD && i + 1 >= parts.length) {
        var desc = $gOPD(value, part);
        isOwn = !!desc;
        if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
          value = desc.get;
        } else {
          value = value[part];
        }
      } else {
        isOwn = hasOwn$1(value, part);
        value = value[part];
      }
      if (isOwn && !skipFurtherCaching) {
        INTRINSICS[intrinsicRealName] = value;
      }
    }
  }
  return value;
};
var callBind$1 = { exports: {} };
(function(module) {
  var bind3 = functionBind;
  var GetIntrinsic3 = getIntrinsic;
  var $apply = GetIntrinsic3("%Function.prototype.apply%");
  var $call = GetIntrinsic3("%Function.prototype.call%");
  var $reflectApply = GetIntrinsic3("%Reflect.apply%", true) || bind3.call($call, $apply);
  var $gOPD2 = GetIntrinsic3("%Object.getOwnPropertyDescriptor%", true);
  var $defineProperty2 = GetIntrinsic3("%Object.defineProperty%", true);
  var $max = GetIntrinsic3("%Math.max%");
  if ($defineProperty2) {
    try {
      $defineProperty2({}, "a", { value: 1 });
    } catch (e) {
      $defineProperty2 = null;
    }
  }
  module.exports = function callBind2(originalFunction) {
    var func = $reflectApply(bind3, $call, arguments);
    if ($gOPD2 && $defineProperty2) {
      var desc = $gOPD2(func, "length");
      if (desc.configurable) {
        $defineProperty2(
          func,
          "length",
          { value: 1 + $max(0, originalFunction.length - (arguments.length - 1)) }
        );
      }
    }
    return func;
  };
  var applyBind = function applyBind2() {
    return $reflectApply(bind3, $apply, arguments);
  };
  if ($defineProperty2) {
    $defineProperty2(module.exports, "apply", { value: applyBind });
  } else {
    module.exports.apply = applyBind;
  }
})(callBind$1);
var GetIntrinsic$1 = getIntrinsic;
var callBind = callBind$1.exports;
var $indexOf = callBind(GetIntrinsic$1("String.prototype.indexOf"));
var callBound$1 = function callBoundIntrinsic(name, allowMissing) {
  var intrinsic = GetIntrinsic$1(name, !!allowMissing);
  if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
    return callBind(intrinsic);
  }
  return intrinsic;
};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$0 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var hasMap = typeof Map === "function" && Map.prototype;
var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
var mapForEach = hasMap && Map.prototype.forEach;
var hasSet = typeof Set === "function" && Set.prototype;
var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
var setForEach = hasSet && Set.prototype.forEach;
var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
var booleanValueOf = Boolean.prototype.valueOf;
var objectToString = Object.prototype.toString;
var functionToString = Function.prototype.toString;
var $match = String.prototype.match;
var $slice = String.prototype.slice;
var $replace = String.prototype.replace;
var $toUpperCase = String.prototype.toUpperCase;
var $toLowerCase = String.prototype.toLowerCase;
var $test = RegExp.prototype.test;
var $concat = Array.prototype.concat;
var $join = Array.prototype.join;
var $arrSlice = Array.prototype.slice;
var $floor = Math.floor;
var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
var gOPS = Object.getOwnPropertySymbols;
var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
var isEnumerable = Object.prototype.propertyIsEnumerable;
var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
  return O.__proto__;
} : null);
function addNumericSeparator(num, str) {
  if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
    return str;
  }
  var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
  if (typeof num === "number") {
    var int = num < 0 ? -$floor(-num) : $floor(num);
    if (int !== num) {
      var intStr = String(int);
      var dec = $slice.call(str, intStr.length + 1);
      return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
    }
  }
  return $replace.call(str, sepRegex, "$&_");
}
var utilInspect = require$$0;
var inspectCustom = utilInspect.custom;
var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
var objectInspect = function inspect_(obj, options, depth, seen2) {
  var opts = options || {};
  if (has$3(opts, "quoteStyle") && (opts.quoteStyle !== "single" && opts.quoteStyle !== "double")) {
    throw new TypeError('option "quoteStyle" must be "single" or "double"');
  }
  if (has$3(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
    throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
  }
  var customInspect = has$3(opts, "customInspect") ? opts.customInspect : true;
  if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
    throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
  }
  if (has$3(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
    throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
  }
  if (has$3(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
    throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
  }
  var numericSeparator = opts.numericSeparator;
  if (typeof obj === "undefined") {
    return "undefined";
  }
  if (obj === null) {
    return "null";
  }
  if (typeof obj === "boolean") {
    return obj ? "true" : "false";
  }
  if (typeof obj === "string") {
    return inspectString(obj, opts);
  }
  if (typeof obj === "number") {
    if (obj === 0) {
      return Infinity / obj > 0 ? "0" : "-0";
    }
    var str = String(obj);
    return numericSeparator ? addNumericSeparator(obj, str) : str;
  }
  if (typeof obj === "bigint") {
    var bigIntStr = String(obj) + "n";
    return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
  }
  var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
  if (typeof depth === "undefined") {
    depth = 0;
  }
  if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
    return isArray$3(obj) ? "[Array]" : "[Object]";
  }
  var indent = getIndent(opts, depth);
  if (typeof seen2 === "undefined") {
    seen2 = [];
  } else if (indexOf(seen2, obj) >= 0) {
    return "[Circular]";
  }
  function inspect2(value, from, noIndent) {
    if (from) {
      seen2 = $arrSlice.call(seen2);
      seen2.push(from);
    }
    if (noIndent) {
      var newOpts = {
        depth: opts.depth
      };
      if (has$3(opts, "quoteStyle")) {
        newOpts.quoteStyle = opts.quoteStyle;
      }
      return inspect_(value, newOpts, depth + 1, seen2);
    }
    return inspect_(value, opts, depth + 1, seen2);
  }
  if (typeof obj === "function" && !isRegExp$1(obj)) {
    var name = nameOf(obj);
    var keys2 = arrObjKeys(obj, inspect2);
    return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys2.length > 0 ? " { " + $join.call(keys2, ", ") + " }" : "");
  }
  if (isSymbol(obj)) {
    var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
    return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
  }
  if (isElement(obj)) {
    var s = "<" + $toLowerCase.call(String(obj.nodeName));
    var attrs = obj.attributes || [];
    for (var i = 0; i < attrs.length; i++) {
      s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
    }
    s += ">";
    if (obj.childNodes && obj.childNodes.length) {
      s += "...";
    }
    s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
    return s;
  }
  if (isArray$3(obj)) {
    if (obj.length === 0) {
      return "[]";
    }
    var xs = arrObjKeys(obj, inspect2);
    if (indent && !singleLineValues(xs)) {
      return "[" + indentedJoin(xs, indent) + "]";
    }
    return "[ " + $join.call(xs, ", ") + " ]";
  }
  if (isError(obj)) {
    var parts = arrObjKeys(obj, inspect2);
    if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
      return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect2(obj.cause), parts), ", ") + " }";
    }
    if (parts.length === 0) {
      return "[" + String(obj) + "]";
    }
    return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
  }
  if (typeof obj === "object" && customInspect) {
    if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
      return utilInspect(obj, { depth: maxDepth - depth });
    } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
      return obj.inspect();
    }
  }
  if (isMap(obj)) {
    var mapParts = [];
    mapForEach.call(obj, function(value, key) {
      mapParts.push(inspect2(key, obj, true) + " => " + inspect2(value, obj));
    });
    return collectionOf("Map", mapSize.call(obj), mapParts, indent);
  }
  if (isSet(obj)) {
    var setParts = [];
    setForEach.call(obj, function(value) {
      setParts.push(inspect2(value, obj));
    });
    return collectionOf("Set", setSize.call(obj), setParts, indent);
  }
  if (isWeakMap(obj)) {
    return weakCollectionOf("WeakMap");
  }
  if (isWeakSet(obj)) {
    return weakCollectionOf("WeakSet");
  }
  if (isWeakRef(obj)) {
    return weakCollectionOf("WeakRef");
  }
  if (isNumber(obj)) {
    return markBoxed(inspect2(Number(obj)));
  }
  if (isBigInt(obj)) {
    return markBoxed(inspect2(bigIntValueOf.call(obj)));
  }
  if (isBoolean(obj)) {
    return markBoxed(booleanValueOf.call(obj));
  }
  if (isString(obj)) {
    return markBoxed(inspect2(String(obj)));
  }
  if (!isDate(obj) && !isRegExp$1(obj)) {
    var ys = arrObjKeys(obj, inspect2);
    var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
    var protoTag = obj instanceof Object ? "" : "null prototype";
    var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
    var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
    var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
    if (ys.length === 0) {
      return tag + "{}";
    }
    if (indent) {
      return tag + "{" + indentedJoin(ys, indent) + "}";
    }
    return tag + "{ " + $join.call(ys, ", ") + " }";
  }
  return String(obj);
};
function wrapQuotes(s, defaultStyle, opts) {
  var quoteChar = (opts.quoteStyle || defaultStyle) === "double" ? '"' : "'";
  return quoteChar + s + quoteChar;
}
function quote(s) {
  return $replace.call(String(s), /"/g, "&quot;");
}
function isArray$3(obj) {
  return toStr(obj) === "[object Array]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isDate(obj) {
  return toStr(obj) === "[object Date]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isRegExp$1(obj) {
  return toStr(obj) === "[object RegExp]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isError(obj) {
  return toStr(obj) === "[object Error]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isString(obj) {
  return toStr(obj) === "[object String]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isNumber(obj) {
  return toStr(obj) === "[object Number]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isBoolean(obj) {
  return toStr(obj) === "[object Boolean]" && (!toStringTag || !(typeof obj === "object" && toStringTag in obj));
}
function isSymbol(obj) {
  if (hasShammedSymbols) {
    return obj && typeof obj === "object" && obj instanceof Symbol;
  }
  if (typeof obj === "symbol") {
    return true;
  }
  if (!obj || typeof obj !== "object" || !symToString) {
    return false;
  }
  try {
    symToString.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
function isBigInt(obj) {
  if (!obj || typeof obj !== "object" || !bigIntValueOf) {
    return false;
  }
  try {
    bigIntValueOf.call(obj);
    return true;
  } catch (e) {
  }
  return false;
}
var hasOwn2 = Object.prototype.hasOwnProperty || function(key) {
  return key in this;
};
function has$3(obj, key) {
  return hasOwn2.call(obj, key);
}
function toStr(obj) {
  return objectToString.call(obj);
}
function nameOf(f) {
  if (f.name) {
    return f.name;
  }
  var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
  if (m) {
    return m[1];
  }
  return null;
}
function indexOf(xs, x) {
  if (xs.indexOf) {
    return xs.indexOf(x);
  }
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) {
      return i;
    }
  }
  return -1;
}
function isMap(x) {
  if (!mapSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    mapSize.call(x);
    try {
      setSize.call(x);
    } catch (s) {
      return true;
    }
    return x instanceof Map;
  } catch (e) {
  }
  return false;
}
function isWeakMap(x) {
  if (!weakMapHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakMapHas.call(x, weakMapHas);
    try {
      weakSetHas.call(x, weakSetHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakMap;
  } catch (e) {
  }
  return false;
}
function isWeakRef(x) {
  if (!weakRefDeref || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakRefDeref.call(x);
    return true;
  } catch (e) {
  }
  return false;
}
function isSet(x) {
  if (!setSize || !x || typeof x !== "object") {
    return false;
  }
  try {
    setSize.call(x);
    try {
      mapSize.call(x);
    } catch (m) {
      return true;
    }
    return x instanceof Set;
  } catch (e) {
  }
  return false;
}
function isWeakSet(x) {
  if (!weakSetHas || !x || typeof x !== "object") {
    return false;
  }
  try {
    weakSetHas.call(x, weakSetHas);
    try {
      weakMapHas.call(x, weakMapHas);
    } catch (s) {
      return true;
    }
    return x instanceof WeakSet;
  } catch (e) {
  }
  return false;
}
function isElement(x) {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
    return true;
  }
  return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
}
function inspectString(str, opts) {
  if (str.length > opts.maxStringLength) {
    var remaining = str.length - opts.maxStringLength;
    var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
    return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
  }
  var s = $replace.call($replace.call(str, /(['\\])/g, "\\$1"), /[\x00-\x1f]/g, lowbyte);
  return wrapQuotes(s, "single", opts);
}
function lowbyte(c) {
  var n = c.charCodeAt(0);
  var x = {
    8: "b",
    9: "t",
    10: "n",
    12: "f",
    13: "r"
  }[n];
  if (x) {
    return "\\" + x;
  }
  return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
}
function markBoxed(str) {
  return "Object(" + str + ")";
}
function weakCollectionOf(type) {
  return type + " { ? }";
}
function collectionOf(type, size, entries, indent) {
  var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
  return type + " (" + size + ") {" + joinedEntries + "}";
}
function singleLineValues(xs) {
  for (var i = 0; i < xs.length; i++) {
    if (indexOf(xs[i], "\n") >= 0) {
      return false;
    }
  }
  return true;
}
function getIndent(opts, depth) {
  var baseIndent;
  if (opts.indent === "	") {
    baseIndent = "	";
  } else if (typeof opts.indent === "number" && opts.indent > 0) {
    baseIndent = $join.call(Array(opts.indent + 1), " ");
  } else {
    return null;
  }
  return {
    base: baseIndent,
    prev: $join.call(Array(depth + 1), baseIndent)
  };
}
function indentedJoin(xs, indent) {
  if (xs.length === 0) {
    return "";
  }
  var lineJoiner = "\n" + indent.prev + indent.base;
  return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
}
function arrObjKeys(obj, inspect2) {
  var isArr = isArray$3(obj);
  var xs = [];
  if (isArr) {
    xs.length = obj.length;
    for (var i = 0; i < obj.length; i++) {
      xs[i] = has$3(obj, i) ? inspect2(obj[i], obj) : "";
    }
  }
  var syms = typeof gOPS === "function" ? gOPS(obj) : [];
  var symMap;
  if (hasShammedSymbols) {
    symMap = {};
    for (var k = 0; k < syms.length; k++) {
      symMap["$" + syms[k]] = syms[k];
    }
  }
  for (var key in obj) {
    if (!has$3(obj, key)) {
      continue;
    }
    if (isArr && String(Number(key)) === key && key < obj.length) {
      continue;
    }
    if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
      continue;
    } else if ($test.call(/[^\w$]/, key)) {
      xs.push(inspect2(key, obj) + ": " + inspect2(obj[key], obj));
    } else {
      xs.push(key + ": " + inspect2(obj[key], obj));
    }
  }
  if (typeof gOPS === "function") {
    for (var j = 0; j < syms.length; j++) {
      if (isEnumerable.call(obj, syms[j])) {
        xs.push("[" + inspect2(syms[j]) + "]: " + inspect2(obj[syms[j]], obj));
      }
    }
  }
  return xs;
}
var GetIntrinsic2 = getIntrinsic;
var callBound = callBound$1;
var inspect = objectInspect;
var $TypeError = GetIntrinsic2("%TypeError%");
var $WeakMap = GetIntrinsic2("%WeakMap%", true);
var $Map = GetIntrinsic2("%Map%", true);
var $weakMapGet = callBound("WeakMap.prototype.get", true);
var $weakMapSet = callBound("WeakMap.prototype.set", true);
var $weakMapHas = callBound("WeakMap.prototype.has", true);
var $mapGet = callBound("Map.prototype.get", true);
var $mapSet = callBound("Map.prototype.set", true);
var $mapHas = callBound("Map.prototype.has", true);
var listGetNode = function(list, key) {
  for (var prev2 = list, curr; (curr = prev2.next) !== null; prev2 = curr) {
    if (curr.key === key) {
      prev2.next = curr.next;
      curr.next = list.next;
      list.next = curr;
      return curr;
    }
  }
};
var listGet = function(objects, key) {
  var node = listGetNode(objects, key);
  return node && node.value;
};
var listSet = function(objects, key, value) {
  var node = listGetNode(objects, key);
  if (node) {
    node.value = value;
  } else {
    objects.next = {
      key,
      next: objects.next,
      value
    };
  }
};
var listHas = function(objects, key) {
  return !!listGetNode(objects, key);
};
var sideChannel = function getSideChannel() {
  var $wm;
  var $m;
  var $o;
  var channel2 = {
    assert: function(key) {
      if (!channel2.has(key)) {
        throw new $TypeError("Side channel does not contain " + inspect(key));
      }
    },
    get: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapGet($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapGet($m, key);
        }
      } else {
        if ($o) {
          return listGet($o, key);
        }
      }
    },
    has: function(key) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if ($wm) {
          return $weakMapHas($wm, key);
        }
      } else if ($Map) {
        if ($m) {
          return $mapHas($m, key);
        }
      } else {
        if ($o) {
          return listHas($o, key);
        }
      }
      return false;
    },
    set: function(key, value) {
      if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
        if (!$wm) {
          $wm = new $WeakMap();
        }
        $weakMapSet($wm, key, value);
      } else if ($Map) {
        if (!$m) {
          $m = new $Map();
        }
        $mapSet($m, key, value);
      } else {
        if (!$o) {
          $o = { key: {}, next: null };
        }
        listSet($o, key, value);
      }
    }
  };
  return channel2;
};
var replace = String.prototype.replace;
var percentTwenties = /%20/g;
var Format = {
  RFC1738: "RFC1738",
  RFC3986: "RFC3986"
};
var formats$3 = {
  "default": Format.RFC3986,
  formatters: {
    RFC1738: function(value) {
      return replace.call(value, percentTwenties, "+");
    },
    RFC3986: function(value) {
      return String(value);
    }
  },
  RFC1738: Format.RFC1738,
  RFC3986: Format.RFC3986
};
var formats$2 = formats$3;
var has$2 = Object.prototype.hasOwnProperty;
var isArray$2 = Array.isArray;
var hexTable = function() {
  var array = [];
  for (var i = 0; i < 256; ++i) {
    array.push("%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase());
  }
  return array;
}();
var compactQueue = function compactQueue2(queue2) {
  while (queue2.length > 1) {
    var item = queue2.pop();
    var obj = item.obj[item.prop];
    if (isArray$2(obj)) {
      var compacted = [];
      for (var j = 0; j < obj.length; ++j) {
        if (typeof obj[j] !== "undefined") {
          compacted.push(obj[j]);
        }
      }
      item.obj[item.prop] = compacted;
    }
  }
};
var arrayToObject = function arrayToObject2(source, options) {
  var obj = options && options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  for (var i = 0; i < source.length; ++i) {
    if (typeof source[i] !== "undefined") {
      obj[i] = source[i];
    }
  }
  return obj;
};
var merge = function merge2(target, source, options) {
  if (!source) {
    return target;
  }
  if (typeof source !== "object") {
    if (isArray$2(target)) {
      target.push(source);
    } else if (target && typeof target === "object") {
      if (options && (options.plainObjects || options.allowPrototypes) || !has$2.call(Object.prototype, source)) {
        target[source] = true;
      }
    } else {
      return [target, source];
    }
    return target;
  }
  if (!target || typeof target !== "object") {
    return [target].concat(source);
  }
  var mergeTarget = target;
  if (isArray$2(target) && !isArray$2(source)) {
    mergeTarget = arrayToObject(target, options);
  }
  if (isArray$2(target) && isArray$2(source)) {
    source.forEach(function(item, i) {
      if (has$2.call(target, i)) {
        var targetItem = target[i];
        if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
          target[i] = merge2(targetItem, item, options);
        } else {
          target.push(item);
        }
      } else {
        target[i] = item;
      }
    });
    return target;
  }
  return Object.keys(source).reduce(function(acc, key) {
    var value = source[key];
    if (has$2.call(acc, key)) {
      acc[key] = merge2(acc[key], value, options);
    } else {
      acc[key] = value;
    }
    return acc;
  }, mergeTarget);
};
var assign = function assignSingleSource(target, source) {
  return Object.keys(source).reduce(function(acc, key) {
    acc[key] = source[key];
    return acc;
  }, target);
};
var decode = function(str, decoder, charset) {
  var strWithoutPlus = str.replace(/\+/g, " ");
  if (charset === "iso-8859-1") {
    return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
  }
  try {
    return decodeURIComponent(strWithoutPlus);
  } catch (e) {
    return strWithoutPlus;
  }
};
var encode = function encode2(str, defaultEncoder, charset, kind, format2) {
  if (str.length === 0) {
    return str;
  }
  var string = str;
  if (typeof str === "symbol") {
    string = Symbol.prototype.toString.call(str);
  } else if (typeof str !== "string") {
    string = String(str);
  }
  if (charset === "iso-8859-1") {
    return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
      return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
    });
  }
  var out = "";
  for (var i = 0; i < string.length; ++i) {
    var c = string.charCodeAt(i);
    if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format2 === formats$2.RFC1738 && (c === 40 || c === 41)) {
      out += string.charAt(i);
      continue;
    }
    if (c < 128) {
      out = out + hexTable[c];
      continue;
    }
    if (c < 2048) {
      out = out + (hexTable[192 | c >> 6] + hexTable[128 | c & 63]);
      continue;
    }
    if (c < 55296 || c >= 57344) {
      out = out + (hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63]);
      continue;
    }
    i += 1;
    c = 65536 + ((c & 1023) << 10 | string.charCodeAt(i) & 1023);
    out += hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
  }
  return out;
};
var compact = function compact2(value) {
  var queue2 = [{ obj: { o: value }, prop: "o" }];
  var refs = [];
  for (var i = 0; i < queue2.length; ++i) {
    var item = queue2[i];
    var obj = item.obj[item.prop];
    var keys2 = Object.keys(obj);
    for (var j = 0; j < keys2.length; ++j) {
      var key = keys2[j];
      var val = obj[key];
      if (typeof val === "object" && val !== null && refs.indexOf(val) === -1) {
        queue2.push({ obj, prop: key });
        refs.push(val);
      }
    }
  }
  compactQueue(queue2);
  return value;
};
var isRegExp = function isRegExp2(obj) {
  return Object.prototype.toString.call(obj) === "[object RegExp]";
};
var isBuffer = function isBuffer2(obj) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  return !!(obj.constructor && obj.constructor.isBuffer && obj.constructor.isBuffer(obj));
};
var combine = function combine2(a, b) {
  return [].concat(a, b);
};
var maybeMap = function maybeMap2(val, fn2) {
  if (isArray$2(val)) {
    var mapped = [];
    for (var i = 0; i < val.length; i += 1) {
      mapped.push(fn2(val[i]));
    }
    return mapped;
  }
  return fn2(val);
};
var utils$2 = {
  arrayToObject,
  assign,
  combine,
  compact,
  decode,
  encode,
  isBuffer,
  isRegExp,
  maybeMap,
  merge
};
var getSideChannel2 = sideChannel;
var utils$1 = utils$2;
var formats$1 = formats$3;
var has$1 = Object.prototype.hasOwnProperty;
var arrayPrefixGenerators = {
  brackets: function brackets(prefix) {
    return prefix + "[]";
  },
  comma: "comma",
  indices: function indices(prefix, key) {
    return prefix + "[" + key + "]";
  },
  repeat: function repeat(prefix) {
    return prefix;
  }
};
var isArray$1 = Array.isArray;
var split = String.prototype.split;
var push = Array.prototype.push;
var pushToArray = function(arr, valueOrArray) {
  push.apply(arr, isArray$1(valueOrArray) ? valueOrArray : [valueOrArray]);
};
var toISO = Date.prototype.toISOString;
var defaultFormat = formats$1["default"];
var defaults$1 = {
  addQueryPrefix: false,
  allowDots: false,
  charset: "utf-8",
  charsetSentinel: false,
  delimiter: "&",
  encode: true,
  encoder: utils$1.encode,
  encodeValuesOnly: false,
  format: defaultFormat,
  formatter: formats$1.formatters[defaultFormat],
  indices: false,
  serializeDate: function serializeDate(date) {
    return toISO.call(date);
  },
  skipNulls: false,
  strictNullHandling: false
};
var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
  return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
};
var sentinel = {};
var stringify$1 = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, strictNullHandling, skipNulls, encoder, filter, sort, allowDots, serializeDate2, format2, formatter, encodeValuesOnly, charset, sideChannel2) {
  var obj = object;
  var tmpSc = sideChannel2;
  var step = 0;
  var findFlag = false;
  while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
    var pos = tmpSc.get(object);
    step += 1;
    if (typeof pos !== "undefined") {
      if (pos === step) {
        throw new RangeError("Cyclic object value");
      } else {
        findFlag = true;
      }
    }
    if (typeof tmpSc.get(sentinel) === "undefined") {
      step = 0;
    }
  }
  if (typeof filter === "function") {
    obj = filter(prefix, obj);
  } else if (obj instanceof Date) {
    obj = serializeDate2(obj);
  } else if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    obj = utils$1.maybeMap(obj, function(value2) {
      if (value2 instanceof Date) {
        return serializeDate2(value2);
      }
      return value2;
    });
  }
  if (obj === null) {
    if (strictNullHandling) {
      return encoder && !encodeValuesOnly ? encoder(prefix, defaults$1.encoder, charset, "key", format2) : prefix;
    }
    obj = "";
  }
  if (isNonNullishPrimitive(obj) || utils$1.isBuffer(obj)) {
    if (encoder) {
      var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults$1.encoder, charset, "key", format2);
      if (generateArrayPrefix === "comma" && encodeValuesOnly) {
        var valuesArray = split.call(String(obj), ",");
        var valuesJoined = "";
        for (var i = 0; i < valuesArray.length; ++i) {
          valuesJoined += (i === 0 ? "" : ",") + formatter(encoder(valuesArray[i], defaults$1.encoder, charset, "value", format2));
        }
        return [formatter(keyValue) + (commaRoundTrip && isArray$1(obj) && valuesArray.length === 1 ? "[]" : "") + "=" + valuesJoined];
      }
      return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults$1.encoder, charset, "value", format2))];
    }
    return [formatter(prefix) + "=" + formatter(String(obj))];
  }
  var values = [];
  if (typeof obj === "undefined") {
    return values;
  }
  var objKeys;
  if (generateArrayPrefix === "comma" && isArray$1(obj)) {
    objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
  } else if (isArray$1(filter)) {
    objKeys = filter;
  } else {
    var keys2 = Object.keys(obj);
    objKeys = sort ? keys2.sort(sort) : keys2;
  }
  var adjustedPrefix = commaRoundTrip && isArray$1(obj) && obj.length === 1 ? prefix + "[]" : prefix;
  for (var j = 0; j < objKeys.length; ++j) {
    var key = objKeys[j];
    var value = typeof key === "object" && typeof key.value !== "undefined" ? key.value : obj[key];
    if (skipNulls && value === null) {
      continue;
    }
    var keyPrefix = isArray$1(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, key) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + key : "[" + key + "]");
    sideChannel2.set(object, step);
    var valueSideChannel = getSideChannel2();
    valueSideChannel.set(sentinel, sideChannel2);
    pushToArray(values, stringify(
      value,
      keyPrefix,
      generateArrayPrefix,
      commaRoundTrip,
      strictNullHandling,
      skipNulls,
      encoder,
      filter,
      sort,
      allowDots,
      serializeDate2,
      format2,
      formatter,
      encodeValuesOnly,
      charset,
      valueSideChannel
    ));
  }
  return values;
};
var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
  if (!opts) {
    return defaults$1;
  }
  if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
    throw new TypeError("Encoder has to be a function.");
  }
  var charset = opts.charset || defaults$1.charset;
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var format2 = formats$1["default"];
  if (typeof opts.format !== "undefined") {
    if (!has$1.call(formats$1.formatters, opts.format)) {
      throw new TypeError("Unknown format option provided.");
    }
    format2 = opts.format;
  }
  var formatter = formats$1.formatters[format2];
  var filter = defaults$1.filter;
  if (typeof opts.filter === "function" || isArray$1(opts.filter)) {
    filter = opts.filter;
  }
  return {
    addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults$1.addQueryPrefix,
    allowDots: typeof opts.allowDots === "undefined" ? defaults$1.allowDots : !!opts.allowDots,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults$1.charsetSentinel,
    delimiter: typeof opts.delimiter === "undefined" ? defaults$1.delimiter : opts.delimiter,
    encode: typeof opts.encode === "boolean" ? opts.encode : defaults$1.encode,
    encoder: typeof opts.encoder === "function" ? opts.encoder : defaults$1.encoder,
    encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults$1.encodeValuesOnly,
    filter,
    format: format2,
    formatter,
    serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults$1.serializeDate,
    skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults$1.skipNulls,
    sort: typeof opts.sort === "function" ? opts.sort : null,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults$1.strictNullHandling
  };
};
var stringify_1 = function(object, opts) {
  var obj = object;
  var options = normalizeStringifyOptions(opts);
  var objKeys;
  var filter;
  if (typeof options.filter === "function") {
    filter = options.filter;
    obj = filter("", obj);
  } else if (isArray$1(options.filter)) {
    filter = options.filter;
    objKeys = filter;
  }
  var keys2 = [];
  if (typeof obj !== "object" || obj === null) {
    return "";
  }
  var arrayFormat;
  if (opts && opts.arrayFormat in arrayPrefixGenerators) {
    arrayFormat = opts.arrayFormat;
  } else if (opts && "indices" in opts) {
    arrayFormat = opts.indices ? "indices" : "repeat";
  } else {
    arrayFormat = "indices";
  }
  var generateArrayPrefix = arrayPrefixGenerators[arrayFormat];
  if (opts && "commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
    throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
  }
  var commaRoundTrip = generateArrayPrefix === "comma" && opts && opts.commaRoundTrip;
  if (!objKeys) {
    objKeys = Object.keys(obj);
  }
  if (options.sort) {
    objKeys.sort(options.sort);
  }
  var sideChannel2 = getSideChannel2();
  for (var i = 0; i < objKeys.length; ++i) {
    var key = objKeys[i];
    if (options.skipNulls && obj[key] === null) {
      continue;
    }
    pushToArray(keys2, stringify$1(
      obj[key],
      key,
      generateArrayPrefix,
      commaRoundTrip,
      options.strictNullHandling,
      options.skipNulls,
      options.encode ? options.encoder : null,
      options.filter,
      options.sort,
      options.allowDots,
      options.serializeDate,
      options.format,
      options.formatter,
      options.encodeValuesOnly,
      options.charset,
      sideChannel2
    ));
  }
  var joined = keys2.join(options.delimiter);
  var prefix = options.addQueryPrefix === true ? "?" : "";
  if (options.charsetSentinel) {
    if (options.charset === "iso-8859-1") {
      prefix += "utf8=%26%2310003%3B&";
    } else {
      prefix += "utf8=%E2%9C%93&";
    }
  }
  return joined.length > 0 ? prefix + joined : "";
};
var utils = utils$2;
var has = Object.prototype.hasOwnProperty;
var isArray = Array.isArray;
var defaults = {
  allowDots: false,
  allowPrototypes: false,
  allowSparse: false,
  arrayLimit: 20,
  charset: "utf-8",
  charsetSentinel: false,
  comma: false,
  decoder: utils.decode,
  delimiter: "&",
  depth: 5,
  ignoreQueryPrefix: false,
  interpretNumericEntities: false,
  parameterLimit: 1e3,
  parseArrays: true,
  plainObjects: false,
  strictNullHandling: false
};
var interpretNumericEntities = function(str) {
  return str.replace(/&#(\d+);/g, function($0, numberStr) {
    return String.fromCharCode(parseInt(numberStr, 10));
  });
};
var parseArrayValue = function(val, options) {
  if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
    return val.split(",");
  }
  return val;
};
var isoSentinel = "utf8=%26%2310003%3B";
var charsetSentinel = "utf8=%E2%9C%93";
var parseValues = function parseQueryStringValues(str, options) {
  var obj = {};
  var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
  var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
  var parts = cleanStr.split(options.delimiter, limit);
  var skipIndex = -1;
  var i;
  var charset = options.charset;
  if (options.charsetSentinel) {
    for (i = 0; i < parts.length; ++i) {
      if (parts[i].indexOf("utf8=") === 0) {
        if (parts[i] === charsetSentinel) {
          charset = "utf-8";
        } else if (parts[i] === isoSentinel) {
          charset = "iso-8859-1";
        }
        skipIndex = i;
        i = parts.length;
      }
    }
  }
  for (i = 0; i < parts.length; ++i) {
    if (i === skipIndex) {
      continue;
    }
    var part = parts[i];
    var bracketEqualsPos = part.indexOf("]=");
    var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
    var key, val;
    if (pos === -1) {
      key = options.decoder(part, defaults.decoder, charset, "key");
      val = options.strictNullHandling ? null : "";
    } else {
      key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
      val = utils.maybeMap(
        parseArrayValue(part.slice(pos + 1), options),
        function(encodedVal) {
          return options.decoder(encodedVal, defaults.decoder, charset, "value");
        }
      );
    }
    if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
      val = interpretNumericEntities(val);
    }
    if (part.indexOf("[]=") > -1) {
      val = isArray(val) ? [val] : val;
    }
    if (has.call(obj, key)) {
      obj[key] = utils.combine(obj[key], val);
    } else {
      obj[key] = val;
    }
  }
  return obj;
};
var parseObject = function(chain, val, options, valuesParsed) {
  var leaf = valuesParsed ? val : parseArrayValue(val, options);
  for (var i = chain.length - 1; i >= 0; --i) {
    var obj;
    var root = chain[i];
    if (root === "[]" && options.parseArrays) {
      obj = [].concat(leaf);
    } else {
      obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
      var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
      var index = parseInt(cleanRoot, 10);
      if (!options.parseArrays && cleanRoot === "") {
        obj = { 0: leaf };
      } else if (!isNaN(index) && root !== cleanRoot && String(index) === cleanRoot && index >= 0 && (options.parseArrays && index <= options.arrayLimit)) {
        obj = [];
        obj[index] = leaf;
      } else if (cleanRoot !== "__proto__") {
        obj[cleanRoot] = leaf;
      }
    }
    leaf = obj;
  }
  return leaf;
};
var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
  if (!givenKey) {
    return;
  }
  var key = options.allowDots ? givenKey.replace(/\.([^.[]+)/g, "[$1]") : givenKey;
  var brackets2 = /(\[[^[\]]*])/;
  var child = /(\[[^[\]]*])/g;
  var segment = options.depth > 0 && brackets2.exec(key);
  var parent = segment ? key.slice(0, segment.index) : key;
  var keys2 = [];
  if (parent) {
    if (!options.plainObjects && has.call(Object.prototype, parent)) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys2.push(parent);
  }
  var i = 0;
  while (options.depth > 0 && (segment = child.exec(key)) !== null && i < options.depth) {
    i += 1;
    if (!options.plainObjects && has.call(Object.prototype, segment[1].slice(1, -1))) {
      if (!options.allowPrototypes) {
        return;
      }
    }
    keys2.push(segment[1]);
  }
  if (segment) {
    keys2.push("[" + key.slice(segment.index) + "]");
  }
  return parseObject(keys2, val, options, valuesParsed);
};
var normalizeParseOptions = function normalizeParseOptions2(opts) {
  if (!opts) {
    return defaults;
  }
  if (opts.decoder !== null && opts.decoder !== void 0 && typeof opts.decoder !== "function") {
    throw new TypeError("Decoder has to be a function.");
  }
  if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
    throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
  }
  var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
  return {
    allowDots: typeof opts.allowDots === "undefined" ? defaults.allowDots : !!opts.allowDots,
    allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
    allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
    arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
    charset,
    charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
    comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
    decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
    delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
    depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
    ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
    interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
    parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
    parseArrays: opts.parseArrays !== false,
    plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
    strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
  };
};
var parse$1 = function(str, opts) {
  var options = normalizeParseOptions(opts);
  if (str === "" || str === null || typeof str === "undefined") {
    return options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  }
  var tempObj = typeof str === "string" ? parseValues(str, options) : str;
  var obj = options.plainObjects ? /* @__PURE__ */ Object.create(null) : {};
  var keys2 = Object.keys(tempObj);
  for (var i = 0; i < keys2.length; ++i) {
    var key = keys2[i];
    var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
    obj = utils.merge(obj, newObj, options);
  }
  if (options.allowSparse === true) {
    return obj;
  }
  return utils.compact(obj);
};
var stringify2 = stringify_1;
var parse = parse$1;
var formats = formats$3;
var lib = {
  formats,
  parse,
  stringify: stringify2
};
function constructLink(parameters) {
  const link = lib.stringify(parameters);
  return link;
}
function parseLink(queryString) {
  const parameters = lib.parse(queryString);
  return sanitizeParameters(parameters);
}
function storeInLocalStorage(parameters) {
  Object.entries(parameters).forEach(([k, v]) => {
    localStorage.setItem(k, v);
  });
}
function sanitizeParameters(parameters) {
  const sanitized = {};
  if ("frequency" in parameters && isNumber$1(parameters.frequency)) {
    sanitized.frequency = parseFloat(parameters.frequency);
  }
  if ("modulation" in parameters) {
    sanitized.modulation = parameters.modulation.toUpperCase();
  }
  return sanitized;
}
function WorkerWrapper() {
  return new Worker("/assets/decoding-904100a3.js");
}
class Decoder {
  constructor(name, samplerate, callback) {
    this.decoder = new WorkerWrapper();
    this.decoder.postMessage({ msg: "init", decoder: name, samplerate });
    this.callback = callback;
    this.initializedPromise = new Promise((resolve, reject) => {
      this.initializedResolve = resolve;
      this.initializedReject = reject;
    });
    this.decoder.onmessage = (ev) => {
      if (ev.data.type === "log") {
        callback(ev.data.text);
      } else if (ev.data.type === "initialized") {
        this.initializedResolve();
      }
    };
  }
  setCallback(callback) {
    this.callback = callback;
  }
  decode(pcm) {
    this.decoder.postMessage({ msg: "pcm", pcm }, pcm.buffer);
  }
  promise() {
    return this.initializedPromise;
  }
  stop() {
    this.decoder.terminate();
  }
}
const App_svelte_svelte_type_style_lang = "";
const { window: window_1 } = globals;
function get_each_context(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[98] = list[i];
  return child_ctx;
}
function get_each_context_1(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[101] = list[i];
  return child_ctx;
}
function get_each_context_2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[104] = list[i];
  return child_ctx;
}
function get_each_context_3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[107] = list[i];
  return child_ctx;
}
function create_each_block_3(key_1, ctx) {
  let label;
  let input;
  let input_value_value;
  let t0;
  let div;
  let t1_value = ctx[107] + "";
  let t1;
  let t2;
  let mounted;
  let dispose;
  return {
    key: key_1,
    first: null,
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      div = element("div");
      t1 = text(t1_value);
      t2 = space();
      attr(input, "type", "radio");
      attr(input, "class", "hidden peer");
      attr(input, "name", "demodulation");
      input.__value = input_value_value = ctx[107];
      input.value = input.__value;
      attr(input, "autocomplete", "off");
      ctx[64][0].push(input);
      attr(div, "class", "basic-button m-1");
      attr(div, "type", "button");
      this.first = label;
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = input.__value === ctx[14];
      append(label, t0);
      append(label, div);
      append(div, t1);
      append(label, t2);
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[63]),
          listen(input, "click", ctx[65]),
          listen(input, "change", ctx[66])
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 8192 && input_value_value !== (input_value_value = ctx[107])) {
        input.__value = input_value_value;
        input.value = input.__value;
      }
      if (dirty[0] & 16384) {
        input.checked = input.__value === ctx[14];
      }
      if (dirty[0] & 8192 && t1_value !== (t1_value = ctx[107] + ""))
        set_data(t1, t1_value);
    },
    d(detaching) {
      if (detaching)
        detach(label);
      ctx[64][0].splice(ctx[64][0].indexOf(input), 1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_each_block_2(key_1, ctx) {
  let button;
  let t_value = ctx[104] + "";
  let t;
  let button_data_expand_value;
  let mounted;
  let dispose;
  function click_handler_1(...args) {
    return ctx[67](ctx[104], ...args);
  }
  return {
    key: key_1,
    first: null,
    c() {
      button = element("button");
      t = text(t_value);
      attr(button, "class", "click-button w-1/4");
      attr(button, "data-expand", button_data_expand_value = ctx[104]);
      this.first = button;
    },
    m(target, anchor) {
      insert(target, button, anchor);
      append(button, t);
      if (!mounted) {
        dispose = listen(button, "click", click_handler_1);
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 2097152 && t_value !== (t_value = ctx[104] + ""))
        set_data(t, t_value);
      if (dirty[0] & 2097152 && button_data_expand_value !== (button_data_expand_value = ctx[104])) {
        attr(button, "data-expand", button_data_expand_value);
      }
    },
    d(detaching) {
      if (detaching)
        detach(button);
      mounted = false;
      dispose();
    }
  };
}
function create_default_slot_2(ctx) {
  let tooltip;
  let current;
  tooltip = new Tooltip({ props: { text: "Noise Reduction" } });
  return {
    c() {
      create_component(tooltip.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tooltip, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(tooltip.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tooltip.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tooltip, detaching);
    }
  };
}
function create_default_slot_1(ctx) {
  let tooltip;
  let current;
  tooltip = new Tooltip({ props: { text: "Noise Blanker" } });
  return {
    c() {
      create_component(tooltip.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tooltip, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(tooltip.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tooltip.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tooltip, detaching);
    }
  };
}
function create_default_slot(ctx) {
  let tooltip;
  let current;
  tooltip = new Tooltip({ props: { text: "Autonotch" } });
  return {
    c() {
      create_component(tooltip.$$.fragment);
    },
    m(target, anchor) {
      mount_component(tooltip, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current)
        return;
      transition_in(tooltip.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(tooltip.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(tooltip, detaching);
    }
  };
}
function create_each_block_1(ctx) {
  let option;
  let t0_value = ctx[101] + "";
  let t0;
  let t1;
  return {
    c() {
      option = element("option");
      t0 = text(t0_value);
      t1 = space();
      attr(option, "class", "m-auto p-auto text-xs bg-black");
      option.__value = ctx[101];
      option.value = option.__value;
    },
    m(target, anchor) {
      insert(target, option, anchor);
      append(option, t0);
      append(option, t1);
    },
    p: noop,
    d(detaching) {
      if (detaching)
        detach(option);
    }
  };
}
function create_each_block(key_1, ctx) {
  let label;
  let input;
  let t0;
  let div;
  let t1_value = ctx[98] + "";
  let t1;
  let t2;
  let mounted;
  let dispose;
  return {
    key: key_1,
    first: null,
    c() {
      label = element("label");
      input = element("input");
      t0 = space();
      div = element("div");
      t1 = text(t1_value);
      t2 = space();
      attr(input, "type", "radio");
      attr(input, "class", "hidden peer");
      attr(input, "name", "decoder");
      input.__value = ctx[98];
      input.value = input.__value;
      attr(input, "autocomplete", "off");
      ctx[64][1].push(input);
      attr(div, "class", "basic-button m-1");
      attr(div, "type", "button");
      this.first = label;
    },
    m(target, anchor) {
      insert(target, label, anchor);
      append(label, input);
      input.checked = input.__value === ctx[27];
      append(label, t0);
      append(label, div);
      append(div, t1);
      append(label, t2);
      if (!mounted) {
        dispose = [
          listen(input, "change", ctx[85]),
          listen(input, "change", ctx[86])
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      if (dirty[0] & 134217728) {
        input.checked = input.__value === ctx[27];
      }
    },
    d(detaching) {
      if (detaching)
        detach(label);
      ctx[64][1].splice(ctx[64][1].indexOf(input), 1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment(ctx) {
  let main2;
  let div49;
  let div2;
  let frequencyinput;
  let t0;
  let canvas0;
  let canvas0_class_value;
  let t1;
  let passbandtuner;
  let t2;
  let frequencymarkers;
  let t3;
  let canvas1;
  let t4;
  let div0;
  let canvas2;
  let canvas2_class_value;
  let t5;
  let div1;
  let logger_1;
  let div1_class_value;
  let t6;
  let div48;
  let div4;
  let t7;
  let div23;
  let div5;
  let t9;
  let div22;
  let div6;
  let each_blocks_3 = [];
  let each0_lookup = /* @__PURE__ */ new Map();
  let t10;
  let p;
  let t11;
  let t12;
  let t13;
  let t14;
  let div7;
  let each_blocks_2 = [];
  let each1_lookup = /* @__PURE__ */ new Map();
  let t15;
  let div19;
  let div12;
  let label1;
  let input0;
  let t16;
  let div8;
  let t18;
  let div9;
  let t20;
  let div10;
  let t21;
  let t22;
  let t23;
  let div11;
  let input1;
  let t24;
  let div15;
  let label2;
  let input2;
  let t25;
  let div13;
  let t27;
  let tooltip;
  let t28;
  let span0;
  let t29;
  let t30;
  let t31;
  let div14;
  let input3;
  let t32;
  let div18;
  let span4;
  let span1;
  let t33;
  let span2;
  let t34;
  let span3;
  let t36;
  let span5;
  let t37_value = ctx[19].toFixed(1) + "";
  let t37;
  let t38;
  let t39;
  let div17;
  let div16;
  let span6;
  let t40;
  let span7;
  let t41;
  let div21;
  let div20;
  let linethroughbutton0;
  let updating_checked;
  let t42;
  let linethroughbutton1;
  let updating_checked_1;
  let t43;
  let linethroughbutton2;
  let updating_checked_2;
  let t44;
  let div38;
  let div24;
  let t46;
  let div37;
  let div25;
  let checkbutton0;
  let updating_checked_3;
  let t47;
  let checkbutton1;
  let updating_checked_4;
  let t48;
  let div26;
  let button0;
  let t50;
  let button1;
  let t52;
  let button2;
  let t54;
  let button3;
  let t56;
  let div29;
  let div27;
  let t58;
  let span8;
  let t59;
  let t60;
  let div28;
  let input4;
  let div29_class_value;
  let t61;
  let div32;
  let div30;
  let t63;
  let span9;
  let t64;
  let t65;
  let div31;
  let input5;
  let div32_class_value;
  let t66;
  let div36;
  let div33;
  let t68;
  let div34;
  let canvas3;
  let t69;
  let div35;
  let select;
  let div36_class_value;
  let t70;
  let div43;
  let div39;
  let t72;
  let div42;
  let div41;
  let div40;
  let button4;
  let t74;
  let popover;
  let t75;
  let input6;
  let t76;
  let div47;
  let div44;
  let t78;
  let div46;
  let div45;
  let each_blocks = [];
  let each3_lookup = /* @__PURE__ */ new Map();
  let current;
  let mounted;
  let dispose;
  let frequencyinput_props = {};
  frequencyinput = new FrequencyInput({ props: frequencyinput_props });
  ctx[56](frequencyinput);
  frequencyinput.$on("change", ctx[39]);
  let passbandtuner_props = {};
  passbandtuner = new PassbandTuner({ props: passbandtuner_props });
  ctx[58](passbandtuner);
  passbandtuner.$on("change", ctx[38]);
  passbandtuner.$on("wheel", ctx[28]);
  let frequencymarkers_props = {};
  frequencymarkers = new FrequencyMarkers({ props: frequencymarkers_props });
  ctx[59](frequencymarkers);
  frequencymarkers.$on("click", function() {
    if (is_function(ctx[4].handlePassbandClick))
      ctx[4].handlePassbandClick.apply(this, arguments);
  });
  frequencymarkers.$on("wheel", ctx[28]);
  frequencymarkers.$on("markerclick", ctx[49]);
  let logger_1_props = { capacity: 1e3 };
  logger_1 = new Logger({ props: logger_1_props });
  ctx[62](logger_1);
  let each_value_3 = ctx[13];
  const get_key = (ctx2) => ctx2[107];
  for (let i = 0; i < each_value_3.length; i += 1) {
    let child_ctx = get_each_context_3(ctx, each_value_3, i);
    let key = get_key(child_ctx);
    each0_lookup.set(key, each_blocks_3[i] = create_each_block_3(key, child_ctx));
  }
  let each_value_2 = ctx[21];
  const get_key_1 = (ctx2) => ctx2[104];
  for (let i = 0; i < each_value_2.length; i += 1) {
    let child_ctx = get_each_context_2(ctx, each_value_2, i);
    let key = get_key_1(child_ctx);
    each1_lookup.set(key, each_blocks_2[i] = create_each_block_2(key, child_ctx));
  }
  tooltip = new Tooltip({ props: { text: "Squelch" } });
  function linethroughbutton0_checked_binding(value) {
    ctx[72](value);
  }
  let linethroughbutton0_props = {
    name: "NR",
    $$slots: { default: [create_default_slot_2] },
    $$scope: { ctx }
  };
  if (ctx[22] !== void 0) {
    linethroughbutton0_props.checked = ctx[22];
  }
  linethroughbutton0 = new LineThroughButton({ props: linethroughbutton0_props });
  binding_callbacks.push(() => bind$4(linethroughbutton0, "checked", linethroughbutton0_checked_binding, ctx[22]));
  linethroughbutton0.$on("change", ctx[46]);
  function linethroughbutton1_checked_binding(value) {
    ctx[73](value);
  }
  let linethroughbutton1_props = {
    name: "NB",
    $$slots: { default: [create_default_slot_1] },
    $$scope: { ctx }
  };
  if (ctx[23] !== void 0) {
    linethroughbutton1_props.checked = ctx[23];
  }
  linethroughbutton1 = new LineThroughButton({ props: linethroughbutton1_props });
  binding_callbacks.push(() => bind$4(linethroughbutton1, "checked", linethroughbutton1_checked_binding, ctx[23]));
  linethroughbutton1.$on("change", ctx[47]);
  function linethroughbutton2_checked_binding(value) {
    ctx[74](value);
  }
  let linethroughbutton2_props = {
    name: "AN",
    $$slots: { default: [create_default_slot] },
    $$scope: { ctx }
  };
  if (ctx[24] !== void 0) {
    linethroughbutton2_props.checked = ctx[24];
  }
  linethroughbutton2 = new LineThroughButton({ props: linethroughbutton2_props });
  binding_callbacks.push(() => bind$4(linethroughbutton2, "checked", linethroughbutton2_checked_binding, ctx[24]));
  linethroughbutton2.$on("change", ctx[48]);
  function checkbutton0_checked_binding(value) {
    ctx[75](value);
  }
  let checkbutton0_props = { name: "Spectrum Analyzer" };
  if (ctx[8] !== void 0) {
    checkbutton0_props.checked = ctx[8];
  }
  checkbutton0 = new CheckButton({ props: checkbutton0_props });
  binding_callbacks.push(() => bind$4(checkbutton0, "checked", checkbutton0_checked_binding, ctx[8]));
  checkbutton0.$on("change", ctx[32]);
  function checkbutton1_checked_binding(value) {
    ctx[76](value);
  }
  let checkbutton1_props = { name: "Waterfall" };
  if (ctx[7] !== void 0) {
    checkbutton1_props.checked = ctx[7];
  }
  checkbutton1 = new CheckButton({ props: checkbutton1_props });
  binding_callbacks.push(() => bind$4(checkbutton1, "checked", checkbutton1_checked_binding, ctx[7]));
  checkbutton1.$on("change", ctx[33]);
  let each_value_1 = availableColormaps;
  let each_blocks_1 = [];
  for (let i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }
  popover = new Popover({ props: { text: "Copied!" } });
  let each_value = ctx[51];
  const get_key_2 = (ctx2) => ctx2[98];
  for (let i = 0; i < each_value.length; i += 1) {
    let child_ctx = get_each_context(ctx, each_value, i);
    let key = get_key_2(child_ctx);
    each3_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
  }
  return {
    c() {
      main2 = element("main");
      div49 = element("div");
      div2 = element("div");
      create_component(frequencyinput.$$.fragment);
      t0 = space();
      canvas0 = element("canvas");
      t1 = space();
      create_component(passbandtuner.$$.fragment);
      t2 = space();
      create_component(frequencymarkers.$$.fragment);
      t3 = space();
      canvas1 = element("canvas");
      t4 = space();
      div0 = element("div");
      canvas2 = element("canvas");
      t5 = space();
      div1 = element("div");
      create_component(logger_1.$$.fragment);
      t6 = space();
      div48 = element("div");
      div4 = element("div");
      div4.innerHTML = `<div class="m-2"></div>`;
      t7 = space();
      div23 = element("div");
      div5 = element("div");
      div5.innerHTML = `<label for="tab-multi-one">Audio</label>`;
      t9 = space();
      div22 = element("div");
      div6 = element("div");
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].c();
      }
      t10 = space();
      p = element("p");
      t11 = text("Bandwidth: ");
      t12 = text(ctx[5]);
      t13 = text("kHz");
      t14 = space();
      div7 = element("div");
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].c();
      }
      t15 = space();
      div19 = element("div");
      div12 = element("div");
      label1 = element("label");
      input0 = element("input");
      t16 = space();
      div8 = element("div");
      div8.textContent = "🔊";
      t18 = space();
      div9 = element("div");
      div9.textContent = "🔇";
      t20 = space();
      div10 = element("div");
      t21 = text(ctx[16]);
      t22 = text("%");
      t23 = space();
      div11 = element("div");
      input1 = element("input");
      t24 = space();
      div15 = element("div");
      label2 = element("label");
      input2 = element("input");
      t25 = space();
      div13 = element("div");
      div13.textContent = " Sq ";
      t27 = space();
      create_component(tooltip.$$.fragment);
      t28 = space();
      span0 = element("span");
      t29 = text(ctx[18]);
      t30 = text("db");
      t31 = space();
      div14 = element("div");
      input3 = element("input");
      t32 = space();
      div18 = element("div");
      span4 = element("span");
      span1 = element("span");
      t33 = space();
      span2 = element("span");
      t34 = space();
      span3 = element("span");
      span3.textContent = "Pwr";
      t36 = space();
      span5 = element("span");
      t37 = text(t37_value);
      t38 = text("db");
      t39 = space();
      div17 = element("div");
      div16 = element("div");
      span6 = element("span");
      t40 = space();
      span7 = element("span");
      t41 = space();
      div21 = element("div");
      div20 = element("div");
      create_component(linethroughbutton0.$$.fragment);
      t42 = space();
      create_component(linethroughbutton1.$$.fragment);
      t43 = space();
      create_component(linethroughbutton2.$$.fragment);
      t44 = space();
      div38 = element("div");
      div24 = element("div");
      div24.innerHTML = `<label for="tab-multi-one">Waterfall</label>`;
      t46 = space();
      div37 = element("div");
      div25 = element("div");
      create_component(checkbutton0.$$.fragment);
      t47 = space();
      create_component(checkbutton1.$$.fragment);
      t48 = space();
      div26 = element("div");
      button0 = element("button");
      button0.textContent = "🔎max";
      t50 = space();
      button1 = element("button");
      button1.textContent = "🔎+";
      t52 = space();
      button2 = element("button");
      button2.textContent = "🔎-";
      t54 = space();
      button3 = element("button");
      button3.textContent = "🔎min";
      t56 = space();
      div29 = element("div");
      div27 = element("div");
      div27.textContent = "Smoothing";
      t58 = space();
      span8 = element("span");
      t59 = text(ctx[11]);
      t60 = space();
      div28 = element("div");
      input4 = element("input");
      t61 = space();
      div32 = element("div");
      div30 = element("div");
      div30.textContent = "Brightness";
      t63 = space();
      span9 = element("span");
      t64 = text(ctx[12]);
      t65 = space();
      div31 = element("div");
      input5 = element("input");
      t66 = space();
      div36 = element("div");
      div33 = element("div");
      div33.textContent = "Colormap:";
      t68 = space();
      div34 = element("div");
      canvas3 = element("canvas");
      t69 = space();
      div35 = element("div");
      select = element("select");
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].c();
      }
      t70 = space();
      div43 = element("div");
      div39 = element("div");
      div39.innerHTML = `<label for="tab-multi-one">Bookmarks</label>`;
      t72 = space();
      div42 = element("div");
      div41 = element("div");
      div40 = element("div");
      button4 = element("button");
      button4.textContent = "📋 Link:";
      t74 = space();
      create_component(popover.$$.fragment);
      t75 = space();
      input6 = element("input");
      t76 = space();
      div47 = element("div");
      div44 = element("div");
      div44.innerHTML = `<label for="tab-multi-one">Decoders</label>`;
      t78 = space();
      div46 = element("div");
      div45 = element("div");
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }
      attr(canvas0, "class", canvas0_class_value = "w-full bg-black peer " + (ctx[8] ? "max-h-full" : "max-h-0"));
      attr(canvas0, "width", "1024");
      attr(canvas0, "height", "128");
      attr(canvas1, "class", "w-full bg-black peer");
      attr(canvas1, "width", "1024");
      attr(canvas1, "height", "20");
      attr(canvas2, "class", canvas2_class_value = "w-full bg-black " + (ctx[7] ? "block" : "hidden"));
      attr(canvas2, "width", "1024");
      attr(canvas2, "height", "2000");
      attr(div0, "class", "w-full peer overflow-hidden");
      attr(div1, "class", div1_class_value = ctx[27] === "none" ? "hidden" : "block");
      attr(div2, "class", "w-full sm:w-1/2 md:w-2/3 lg:w-3/4 sm:transition-all sm:ease-linear sm:duration-100 cursor-crosshair overflow-x-hidden");
      attr(div4, "class", "tab");
      attr(div5, "class", "bg-gray-500 text-left pl-2");
      attr(div6, "class", "grid grid-cols-4");
      attr(p, "class", "text-white text-sm");
      attr(div7, "class", "flex items-center justify-center pb-1 scale-90 sm:scale-75 md:scale-[0.70]");
      attr(input0, "type", "checkbox");
      attr(input0, "class", "hidden peer");
      attr(input0, "autocomplete", "off");
      attr(div8, "class", "basic-button peer-checked:hidden");
      attr(div9, "class", "basic-button hidden peer-checked:block");
      attr(label1, "class", "w-1/6 text-white");
      attr(div10, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(input1, "type", "range");
      input1.disabled = ctx[15];
      attr(input1, "min", "0");
      attr(input1, "max", "100");
      attr(input1, "step", "0.1");
      attr(input1, "class", "disabled: cursor-not-allowed w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none");
      attr(div11, "class", "px-0 w-2/3 align-middle");
      attr(div12, "class", "flex");
      attr(input2, "type", "checkbox");
      attr(input2, "class", "hidden peer");
      attr(input2, "autocomplete", "off");
      attr(div13, "class", "basic-button line-through thick-line-through peer-checked:no-underline");
      attr(label2, "class", "w-1/6 text-white");
      attr(span0, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(input3, "type", "range");
      attr(input3, "min", "-100");
      attr(input3, "max", "0");
      attr(input3, "step", "0.1");
      attr(input3, "class", "w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb");
      attr(div14, "class", "px-0 w-2/3 align-middle");
      attr(div15, "class", "flex");
      attr(span1, "class", "bg-green-800 w-full absolute left-0 top-0 z-10 transition-all");
      set_style(span1, "top", -ctx[19] + "%");
      set_style(span1, "height", ctx[19] + 100 + "%");
      attr(span2, "class", "bg-red-800 w-full absolute left-0 top-0 z-0 transition-all");
      set_style(span2, "top", -ctx[20] + "%");
      set_style(span2, "height", ctx[20] + 100 + "%");
      attr(span3, "class", "relative z-20");
      attr(span4, "class", "w-1/6 text-white text-xs text-center relative basic-button");
      attr(span5, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(span6, "class", "bg-green-500 h-1 absolute left-0 top-0 rounded-full z-10 transition-all");
      set_style(span6, "width", ctx[19] + 100 + "%");
      attr(span7, "class", "bg-red-500 h-1 absolute left-0 top-0 rounded-full z-0 transition-all");
      set_style(span7, "width", ctx[20] + 100 + "%");
      attr(div16, "class", "bg-gray-300 h-1 w-full m-auto rounded-full relative");
      attr(div17, "class", "px-0 w-2/3 align-middle flex");
      attr(div18, "class", "flex");
      attr(div20, "class", "grid grid-cols-4 my-1");
      attr(div22, "class", "m-2");
      attr(div23, "class", "tab");
      attr(div24, "class", "bg-gray-500 text-left pl-2");
      attr(div25, "class", "flex flex-wrap items-center content-center justify-center my-1");
      attr(button0, "class", "click-button w-1/4");
      attr(button1, "class", "click-button w-1/4");
      attr(button2, "class", "click-button w-1/4");
      attr(button3, "class", "click-button w-1/4");
      attr(div26, "class", "flex flex-wrap items-center justify-center w-full");
      attr(div26, "aria-label", "Bandwidth controls");
      attr(div27, "class", "w-1/6 text-white text-xs align-middle p-auto m-auto");
      attr(span8, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(input4, "type", "range");
      attr(input4, "min", "0");
      attr(input4, "max", "1");
      attr(input4, "step", "0.01");
      attr(input4, "class", "w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb");
      attr(div28, "class", "px-0 w-2/3 align-middle");
      attr(div29, "class", div29_class_value = ctx[8] ? "flex" : "hidden");
      attr(div30, "class", "w-1/6 text-white text-xs align-middle p-auto m-auto");
      attr(span9, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(input5, "type", "range");
      attr(input5, "min", "0");
      attr(input5, "max", "255");
      attr(input5, "step", "1");
      attr(input5, "class", "w-full align-middle appearance-none h-1 bg-gray-400 rounded outline-none slider-thumb");
      attr(div31, "class", "px-0 w-2/3 align-middle");
      attr(div32, "class", div32_class_value = ctx[7] ? "flex" : "hidden");
      attr(div33, "class", "w-1/6 text-white text-xs text-center m-auto");
      attr(canvas3, "class", "w-full h-4");
      attr(canvas3, "width", "256");
      attr(div34, "class", "w-1/3 flex items-center align-middle m-auto px-2");
      attr(select, "class", "h-full w-full py-px bg-transparent text-white text-xs border border-1 border-blue-500");
      if (ctx[9] === void 0)
        add_render_callback(() => ctx[84].call(select));
      attr(div35, "class", "px-0 w-1/2 h-full flex align-middle bg-transparent z-50");
      attr(div36, "class", div36_class_value = (ctx[7] ? "flex" : "hidden") + " pt-1");
      attr(div37, "class", "m-2");
      attr(div38, "class", "tab");
      attr(div39, "class", "bg-gray-500 text-left pl-2");
      attr(div40, "class", "border border-blue-500 text-blue-500 transition-all duration-100 text-center text-xs px-2 py-1 active:bg-blue-600 active:text-white");
      attr(input6, "type", "text");
      attr(input6, "class", "flex-grow bg-transparent text-white border border-l-0 border-blue-500 text-xs px-2");
      input6.value = ctx[6];
      input6.readOnly = true;
      attr(div41, "class", "flex");
      attr(div42, "class", "m-2");
      attr(div43, "class", "tab");
      attr(div44, "class", "bg-gray-500 text-left pl-2");
      attr(div45, "class", "grid grid-cols-4");
      attr(div46, "class", "m-2");
      attr(div47, "class", "tab");
      attr(div48, "class", "w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:transition-all sm:ease-linear sm:duration-100");
      attr(div49, "class", "flex flex-col-reverse sm:flex-row");
    },
    m(target, anchor) {
      insert(target, main2, anchor);
      append(main2, div49);
      append(div49, div2);
      mount_component(frequencyinput, div2, null);
      append(div2, t0);
      append(div2, canvas0);
      ctx[57](canvas0);
      append(div2, t1);
      mount_component(passbandtuner, div2, null);
      append(div2, t2);
      mount_component(frequencymarkers, div2, null);
      append(div2, t3);
      append(div2, canvas1);
      ctx[60](canvas1);
      append(div2, t4);
      append(div2, div0);
      append(div0, canvas2);
      ctx[61](canvas2);
      append(div2, t5);
      append(div2, div1);
      mount_component(logger_1, div1, null);
      append(div49, t6);
      append(div49, div48);
      append(div48, div4);
      append(div48, t7);
      append(div48, div23);
      append(div23, div5);
      append(div23, t9);
      append(div23, div22);
      append(div22, div6);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].m(div6, null);
      }
      append(div22, t10);
      append(div22, p);
      append(p, t11);
      append(p, t12);
      append(p, t13);
      append(div22, t14);
      append(div22, div7);
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].m(div7, null);
      }
      append(div22, t15);
      append(div22, div19);
      append(div19, div12);
      append(div12, label1);
      append(label1, input0);
      input0.checked = ctx[15];
      append(label1, t16);
      append(label1, div8);
      append(label1, t18);
      append(label1, div9);
      append(div12, t20);
      append(div12, div10);
      append(div10, t21);
      append(div10, t22);
      append(div12, t23);
      append(div12, div11);
      append(div11, input1);
      set_input_value(input1, ctx[16]);
      append(div19, t24);
      append(div19, div15);
      append(div15, label2);
      append(label2, input2);
      input2.checked = ctx[17];
      append(label2, t25);
      append(label2, div13);
      append(label2, t27);
      mount_component(tooltip, label2, null);
      append(div15, t28);
      append(div15, span0);
      append(span0, t29);
      append(span0, t30);
      append(div15, t31);
      append(div15, div14);
      append(div14, input3);
      set_input_value(input3, ctx[18]);
      append(div19, t32);
      append(div19, div18);
      append(div18, span4);
      append(span4, span1);
      append(span4, t33);
      append(span4, span2);
      append(span4, t34);
      append(span4, span3);
      append(div18, t36);
      append(div18, span5);
      append(span5, t37);
      append(span5, t38);
      append(div18, t39);
      append(div18, div17);
      append(div17, div16);
      append(div16, span6);
      append(div16, t40);
      append(div16, span7);
      append(div22, t41);
      append(div22, div21);
      append(div21, div20);
      mount_component(linethroughbutton0, div20, null);
      append(div20, t42);
      mount_component(linethroughbutton1, div20, null);
      append(div20, t43);
      mount_component(linethroughbutton2, div20, null);
      append(div48, t44);
      append(div48, div38);
      append(div38, div24);
      append(div38, t46);
      append(div38, div37);
      append(div37, div25);
      mount_component(checkbutton0, div25, null);
      append(div25, t47);
      mount_component(checkbutton1, div25, null);
      append(div37, t48);
      append(div37, div26);
      append(div26, button0);
      append(div26, t50);
      append(div26, button1);
      append(div26, t52);
      append(div26, button2);
      append(div26, t54);
      append(div26, button3);
      append(div37, t56);
      append(div37, div29);
      append(div29, div27);
      append(div29, t58);
      append(div29, span8);
      append(span8, t59);
      append(div29, t60);
      append(div29, div28);
      append(div28, input4);
      set_input_value(input4, ctx[11]);
      append(div37, t61);
      append(div37, div32);
      append(div32, div30);
      append(div32, t63);
      append(div32, span9);
      append(span9, t64);
      append(div32, t65);
      append(div32, div31);
      append(div31, input5);
      set_input_value(input5, ctx[12]);
      append(div37, t66);
      append(div37, div36);
      append(div36, div33);
      append(div36, t68);
      append(div36, div34);
      append(div34, canvas3);
      ctx[83](canvas3);
      append(div36, t69);
      append(div36, div35);
      append(div35, select);
      for (let i = 0; i < each_blocks_1.length; i += 1) {
        each_blocks_1[i].m(select, null);
      }
      select_option(select, ctx[9]);
      append(div48, t70);
      append(div48, div43);
      append(div43, div39);
      append(div43, t72);
      append(div43, div42);
      append(div42, div41);
      append(div41, div40);
      append(div40, button4);
      append(div40, t74);
      mount_component(popover, div40, null);
      append(div41, t75);
      append(div41, input6);
      append(div48, t76);
      append(div48, div47);
      append(div47, div44);
      append(div47, t78);
      append(div47, div46);
      append(div46, div45);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(div45, null);
      }
      current = true;
      if (!mounted) {
        dispose = [
          listen(window_1, "mousemove", ctx[30]),
          listen(window_1, "mouseup", ctx[31]),
          listen(canvas0, "wheel", ctx[28]),
          listen(canvas0, "click", function() {
            if (is_function(ctx[4].handlePassbandClick))
              ctx[4].handlePassbandClick.apply(this, arguments);
          }),
          listen(canvas1, "wheel", ctx[28]),
          listen(canvas1, "click", function() {
            if (is_function(ctx[4].handlePassbandClick))
              ctx[4].handlePassbandClick.apply(this, arguments);
          }),
          action_destroyer(pinch.call(null, canvas2)),
          listen(canvas2, "pinchstart", ctx[53]),
          listen(canvas2, "pinchmove", ctx[54]),
          action_destroyer(pan.call(null, canvas2)),
          listen(canvas2, "panmove", ctx[55]),
          listen(canvas2, "wheel", ctx[28]),
          listen(canvas2, "mousedown", ctx[29]),
          listen(input0, "change", ctx[68]),
          listen(input0, "change", ctx[42]),
          listen(input1, "change", ctx[69]),
          listen(input1, "input", ctx[69]),
          listen(input1, "mousemove", ctx[43]),
          listen(input2, "change", ctx[70]),
          listen(input2, "change", ctx[44]),
          listen(input3, "change", ctx[71]),
          listen(input3, "input", ctx[71]),
          listen(input3, "mousemove", ctx[45]),
          listen(button0, "click", ctx[77]),
          listen(button1, "click", ctx[78]),
          listen(button2, "click", ctx[79]),
          listen(button3, "click", ctx[80]),
          listen(input4, "change", ctx[81]),
          listen(input4, "input", ctx[81]),
          listen(input4, "mousemove", ctx[35]),
          listen(input5, "change", ctx[82]),
          listen(input5, "input", ctx[82]),
          listen(input5, "mousemove", ctx[36]),
          listen(select, "change", ctx[84]),
          listen(select, "change", ctx[34]),
          listen(div40, "click", ctx[50])
        ];
        mounted = true;
      }
    },
    p(new_ctx, dirty) {
      ctx = new_ctx;
      const frequencyinput_changes = {};
      frequencyinput.$set(frequencyinput_changes);
      if (!current || dirty[0] & 256 && canvas0_class_value !== (canvas0_class_value = "w-full bg-black peer " + (ctx[8] ? "max-h-full" : "max-h-0"))) {
        attr(canvas0, "class", canvas0_class_value);
      }
      const passbandtuner_changes = {};
      passbandtuner.$set(passbandtuner_changes);
      const frequencymarkers_changes = {};
      frequencymarkers.$set(frequencymarkers_changes);
      if (!current || dirty[0] & 128 && canvas2_class_value !== (canvas2_class_value = "w-full bg-black " + (ctx[7] ? "block" : "hidden"))) {
        attr(canvas2, "class", canvas2_class_value);
      }
      const logger_1_changes = {};
      logger_1.$set(logger_1_changes);
      if (!current || dirty[0] & 134217728 && div1_class_value !== (div1_class_value = ctx[27] === "none" ? "hidden" : "block")) {
        attr(div1, "class", div1_class_value);
      }
      if (dirty[0] & 24576 | dirty[1] & 64) {
        each_value_3 = ctx[13];
        each_blocks_3 = update_keyed_each(each_blocks_3, dirty, get_key, 1, ctx, each_value_3, each0_lookup, div6, destroy_block, create_each_block_3, null, get_each_context_3);
      }
      if (!current || dirty[0] & 32)
        set_data(t12, ctx[5]);
      if (dirty[0] & 2097152 | dirty[1] & 1024) {
        each_value_2 = ctx[21];
        each_blocks_2 = update_keyed_each(each_blocks_2, dirty, get_key_1, 1, ctx, each_value_2, each1_lookup, div7, destroy_block, create_each_block_2, null, get_each_context_2);
      }
      if (dirty[0] & 32768) {
        input0.checked = ctx[15];
      }
      if (!current || dirty[0] & 65536)
        set_data(t21, ctx[16]);
      if (!current || dirty[0] & 32768) {
        input1.disabled = ctx[15];
      }
      if (dirty[0] & 65536) {
        set_input_value(input1, ctx[16]);
      }
      if (dirty[0] & 131072) {
        input2.checked = ctx[17];
      }
      if (!current || dirty[0] & 262144)
        set_data(t29, ctx[18]);
      if (dirty[0] & 262144) {
        set_input_value(input3, ctx[18]);
      }
      if (!current || dirty[0] & 524288) {
        set_style(span1, "top", -ctx[19] + "%");
      }
      if (!current || dirty[0] & 524288) {
        set_style(span1, "height", ctx[19] + 100 + "%");
      }
      if (!current || dirty[0] & 1048576) {
        set_style(span2, "top", -ctx[20] + "%");
      }
      if (!current || dirty[0] & 1048576) {
        set_style(span2, "height", ctx[20] + 100 + "%");
      }
      if ((!current || dirty[0] & 524288) && t37_value !== (t37_value = ctx[19].toFixed(1) + ""))
        set_data(t37, t37_value);
      if (!current || dirty[0] & 524288) {
        set_style(span6, "width", ctx[19] + 100 + "%");
      }
      if (!current || dirty[0] & 1048576) {
        set_style(span7, "width", ctx[20] + 100 + "%");
      }
      const linethroughbutton0_changes = {};
      if (dirty[3] & 131072) {
        linethroughbutton0_changes.$$scope = { dirty, ctx };
      }
      if (!updating_checked && dirty[0] & 4194304) {
        updating_checked = true;
        linethroughbutton0_changes.checked = ctx[22];
        add_flush_callback(() => updating_checked = false);
      }
      linethroughbutton0.$set(linethroughbutton0_changes);
      const linethroughbutton1_changes = {};
      if (dirty[3] & 131072) {
        linethroughbutton1_changes.$$scope = { dirty, ctx };
      }
      if (!updating_checked_1 && dirty[0] & 8388608) {
        updating_checked_1 = true;
        linethroughbutton1_changes.checked = ctx[23];
        add_flush_callback(() => updating_checked_1 = false);
      }
      linethroughbutton1.$set(linethroughbutton1_changes);
      const linethroughbutton2_changes = {};
      if (dirty[3] & 131072) {
        linethroughbutton2_changes.$$scope = { dirty, ctx };
      }
      if (!updating_checked_2 && dirty[0] & 16777216) {
        updating_checked_2 = true;
        linethroughbutton2_changes.checked = ctx[24];
        add_flush_callback(() => updating_checked_2 = false);
      }
      linethroughbutton2.$set(linethroughbutton2_changes);
      const checkbutton0_changes = {};
      if (!updating_checked_3 && dirty[0] & 256) {
        updating_checked_3 = true;
        checkbutton0_changes.checked = ctx[8];
        add_flush_callback(() => updating_checked_3 = false);
      }
      checkbutton0.$set(checkbutton0_changes);
      const checkbutton1_changes = {};
      if (!updating_checked_4 && dirty[0] & 128) {
        updating_checked_4 = true;
        checkbutton1_changes.checked = ctx[7];
        add_flush_callback(() => updating_checked_4 = false);
      }
      checkbutton1.$set(checkbutton1_changes);
      if (!current || dirty[0] & 2048)
        set_data(t59, ctx[11]);
      if (dirty[0] & 2048) {
        set_input_value(input4, ctx[11]);
      }
      if (!current || dirty[0] & 256 && div29_class_value !== (div29_class_value = ctx[8] ? "flex" : "hidden")) {
        attr(div29, "class", div29_class_value);
      }
      if (!current || dirty[0] & 4096)
        set_data(t64, ctx[12]);
      if (dirty[0] & 4096) {
        set_input_value(input5, ctx[12]);
      }
      if (!current || dirty[0] & 128 && div32_class_value !== (div32_class_value = ctx[7] ? "flex" : "hidden")) {
        attr(div32, "class", div32_class_value);
      }
      if (dirty & 0) {
        each_value_1 = availableColormaps;
        let i;
        for (i = 0; i < each_value_1.length; i += 1) {
          const child_ctx = get_each_context_1(ctx, each_value_1, i);
          if (each_blocks_1[i]) {
            each_blocks_1[i].p(child_ctx, dirty);
          } else {
            each_blocks_1[i] = create_each_block_1(child_ctx);
            each_blocks_1[i].c();
            each_blocks_1[i].m(select, null);
          }
        }
        for (; i < each_blocks_1.length; i += 1) {
          each_blocks_1[i].d(1);
        }
        each_blocks_1.length = each_value_1.length;
      }
      if (dirty[0] & 512) {
        select_option(select, ctx[9]);
      }
      if (!current || dirty[0] & 128 && div36_class_value !== (div36_class_value = (ctx[7] ? "flex" : "hidden") + " pt-1")) {
        attr(div36, "class", div36_class_value);
      }
      if (!current || dirty[0] & 64 && input6.value !== ctx[6]) {
        input6.value = ctx[6];
      }
      if (dirty[0] & 134217728 | dirty[1] & 3145728) {
        each_value = ctx[51];
        each_blocks = update_keyed_each(each_blocks, dirty, get_key_2, 1, ctx, each_value, each3_lookup, div45, destroy_block, create_each_block, null, get_each_context);
      }
    },
    i(local) {
      if (current)
        return;
      transition_in(frequencyinput.$$.fragment, local);
      transition_in(passbandtuner.$$.fragment, local);
      transition_in(frequencymarkers.$$.fragment, local);
      transition_in(logger_1.$$.fragment, local);
      transition_in(tooltip.$$.fragment, local);
      transition_in(linethroughbutton0.$$.fragment, local);
      transition_in(linethroughbutton1.$$.fragment, local);
      transition_in(linethroughbutton2.$$.fragment, local);
      transition_in(checkbutton0.$$.fragment, local);
      transition_in(checkbutton1.$$.fragment, local);
      transition_in(popover.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(frequencyinput.$$.fragment, local);
      transition_out(passbandtuner.$$.fragment, local);
      transition_out(frequencymarkers.$$.fragment, local);
      transition_out(logger_1.$$.fragment, local);
      transition_out(tooltip.$$.fragment, local);
      transition_out(linethroughbutton0.$$.fragment, local);
      transition_out(linethroughbutton1.$$.fragment, local);
      transition_out(linethroughbutton2.$$.fragment, local);
      transition_out(checkbutton0.$$.fragment, local);
      transition_out(checkbutton1.$$.fragment, local);
      transition_out(popover.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching)
        detach(main2);
      ctx[56](null);
      destroy_component(frequencyinput);
      ctx[57](null);
      ctx[58](null);
      destroy_component(passbandtuner);
      ctx[59](null);
      destroy_component(frequencymarkers);
      ctx[60](null);
      ctx[61](null);
      ctx[62](null);
      destroy_component(logger_1);
      for (let i = 0; i < each_blocks_3.length; i += 1) {
        each_blocks_3[i].d();
      }
      for (let i = 0; i < each_blocks_2.length; i += 1) {
        each_blocks_2[i].d();
      }
      destroy_component(tooltip);
      destroy_component(linethroughbutton0);
      destroy_component(linethroughbutton1);
      destroy_component(linethroughbutton2);
      destroy_component(checkbutton0);
      destroy_component(checkbutton1);
      ctx[83](null);
      destroy_each(each_blocks_1, detaching);
      destroy_component(popover);
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].d();
      }
      mounted = false;
      run_all(dispose);
    }
  };
}
function roundAudioOffsets(offsets) {
  const [l, m, r] = offsets;
  return [Math.floor(l), m, Math.floor(r)];
}
function instance($$self, $$props, $$invalidate) {
  let waterfallCanvas;
  let spectrumCanvas;
  let graduationCanvas;
  let frequencyInputComponent;
  let passbandTunerComponent;
  let bandwidth;
  let link;
  function updatePassband(passband) {
    passband = passband || audio.getAudioRange();
    const frequencies = passband.map(FFTOffsetToFrequency);
    $$invalidate(5, bandwidth = ((frequencies[2] - frequencies[0]) / 1e3).toFixed(2));
    const offsets = frequencies.map(frequencyToWaterfallOffset);
    passbandTunerComponent.changePassband(offsets);
  }
  function handleWaterfallWheel(e) {
    waterfall.canvasWheel(e);
    passbandTunerComponent.updatePassbandLimits();
    updatePassband();
    frequencyMarkerComponent.updateFrequencyMarkerPositions();
  }
  let waterfallDragging = false;
  let waterfallDragTotal = 0;
  function handleWaterfallMouseDown(e) {
    waterfallDragTotal = 0;
    waterfallDragging = true;
  }
  function handleWindowMouseMove(e) {
    if (waterfallDragging) {
      waterfallDragTotal += Math.abs(e.movementX) + Math.abs(e.movementY);
      waterfall.mouseMove(e);
      updatePassband();
      frequencyMarkerComponent.updateFrequencyMarkerPositions();
    }
  }
  function handleWindowMouseUp(e) {
    if (waterfallDragging) {
      if (waterfallDragTotal < 2) {
        passbandTunerComponent.handlePassbandClick(e);
      }
      waterfallDragging = false;
    }
  }
  let waterfallDisplay = true;
  let spectrumDisplay = false;
  function handleSpectrumChange() {
    waterfall.setSpectrum(spectrumDisplay);
  }
  function handleWaterfallChange() {
    waterfall.setWaterfall(waterfallDisplay);
  }
  let currentColormap = "gqrx";
  let colormapPreview;
  let alpha = 0.5;
  let brightness = 80;
  function handleWaterfallColormapSelect(event) {
    waterfall.setColormap(currentColormap);
    drawColormapPreview(currentColormap, colormapPreview);
  }
  function handleAlphaMove() {
    waterfall.setAlpha(1 - alpha);
  }
  function handleBrightnessMove() {
    waterfall.setOffset(brightness);
  }
  let demodulators = ["USB", "LSB", "CW-U", "CW-L", "AM", "FM"];
  const demodulationDefaults = {
    USB: { type: "USB", offsets: [0, 3e3] },
    LSB: { type: "LSB", offsets: [3e3, 0] },
    "CW-U": { type: "USB", offsets: [-500, 1e3] },
    "CW-L": { type: "LSB", offsets: [1e3, -500] },
    AM: { type: "AM", offsets: [5e3, 5e3] },
    FM: { type: "FM", offsets: [5e3, 5e3] },
    WBFM: { type: "FM", offsets: [95e3, 95e3] }
  };
  let demodulation = "USB";
  function handleDemodulationChange(e, changed) {
    const demodulationDefault = demodulationDefaults[demodulation];
    if (changed) {
      if (demodulation === "WBFM") {
        audio.setFmDeemph(5e-5);
      } else {
        audio.setFmDeemph(0);
      }
      audio.setAudioDemodulation(demodulationDefault.type);
    }
    let [l, m, r] = audio.getAudioRange().map(FFTOffsetToFrequency);
    l = m - demodulationDefault.offsets[0];
    r = m + demodulationDefault.offsets[1];
    const audioParameters = roundAudioOffsets([l, m, r].map(frequencyToFFTOffset));
    audio.setAudioRange(...audioParameters);
    updatePassband();
    updateLink();
  }
  function handlePassbandChange(passband) {
    const [l, m, r] = passband.detail.map(waterfallOffsetToFrequency);
    $$invalidate(5, bandwidth = ((r - l) / 1e3).toFixed(2));
    frequencyInputComponent.setFrequency(m);
    const audioParameters = roundAudioOffsets([l, m, r].map(frequencyToFFTOffset));
    audio.setAudioRange(...audioParameters);
    updateLink();
  }
  function handleFrequencyChange(event) {
    const frequency = event.detail;
    const audioRange = audio.getAudioRange();
    const [l, m, r] = audioRange.map(FFTOffsetToFrequency);
    let audioParameters = [frequency - (m - l), frequency, frequency + (r - m)].map(frequencyToFFTOffset);
    const newm = audioParameters[1];
    let [waterfallL, waterfallR] = waterfall.getWaterfallRange();
    if (newm < waterfallL || newm >= waterfallR) {
      const limits = Math.floor((waterfallR - waterfallL) / 2);
      let offset2;
      if (audioRange[1] >= waterfallL && audioRange[1] < waterfallR) {
        offset2 = audioRange[1] - waterfallL;
      } else {
        offset2 = limits;
      }
      const newMid = Math.min(waterfall.waterfallMaxSize - limits, Math.max(limits, newm - offset2 + limits));
      waterfallL = Math.floor(newMid - limits);
      waterfallR = Math.floor(newMid + limits);
      waterfall.setWaterfallRange(waterfallL, waterfallR);
    }
    audioParameters = roundAudioOffsets(audioParameters);
    audio.setAudioRange(...audioParameters);
    updatePassband();
    updateLink();
  }
  function handleWaterfallMagnify(e, type) {
    let [l, m, r] = audio.getAudioRange();
    const [waterfallL, waterfallR] = waterfall.getWaterfallRange();
    const offset2 = (m - waterfallL) / (waterfallR - waterfallL) * waterfall.canvasWidth;
    switch (type) {
      case "max":
        m = Math.min(waterfall.waterfallMaxSize - 512, Math.max(512, m));
        l = m - 512;
        r = m + 512;
        break;
      case "+":
        e.coords = { x: offset2 };
        e.scale = -1;
        waterfall.canvasWheel(e);
        updatePassband();
        return;
      case "-":
        e.coords = { x: offset2 };
        e.scale = 1;
        waterfall.canvasWheel(e);
        updatePassband();
        return;
      case "min":
        l = 0;
        r = waterfall.waterfallMaxSize;
        break;
    }
    waterfall.setWaterfallRange(l, r);
    updatePassband();
  }
  let mute;
  let volume = 75;
  let squelchEnable;
  let squelch = -50;
  let power = 0;
  let powerPeak = 0;
  const accumulator = efficientRollingStats.RollingMax(10);
  let bandwithoffsets = ["-10000", "-100", "-10", "+10", "+100", "+10000"];
  function handleBandwidthOffsetClick(e, bandwidthoffset) {
    bandwidthoffset = parseFloat(bandwidthoffset);
    const demodulationDefault = demodulationDefaults[demodulation].type;
    let [l, m, r] = audio.getAudioRange().map(FFTOffsetToFrequency);
    if (demodulationDefault === "USB") {
      r = Math.max(m, Math.min(m + getMaximumBandwidth(), r + bandwidthoffset));
    } else if (demodulationDefault === "LSB") {
      l = Math.max(m - getMaximumBandwidth(), Math.min(m, l - bandwidthoffset));
    } else {
      r = Math.max(0, Math.min(m + getMaximumBandwidth() / 2, r + bandwidthoffset / 2));
      l = Math.max(m - getMaximumBandwidth() / 2, Math.min(m, l - bandwidthoffset / 2));
    }
    let audioParameters = [l, m, r].map(frequencyToFFTOffset);
    audioParameters = roundAudioOffsets(audioParameters);
    audio.setAudioRange(...audioParameters);
    updatePassband();
  }
  function handleMuteChange() {
    audio.setMute(mute);
  }
  function handleVolumeChange() {
    audio.setGain(Math.pow(10, (volume - 50) / 20));
  }
  function handleSquelchChange() {
    audio.setSquelch(squelchEnable);
  }
  function handleSquelchMove() {
    audio.setSquelchThreshold(squelch);
  }
  let NREnabled = false;
  let NBEnabled = false;
  let ANEnabled = false;
  function handleNRChange() {
    audio.audioProcessor.setNR(NREnabled);
  }
  function handleNBChange() {
    audio.audioProcessor.setNB(NBEnabled);
  }
  function handleANChange() {
    audio.audioProcessor.setAN(ANEnabled);
  }
  let updateInterval;
  let lastUpdated = 0;
  function updateTick() {
    $$invalidate(19, power = audio.getPowerDb());
    $$invalidate(20, powerPeak = accumulator(power));
    if (events.getLastModified() > lastUpdated) {
      const myRange = audio.getAudioRange();
      const clients = events.getSignalClients();
      const myId = Object.keys(clients).find((k) => clients[k][1] - myRange[1] < 1e-6);
      delete clients[myId];
      waterfall.setClients(clients);
      requestAnimationFrame(() => {
        waterfall.updateGraduation();
        waterfall.drawClients();
      });
      lastUpdated = events.getLastModified();
    }
  }
  let frequencyMarkerComponent;
  function handleFrequencyMarkerClick(event) {
    handleFrequencyChange({ detail: event.detail.frequency });
    $$invalidate(14, demodulation = event.detail.modulation);
    handleDemodulationChange();
  }
  function updateLink() {
    const linkObj = {
      frequency: frequencyInputComponent.getFrequency().toFixed(0),
      modulation: demodulation
    };
    const linkQuery = constructLink(linkObj);
    $$invalidate(6, link = `${location.origin}${location.pathname}?${linkQuery}`);
    storeInLocalStorage(linkObj);
  }
  function handleLinkCopyClick() {
    copyToClipboard(link);
  }
  let logger;
  let signalDecoder = "none";
  const decoders = ["none", "rds", "ft8"];
  async function handleDecoderChange(e, changed) {
    if (audio.getSignalDecoder()) {
      audio.getSignalDecoder().stop();
      audio.setSignalDecoder(null);
    }
    if (signalDecoder !== "none") {
      const decoder = new Decoder(
        signalDecoder,
        audio.trueAudioSps,
        (text2) => {
          if (logger) {
            logger.addLine(text2);
          }
        }
      );
      await decoder.promise();
      audio.setSignalDecoder(decoder);
    }
  }
  const backendPromise = init();
  onMount(async () => {
    [
      ...document.getElementsByTagName("button"),
      ...document.getElementsByTagName("input")
    ].forEach((element2) => {
      element2.disabled = true;
    });
    waterfall.initCanvas({
      canvasElem: waterfallCanvas,
      spectrumCanvasElem: spectrumCanvas,
      graduationCanvasElem: graduationCanvas
    });
    await backendPromise;
    [
      ...document.getElementsByTagName("button"),
      ...document.getElementsByTagName("input")
    ].forEach((element2) => {
      element2.disabled = false;
    });
    if (audio.trueAudioSps > 17e4) {
      demodulators.push("WBFM");
      $$invalidate(13, demodulators);
      bandwithoffsets.unshift("-100000");
      bandwithoffsets.push("+100000");
      $$invalidate(21, bandwithoffsets);
    }
    frequencyInputComponent.setFrequency(FFTOffsetToFrequency(audio.getAudioRange()[1]));
    $$invalidate(14, demodulation = audio.settings.defaults.modulation);
    const updateParameters = (linkParameters2) => {
      frequencyInputComponent.setFrequency(linkParameters2.frequency);
      if (frequencyInputComponent.getFrequency() === linkParameters2.frequency) {
        handleFrequencyChange({ detail: linkParameters2.frequency });
      }
      if (demodulators.indexOf(linkParameters2.modulation) !== -1) {
        $$invalidate(14, demodulation = linkParameters2.modulation);
        handleDemodulationChange({}, true);
      }
      frequencyMarkerComponent.updateFrequencyMarkerPositions();
    };
    const linkParameters = parseLink(location.search.slice(1));
    updateParameters(linkParameters);
    updatePassband();
    passbandTunerComponent.updatePassbandLimits();
    handleWaterfallColormapSelect();
    handleDemodulationChange({}, true);
    handleSpectrumChange();
    updateLink();
    updateInterval = setInterval(updateTick, 200);
    window.spectrumAudio = audio;
    window.spectrumWaterfall = waterfall;
  });
  onDestroy(() => {
    clearInterval(updateInterval);
    audio.stop();
    waterfall.stop();
  });
  let pinchX = 0;
  function handleWaterfallPinchStart(e) {
    pinchX = 0;
  }
  function handleWaterfallPinchMove(e) {
    const diff = e.detail.scale - pinchX;
    pinchX = e.detail.scale;
    const scale = 1 - Math.abs(e.detail.srcEvent.movementX) / waterfallCanvas.getBoundingClientRect().width;
    const evt = e.detail.srcEvent;
    evt.coords = { x: e.detail.center.x };
    evt.deltaY = -Math.sign(diff);
    evt.scaleAmount = scale;
    waterfall.canvasWheel(evt);
    updatePassband();
  }
  function handleWaterfallPanMove(e) {
    if (e.detail.srcEvent.pointerType === "touch") {
      waterfall.mouseMove(e.detail.srcEvent);
      updatePassband();
    }
  }
  const $$binding_groups = [[], []];
  function frequencyinput_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      frequencyInputComponent = $$value;
      $$invalidate(3, frequencyInputComponent);
    });
  }
  function canvas0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      spectrumCanvas = $$value;
      $$invalidate(1, spectrumCanvas);
    });
  }
  function passbandtuner_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      passbandTunerComponent = $$value;
      $$invalidate(4, passbandTunerComponent);
    });
  }
  function frequencymarkers_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      frequencyMarkerComponent = $$value;
      $$invalidate(25, frequencyMarkerComponent);
    });
  }
  function canvas1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      graduationCanvas = $$value;
      $$invalidate(2, graduationCanvas);
    });
  }
  function canvas2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      waterfallCanvas = $$value;
      $$invalidate(0, waterfallCanvas);
    });
  }
  function logger_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      logger = $$value;
      $$invalidate(26, logger);
    });
  }
  function input_change_handler() {
    demodulation = this.__value;
    $$invalidate(14, demodulation);
  }
  const click_handler = (e) => handleDemodulationChange(e, false);
  const change_handler = (e) => handleDemodulationChange(e, true);
  const click_handler_1 = (bandwidthoffset, e) => handleBandwidthOffsetClick(e, bandwidthoffset);
  function input0_change_handler() {
    mute = this.checked;
    $$invalidate(15, mute);
  }
  function input1_change_input_handler() {
    volume = to_number(this.value);
    $$invalidate(16, volume);
  }
  function input2_change_handler() {
    squelchEnable = this.checked;
    $$invalidate(17, squelchEnable);
  }
  function input3_change_input_handler() {
    squelch = to_number(this.value);
    $$invalidate(18, squelch);
  }
  function linethroughbutton0_checked_binding(value) {
    NREnabled = value;
    $$invalidate(22, NREnabled);
  }
  function linethroughbutton1_checked_binding(value) {
    NBEnabled = value;
    $$invalidate(23, NBEnabled);
  }
  function linethroughbutton2_checked_binding(value) {
    ANEnabled = value;
    $$invalidate(24, ANEnabled);
  }
  function checkbutton0_checked_binding(value) {
    spectrumDisplay = value;
    $$invalidate(8, spectrumDisplay);
  }
  function checkbutton1_checked_binding(value) {
    waterfallDisplay = value;
    $$invalidate(7, waterfallDisplay);
  }
  const click_handler_2 = (e) => handleWaterfallMagnify(e, "max");
  const click_handler_3 = (e) => handleWaterfallMagnify(e, "+");
  const click_handler_4 = (e) => handleWaterfallMagnify(e, "-");
  const click_handler_5 = (e) => handleWaterfallMagnify(e, "min");
  function input4_change_input_handler() {
    alpha = to_number(this.value);
    $$invalidate(11, alpha);
  }
  function input5_change_input_handler() {
    brightness = to_number(this.value);
    $$invalidate(12, brightness);
  }
  function canvas3_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](() => {
      colormapPreview = $$value;
      $$invalidate(10, colormapPreview);
    });
  }
  function select_change_handler() {
    currentColormap = select_value(this);
    $$invalidate(9, currentColormap);
  }
  function input_change_handler_1() {
    signalDecoder = this.__value;
    $$invalidate(27, signalDecoder);
  }
  const change_handler_1 = (e) => handleDecoderChange();
  return [
    waterfallCanvas,
    spectrumCanvas,
    graduationCanvas,
    frequencyInputComponent,
    passbandTunerComponent,
    bandwidth,
    link,
    waterfallDisplay,
    spectrumDisplay,
    currentColormap,
    colormapPreview,
    alpha,
    brightness,
    demodulators,
    demodulation,
    mute,
    volume,
    squelchEnable,
    squelch,
    power,
    powerPeak,
    bandwithoffsets,
    NREnabled,
    NBEnabled,
    ANEnabled,
    frequencyMarkerComponent,
    logger,
    signalDecoder,
    handleWaterfallWheel,
    handleWaterfallMouseDown,
    handleWindowMouseMove,
    handleWindowMouseUp,
    handleSpectrumChange,
    handleWaterfallChange,
    handleWaterfallColormapSelect,
    handleAlphaMove,
    handleBrightnessMove,
    handleDemodulationChange,
    handlePassbandChange,
    handleFrequencyChange,
    handleWaterfallMagnify,
    handleBandwidthOffsetClick,
    handleMuteChange,
    handleVolumeChange,
    handleSquelchChange,
    handleSquelchMove,
    handleNRChange,
    handleNBChange,
    handleANChange,
    handleFrequencyMarkerClick,
    handleLinkCopyClick,
    decoders,
    handleDecoderChange,
    handleWaterfallPinchStart,
    handleWaterfallPinchMove,
    handleWaterfallPanMove,
    frequencyinput_binding,
    canvas0_binding,
    passbandtuner_binding,
    frequencymarkers_binding,
    canvas1_binding,
    canvas2_binding,
    logger_1_binding,
    input_change_handler,
    $$binding_groups,
    click_handler,
    change_handler,
    click_handler_1,
    input0_change_handler,
    input1_change_input_handler,
    input2_change_handler,
    input3_change_input_handler,
    linethroughbutton0_checked_binding,
    linethroughbutton1_checked_binding,
    linethroughbutton2_checked_binding,
    checkbutton0_checked_binding,
    checkbutton1_checked_binding,
    click_handler_2,
    click_handler_3,
    click_handler_4,
    click_handler_5,
    input4_change_input_handler,
    input5_change_input_handler,
    canvas3_binding,
    select_change_handler,
    input_change_handler_1,
    change_handler_1
  ];
}
class App extends SvelteComponent {
  constructor(options) {
    super();
    init$1(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1, -1, -1]);
  }
}
new App({
  target: document.getElementById("app")
});
export {
  __vite_legacy_guard
};
