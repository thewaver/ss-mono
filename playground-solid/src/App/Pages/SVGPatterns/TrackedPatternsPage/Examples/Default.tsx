import { createUniqueId } from "solid-js";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGPatterns/SVGPatterns.css";
import { ShapeConst } from "@thewaver/ss-utils";

import type { TrackedPatternExampleProps } from "../../SVGPatternsSolid.types";

export const DefaultExample = (props: TrackedPatternExampleProps) => {
    const id = createUniqueId();

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={(getSize, getRef) => {
                const key = access(props.configKey);

                if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), "fill");

                return SVGDefsSampleConfigs.Pattern.Tracked.toConfig({
                    family: key,
                    defs: access(props.configDefs),
                } as SVGDefsSamples.Pattern.Tracked.Entry).computeSVGDefs(`fill-${id}`, undefined, getRef, {
                    getSize,
                    cellSize: access(props.cellSize),
                    colors: access(props.colors),
                    blurWidth: access(props.blurWidth),
                });
            }}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
