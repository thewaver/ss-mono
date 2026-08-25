import type { AccessorProps, InteractionFlags, SplitPaneGutterFlags } from "@thewaver/ss-components";

export type SplitPaneGutterProps = AccessorProps<{
    flags: InteractionFlags<SplitPaneGutterFlags>;
    dir: "row" | "column";
}>;
