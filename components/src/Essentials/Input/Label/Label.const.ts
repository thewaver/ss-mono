import type { LabelContextType } from "./Label.context.types";
import type { LabelOrientation } from "./Label.types";

export const LABEL_DEFAULTS = {
    orientation: "horizontal" as LabelOrientation,
    gap: 10,
};

export const LABEL_CONTEXT: LabelContextType = {
    getIsLabeled: () => true,
    getLabelId: () => undefined,
    setControlId: () => undefined,
};

export const UNLABELED_CONTEXT: LabelContextType = {
    getIsLabeled: () => false,
    getLabelId: () => undefined,
    setControlId: () => undefined,
};
