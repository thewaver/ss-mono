import { Fragment } from "react";

import { type SVGAnimationDefs, SVGAnimationTracks } from "@thewaver/ss-components";
import { SVGUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsReactUtils } from "../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsReact.utils";

const join = (values: number[]) => values.map((value) => `${value}`).join(";");

const LinearGrow = (props: { vName: "x" | "y"; v1: number; v2: number; scales: number[]; defs: SVGAnimationDefs }) => {
    const tracks = SVGAnimationTracks.computeGrowTracks(props.v1, props.v2, props.scales);
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <>
            <animate
                key={`${animate.key}-1`}
                attributeName={`${props.vName}1`}
                values={join(tracks.from)}
                {...animate.attributes}
            />
            <animate
                key={`${animate.key}-2`}
                attributeName={`${props.vName}2`}
                values={join(tracks.to)}
                {...animate.attributes}
            />
        </>
    );
};

const LinearSweepOrthogonal = (props: {
    vName: "x" | "y";
    v1: number;
    v2: number;
    offsets: number[];
    defs: SVGAnimationDefs;
}) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <>
            <animate
                key={`${animate.key}-1`}
                attributeName={`${props.vName}1`}
                values={join(SVGAnimationTracks.computeOffsetTrack(props.v1, props.offsets))}
                {...animate.attributes}
            />
            <animate
                key={`${animate.key}-2`}
                attributeName={`${props.vName}2`}
                values={join(SVGAnimationTracks.computeOffsetTrack(props.v2, props.offsets))}
                {...animate.attributes}
            />
        </>
    );
};

const LinearSweepDiagonal = (props: {
    points: number[][];
    angle: number;
    offsets: number[];
    defs: SVGAnimationDefs;
}) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return props.points.map((point, index) => {
        const tracks = SVGAnimationTracks.computeDiagonalTracks(point[0], point[1], props.angle, props.offsets);

        return (
            <Fragment key={`${animate.key}-${index}`}>
                <animate attributeName={`x${index + 1}`} values={join(tracks.x)} {...animate.attributes} />
                <animate attributeName={`y${index + 1}`} values={join(tracks.y)} {...animate.attributes} />
            </Fragment>
        );
    });
};

const LinearRotate = (props: { angles: number[]; defs: SVGAnimationDefs }) => {
    const tracks = SVGAnimationTracks.computeRotationTracks(props.angles);
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return SVGAnimationTracks.V_KEYS.map((vKey) => (
        <animate
            key={`${animate.key}-${vKey}`}
            attributeName={vKey}
            values={join(tracks[vKey])}
            {...animate.attributes}
        />
    ));
};

const RadialGrow = (props: { radii: number[]; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return <animate key={animate.key} attributeName="r" values={join(props.radii)} {...animate.attributes} />;
};

const RadialSweepOrthogonal = (props: { vName: "cx" | "cy"; values: number[]; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <animate key={animate.key} attributeName={props.vName} values={join(props.values)} {...animate.attributes} />
    );
};

const RadialSweepDiagonal = (props: {
    cx: number;
    cy: number;
    angle: number;
    offsets: number[];
    defs: SVGAnimationDefs;
}) => {
    const tracks = SVGAnimationTracks.computeDiagonalTracks(props.cx, props.cy, props.angle, props.offsets);
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <>
            <animate key={`${animate.key}-cx`} attributeName="cx" values={join(tracks.x)} {...animate.attributes} />
            <animate key={`${animate.key}-cy`} attributeName="cy" values={join(tracks.y)} {...animate.attributes} />
        </>
    );
};

const AnimatedPath = (props: { paths: string[]; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <path d={props.paths[0]}>
            <animate key={animate.key} attributeName="d" values={props.paths.join(";")} {...animate.attributes} />
        </path>
    );
};

const GradientCycleSmoothColors = (props: { gradientId: string; colorTracks: string[][]; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return props.colorTracks.map((stop, index) => (
        <animate
            key={`${animate.key}-${index}`}
            href={`#${props.gradientId}-stop-${index}`}
            attributeName="stop-color"
            values={stop.join(";")}
            {...animate.attributes}
        />
    ));
};

const GradientCycleBandedColors = (props: { gradientId: string; colorTracks: string[][]; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);
    const lastIndex = props.colorTracks.length - 1;

    return props.colorTracks.map((stop, index) => (
        <Fragment key={`${animate.key}-${index}`}>
            <animate
                href={`#${props.gradientId}-stop-${index}-start`}
                attributeName="stop-color"
                values={stop.join(";")}
                {...animate.attributes}
            />

            {index < lastIndex && (
                <animate
                    href={`#${props.gradientId}-stop-${index}-end`}
                    attributeName="stop-color"
                    values={stop.join(";")}
                    {...animate.attributes}
                />
            )}
        </Fragment>
    ));
};

export namespace SVGAnimations {
    export namespace Linear {
        export const grow = (vName: "x" | "y", v1: number, v2: number, scales: number[], defs: SVGAnimationDefs) => (
            <LinearGrow vName={vName} v1={v1} v2={v2} scales={scales} defs={defs} />
        );

        export const sweepOrthogonal = (
            vName: "x" | "y",
            v1: number,
            v2: number,
            offsets: number[],
            defs: SVGAnimationDefs,
        ) => <LinearSweepOrthogonal vName={vName} v1={v1} v2={v2} offsets={offsets} defs={defs} />;

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
            <RadialSweepOrthogonal vName={vName} values={values} defs={defs} />
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
