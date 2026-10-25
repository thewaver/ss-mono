import type { CSSProperties, ReactNode } from "react";

import type {
    AnchorPlacement,
    BaseSpotlightGuideProps,
    BaseSpotlightHintProps,
    BaseSpotlightProps,
} from "@thewaver/ss-components";

export type SpotlightRenderer = (visibilityTarget: 0 | 1, transitionDurationMs: number) => ReactNode;

export type SpotlightOverlayRenderer = (
    visibilityTarget: 0 | 1,
    transitionDurationMs: number,
    maskStyle: CSSProperties,
) => ReactNode;

export type SpotlightState = {
    /**
     * Whether the spotlight is open, with its setter. It is the only thing that opens or closes it. An open spotlight
     * shows unless one opened after it is open too; then it waits beneath, still open, and shows again once that one
     * closes.
     */
    visibility: readonly [boolean, (isVisible: boolean) => void];
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

export type SpotlightProps = SpotlightState & SpotlightSlots & Partial<SpotlightPopupSlot> & BaseSpotlightProps;

export type SpotlightHintProps = SpotlightState & SpotlightSlots & BaseSpotlightHintProps;

export type SpotlightPromptProps = SpotlightState & SpotlightSlots & BaseSpotlightHintProps;

export type SpotlightGuideProps = SpotlightState & SpotlightSlots & SpotlightPopupSlot & BaseSpotlightGuideProps;
