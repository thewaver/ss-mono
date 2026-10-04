import type { CarouselOrientation, CarouselPlacements } from "@thewaver/ss-components";

import type { SlideFrame } from "./Carousels.types";

export const FIELD_WIDTH = 110;
export const ORIENTATION_FIELD_WIDTH = 150;

export const TITLES = ["Aurora", "Basalt", "Cinder", "Drift", "Ember", "Fathom", "Glimmer", "Hollow"];

export const PLACEMENT_FIELD_WIDTH = 150;

export const PLACEMENT_LABELS: Record<CarouselPlacements.SampleKey, string> = {
    track: "Track",
    drum: "Drum",
    coverFlow: "Cover flow",
    depthWave: "Depth wave",
    cylinder: "Cylinder",
    folders: "Folders",
    hinge: "Hinge",
    paddleWheel: "Paddle wheel",
};

export const PLACEMENT_FRAMES: Partial<Record<CarouselPlacements.SampleKey, SlideFrame>> = {
    coverFlow: "narrow",
    depthWave: "narrow",
    paddleWheel: "paddle",
};

export const ORIENTATION_LABELS: Record<CarouselOrientation, string> = {
    horizontal: "Across",
    vertical: "Up and down",
};
