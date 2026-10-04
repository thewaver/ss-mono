import type { CarouselOrientation, CarouselPlacements } from "@thewaver/ss-components";

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
};

export const NARROW_PLACEMENTS: readonly CarouselPlacements.SampleKey[] = ["coverFlow", "depthWave"];

export const ORIENTATION_LABELS: Record<CarouselOrientation, string> = {
    horizontal: "Across",
    vertical: "Up and down",
};
