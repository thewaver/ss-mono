import { createUniqueId } from "solid-js";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { TimedPatternExampleProps } from "../../SVGPatternsSolid.types";

export const DefaultExample = (props: TimedPatternExampleProps) => {
    const id = createUniqueId();

    const getConfigKey = () => access(props.configKey);
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(props.iterationConfigKey)];

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(getSize, getRef) => {
                const key = getConfigKey();

                if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), "fill");

                return SVGDefsSampleConfigs.Pattern.Timed.SAMPLE_CONFIGS[key].computeSVGDefs(
                    `fill-${id}`,
                    undefined,
                    getRef,
                    {
                        getSize,
                        cellSize: access(props.cellSize),
                        animationDurationMs: access(props.animationDurationMs),
                        colors: access(props.colors),
                        blurWidth: access(props.blurWidth),
                        ...getIterationConfig().computeDefs(access(props.animationDurationMs)),
                    },
                );
            }}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
