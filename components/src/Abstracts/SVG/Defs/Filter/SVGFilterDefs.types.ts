import type { Point2d } from "@thewaver/ss-utils";

type SVGBaseFilterDefs = {};

export type SVGFilterMethod = "chain" | "isolate";

export type SVGDropShadowFilterDefs = SVGBaseFilterDefs & {
    dx: number;
    dy: number;
    stdDeviation: number;
    floodColor: string;
    floodOpacity: number;
};

export type SVGGaussianBlurFilterDefs = SVGBaseFilterDefs & {
    stdDeviation: number;
};

export type SVGDisplacementChannel = "R" | "G" | "B" | "A";

export type SVGTurbulenceFilterDefs = SVGBaseFilterDefs & {
    baseFrequency: number | Point2d;
    scale: number;
    type?: "fractalNoise" | "turbulence";
    numOctaves?: number;
    seed?: number;
    stitchTiles?: "stitch" | "noStitch";
    xChannelSelector?: SVGDisplacementChannel;
    yChannelSelector?: SVGDisplacementChannel;
};

export type SVGSaturationFilterDefs = SVGBaseFilterDefs & {
    amount: number;
};

export type SVGHueRotationFilterDefs = SVGBaseFilterDefs & {
    deg: number;
};

export type SVGBrightnessFilterDefs = SVGBaseFilterDefs & {
    amount: number;
};

export type SVGContrastFilterDefs = SVGBaseFilterDefs & {
    amount: number;
};

export type SVGInversionFilterDefs = SVGBaseFilterDefs & {
    amount: number;
};

export type SVGColorFilterDefs = SVGBaseFilterDefs & {
    r: number;
    g: number;
    b: number;
};
