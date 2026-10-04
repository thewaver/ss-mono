import type { CarouselPlacementEntry } from "../../../Generators/CarouselPlacements/CarouselPlacements.types";

export namespace CarouselPlacements {
    export const SAMPLE_PLACEMENTS = {
        track: { family: "track" },
        drum: { family: "drum" },
        coverFlow: { family: "coverFlow" },
        depthWave: { family: "depthWave" },
        cylinder: { family: "cylinder" },
        folders: { family: "folders" },
        hinge: { family: "hinge" },
        paddleWheel: { family: "paddleWheel" },
    } satisfies Record<string, CarouselPlacementEntry>;

    export type SampleKey = keyof typeof SAMPLE_PLACEMENTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_PLACEMENTS) as SampleKey[];
}
