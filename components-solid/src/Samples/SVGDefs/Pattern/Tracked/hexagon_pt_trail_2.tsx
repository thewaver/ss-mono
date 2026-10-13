import { type PatternProximityOpts, SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import { HexagonPtTrail2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const hexagon_pt_trail_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const shape = (
            <path
                id={`${id}-hexagon`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("hexagon_pointy_top", defs.cellSize))}
            />
        );

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () => (
                        <>
                            {shape}
                            {SVGPatterns.computeTrackedLayoutPattern(
                                "hex_pointy_top",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, HexagonPtTrail2Const.DEFAULTS),
                                (cellId, index, isSplit, getLevel) => (
                                    <use
                                        id={cellId}
                                        href={`#${id}-hexagon`}
                                        fill-opacity={getLevel()}
                                        fill={
                                            SVGDefsUtils.DEBUG_SEAMS && isSplit
                                                ? defs.colors.tertiary
                                                : MathUtils.isEven(index.row)
                                                  ? defs.colors.primary
                                                  : defs.colors.secondary
                                        }
                                    />
                                ),
                            )}
                        </>
                    ),
                },
            },
        ];
    },
});
