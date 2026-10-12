import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

export const triangle_sq_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const pieces = SVGDefsUtils.getCellPieces("square_quarters").map((piece) => (
            <path
                id={`${id}-${piece.shape}`}
                d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, defs.cellSize))}
            />
        ));

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => (
                        <>
                            {pieces}
                            {SVGPatterns.computeTrackedLayoutPattern(
                                "square_quarters",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, DEFAULTS),
                                (cellId, index, isSplit, getLevel) => {
                                    const isEven = MathUtils.isEven(index.col + index.row);
                                    const piece = SVGDefsUtils.getCellPiece("square_quarters", index);

                                    return (
                                        <use
                                            id={cellId}
                                            href={`#${id}-${piece.shape}`}
                                            fill-opacity={getLevel()}
                                            fill={
                                                SVGDefsUtils.DEBUG_SEAMS && isSplit
                                                    ? defs.colors.tertiary
                                                    : isEven
                                                      ? defs.colors.primary
                                                      : defs.colors.secondary
                                            }
                                        />
                                    );
                                },
                            )}
                        </>
                    ),
                },
            },
        ];
    },
});
