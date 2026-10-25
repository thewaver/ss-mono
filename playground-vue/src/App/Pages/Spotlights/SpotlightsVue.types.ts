import type {
    BaseSpotlightBasicDocsExampleValues,
    BaseSpotlightGuideBasicDocsExampleValues,
} from "@thewaver/ss-playground/App/Pages/Spotlights/Spotlights.types";

export type SpotlightOverlayProps = {
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    maskStyle: Record<string, string>;
};

export type SpotlightHighlightProps = {
    visibilityTarget: 0 | 1;
};

export type SpotlightBasicDocsExampleProps = BaseSpotlightBasicDocsExampleValues;

export type SpotlightGuideBasicDocsExampleProps = BaseSpotlightGuideBasicDocsExampleValues;
