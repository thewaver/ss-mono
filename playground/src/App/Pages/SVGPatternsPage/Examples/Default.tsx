import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import type { SVGPatternsExampleProps } from "../SVGPatternsPage.types";

import * as styles from "../SVGPatternsPage.css";

export const DefaultExample = ({
    configKey,
    iterationConfigKey,
    animationDurationMs,
    colors,
    cellSize,
    blurWidth,
}: SVGPatternsExampleProps) => {
    const id = createUniqueId();

    const getConfig = () => SVGDefsSamples.Pattern.SAMPLE_CONFIGS[access(configKey)];
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(getSize, getRef) =>
                getConfig().computeSVGDefs(`fill-${id}`, undefined, getRef, {
                    getSize,
                    cellSize: access(cellSize),
                    animationDurationMs: access(animationDurationMs),
                    colors: access(colors),
                    blurWidth: access(blurWidth),
                    ...getIterationConfig().computeDefs(access(animationDurationMs)),
                })
            }
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
