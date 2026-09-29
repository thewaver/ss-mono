import type { InteractionFlags, SplitPaneGutterFlags } from "@thewaver/ss-components-react";

export type SplitPaneGutterProps = {
    flags: InteractionFlags<SplitPaneGutterFlags>;
    orientation: "horizontal" | "vertical";
};

export type SplitPaneCompareSide = "start" | "end";

export type SplitPaneCompareProps = {
    side: SplitPaneCompareSide;
    src: string;
    alt: string;
};
