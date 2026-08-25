import type { AccessorProps, AnchorPlacement } from "@thewaver/ss-components";

export type PopoverSurfaceProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    placement: AnchorPlacement;
}>;
