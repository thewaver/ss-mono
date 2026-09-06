import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { NO_SAMPLE_KEY, computeNoSampleDefs } from "../../../../PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "../../SVGGradients.const";
import type { TimedGradientExampleProps } from "../../SVGGradients.types";

import * as styles from "../../SVGGradients.css";

export const DefaultExample = ({
    configKey,
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

        return SVGDefsSamples.Gradient.Timed.SAMPLE_CONFIGS[key].computeSVGDefs(
            `${access(paintKind)}-${id}`,
            undefined,
            getRef,
            {
                getSize,
                animationDurationMs: access(animationDurationMs),
                colors: access(colors),
                blurWidth: access(blurWidth),
                ...getIterationConfig().computeDefs(access(animationDurationMs)),
            },
        );
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
