import type { FormSectionOrientation } from "./FormSection.types";

export const FORM_SECTION_DEFAULTS = {
    orientation: "vertical" as FormSectionOrientation,
    gap: 5,
};

export const FORM_SECTION_ORIENTATIONS: readonly FormSectionOrientation[] = ["vertical", "horizontal"];
