import type { SourceType } from "./ImageSwitcherPage.types";

export const EXAMPLE_NAMES = {
    default: "Default",
};

export const IMAGE_CONTAINER_SIZE = 480;

export const MISSING_SRC = "missing_image.webp";

export const SOURCE_ALTS: Record<SourceType, string | undefined> = {
    profile: "A knight in profile",
    date: "A knight on a date",
    missing_file: "A picture that will not load",
    none: undefined,
};

export const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/ImageSwitcherPage/Examples/Default.tsx";
