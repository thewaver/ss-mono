import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

const DEFAULTS = TrackedPatternDefaults.TRAIL_DEFAULTS;

export const square_g_trail_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const cellSize = defs.cellSize;

        return [
            {
                gradientOrPattern: {
                    id: `pattern1-${id}`,
                    renderDefsElement: () =>
                        SVGPatterns.computeTrackedLayoutPattern(
                            "grid",
                            `pattern1-${id}`,
                            getRef,
                            defs,
                            TrackedPatternUtils.resolveOpts(opts, DEFAULTS),
                            (cellId, index, isSplit, getLevel) => (
                                <rect
                                    id={cellId}
                                    width={cellSize.width}
                                    height={cellSize.height}
                                    fill-opacity={getLevel()}
                                    fill={
                                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                                            ? defs.colors.tertiary
                                            : MathUtils.isEven(index.col + index.row)
                                              ? defs.colors.primary
                                              : defs.colors.secondary
                                    }
                                />
                            ),
                        ),
                },
            },
        ];
    },
});
