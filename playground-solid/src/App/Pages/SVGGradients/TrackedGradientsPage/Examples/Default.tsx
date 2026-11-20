import { createUniqueId } from "solid-js";

import { SVGDefsSampleConfigs, SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import { STROKE_THICKNESS } from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.const";
import * as styles from "@thewaver/ss-playground/App/Pages/SVGGradients/SVGGradients.css";
import { ShapeConst, type Size2d } from "@thewaver/ss-utils";

import type { TrackedGradientExampleProps } from "../../SVGGradientsSolid.types";

type Props = TrackedGradientExampleProps & {
    boxClass?: string;
    getGroupRef?: () => HTMLElement | undefined;
    getGroupSize?: () => Size2d;
};

export const TrackedShape = (props: Props) => {
    const id = createUniqueId();

    const computeDefs = (getSize: () => Size2d, getRef: () => HTMLElement | undefined) => {
        const key = access(props.configKey);

        if (key === NO_SAMPLE_KEY) return computeNoSampleDefs(access(props.colors), access(props.paintKind));

        return SVGDefsSampleConfigs.Gradient.Tracked.toConfig({
            family: key,
            defs: access(props.configDefs),
        } as SVGDefsSamples.Gradient.Tracked.Entry).computeSVGDefs(
            `${access(props.paintKind)}-${id}`,
            undefined,
            props.getGroupRef ?? getRef,
            {
                getSize: props.getGroupSize ?? getSize,
                colors: access(props.colors),
                blurWidth: access(props.blurWidth),
            },
        );
    };

    return (
        <Shape
            computePoints={(size) => ShapeConst.getDefaultShapePoints("square", size)}
            computeFillDefs={access(props.paintKind) === "fill" ? computeDefs : undefined}
            computeStrokeDefs={access(props.paintKind) === "stroke" ? computeDefs : undefined}
            strokeGeom={access(props.paintKind) === "stroke" ? () => [{ thicknesses: [STROKE_THICKNESS] }] : undefined}
            renderChildren={() => <div class={props.boxClass ?? styles.example} />}
        />
    );
};

export const DefaultExample = (props: TrackedGradientExampleProps) => <TrackedShape {...props} />;
