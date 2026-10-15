import { SVGDefsUtils } from "@thewaver/ss-components";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsSolid.utils";
import type { TimedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const triangle_sq_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => {
        const splitValuesCache: Record<string, string> = {};
        const cellSize = defs.cellSize;
        const cellCount = { rows: 8, cols: 8 };

        const pieces = SVGDefsUtils.getCellPieces("square_quarters").map((piece) => (
            <path
                id={`${id}-${piece.shape}`}
                d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, cellSize))}
            />
        ));

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => {
                        const animateDefs = SVGAnimationDefsSolidUtils.createAnimateDefs({
                            ...defs,
                            animationDurationMs: defs.animationDurationMs * 4,
                        });

                        return (
                            <>
                                {pieces}
                                {SVGPatterns.computeLayoutPattern(
                                    "square_quarters",
                                    `pattern1-${id}`,
                                    cellCount,
                                    cellSize,
                                    (cellId, index, cellCount, isSplit) => {
                                        const isEven = MathUtils.isEven(index.col + index.row);
                                        const piece = SVGDefsUtils.getCellPiece("square_quarters", index);
                                        const values = SVGDefsUtils.getRandomValuesWithSplitControl(
                                            splitValuesCache,
                                            index,
                                            cellCount,
                                            isSplit,
                                        );

                                        return (
                                            <use
                                                id={cellId}
                                                href={`#${id}-${piece.shape}`}
                                                fill={
                                                    SVGDefsUtils.DEBUG_SEAMS && isSplit
                                                        ? defs.colors.tertiary
                                                        : isEven
                                                          ? defs.colors.primary
                                                          : defs.colors.secondary
                                                }
                                            >
                                                <animate
                                                    attributeName="fill-opacity"
                                                    values={values}
                                                    {...animateDefs()}
                                                />
                                            </use>
                                        );
                                    },
                                )}
                            </>
                        );
                    },
                },
            },
        ];
    },
};
