import { type PatternElementDefs, SVGDefsUtils } from "@thewaver/ss-components";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { PatternConfig } from "../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../SVGDefsReact.utils";
import { SVGPatterns } from "../SVGPatterns.const";

const CELL_COUNT = { rows: 8, cols: 8 };

const PatternElement = (props: { id: string; defs: PatternElementDefs }) => {
    const getSplitValues = SVGDefsReactUtils.useSplitValues();
    const cellSize = props.defs.cellSize;

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
            {SVGPatterns.computeTrianglePattern(
                `pattern1-${props.id}`,
                CELL_COUNT,
                cellSize,
                (cellId, index, cellCount, isSplit) => {
                    const isEven = MathUtils.isEven(index.col + index.row);
                    const shapeId = isEven ? `${props.id}-triangle-up` : `${props.id}-triangle-down`;
                    const values = getSplitValues(cellId, index, cellCount, isSplit);

                    return (
                        <use
                            id={cellId}
                            href={`#${shapeId}`}
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

export const triangle_t_2: PatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
