import type { InteractionFlags, SplitPaneGutterFlags } from "@thewaver/ss-components";

export type BaseSplitPaneGutterValues = {
    flags: InteractionFlags<SplitPaneGutterFlags>;
    orientation: "horizontal" | "vertical";
};

export type BaseSplitPaneGutterProps = BaseSplitPaneGutterValues;

export type SplitPaneCompareSide = "start" | "end";

export type BaseSplitPaneCompareValues = {
    side: SplitPaneCompareSide;
    src: string;
    alt: string;
};

export type BaseSplitPaneCompareProps = BaseSplitPaneCompareValues;
