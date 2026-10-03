import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

export const triangle_s_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const rightTriangle = (
            <path
                id={`${id}-triangle-right`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-right", defs.cellSize))}
            />
        );

        const leftTriangle = (
            <path
                id={`${id}-triangle-left`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-left", defs.cellSize))}
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
                            {SVGPatterns.computeTrackedLayoutPattern(
                                "triangleSideways",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, DEFAULTS),
                                (cellId, index, isSplit, getLevel) => {
                                    const isEven = MathUtils.isEven(index.col + index.row);

                                    return (
                                        <use
                                            id={cellId}
                                            href={isEven ? `#${id}-triangle-right` : `#${id}-triangle-left`}
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
