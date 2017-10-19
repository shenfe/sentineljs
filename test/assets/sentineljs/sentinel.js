(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.sentinel = factory());
}(this, (function () { 'use strict';

var selectorToAnimationMap = {};
var animationCallbacks = {};

var doc = window.document;

// Define animationstart event listener
(function () {
    var animationstartListener = function animationstartListener(e) {
        var callbacks = animationCallbacks[e.animationName];

        // Exit if callbacks haven't been registered
        if (!callbacks) return;

        // Stop other callbacks from firing
        e.stopImmediatePropagation();

        // Iterate through callbacks
        for (var i = 0, l = callbacks.length; i < l; i++) {
            callbacks[i](e.target);
        }
    };
    doc.addEventListener('webkitAnimationStart', animationstartListener, true);
    doc.addEventListener('animationstart', animationstartListener, true);
})();

// Add stylesheet to document
var styleEl = doc.createElement('style');
doc.head.insertBefore(styleEl, doc.head.firstChild);
var styleSheet = styleEl.sheet;
var cssRules = styleSheet.cssRules;

// Dispatch load event
(function () {
    var ev = doc.createEvent('HTMLEvents');
    ev.initEvent('sentinel-load', false, false);
    doc.dispatchEvent(ev);
})();

var sentinel = {
    /**
     * Add watcher.
     * @param {array} cssSelectors  List of CSS selector strings
     * @param {Function} callback   The callback function
     */
    on: function on(cssSelectors, callback) {
        if (!callback) return;

        // Add css rules, cache callbacks
        (Array.isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function (selector) {
            var animId = selectorToAnimationMap[selector];

            if (!animId) {
                var isCustomName = selector[0] === '!';

                // Define animation name
                animId = isCustomName ? selector.slice(1) : 'sentinel-' + Math.random().toString(16).slice(2);

                // Add keyframe rule
                var transformNone = 'transform:none;';
                var keyframesContent = animId + '{from{-webkit-' + transformNone + '-moz-' + transformNone + '-ms-' + transformNone + '-o-' + transformNone + transformNone + '}to{-webkit-' + transformNone + '-moz-' + transformNone + '-ms-' + transformNone + '-o-' + transformNone + transformNone + '}}';
                var cssRuleIndex = void 0;
                try {
                    cssRuleIndex = styleSheet.insertRule('@-webkit-keyframes ' + keyframesContent, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule('@-moz-keyframes ' + keyframesContent, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule('@-o-keyframes ' + keyframesContent, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule('@keyframes ' + keyframesContent, cssRules.length);
                } catch (e) {}
                cssRules[cssRuleIndex]._id = selector;

                // Add selector animation rule
                if (!isCustomName) {
                    var animationDuration = 'animation-duration:0.0001s;';
                    var animationName = 'animation-name:' + animId + ';';
                    cssRules[styleSheet.insertRule(selector + ('{-webkit-' + animationDuration + '-moz-' + animationDuration + '-ms-' + animationDuration + '-o-' + animationDuration + animationDuration) + ('-webkit-' + animationName + '-moz-' + animationName + '-ms-' + animationName + '-o-' + animationName + animationName + '}'), cssRules.length)]._id = selector;
                }

                // Add to map
                selectorToAnimationMap[selector] = animId;
            }

            // Add to callbacks
            if (!animationCallbacks[animId]) animationCallbacks[animId] = [];
            animationCallbacks[animId].push(callback);
        });
    },
    /**
     * Remove watcher.
     * @param {array} cssSelectors  List of CSS selector strings
     * @param {Function} callback   The callback function (optional)
     */
    off: function off(cssSelectors, callback) {
        // Iterate through rules
        (Array.isArray(cssSelectors) ? cssSelectors : [cssSelectors]).map(function (selector) {
            var animId = selectorToAnimationMap[selector];
            if (!animId) return;

            // Remove callback from list
            if (callback) {
                // Get callbacks
                var callbackList = animationCallbacks[animId];
                var i = callbackList.length;
                while (i--) {
                    if (callbackList[i] === callback) callbackList.splice(i, 1);
                }

                // Exit if callbacks still exist
                if (callbackList.length) return;
            }

            // Clear cache and remove css rules
            var j = cssRules.length;
            while (j--) {
                if (cssRules[j]._id === selector) styleSheet.deleteRule(j);
            }

            delete selectorToAnimationMap[selector];
            delete animationCallbacks[animId];
        });
    },
    /**
     * Reset watchers and cache.
     */
    reset: function reset() {
        selectorToAnimationMap = {};
        animationCallbacks = {};
        if (styleEl) {
            styleEl.parentNode.removeChild(styleEl);
            styleEl = null;
        }
    }
};

return sentinel;

})));
