import type { SourceType } from "../Pages/ImageSwitcherPage/ImageSwitcherPage.types";

export namespace ImageSwitcherKnobs {
    export const MIN_DURATION_MS = 0;
    export const MAX_DURATION_MS = 5000;
    export const DURATION_STEP_MS = 50;

    export const SOURCE_TYPES: SourceType[] = ["profile", "date", "missingFile", "none"];

    export const STARTING_SOURCE_TYPE: SourceType = "profile";
}
