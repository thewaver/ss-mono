import { createEffect, onCleanup } from "solid-js";

import { type ElementFaderOpts, ElementFaderUtils } from "@thewaver/ss-components";

import { accessStore } from "../../Utils/storeUtils";

/** The Solid side of {@link ElementFaderUtils}: a fade driven by a visibility signal, read as signals. */
export namespace ElementFaderSolidUtils {
    /**
     * Drives one element's fade in and out from a visibility accessor.
     *
     * {@link ElementFaderUtils.createFader} with its three fields read as accessors, each notifying only when
     * its own field changes, and its `show` and `hide` called whenever `getIsVisible` changes. Anything in
     * flight is cancelled when the owner is disposed.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param getIsVisible Whether the element should be shown.
     * @param opts What {@link ElementFaderUtils.createFader} takes.
     * @returns `getIsVisible`, which stays `true` through the fade out and is what the caller should mount on;
     * `getTransitionTarget`, `0` or `1`, which is what the caller should drive opacity from;
     * `getHasTransitionFinished` for anything that must wait for the animation to settle; and `show` and `hide`
     * for driving it directly.
     */
    export const createFader = (getIsVisible: () => boolean, opts: ElementFaderOpts) => {
        const fader = ElementFaderUtils.createFader(opts);

        onCleanup(fader.cancel);

        const getIsFaderVisible = accessStore(fader, (state) => state.isVisible);
        const getTransitionTarget = accessStore(fader, (state) => state.transitionTarget);
        const getHasTransitionFinished = accessStore(fader, (state) => state.hasTransitionFinished);

        createEffect(() => {
            if (getIsVisible()) {
                fader.show();
            } else {
                fader.hide();
            }
        });

        return {
            getIsVisible: getIsFaderVisible,
            getTransitionTarget,
            getHasTransitionFinished,
            show: fader.show,
            hide: fader.hide,
        };
    };
}
