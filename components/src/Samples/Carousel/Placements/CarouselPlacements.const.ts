import type { CarouselPlacementEntry } from "../../../Generators/CarouselPlacements/CarouselPlacements.types";

export namespace CarouselPlacements {
    export const SAMPLE_PLACEMENTS = {
        track: { family: "track" },
        drum: { family: "drum" },
        cover_flow: { family: "cover_flow" },
        depth_wave: { family: "depth_wave" },
        cylinder: { family: "cylinder" },
        folders: { family: "folders" },
        hinge: { family: "hinge" },
        paddle_wheel: { family: "paddle_wheel" },
    } satisfies Record<string, CarouselPlacementEntry>;

    export type SampleKey = keyof typeof SAMPLE_PLACEMENTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_PLACEMENTS) as SampleKey[];
}
