import type { JSX } from "solid-js";
import { Index, createMemo, untrack } from "solid-js";

import { type SVGGradientColor, SVGGradientDefsUtils, type SVGGradientSpreadKind } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { access } from "../../../Utils/propUtils";
import { usePaintAreaContext } from "./PaintArea.context";
import type { SVGLinearGradientSolidDefs, SVGRadialGradientSolidDefs } from "./SVGGradientDefsSolid.types";

/** The stops, kept in place and updated as the colors change. */
const renderStops = (
    id: string,
    getColors: () => SVGGradientColor[],
    spreadKind: SVGGradientSpreadKind | undefined,
) => {
    const getStops = createMemo(() => SVGGradientDefsUtils.computeStops(id, getColors(), spreadKind));

    return (
        <Index each={getStops()}>
            {(getStop) => <stop id={getStop().id} offset={getStop().offset} stop-color={getStop().color} />}
        </Index>
    );
};

/**
 * The Solid side of {@link SVGGradientDefsUtils}: `linearGradient` and `radialGradient` elements, with the stops
 * worked out from the colors.
 *
 * Everything is read through accessors, so a gradient re-renders as its angle or its colors change
 * rather than being rebuilt.
 *
 * A gradient built inside a {@link PaintAreaContextProvider} is laid across the area it provides rather than
 * across each element it paints — see {@link SVGGradientDefsUtils.computePaintAreaAttributes}.
 */
export namespace SVGGradientDefsSolidUtils {
    /**
     * Builds a linear gradient.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param defs The gradient: its id, the `angle` it runs at, an `offset` and `scale` for shifting
     * and shortening it, the `colors`, and `spreadKind` — `"banded"` for hard-edged bands, anything
     * else for a smooth blend. Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given
     * as a function, it receives the gradient's initial endpoints.
     * @returns The `linearGradient` element, which a fill points at with `url(#…)`.
     */
    export const computeLinearGradient = (
        defs: SVGLinearGradientSolidDefs,
        custom?: JSX.Element | ((x1: number, y1: number, x2: number, y2: number) => JSX.Element),
    ) => {
        const { id, angle, offset, scale, colors, spreadKind, ...baseProps } = defs;
        const getColors = () => access(colors);
        const getCoords = () =>
            SVGUtils.getLinearCoords({ angle: access(angle), offset: access(offset), scale: access(scale) });
        const initial = untrack(getCoords);
        const paintArea = usePaintAreaContext();
        const getAreaAttributes = () =>
            SVGGradientDefsUtils.computePaintAreaAttributes(paintArea?.getPaintArea(), undefined);

        return (
            <linearGradient
                {...baseProps}
                id={id}
                gradientUnits={getAreaAttributes().gradientUnits}
                gradientTransform={getAreaAttributes().gradientTransform}
                x1={getCoords().x1}
                y1={getCoords().y1}
                x2={getCoords().x2}
                y2={getCoords().y2}
            >
                {typeof custom === "function" ? custom(initial.x1, initial.y1, initial.x2, initial.y2) : custom}
                {renderStops(id, getColors, spreadKind)}
            </linearGradient>
        );
    };

    /**
     * Builds a radial gradient.
     *
     * Must run inside a component or another reactive owner.
     *
     * @param defs The gradient: its id, the `colors`, an `origin` to radiate from, a `scale` for its
     * radius, and `aspect` and `angle` for squashing and turning it into an ellipse. `elementSize`
     * holds the gradient round on an oblong element rather than letting it follow the box.
     * `spreadKind` is `"banded"` for hard-edged rings, anything else for a smooth blend. Remaining
     * properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given
     * as a function, it receives the gradient's initial center and radius.
     * @returns The `radialGradient` element, which a fill points at with `url(#…)`.
     */
    export const computeRadialGradient = (
        defs: SVGRadialGradientSolidDefs,
        custom?: JSX.Element | ((cx: number, cy: number, r: number) => JSX.Element),
    ) => {
        const { id, colors, origin, scale, aspect, angle, elementSize, spreadKind, ...baseProps } = defs;
        const getColors = () => access(colors);
        const getGeometry = () =>
            SVGGradientDefsUtils.computeRadialGeometry({
                origin: access(origin),
                scale: access(scale),
                aspect: access(aspect),
                angle: access(angle),
                elementSize: access(elementSize),
            });
        const initial = untrack(getGeometry);
        const paintArea = usePaintAreaContext();
        const getAreaAttributes = () =>
            SVGGradientDefsUtils.computePaintAreaAttributes(paintArea?.getPaintArea(), getGeometry().gradientTransform);

        return (
            <radialGradient
                {...baseProps}
                id={id}
                cx={getGeometry().cx}
                cy={getGeometry().cy}
                r={getGeometry().r}
                gradientUnits={getAreaAttributes().gradientUnits}
                gradientTransform={getAreaAttributes().gradientTransform}
            >
                {typeof custom === "function" ? custom(initial.cx, initial.cy, initial.r) : custom}
                {renderStops(id, getColors, spreadKind)}
            </radialGradient>
        );
    };
}
