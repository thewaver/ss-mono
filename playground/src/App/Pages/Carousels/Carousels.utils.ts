import type { CarouselOrientation, CarouselPlacementEntry } from "@thewaver/ss-components";
import { CarouselPlacements } from "@thewaver/ss-components";

import { FRAME_FACE_RATIOS, PLACEMENT_FRAMES } from "./Carousels.const";

export const toFramedPlacement = (
    key: CarouselPlacements.SampleKey,
    orientation: CarouselOrientation,
): CarouselPlacementEntry => {
    const entry: CarouselPlacementEntry = CarouselPlacements.SAMPLE_PLACEMENTS[key];
    const faceRatio = FRAME_FACE_RATIOS[PLACEMENT_FRAMES[key] ?? "whole"][orientation];

    switch (entry.family) {
        case "cover_flow":
            return { family: entry.family, defs: { ...entry.defs, faceRatio } };
        case "depth_wave":
            return { family: entry.family, defs: { ...entry.defs, faceRatio } };
        default:
            return entry;
    }
};
