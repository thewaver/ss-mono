import type { ListboxOrientation } from "./Listbox.types";

export const LISTBOX_DEFAULTS = {
    orientation: "vertical" as ListboxOrientation,
    floaterTransitionDurationMs: 100,
};

export const LISTBOX_ORIENTATIONS: readonly ListboxOrientation[] = ["vertical", "horizontal"];
