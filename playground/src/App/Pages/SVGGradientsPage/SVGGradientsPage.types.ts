import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";

export type SVGGradientsPaintKind = "fill" | "stroke";

export type SVGGradientsExampleProps = AccessorProps<{
    configKey: SVGDefsSamples.Gradient.SampleKey;
    paintKind: SVGGradientsPaintKind;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
    colors: SVGDefsColors;
    blurWidth?: number;
}>;
