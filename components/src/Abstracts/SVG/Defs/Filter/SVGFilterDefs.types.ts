import type { Point2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../../Utils/typeUtils";

export type SVGFilterMethod = "chain" | "isolate";

export type SVGDropShadowFilterDefs = {
    dx: number;
    dy: number;
    stdDeviation: number;
    floodColor: string;
    floodOpacity: number;
};

export type SVGGaussianBlurFilterDefs = {
    stdDeviation: number;
};

export type SVGDisplacementChannel = "R" | "G" | "B" | "A";

export type SVGTurbulenceFilterDefs = {
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

export type SVGSaturationFilterDefs = {
    amount: number;
};

export type SVGHueRotationFilterDefs = {
    deg: number;
};

export type SVGBrightnessFilterDefs = {
    amount: number;
};

export type SVGContrastFilterDefs = {
    amount: number;
};

export type SVGInversionFilterDefs = {
    amount: number;
};

export type SVGColorFilterDefs = {
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

type SVGBaseLightingFilterDefs = {
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
