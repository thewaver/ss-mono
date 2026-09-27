export type ProgressSizing = "fit-content" | "fill";

export type ProgressRole = "progressbar" | "meter";

export type ProgressState = {
    value: number | undefined;
    min: number;
    max: number;
    ratio: number | undefined;
    hasError: boolean;
};
