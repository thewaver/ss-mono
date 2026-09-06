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

export type GlassTintDefs = {
    color: string;
    opacity: number;
};

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
    [K in keyof GlassDefs]?: Partial<GlassDefs[K]>;
};
