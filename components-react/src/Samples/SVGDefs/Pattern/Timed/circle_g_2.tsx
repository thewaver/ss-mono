import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { MathUtils } from "@thewaver/ss-utils";

import type { TimedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

const CELL_COUNT = { rows: 8, cols: 8 };

const PatternElement = (props: { id: string; defs: TimedPatternElementDefs }) => {
    const getSplitValues = SVGDefsReactUtils.useSplitValues();
    const cellSize = props.defs.cellSize;
    const r = Math.min(cellSize.width, cellSize.height) * 0.5;

    return SVGPatterns.computeGridPattern(
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

export const circle_g_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
