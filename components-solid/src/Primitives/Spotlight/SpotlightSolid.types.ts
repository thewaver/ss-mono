import type { JSX } from "solid-js";

import type { AnchorPlacement, SpotlightCbs, SpotlightMode, SpotlightPopupState } from "@thewaver/ss-components";

import type { AccessorProps, SignalSource } from "../../Utils/typeUtils";

export type SpotlightRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
) => JSX.Element;

export type SpotlightOverlayRenderer = (
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getMaskStyle: () => JSX.CSSProperties,
) => JSX.Element;

export type SpotlightState = {
    /** Whether the spotlight is showing. It is the only thing that shows or hides it. */
    visibilitySignal: SignalSource<boolean>;
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
    /** Draws the cover over everything that is not lit. */
    renderOverlay: SpotlightOverlayRenderer;
};

export type SpotlightPopupSlot = {
    /** Draws the popup shown beside the lit element. The fade is handed in rather than applied. */
    renderPopup: (
        getVisibilityTarget: () => 0 | 1,
        getTransitionDurationMs: () => number,
        getPlacement: () => AnchorPlacement,
    ) => JSX.Element;
};

export type SpotlightProps = AccessorProps<
    SpotlightState &
        SpotlightCbs &
        SpotlightSlots &
        SpotlightPopupState & {
            /**
             * Whether the spotlight only lights an element or also blocks everything else, which is the
             * difference between pointing something out and insisting on it.
             */
            mode: SpotlightMode;
        } & Partial<SpotlightPopupSlot>
>;

export type SpotlightHintProps = AccessorProps<SpotlightState & SpotlightCbs & SpotlightSlots>;

export type SpotlightPromptProps = AccessorProps<SpotlightState & SpotlightCbs & SpotlightSlots>;

export type SpotlightGuideProps = AccessorProps<
    SpotlightState & SpotlightCbs & SpotlightSlots & SpotlightPopupState & SpotlightPopupSlot
>;
