import type { AccessorProps, SVGDefsColors, SVGDefsSamples, ShapeProps } from "@thewaver/ss-components";
import type { ShapeConst, Size2d } from "@thewaver/ss-utils";

import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.const";

export type ShapeExampleProps = Pick<ShapeProps, "lameExponents" | "joinRadii"> &
    AccessorProps<{
        shouldClipChildren?: boolean;
        shouldPadChildren?: boolean;
        blurWidth?: number;
        animationDurationMs: number;
        colors: SVGDefsColors;
        shapeKind: ShapeConst.DefaultShape;
        strokeConfigKey: WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>;
        fillConfigKey: WithNoSample<SVGDefsSamples.Pattern.SampleKey>;
        iterationConfigKey: SVGDefsSamples.Iteration.SampleKey;
        cellSize: Size2d;
        edgeThicknesses: number[];
    }>;
