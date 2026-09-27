import { useId } from "react";

import { SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground-core/App/PageComponents/SampleGroups/SampleGroups.const";
import * as styles from "@thewaver/ss-playground-core/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import { STROKE_THICKNESS } from "../../SVGGradients.const";
import type { TimedGradientExampleProps } from "../../SVGGradients.types";

export const DefaultExample = ({
    configKey,
    configDefs,
    paintKind,
    iterationConfigKey,
    animationDurationMs,
    colors,
    blurWidth,
}: TimedGradientExampleProps) => {
    const id = useId();

    const iterationConfig = SVGDefsSamples.Iteration.SAMPLE_CONFIGS[iterationConfigKey];

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, paintKind);

        return SVGDefsSamples.Gradient.Timed.toConfig({
            family: configKey,
            defs: configDefs,
        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`${paintKind}-${id}`, undefined, element, {
            getSize: () => size,
            animationDurationMs,
            colors,
            blurWidth,
            ...iterationConfig.computeDefs(animationDurationMs),
        });
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={paintKind === "fill" ? computeDefs : undefined}
            computeStrokeDefs={paintKind === "stroke" ? computeDefs : undefined}
            strokeGeom={paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div className={styles.example} />}
        />
    );
};
