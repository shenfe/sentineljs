let selectorToAnimationMap = {};
let animationCallbacks = {};

const doc = window.document;

// Define animationstart event listener
(function () {
    let animationstartListener = function (e) {
        let callbacks = animationCallbacks[e.animationName];

        // Exit if callbacks haven't been registered
        if (!callbacks) return;

        // Stop other callbacks from firing
        e.stopImmediatePropagation();

        // Iterate through callbacks
        for (let i = 0, l = callbacks.length; i < l; i++)
            callbacks[i](e.target);
    };
    doc.addEventListener('webkitAnimationStart', animationstartListener, true);
    doc.addEventListener('animationstart', animationstartListener, true);
})();

// Add stylesheet to document
let styleEl = doc.createElement('style');
doc.head.insertBefore(styleEl, doc.head.firstChild);
let styleSheet = styleEl.sheet;
let cssRules = styleSheet.cssRules;

// Dispatch load event
(function () {
    let ev = doc.createEvent('HTMLEvents');
    ev.initEvent('sentinel-load', false, false);
    doc.dispatchEvent(ev);
})();

const sentinel = {
    /**
     * Add watcher.
     * @param {array} cssSelectors  List of CSS selector strings
     * @param {Function} callback   The callback function
     */
    on: (cssSelectors, callback) => {
        if (!callback) return;

        // Add css rules, cache callbacks
        (Array.isArray(cssSelectors) ? cssSelectors : [cssSelectors])
        .map(selector => {
            let animId = selectorToAnimationMap[selector];

            if (!animId) {
                let isCustomName = selector[0] === '!';

                // Define animation name
                animId = isCustomName ? selector.slice(1) :
                    'sentinel-' + Math.random().toString(16).slice(2);

                // Add keyframe rule
                let transformNone = 'transform:none;';
                let keyframesContent = `${animId}{from{-webkit-${transformNone}-moz-${transformNone}-ms-${transformNone}-o-${transformNone}${transformNone}}to{-webkit-${transformNone}-moz-${transformNone}-ms-${transformNone}-o-${transformNone}${transformNone}}}`;
                let cssRuleIndex;
                try {
                    cssRuleIndex = styleSheet.insertRule(`@-webkit-keyframes ${keyframesContent}`, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule(`@-moz-keyframes ${keyframesContent}`, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule(`@-o-keyframes ${keyframesContent}`, cssRules.length);
                } catch (e) {}
                try {
                    cssRuleIndex = styleSheet.insertRule(`@keyframes ${keyframesContent}`, cssRules.length);
                } catch (e) {}
                cssRules[cssRuleIndex]._id = selector;

                // Add selector animation rule
                if (!isCustomName) {
                    let animationDuration = 'animation-duration:0.0001s;';
                    let animationName = `animation-name:${animId};`;
                    cssRules[styleSheet.insertRule(
                        selector + `{-webkit-${animationDuration}-moz-${animationDuration}-ms-${animationDuration}-o-${animationDuration}${animationDuration}` +
                            `-webkit-${animationName}-moz-${animationName}-ms-${animationName}-o-${animationName}${animationName}}`,
                        cssRules.length
                    )]._id = selector;
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
    off: (cssSelectors, callback) => {
        // Iterate through rules
        (Array.isArray(cssSelectors) ? cssSelectors : [cssSelectors])
        .map(selector => {
            let animId = selectorToAnimationMap[selector];
            if (!animId) return;

            // Remove callback from list
            if (callback) {
                // Get callbacks
                let callbackList = animationCallbacks[animId];
                let i = callbackList.length;
                while (i--) {
                    if (callbackList[i] === callback) callbackList.splice(i, 1);
                }

                // Exit if callbacks still exist
                if (callbackList.length) return;
            }

            // Clear cache and remove css rules
            let j = cssRules.length;
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
    reset: () => {
        selectorToAnimationMap = {};
        animationCallbacks = {};
        if (styleEl) {
            styleEl.parentNode.removeChild(styleEl);
            styleEl = null;
        }
    }
};

export default sentinel
