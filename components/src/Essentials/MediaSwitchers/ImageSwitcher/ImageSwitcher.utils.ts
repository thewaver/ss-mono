import { MathUtils, StoreUtils } from "@thewaver/ss-utils";
import type { Store } from "@thewaver/ss-utils";

import type { ImageSwitcherLayer, ImageSwitcherState } from "./ImageSwitcher.types";

const INITIAL_STATE: ImageSwitcherState = { prevSrc: undefined, currentSrc: undefined, version: 0 };

/** The part of an image switcher that is not about any framework: when a new picture is swapped in, and where. */
export namespace ImageSwitcherUtils {
    /**
     * Makes the store an image switcher draws from, and the command that moves it to a new picture.
     *
     * `show` preloads the picture off-screen and swaps only once it has loaded, so neither visible element changes
     * while the request is in flight. A picture that fails to load still swaps, with a warning, rather than
     * stranding the old one; an empty source swaps at once, since there is nothing to wait for. A source equal to
     * the current one does nothing. The swap is one store write: the outgoing picture becomes `prevSrc`, the new one
     * `currentSrc`, and `version` goes up by one, which is what decides which element each lands on.
     *
     * `show(src, cbs)` takes the picture, or `undefined` for none, with an optional `onLoad` that runs once the
     * preloaded picture has loaded — as the image's own `onload` would — and an `onError` that runs when it fails.
     * It returns a function that abandons the preload, or `undefined` when nothing was started.
     *
     * @returns The store, and `show`.
     */
    export const createSwitcher = () => {
        const store = StoreUtils.create(INITIAL_STATE);

        const swap = (src: string | undefined) =>
            store.update((state) => ({ prevSrc: state.currentSrc, currentSrc: src, version: state.version + 1 }));

        const show = (
            src: string | undefined,
            cbs?: { onLoad?: GlobalEventHandlers["onload"]; onError?: (e: Event) => void },
        ) => {
            if (src === store.get().currentSrc) return undefined;

            if (!src) {
                swap(src);

                return undefined;
            }

            const img = new Image();

            img.onload = (e) => {
                swap(src);
                cbs?.onLoad?.call(img, e);
            };
            img.onerror = (e) => {
                console.warn(`ImageSwitcher: failed to preload image: ${src}`);
                swap(src);
                if (typeof e !== "string") cbs?.onError?.(e);
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
     * hide, rather than draw a broken image.
     *
     * @param state The switcher's state.
     * @returns Both elements' picture and whether each is the one shown.
     */
    export const getLayers = (state: ImageSwitcherState): [ImageSwitcherLayer, ImageSwitcherLayer] => {
        const isEven = MathUtils.isEven(state.version);

        return [
            { src: isEven ? state.currentSrc : state.prevSrc, isShown: isEven },
            { src: isEven ? state.prevSrc : state.currentSrc, isShown: !isEven },
        ];
    };
}
