import type { Point2d } from "@thewaver/ss-utils";

export type HoverCardExampleProps = {
    "offset": Point2d;
    "transitionDurationMs": number;
    "focusShowDelayMs": number;
    "hoverShowDelayMs": number;
    "skipDelayWindowMs": number;
    "visibility": boolean;
    "onUpdate:visibility"?: (isVisible: boolean) => void;
    "following": boolean;
    "onUpdate:following"?: (isFollowing: boolean) => void;
};
