import {
    type BracketConnectorDefs,
    type BracketConnectorPaintDefs,
    BracketConnectorPaths,
} from "@thewaver/ss-components";

import type { BracketConnectorFn } from "./BracketConnectorsVue.types";

const getGradient = (paint: BracketConnectorPaintDefs) => (
    <linearGradient
        id={BracketConnectorPaths.getGradientId(paint.defs)}
        gradientUnits="userSpaceOnUse"
        x1={paint.defs.from.x}
        y1={paint.defs.from.y}
        x2={paint.defs.to.x}
        y2={paint.defs.to.y}
    >
        <stop offset="0%" style={{ stopColor: paint.fromColor }} />
        <stop offset="100%" style={{ stopColor: paint.toColor }} />
    </linearGradient>
);

const strokeOnly =
    (build: (defs: BracketConnectorDefs, radius: number) => string): BracketConnectorFn =>
    (paint) => (
        <g>
            <defs>{getGradient(paint)}</defs>

            <path
                d={build(paint.defs, paint.radius)}
                fill="none"
                stroke={BracketConnectorPaths.getStroke(paint.defs)}
                stroke-width={paint.width}
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </g>
    );

export namespace BracketConnectors {
    export const flat = strokeOnly(BracketConnectorPaths.elbow);

    export const rounded = strokeOnly(BracketConnectorPaths.roundedElbow);

    export const curved = strokeOnly(BracketConnectorPaths.curve);

    export const ballAndArrow: BracketConnectorFn = (paint) => {
        return (
            <g>
                <defs>{getGradient(paint)}</defs>

                <path
                    d={BracketConnectorPaths.roundedElbow(paint.defs, paint.radius)}
                    fill="none"
                    stroke={BracketConnectorPaths.getStroke(paint.defs)}
                    stroke-width={paint.width}
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />

                <circle
                    cx={paint.defs.to.x}
                    cy={paint.defs.to.y}
                    r={BracketConnectorPaths.getBallRadius(paint.width)}
                    style={{ fill: paint.toColor }}
                />

                <polygon points={BracketConnectorPaths.getArrowPoints(paint.defs)} style={{ fill: paint.fromColor }} />
            </g>
        );
    };

    export const SAMPLE_CONNECTORS = { flat, rounded, curved, ball_and_arrow: ballAndArrow } satisfies Record<
        string,
        BracketConnectorFn
    >;

    export type SampleKey = keyof typeof SAMPLE_CONNECTORS;

    export const SAMPLE_KEYS = Object.keys(SAMPLE_CONNECTORS) as SampleKey[];
}
