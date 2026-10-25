import type { FormFieldContextType } from "./FormField.context.types";
import type { FormFieldOrientation } from "./FormField.types";

export const FORM_FIELD_DEFAULTS = {
    orientation: "vertical" as FormFieldOrientation,
    gap: 5,
};

export const FORM_FIELD_ORIENTATIONS: readonly FormFieldOrientation[] = ["vertical", "horizontal"];

export const UNDESCRIBED_CONTEXT: FormFieldContextType = {
    getDescriptionId: () => undefined,
    getCaptionId: () => undefined,
    registerControl: () => undefined,
    unregisterControl: () => undefined,
};
