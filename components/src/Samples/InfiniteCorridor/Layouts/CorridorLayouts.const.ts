import type { CorridorLayoutEntry } from "../../../Generators/CorridorLayouts/CorridorLayouts.types";

export namespace CorridorLayouts {
    export const SAMPLE_LAYOUTS = {
        tube: { family: "tube" },
        walls: { family: "walls" },
    } satisfies Record<string, CorridorLayoutEntry>;

    export type SampleKey = keyof typeof SAMPLE_LAYOUTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_LAYOUTS) as SampleKey[];
}
