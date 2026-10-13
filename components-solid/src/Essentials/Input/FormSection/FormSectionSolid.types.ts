import type { JSX } from "solid-js";

import type { BaseFormSectionValues, FormSectionState } from "@thewaver/ss-components";

import type { AccessorValues } from "../../../Utils/typeUtils";

export type FormSectionProps = AccessorValues<BaseFormSectionValues> & {
    /** Draws the section's caption. */
    renderCaption?: (getState: () => FormSectionState) => JSX.Element;
    /** Draws the message under the content. */
    renderMessage?: (getState: () => FormSectionState) => JSX.Element;
    /** Draws the section's contents. */
    renderContent: (getState: () => FormSectionState) => JSX.Element;
};
