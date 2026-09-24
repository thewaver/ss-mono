import type { SVGDisplacementChannel, SVGFilterMethod, SVGTurbulenceFilterDefs } from "./SVGFilterDefs.types";

export namespace SVGFilterDefs {
    export const METHODS: readonly SVGFilterMethod[] = ["chain", "isolate"];

    export const TURBULENCE_TYPES: readonly NonNullable<SVGTurbulenceFilterDefs["type"]>[] = [
        "fractalNoise",
        "turbulence",
    ];

    export const DISPLACEMENT_CHANNELS: readonly SVGDisplacementChannel[] = ["R", "G", "B", "A"];
}
