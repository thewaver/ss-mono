import type { AccessorProps } from "@thewaver/ss-components";

export type GlassSurfaceExampleProps = AccessorProps<{
    borderRadius: number;
    blurRadius: number;
    rippleScale: number;
    rippleFrequency: number;
    rippleOctaves: number;
    rippleSeed: number;
    tintColor: string;
    tintOpacity: number;
    lightHeight: number;
    surfaceScale: number;
    specularConstant: number;
    specularExponent: number;
    grainFrequency: number;
    grainOctaves: number;
    grainSeed: number;
}>;
