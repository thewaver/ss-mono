import type { StaircaseDir } from "./Staircase.types";

export const STAIRCASE_DEFAULTS = {
    dir: "down" as StaircaseDir,
    gap: 6,
};

export const STAIRCASE_DIRS: readonly StaircaseDir[] = ["down", "up"];
