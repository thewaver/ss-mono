import type { AccessorProps, InteractionFlags, SplitPaneGutterFlags } from "@thewaver/ss-components-solid";

export type SplitPaneGutterProps = AccessorProps<{
    flags: InteractionFlags<SplitPaneGutterFlags>;
    orientation: "horizontal" | "vertical";
}>;

export type SplitPaneCompareSide = "start" | "end";

export type SplitPaneCompareProps = AccessorProps<{
    side: SplitPaneCompareSide;
    src: string;
    alt: string;
}>;
