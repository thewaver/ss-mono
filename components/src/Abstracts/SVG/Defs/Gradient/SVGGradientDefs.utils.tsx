import type { JSX } from "solid-js";
import { untrack } from "solid-js";

import { SVGUtils } from "@thewaver/ss-utils";

import { access } from "../../../../Utils/propUtils";
import type { SVGLinearGradientDefs, SVGRadialGradientDefs } from "./SVGGradientDefs.types";

type GradientColors = { value: string; stop?: number }[];

export namespace SVGGradientDefsUtils {
    const resolveStops = (colors: GradientColors) =>
        colors.map((c, i) => {
            const prevIdx = colors.findLastIndex((x, j) => j <= i && x.stop != null);
            const nextIdx = colors.findIndex((x, j) => j >= i && x.stop != null);

            const prevStop = prevIdx >= 0 ? colors[prevIdx].stop! : 0;
            const nextStop = nextIdx >= 0 ? colors[nextIdx].stop! : 100;

            const prev = prevIdx >= 0 ? prevIdx : 0;
            const next = nextIdx >= 0 ? nextIdx : colors.length - 1;

            return (
                c.stop ?? (prev === next ? prevStop : prevStop + ((nextStop - prevStop) * (i - prev)) / (next - prev))
            );
        });

    const renderSmoothGradientStops = (getColors: () => GradientColors, id: string) =>
        untrack(getColors).map((_unused, i) => (
            <stop
                id={`${id}-stop-${i}`}
                offset={`${resolveStops(getColors())[i]}%`}
                stop-color={getColors()[i].value}
            />
        ));

    const renderBandedGradientStops = (getColors: () => GradientColors, id: string) => {
        const count = untrack(getColors).length;

        if (!count) return [];

        const stops: JSX.Element[] = [<stop id={`${id}-stop-0-start`} offset="0%" stop-color={getColors()[0].value} />];

        for (let i = 1; i < count; i++) {
            stops.push(
                <stop
                    id={`${id}-stop-${i - 1}-end`}
                    offset={`${resolveStops(getColors())[i]}%`}
                    stop-color={getColors()[i - 1].value}
                />,
            );
            stops.push(
                <stop
                    id={`${id}-stop-${i}-start`}
                    offset={`${resolveStops(getColors())[i]}%`}
                    stop-color={getColors()[i].value}
                />,
            );
        }

        return stops;
    };

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

    const DEFAULT_RADIAL_ORIGIN = { x: 0.5, y: 0.5 };

    export const computeRadialGradient = (
        defs: SVGRadialGradientDefs,
        custom?: JSX.Element | ((cx: number, cy: number, r: number) => JSX.Element),
    ) => {
        const { id, colors, origin, scale, aspect, angle, spreadKind, ...baseProps } = defs;
        const getColors = () => access(colors);
        const getOrigin = () => access(origin) ?? DEFAULT_RADIAL_ORIGIN;
        const getRadius = () => 0.5 * (access(scale) ?? 1);
        const getTransform = () =>
            SVGUtils.getRadialTransform({
                origin: getOrigin(),
                aspect: access(aspect),
                angle: access(angle),
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
