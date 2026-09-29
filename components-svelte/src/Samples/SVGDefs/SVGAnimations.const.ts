import { type SVGAnimationDefs, SVGAnimationTracks } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { markup } from "../../Utils/markupUtils.js";
import SVGAnimateGroup from "./SVGAnimateGroup.svelte";
import SVGAnimatedPath from "./SVGAnimatedPath.svelte";
import type { SVGAnimateTrack } from "./SVGAnimationsSvelte.types.js";

const join = (values: number[]) => values.map((value) => `${value}`).join(";");

const animateGroup = (tracks: SVGAnimateTrack[], defs: SVGAnimationDefs) => markup(SVGAnimateGroup, { tracks, defs });

const animatedPath = (paths: string[], defs: SVGAnimationDefs) => markup(SVGAnimatedPath, { paths, defs });

export namespace SVGAnimations {
    export namespace Linear {
        export const grow = (vName: "x" | "y", v1: number, v2: number, scales: number[], defs: SVGAnimationDefs) => {
            const tracks = SVGAnimationTracks.computeGrowTracks(v1, v2, scales);

            return animateGroup(
                [
                    { attributeName: `${vName}1`, values: join(tracks.from) },
                    { attributeName: `${vName}2`, values: join(tracks.to) },
                ],
                defs,
            );
        };

        export const sweepOrthogonal = (
            vName: "x" | "y",
            v1: number,
            v2: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) =>
            animateGroup(
                [
                    { attributeName: `${vName}1`, values: join(SVGAnimationTracks.computeOffsetTrack(v1, offsets)) },
                    { attributeName: `${vName}2`, values: join(SVGAnimationTracks.computeOffsetTrack(v2, offsets)) },
                ],
                defs,
            );

        export const sweepDiagonal = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) =>
            animateGroup(
                [
                    [x1, y1],
                    [x2, y2],
                ].flatMap((point, index) => {
                    const tracks = SVGAnimationTracks.computeDiagonalTracks(point[0], point[1], angle, offsets);

                    return [
                        { attributeName: `x${index + 1}`, values: join(tracks.x) },
                        { attributeName: `y${index + 1}`, values: join(tracks.y) },
                    ];
                }),
                defs,
            );

        export const rotate = (angles: number[], defs: SVGAnimationDefs) => {
            const tracks = SVGAnimationTracks.computeRotationTracks(angles);

            return animateGroup(
                SVGAnimationTracks.V_KEYS.map((vKey) => ({ attributeName: vKey, values: join(tracks[vKey]) })),
                defs,
            );
        };
    }

    export namespace Radial {
        export const grow = (radii: number[], defs: SVGAnimationDefs) =>
            animateGroup([{ attributeName: "r", values: join(radii) }], defs);

        export const sweepOrthogonal = (vName: "cx" | "cy", values: number[], defs: SVGAnimationDefs) =>
            animateGroup([{ attributeName: vName, values: join(values) }], defs);

        export const sweepDiagonal = (
            cx: number,
            cy: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => {
            const tracks = SVGAnimationTracks.computeDiagonalTracks(cx, cy, angle, offsets);

            return animateGroup(
                [
                    { attributeName: "cx", values: join(tracks.x) },
                    { attributeName: "cy", values: join(tracks.y) },
                ],
                defs,
            );
        };
    }

    export namespace Path {
        export const rotatingArc = (angles: [rotation: number, arcSize: number][], defs: SVGAnimationDefs) =>
            animatedPath(
                angles.map(([rotation, arcSize]) => SVGUtils.getArcPath(arcSize, rotation)),
                defs,
            );

        export const rotatingWedges = (
            wedgeCount: number,
            wedgeThickness: number,
            curvature: number,
            angles: number[],
            defs: SVGAnimationDefs,
        ) =>
            animatedPath(
                angles.map((rotation) => SVGUtils.getWedgesPath(wedgeCount, wedgeThickness, rotation, curvature)),
                defs,
            );
    }

    export namespace Gradient {
        export const cycleSmoothColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) =>
            animateGroup(
                colorTracks.map((stop, index) => ({
                    href: `#${gradientId}-stop-${index}`,
                    attributeName: "stop-color",
                    values: stop.join(";"),
                })),
                defs,
            );

        export const cycleBandedColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) =>
            animateGroup(
                colorTracks.flatMap((stop, index) => [
                    { href: `#${gradientId}-stop-${index}-start`, attributeName: "stop-color", values: stop.join(";") },
                    ...(index < colorTracks.length - 1
                        ? [
                              {
                                  href: `#${gradientId}-stop-${index}-end`,
                                  attributeName: "stop-color",
                                  values: stop.join(";"),
                              },
                          ]
                        : []),
                ]),
                defs,
            );
    }
}
