import { defineComponent } from "vue";

import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { declareProps } from "../../../../Utils/propUtils";
import type { TimedPatternConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = { id: string; defs: TimedPatternElementDefs };

const CELL_COUNT = { rows: 8, cols: 8 };

const PatternElement = defineComponent(
    (props: PatternElementProps) => {
        const getSplitValues = SVGDefsVueUtils.useSplitValues();

        return () => {
            const cellSize = props.defs.cellSize;

            return (
                <>
                    <path
                        id={`${props.id}-lozenge`}
                        d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("lozenge", cellSize))}
                    />
                    {SVGPatterns.computeDiagonalPattern(
                        `pattern1-${props.id}`,
                        CELL_COUNT,
                        cellSize,
                        (cellId, index, cellCount, isSplit) => {
                            const isEven = MathUtils.isEven(index.row);
                            const values = getSplitValues(cellId, index, cellCount, isSplit);

                            return (
                                <use
                                    id={cellId}
                                    href={`#${props.id}-lozenge`}
                                    fill={
                                        SVGDefsUtils.DEBUG_SEAMS && isSplit
                                            ? props.defs.colors.tertiary
                                            : isEven
                                              ? props.defs.colors.primary
                                              : props.defs.colors.secondary
                                    }
                                >
                                    <animate
                                        attributeName="fill-opacity"
                                        values={values}
                                        dur={`${props.defs.animationDurationMs * 4}ms`}
                                        repeatCount="indefinite"
                                    />
                                </use>
                            );
                        },
                    )}
                </>
            );
        };
    },
    { name: "PatternElement", props: declareProps<PatternElementProps>({ id: null, defs: null }) },
);

export const lozenge_d_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
