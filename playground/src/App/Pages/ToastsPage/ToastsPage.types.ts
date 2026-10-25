import type { ToastsAlignment, ToastsFlexDirection, ToastsOverflow } from "@thewaver/ss-components";

import type { ToastAnimation, ToastStacking } from "../../StyledComponents/ToastContent/ToastOptions.types";

export type BaseToastsPlacementDocsExampleValues = {
    alignment: ToastsAlignment;
    flexDirection: ToastsFlexDirection;
    gap: number;
    margin: number;
    stacking: ToastStacking;
};

export type BaseToastsLimitDocsExampleValues = {
    limit: number | undefined;
    overflow: ToastsOverflow;
};

export type BaseToastsDurationDocsExampleValues = {
    durationMs: number;
};

export type BaseToastsAnimationDocsExampleValues = {
    animation: ToastAnimation;
    transitionDurationMs: number;
};
