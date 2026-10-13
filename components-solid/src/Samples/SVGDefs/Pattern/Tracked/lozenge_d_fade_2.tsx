import { type PatternProximityOpts, SVGDefsUtils, TrackedPatternUtils } from "@thewaver/ss-components";
import { LozengeDFade2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

export const lozenge_d_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const shape = (
            <path
                id={`${id}-lozenge`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("lozenge", defs.cellSize))}
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
                                "diagonal",
                                `pattern1-${id}`,
                                getRef,
                                defs,
                                TrackedPatternUtils.resolveOpts(opts, LozengeDFade2Const.DEFAULTS),
                                (cellId, index, isSplit, getLevel) => (
                                    <use
                                        id={cellId}
                                        href={`#${id}-lozenge`}
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
