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

export const DefaultExample = (props: TimedGradientExampleProps) => {
    const id = createUniqueId();

    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(props.iterationConfigKey)];

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => {
        const key = access(props.configKey);

        if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), access(props.paintKind));

        return SVGDefsSampleConfigs.Gradient.Timed.toConfig({
            family: key,
            defs: access(props.configDefs),
        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(
            `${access(props.paintKind)}-${id}`,
            undefined,
            getRef,
            {
                getSize,
                animationDurationMs: access(props.animationDurationMs),
                colors: access(props.colors),
                blurWidth: access(props.blurWidth),
                ...getIterationConfig().computeDefs(access(props.animationDurationMs)),
            },
        );
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={access(props.paintKind) === "fill" ? computeDefs : undefined}
            computeStrokeDefs={access(props.paintKind) === "stroke" ? computeDefs : undefined}
            strokeGeom={access(props.paintKind) === "stroke" ? () => [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div class={styles.example} />}
        />
    );
};
