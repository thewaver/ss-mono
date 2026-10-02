import type { Point2d, Size2d } from "@thewaver/ss-utils";

export type SVGGradientSpreadKind = "smooth" | "banded";

export type SVGGradientColor = {
    value: string;
    stop?: number;
};

export type SVGGradientStop = {
    id: string;
    offset: string;
    color: string;
};

export type SVGBaseGradientDefs = {
    id: string;
    spreadKind?: SVGGradientSpreadKind;
    spreadMethod?: "pad" | "reflect" | "repeat";
};

export type SVGLinearGradientFields = {
    colors: SVGGradientColor[];
    angle?: number;
    scale?: Size2d;
    offset?: Point2d;
};

export type SVGRadialGradientFields = {
    colors: SVGGradientColor[];
    origin?: Point2d;
    scale?: number;
    aspect?: Size2d;
    angle?: number;
    elementSize?: Size2d;
};

export type SVGLinearGradientDefs = SVGBaseGradientDefs & SVGLinearGradientFields;

export type SVGRadialGradientDefs = SVGBaseGradientDefs & SVGRadialGradientFields;

export type SVGPaintAreaAttributes = {
    gradientUnits: "userSpaceOnUse" | undefined;
    gradientTransform: string | undefined;
};

export type SVGRadialGradientGeometry = {
    cx: number;
    cy: number;
    r: number;
    gradientTransform: string | undefined;
};
