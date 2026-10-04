import type { Point2d, Size2d } from "@thewaver/ss-utils";

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

export type SVGPixelateFilterDefs = {
    size: number;
};

export type SVGInversionFilterDefs = {
    amount: number;
};

export type SVGColorFilterDefs = {
    r: number;
    g: number;
    b: number;
};

export type SVGPointLightDefs = {
    kind: "point";
    x: number;
    y: number;
    z: number;
};

export type SVGDistantLightDefs = {
    kind: "distant";
    azimuth: number;
    elevation: number;
};

export type SVGLightSourceDefs = SVGPointLightDefs | SVGDistantLightDefs;

export type SVGLightSurfaceDefs = {
    baseFrequency: number | Point2d;
    type?: "fractalNoise" | "turbulence";
    numOctaves?: number;
    seed?: number;
    stitchTiles?: "stitch" | "noStitch";
};

export type SVGBaseLightingFilterDefs = {
    light: SVGLightSourceDefs;
    surface: SVGLightSurfaceDefs;
    surfaceScale: number;
    lightingColor?: string;
};

export type SVGSpecularLightingFilterDefs = SVGBaseLightingFilterDefs & {
    specularConstant?: number;
    specularExponent?: number;
};

export type SVGDiffuseLightingFilterDefs = SVGBaseLightingFilterDefs & {
    diffuseConstant?: number;
};

export type SVGFilterPrimitiveKind =
    | "dropShadow"
    | "gaussianBlur"
    | "turbulence"
    | "hueRotation"
    | "saturation"
    | "brightness"
    | "contrast"
    | "inversion"
    | "color"
    | "pixelate"
    | "specularLighting"
    | "diffuseLighting";

export type SVGFilterAssemblyDefs = {
    method?: SVGFilterMethod;
    elementSize?: Size2d;
};

export type SVGFilterRegion = {
    filterUnits?: "userSpaceOnUse";
    x: string;
    y: string;
    width: string;
    height: string;
};

export type SVGFilterFrame = {
    width: number;
    height: number;
    offset: number;
};

export type SVGFilterAssembly = {
    region: SVGFilterRegion | undefined;
    frame: SVGFilterFrame | undefined;
    inputs: { key: string; srcIn: string }[];
    mergeKeys: string[] | undefined;
};
