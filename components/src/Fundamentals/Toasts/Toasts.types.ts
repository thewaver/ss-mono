import type { Accessor, JSX } from "solid-js";

import type { CSSMargin, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps, MaybeAccessor, SignalSource } from "../../Utils/typeUtils";

export type ToastsVerticalAlignment = "top" | "middle" | "bottom";

export type ToastsHorizontalAlignment = "left" | "center" | "right";

export type ToastsAlignment = `${ToastsVerticalAlignment}-${ToastsHorizontalAlignment}`;

export type ToastsDir = "column" | "column-reverse" | "row" | "row-reverse";

export type ToastsAriaLive = "polite" | "assertive";

export type ToastsOverflow = "dismiss-oldest" | "hold-newest";

export type ToastsStackAlignment = {
    justifyContent: "flex-start" | "center" | "flex-end";
    alignItems: "flex-start" | "center" | "flex-end";
};

export type Toast<T> = {
    id: string;
    value: T;
    durationMs?: number;
    ariaLive?: ToastsAriaLive;
    onShow?: () => void;
    onHide?: () => void;
};

export type ToastState = {
    index: number;
    count: number;
    isPaused: boolean;
    sizes: Size2d[];
};

export type ToastRenderer<T> = (
    getToast: Accessor<Toast<T>>,
    getVisibilityTarget: () => 0 | 1,
    getTransitionDurationMs: () => number,
    getState: () => ToastState,
) => JSX.Element;

export type ToastsItemProps<T> = AccessorProps<{
    index: number;
    count: number;
    isExiting: boolean;
    isPaused: boolean;
    transitionDurationMs: number;
    sizes: Size2d[];
    ref: (element: HTMLElement) => void;
    onElapse: () => void;
    onExitEnd: () => void;
}> & {
    toast: MaybeAccessor<Toast<T>>;
    renderToast: ToastRenderer<T>;
};

export type ToastsProps<T> = AccessorProps<{
    ariaLabel: string;
    ariaLive?: ToastsAriaLive;
    hotkey?: string;
    alignment?: ToastsAlignment;
    dir?: ToastsDir;
    gap?: number;
    margins?: CSSMargin;
    overflow?: ToastsOverflow;
    transitionDurationMs?: number;
}> & {
    limit?: MaybeAccessor<number | undefined>;
    toastsSignal: SignalSource<Toast<T>[]>;
    computeAnnouncement?: (toast: Toast<T>) => string;
    renderToast: ToastRenderer<T>;
};
