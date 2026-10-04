import type { AccessorProps } from "@thewaver/ss-components-solid";

export type GlideFloaterProps = AccessorProps<{
    kind: "selection" | "highlight";
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;

export type GlideLabelProps = AccessorProps<{
    isSelected: boolean;
}>;
