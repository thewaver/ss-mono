import { defineComponent } from "vue";

import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

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
                    {SVGDefsUtils.getCellPieces("triangle_rtl").map((piece) => (
                        <path
                            key={piece.shape}
                            id={`${props.id}-${piece.shape}`}
                            d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, cellSize))}
                        />
                    ))}
                    {SVGPatterns.computeLayoutPattern(
                        "triangle_rtl",
                        `pattern1-${props.id}`,
                        CELL_COUNT,
                        cellSize,
                        (cellId, index, cellCount, isSplit) => {
                            const isEven = MathUtils.isEven(index.col + index.row);
                            const piece = SVGDefsUtils.getCellPiece("triangle_rtl", index);
                            const values = getSplitValues(cellId, index, cellCount, isSplit);

                            return (
                                <use
                                    id={cellId}
                                    href={`#${props.id}-${piece.shape}`}
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

export const triangle_rtl_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
