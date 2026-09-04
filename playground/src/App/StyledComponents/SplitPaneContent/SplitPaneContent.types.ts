import type { AccessorProps, InteractionFlags, SplitPaneGutterFlags } from "@thewaver/ss-components";

export type SplitPaneGutterProps = AccessorProps<{
    flags: InteractionFlags<SplitPaneGutterFlags>;
    dir: "row" | "column";
}>;

export type SplitPaneCompareSide = "start" | "end";

export type SplitPaneCompareProps = AccessorProps<{
    side: SplitPaneCompareSide;
    src: string;
    alt: string;
}>;
