import { MathUtils, StoreUtils } from "@thewaver/ss-utils";
import type { Store } from "@thewaver/ss-utils";

import type { ImageSwitcherLayer, ImageSwitcherShowOpts, ImageSwitcherState } from "./ImageSwitcher.types";

const INITIAL_STATE: ImageSwitcherState = {
    prevSrc: undefined,
    currentSrc: undefined,
    prevAlt: undefined,
    currentAlt: undefined,
    version: 0,
};

/** The part of an image switcher that is not about any framework: when a new picture is swapped in, and where. */
export namespace ImageSwitcherUtils {
    /**
     * Makes the store an image switcher draws from, and the command that moves it to a new picture.
     *
     * `show` preloads the picture off-screen and swaps only once it has loaded, so neither visible element changes
     * while the request is in flight. A picture that fails to load is never swapped in: the old one stays, with a
     * warning, and `onError` is told. An empty source swaps at once, since there is nothing to wait for. A source
     * equal to the current one swaps nothing and only takes the new `alt`; one that failed is tried again whenever
     * it is asked for. The swap is one store write: the outgoing picture and its text become `prevSrc` and
     * `prevAlt`, the new ones `currentSrc` and `currentAlt`, and `version` goes up by one, which is what decides which
     * element each lands on.
     *
     * The text travels with its picture, so a picture still loading, or one that failed, never lends its text to the
     * picture left on screen.
     *
     * @returns The store, and `show`, which takes the picture, or `undefined` for none, and returns a function that
     * abandons the preload, or `undefined` when nothing was started.
     */
    export const createSwitcher = () => {
        const store = StoreUtils.create(INITIAL_STATE);

        const swap = (src: string | undefined, alt: string | undefined) =>
            store.update((state) => ({
                prevSrc: state.currentSrc,
                currentSrc: src,
                prevAlt: state.currentAlt,
                currentAlt: alt,
                version: state.version + 1,
            }));

        const show = (src: string | undefined, opts?: ImageSwitcherShowOpts) => {
            const alt = opts?.alt;

            if (src === store.get().currentSrc) {
                if (alt !== store.get().currentAlt) store.update((state) => ({ ...state, currentAlt: alt }));

                return undefined;
            }

            if (!src) {
                swap(src, alt);

                return undefined;
            }

            const img = new Image();

            img.onload = (e) => {
                swap(src, alt);
                opts?.onLoad?.call(img, e);
            };
            img.onerror = (e) => {
                console.warn(`ImageSwitcher: failed to preload image, keeping the previous one: ${src}`);
                if (typeof e !== "string") opts?.onError?.(e);
            };
            img.src = src;

            return () => {
                img.onload = null;
                img.onerror = null;
                img.src = "";
            };
        };

        return { store: store as Store<ImageSwitcherState>, show };
    };

    /**
     * The two stacked elements a switcher crossfades between, in document order.
     *
     * Each swap flips which element is shown. The shown one carries the current picture and the other keeps the
     * outgoing one while it fades, so nothing is torn out mid-fade. An element with no picture to carry is the one to
     * hide, rather than draw a broken image. The element not shown is hidden from assistive technology as well, from
     * the moment it starts to fade, so the picture's text is read once and only for the picture on screen.
     *
     * @param state The switcher's state.
     * @returns Both elements' picture, its text and whether each is the one shown.
     */
    export const getLayers = (state: ImageSwitcherState): [ImageSwitcherLayer, ImageSwitcherLayer] => {
        const isEven = MathUtils.isEven(state.version);

        return [
            {
                src: isEven ? state.currentSrc : state.prevSrc,
                alt: isEven ? state.currentAlt : state.prevAlt,
                isShown: isEven,
            },
            {
                src: isEven ? state.prevSrc : state.currentSrc,
                alt: isEven ? state.prevAlt : state.currentAlt,
                isShown: !isEven,
            },
        ];
    };
}
