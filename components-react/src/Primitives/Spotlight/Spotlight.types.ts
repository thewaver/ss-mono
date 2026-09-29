import type { CSSProperties, ReactNode } from "react";

import type { AnchorPlacement, SpotlightCbs, SpotlightMode, SpotlightPopupState } from "@thewaver/ss-components";

export type { SpotlightCbs, SpotlightPopupState };

export type SpotlightRenderer = (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;

export type SpotlightOverlayRenderer = (
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    maskStyle: CSSProperties,
) => ReactNode;

export type SpotlightState = {
    /** Whether the spotlight is showing, with its setter. It is the only thing that shows or hides it. */
    visibility: readonly [boolean, (isVisible: boolean) => void];
    /** How much room is left around the element being lit, so the hole is not cut tight against it. */
    padding?: number;
    /** How long the spotlight takes to fade in and out, and to move from one element to the next. */
    transitionDurationMs?: number;
    /** The element being lit. Changing it moves the spotlight rather than restarting it. */
    elementRef: HTMLElement | undefined;
};

export type SpotlightSlots = {
    /** Draws the lit area itself. */
    renderHighlight?: SpotlightRenderer;
    /**
     * Draws the cover over everything that is not lit. It is handed the mask that cuts the hole, as a style to spread
     * onto whatever paints the cover.
     */
    renderOverlay: SpotlightOverlayRenderer;
};

export type SpotlightPopupSlot = {
    /** Draws the popup shown beside the lit element. The fade is handed in rather than applied. */
    renderPopup: (visibilityTarget: 0 | 1, transitionDurationMs: number, placement: AnchorPlacement) => ReactNode;
};

export type SpotlightProps = SpotlightState &
    SpotlightCbs &
    SpotlightSlots &
    SpotlightPopupState & {
        /**
         * Whether the spotlight only lights an element or also blocks everything else, which is the difference
         * between pointing something out and insisting on it.
         */
        mode: SpotlightMode;
    } & Partial<SpotlightPopupSlot>;

export type SpotlightHintProps = SpotlightState & SpotlightCbs & SpotlightSlots;

export type SpotlightPromptProps = SpotlightState & SpotlightCbs & SpotlightSlots;

export type SpotlightGuideProps = SpotlightState &
    SpotlightCbs &
    SpotlightSlots &
    SpotlightPopupState &
    SpotlightPopupSlot;
