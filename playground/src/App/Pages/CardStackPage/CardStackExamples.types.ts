import type { CardStackPileSide } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

export type BaseCardStackDeckExampleValues = {
    isDisabled: boolean;
    commitRatio: number;
    transitionDurationMs: number;
    mountedCount: number;
    cardGap: number;
    funnelRatio: number;
    pileSide: CardStackPileSide;
};

export type BaseCardStackDeckExampleCbs = {
    onSend: (direction: SwipeDirection, card: string) => void;
    onEmpty: () => void;
    onDeal: () => void;
    onRecall: () => void;
};

export type BaseCardStackDeckExampleProps = BaseCardStackDeckExampleValues & BaseCardStackDeckExampleCbs;

export type BaseCardStackEndlessExampleValues = BaseCardStackDeckExampleValues;

export type BaseCardStackEndlessExampleCbs = {
    onSend: (direction: SwipeDirection, card: string) => void;
    onLoad: (count: number) => void;
};

export type BaseCardStackEndlessExampleProps = BaseCardStackEndlessExampleValues & BaseCardStackEndlessExampleCbs;
