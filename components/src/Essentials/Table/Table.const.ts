import type { TableSelectionMode } from "./Table.types";

export const TABLE_DEFAULTS = {
    resizeStepPx: 8,
    pageRows: 10,
    resizerWidthPx: 8,
};

export const TABLE_SELECTION_MODES: readonly TableSelectionMode[] = ["none", "single", "multiple"];
