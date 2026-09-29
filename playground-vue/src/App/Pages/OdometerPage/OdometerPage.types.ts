import type { OdometerReels } from "@thewaver/ss-components-vue";

export type OdometerExampleProps = {
    text: string;
    turnDurationMs: number;
    cascadeDelayMs: number;
};

export type OdometerReelsExampleProps = {
    text: string;
    reelKey: OdometerReels.SampleKey;
};
