import type { CardStackPileSide } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

export type CardStackDeckExampleProps = {
    isDisabled: () => boolean;
    commitRatio: () => number;
    transitionDurationMs: () => number;
    mountedCount: () => number;
    cardGap: () => number;
    funnelRatio: () => number;
    pileSide: () => CardStackPileSide;
    onSend: (direction: SwipeDirection, card: string) => void;
    onEmpty: () => void;
    onDeal: () => void;
    onRecall: () => void;
};

export type CardStackEndlessExampleProps = Omit<CardStackDeckExampleProps, "onEmpty" | "onDeal" | "onRecall"> & {
    onLoad: (count: number) => void;
};
