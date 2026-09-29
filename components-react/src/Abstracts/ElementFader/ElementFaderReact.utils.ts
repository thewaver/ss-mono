import { type RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";

import { ElementFaderUtils } from "@thewaver/ss-components";

import { useStore } from "../../Utils/storeUtils";

/** The React side of `ElementFaderUtils`: a fade driven by a visibility flag, read as state. */
export namespace ElementFaderReactUtils {
    /**
     * Drives one element's fade in and out from a visibility flag.
     *
     * `ElementFaderUtils.createFader` as a hook: `show` or `hide` is called whenever `isVisible` changes, the
     * three fields are read as state, and anything in flight is cancelled on unmount. The options are read
     * when they are needed, so a new duration or callback takes effect on the next fade without restarting
     * the current one.
     *
     * @param isVisible Whether the element should be shown.
     * @param opts.transitionDurationMs How long the CSS transition takes. With no `ref` this is what decides
     * when the element is done, so it must match the duration the stylesheet uses; with one it is only the
     * backstop.
     * @param opts.ref The outermost element the library owns, whose animations — its own and its
     * descendants' — are what the transition is judged by.
     * @param opts.onShow Called when a fade in begins.
     * @param opts.onHide Called when a fade out begins.
     * @returns `isVisible`, which stays `true` through the fade out and is what the caller should mount on;
     * `transitionTarget`, `0` or `1`, which is what the caller should drive opacity from;
     * `hasTransitionFinished` for anything that must wait for the animation to settle; and `show` and `hide`
     * for driving it directly.
     */
    export const useFader = (
        isVisible: boolean,
        opts: {
            transitionDurationMs: number;
            ref?: RefObject<HTMLElement | null>;
            onShow?: () => void;
            onHide?: () => void;
        },
    ) => {
        const optsRef = useRef(opts);

        useLayoutEffect(() => {
            optsRef.current = opts;
        });

        const [fader] = useState(() =>
            ElementFaderUtils.createFader({
                getTransitionDurationMs: () => optsRef.current.transitionDurationMs,
                getRef: () => optsRef.current.ref?.current ?? undefined,
                onShow: () => optsRef.current.onShow?.(),
                onHide: () => optsRef.current.onHide?.(),
            }),
        );

        useEffect(() => {
            if (isVisible) {
                fader.show();
            } else {
                fader.hide();
            }
        }, [fader, isVisible]);

        useEffect(() => fader.cancel, [fader]);

        const state = useStore(fader);

        return { ...state, show: fader.show, hide: fader.hide };
    };
}
