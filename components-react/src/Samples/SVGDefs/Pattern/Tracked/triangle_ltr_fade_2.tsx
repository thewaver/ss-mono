import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedPatternElementDefs;
    opts?: PatternProximityOpts;
};

const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

const PatternElement = (props: PatternElementProps) => {
    const cellSize = props.defs.cellSize;
    const areaSize = props.defs.getSize();
    const opts = TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS);
    const pointer = SVGDefsReactUtils.usePatternPointer(props.element, areaSize, props.defs.getPointSource?.());
    const computeTrailLevel = SVGDefsReactUtils.usePatternTrail(opts, pointer);

    return (
        <>
            {SVGDefsUtils.getCellPieces("triangle_ltr").map((piece) => (
                <path
                    key={piece.shape}
                    id={`${props.id}-${piece.shape}`}
                    d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, cellSize))}
                />
            ))}
            {SVGPatterns.computeTrackedLayoutPattern(
                "triangle_ltr",
                `pattern1-${props.id}`,
                cellSize,
                areaSize,
                pointer,
                opts,
                computeTrailLevel,
                (cellId, index, isSplit, level) => {
                    const isEven = MathUtils.isEven(index.col + index.row);
                    const piece = SVGDefsUtils.getCellPiece("triangle_ltr", index);

                    return (
                        <use
                            id={cellId}
                            href={`#${props.id}-${piece.shape}`}
                            fillOpacity={level}
                            fill={
                                SVGDefsUtils.DEBUG_SEAMS && isSplit
                                    ? props.defs.colors.tertiary
                                    : isEven
                                      ? props.defs.colors.primary
                                      : props.defs.colors.secondary
                            }
                        />
                    );
                },
            )}
        </>
    );
};

export const triangle_ltr_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} element={element} defs={defs} opts={opts} />,
            },
        },
    ],
});
