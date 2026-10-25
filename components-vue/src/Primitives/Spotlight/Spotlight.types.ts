import type { VNodeChild } from "vue";

import type {
    AnchorPlacement,
    BaseSpotlightGuideProps,
    BaseSpotlightHintProps,
    BaseSpotlightProps,
} from "@thewaver/ss-components";

export type SpotlightRenderer = (props: { visibilityTarget: 0 | 1; transitionDurationMs: number }) => VNodeChild;

export type SpotlightOverlayRenderer = (props: {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    maskStyle: Record<string, string>;
}) => VNodeChild;

export type SpotlightState = {
    /**
     * Whether the spotlight is open. It is the only thing that opens or closes it. An open spotlight shows unless one
     * opened after it is open too; then it waits beneath, still open, and shows again once that one closes.
     */
    "visibility": boolean;
    /**
     * Receives the spotlight's own request to hide — a dismissal key, or a press outside in hint mode — which is
     * what `v-model:visibility` binds.
     */
    "onUpdate:visibility"?: (isVisible: boolean) => void;
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

export type SpotlightProps = SpotlightState & BaseSpotlightProps;

export type SpotlightHintProps = SpotlightState & BaseSpotlightHintProps;

export type SpotlightPromptProps = SpotlightState & BaseSpotlightHintProps;

export type SpotlightGuideProps = SpotlightState & BaseSpotlightGuideProps;

export type SpotlightGuideSlots = SpotlightSlots & SpotlightPopupSlot;
