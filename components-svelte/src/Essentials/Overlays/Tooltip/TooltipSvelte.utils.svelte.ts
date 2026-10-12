import { untrack } from "svelte";

import { TooltipUtils } from "@thewaver/ss-components";

/** The Svelte side of {@link TooltipUtils}: what a control with tooltips on its items needs from them. */
export namespace TooltipSvelteUtils {
    /**
     * Keeps an item counted as hovered while the pointer is on that item's own tooltip.
     *
     * A control that marks the hovered item clears the mark when the pointer leaves the control, and an item's
     * tooltip is drawn outside it — so crossing from the item onto its tooltip would clear the mark while the tooltip
     * is still up for that item. Hand the returned function the control's `pointerleave` in place of clearing
     * directly: a leave onto the hovered item's showing tooltip keeps the mark, and `onLeave` runs once the pointer
     * moves off the tooltip to anywhere but back into the control. Any other leave runs `onLeave` at once.
     *
     * Must run while a component is being set up, since it creates an effect torn down with the component.
     *
     * @param getHoveredAnchor The element of the item marked as hovered, or `undefined` when none is.
     * @param onLeave Clears the hovered mark.
     * @returns The handler for the control's `pointerleave`. The control is read off the event's `currentTarget`.
     */
    export const createHoverHold = (getHoveredAnchor: () => HTMLElement | undefined, onLeave: () => void) => {
        let hold = $state.raw<{ tooltip: HTMLElement; root: HTMLElement }>();

        $effect(() => {
            const current = hold;

            if (!current) return;

            return untrack(() =>
                TooltipUtils.observePointerExit(current.tooltip, current.root, (isBackInRoot) => {
                    hold = undefined;

                    if (!isBackInRoot) onLeave();
                }),
            );
        });

        return (e: PointerEvent) => {
            const tooltip = TooltipUtils.findDescribingTooltip(getHoveredAnchor(), e.relatedTarget);

            if (tooltip && e.currentTarget instanceof HTMLElement) {
                hold = { tooltip, root: e.currentTarget };

                return;
            }

            onLeave();
        };
    };
}
