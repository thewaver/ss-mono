import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-solid";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import type { Size2d } from "@thewaver/ss-utils";

export type SVGPatternsExampleProps = AccessorProps<{
    configKey: WithNoSample<SVGDefsSamples.Pattern.SampleKey>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
}>;
