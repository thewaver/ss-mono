import { untrack } from "svelte";

import { type FloaterBounds, FloaterUtils, type PlacementLayout, type PlacementRect } from "@thewaver/ss-components";

import { ElementFaderSvelteUtils } from "../ElementFader/ElementFaderSvelte.utils.svelte.js";

/** The Svelte side of {@link FloaterUtils}: a marker that follows one item of a control, as getters. */
export namespace FloaterSvelteUtils {
    /**
     * Follows one item with a marker, and fades the marker in and out as there comes to be an item to follow.
     *
     * In a plain row or column the item's box is measured against `getContainer` and measured again whenever either
     * changes size; under a layout it is derived from the item's placement and nothing is measured. The marker fades
     * out when the item goes — no selection, the highlight scrolled out of a list that only draws what is visible —
     * and back in when it returns, through `ElementFader`. The last box is kept while it fades out, so the exit plays
     * where the marker was, and dropped once it is gone, so the next entrance starts at the new item.
     *
     * Must run while a component is being set up.
     *
     * @param opts.getIsEnabled Whether the consumer draws this marker at all. While `false` nothing is measured.
     * @param opts.getContainer The positioned element the marker is drawn in.
     * @param opts.getTarget The item's element, or `undefined` while there is none.
     * @param opts.getLayout The control's layout, if it has one.
     * @param opts.getPlacement The item's placement under that layout.
     * @param opts.getTransitionDurationMs How long the marker takes to slide and to fade.
     * @returns `getBounds`, the box to write on the marker; `getIsRendered`, whether the marker element should be in
     * the page; `getVisibilityTarget`, the fade's target to hand the consumer's painter; and `attachRef`, an attachment
     * for the marker element.
     */
    export const create = (opts: {
        getIsEnabled: () => boolean;
        getContainer: () => HTMLElement | undefined;
        getTarget: () => HTMLElement | undefined;
        getLayout?: () => PlacementLayout | undefined;
        getPlacement?: () => PlacementRect | undefined;
        getTransitionDurationMs: () => number;
    }) => {
        let measuredBounds = $state.raw<FloaterBounds>();
        let ref = $state<HTMLElement>();

        const bounds = $derived(FloaterUtils.resolveBounds(opts.getLayout?.(), measuredBounds, opts.getPlacement?.()));
        const isShown = $derived(opts.getIsEnabled() && opts.getTarget() !== undefined && bounds !== undefined);

        const fader = ElementFaderSvelteUtils.createFader(() => isShown, {
            getTransitionDurationMs: opts.getTransitionDurationMs,
            getRef: () => ref,
        });

        $effect(() => {
            if (fader.getIsVisible()) return;

            measuredBounds = undefined;
        });

        $effect(() => {
            if (!opts.getIsEnabled() || opts.getLayout?.() !== undefined) return;

            const container = opts.getContainer();
            const target = opts.getTarget();

            if (!container || !target) return;

            return untrack(() =>
                FloaterUtils.observeBounds(container, target, (next) => {
                    measuredBounds = next;
                }),
            );
        });

        return {
            getBounds: () => bounds,
            getIsRendered: () => opts.getIsEnabled() && fader.getIsVisible() && bounds !== undefined,
            getVisibilityTarget: fader.getTransitionTarget,
            attachRef: (element: HTMLElement) => {
                ref = element;

                return () => {
                    if (ref === element) ref = undefined;
                };
            },
        };
    };
}
