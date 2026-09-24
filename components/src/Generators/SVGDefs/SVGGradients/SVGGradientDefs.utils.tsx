import type { JSX } from "solid-js";
import { Index, createMemo, untrack } from "solid-js";

import { SVGUtils } from "@thewaver/ss-utils";

import { access } from "../../../Utils/propUtils";
import type { SVGLinearGradientDefs, SVGRadialGradientDefs } from "./SVGGradientDefs.types";

/** A gradient's colors, each optionally pinned to a percentage along it. */
type GradientColors = { value: string; stop?: number }[];

/** The first color in a run, which opens the gradient at nought and needs no closing stop before it. */
const FIRST_COLOR_INDEX = 0;

/** A radial gradient radiates from the center unless told otherwise. */
const DEFAULT_RADIAL_ORIGIN = { x: 0.5, y: 0.5 };

/**
 * Fills in the positions of colors that were not given one.
 *
 * Unpinned colors are spread evenly between the pinned ones either side of them, with the start
 * and end of the gradient standing in where there is no pinned color to either side. This is what
 * lets a caller write four colors and get them at nought, a third, two thirds and one.
 */
const resolveStops = (colors: GradientColors) =>
    colors.map((c, i) => {
        const prevIdx = colors.findLastIndex((x, j) => j <= i && x.stop != null);
        const nextIdx = colors.findIndex((x, j) => j >= i && x.stop != null);

        const prevStop = prevIdx >= 0 ? colors[prevIdx].stop! : 0;
        const nextStop = nextIdx >= 0 ? colors[nextIdx].stop! : 100;

        const prev = prevIdx >= 0 ? prevIdx : 0;
        const next = nextIdx >= 0 ? nextIdx : colors.length - 1;

        return c.stop ?? (prev === next ? prevStop : prevStop + ((nextStop - prevStop) * (i - prev)) / (next - prev));
    });

/** One stop per color, so the colors blend into each other. */
const renderSmoothGradientStops = (getColors: () => GradientColors, id: string) => {
    const getStops = createMemo(() => resolveStops(getColors()));

    return (
        <Index each={getColors()}>
            {(getColor, i) => (
                <stop id={`${id}-stop-${i}`} offset={`${getStops()[i]}%`} stop-color={getColor().value} />
            )}
        </Index>
    );
};

/** Two stops per boundary, so each color holds to its band and changes abruptly at the edge rather than blending. */
const renderBandedGradientStops = (getColors: () => GradientColors, id: string) => {
    const getStops = createMemo(() => resolveStops(getColors()));

    return (
        <Index each={getColors()}>
            {(getColor, i) =>
                i === FIRST_COLOR_INDEX ? (
                    <stop id={`${id}-stop-${i}-start`} offset="0%" stop-color={getColor().value} />
                ) : (
                    <>
                        <stop
                            id={`${id}-stop-${i - 1}-end`}
                            offset={`${getStops()[i]}%`}
                            stop-color={getColors()[i - 1].value}
                        />
                        <stop id={`${id}-stop-${i}-start`} offset={`${getStops()[i]}%`} stop-color={getColor().value} />
                    </>
                )
            }
        </Index>
    );
};

/**
 * Builds `linearGradient` and `radialGradient` definitions, with the stops worked out from the
 * colors.
 *
 * Two things are handled that raw SVG does not. A gradient can be described by an angle rather than
 * by two endpoints, which is how CSS describes one and how a caller expects to. And the colors may
 * be given without positions, in which case they are spread evenly.
 *
 * Everything is read through accessors, so a gradient re-renders as its angle or its colors change
 * rather than being rebuilt.
 */
export namespace SVGGradientDefsUtils {
    /**
     * Builds a linear gradient.
     *
     * @param defs The gradient: its id, the `angle` it runs at, an `offset` and `scale` for shifting
     * and shortening it, the `colors`, and `spreadKind` — `"banded"` for hard-edged bands, anything
     * else for a smooth blend. Remaining properties are passed to the element.
     * @param custom Extra content to place inside the gradient before the stops, for animating it. Given
     * as a function, it receives the gradient's initial endpoints.
     * @returns The `linearGradient` element, which a fill points at with `url(#…)`.
     */
    export const computeLinearGradient = (
        defs: SVGLinearGradientDefs,
        custom?: JSX.Element | ((x1: number, y1: number, x2: number, y2: number) => JSX.Element),
    ) => {
        const { id, angle, offset, scale, colors, spreadKind, ...baseProps } = defs;
        const getColors = () => access(colors);
        const getCoords = () =>
            SVGUtils.getLinearCoords({ angle: access(angle), offset: access(offset), scale: access(scale) });
        const initial = untrack(getCoords);

        return (
            <linearGradient
                {...baseProps}
                id={id}
                x1={getCoords().x1}
                y1={getCoords().y1}
                x2={getCoords().x2}
                y2={getCoords().y2}
            >
                {typeof custom === "function" ? custom(initial.x1, initial.y1, initial.x2, initial.y2) : custom}
                {spreadKind === "banded"
                    ? renderBandedGradientStops(getColors, id)
                    : renderSmoothGradientStops(getColors, id)}
            </linearGradient>
        );
    };

    /**
     * Builds a radial gradient.
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
        defs: SVGRadialGradientDefs,
        custom?: JSX.Element | ((cx: number, cy: number, r: number) => JSX.Element),
    ) => {
        const { id, colors, origin, scale, aspect, angle, elementSize, spreadKind, ...baseProps } = defs;
        const getColors = () => access(colors);
        const getOrigin = () => access(origin) ?? DEFAULT_RADIAL_ORIGIN;
        const getRadius = () => 0.5 * (access(scale) ?? 1);
        const getTransform = () =>
            SVGUtils.getRadialTransform({
                origin: getOrigin(),
                aspect: access(aspect),
                angle: access(angle),
                elementSize: access(elementSize),
            });
        const initialOrigin = untrack(getOrigin);
        const initialRadius = untrack(getRadius);

        return (
            <radialGradient
                {...baseProps}
                id={id}
                cx={getOrigin().x}
                cy={getOrigin().y}
                r={getRadius()}
                gradientTransform={getTransform()}
            >
                {typeof custom === "function" ? custom(initialOrigin.x, initialOrigin.y, initialRadius) : custom}
                {spreadKind === "banded"
                    ? renderBandedGradientStops(getColors, id)
                    : renderSmoothGradientStops(getColors, id)}
            </radialGradient>
        );
    };
}
