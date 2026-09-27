import type { AccessorProps, OdometerReels } from "@thewaver/ss-components-solid";

export type OdometerExampleProps = AccessorProps<{
    text: string;
    turnDurationMs: number;
    cascadeDelayMs: number;
}>;

export type OdometerReelsExampleProps = AccessorProps<{
    text: string;
    reelKey: OdometerReels.SampleKey;
}>;
