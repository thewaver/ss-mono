import type { Snippet } from "svelte";

import type { AnchorPlacement, SpotlightCbs, SpotlightMode, SpotlightPopupState } from "@thewaver/ss-components";

export type { SpotlightCbs, SpotlightPopupState };

export type SpotlightRenderer = Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number]>;

export type SpotlightOverlayRenderer = Snippet<
    [visibilityTarget: 0 | 1, transitionDurationMs: number, maskStyle: string]
>;

export type SpotlightState = {
    /**
     * Whether the spotlight is showing. Bind it with `bind:visibility`; it is the only thing that shows or hides it,
     * and the spotlight writes `false` when it is dismissed.
     */
    visibility: boolean;
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
     * Draws the cover over everything that is not lit. It is handed the mask that cuts the hole, as a style to put on
     * whatever paints the cover.
     */
    renderOverlay: SpotlightOverlayRenderer;
};

export type SpotlightPopupSlot = {
    /** Draws the popup shown beside the lit element. The fade is handed in rather than applied. */
    renderPopup: Snippet<[visibilityTarget: 0 | 1, transitionDurationMs: number, placement: AnchorPlacement]>;
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
