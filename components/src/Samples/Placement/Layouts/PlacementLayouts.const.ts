import type { PlacementLayoutEntry } from "./PlacementLayouts.types";

export namespace PlacementLayouts {
    export const SAMPLE_LAYOUTS = {
        arc: { family: "arc" },
        cliff: { family: "cliff" },
        column: { family: "column" },
        honeycomb: { family: "honeycomb" },
        ring: { family: "ring" },
        row: { family: "row" },
        whorl: { family: "whorl" },
        zigzag: { family: "zigzag" },
    } satisfies Record<string, PlacementLayoutEntry>;

    export type SampleKey = keyof typeof SAMPLE_LAYOUTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_LAYOUTS) as SampleKey[];
}
