import { type Accessor, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

import { type FloaterBounds, FloaterUtils, type PlacementLayout, type PlacementRect } from "@thewaver/ss-components";

import { ElementFaderSolidUtils } from "../ElementFader/ElementFaderSolid.utils";

/** The Solid side of {@link FloaterUtils}: a marker that follows one item of a control, as signals. */
export namespace FloaterSolidUtils {
    /**
     * Follows one item with a marker, and fades the marker in and out as there comes to be an item to follow.
     *
     * In a plain row or column the item's box is measured against `getContainer` and measured again whenever either
     * changes size; under a layout it is derived from the item's placement and nothing is measured. The marker fades
     * out when the item goes — no selection, the highlight scrolled out of a list that only draws what is visible —
     * and back in when it returns, through `ElementFader`. The last box is kept while it fades out, so the exit plays
     * where the marker was, and dropped once it is gone, so the next entrance starts at the new item.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param opts.getIsEnabled Whether the consumer draws this marker at all. While `false` nothing is measured.
     * @param opts.getContainer The positioned element the marker is drawn in.
     * @param opts.getTarget The item's element, or `undefined` while there is none.
     * @param opts.getLayout The control's layout, if it has one.
     * @param opts.getPlacement The item's placement under that layout.
     * @param opts.getTransitionDurationMs How long the marker takes to slide and to fade.
     * @returns `getBounds`, the box to write on the marker; `getIsRendered`, whether the marker element should be in
     * the page; `getVisibilityTarget`, the fade's target to hand the consumer's painter; and `setRef`, for the marker
     * element.
     */
    export const create = (opts: {
        getIsEnabled: Accessor<boolean>;
        getContainer: Accessor<HTMLElement | undefined>;
        getTarget: Accessor<HTMLElement | undefined>;
        getLayout?: Accessor<PlacementLayout | undefined>;
        getPlacement?: Accessor<PlacementRect | undefined>;
        getTransitionDurationMs: Accessor<number>;
    }) => {
        const [getMeasuredBounds, setMeasuredBounds] = createSignal<FloaterBounds>();
        const [getRef, setRef] = createSignal<HTMLElement>();

        const getBounds = createMemo(() =>
            FloaterUtils.resolveBounds(opts.getLayout?.(), getMeasuredBounds(), opts.getPlacement?.()),
        );

        const getIsShown = createMemo(
            () => opts.getIsEnabled() && opts.getTarget() !== undefined && getBounds() !== undefined,
        );

        const fader = ElementFaderSolidUtils.createFader(getIsShown, {
            getTransitionDurationMs: opts.getTransitionDurationMs,
            getRef,
        });

        createEffect(() => {
            if (fader.getIsVisible()) return;

            setMeasuredBounds(undefined);
        });

        createEffect(() => {
            if (!opts.getIsEnabled() || opts.getLayout?.() !== undefined) return;

            const container = opts.getContainer();
            const target = opts.getTarget();

            if (!container || !target) return;

            onCleanup(FloaterUtils.observeBounds(container, target, setMeasuredBounds));
        });

        return {
            getBounds,
            getIsRendered: () => opts.getIsEnabled() && fader.getIsVisible() && getBounds() !== undefined,
            getVisibilityTarget: fader.getTransitionTarget,
            setRef,
        };
    };
}
