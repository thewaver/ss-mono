import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";
import type { Size2d } from "@thewaver/ss-utils";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.const";

export type SVGPatternsExampleProps = AccessorProps<{
    configKey: WithNoSample<SVGDefsSamples.Pattern.SampleKey>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
    colors: SVGDefsColors;
    cellSize: Size2d;
    blurWidth?: number;
}>;
