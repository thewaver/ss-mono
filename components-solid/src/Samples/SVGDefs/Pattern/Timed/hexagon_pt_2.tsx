import { SVGDefsUtils } from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsSolid.utils";
import type { TimedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const hexagon_pt_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => {
        const splitValuesCache: Record<string, string> = {};
        const cellSize = defs.cellSize;
        const cellCount = { rows: 8, cols: 8 };

        const shape = (
            <path
                id={`${id}-hexagon`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("hexagon_pointy_top", cellSize))}
            />
        );

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
                                {shape}
                                {SVGPatterns.computeHexPointyTopPattern(
                                    `pattern1-${id}`,
                                    cellCount,
                                    cellSize,
                                    (cellId, index, cellCount, isSplit) => {
                                        const isEven = MathUtils.isEven(index.row);
                                        const values = SVGDefsUtils.getRandomValuesWithSplitControl(
                                            splitValuesCache,
                                            index,
                                            cellCount,
                                            isSplit,
                                        );

                                        return (
                                            <use
                                                id={cellId}
                                                href={`#${id}-hexagon`}
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
