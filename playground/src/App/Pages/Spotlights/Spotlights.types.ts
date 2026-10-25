import type { AnchorPlacement } from "@thewaver/ss-components";
import type { Point2d } from "@thewaver/ss-utils";

export type BaseSpotlightBasicDocsExampleValues = {
    padding: number;
    transitionDurationMs: number;
};

export type BaseSpotlightGuideBasicDocsExampleValues = BaseSpotlightBasicDocsExampleValues & {
    popupPlacement: AnchorPlacement;
    popupOffset: Point2d;
};
