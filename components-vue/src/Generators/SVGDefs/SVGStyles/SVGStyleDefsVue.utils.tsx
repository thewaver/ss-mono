import {
    type SVGStyleClip,
    SVGStyleDefsUtils,
    type SVGStyleGradientPaint,
    type SVGStylePaint,
    type SVGStyleShadow,
    type SVGStyleSource,
    type SVGStyleTile,
} from "@thewaver/ss-components";
import { SVGUtils, type Size2d } from "@thewaver/ss-utils";

import { SVGClipPath } from "../SVGClipPaths/SVGClipPath";
import type { SVGDefs } from "../SVGDefs.types";
import { SVGGradientDefsVueUtils } from "../SVGGradients/SVGGradientDefsVue.utils";

const SHADOW_SOURCE_COLOR = "black";

const computeClipDefs = (clip: SVGStyleClip): NonNullable<SVGDefs["clipPath"]> => ({
    id: clip.id,
    renderDefsElement: () => (
        <SVGClipPath id={clip.id}>
            {clip.polygons.map((points, index) => (
                <polygon key={index} points={SVGUtils.pointArrayToString(points)} />
            ))}
        </SVGClipPath>
    ),
});

const renderShadowCaster = (shadow: SVGStyleShadow) => {
    if (!shadow.isInset) {
        return [
            <feGaussianBlur in="SourceAlpha" stdDeviation={shadow.stdDeviation} />,
            <feOffset dx={shadow.dx} dy={shadow.dy} result="cast" />,
        ];
    }

    return [
        <feFlood flood-color={SHADOW_SOURCE_COLOR} />,
        <feComposite in2="SourceAlpha" operator="out" />,
        <feOffset dx={shadow.dx} dy={shadow.dy} />,
        <feGaussianBlur stdDeviation={shadow.stdDeviation} result="cast" />,
    ];
};

const computeShadowDefs = (shadow: SVGStyleShadow): SVGDefs => ({
    color: SHADOW_SOURCE_COLOR,
    filter: {
        id: shadow.id,
        renderDefsElement: () => (
            <filter
                id={shadow.id}
                x={shadow.region.x}
                y={shadow.region.y}
                width={shadow.region.width}
                height={shadow.region.height}
                color-interpolation-filters="sRGB"
            >
                {renderShadowCaster(shadow)}
                <feFlood flood-color={shadow.color} />
                <feComposite in2="cast" operator="in" result="shade" />
                {!shadow.isClipped && (
                    <feComposite in="shade" in2="SourceAlpha" operator={shadow.isInset ? "in" : "out"} />
                )}
            </filter>
        ),
    },
});

const renderGradient = (paint: SVGStyleGradientPaint) =>
    paint.kind === "linear_gradient"
        ? SVGGradientDefsVueUtils.computeLinearGradient(paint.gradient)
        : SVGGradientDefsVueUtils.computeRadialGradient(paint.gradient);

const computeTileDefs = (tile: SVGStyleTile, gradient: SVGStyleGradientPaint): SVGDefs => ({
    gradientOrPattern: {
        id: tile.id,
        renderDefsElement: () => [
            renderGradient(gradient),
            <pattern
                id={tile.id}
                patternUnits="userSpaceOnUse"
                x={tile.x}
                y={tile.y}
                width={tile.width}
                height={tile.height}
            >
                <svg
                    width={tile.tileWidth}
                    height={tile.tileHeight}
                    viewBox={`${tile.source.x} ${tile.source.y} ${tile.source.width} ${tile.source.height}`}
                    preserveAspectRatio="none"
                >
                    <rect width={tile.imageWidth} height={tile.imageHeight} fill={`url(#${gradient.gradient.id})`} />
                </svg>
            </pattern>,
        ],
    },
});

const computePaintDefs = (paint: SVGStylePaint): SVGDefs => {
    if (paint.kind === "shadow") return computeShadowDefs(paint.shadow);

    if (paint.kind === "tile") return computeTileDefs(paint.tile, paint.gradient);

    if (paint.kind === "color") {
        return { color: paint.color, clipPath: paint.clip && computeClipDefs(paint.clip) };
    }

    return { gradientOrPattern: { id: paint.gradient.id, renderDefsElement: () => renderGradient(paint) } };
};

/** The Vue side of `SVGStyleDefsUtils`: its descriptions, as the defs records `Shape` paints with. */
export namespace SVGStyleDefsVueUtils {
    /**
     * Converts a computed style into the fill and stroke defs of a `Shape`.
     *
     * See `SVGStyleDefsUtils.computeDefsFromStyle` for what is converted and what is skipped with a warning.
     *
     * @param style The computed style, as `getComputedStyle` returns it.
     * @param size The size of the box being painted.
     * @param id Prefix for the gradient and clip ids, unique in the document.
     * @returns `fillDefs` and `strokeDefs` for `computeFillDefs` and `computeStrokeDefs`, plus `fillGeom`,
     * `strokeGeom`, `joinRadii` and `lameExponents` for the props of those names.
     */
    export const computeDefsFromStyle = (style: SVGStyleSource, size: Size2d, id: string) => {
        const defs = SVGStyleDefsUtils.computeDefsFromStyle(style, size, id);

        return {
            fillDefs: defs.fill.map(computePaintDefs),
            fillGeom: defs.fillGeom,
            strokeDefs: defs.stroke.map(computePaintDefs),
            strokeGeom: defs.strokeGeom,
            joinRadii: defs.joinRadii,
            lameExponents: defs.lameExponents,
        };
    };
}
