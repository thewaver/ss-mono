import type { ProximityEffectEntry } from "./ProximityEffects.types";

export namespace ProximityEffects {
    export const SAMPLE_EFFECTS = {
        fade: { family: "fade" },
        glow: { family: "glow" },
        zoomIn: { family: "zoomIn" },
    } satisfies Record<string, ProximityEffectEntry>;

    export type SampleKey = keyof typeof SAMPLE_EFFECTS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_EFFECTS) as SampleKey[];
}
