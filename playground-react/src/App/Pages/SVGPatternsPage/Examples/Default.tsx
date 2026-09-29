import { useId } from "react";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
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
    const id = useId();

    const iterationConfig = SVGDefsSamples.Iteration.SAMPLE_CONFIGS[iterationConfigKey];

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(size, element) => {
                if (configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "fill");

                return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[configKey].computeSVGDefs(
                    `fill-${id}`,
                    undefined,
                    element,
                    {
                        getSize: () => size,
                        cellSize,
                        animationDurationMs,
                        colors,
                        blurWidth,
                        ...iterationConfig.computeDefs(animationDurationMs),
                    },
                );
            }}
            renderChildren={() => <div className={styles.example} />}
        />
    );
};
