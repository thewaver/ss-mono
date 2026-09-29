import type { Store } from "@thewaver/ss-utils";

export type FrameRate = {
    current: number;
    average: number;
};

export type FrameRateMonitor = Store<FrameRate> & {
    observe: () => () => void;
};
