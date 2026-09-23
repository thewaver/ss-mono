import { createEffect, onCleanup } from "solid-js";

import type { Point2d } from "@thewaver/ss-utils";

import type { SignalPair } from "../../Utils/typeUtils";
import type { AnchorPlacement } from "../Anchor/Anchor.types";
import { AnchorUtils } from "../Anchor/Anchor.utils";
import { FocusManagerUtils } from "../FocusManager/FocusManager.utils";
import type {
    HoverIntentBridgeInsets,
    HoverIntentDefs,
    HoverIntentDelayGroup,
    HoverIntentHandle,
    HoverIntentShowDelayDefs,
} from "./HoverIntent.types";

/** The width of a side that needs no bridge. */
const NO_GAP = 0;

/** The pointer type a touch screen reports, which never hovers. */
const TOUCH_POINTER_TYPE = "touch";

/** A gap from an offset, where a missing or negative offset opens no gap at all. */
const toGap = (value: number | undefined) => Math.max(value ?? NO_GAP, NO_GAP);

/** Whether a pointer leaving one element is arriving in another, read off the event rather than timed. */
const getIsMovingInto = (e: MouseEvent, element: HTMLElement | undefined) =>
    e.relatedTarget instanceof Node && element !== undefined && element.contains(e.relatedTarget);

/**
 * Opens a floating panel when the pointer rests on its anchor, and keeps it open while the pointer crosses
 * from one to the other.
 *
 * It is the part of a tooltip that is not about being a tooltip: the wait before showing, a window after
 * one panel closes in which the next opens at once, the gap between anchor and panel bridged so the pointer
 * can cross it, and a leave that reads where the pointer went instead of starting a timer. Where the panel
 * sits is not its business — `AnchorUtils.createPortalPosition` answers that — and neither is what the panel
 * is announced as.
 */
export namespace HoverIntentUtils {
    /**
     * Makes a record of when a panel in one family last closed, for {@link create} to share.
     *
     * Every panel handed the same group shares one skip window, so once a reader has waited for one, moving to
     * its neighbor opens the next at once. Declare one at module level per family of panels — all tooltips, all
     * hover cards — so that families do not skip each other's wait.
     *
     * @returns A group that has never seen a close, so the first hover always waits.
     */
    export const createDelayGroup = (): HoverIntentDelayGroup => ({ lastClosedAtMs: Number.NEGATIVE_INFINITY });

    /**
     * How long a hover arriving now has to wait before the panel shows.
     *
     * No wait when the panel is already showing, when the delay is zero or less, or when the last close in its
     * group was less than the skip window ago; otherwise the whole delay.
     *
     * @param defs.isShown Whether the panel is already showing.
     * @param defs.hoverShowDelayMs The wait the panel asks for.
     * @param defs.skipDelayWindowMs How soon after a close in the group a hover skips the wait.
     * @param defs.msSinceLastClose How long ago the group last closed, which is infinite when it never has.
     * @returns The wait in milliseconds, `0` for at once.
     */
    export const computeShowDelayMs = (defs: HoverIntentShowDelayDefs) =>
        defs.isShown || defs.hoverShowDelayMs <= 0 || defs.msSinceLastClose < defs.skipDelayWindowMs
            ? 0
            : defs.hoverShowDelayMs;

    /**
     * How far a panel's hit region has to reach back towards its anchor to cover the gap an offset opens.
     *
     * Only the side facing the anchor is bridged, and only for an `out` placement; an `in` or `center`
     * placement overlaps its anchor and gets nothing. Hand the result to an absolutely positioned element or
     * pseudo-element on the panel as negative insets: it changes nothing measured and nothing painted, and the
     * pointer resting in the gap is resting on the panel.
     *
     * @param placement The placement the panel actually ended up at, after any fallback.
     * @param offset The offset holding it clear of the anchor. A negative or missing axis bridges nothing.
     * @returns The width of the bridge on each side, in pixels, never negative.
     */
    export const computeBridgeInsets = (
        placement: AnchorPlacement,
        offset: Point2d | undefined,
    ): HoverIntentBridgeInsets => {
        const gapX = toGap(offset?.x);
        const gapY = toGap(offset?.y);
        const hKind = AnchorUtils.getHBandKind(placement.x);
        const vKind = AnchorUtils.getVBandKind(placement.y);

        return {
            top: vKind === "after" ? gapY : NO_GAP,
            right: hKind === "before" ? gapX : NO_GAP,
            bottom: vKind === "before" ? gapY : NO_GAP,
            left: hKind === "after" ? gapX : NO_GAP,
        };
    };

    /**
     * Drives a panel's open state from the pointer over its anchor and over the panel itself.
     *
     * Resting on the anchor opens the panel after the hover delay, or at once inside the group's skip window.
     * Arriving on the panel opens it at once, so a pointer that crosses during a closing fade keeps it. Leaving
     * either closes it, unless the pointer left for the other, which is read from the event rather than
     * guessed with a grace period. With a focus delay, a keyboard focus on the anchor opens it after that delay
     * too; a focus from a pointer press, or one that a closing layer is putting back, is ignored. The listeners
     * follow the two refs, so either may arrive late or change.
     *
     * The open state stays the caller's: this writes `true` and `false` to it and never keeps a copy, so a
     * panel closed from elsewhere — by Escape, a press outside, a consumer's own button — is simply closed.
     * Every close from open to shut is recorded in the delay group, whoever caused it, and so is an unmount
     * while showing.
     *
     * Must run inside a component, since it creates effects and cleans up with its owner.
     *
     * @param getAnchorRef The element the pointer rests on to open the panel.
     * @param visibilitySignal The panel's open state, read and written.
     * @param defs.delayGroup The family whose skip window this panel shares; see {@link createDelayGroup}.
     * @param defs.getPanelRef The panel's own element, whose hover keeps it open.
     * @param defs.getHoverShowDelayMs How long the pointer has to rest on the anchor.
     * @param defs.getSkipDelayWindowMs How soon after a close in the group a hover skips the wait.
     * @param defs.getFocusShowDelayMs How long a keyboard focus has to rest on the anchor. Without it, focus
     * opens nothing.
     * @param defs.getIsHeld Read when the pointer leaves; while it answers `true` the leave closes nothing, for a
     * panel that should stay open while focus is inside it.
     * @param defs.isHiddenOnAnchorBlur Closes the panel when the anchor loses focus. Off by default, for a panel
     * focus can move into.
     * @param defs.isTouchIgnored Treats a touch as no hover at all. A touch screen reports a tap as the pointer
     * arriving and staying, so without this a tap opens the panel after the delay; switch it on where a press
     * does something of its own.
     * @returns Whether the pointer is over the anchor or the panel right now, and a way to drop a pending open.
     */
    export const create = (
        getAnchorRef: () => HTMLElement | undefined,
        visibilitySignal: SignalPair<boolean>,
        defs: HoverIntentDefs,
    ): HoverIntentHandle => {
        const [getIsShown, setIsShown] = visibilitySignal;

        let showTimeout: ReturnType<typeof setTimeout> | undefined;
        let isOverAnchor = false;
        let isOverPanel = false;
        let lastPointerType: string | undefined;

        const cancel = () => {
            clearTimeout(showTimeout);
        };

        const hide = () => {
            cancel();
            setIsShown(false);
        };

        const getIsTouch = () => defs.isTouchIgnored === true && lastPointerType === TOUCH_POINTER_TYPE;

        const handlePointerOver = (e: PointerEvent) => {
            lastPointerType = e.pointerType;
        };

        const handleAnchorMouseEnter = () => {
            if (getIsTouch()) return;

            isOverAnchor = true;
            cancel();

            const delayMs = computeShowDelayMs({
                isShown: getIsShown(),
                hoverShowDelayMs: defs.getHoverShowDelayMs(),
                skipDelayWindowMs: defs.getSkipDelayWindowMs(),
                msSinceLastClose: performance.now() - defs.delayGroup.lastClosedAtMs,
            });

            if (delayMs <= 0) {
                setIsShown(true);

                return;
            }

            showTimeout = setTimeout(() => {
                setIsShown(true);
            }, delayMs);
        };

        const handlePanelMouseEnter = () => {
            if (getIsTouch()) return;

            isOverPanel = true;
            cancel();
            setIsShown(true);
        };

        const handleAnchorMouseLeave = (e: MouseEvent) => {
            if (getIsTouch()) return;

            isOverAnchor = false;

            if (getIsMovingInto(e, defs.getPanelRef())) return;
            if (defs.getIsHeld?.()) {
                cancel();

                return;
            }

            hide();
        };

        const handlePanelMouseLeave = (e: MouseEvent) => {
            if (getIsTouch()) return;

            isOverPanel = false;

            if (getIsMovingInto(e, getAnchorRef())) return;
            if (defs.getIsHeld?.()) {
                cancel();

                return;
            }

            hide();
        };

        const handleAnchorFocus = () => {
            const anchorRef = getAnchorRef();

            if (!defs.getFocusShowDelayMs) return;
            if (FocusManagerUtils.getIsRestoringFocus()) return;
            if (anchorRef && !anchorRef.matches(":focus-visible")) return;

            cancel();
            showTimeout = setTimeout(() => {
                setIsShown(true);
            }, defs.getFocusShowDelayMs());
        };

        const handleAnchorBlur = () => {
            cancel();

            if (defs.isHiddenOnAnchorBlur) setIsShown(false);
        };

        createEffect<boolean>((wasShown) => {
            const isShown = getIsShown();

            if (wasShown && !isShown) defs.delayGroup.lastClosedAtMs = performance.now();

            return isShown;
        }, false);

        onCleanup(() => {
            cancel();

            if (getIsShown()) defs.delayGroup.lastClosedAtMs = performance.now();
        });

        createEffect(() => {
            const anchorRef = getAnchorRef();

            if (!anchorRef) return;

            anchorRef.addEventListener("pointerover", handlePointerOver);
            anchorRef.addEventListener("mouseenter", handleAnchorMouseEnter);
            anchorRef.addEventListener("mouseleave", handleAnchorMouseLeave);
            anchorRef.addEventListener("focus", handleAnchorFocus);
            anchorRef.addEventListener("blur", handleAnchorBlur);

            onCleanup(() => {
                isOverAnchor = false;

                anchorRef.removeEventListener("pointerover", handlePointerOver);
                anchorRef.removeEventListener("mouseenter", handleAnchorMouseEnter);
                anchorRef.removeEventListener("mouseleave", handleAnchorMouseLeave);
                anchorRef.removeEventListener("focus", handleAnchorFocus);
                anchorRef.removeEventListener("blur", handleAnchorBlur);
            });
        });

        createEffect(() => {
            const panelRef = defs.getPanelRef();

            if (!panelRef) return;

            panelRef.addEventListener("pointerover", handlePointerOver);
            panelRef.addEventListener("mouseenter", handlePanelMouseEnter);
            panelRef.addEventListener("mouseleave", handlePanelMouseLeave);

            onCleanup(() => {
                isOverPanel = false;

                panelRef.removeEventListener("pointerover", handlePointerOver);
                panelRef.removeEventListener("mouseenter", handlePanelMouseEnter);
                panelRef.removeEventListener("mouseleave", handlePanelMouseLeave);
            });
        });

        return {
            getIsPointerInside: () => isOverAnchor || isOverPanel,
            cancel,
        };
    };
}
