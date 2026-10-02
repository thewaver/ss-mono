import { type ReactElement, type ReactNode, type SVGProps, cloneElement } from "react";

import {
    type SVGGradientColor,
    SVGGradientDefsUtils,
    type SVGGradientSpreadKind,
    type SVGLinearGradientDefs,
    type SVGRadialGradientDefs,
} from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { usePaintAreaContext } from "./PaintArea.context";

/** The stops, one element each, keyed by their own ids. */
const renderStops = (id: string, colors: SVGGradientColor[], spreadKind: SVGGradientSpreadKind | undefined) =>
    SVGGradientDefsUtils.computeStops(id, colors, spreadKind).map((stop) => (
        <stop key={stop.id} id={stop.id} offset={stop.offset} stopColor={stop.color} />
    ));

/** Lays the gradient it wraps across the paint area it finds, keeping the gradient's own transform inside it. */
const PaintAreaGradient = (props: {
    gradientTransform: string | undefined;
    children: ReactElement<SVGProps<SVGElement>>;
}) => {
    const paintArea = usePaintAreaContext();

    return cloneElement(
        props.children,
        SVGGradientDefsUtils.computePaintAreaAttributes(paintArea?.paintArea, props.gradientTransform),
    );
};

/**
 * The React side of `SVGGradientDefsUtils`: `linearGradient` and `radialGradient` elements, with the stops worked out
 * from the colors.
 *
 * Each call answers the gradient as it stands, so a component that calls it while rendering keeps the element in
 * place and updates its attributes as its angle or its colors change.
 *
 * A gradient rendered inside a `PaintAreaContextProvider` is laid across the area it provides rather than across
 * each element it paints — see `SVGGradientDefsUtils.computePaintAreaAttributes`.
 */
export namespace SVGGradientDefsReactUtils {
    /**
     * Builds a linear gradient.
     *
     * @param defs The gradient: its id, the `angle` it runs at, an `offset` and `scale` for shifting and shortening
     * it, the `colors`, and `spreadKind` — `"banded"` for hard-edged bands, anything else for a smooth blend.
     * Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given as a
     * function, it receives the gradient's endpoints.
     * @returns The `linearGradient` element, which a fill points at with `url(#…)`.
     */
    export const computeLinearGradient = (
        defs: SVGLinearGradientDefs,
        custom?: ReactNode | ((x1: number, y1: number, x2: number, y2: number) => ReactNode),
    ) => {
        const { id, angle, offset, scale, colors, spreadKind, ...baseProps } = defs;
        const coords = SVGUtils.getLinearCoords({ angle, offset, scale });

        return (
            <PaintAreaGradient gradientTransform={undefined}>
                <linearGradient {...baseProps} id={id} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
                    {typeof custom === "function" ? custom(coords.x1, coords.y1, coords.x2, coords.y2) : custom}
                    {renderStops(id, colors, spreadKind)}
                </linearGradient>
            </PaintAreaGradient>
        );
    };

    /**
     * Builds a radial gradient.
     *
     * @param defs The gradient: its id, the `colors`, an `origin` to radiate from, a `scale` for its radius, and
     * `aspect` and `angle` for squashing and turning it into an ellipse. `elementSize` holds the gradient round on an
     * oblong element rather than letting it follow the box. `spreadKind` is `"banded"` for hard-edged rings,
     * anything else for a smooth blend. Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given as a
     * function, it receives the gradient's center and radius.
     * @returns The `radialGradient` element, which a fill points at with `url(#…)`.
     */
    export const computeRadialGradient = (
        defs: SVGRadialGradientDefs,
        custom?: ReactNode | ((cx: number, cy: number, r: number) => ReactNode),
    ) => {
        const { id, colors, origin, scale, aspect, angle, elementSize, spreadKind, ...baseProps } = defs;
        const geometry = SVGGradientDefsUtils.computeRadialGeometry({ origin, scale, aspect, angle, elementSize });

        return (
            <PaintAreaGradient gradientTransform={geometry.gradientTransform}>
                <radialGradient {...baseProps} id={id} cx={geometry.cx} cy={geometry.cy} r={geometry.r}>
                    {typeof custom === "function" ? custom(geometry.cx, geometry.cy, geometry.r) : custom}
                    {renderStops(id, colors, spreadKind)}
                </radialGradient>
            </PaintAreaGradient>
        );
    };
}
