import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TrackedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedPatternElementDefs;
    opts?: PatternProximityOpts;
};

const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

const PatternElement = (props: PatternElementProps) => {
    const cellSize = props.defs.cellSize;
    const areaSize = props.defs.getSize();
    const opts = TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS);
    const pointer = SVGDefsReactUtils.usePatternPointer(props.element, areaSize, props.defs.getPointSource?.());
    const computeTrailLevel = SVGDefsReactUtils.usePatternTrail(opts, pointer);

    return (
        <>
            <path
                id={`${props.id}-triangle-up`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-up", cellSize))}
            />
            <path
                id={`${props.id}-triangle-down`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle-down", cellSize))}
            />
            {SVGPatterns.computeTrackedLayoutPattern(
                "triangle",
                `pattern1-${props.id}`,
                cellSize,
                areaSize,
                pointer,
                opts,
                computeTrailLevel,
                (cellId, index, isSplit, level) => {
                    const isEven = MathUtils.isEven(index.col + index.row);

                    return (
                        <use
                            id={cellId}
                            href={isEven ? `#${props.id}-triangle-up` : `#${props.id}-triangle-down`}
                            fillOpacity={level}
                            fill={
                                SVGDefsUtils.DEBUG_SEAMS && isSplit
                                    ? props.defs.colors.tertiary
                                    : isEven
                                      ? props.defs.colors.primary
                                      : props.defs.colors.secondary
                            }
                        />
                    );
                },
            )}
        </>
    );
};

export const triangle_t_fade_2 = (opts?: PatternProximityOpts): TrackedPatternConfig => ({
    computeSVGDefs: (id, __, element, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} element={element} defs={defs} opts={opts} />,
            },
        },
    ],
});
