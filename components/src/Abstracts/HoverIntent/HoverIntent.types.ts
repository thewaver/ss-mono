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

export type HoverIntentControllerDefs = {
    delayGroup: HoverIntentDelayGroup;
    getHoverShowDelayMs: () => number;
    getSkipDelayWindowMs: () => number;
    getFocusShowDelayMs?: () => number;
    getIsHeld?: () => boolean;
    isHiddenOnAnchorBlur?: boolean;
    isTouchIgnored?: boolean;
};

export type HoverIntentDefs = HoverIntentControllerDefs & {
    getPanelRef: () => HTMLElement | undefined;
};

export type HoverIntentHandle = {
    getIsPointerInside: () => boolean;
    cancel: () => void;
};

export type HoverIntentController = HoverIntentHandle & {
    observeAnchor: (element: HTMLElement) => () => void;
    observePanel: (element: HTMLElement) => () => void;
    reportShown: (isShown: boolean) => void;
    stop: () => void;
};
