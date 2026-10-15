import { SVGDefsUtils, type TimedPatternElementDefs } from "@thewaver/ss-components";
import { TriangleSq2Const } from "@thewaver/ss-components/internal";
import { MathUtils, ShapeUtils } from "@thewaver/ss-utils";

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
            {SVGDefsUtils.getCellPieces("square_quarters").map((piece) => (
                <path
                    key={piece.shape}
                    id={`${props.id}-${piece.shape}`}
                    d={ShapeUtils.pointsToPath(SVGDefsUtils.computeCellPiecePoints(piece, cellSize))}
                />
            ))}
            {SVGPatterns.computeLayoutPattern(
                "square_quarters",
                `pattern1-${props.id}`,
                TriangleSq2Const.CELL_COUNT,
                cellSize,
                (cellId, index, cellCount, isSplit) => {
                    const isEven = MathUtils.isEven(index.col + index.row);
                    const piece = SVGDefsUtils.getCellPiece("square_quarters", index);
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

export const triangle_sq_2: TimedPatternConfig = {
    computeSVGDefs: (id, __, ___, defs) => [
        {
            gradientOrPattern: {
                id: `pattern1-${id}`,
                renderDefsElement: () => <PatternElement key={id} id={id} defs={defs} />,
            },
        },
    ],
};
