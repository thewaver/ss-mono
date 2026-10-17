import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = {
    offset: Point2d;
    transitionDurationMs: number;
    focusShowDelayMs: number;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    visibility: readonly [boolean, (isVisible: boolean) => void];
    following: readonly [boolean, (isFollowing: boolean) => void];
};
