import type { ParticleAttractionDefs, ParticleWindDefs } from "./ParticleModifiers.types";

export namespace ParticleModifierDefaults {
    export const WIND_DEFAULTS: Required<ParticleWindDefs> = {
        directionDegrees: 90,
        strengthPixels: 40,
        gustRatio: 0.5,
        gustPeriodMs: 1000,
    };

    export const ATTRACTION_DEFAULTS: Required<Pick<ParticleAttractionDefs, "strengthRatio" | "reachPixels">> = {
        strengthRatio: 0.5,
        reachPixels: 160,
    };
}
