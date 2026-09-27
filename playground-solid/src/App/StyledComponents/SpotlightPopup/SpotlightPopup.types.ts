import type { AccessorProps } from "@thewaver/ss-components-solid";

export type SpotlightPopupProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    title: string;
}>;
