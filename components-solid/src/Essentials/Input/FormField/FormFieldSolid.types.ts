import type { JSX } from "solid-js";

import type { BaseFormFieldValues, FormFieldState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type FormFieldProps = AccessorValues<BaseFormFieldValues> & {
    /** Draws the field's label. */
    renderCaption?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the message under the control. */
    renderMessage?: (getState: () => FormFieldState) => JSX.Element;
    /** Draws the control itself. */
    renderControl: (getState: () => FormFieldState) => JSX.Element;
};
