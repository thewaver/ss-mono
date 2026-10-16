import type { SVGColorMixing } from "@thewaver/ss-components";

export type BaseRGBSplitterExampleValues = {
    isDisabled: boolean;
    activeRangePx: number;
    smoothingMs: number;
    splitRangePx: number;
    maxOffsetPx: number;
    colorMixing: SVGColorMixing | undefined;
};

export type BaseRGBSplitterExampleProps = BaseRGBSplitterExampleValues;
