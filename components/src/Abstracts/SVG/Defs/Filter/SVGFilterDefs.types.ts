import type { Point2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../../Utils/typeUtils";

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
    edgeFade?: number;
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

export type SVGPointLightDefs = { kind: "point" } & AccessorProps<{
    x: number;
    y: number;
    z: number;
}>;

export type SVGDistantLightDefs = { kind: "distant" } & AccessorProps<{
    azimuth: number;
    elevation: number;
}>;

export type SVGLightSourceDefs = SVGPointLightDefs | SVGDistantLightDefs;

export type SVGLightSurfaceDefs = AccessorProps<{
    baseFrequency: number | Point2d;
    type?: "fractalNoise" | "turbulence";
    numOctaves?: number;
    seed?: number;
    stitchTiles?: "stitch" | "noStitch";
}>;

type SVGBaseLightingFilterDefs = SVGBaseFilterDefs & {
    light: SVGLightSourceDefs;
    surface: SVGLightSurfaceDefs;
} & AccessorProps<{
        surfaceScale: number;
        lightingColor?: string;
    }>;

export type SVGSpecularLightingFilterDefs = SVGBaseLightingFilterDefs &
    AccessorProps<{
        specularConstant?: number;
        specularExponent?: number;
    }>;

export type SVGDiffuseLightingFilterDefs = SVGBaseLightingFilterDefs &
    AccessorProps<{
        diffuseConstant?: number;
    }>;
