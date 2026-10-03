import { createUniqueId } from "solid-js";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { TrackedPatternExampleProps } from "../../SVGPatterns.types";

export const DefaultExample = ({ configKey, configDefs, colors, cellSize, blurWidth }: TrackedPatternExampleProps) => {
    const id = createUniqueId();

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(getSize, getRef) => {
                const key = access(configKey);

                if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), "fill");

                return SVGDefsSamples.Pattern.Tracked.toConfig({
                    family: key,
                    defs: access(configDefs),
                } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(`fill-${id}`, undefined, getRef, {
                    getSize,
                    cellSize: access(cellSize),
                    colors: access(colors),
                    blurWidth: access(blurWidth),
                });
            }}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
