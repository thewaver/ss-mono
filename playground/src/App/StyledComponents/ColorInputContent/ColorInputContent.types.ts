import type { AccessorProps, ColorInputFlags, InteractionFlags } from "@thewaver/ss-components";

export type ColorInputContentProps = AccessorProps<{
    flags: InteractionFlags<ColorInputFlags>;
    isCompact?: boolean;
}>;
