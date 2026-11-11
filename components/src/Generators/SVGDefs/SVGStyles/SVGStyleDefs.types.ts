import type { Point2d, ShapeJoinRadius } from "@thewaver/ss-utils";

import type { ShapeFillGeom, ShapeStrokeGeom } from "../../../Exotics/Shape/Shape.types";
import type { SVGLinearGradientDefs, SVGRadialGradientDefs } from "../SVGGradients/SVGGradientDefs.types";

export type SVGStyleSource = Pick<
    CSSStyleDeclaration,
    | "backgroundAttachment"
    | "backgroundBlendMode"
    | "backgroundClip"
    | "backgroundColor"
    | "backgroundImage"
    | "backgroundOrigin"
    | "backgroundPosition"
    | "backgroundRepeat"
    | "backgroundSize"
    | "borderBottomColor"
    | "borderBottomLeftRadius"
    | "borderBottomRightRadius"
    | "borderBottomStyle"
    | "borderBottomWidth"
    | "borderImageOutset"
    | "borderImageRepeat"
    | "borderImageSlice"
    | "borderImageSource"
    | "borderImageWidth"
    | "borderLeftColor"
    | "borderLeftStyle"
    | "borderLeftWidth"
    | "borderRightColor"
    | "borderRightStyle"
    | "borderRightWidth"
    | "borderTopColor"
    | "borderTopLeftRadius"
    | "borderTopRightRadius"
    | "borderTopStyle"
    | "borderTopWidth"
    | "boxShadow"
    | "getPropertyValue"
    | "paddingBottom"
    | "paddingLeft"
    | "paddingRight"
    | "paddingTop"
>;

export type SVGStyleClip = {
    id: string;
    polygons: Point2d[][];
};

export type SVGStyleShadow = {
    id: string;
    color: string;
    dx: number;
    dy: number;
    stdDeviation: number;
    isInset: boolean;
    region: { x: number; y: number; width: number; height: number };
    isClipped: boolean;
};

export type SVGStyleGradientPaint =
    | { kind: "linear_gradient"; gradient: SVGLinearGradientDefs }
    | { kind: "radial_gradient"; gradient: SVGRadialGradientDefs };

export type SVGStyleTile = {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    tileWidth: number;
    tileHeight: number;
    source: { x: number; y: number; width: number; height: number };
    imageWidth: number;
    imageHeight: number;
};

export type SVGStylePaint =
    | { kind: "color"; color: string; clip?: SVGStyleClip }
    | { kind: "shadow"; shadow: SVGStyleShadow }
    | { kind: "tile"; tile: SVGStyleTile; gradient: SVGStyleGradientPaint }
    | SVGStyleGradientPaint;

export type SVGStyleDefs = {
    fill: SVGStylePaint[];
    fillGeom: (ShapeFillGeom | undefined)[];
    stroke: SVGStylePaint[];
    strokeGeom: ShapeStrokeGeom[];
    joinRadii: ShapeJoinRadius[];
    lameExponents: number[];
};
