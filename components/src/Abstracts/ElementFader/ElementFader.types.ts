import type { Store } from "@thewaver/ss-utils";

export type ElementFaderState = {
    isVisible: boolean;
    transitionTarget: 0 | 1;
    hasTransitionFinished: boolean;
};

export type ElementFaderOpts = {
    getTransitionDurationMs: () => number;
    getRef?: () => HTMLElement | undefined;
    onShow?: () => void;
    onHide?: () => void;
};

export type ElementFader = Store<ElementFaderState> & {
    show: () => void;
    hide: () => void;
    cancel: () => void;
};
