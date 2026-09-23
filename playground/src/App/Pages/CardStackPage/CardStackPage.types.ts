import type { SwipeDirection } from "@thewaver/ss-utils";

export type CardStackDeckExampleProps = {
    isDisabled: () => boolean;
    commitRatio: () => number;
    transitionDurationMs: () => number;
    mountedCount: () => number;
    cardGap: () => number;
    funnelRatio: () => number;
    onSend: (direction: SwipeDirection, card: string) => void;
    onEmpty: () => void;
    onDeal: () => void;
    onRecall: () => void;
};

export type CardStackEndlessExampleProps = Omit<CardStackDeckExampleProps, "onEmpty" | "onDeal" | "onRecall"> & {
    onLoad: (count: number) => void;
};
