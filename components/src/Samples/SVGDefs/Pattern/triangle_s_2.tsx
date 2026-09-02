import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { PatternConfig } from "../SVGDefs.types";
import { SVGDefsUtils } from "../SVGDefs.utils";
import { SVGPatterns } from "../SVGPatterns.const";

export const triangle_s_2: PatternConfig = {
    computeSVGDefs: (id, __, defs) => {
        const splitValuesCache: Record<string, string> = {};
        const cellSize = defs.cellSize;
        const cellCount = { rows: 8, cols: 8 };

        const rightTriangle = (
            <path
                id={`${id}-triangle-right`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-right", cellSize))}
            />
        );

        const leftTriangle = (
            <path
                id={`${id}-triangle-left`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-left", cellSize))}
            />
        );

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => (
                        <>
                            {rightTriangle}
                            {leftTriangle}
                            {SVGPatterns.computeTriangleSidewaysPattern(
                                `pattern1-${id}`,
                                cellCount,
                                cellSize,
                                (cellId, index, cellCount, isSplit) => {
                                    const isEven = MathUtils.isEven(index.col + index.row);
                                    const shapeId = isEven ? `${id}-triangle-right` : `${id}-triangle-left`;
                                    const values = SVGDefsUtils.getRandomValuesWithSplitControl(
                                        splitValuesCache,
                                        index,
                                        cellCount,
                                        isSplit,
                                    );

                                    return (
                                        <use
                                            id={cellId}
                                            href={`#${shapeId}`}
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
                                                dur={`${defs.animationDurationMs * 4}ms`}
                                                repeatCount="indefinite"
                                            />
                                        </use>
                                    );
                                },
                            )}
                        </>
                    ),
                },
            },
        ];
    },
};
