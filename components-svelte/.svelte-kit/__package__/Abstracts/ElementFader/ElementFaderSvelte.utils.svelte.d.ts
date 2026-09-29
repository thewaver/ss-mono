import { type ElementFaderOpts } from "@thewaver/ss-components";
/** The Svelte side of {@link ElementFaderUtils}: a fade driven by a visibility getter, read as getters. */
export declare namespace ElementFaderSvelteUtils {
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
    const createFader: (getIsVisible: () => boolean, opts: ElementFaderOpts) => {
        getIsVisible: () => boolean;
        getTransitionTarget: () => 0 | 1;
        getHasTransitionFinished: () => boolean;
        show: () => void;
        hide: () => void;
    };
}
