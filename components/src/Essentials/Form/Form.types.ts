import type { JSX } from "solid-js";

import type { AccessorProps } from "../../Utils/typeUtils";

export type FormState = {
    isValid: boolean;
    hasSubmitted: boolean;
};

export type FormProps = AccessorProps<{
    /** Identifies the form, so a control outside it can say it belongs to it. */
    id?: string;
    /** The form's name. */
    name?: string;
    /** Names the form for assistive technology. */
    ariaLabel?: string;
    /** Points at the element whose text names the form, for a form that already shows its own heading. */
    ariaLabelledBy?: string;
    /** Runs when the form is submitted. */
    onSubmit?: () => void | Promise<void>;
    /** Runs when the form is reset. */
    onReset?: () => void | Promise<void>;
    /** Draws the form's contents, and is told whether the form validates and whether it has been submitted. */
    renderContent: (getState: () => FormState) => JSX.Element;
}>;
