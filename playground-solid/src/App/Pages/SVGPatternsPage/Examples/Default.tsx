import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatternsPage/SVGPatternsPage.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { SVGPatternsExampleProps } from "../SVGPatternsPage.types";

export const DefaultExample = ({
    configKey,
    iterationConfigKey,
    animationDurationMs,
    colors,
    cellSize,
    blurWidth,
}: SVGPatternsExampleProps) => {
    const id = createUniqueId();

    const getConfigKey = () => access(configKey);
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(getSize, getRef) => {
                const key = getConfigKey();

                if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), "fill");

                return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[key].computeSVGDefs(`fill-${id}`, undefined, getRef, {
                    getSize,
                    cellSize: access(cellSize),
                    animationDurationMs: access(animationDurationMs),
                    colors: access(colors),
                    blurWidth: access(blurWidth),
                    ...getIterationConfig().computeDefs(access(animationDurationMs)),
                });
            }}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
