import type { ProgressRole, ProgressSizing } from "./Progress.types";

export const PROGRESS_DEFAULTS = {
    role: "progressbar" as ProgressRole,
    sizing: "fill" as ProgressSizing,
    min: 0,
    max: 1,
};
