import type { SVGLinearGradientDefs, SVGRadialGradientDefs } from "../SVG/Defs/Gradient/SVGGradientDefs.types";

export type GlassNoiseDefs = {
    frequency: number;
    octaves: number;
    seed: number;
};

export type GlassBackdropDefs = {
    blurRadius: number;
};

export type GlassRippleDefs = {
    scale: number;
};

export type GlassTintGradientDefs =
    | ({ kind: "linear" } & Omit<SVGLinearGradientDefs, "id">)
    | ({ kind: "radial" } & Omit<SVGRadialGradientDefs, "id" | "elementSize">);

export type GlassTintDefs =
    | { color: string; opacity: number; gradient?: never }
    | { color?: never; opacity: number; gradient: GlassTintGradientDefs };

export type GlassSheenDefs = {
    lightHeight: number;
    surfaceScale: number;
    specularConstant: number;
    specularExponent: number;
};

export type GlassDefs = {
    noise: GlassNoiseDefs;
    backdrop: GlassBackdropDefs;
    ripple: GlassRippleDefs;
    tint: GlassTintDefs;
    sheen: GlassSheenDefs;
};

export type PartialGlassDefs = {
    noise?: Partial<GlassDefs["noise"]>;
    backdrop?: Partial<GlassDefs["backdrop"]>;
    ripple?: Partial<GlassDefs["ripple"]>;
    tint?: GlassTintDefs;
    sheen?: Partial<GlassDefs["sheen"]>;
};
