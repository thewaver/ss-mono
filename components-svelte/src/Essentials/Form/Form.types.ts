import type { Snippet } from "svelte";

import type { BaseFormProps, FormState } from "@thewaver/ss-components";

export type FormProps = BaseFormProps & {
    /** Draws the form's contents, and is told whether the form validates and whether it has been submitted. */
    renderContent: Snippet<[state: FormState]>;
};
