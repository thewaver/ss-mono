import type { Signal } from "solid-js";

import type { AccessorValues, SVGDefsColors } from "@thewaver/ss-components-solid";
import type {
    BaseSVGGradientsSharedValues,
    BaseTimedGradientExampleValues,
    BaseTrackedGradientExampleValues,
} from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.types";
import type { SVGGradientsPaintKind } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradientsPaintKind.types";

export type { SVGGradientsPaintKind } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradientsPaintKind.types";

export type SVGGradientsSharedProps = AccessorValues<BaseSVGGradientsSharedValues>;

export type SVGGradientsControls = {
    paintKind: Signal<SVGGradientsPaintKind>;
    blurWidth: Signal<number>;
    colors: SVGDefsColors;
    setColor: (key: keyof SVGDefsColors, value: string) => void;
};

export type TimedGradientExampleProps = SVGGradientsSharedProps & AccessorValues<BaseTimedGradientExampleValues>;

export type TrackedGradientExampleProps = SVGGradientsSharedProps & AccessorValues<BaseTrackedGradientExampleValues>;
