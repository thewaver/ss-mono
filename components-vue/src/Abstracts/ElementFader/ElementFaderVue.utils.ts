import { type MaybeRefOrGetter, onScopeDispose, toValue } from "vue";

import { ElementFaderUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { useStore } from "../../Utils/storeUtils";

/** The Vue side of `ElementFaderUtils`: a fade driven by a visibility flag, read as refs. */
export namespace ElementFaderVueUtils {
    /**
     * Drives one element's fade in and out from a visibility flag.
     *
     * `ElementFaderUtils.createFader` as a composable: `show` or `hide` is called once the component has rendered and
     * whenever `isVisible` changes, the three fields are read as refs, each notifying only when its own field
     * changes, and anything in flight is cancelled on unmount. The options are read when they are needed, so a new
     * duration or callback takes effect on the next fade without restarting the current one.
     *
     * Must run inside a component's `setup`.
     *
     * @param isVisible Whether the element should be shown.
     * @param opts.transitionDurationMs How long the CSS transition takes. With no `ref` this is what decides when the
     * element is done, so it must match the duration the stylesheet uses; with one it is only the backstop.
     * @param opts.ref The outermost element the library owns, whose animations — its own and its descendants' — are
     * what the transition is judged by.
     * @param opts.onShow Called when a fade in begins.
     * @param opts.onHide Called when a fade out begins.
     * @returns `isVisible`, which stays `true` through the fade out and is what the caller should mount on;
     * `transitionTarget`, `0` or `1`, which is what the caller should drive opacity from; `hasTransitionFinished`
     * for anything that must wait for the animation to settle; and `show` and `hide` for driving it directly.
     */
    export const useFader = (
        isVisible: MaybeRefOrGetter<boolean>,
        opts: {
            transitionDurationMs: MaybeRefOrGetter<number>;
            ref?: MaybeRefOrGetter<HTMLElement | null | undefined>;
            onShow?: () => void;
            onHide?: () => void;
        },
    ) => {
        const fader = ElementFaderUtils.createFader({
            getTransitionDurationMs: () => toValue(opts.transitionDurationMs),
            getRef: () => toValue(opts.ref) ?? undefined,
            onShow: () => opts.onShow?.(),
            onHide: () => opts.onHide?.(),
        });

        onScopeDispose(fader.cancel);

        watchAfterRender([() => toValue(isVisible)], ([isShown]) => {
            if (isShown) {
                fader.show();
            } else {
                fader.hide();
            }
        });

        return {
            isVisible: useStore(fader, (state) => state.isVisible),
            transitionTarget: useStore(fader, (state) => state.transitionTarget),
            hasTransitionFinished: useStore(fader, (state) => state.hasTransitionFinished),
            show: fader.show,
            hide: fader.hide,
        };
    };
}
