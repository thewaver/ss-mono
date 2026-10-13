import type { AccessorValues } from "@thewaver/ss-components-solid";
import type {
    BaseToastContentCbs,
    BaseToastContentValues,
} from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.types";

export type {
    ToastKind,
    ToastDefs,
} from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastContent.types";

export type {
    ToastAnimation,
    ToastStacking,
} from "@thewaver/ss-playground/App/StyledComponents/ToastContent/ToastOptions.types";

export type ToastContentProps = AccessorValues<BaseToastContentValues> & BaseToastContentCbs;
