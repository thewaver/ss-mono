import { For, Show } from "solid-js";

import { SVGUtils } from "@thewaver/ss-utils";

import type { SVGAnimationDefs } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefs.types";
import { SVGAnimationDefsUtils } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefs.utils";
import { SVGAnimationTracks } from "./SVGAnimationTracks.const";

const join = (values: number[]) => values.map((value) => `${value}`).join(";");

export namespace SVGAnimations {
    export namespace Linear {
        export const grow = (vName: "x" | "y", v1: number, v2: number, scales: number[], defs: SVGAnimationDefs) => {
            const tracks = SVGAnimationTracks.computeGrowTracks(v1, v2, scales);
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <>
                    <animate attributeName={`${vName}1`} values={join(tracks.from)} {...animateDefs()} />
                    <animate attributeName={`${vName}2`} values={join(tracks.to)} {...animateDefs()} />
                </>
            );
        };

        export const sweepOrthogonal = (
            vName: "x" | "y",
            v1: number,
            v2: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => {
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <>
                    <animate
                        attributeName={`${vName}1`}
                        values={join(SVGAnimationTracks.computeOffsetTrack(v1, offsets))}
                        {...animateDefs()}
                    />
                    <animate
                        attributeName={`${vName}2`}
                        values={join(SVGAnimationTracks.computeOffsetTrack(v2, offsets))}
                        {...animateDefs()}
                    />
                </>
            );
        };

        export const sweepDiagonal = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => {
            const points = [
                [x1, y1],
                [x2, y2],
            ];
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <For each={points}>
                    {(point, getIndex) => {
                        const tracks = SVGAnimationTracks.computeDiagonalTracks(point[0], point[1], angle, offsets);

                        return (
                            <>
                                <animate
                                    attributeName={`x${getIndex() + 1}`}
                                    values={join(tracks.x)}
                                    {...animateDefs()}
                                />
                                <animate
                                    attributeName={`y${getIndex() + 1}`}
                                    values={join(tracks.y)}
                                    {...animateDefs()}
                                />
                            </>
                        );
                    }}
                </For>
            );
        };

        export const rotate = (angles: number[], defs: SVGAnimationDefs) => {
            const tracks = SVGAnimationTracks.computeRotationTracks(angles);
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <For each={SVGAnimationTracks.V_KEYS}>
                    {(vKey) => <animate attributeName={vKey} values={join(tracks[vKey])} {...animateDefs()} />}
                </For>
            );
        };
    }

    export namespace Radial {
        export const grow = (radii: number[], defs: SVGAnimationDefs) => {
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return <animate attributeName="r" values={join(radii)} {...animateDefs()} />;
        };

        export const sweepOrthogonal = (vName: "cx" | "cy", values: number[], defs: SVGAnimationDefs) => {
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return <animate attributeName={vName} values={join(values)} {...animateDefs()} />;
        };

        export const sweepDiagonal = (
            cx: number,
            cy: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => {
            const tracks = SVGAnimationTracks.computeDiagonalTracks(cx, cy, angle, offsets);
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <>
                    <animate attributeName="cx" values={join(tracks.x)} {...animateDefs()} />
                    <animate attributeName="cy" values={join(tracks.y)} {...animateDefs()} />
                </>
            );
        };
    }

    export namespace Path {
        export const rotatingArc = (angles: [rotation: number, arcSize: number][], defs: SVGAnimationDefs) => {
            const paths = angles.map(([rotation, arcSize]) => SVGUtils.getArcPath(arcSize, rotation));
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <path d={paths[0]}>
                    <animate attributeName="d" values={paths.join(";")} {...animateDefs()} />
                </path>
            );
        };

        export const rotatingWedges = (
            wedgeCount: number,
            wedgeThickness: number,
            curvature: number,
            angles: number[],
            defs: SVGAnimationDefs,
        ) => {
            const paths = angles.map((rotation) =>
                SVGUtils.getWedgesPath(wedgeCount, wedgeThickness, rotation, curvature),
            );
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <path d={paths[0]}>
                    <animate attributeName="d" values={paths.join(";")} {...animateDefs()} />
                </path>
            );
        };
    }

    export namespace Gradient {
        export const cycleSmoothColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => {
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);

            return (
                <For each={colorTracks}>
                    {(stop, getIndex) => (
                        <animate
                            {...{ href: `#${gradientId}-stop-${getIndex()}` }}
                            attributeName="stop-color"
                            values={stop.join(";")}
                            {...animateDefs()}
                        />
                    )}
                </For>
            );
        };

        export const cycleBandedColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => {
            const animateDefs = SVGAnimationDefsUtils.createAnimateDefs(defs);
            const lastIndex = colorTracks.length - 1;

            return (
                <For each={colorTracks}>
                    {(stop, getIndex) => (
                        <>
                            <animate
                                {...{ href: `#${gradientId}-stop-${getIndex()}-start` }}
                                attributeName="stop-color"
                                values={stop.join(";")}
                                {...animateDefs()}
                            />

                            <Show when={getIndex() < lastIndex}>
                                <animate
                                    {...{ href: `#${gradientId}-stop-${getIndex()}-end` }}
                                    attributeName="stop-color"
                                    values={stop.join(";")}
                                    {...animateDefs()}
                                />
                            </Show>
                        </>
                    )}
                </For>
            );
        };
    }
}
