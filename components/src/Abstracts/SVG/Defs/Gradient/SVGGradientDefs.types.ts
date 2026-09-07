import { Point2d, Size2d } from "@thewaver/ss-utils";

import type { AccessorProps } from "../../../../Utils/typeUtils";

type SVGBaseGradientDefs = {
    id: string;
    spreadKind?: "smooth" | "banded";
    spreadMethod?: "pad" | "reflect" | "repeat";
};

type SVGGradientDefs = SVGBaseGradientDefs &
    AccessorProps<{
        colors: {
            value: string;
            stop?: number;
        }[];
    }>;

export type SVGLinearGradientDefs = SVGGradientDefs &
    AccessorProps<{
        angle?: number;
        scale?: Size2d;
        offset?: Point2d;
    }>;

export type SVGRadialGradientDefs = SVGGradientDefs &
    AccessorProps<{
        origin?: Point2d;
        scale?: number;
        aspect?: Size2d;
        angle?: number;
    }>;
