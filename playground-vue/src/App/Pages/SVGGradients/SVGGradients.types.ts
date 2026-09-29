import type { Ref } from "vue";

import type { SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components-vue";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

export type SVGGradientsPaintKind = "fill" | "stroke";

export type SVGGradientsSharedProps = {
    paintKind: SVGGradientsPaintKind;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type SVGGradientsControls = {
    paintKind: Ref<SVGGradientsPaintKind>;
    blurWidth: Ref<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedGradientExampleProps = SVGGradientsSharedProps & {
    configKey: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>;
    configDefs: Record<string, number | boolean>;
    iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
    animationDurationMs: number;
};

export type TrackedGradientExampleProps = SVGGradientsSharedProps & {
    configKey: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>;
    configDefs: Record<string, number | boolean>;
};
