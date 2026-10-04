import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

const DEFAULTS = TrackedPatternDefaults.TRAIL_DEFAULTS;

export const triangle_t_trail_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const upTriangle = (
            <path
                id={`${id}-triangle-up`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-up", defs.cellSize))}
            />
        );

        const downTriangle = (
            <path
                id={`${id}-triangle-down`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-down", defs.cellSize))}
            />
        );

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => (
                        <>
                            {upTriangle}
                            {downTriangle}
                            {SVGPatterns.computeTrackedLayoutPattern(
                                "triangle",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, DEFAULTS),
                                (cellId, index, isSplit, getLevel) => {
                                    const isEven = MathUtils.isEven(index.col + index.row);

                                    return (
                                        <use
                                            id={cellId}
                                            href={isEven ? `#${id}-triangle-up` : `#${id}-triangle-down`}
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
