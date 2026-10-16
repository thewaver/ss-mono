import type { CarouselPlacementEntry } from "../../../Generators/CarouselPlacements/CarouselPlacements.types";

export namespace CarouselPlacements {
    export const SAMPLE_PLACEMENTS = {
        concertina: { family: "concertina" },
        cover_flow: { family: "cover_flow" },
        cylinder: { family: "cylinder" },
        depth_wave: { family: "depth_wave" },
        drum: { family: "drum" },
        folders: { family: "folders" },
        hinge: { family: "hinge" },
        paddle_wheel: { family: "paddle_wheel" },
        track: { family: "track" },
    } satisfies Record<string, CarouselPlacementEntry>;

    export type SampleKey = keyof typeof SAMPLE_PLACEMENTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_PLACEMENTS) as SampleKey[];
}
