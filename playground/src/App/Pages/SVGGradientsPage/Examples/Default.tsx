import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { SVGGradientsExampleProps } from "../SVGGradientsPage.types";

import * as styles from "../SVGGradientsPage.css";

const STROKE_THICKNESS = 16;

export const DefaultExample = ({
    configKey,
    paintKind,
    iterationConfigKey,
    animationDurationMs,
    colors,
    blurWidth,
}: SVGGradientsExampleProps) => {
    const id = createUniqueId();

    const getConfig = () => SVGDefsSamples.Gradient.SAMPLE_CONFIGS[access(configKey)];
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) =>
        getConfig().computeSVGDefs(`${access(paintKind)}-${id}`, undefined, getRef, {
            getSize,
            animationDurationMs: access(animationDurationMs),
            colors: access(colors),
            blurWidth: access(blurWidth),
            ...getIterationConfig().computeDefs(access(animationDurationMs)),
        });

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
