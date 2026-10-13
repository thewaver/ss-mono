import type { JSX } from "solid-js";

import type { BaseFormCbs, BaseFormValues, FormState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../Utils/typeUtils";

export type FormProps = AccessorValues<BaseFormValues> &
    BaseFormCbs & {
        /** Draws the form's contents, and is told whether the form validates and whether it has been submitted. */
        renderContent: (getState: () => FormState) => JSX.Element;
    };
