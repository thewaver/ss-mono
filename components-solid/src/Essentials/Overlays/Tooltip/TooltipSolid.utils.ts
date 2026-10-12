import { createEffect, createSignal, onCleanup } from "solid-js";

import { TooltipUtils } from "@thewaver/ss-components";

/** The Solid side of {@link TooltipUtils}: what a control with tooltips on its items needs from them. */
export namespace TooltipSolidUtils {
    /**
     * Keeps an item counted as hovered while the pointer is on that item's own tooltip.
     *
     * A control that marks the hovered item clears the mark when the pointer leaves the control, and an item's
     * tooltip is drawn outside it — so crossing from the item onto its tooltip would clear the mark while the tooltip
     * is still up for that item. Hand `handlePointerLeave` the control's `pointerleave` in place of clearing
     * directly: a leave onto the hovered item's showing tooltip keeps the mark, and `onLeave` runs once the pointer
     * moves off the tooltip to anywhere but back into the control. Any other leave runs `onLeave` at once.
     *
     * A tooltip drawn by the item itself is portalled from inside the control, and Solid passes delegated events up
     * through a portal to where it was declared, so the pointer arriving on that tooltip also reaches the control as
     * a `pointerover` on no item. The control skips its own `pointerover` handling while `getIsOnTooltip` says the
     * target is in that tooltip. A shared tooltip is declared outside the control and never sends one.
     *
     * Must run inside a component, since it creates an effect and cleans up with its owner.
     *
     * @param getHoveredAnchor The element of the item marked as hovered, or `undefined` when none is.
     * @param onLeave Clears the hovered mark.
     * @returns `handlePointerLeave`, for the control's `pointerleave`, which reads the control off the event's
     * `currentTarget`; and `getIsOnTooltip`, which tells whether a `pointerover`'s target is in the hovered item's
     * showing tooltip.
     */
    export const createHoverHold = (getHoveredAnchor: () => HTMLElement | undefined, onLeave: () => void) => {
        const [getHold, setHold] = createSignal<{ tooltip: HTMLElement; root: HTMLElement }>();

        createEffect(() => {
            const hold = getHold();

            if (!hold) return;

            onCleanup(
                TooltipUtils.observePointerExit(hold.tooltip, hold.root, (isBackInRoot) => {
                    setHold(undefined);

                    if (!isBackInRoot) onLeave();
                }),
            );
        });

        const handlePointerLeave = (e: PointerEvent) => {
            const tooltip = TooltipUtils.findDescribingTooltip(getHoveredAnchor(), e.relatedTarget);

            if (tooltip && e.currentTarget instanceof HTMLElement) {
                setHold({ tooltip, root: e.currentTarget });

                return;
            }

            onLeave();
        };

        const getIsOnTooltip = (target: EventTarget | null) =>
            TooltipUtils.findDescribingTooltip(getHoveredAnchor(), target) !== undefined;

        return { handlePointerLeave, getIsOnTooltip };
    };
}
