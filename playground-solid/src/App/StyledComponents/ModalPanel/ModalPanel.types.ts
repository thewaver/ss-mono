import type { AccessorProps } from "@thewaver/ss-components-solid";

export type ModalPanelProps = AccessorProps<{
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    padding?: string;
}>;

export type ModalHintProps = AccessorProps<{
    id?: string;
}>;
