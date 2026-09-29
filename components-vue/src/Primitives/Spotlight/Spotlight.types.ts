import type { VNodeChild } from "vue";

import type { AnchorPlacement, SpotlightCbs, SpotlightMode, SpotlightPopupState } from "@thewaver/ss-components";

export type { SpotlightCbs, SpotlightPopupState };

export type SpotlightRenderer = (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;

export type SpotlightOverlayRenderer = (props: {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    maskStyle: Record<string, string>;
}) => VNodeChild;

export type SpotlightState = {
    /** Whether the spotlight is showing. It is the only thing that shows or hides it. */
    "visibility": boolean;
    /**
     * Receives the spotlight's own request to hide — a dismissal key, or a press outside in hint mode — which is
     * what `v-model:visibility` binds.
     */
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    /** How much room is left around the element being lit, so the hole is not cut tight against it. */
    "padding"?: number;
    /** How long the spotlight takes to fade in and out, and to move from one element to the next. */
    "transitionDurationMs"?: number;
    /** The element being lit. Changing it moves the spotlight rather than restarting it. */
    "elementRef": HTMLElement | undefined;
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
    renderPopup: (props: {
        visibilityTarget: 0 | 1;
        transitionDurationMs: number;
        placement: AnchorPlacement;
    }) => VNodeChild;
};

export type SpotlightProps = SpotlightState &
    SpotlightCbs &
    SpotlightPopupState & {
        /**
         * Whether the spotlight only lights an element or also blocks everything else, which is the difference
         * between pointing something out and insisting on it.
         */
        mode: SpotlightMode;
    };

export type SpotlightHintProps = SpotlightState & SpotlightCbs;

export type SpotlightPromptProps = SpotlightState & SpotlightCbs;

export type SpotlightGuideProps = SpotlightState & SpotlightCbs & SpotlightPopupState;

export type SpotlightGuideSlots = SpotlightSlots & SpotlightPopupSlot;
