import { type MaybeRefOrGetter, type Ref, onScopeDispose, toValue } from "vue";

import { type HoverIntentDelayGroup, HoverIntentUtils } from "@thewaver/ss-components";

import { watchAfterRender } from "../../Utils/effectUtils";

/** The Vue side of `HoverIntentUtils`: a panel's open state driven from two elements. */
export namespace HoverIntentVueUtils {
    /**
     * Drives a panel's open state from the pointer over its anchor and over the panel itself.
     *
     * `HoverIntentUtils.create` with its elements followed as they change, so either may arrive late or change, and
     * every close recorded in the delay group, an unmount while showing included. Every option is read when it is
     * needed, so the current ones are always the ones used.
     *
     * Must run inside a component's `setup`.
     *
     * @param anchorRef The element the pointer rests on to open the panel.
     * @param shown The panel's open state, read and written.
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
        anchorRef: MaybeRefOrGetter<HTMLElement | null | undefined>,
        shown: Ref<boolean>,
        defs: {
            delayGroup: HoverIntentDelayGroup;
            panelRef: MaybeRefOrGetter<HTMLElement | null | undefined>;
            hoverShowDelayMs: MaybeRefOrGetter<number>;
            skipDelayWindowMs: MaybeRefOrGetter<number>;
            focusShowDelayMs?: MaybeRefOrGetter<number | undefined>;
            isHeld?: () => boolean;
            isHiddenOnAnchorBlur?: MaybeRefOrGetter<boolean | undefined>;
            isTouchIgnored?: MaybeRefOrGetter<boolean | undefined>;
        },
    ) => {
        const controller = HoverIntentUtils.create(
            [
                () => shown.value,
                (value) => {
                    shown.value = value;
                },
            ],
            {
                delayGroup: defs.delayGroup,
                getHoverShowDelayMs: () => toValue(defs.hoverShowDelayMs),
                getSkipDelayWindowMs: () => toValue(defs.skipDelayWindowMs),
                get getFocusShowDelayMs() {
                    const focusShowDelayMs = toValue(defs.focusShowDelayMs);

                    return focusShowDelayMs === undefined ? undefined : () => focusShowDelayMs;
                },
                getIsHeld: () => defs.isHeld?.() ?? false,
                get isHiddenOnAnchorBlur() {
                    return toValue(defs.isHiddenOnAnchorBlur);
                },
                get isTouchIgnored() {
                    return toValue(defs.isTouchIgnored);
                },
            },
        );

        watchAfterRender([shown], ([isShown]) => controller.reportShown(isShown));

        onScopeDispose(controller.stop);

        watchAfterRender([() => toValue(anchorRef)], ([anchor]) =>
            anchor ? controller.observeAnchor(anchor) : undefined,
        );

        watchAfterRender([() => toValue(defs.panelRef)], ([panel]) =>
            panel ? controller.observePanel(panel) : undefined,
        );

        return { getIsPointerInside: controller.getIsPointerInside, cancel: controller.cancel };
    };
}
