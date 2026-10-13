import { createUniqueId } from "solid-js";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TimedGradientExampleProps } from "../../SVGGradientsSolid.types";

export const DefaultExample = ({
    configKey,
    configDefs,
    paintKind,
    iterationConfigKey,
    animationDurationMs,
    colors,
    blurWidth,
}: TimedGradientExampleProps) => {
    const id = createUniqueId();

    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => {
        const key = access(configKey);

        if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), access(paintKind));

        return SVGDefsSampleConfigs.Gradient.Timed.toConfig({
            family: key,
            defs: access(configDefs),
        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`${access(paintKind)}-${id}`, undefined, getRef, {
            getSize,
            animationDurationMs: access(animationDurationMs),
            colors: access(colors),
            blurWidth: access(blurWidth),
            ...getIterationConfig().computeDefs(access(animationDurationMs)),
        });
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={access(paintKind) === "fill" ? computeDefs : undefined}
            computeStrokeDefs={access(paintKind) === "stroke" ? computeDefs : undefined}
            strokeGeom={access(paintKind) === "stroke" ? () => [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
