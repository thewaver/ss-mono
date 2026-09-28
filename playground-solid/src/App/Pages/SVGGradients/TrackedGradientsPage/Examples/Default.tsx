import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { STROKE_THICKNESS } from "../../SVGGradients.const";
import type { TrackedGradientExampleProps } from "../../SVGGradients.types";

type Props = TrackedGradientExampleProps & {
    boxClass?: string;
};

export const TrackedShape = ({ configKey, configDefs, paintKind, colors, blurWidth, boxClass }: Props) => {
    const id = createUniqueId();

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => {
        const key = access(configKey);

        if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), access(paintKind));

        return SVGDefsSamples.Gradient.Tracked.toConfig({
            family: key,
            defs: access(configDefs),
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(`${access(paintKind)}-${id}`, undefined, getRef, {
            getSize,
            colors: access(colors),
            blurWidth: access(blurWidth),
        });
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={access(paintKind) === "fill" ? computeDefs : undefined}
            computeStrokeDefs={access(paintKind) === "stroke" ? computeDefs : undefined}
            strokeGeom={access(paintKind) === "stroke" ? () => [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div class={boxClass ?? styles.example} />}
        />
    );
};

export const DefaultExample = (props: TrackedGradientExampleProps) => <TrackedShape {...props} />;
