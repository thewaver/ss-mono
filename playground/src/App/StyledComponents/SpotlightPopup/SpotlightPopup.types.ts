import type { AccessorProps } from "@thewaver/ss-components";

export type SpotlightPopupProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    title: string;
}>;
