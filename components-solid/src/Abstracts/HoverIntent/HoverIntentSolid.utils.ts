import { createEffect, onCleanup } from "solid-js";

import { type HoverIntentDefs, type HoverIntentHandle, HoverIntentUtils } from "@thewaver/ss-components";

import type { SignalPair } from "../../Utils/typeUtils";

/** The Solid side of {@link HoverIntentUtils}: a panel's open state driven from two element accessors. */
export namespace HoverIntentSolidUtils {
    /**
     * Drives a panel's open state from the pointer over its anchor and over the panel itself.
     *
     * {@link HoverIntentUtils.create} with its elements and its open state followed through accessors: the
     * listeners follow the two refs, so either may arrive late or change, every close is recorded in the delay
     * group, and so is an unmount while showing.
     *
     * Must run inside a component, since it creates effects and cleans up with its owner.
     *
     * @param getAnchorRef The element the pointer rests on to open the panel.
     * @param visibilitySignal The panel's open state, read and written.
     * @param defs What {@link HoverIntentUtils.create} takes, and `getPanelRef`, the panel's own element, whose
     * hover keeps it open.
     * @returns Whether the pointer is over the anchor or the panel right now, and a way to drop a pending open.
     */
    export const create = (
        getAnchorRef: () => HTMLElement | undefined,
        visibilitySignal: SignalPair<boolean>,
        defs: HoverIntentDefs,
    ): HoverIntentHandle => {
        const controller = HoverIntentUtils.create(visibilitySignal, defs);

        createEffect(() => controller.reportShown(visibilitySignal[0]()));

        onCleanup(controller.stop);

        createEffect(() => {
            const anchorRef = getAnchorRef();

            if (!anchorRef) return;

            onCleanup(controller.observeAnchor(anchorRef));
        });

        createEffect(() => {
            const panelRef = defs.getPanelRef();

            if (!panelRef) return;

            onCleanup(controller.observePanel(panelRef));
        });

        return { getIsPointerInside: controller.getIsPointerInside, cancel: controller.cancel };
    };
}
