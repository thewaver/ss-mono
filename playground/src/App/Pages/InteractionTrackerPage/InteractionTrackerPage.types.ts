import type { InteractionDragEndReason, InteractionDragRatio, InteractionFlags } from "@thewaver/ss-components";
import type { SwipeDirection } from "@thewaver/ss-utils";

export type InteractionFlagsExampleProps = {
    isDisabled: () => boolean;
    isReachable: () => boolean;
    onFlagsChange: (flags: InteractionFlags) => void;
};

export type InteractionDragExampleProps = {
    isDisabled: () => boolean;
    onDrag: (ratio: InteractionDragRatio) => void;
    onDragEnd: (reason: InteractionDragEndReason) => void;
};

export type InteractionSwipeExampleProps = {
    isDisabled: () => boolean;
    commitRatio: () => number;
    onSwipe: (progressRatio: number) => void;
    onSwipeEnd: (direction: SwipeDirection | undefined) => void;
};
