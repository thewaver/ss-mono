import type { CarouselOrientation, CarouselPlacements } from "@thewaver/ss-components";

import type { SlideFrame } from "./Carousels.types";

export const FIELD_WIDTH = 110;
export const ORIENTATION_FIELD_WIDTH = 150;

export const TITLES = ["Aurora", "Basalt", "Cinder", "Drift", "Ember", "Fathom", "Glimmer", "Hollow"];

export const PLACEMENT_FIELD_WIDTH = 150;

export const PLACEMENT_FRAMES: Partial<Record<CarouselPlacements.SampleKey, SlideFrame>> = {
    cover_flow: "narrow",
    depth_wave: "narrow",
    paddle_wheel: "paddle",
};

export const ORIENTATION_LABELS: Record<CarouselOrientation, string> = {
    horizontal: "Across",
    vertical: "Up and down",
};
