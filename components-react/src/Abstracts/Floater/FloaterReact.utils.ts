import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { type FloaterBounds, FloaterUtils, type PlacementLayout, type PlacementRect } from "@thewaver/ss-components";

import { ElementFaderReactUtils } from "../ElementFader/ElementFaderReact.utils";

/** The React side of {@link FloaterUtils}: a marker that follows one item of a control, as state. */
export namespace FloaterReactUtils {
    /**
     * Follows one item with a marker, and fades the marker in and out as there comes to be an item to follow.
     *
     * In a plain row or column the item's box is measured against `container` and measured again whenever either
     * changes size; under a layout it is derived from the item's placement and nothing is measured. The marker fades
     * out when the item goes — no selection, the highlight scrolled out of a list that only draws what is visible —
     * and back in when it returns, through `ElementFader`. The last box is kept while it fades out, so the exit plays
     * where the marker was, and dropped once it is gone, so the next entrance starts at the new item.
     *
     * @param opts.isEnabled Whether the consumer draws this marker at all. While `false` nothing is measured.
     * @param opts.container The positioned element the marker is drawn in.
     * @param opts.target The item's element, or `undefined` while there is none.
     * @param opts.layout The control's layout, if it has one.
     * @param opts.placement The item's placement under that layout.
     * @param opts.transitionDurationMs How long the marker takes to slide and to fade.
     * @returns `bounds`, the box to write on the marker; `isRendered`, whether the marker element should be in the
     * page; `visibilityTarget`, the fade's target to hand the consumer's painter; and `ref`, for the marker element.
     */
    export const useFloater = (opts: {
        isEnabled: boolean;
        container: HTMLElement | undefined;
        target: HTMLElement | undefined;
        layout?: PlacementLayout;
        placement?: PlacementRect;
        transitionDurationMs: number;
    }) => {
        const ref = useRef<HTMLDivElement | null>(null);
        const [measuredBounds, setMeasuredBounds] = useState<FloaterBounds>();

        const bounds = FloaterUtils.resolveBounds(opts.layout, measuredBounds, opts.placement);
        const isShown = opts.isEnabled && opts.target !== undefined && bounds !== undefined;

        const fader = ElementFaderReactUtils.useFader(isShown, {
            transitionDurationMs: opts.transitionDurationMs,
            ref,
        });

        useEffect(() => {
            if (fader.isVisible) return;

            setMeasuredBounds(undefined);
        }, [fader.isVisible]);

        const isMeasuring = opts.isEnabled && opts.layout === undefined;

        useLayoutEffect(() => {
            if (!isMeasuring || !opts.container || !opts.target) return;

            return FloaterUtils.observeBounds(opts.container, opts.target, setMeasuredBounds);
        }, [isMeasuring, opts.container, opts.target]);

        return {
            bounds,
            isRendered: opts.isEnabled && fader.isVisible && bounds !== undefined,
            visibilityTarget: fader.transitionTarget,
            ref,
        };
    };
}
