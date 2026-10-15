import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { LozengeD2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsReactUtils } from "../../../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsReact.utils";
import type { TimedPatternConfig } from "../../SVGDefsReact.types";
import { SVGDefsReactUtils } from "../../SVGDefsReact.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

const PatternElement = (props: { id: string; defs: TimedPatternElementDefs }) => {
    const getSplitValues = SVGDefsReactUtils.useSplitValues();
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs({
        ...props.defs,
        animationDurationMs: props.defs.animationDurationMs * 4,
    });
    const cellSize = props.defs.cellSize;

    return (
        <>
            <path
                id={`${props.id}-lozenge`}
                d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("lozenge", cellSize))}
            />
            {SVGPatterns.computeDiagonalPattern(
                `pattern1-${props.id}`,
                LozengeD2Const.CELL_COUNT,
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
                                key={animate.key}
                                attributeName="fill-opacity"
                                values={values}
                                {...animate.attributes}
                            />
                        </use>
                    );
                },
            )}
        </>
    );
};

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
