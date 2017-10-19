# SentinelJS

This project is a **fork** and reconstruction of [muicss/sentineljs](https://github.com/muicss/sentineljs).

SentinelJS is a tiny JavaScript library that makes it easy to set up a watch function that will notify you anytime a new node is added to the DOM that matches a given CSS rule.

## Quickstart

Simple use:

```js
sentinel.on('custom-element', function (el) {
    // now `el` is the new <custom-element> element
});
```

If SentinelJS is loaded asynchronously:

```js
// use the `sentinel-load` event to detect load time
document.addEventListener('sentinel-load', function () {
    // now the `sentinel` global object is available
});
```

## Browser Support

 * IE10+
 * Opera 12+
 * Safari 5+
 * Chrome
 * Firefox
 * iOS 6+
 * Android 4.4+
 
## API

### on() - Add a watch for new DOM nodes

```
on(cssSelectors, callbackFn)

  * cssSelectors {Array or String} - A single selector string or an array
  * callbackFn {Function} - The callback function

Examples:

1. Set up a watch for a single CSS selector:

   sentinel.on('.my-div', function (el) {
       // add an input box
       var inputEl = document.createElement('input');
       el.appendChild(inputEl);
   });
  
2. Set up a watch for multiple CSS selectors:
 
   sentinel.on(['.my-div1', '.my-div2'], function (el) {
       // add an input box
       var inputEl = document.createElement('input');
       el.appendChild(inputEl);
   });

3. Trigger a watch function using custom CSS (using "!"):

   <style>
       @keyframes slidein {
           from: {margin-left: 100%}
           to: {margin-left: 0%;}
       }

       .my-div {
           animation-duration: 3s;
           animation-name: slide-in, node-inserted;
       }
   </style>
   <script>
       // trigger on "node-inserted" animation event name (using "!")
       sentinel.on('!node-inserted', function (el) {
           el.insertHTML = 'The sentinel is always watching.';
       });
   </script>
```

### off() - Remove a watch or a callback

```
off(cssSelectors[, callbackFn])

  * cssSelectors {Array or String} - A single selector string or an array
  * callbackFn {Function} - The callback function you want to remove the watch for (optional)

Examples:

1. Remove a callback:
 
   function myCallback(el) { /* do something awesome */ }

   // add listener
   sentinel.on('.my-div', myCallback);

   // remove listener
   sentinel.off('.my-div', myCallback);

2. Remove a watch:

   // add multiple callbacks
   sentinel.on('.my-div', function fn1(el) {});
   sentinel.on('.my-div', function fn2(el) {});

   // remove all callbacks
   sentinel.off('.my-div');
```

### reset() - Remove all watches and callbacks

```
reset()

Examples:

1. Remove all watches and callbacks from the sentinel library:

   // add multiple callbacks
   sentinel.on('.my-div1', function fn1(el) {});
   sentinel.on('.my-div2', function fn2(el) {});

   // remove all watches and callbacks
   sentinel.reset();
```
