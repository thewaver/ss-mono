import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.const";

export type GlassSurfaceExampleProps = AccessorProps<{
    borderRadius: number;
    borderWidth: number;
    strokeConfigKey: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>;
    colors: SVGDefsColors;
    blurWidth?: number;
    blurRadius: number;
    noiseFrequency: number;
    noiseOctaves: number;
    rippleScale: number;
    tintColor: string;
    tintOpacity: number;
    lightHeight: number;
    surfaceScale: number;
    specularConstant: number;
    specularExponent: number;
}>;
