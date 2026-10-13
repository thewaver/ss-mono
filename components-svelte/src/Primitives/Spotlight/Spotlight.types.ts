import type { Snippet } from "svelte";

import type {
    AnchorPlacement,
    BaseSpotlightGuideProps,
    BaseSpotlightHintProps,
    BaseSpotlightProps,
} from "@thewaver/ss-components";

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

export type SpotlightProps = SpotlightState & SpotlightSlots & Partial<SpotlightPopupSlot> & BaseSpotlightProps;

export type SpotlightHintProps = SpotlightState & SpotlightSlots & BaseSpotlightHintProps;

export type SpotlightPromptProps = SpotlightState & SpotlightSlots & BaseSpotlightHintProps;

export type SpotlightGuideProps = SpotlightState & SpotlightSlots & SpotlightPopupSlot & BaseSpotlightGuideProps;
