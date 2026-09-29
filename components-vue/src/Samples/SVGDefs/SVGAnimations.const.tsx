import { Fragment, defineComponent } from "vue";

import { type SVGAnimationDefs, SVGAnimationTracks } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsVueUtils } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsVue.utils";
import { declareProps } from "../../Utils/propUtils";

type LinearGrowProps = { valueName: "x" | "y"; v1: number; v2: number; scales: number[]; defs: SVGAnimationDefs };

type LinearSweepOrthogonalProps = {
    valueName: "x" | "y";
    v1: number;
    v2: number;
    offsets: number[];
    defs: SVGAnimationDefs;
};

type LinearSweepDiagonalProps = { points: number[][]; angle: number; offsets: number[]; defs: SVGAnimationDefs };

type LinearRotateProps = { angles: number[]; defs: SVGAnimationDefs };

type RadialGrowProps = { radii: number[]; defs: SVGAnimationDefs };

type RadialSweepOrthogonalProps = { valueName: "cx" | "cy"; values: number[]; defs: SVGAnimationDefs };

type RadialSweepDiagonalProps = { cx: number; cy: number; angle: number; offsets: number[]; defs: SVGAnimationDefs };

type AnimatedPathProps = { paths: string[]; defs: SVGAnimationDefs };

type GradientCycleColorsProps = { gradientId: string; colorTracks: string[][]; defs: SVGAnimationDefs };

const join = (values: number[]) => values.map((value) => `${value}`).join(";");

const LinearGrow = defineComponent(
    (props: LinearGrowProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => {
            const tracks = SVGAnimationTracks.computeGrowTracks(props.v1, props.v2, props.scales);

            return (
                <>
                    <animate
                        key={`${animate.key.value}-1`}
                        attributeName={`${props.valueName}1`}
                        values={join(tracks.from)}
                        {...animate.attributes.value}
                    />
                    <animate
                        key={`${animate.key.value}-2`}
                        attributeName={`${props.valueName}2`}
                        values={join(tracks.to)}
                        {...animate.attributes.value}
                    />
                </>
            );
        };
    },
    {
        name: "LinearGrow",
        props: declareProps<LinearGrowProps>({ valueName: null, v1: null, v2: null, scales: null, defs: null }),
    },
);

const LinearSweepOrthogonal = defineComponent(
    (props: LinearSweepOrthogonalProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => (
            <>
                <animate
                    key={`${animate.key.value}-1`}
                    attributeName={`${props.valueName}1`}
                    values={join(SVGAnimationTracks.computeOffsetTrack(props.v1, props.offsets))}
                    {...animate.attributes.value}
                />
                <animate
                    key={`${animate.key.value}-2`}
                    attributeName={`${props.valueName}2`}
                    values={join(SVGAnimationTracks.computeOffsetTrack(props.v2, props.offsets))}
                    {...animate.attributes.value}
                />
            </>
        );
    },
    {
        name: "LinearSweepOrthogonal",
        props: declareProps<LinearSweepOrthogonalProps>({
            valueName: null,
            v1: null,
            v2: null,
            offsets: null,
            defs: null,
        }),
    },
);

const LinearSweepDiagonal = defineComponent(
    (props: LinearSweepDiagonalProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () =>
            props.points.map((point, index) => {
                const tracks = SVGAnimationTracks.computeDiagonalTracks(point[0], point[1], props.angle, props.offsets);

                return (
                    <Fragment key={`${animate.key.value}-${index}`}>
                        <animate
                            attributeName={`x${index + 1}`}
                            values={join(tracks.x)}
                            {...animate.attributes.value}
                        />
                        <animate
                            attributeName={`y${index + 1}`}
                            values={join(tracks.y)}
                            {...animate.attributes.value}
                        />
                    </Fragment>
                );
            });
    },
    {
        name: "LinearSweepDiagonal",
        props: declareProps<LinearSweepDiagonalProps>({ points: null, angle: null, offsets: null, defs: null }),
    },
);

const LinearRotate = defineComponent(
    (props: LinearRotateProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => {
            const tracks = SVGAnimationTracks.computeRotationTracks(props.angles);

            return SVGAnimationTracks.V_KEYS.map((vKey) => (
                <animate
                    key={`${animate.key.value}-${vKey}`}
                    attributeName={vKey}
                    values={join(tracks[vKey])}
                    {...animate.attributes.value}
                />
            ));
        };
    },
    { name: "LinearRotate", props: declareProps<LinearRotateProps>({ angles: null, defs: null }) },
);

const RadialGrow = defineComponent(
    (props: RadialGrowProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => (
            <animate
                key={animate.key.value}
                attributeName="r"
                values={join(props.radii)}
                {...animate.attributes.value}
            />
        );
    },
    { name: "RadialGrow", props: declareProps<RadialGrowProps>({ radii: null, defs: null }) },
);

const RadialSweepOrthogonal = defineComponent(
    (props: RadialSweepOrthogonalProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => (
            <animate
                key={animate.key.value}
                attributeName={props.valueName}
                values={join(props.values)}
                {...animate.attributes.value}
            />
        );
    },
    {
        name: "RadialSweepOrthogonal",
        props: declareProps<RadialSweepOrthogonalProps>({ valueName: null, values: null, defs: null }),
    },
);

const RadialSweepDiagonal = defineComponent(
    (props: RadialSweepDiagonalProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => {
            const tracks = SVGAnimationTracks.computeDiagonalTracks(props.cx, props.cy, props.angle, props.offsets);

            return (
                <>
                    <animate
                        key={`${animate.key.value}-cx`}
                        attributeName="cx"
                        values={join(tracks.x)}
                        {...animate.attributes.value}
                    />
                    <animate
                        key={`${animate.key.value}-cy`}
                        attributeName="cy"
                        values={join(tracks.y)}
                        {...animate.attributes.value}
                    />
                </>
            );
        };
    },
    {
        name: "RadialSweepDiagonal",
        props: declareProps<RadialSweepDiagonalProps>({ cx: null, cy: null, angle: null, offsets: null, defs: null }),
    },
);

const AnimatedPath = defineComponent(
    (props: AnimatedPathProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => (
            <path d={props.paths[0]}>
                <animate
                    key={animate.key.value}
                    attributeName="d"
                    values={props.paths.join(";")}
                    {...animate.attributes.value}
                />
            </path>
        );
    },
    { name: "AnimatedPath", props: declareProps<AnimatedPathProps>({ paths: null, defs: null }) },
);

const GradientCycleSmoothColors = defineComponent(
    (props: GradientCycleColorsProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () =>
            props.colorTracks.map((stop, index) => (
                <animate
                    key={`${animate.key.value}-${index}`}
                    href={`#${props.gradientId}-stop-${index}`}
                    attributeName="stop-color"
                    values={stop.join(";")}
                    {...animate.attributes.value}
                />
            ));
    },
    {
        name: "GradientCycleSmoothColors",
        props: declareProps<GradientCycleColorsProps>({ gradientId: null, colorTracks: null, defs: null }),
    },
);

const GradientCycleBandedColors = defineComponent(
    (props: GradientCycleColorsProps) => {
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => props.defs);

        return () => {
            const lastIndex = props.colorTracks.length - 1;

            return props.colorTracks.map((stop, index) => (
                <Fragment key={`${animate.key.value}-${index}`}>
                    <animate
                        href={`#${props.gradientId}-stop-${index}-start`}
                        attributeName="stop-color"
                        values={stop.join(";")}
                        {...animate.attributes.value}
                    />

                    {index < lastIndex && (
                        <animate
                            href={`#${props.gradientId}-stop-${index}-end`}
                            attributeName="stop-color"
                            values={stop.join(";")}
                            {...animate.attributes.value}
                        />
                    )}
                </Fragment>
            ));
        };
    },
    {
        name: "GradientCycleBandedColors",
        props: declareProps<GradientCycleColorsProps>({ gradientId: null, colorTracks: null, defs: null }),
    },
);

export namespace SVGAnimations {
    export namespace Linear {
        export const grow = (vName: "x" | "y", v1: number, v2: number, scales: number[], defs: SVGAnimationDefs) => (
            <LinearGrow valueName={vName} v1={v1} v2={v2} scales={scales} defs={defs} />
        );

        export const sweepOrthogonal = (
            vName: "x" | "y",
            v1: number,
            v2: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => <LinearSweepOrthogonal valueName={vName} v1={v1} v2={v2} offsets={offsets} defs={defs} />;

        export const sweepDiagonal = (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => (
            <LinearSweepDiagonal
                points={[
                    [x1, y1],
                    [x2, y2],
                ]}
                angle={angle}
                offsets={offsets}
                defs={defs}
            />
        );

        export const rotate = (angles: number[], defs: SVGAnimationDefs) => (
            <LinearRotate angles={angles} defs={defs} />
        );
    }

    export namespace Radial {
        export const grow = (radii: number[], defs: SVGAnimationDefs) => <RadialGrow radii={radii} defs={defs} />;

        export const sweepOrthogonal = (vName: "cx" | "cy", values: number[], defs: SVGAnimationDefs) => (
            <RadialSweepOrthogonal valueName={vName} values={values} defs={defs} />
        );

        export const sweepDiagonal = (
            cx: number,
            cy: number,
            angle: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => <RadialSweepDiagonal cx={cx} cy={cy} angle={angle} offsets={offsets} defs={defs} />;
    }

    export namespace Path {
        export const rotatingArc = (angles: [rotation: number, arcSize: number][], defs: SVGAnimationDefs) => (
            <AnimatedPath
                paths={angles.map(([rotation, arcSize]) => SVGUtils.getArcPath(arcSize, rotation))}
                defs={defs}
            />
        );

        export const rotatingWedges = (
            wedgeCount: number,
            wedgeThickness: number,
            curvature: number,
            angles: number[],
            defs: SVGAnimationDefs,
        ) => (
            <AnimatedPath
                paths={angles.map((rotation) =>
                    SVGUtils.getWedgesPath(wedgeCount, wedgeThickness, rotation, curvature),
                )}
                defs={defs}
            />
        );
    }

    export namespace Gradient {
        export const cycleSmoothColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => (
            <GradientCycleSmoothColors gradientId={gradientId} colorTracks={colorTracks} defs={defs} />
        );

        export const cycleBandedColors = (gradientId: string, colorTracks: string[][], defs: SVGAnimationDefs) => (
            <GradientCycleBandedColors gradientId={gradientId} colorTracks={colorTracks} defs={defs} />
        );
    }
}
