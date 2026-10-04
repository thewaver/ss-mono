import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedPatternElementDefs;
    opts?: PatternProximityOpts;
};

const DEFAULTS = TrackedPatternDefaults.TRAIL_DEFAULTS;

const PatternElement = (props: PatternElementProps) => {
    const cellSize = props.defs.cellSize;
    const areaSize = props.defs.getSize();
    const opts = TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS);
    const pointer = SVGDefsReactUtils.usePatternPointer(props.element, areaSize, props.defs.getPointSource?.());
    const computeTrailLevel = SVGDefsReactUtils.usePatternTrail(opts, pointer);

    return SVGPatterns.computeTrackedLayoutPattern(
        "grid",
        `pattern1-${props.id}`,
        cellSize,
        areaSize,
        pointer,
        opts,
        computeTrailLevel,
        (cellId, index, isSplit, level) => (
            <rect
                id={cellId}
                width={cellSize.width}
                height={cellSize.height}
                fillOpacity={level}
                fill={
                    SVGDefsUtils.DEBUG_SEAMS && isSplit
                        ? props.defs.colors.tertiary
                        : MathUtils.isEven(index.col + index.row)
                          ? props.defs.colors.primary
                          : props.defs.colors.secondary
                }
            />
        ),
    );
};

export const square_g_trail_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} element={element} defs={defs} opts={opts} />,
            },
        },
    ],
});
