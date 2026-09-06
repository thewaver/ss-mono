import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGPatternsExampleProps = AccessorProps<{
    configKey: SVGDefsSamples.Pattern.SampleKey;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
}>;
