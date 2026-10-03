import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsSolid.types";
import { SVGPatterns } from "../../SVGPatterns.const";

const DEFAULTS = TrackedPatternDefaults.GROW_DEFAULTS;

export const circle_g_grow_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, getRef, defs) => {
        const cellSize = defs.cellSize;
        const r = Math.min(cellSize.width, cellSize.height) * 0.5;

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
                                <circle
                                    id={cellId}
                                    r={getLevel() * r}
                                    cx={cellSize.width * 0.5}
                                    cy={cellSize.height * 0.5}
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
