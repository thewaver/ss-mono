import type { AccessorProps, Toast, ToastState } from "@thewaver/ss-components";

export type ToastKind = "info" | "success" | "error";

export type ToastAnimation = "zoom" | "slide" | "fade";

export type ToastDefs = {
    kind: ToastKind;
    message: string;
};

export type ToastContentProps = AccessorProps<{
    toast: Toast<ToastDefs>;
    state: ToastState;
    animation: ToastAnimation;
    visibilityTarget: 0 | 1;
    transitionDurationMs: number;
    onDismiss: () => void;
}>;
