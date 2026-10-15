import { defineComponent } from "vue";

import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { TriangleT2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeConst, ShapeUtils } from "@thewaver/ss-utils";

import { SVGAnimationDefsVueUtils } from "../../../../Generators/SVGDefs/SVGAnimations/SVGAnimationDefsVue.utils";
import { declareProps } from "../../../../Utils/propUtils";
import type { TimedPatternConfig } from "../../SVGDefsVue.types";
import { SVGDefsVueUtils } from "../../SVGDefsVue.utils";
import { SVGPatterns } from "../../SVGPatterns.const";

type PatternElementProps = { id: string; defs: TimedPatternElementDefs };

const PatternElement = defineComponent(
    (props: PatternElementProps) => {
        const getSplitValues = SVGDefsVueUtils.useSplitValues();
        const animate = SVGAnimationDefsVueUtils.useAnimateDefs(() => ({
            ...props.defs,
            animationDurationMs: props.defs.animationDurationMs * 4,
        }));

        return () => {
            const cellSize = props.defs.cellSize;

            return (
                <>
                    <path
                        id={`${props.id}-triangle-up`}
                        d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle_up", cellSize))}
                    />
                    <path
                        id={`${props.id}-triangle-down`}
                        d={ShapeUtils.pointsToPath(ShapeConst.getDefaultShapePoints("triangle_down", cellSize))}
                    />
                    {SVGPatterns.computeTrianglePattern(
                        `pattern1-${props.id}`,
                        TriangleT2Const.CELL_COUNT,
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
                                        key={animate.key.value}
                                        attributeName="fill-opacity"
                                        values={values}
                                        {...animate.attributes.value}
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

export const triangle_t_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
