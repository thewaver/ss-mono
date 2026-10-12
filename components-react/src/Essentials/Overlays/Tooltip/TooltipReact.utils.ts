import { type PointerEvent, useEffect, useState } from "react";

import { TooltipUtils } from "@thewaver/ss-components";

import { useLatest } from "../../../Utils/refUtils";

/** The React side of `TooltipUtils`: what a control with tooltips on its items needs from them. */
export namespace TooltipReactUtils {
    /**
     * Keeps an item counted as hovered while the pointer is on that item's own tooltip.
     *
     * A control that marks the hovered item clears the mark when the pointer leaves the control, and an item's
     * tooltip is drawn outside it — so crossing from the item onto its tooltip would clear the mark while the tooltip
     * is still up for that item. React carries that crossing to the control in one of two ways. A tooltip drawn
     * elsewhere, as a shared one is, makes it a leave: hand `handlePointerLeave` the control's `pointerleave` in place
     * of clearing directly, and a leave onto the hovered item's showing tooltip keeps the mark, `onLeave` running once
     * the pointer moves off the tooltip to anywhere but back into the control. A tooltip drawn by the item itself is
     * portalled from inside the control, so React reports the crossing as a `pointerover` reaching the control from
     * the tooltip instead: the control's own `pointerover` handling is skipped while `getIsOnTooltip` says the target
     * is in that tooltip, and the leave the pointer makes off it later goes through `handlePointerLeave` like any
     * other. Any other leave runs `onLeave` at once.
     *
     * The tooltip counts only while the item is described by it, which is only while it is showing for that item —
     * see `TooltipUtils.findDescribingTooltip`.
     *
     * @param hoveredAnchor The element of the item marked as hovered in this render, or `undefined` when none is.
     * @param onLeave Clears the hovered mark. The latest render's is the one called.
     * @returns `handlePointerLeave`, for the control's `pointerleave`, which reads the control off the event's
     * `currentTarget`; and `getIsOnTooltip`, which tells whether a `pointerover`'s target is in the hovered item's
     * showing tooltip.
     */
    export const useHoverHold = (hoveredAnchor: HTMLElement | undefined, onLeave: () => void) => {
        const latestOnLeave = useLatest(onLeave);
        const [hold, setHold] = useState<{ tooltip: HTMLElement; root: HTMLElement }>();

        useEffect(() => {
            if (!hold) return;

            return TooltipUtils.observePointerExit(hold.tooltip, hold.root, (isBackInRoot) => {
                setHold(undefined);

                if (!isBackInRoot) latestOnLeave.current();
            });
        }, [hold, latestOnLeave]);

        const handlePointerLeave = (e: PointerEvent<HTMLElement>) => {
            const tooltip = TooltipUtils.findDescribingTooltip(hoveredAnchor, e.relatedTarget);

            if (tooltip) {
                setHold({ tooltip, root: e.currentTarget });

                return;
            }

            onLeave();
        };

        const getIsOnTooltip = (target: EventTarget | null) =>
            TooltipUtils.findDescribingTooltip(hoveredAnchor, target) !== undefined;

        return { handlePointerLeave, getIsOnTooltip };
    };
}
