import { useId, useState } from "react";

import type { SVGAnimationDefs, SVGAnimationIterationPattern } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";

import { SVGAnimationDefsReactUtils, SVGGradientDefsReactUtils, SVGPatternDefsReactUtils, Shape } from "../../src";

const SHAPE_KINDS: ShapeConst.DefaultShape[] = ["square", "hexagon-flat-top"];
const CELL = { width: 20, height: 20 };

const ITERATION_PATTERNS: Record<string, SVGAnimationIterationPattern[] | undefined> = {
    constant: undefined,
    repeat3_3: [
        { count: 3, nextIndex: 1 },
        { beginDelayMs: 3000, count: 3, nextIndex: 1 },
    ],
    repeat1_1: [
        { count: 1, nextIndex: 1 },
        { beginDelayMs: 1000, count: 1, nextIndex: 1 },
    ],
};

const SweepAnimation = (props: { x1: number; x2: number; defs: SVGAnimationDefs }) => {
    const animate = SVGAnimationDefsReactUtils.useAnimateDefs(props.defs);

    return (
        <>
            <animate
                key={`${animate.key}-x1`}
                attributeName="x1"
                values={`${props.x1};${props.x1 + 1};${props.x1}`}
                {...animate.attributes}
            />
            <animate
                key={`${animate.key}-x2`}
                attributeName="x2"
                values={`${props.x2};${props.x2 + 1};${props.x2}`}
                {...animate.attributes}
            />
        </>
    );
};

export const Default = () => {
    const id = useId();
    const [shapeIndex, setShapeIndex] = useState(0);
    const [jointRadius, setJointRadius] = useState(10);
    const [animationDurationMs, setAnimationDurationMs] = useState(1000);
    const [iterationKey, setIterationKey] = useState("constant");
    const [renderCount, setRenderCount] = useState(0);

    const animationDefs: SVGAnimationDefs = {
        animationDurationMs,
        animationIterationPatterns: ITERATION_PATTERNS[iterationKey],
    };

    return (
        <>
            <div data-testid="shape" style={{ width: 240, height: 160, margin: 40 }}>
                <Shape
                    computePoints={(size) => ShapeConst.getDefaultShapePoints(SHAPE_KINDS[shapeIndex], size)}
                    joinRadii={[jointRadius]}
                    strokeGeom={[{ thicknesses: [6] }]}
                    computeFillDefs={() => [
                        {
                            gradientOrPattern: {
                                id: `fill-${id}`,
                                renderDefsElement: () =>
                                    SVGPatternDefsReactUtils.computePattern(
                                        `fill-${id}`,
                                        { rows: 2, cols: 2 },
                                        { width: CELL.width * 2, height: CELL.height * 2 },
                                        ({ row, col }) => ({ x: col * CELL.width, y: row * CELL.height }),
                                        (cellId, { row, col }) => (
                                            <rect
                                                id={cellId}
                                                width={CELL.width}
                                                height={CELL.height}
                                                fill={(row + col) % 2 ? "#334" : "#556"}
                                            />
                                        ),
                                    ),
                            },
                        },
                    ]}
                    computeStrokeDefs={() => [
                        {
                            gradientOrPattern: {
                                id: `stroke-${id}`,
                                renderDefsElement: () =>
                                    SVGGradientDefsReactUtils.computeLinearGradient(
                                        {
                                            id: `stroke-${id}`,
                                            colors: [{ value: "#FF00FF" }, { value: "#00FFFF" }],
                                        },
                                        (x1, _y1, x2) => <SweepAnimation x1={x1} x2={x2} defs={animationDefs} />,
                                    ),
                            },
                        },
                    ]}
                    renderChildren={(_size, clipPath) => (
                        <div data-testid="content" style={{ clipPath: `path("${clipPath}")`, width: 240, height: 160 }}>
                            I have a border
                        </div>
                    )}
                />
            </div>
            <button data-action="shape" onClick={() => setShapeIndex((index) => (index + 1) % SHAPE_KINDS.length)}>
                shape
            </button>
            <button data-action="radius" onClick={() => setJointRadius(60)}>
                radius
            </button>
            <button data-action="duration" onClick={() => setAnimationDurationMs(3000)}>
                duration
            </button>
            <button data-action="rerender" onClick={() => setRenderCount((count) => count + 1)}>
                {`rerender ${renderCount}`}
            </button>
            {Object.keys(ITERATION_PATTERNS).map((key) => (
                <button key={key} data-iteration={key} onClick={() => setIterationKey(key)}>
                    {key}
                </button>
            ))}
        </>
    );
};
