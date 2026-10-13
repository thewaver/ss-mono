import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.types";
import type { SVGGradientsPaintKind } from "./SVGGradientsPaintKind.types";

export type BaseSVGGradientsSharedValues = {
    paintKind: SVGGradientsPaintKind;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type BaseSVGGradientsSharedProps = BaseSVGGradientsSharedValues;

export type BaseTimedGradientExampleValues = {
    configKey: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>;
    configDefs: Record<string, number | boolean>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
};

export type BaseTimedGradientExampleProps = BaseSVGGradientsSharedProps & BaseTimedGradientExampleValues;

export type BaseTrackedGradientExampleValues = {
    configKey: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>;
    configDefs: Record<string, number | boolean>;
};

export type BaseTrackedGradientExampleProps = BaseSVGGradientsSharedProps & BaseTrackedGradientExampleValues;
