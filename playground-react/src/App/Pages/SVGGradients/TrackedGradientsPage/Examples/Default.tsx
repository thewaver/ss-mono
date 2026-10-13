import { useId } from "react";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TrackedGradientExampleProps } from "../../SVGGradientsReact.types";

type Props = TrackedGradientExampleProps & {
    boxClass?: string;
    groupElement?: HTMLElement;
    groupSize?: Size2d;
};

export const TrackedShape = ({
    configKey,
    configDefs,
    paintKind,
    colors,
    blurWidth,
    boxClass,
    groupElement,
    groupSize,
}: Props) => {
    const id = useId();

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, paintKind);

        return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
            family: configKey,
            defs: configDefs,
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(
            `${paintKind}-${id}`,
            undefined,
            groupElement ?? element,
            {
                getSize: () => groupSize ?? size,
                colors,
                blurWidth,
            },
        );
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={paintKind === "fill" ? computeDefs : undefined}
            computeStrokeDefs={paintKind === "stroke" ? computeDefs : undefined}
            strokeGeom={paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div className={boxClass ?? styles.example} />}
        />
    );
};

export const DefaultExample = (props: TrackedGradientExampleProps) => <TrackedShape {...props} />;
