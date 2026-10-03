import { defineComponent } from "vue";

import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

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
            const r = Math.min(cellSize.width, cellSize.height) * 0.5;

            return SVGPatterns.computeHalfDropPattern(
                `pattern1-${props.id}`,
                CELL_COUNT,
                cellSize,
                (cellId, index, cellCount, isSplit) => {
                    const isEven = MathUtils.isEven(index.col + index.row);
                    const values = getSplitValues(cellId, index, cellCount, isSplit);

                    return (
                        <circle
                            id={cellId}
                            r={r}
                            cx={cellSize.width * 0.5}
                            cy={cellSize.height * 0.5}
                            fill={
                                SVGDefsUtils.DEBUG_SEAMS && isSplit
                                    ? props.defs.colors.tertiary
                                    : isEven
                                      ? props.defs.colors.primary
                                      : props.defs.colors.secondary
                            }
                        >
                            <animate
                                attributeName="r"
                                values={values
                                    .split(";")
                                    .map((v) => `${Number(v) * r}`)
                                    .join(";")}
                                dur={`${props.defs.animationDurationMs * 4}ms`}
                                repeatCount="indefinite"
                            />
                        </circle>
                    );
                },
            );
        };
    },
    { name: "PatternElement", props: declareProps<PatternElementProps>({ id: null, defs: null }) },
);

export const circle_hd_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
