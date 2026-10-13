import type { SVGDefsColors, ValuePair } from "@thewaver/ss-components-svelte";
import type {
    BaseSVGGradientsSharedProps,
    BaseTimedGradientExampleProps,
    BaseTrackedGradientExampleProps,
} from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.types";
import type { SVGGradientsPaintKind } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradientsPaintKind.types";

export type { SVGGradientsPaintKind } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradientsPaintKind.types";

export type SVGGradientsSharedProps = BaseSVGGradientsSharedProps;

export type SVGGradientsControls = {
    paintKind: ValuePair<SVGGradientsPaintKind>;
    blurWidth: ValuePair<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedGradientExampleProps = BaseTimedGradientExampleProps;

export type TrackedGradientExampleProps = BaseTrackedGradientExampleProps;
