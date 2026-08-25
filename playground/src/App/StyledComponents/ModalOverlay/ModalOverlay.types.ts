import type { AccessorProps } from "@thewaver/ss-components";

export type ModalOverlayProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
}>;
