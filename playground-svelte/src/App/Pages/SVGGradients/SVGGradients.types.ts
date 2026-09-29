import type { SVGDefsColors, SVGDefsSamples, ValuePair } from "@thewaver/ss-components-svelte";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";

export type SVGGradientsPaintKind = "fill" | "stroke";

export type SVGGradientsSharedProps = {
    paintKind: SVGGradientsPaintKind;
    colors: SVGDefsColors;
    blurWidth?: number;
};

export type SVGGradientsControls = {
    paintKind: ValuePair<SVGGradientsPaintKind>;
    blurWidth: ValuePair<number>;
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

export type TrackedGradientOverlayProps = Omit<TrackedGradientExampleProps, "paintKind"> & {
    isShown: boolean;
    onClose: () => void;
};
