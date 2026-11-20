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

export const TrackedShape = (props: Props) => {
    const id = useId();

    const computeDefs = (size: Size2d, element: HTMLElement | undefined) => {
        if (props.configKey === NO_SAMPLE_KEY) return computeNoSampleDefs(props.colors, props.paintKind);

        return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
            family: props.configKey,
            defs: props.configDefs,
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(
            `${props.paintKind}-${id}`,
            undefined,
            props.groupElement ?? element,
            {
                getSize: () => props.groupSize ?? size,
                colors: props.colors,
                blurWidth: props.blurWidth,
            },
        );
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={props.paintKind === "fill" ? computeDefs : undefined}
            computeStrokeDefs={props.paintKind === "stroke" ? computeDefs : undefined}
            strokeGeom={props.paintKind === "stroke" ? [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div className={props.boxClass ?? styles.example} />}
        />
    );
};

export const DefaultExample = (props: TrackedGradientExampleProps) => <TrackedShape {...props} />;
