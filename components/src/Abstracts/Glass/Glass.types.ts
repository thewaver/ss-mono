export type GlassBackdropDefs = {
    blurRadius: number;
};

export type GlassRippleDefs = {
    frequency: number;
    octaves: number;
    seed: number;
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
    grainFrequency: number;
    grainOctaves: number;
    grainSeed: number;
};

export type GlassDefs = {
    backdrop: GlassBackdropDefs;
    ripple: GlassRippleDefs;
    tint: GlassTintDefs;
    sheen: GlassSheenDefs;
};

export type PartialGlassDefs = {
    [K in keyof GlassDefs]?: Partial<GlassDefs[K]>;
};
