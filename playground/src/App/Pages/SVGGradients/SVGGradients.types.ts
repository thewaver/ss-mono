import type { Signal } from "solid-js";

import type { AccessorProps, SVGDefsColors, SVGDefsSamples } from "@thewaver/ss-components";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.const";

export type SVGGradientsPaintKind = "fill" | "stroke";

export type SVGGradientsSharedProps = AccessorProps<{
    paintKind: SVGGradientsPaintKind;
    colors: SVGDefsColors;
    blurWidth?: number;
}>;

export type SVGGradientsControls = {
    paintKindSignal: Signal<SVGGradientsPaintKind>;
    blurWidthSignal: Signal<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedGradientExampleProps = SVGGradientsSharedProps &
    AccessorProps<{
        configKey: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>;
        iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
        animationDurationMs: number;
    }>;

export type TrackedGradientExampleProps = SVGGradientsSharedProps &
    AccessorProps<{
        configKey: WithNoSample<SVGDefsSamples.Gradient.Tracked.SampleKey>;
    }>;
