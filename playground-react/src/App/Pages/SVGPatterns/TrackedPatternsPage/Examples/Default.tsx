import { useId } from "react";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { TrackedPatternExampleProps } from "../../SVGPatterns.types";

export const DefaultExample = ({ configKey, configDefs, colors, cellSize, blurWidth }: TrackedPatternExampleProps) => {
    const id = useId();

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(size, element) => {
                if (configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "fill");

                return SVGDefsSamples.Pattern.Tracked.toConfig({
                    family: configKey,
                    defs: configDefs,
                } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(`fill-${id}`, undefined, element, {
                    getSize: () => size,
                    cellSize,
                    colors,
                    blurWidth,
                });
            }}
            renderChildren={() => <div className={styles.example} />}
        />
    );
};
