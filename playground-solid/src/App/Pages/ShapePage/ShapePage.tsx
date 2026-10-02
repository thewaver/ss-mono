import { For, Show, createMemo, createSignal, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";

import { SVGDefsSamples, Shape, access } from "@thewaver/ss-components-solid";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PagePaintPicker, createPaintSlot } from "../../PageComponents/PaintPicker/PaintPicker";
import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPicker.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import { DefaultExample } from "./Examples/Default";
import { MorphExample } from "./Examples/Morph";
import { SharedPaintExample } from "./Examples/SharedPaint";
import { TextWrapExample } from "./Examples/TextWrap";
import { computeShapeFillDefs, computeShapeStrokeDefs } from "./ShapePage.const";
import type { ShapeExampleProps } from "./ShapePage.types";

const CORNER_FIELD_WIDTH = 80;
const MAX_CORNER_COLUMNS = 6;

const spreadCornerValue = (previous: number[], index: number, value: number, hasIndividualCorners: boolean) => {
    if (!hasIndividualCorners) return previous.map(() => value);

    const next = [...previous];

    next[index] = value;

    return next;
};

const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 40,
        cols: 8,
        gap: 20,
        size: 160,
    },
    {
        count: 160,
        cols: 16,
        gap: 10,
        size: 80,
    },
    {
        count: 640,
        cols: 32,
        gap: 5,
        size: 40,
    },
];

const EXAMPLES_ROOT = "/src/App/Pages/ShapePage/Examples";
const DEFAULT_EXAMPLE_PATH = `${EXAMPLES_ROOT}/Default.tsx`;

const StressTestWrapper = (props: ShapeExampleProps) => {
    const id = createUniqueId();

    return (
        <StressTest
            configs={() => STRESS_ITEMS}
            renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} items`}
            renderItem={(getConfigIndex, getItemIndex) => {
                const getScale = () => STRESS_ITEMS[getConfigIndex()].size / styles.exampleSize;

                return (
                    <Shape
                        lameExponents={props.lameExponents}
                        joinRadii={() => access(props.joinRadii)!.map((n) => n * getScale())}
                        computePoints={(size) => ShapeConst.getDefaultShapePoints(access(props.shapeKind), size)}
                        computeStrokeDefs={(getSize, getRef) =>
                            computeShapeStrokeDefs(id, props, getSize, getRef, undefined, getScale())
                        }
                        strokeGeom={() => [{ thicknesses: access(props.edgeThicknesses).map((t) => t * getScale()) }]}
                        computeFillDefs={(getSize, getRef) =>
                            computeShapeFillDefs(id, props, getSize, getRef, getScale())
                        }
                        renderChildren={(_, getClipPath) => {
                            return (
                                <div
                                    class={styles.stressExample}
                                    style={{
                                        "width": `${STRESS_ITEMS[getConfigIndex()].size}px`,
                                        "height": `${STRESS_ITEMS[getConfigIndex()].size}px`,
                                        "clip-path": `path("${getClipPath()}")`,
                                    }}
                                >
                                    {getItemIndex()}
                                </div>
                            );
                        }}
                    />
                );
            }}
        />
    );
};

const createShapeGeometry = (startingShapeKind: ShapeConst.DefaultShape = ShapeKnobs.STARTING_SHAPE_KIND) => {
    const [getHasIndividualCorners, setHasIndividualCorners] = createSignal(ShapeKnobs.STARTING_HAS_INDIVIDUAL_CORNERS);
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>(startingShapeKind);
    const [getJoinRadii, setJoinRadii] = createSignal<number[]>(ShapeKnobs.STARTING_JOIN_RADII);
    const [getLameExponents, setLameExponents] = createSignal<number[]>(ShapeKnobs.STARTING_LAME_EXPONENTS);

    const getShapePointCount = createMemo(
        () => ShapeConst.getDefaultShapePoints(getShapeKind(), { width: 0, height: 0 }).length,
    );

    const getPointIterator = createMemo(() =>
        Array.from({ length: getHasIndividualCorners() ? getShapePointCount() : 1 }, (_, idx) => idx),
    );

    const getTemplateColumns = createMemo(() => {
        const columns = getHasIndividualCorners() ? Math.min(getShapePointCount() * 0.5, MAX_CORNER_COLUMNS) : 1;

        return `repeat(${columns}, 1fr)`;
    });

    const geometryProps = {
        shapeKind: getShapeKind,
        joinRadii: () => getJoinRadii().slice(0, getShapePointCount()),
        lameExponents: () => getLameExponents().slice(0, getShapePointCount()),
    };

    const renderKnobs = () => (
        <>
            <PageProp
                key={"shapeKind"}
                label={"Shape"}
                hint={"The contour the shape is cut to, which also decides how many corners the corner fields offer."}
            >
                <PageSelectField
                    value={getShapeKind}
                    values={() => ShapeConst.DEFAULT_SHAPES}
                    ariaLabel={"Shape"}
                    onChange={(shape) => setShapeKind(() => shape)}
                />
            </PageProp>

            <PageProp
                key={"hasIndividualCorners"}
                label={"Individual corner settings"}
                hint={"Opens one field per corner instead of one field driving all of them together."}
            >
                <PageCheckField
                    value={getHasIndividualCorners}
                    ariaLabel={"Individual corner settings"}
                    onChange={setHasIndividualCorners}
                />
            </PageProp>

            <PageProp
                key={"jointRadiiPx"}
                label={"Joint Radii (px)"}
                hint={"How far each corner is rounded. With individual corners off, the first field drives them all."}
            >
                <div class={styles.valueList} style={{ "grid-template-columns": getTemplateColumns() }}>
                    <For each={getPointIterator()}>
                        {(_, getIndex) => (
                            <PageNumberField
                                value={() => getJoinRadii()[getIndex()]}
                                min={() => ShapeKnobs.MIN_JOIN_RADIUS}
                                max={() => ShapeKnobs.MAX_JOIN_RADIUS}
                                step={() => ShapeKnobs.JOIN_RADIUS_STEP}
                                width={() => CORNER_FIELD_WIDTH}
                                id={() => `jointRadius${getIndex() + 1}`}
                                ariaLabel={() => `Joint radius ${getIndex() + 1}`}
                                onInput={(value) =>
                                    setJoinRadii((prev) =>
                                        spreadCornerValue(prev, getIndex(), value, getHasIndividualCorners()),
                                    )
                                }
                            />
                        )}
                    </For>
                </div>
            </PageProp>

            <PageProp
                key={"lameExponent"}
                label={"Lamé Exponent"}
                hint={
                    "How square or how pinched each rounded corner is: 2 is a circular round, higher is squarer, lower is pinched inward."
                }
            >
                <div class={styles.valueList} style={{ "grid-template-columns": getTemplateColumns() }}>
                    <For each={getPointIterator()}>
                        {(_, getIndex) => (
                            <PageNumberField
                                value={() => getLameExponents()[getIndex()]}
                                min={() => ShapeKnobs.MIN_LAME_EXPONENT}
                                max={() => ShapeKnobs.MAX_LAME_EXPONENT}
                                step={() => ShapeKnobs.LAME_EXPONENT_STEP}
                                width={() => CORNER_FIELD_WIDTH}
                                ariaLabel={() => `Lamé exponent ${getIndex() + 1}`}
                                onInput={(value) =>
                                    setLameExponents((prev) =>
                                        spreadCornerValue(prev, getIndex(), value, getHasIndividualCorners()),
                                    )
                                }
                            />
                        )}
                    </For>
                </div>
            </PageProp>
        </>
    );

    return { geometryProps, renderKnobs };
};

const DefaultExampleWrapper = (props: ShapeExampleProps) => {
    const { geometryProps, renderKnobs } = createShapeGeometry();

    const [getShouldClipChildren, setShouldClipChildren] = createSignal(ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN);
    const [getShouldPadChildren, setShouldPadChildren] = createSignal(ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN);

    return (
        <>
            <DefaultExample
                {...props}
                {...geometryProps}
                shouldClipChildren={getShouldClipChildren}
                shouldPadChildren={getShouldPadChildren}
            />

            <PageExampleKnobs>
                {renderKnobs()}

                <PageProp
                    key={"shouldClipChildren"}
                    label={"Clip children"}
                    hint={
                        "Cuts whatever is inside the shape to the shape's own contour, instead of letting it spill past."
                    }
                >
                    <PageCheckField
                        value={getShouldClipChildren}
                        ariaLabel={"Clip children"}
                        onChange={setShouldClipChildren}
                    />
                </PageProp>

                <PageProp
                    key={"shouldPadChildren"}
                    label={"Pad children"}
                    hint={
                        "Insets whatever is inside far enough to clear the rounded corners, so text does not run under them."
                    }
                >
                    <PageCheckField
                        value={getShouldPadChildren}
                        ariaLabel={"Pad children"}
                        onChange={setShouldPadChildren}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const MorphExampleWrapper = (props: ShapeExampleProps) => {
    const [getStarPoints, setStarPoints] = createSignal(ShapeKnobs.STARTING_STAR_POINTS);

    return (
        <>
            <MorphExample {...props} starPoints={getStarPoints} />

            <PageExampleKnobs>
                <PageProp
                    key={"starPoints"}
                    label={"Star points"}
                    hint={
                        "How many tips the star has. The contour carries twice as many points: one per tip, one per notch between tips."
                    }
                >
                    <PageNumberField
                        value={getStarPoints}
                        min={() => ShapeKnobs.MIN_STAR_POINTS}
                        max={() => ShapeKnobs.MAX_STAR_POINTS}
                        step={() => ShapeKnobs.STAR_POINTS_STEP}
                        ariaLabel={"Star points"}
                        onInput={setStarPoints}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const SharedPaintExampleWrapper = (props: ShapeExampleProps) => {
    const { geometryProps, renderKnobs } = createShapeGeometry();

    return (
        <>
            <SharedPaintExample {...props} {...geometryProps} />

            <PageExampleKnobs>{renderKnobs()}</PageExampleKnobs>
        </>
    );
};

const TextWrapExampleWrapper = (props: ShapeExampleProps) => {
    const { geometryProps, renderKnobs } = createShapeGeometry(ShapeKnobs.STARTING_TEXT_WRAP_SHAPE_KIND);

    return (
        <>
            <TextWrapExample {...props} {...geometryProps} />

            <PageExampleKnobs>{renderKnobs()}</PageExampleKnobs>
        </>
    );
};

export const ShapePage = () => {
    const [getBlurWidth, setBlurWidth] = createSignal(ShapeKnobs.STARTING_BLUR_WIDTH);
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(ShapeKnobs.STARTING_DURATION_MS);
    const [getEdgeThickness, setEdgeThickness] = createSignal(ShapeKnobs.STARTING_EDGE_THICKNESS);
    const stroke = createPaintSlot(ShapeKnobs.STARTING_STROKE_PAINT_KIND);
    const fill = createPaintSlot(ShapeKnobs.STARTING_FILL_PAINT_KIND);
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>(
        ShapeKnobs.STARTING_ITERATION_KEY,
    );
    const [getCellSize, setCellSize] = createSignal(ShapeKnobs.STARTING_CELL_SIZE);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getExamples = createMemo(() => {
        const commonProps: ShapeExampleProps = {
            shouldClipChildren: () => ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
            shouldPadChildren: () => ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
            blurWidth: getBlurWidth,
            animationDurationMs: getAnimationDurationMs,
            colors: () => colors,
            shapeKind: () => ShapeKnobs.STARTING_SHAPE_KIND,
            strokePaint: stroke.getPaint,
            fillPaint: fill.getPaint,
            iterationConfigKey: getIterationConfigKey,
            cellSize: () => ({ width: getCellSize(), height: getCellSize() }),
            edgeThicknesses: () => [getEdgeThickness()],
            joinRadii: () => ShapeKnobs.STARTING_JOIN_RADII,
            lameExponents: () => ShapeKnobs.STARTING_LAME_EXPONENTS,
        };

        return [
            {
                key: "default",
                name: "Default",
                component: () => <DefaultExampleWrapper {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
            {
                key: "morph",
                name: "Morph",
                readout: () =>
                    "one number from 0 to 1 is read inside computePoints and blends two contours of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
                component: () => <MorphExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Morph.tsx`,
            },
            {
                key: "sharedPaint",
                name: "Shared Paint",
                readout: () =>
                    "four shapes painted by one fill and one stroke laid across the whole group, so each shows its own part of a single picture; resize any of them and the picture stretches to the new group",
                component: () => <SharedPaintExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/SharedPaint.tsx`,
            },
            {
                key: "textWrap",
                name: "Text Wrap",
                readout: () =>
                    "the shape writes its contour as shape-outside, so floating it is all the page does for the text to follow the edge",
                component: () => <TextWrapExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/TextWrap.tsx`,
            },
            {
                key: "stressTest",
                name: "Stress Test",
                component: () => <StressTestWrapper {...commonProps} />,
            },
        ];
    });

    return (
        <div class={styles.root} style={assignInlineVars({ [styles.backgroundColor]: colors.background })}>
            <PagePropsGroups>
                <PagePaintPicker
                    paintSlot={stroke}
                    name={"stroke"}
                    label={"Stroke"}
                    hint={
                        "What paints the shape's stroke: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
                    }
                />

                <PagePropsDivider />

                <PagePaintPicker
                    paintSlot={fill}
                    name={"fill"}
                    label={"Fill"}
                    hint={
                        "What paints the shape's inside: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
                    }
                />

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <Show when={getIsUsingKind([stroke.getPaint(), fill.getPaint()], ["pattern"])}>
                        <PageProp
                            key={"cellSize"}
                            label={"Pattern Cell Size (px)"}
                            hint={"How large one tile of a pattern is before it repeats."}
                        >
                            <PageNumberField
                                value={getCellSize}
                                min={() => ShapeKnobs.MIN_CELL_SIZE}
                                max={() => ShapeKnobs.MAX_CELL_SIZE}
                                step={() => ShapeKnobs.CELL_SIZE_STEP}
                                ariaLabel={"Pattern cell size"}
                                onInput={setCellSize}
                            />
                        </PageProp>
                    </Show>

                    <PageProp
                        key={"colors"}
                        label={"Colors"}
                        hint={"The colors the stroke, the fill and the page's own background are painted from."}
                    >
                        <div class={styles.colorList}>
                            <For each={Object.keys(colors)}>
                                {(key) => (
                                    <PageColorField
                                        value={() => colors[key as keyof typeof colors]}
                                        ariaLabel={() => key}
                                        onInput={(value) => setColors(key as keyof typeof colors, value)}
                                    />
                                )}
                            </For>
                        </div>
                    </PageProp>

                    <PageProp
                        key={"strokeThicknessPx"}
                        label={"Stroke Thickness (px)"}
                        hint={"How thick the stroke is."}
                    >
                        <PageNumberField
                            value={getEdgeThickness}
                            min={() => ShapeKnobs.MIN_EDGE_THICKNESS}
                            max={() => ShapeKnobs.MAX_EDGE_THICKNESS}
                            step={() => ShapeKnobs.EDGE_THICKNESS_STEP}
                            ariaLabel={"Stroke thickness"}
                            onInput={setEdgeThickness}
                        />
                    </PageProp>

                    <PageProp
                        key={"blurWidth"}
                        label={"Blur (px)"}
                        hint={"How far the stroke is blurred outward, which is what gives it its glow."}
                    >
                        <PageNumberField
                            value={getBlurWidth}
                            min={() => ShapeKnobs.MIN_BLUR_WIDTH}
                            max={() => ShapeKnobs.MAX_BLUR_WIDTH}
                            step={() => ShapeKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Blur width"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <Show when={getIsUsingKind([stroke.getPaint(), fill.getPaint()], ["pattern", "timed"])}>
                        <PageProp
                            key={"animationDurationMs"}
                            label={"Animation duration (ms)"}
                            hint={"How long one pass of the stroke or fill animation takes."}
                        >
                            <PageNumberField
                                value={getAnimationDurationMs}
                                min={() => ShapeKnobs.MIN_DURATION_MS}
                                max={() => ShapeKnobs.MAX_DURATION_MS}
                                step={() => ShapeKnobs.DURATION_STEP_MS}
                                ariaLabel={"Animation duration"}
                                onInput={setAnimationDurationMs}
                            />
                        </PageProp>

                        <PageProp
                            key={"iterationConfigKey"}
                            label={"Iteration Pattern"}
                            hint={"How the animation repeats: once, endlessly, or back and forth."}
                        >
                            <PageSelectField
                                value={getIterationConfigKey}
                                values={() => SVGDefsSamples.Iteration.SAMPLE_KEYS}
                                ariaLabel={"Iteration pattern"}
                                onChange={(config) => setIterationConfigKey(() => config)}
                            />
                        </PageProp>
                    </Show>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
