import type { AccessorProps, IcicleNode, SignalSource } from "@thewaver/ss-components";

export type IcicleExampleProps = AccessorProps<{
    columnCount: number;
    zoomDurationMs: number;
    focusSignal: SignalSource<IcicleNode<string>>;
}>;
