import { useId } from "react";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { STROKE_THICKNESS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

type Props = TrackedGradientExampleProps & {
    boxClass?: string;
};

export const TrackedShape = ({ configKey, configDefs, paintKind, colors, blurWidth, boxClass }: Props) => {
    const id = useId();

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, paintKind);

        return SVGDefsSamples.Gradient.Tracked.toConfig({
            family: configKey,
            defs: configDefs,
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`${paintKind}-${id}`, undefined, element, {
            getSize: () => size,
            colors,
            blurWidth,
        });
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={paintKind === "fill" ? computeDefs : undefined}
            computeStrokeDefs={paintKind === "stroke" ? computeDefs : undefined}
            strokeGeom={paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div className={boxClass ?? styles.example} />}
        />
    );
};

export const DefaultExample = (props: TrackedGradientExampleProps) => <TrackedShape {...props} />;
