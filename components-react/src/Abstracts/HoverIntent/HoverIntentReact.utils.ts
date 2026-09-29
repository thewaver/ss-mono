import { type RefObject, useEffect, useState } from "react";

import { type HoverIntentDelayGroup, HoverIntentUtils } from "@thewaver/ss-components";

import { useElement, useLatest } from "../../Utils/refUtils";

/** The React side of `HoverIntentUtils`: a panel's open state driven from two refs. */
export namespace HoverIntentReactUtils {
    /**
     * Drives a panel's open state from the pointer over its anchor and over the panel itself.
     *
     * `HoverIntentUtils.create` with its elements followed through refs, so either may arrive late or change, and
     * every close recorded in the delay group, an unmount while showing included. Every option is read when it is
     * needed, so this render's are always the ones used.
     *
     * @param anchorRef The element the pointer rests on to open the panel.
     * @param shownState The panel's open state, and how to change it.
     * @param defs.delayGroup The family whose skip window this panel shares; see `HoverIntentUtils.createDelayGroup`.
     * @param defs.panelRef The panel's own element, whose hover keeps it open.
     * @param defs.hoverShowDelayMs How long the pointer has to rest on the anchor.
     * @param defs.skipDelayWindowMs How soon after a close in the group a hover skips the wait.
     * @param defs.focusShowDelayMs How long a keyboard focus has to rest on the anchor. Without it, focus opens
     * nothing.
     * @param defs.isHeld Read when the pointer leaves; while it answers `true` the leave closes nothing.
     * @param defs.isHiddenOnAnchorBlur Closes the panel when the anchor loses focus.
     * @param defs.isTouchIgnored Treats a touch as no hover at all.
     * @returns `getIsPointerInside` for whether the pointer is over the anchor or the panel right now, and `cancel`
     * to drop a pending open.
     */
    export const useHoverIntent = (
        anchorRef: RefObject<HTMLElement | null>,
        shownState: readonly [boolean, (value: boolean) => void],
        defs: {
            delayGroup: HoverIntentDelayGroup;
            panelRef: RefObject<HTMLElement | null>;
            hoverShowDelayMs: number;
            skipDelayWindowMs: number;
            focusShowDelayMs?: number;
            isHeld?: () => boolean;
            isHiddenOnAnchorBlur?: boolean;
            isTouchIgnored?: boolean;
        },
    ) => {
        const latest = useLatest({ shownState, ...defs });
        const anchor = useElement(anchorRef);
        const panel = useElement(defs.panelRef);

        const [controller] = useState(() =>
            HoverIntentUtils.create(
                [() => latest.current.shownState[0], (value) => latest.current.shownState[1](value)],
                {
                    delayGroup: defs.delayGroup,
                    getHoverShowDelayMs: () => latest.current.hoverShowDelayMs,
                    getSkipDelayWindowMs: () => latest.current.skipDelayWindowMs,
                    get getFocusShowDelayMs() {
                        const focusShowDelayMs = latest.current.focusShowDelayMs;

                        return focusShowDelayMs === undefined ? undefined : () => focusShowDelayMs;
                    },
                    getIsHeld: () => latest.current.isHeld?.() ?? false,
                    get isHiddenOnAnchorBlur() {
                        return latest.current.isHiddenOnAnchorBlur;
                    },
                    get isTouchIgnored() {
                        return latest.current.isTouchIgnored;
                    },
                },
            ),
        );

        useEffect(() => controller.reportShown(shownState[0]), [controller, shownState[0]]);

        useEffect(() => controller.stop, [controller]);

        useEffect(() => (anchor ? controller.observeAnchor(anchor) : undefined), [controller, anchor]);

        useEffect(() => (panel ? controller.observePanel(panel) : undefined), [controller, panel]);

        return { getIsPointerInside: controller.getIsPointerInside, cancel: controller.cancel };
    };
}
