import { type MaybeRefOrGetter, computed, shallowRef, toValue } from "vue";

import { type FloaterBounds, FloaterUtils, type PlacementLayout, type PlacementRect } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";
import { ElementFaderVueUtils } from "../ElementFader/ElementFaderVue.utils";

/** The Vue side of {@link FloaterUtils}: a marker that follows one item of a control, as refs. */
export namespace FloaterVueUtils {
    /**
     * Follows one item with a marker, and fades the marker in and out as there comes to be an item to follow.
     *
     * In a plain row or column the item's box is measured against `container` and measured again whenever either
     * changes size; under a layout it is derived from the item's placement and nothing is measured. The marker fades
     * out when the item goes — no selection, the highlight scrolled out of a list that only draws what is visible —
     * and back in when it returns, through `ElementFader`. The last box is kept while it fades out, so the exit plays
     * where the marker was, and dropped once it is gone, so the next entrance starts at the new item.
     *
     * Must run inside a component's `setup`.
     *
     * @param opts.isEnabled Whether the consumer draws this marker at all. While `false` nothing is measured.
     * @param opts.container The positioned element the marker is drawn in.
     * @param opts.target The item's element, or `undefined` while there is none.
     * @param opts.layout The control's layout, if it has one.
     * @param opts.placement The item's placement under that layout.
     * @param opts.transitionDurationMs How long the marker takes to slide and to fade.
     * @returns `bounds`, the box to write on the marker; `isRendered`, whether the marker element should be in the
     * page; `visibilityTarget`, the fade's target to hand the consumer's painter; and `setRef`, for the marker element.
     */
    export const useFloater = (opts: {
        isEnabled: MaybeRefOrGetter<boolean>;
        container: MaybeRefOrGetter<HTMLElement | null | undefined>;
        target: MaybeRefOrGetter<HTMLElement | null | undefined>;
        layout?: MaybeRefOrGetter<PlacementLayout | undefined>;
        placement?: MaybeRefOrGetter<PlacementRect | undefined>;
        transitionDurationMs: MaybeRefOrGetter<number>;
    }) => {
        const measuredBounds = shallowRef<FloaterBounds>();
        const ref = shallowRef<HTMLElement>();

        const bounds = computed(() =>
            FloaterUtils.resolveBounds(toValue(opts.layout), measuredBounds.value, toValue(opts.placement)),
        );

        const isShown = computed(() => toValue(opts.isEnabled) && !!toValue(opts.target) && bounds.value !== undefined);

        const fader = ElementFaderVueUtils.useFader(isShown, {
            transitionDurationMs: opts.transitionDurationMs,
            ref,
        });

        watchAfterRender([fader.isVisible], ([isVisible]) => {
            if (!isVisible) measuredBounds.value = undefined;
        });

        watchAfterRender(
            [
                () => toValue(opts.isEnabled),
                () => toValue(opts.layout),
                () => toValue(opts.container),
                () => toValue(opts.target),
            ],
            ([isEnabled, layout, container, target]) => {
                if (!isEnabled || layout !== undefined || !container || !target) return;

                return FloaterUtils.observeBounds(container, target, (next) => {
                    measuredBounds.value = next;
                });
            },
        );

        return {
            bounds,
            isRendered: computed(() => toValue(opts.isEnabled) && fader.isVisible.value && bounds.value !== undefined),
            visibilityTarget: fader.transitionTarget,
            setRef: (element: unknown) => {
                ref.value = element instanceof HTMLElement ? element : undefined;
            },
        };
    };
}
