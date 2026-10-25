import type { BaseToast, ToastState, ToastsFlexDirection } from "@thewaver/ss-components";

import type { ToastAnimation, ToastStacking } from "./ToastOptions.types";

export type ToastKind = "info" | "success" | "error";

export type ToastDefs = {
    kind: ToastKind;
    message: string;
};

export type BaseToastContentValues = {
    toast: BaseToast<ToastDefs>;
    state: ToastState;
    animation?: ToastAnimation;
    stacking?: ToastStacking;
    flexDirection?: ToastsFlexDirection;
    gap?: number;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
};

export type BaseToastContentCbs = {
    onDismiss: () => void;
};

export type BaseToastContentProps = BaseToastContentValues & BaseToastContentCbs;
