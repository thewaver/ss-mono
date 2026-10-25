import type { SortableOrientation } from "./Sortable.types";

export const SORTABLE_DEFAULTS = {
    orientation: "vertical" as SortableOrientation,
    gap: 0,
    itemRoleDescription: "sortable item",
};

export const SORTABLE_ORIENTATIONS: readonly SortableOrientation[] = ["vertical", "horizontal"];
