import { useId } from "react";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TimedGradientExampleProps } from "../../SVGGradientsReact.types";

export const DefaultExample = (props: TimedGradientExampleProps) => {
    const id = useId();

    const iterationConfig = SVGDefsSamples.Iteration.SAMPLE_CONFIGS[props.iterationConfigKey];

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, props.paintKind);

        return SVGDefsSampleConfigs.Gradient.Timed.toConfig({
            family: props.configKey,
            defs: props.configDefs,
        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`${props.paintKind}-${id}`, undefined, element, {
            getSize: () => size,
            animationDurationMs: props.animationDurationMs,
            colors: props.colors,
            blurWidth: props.blurWidth,
            ...iterationConfig.computeDefs(props.animationDurationMs),
        });
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={props.paintKind === "fill" ? computeDefs : undefined}
            computeStrokeDefs={props.paintKind === "stroke" ? computeDefs : undefined}
            strokeGeom={props.paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div className={styles.example} />}
        />
    );
};
