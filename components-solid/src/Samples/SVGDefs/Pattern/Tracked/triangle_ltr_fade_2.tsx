import { type PatternProximityOpts, SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import { TriangleLtrFade2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const triangle_ltr_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const pieces = SVGDefsUtils.getCellPieces("triangle_ltr").map((piece) => (
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
                                "triangle_ltr",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, TriangleLtrFade2Const.DEFAULTS),
                                (cellId, index, isSplit, getLevel) => {
                                    const isEven = MathUtils.isEven(index.col + index.row);
                                    const piece = SVGDefsUtils.getCellPiece("triangle_ltr", index);

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
