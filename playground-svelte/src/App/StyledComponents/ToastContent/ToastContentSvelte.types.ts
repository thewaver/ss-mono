import type { Snippet } from "svelte";

import type { BaseToastContentProps } from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.types";

export type {
    ToastKind,
    ToastDefs,
} from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.types";

export type {
    ToastAnimation,
    ToastStacking,
} from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastOptions.types";

export type ToastContentProps = BaseToastContentProps & {
    children?: Snippet;
};
