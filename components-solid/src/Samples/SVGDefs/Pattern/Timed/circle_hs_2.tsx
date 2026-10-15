import { SVGDefsUtils } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsSolidUtils } from "../../../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsSolid.utils";
import type { TimedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const circle_hs_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => {
        const splitValuesCache: Record<string, string> = {};
        const cellSize = defs.cellSize;
        const cellCount = { rows: 8, cols: 8 };
        const r = Math.min(cellSize.width, cellSize.height) * 0.5;

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => {
                        const animateDefs = SVGAnimationDefsSolidUtils.createAnimateDefs({
                            ...defs,
                            animationDurationMs: defs.animationDurationMs * 4,
                        });

                        return SVGPatterns.computeHalfShiftPattern(
                            `pattern1-${id}`,
                            cellCount,
                            cellSize,
                            (cellId, index, cellCount, isSplit) => {
                                const isEven = MathUtils.isEven(index.col + index.row);
                                const values = SVGDefsUtils.getRandomValuesWithSplitControl(
                                    splitValuesCache,
                                    index,
                                    cellCount,
                                    isSplit,
                                );

                                return (
                                    <circle
                                        id={cellId}
                                        r={r}
                                        cx={cellSize.width * 0.5}
                                        cy={cellSize.height * 0.5}
                                        fill={
                                            SVGDefsUtils.DEBUG_SEAMS && isSplit
                                                ? defs.colors.tertiary
                                                : isEven
                                                  ? defs.colors.primary
                                                  : defs.colors.secondary
                                        }
                                    >
                                        <animate
                                            attributeName="r"
                                            values={values
                                                .split(";")
                                                .map((v) => `${Number(v) * r}`)
                                                .join(";")}
                                            {...animateDefs()}
                                        />
                                    </circle>
                                );
                            },
                        );
                    },
                },
            },
        ];
    },
};
