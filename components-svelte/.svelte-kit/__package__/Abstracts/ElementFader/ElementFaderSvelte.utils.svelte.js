import { untrack } from "svelte";
import { ElementFaderUtils } from "@thewaver/ss-components";
import { readStore } from "../../Utils/storeUtils.js";
/** The Svelte side of {@link ElementFaderUtils}: a fade driven by a visibility getter, read as getters. */
export var ElementFaderSvelteUtils;
(function (ElementFaderSvelteUtils) {
    /**
     * Drives one element's fade in and out from a visibility getter.
     *
     * {@link ElementFaderUtils.createFader} with its three fields read as getters, each waking its readers only when
     * its own field changes, and its `show` and `hide` called whenever `getIsVisible` changes. Anything in flight is
     * cancelled when the component is destroyed. The options are read when they are needed, so functions reading the
     * component's props always see the current ones.
     *
     * Must run while a component is being set up.
     *
     * @param getIsVisible Whether the element should be shown.
     * @param opts What {@link ElementFaderUtils.createFader} takes.
     * @returns `getIsVisible`, which stays `true` through the fade out and is what the caller should mount on;
     * `getTransitionTarget`, `0` or `1`, which is what the caller should drive opacity from;
     * `getHasTransitionFinished` for anything that must wait for the animation to settle; and `show` and `hide` for
     * driving it directly.
     */
    ElementFaderSvelteUtils.createFader = (getIsVisible, opts) => {
        const fader = ElementFaderUtils.createFader(opts);
        $effect(() => fader.cancel);
        const getIsFaderVisible = readStore(fader, (state) => state.isVisible);
        const getTransitionTarget = readStore(fader, (state) => state.transitionTarget);
        const getHasTransitionFinished = readStore(fader, (state) => state.hasTransitionFinished);
        $effect(() => {
            const isVisible = getIsVisible();
            untrack(() => {
                if (isVisible) {
                    fader.show();
                }
                else {
                    fader.hide();
                }
            });
        });
        return {
            getIsVisible: getIsFaderVisible,
            getTransitionTarget,
            getHasTransitionFinished,
            show: fader.show,
            hide: fader.hide,
        };
    };
})(ElementFaderSvelteUtils || (ElementFaderSvelteUtils = {}));
