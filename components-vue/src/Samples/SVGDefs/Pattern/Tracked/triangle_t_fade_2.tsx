import { defineComponent } from "vue";

import {
    type PatternProximityOpts,
    SVGDefsUtils,
    TrackedPatternDefaults,
    type TrackedPatternElementDefs,
    TrackedPatternUtils,
} from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { declareProps } from "../../../../Utils/propUtils";
import type { TrackedPatternConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = {
    id: string;
    element: HTMLElement | undefined;
    defs: TrackedPatternElementDefs;
    opts?: PatternProximityOpts;
};

const DEFAULTS = TrackedPatternDefaults.FADE_DEFAULTS;

const PatternElement = defineComponent(
    (props: PatternElementProps) => {
        const getPointer = SVGDefsVueUtils.usePatternPointer(
            () => props.element,
            () => props.defs.getSize(),
        );

        return () => {
            const cellSize = props.defs.cellSize;
            const areaSize = props.defs.getSize();
            const pointer = getPointer();

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
                        TrackedPatternUtils.resolveOpts(props.opts, DEFAULTS),
                        (cellId, index, isSplit, level) => {
                            const isEven = MathUtils.isEven(index.col + index.row);

                            return (
                                <use
                                    id={cellId}
                                    href={isEven ? `#${props.id}-triangle-up` : `#${props.id}-triangle-down`}
                                    fill-opacity={level}
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
    },
    {
        name: "PatternElement",
        props: declareProps<PatternElementProps>({ id: null, element: null, defs: null, opts: null }),
    },
);

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
