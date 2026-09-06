import type { AccessorProps } from "@thewaver/ss-components";

export type GlassSurfaceExampleProps = AccessorProps<{
    borderRadius: number;
    blurRadius: number;
    noiseFrequency: number;
    noiseOctaves: number;
    noiseSeed: number;
    rippleScale: number;
    tintColor: string;
    tintOpacity: number;
    lightHeight: number;
    surfaceScale: number;
    specularConstant: number;
    specularExponent: number;
}>;
