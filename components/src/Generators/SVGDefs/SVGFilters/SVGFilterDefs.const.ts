import type {
    SVGDisplacementChannel,
    SVGFilterMethod,
    SVGLightSurfaceDefs,
    SVGTurbulenceFilterDefs,
} from "./SVGFilterDefs.types";

export namespace SVGFilterDefs {
    export const METHODS: readonly SVGFilterMethod[] = ["chain", "isolate"];

    export const TURBULENCE_TYPES: readonly NonNullable<SVGTurbulenceFilterDefs["type"]>[] = [
        "fractalNoise",
        "turbulence",
    ];

    export const DISPLACEMENT_CHANNELS: readonly SVGDisplacementChannel[] = ["R", "G", "B", "A"];

    export const COLOR_SPACE = "sRGB";

    export const NEUTRAL_DISPLACEMENT_COLOR = "#808080";

    export const OPAQUE_ALPHA_MATRIX = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0 1";

    export const OPAQUE_WHEREVER_DRAWN = "0 1 1 1 1 1 1 1";
}

export const SVG_FILTER_DEFAULTS = {
    method: "isolate" as SVGFilterMethod,
    turbulence: {
        type: "fractalNoise",
        numOctaves: 1,
        seed: 0,
        stitchTiles: "noStitch",
        xChannelSelector: "R",
        yChannelSelector: "G",
        edgeFade: 0,
    } satisfies Omit<Required<SVGTurbulenceFilterDefs>, "baseFrequency" | "scale">,
    lightSurface: {
        type: "fractalNoise",
        numOctaves: 1,
        seed: 0,
        stitchTiles: "noStitch",
    } satisfies Omit<Required<SVGLightSurfaceDefs>, "baseFrequency">,
    lightingColor: "#FFFFFF",
    specularConstant: 1,
    specularExponent: 20,
    diffuseConstant: 1,
};
