import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { TriangleS2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import type { TimedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

const PatternElement = (props: { id: string; defs: TimedPatternElementDefs }) => {
    const getSplitValues = SVGDefsReactUtils.useSplitValues();
    const cellSize = props.defs.cellSize;

    return (
        <>
            <path
                id={`${props.id}-triangle-right`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle_right", cellSize))}
            />
            <path
                id={`${props.id}-triangle-left`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle_left", cellSize))}
            />
            {SVGPatterns.computeTriangleSidewaysPattern(
                `pattern1-${props.id}`,
                TriangleS2Const.CELL_COUNT,
                cellSize,
                (cellId, index, cellCount, isSplit) => {
                    const isEven = MathUtils.isEven(index.col + index.row);
                    const shapeId = isEven ? `${props.id}-triangle-right` : `${props.id}-triangle-left`;
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

export const triangle_s_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
