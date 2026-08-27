import type { JSX } from "solid-js";

import type { AccessorProps } from "../../../Utils/typeUtils";

export type FormSectionState = {
    isValid: boolean;
    hasError: boolean;
    hasMessage: boolean;
};

export type FormSectionProps = AccessorProps<{
    dir?: "column" | "row";
    gap?: number;
    ariaLabel?: string;
    hasError?: boolean;
    message?: string;
    renderCaption?: (getState: () => FormSectionState) => JSX.Element;
    renderMessage?: (getState: () => FormSectionState) => JSX.Element;
    renderContent: (getState: () => FormSectionState) => JSX.Element;
}>;
