export type HoverIntentDelayGroup = {
    lastClosedAtMs: number;
};

export type HoverIntentBridgeInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};

export type HoverIntentShowDelayDefs = {
    isShown: boolean;
    hoverShowDelayMs: number;
    skipDelayWindowMs: number;
    msSinceLastClose: number;
};

export type HoverIntentDefs = {
    delayGroup: HoverIntentDelayGroup;
    getPanelRef: () => HTMLElement | undefined;
    getHoverShowDelayMs: () => number;
    getSkipDelayWindowMs: () => number;
    getFocusShowDelayMs?: () => number;
    getIsHeld?: () => boolean;
    isHiddenOnAnchorBlur?: boolean;
    isTouchIgnored?: boolean;
};

export type HoverIntentHandle = {
    getIsPointerInside: () => boolean;
    cancel: () => void;
};
