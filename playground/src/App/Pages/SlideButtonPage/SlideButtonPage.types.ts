import type { NavigatorDirection, SlideButtonMode, SlideButtonOrientation } from "@thewaver/ss-components";

export type BaseSlideButtonDocsExampleValues = {
    mode: SlideButtonMode;
    completionRatio: number;
    holdDurationMs: number;
    isDisabled: boolean;
    hasError: boolean;
};

export type BaseSlideButtonDirectionsDocsExampleValues = {
    orientation: SlideButtonOrientation;
    direction: NavigatorDirection;
};
