import { For, createMemo, createSignal, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";

import type { SampleKnob } from "@thewaver/ss-components";
import { SVGDefsSamples, Shape, TimedGradientKnobs, access } from "@thewaver/ss-components";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "../../PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "../../PageComponents/SampleGroups/SampleGroups.types";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import {
    PageCheckField,
    PageColorField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../StyledComponents/Field/Field";
import { DefaultExample } from "./Examples/Default";
import { MorphExample } from "./Examples/Morph";
import { TextWrapExample } from "./Examples/TextWrap";
import type { ShapeExampleProps } from "./ShapePage.types";

import * as styles from "./ShapePage.css";

const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);
const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);

const CORNER_FIELD_WIDTH = 80;
const MIN_EDGE_THICKNESS = 0;
const MAX_EDGE_THICKNESS = 80;
const EDGE_THICKNESS_STEP = 1;
const MIN_JOIN_RADIUS = 0;
const MAX_JOIN_RADIUS = 160;
const JOIN_RADIUS_STEP = 5;
const MIN_LAME_EXPONENT = -5;
const MAX_LAME_EXPONENT = 5;
const LAME_EXPONENT_STEP = 0.5;
const MAX_CORNER_COLUMNS = 6;
const MIN_CELL_SIZE = 10;
const MAX_CELL_SIZE = 160;
const CELL_SIZE_STEP = 10;
const MIN_BLUR_WIDTH = 0;
const MAX_BLUR_WIDTH = 40;
const BLUR_WIDTH_STEP = 1;
const MIN_DURATION_MS = 1000;
const MAX_DURATION_MS = 5000;

const STARTING_BLUR_WIDTH = 8;
const STARTING_DURATION_MS = 2000;
const STARTING_CELL_SIZE = 40;
const DURATION_STEP_MS = 100;

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

const StressTestWrapper = ({
    shouldClipChildren,
    shouldPadChildren,
    shapeKind,
    strokeConfigKey,
    fillConfigKey,
    iterationConfigKey,
    cellSize,
    animationDurationMs,
    colors,
    blurWidth,
    edgeThicknesses,
    strokeConfigDefs,
    ...otherProps
}: ShapeExampleProps) => {
    const id = createUniqueId();

    const getStrokeKey = () => access(strokeConfigKey);
    const getFillKey = () => access(fillConfigKey);
    const getIterationConfig = () => SVGDefsSamples.Iteration.SAMPLE_CONFIGS[access(iterationConfigKey)];

    return (
        <StressTest
            configs={() => STRESS_ITEMS}
            renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} items`}
            renderItem={(getConfigIndex, getItemIndex) => (
                <Shape
                    {...otherProps}
                    joinRadii={() =>
                        access(otherProps.joinRadii)!.map(
                            (n) => (n * STRESS_ITEMS[getConfigIndex()].size) / styles.exampleSize,
                        )
                    }
                    computePoints={(size) => ShapeConst.getDefaultShapePoints(access(shapeKind), size)}
                    computeStrokeDefs={(getSize, getRef) => {
                        const strokeKey = getStrokeKey();

                        if (strokeKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), "stroke");

                        return SVGDefsSamples.Gradient.Timed.toConfig({
                            family: strokeKey,
                            defs: access(strokeConfigDefs),
                        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, undefined, getRef, {
                            getSize,
                            animationDurationMs: access(animationDurationMs),
                            colors: access(colors),
                            blurWidth: access(blurWidth),
                            ...getIterationConfig().computeDefs(access(animationDurationMs)),
                        });
                    }}
                    strokeGeom={() => [
                        {
                            thicknesses: access(edgeThicknesses).map(
                                (t) => (t * STRESS_ITEMS[getConfigIndex()].size) / styles.exampleSize,
                            ),
                        },
                    ]}
                    computeFillDefs={(getSize, getRef) => {
                        const fillKey = getFillKey();

                        if (fillKey === NO_SAMPLE_KEY) return computeNoSampleDefs(access(colors), "fill");

                        return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[fillKey].computeSVGDefs(
                            `fill-${id}`,
                            undefined,
                            getRef,
                            {
                                getSize,
                                cellSize: {
                                    width:
                                        (access(cellSize).width * STRESS_ITEMS[getConfigIndex()].size) /
                                        styles.exampleSize,
                                    height:
                                        (access(cellSize).height * STRESS_ITEMS[getConfigIndex()].size) /
                                        styles.exampleSize,
                                },
                                animationDurationMs: access(animationDurationMs),
                                colors: access(colors),
                                blurWidth: access(blurWidth),
                                ...getIterationConfig().computeDefs(access(animationDurationMs)),
                            },
                        );
                    }}
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
            )}
        />
    );
};

const DefaultExampleWrapper = (props: ShapeExampleProps) => {
    return <DefaultExample {...props} />;
};

export const ShapePage = () => {
    const [getHasIndividualCorners, setHasIndividualCorners] = createSignal(false);
    const [getShouldClipChildren, setShouldClipChildren] = createSignal(true);
    const [getShouldPadChildren, setShouldPadChildren] = createSignal(true);
    const [getBlurWidth, setBlurWidth] = createSignal(STARTING_BLUR_WIDTH);
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(STARTING_DURATION_MS);
    const [getShapeKind, setShapeKind] = createSignal<ShapeConst.DefaultShape>("square");
    const [getEdgeThicknesses, setEdgeThicknesses] = createSignal<number[]>([4, 4, 4, 4, 4, 4]);
    const [getJoinRadii, setJoinRadii] = createSignal<number[]>([40, 40, 40, 40, 40, 40]);
    const [getLameExponents, setLameExponents] = createSignal<number[]>([1, 1, 1, 1, 1, 1]);
    const [getStrokeConfigKey, setStrokeConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>("sweep_diag_1v1");
    const [strokeConfigDefs, setStrokeConfigDefs] = createStore<Record<string, Record<string, number | boolean>>>({});

    const getStrokeKnobs = () => {
        const key = getStrokeConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.KNOBS_BY_FAMILY[key] as Record<string, SampleKnob>);
    };
    const getStrokeDefaults = () => {
        const key = getStrokeConfigKey();

        return key === NO_SAMPLE_KEY ? {} : (TimedGradientKnobs.DEFAULTS_BY_FAMILY[key] as Record<string, unknown>);
    };
    const getStrokeConfigDefs = () => strokeConfigDefs[getStrokeConfigKey()] ?? {};

    const [getFillConfigKey, setFillConfigKey] =
        createSignal<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(NO_SAMPLE_KEY);
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>("constant");
    const [getCellSize, setCellSize] = createSignal(STARTING_CELL_SIZE);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getShapePointCount = createMemo(
        () => ShapeConst.getDefaultShapePoints(getShapeKind(), { width: 0, height: 0 }).length,
    );

    const getPointIterator = createMemo(() => {
        const pointCount = getShapePointCount();

        return Array.from({ length: getHasIndividualCorners() ? pointCount : 1 }, (_, idx) => idx);
    });

    const getTemplateColumns = createMemo(() => {
        const pointCount = getShapePointCount();
        const columns = getHasIndividualCorners() ? Math.min(pointCount * 0.5, MAX_CORNER_COLUMNS) : 1;

        return `repeat(${columns}, 1fr)`;
    });

    const getExamples = createMemo(() => {
        const commonProps: ShapeExampleProps = {
            shouldClipChildren: getShouldClipChildren,
            shouldPadChildren: getShouldPadChildren,
            blurWidth: getBlurWidth,
            animationDurationMs: getAnimationDurationMs,
            colors: () => colors,
            shapeKind: getShapeKind,
            strokeConfigKey: getStrokeConfigKey,
            strokeConfigDefs: getStrokeConfigDefs,
            fillConfigKey: getFillConfigKey,
            iterationConfigKey: getIterationConfigKey,
            cellSize: () => ({ width: getCellSize(), height: getCellSize() }),
            edgeThicknesses: () => getEdgeThicknesses().slice(0, getShapePointCount()),
            joinRadii: () => getJoinRadii().slice(0, getShapePointCount()),
            lameExponents: () => getLameExponents().slice(0, getShapePointCount()),
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
                    "one number from 0 to 1 is read inside computePoints and blends two outlines of eight points each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
                component: () => <MorphExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Morph.tsx`,
            },
            {
                key: "textWrap",
                name: "Text Wrap",
                readout: () =>
                    "the shape writes its outline as shape-outside, so floating it is all the page does for the text to follow the edge",
                component: () => <TextWrapExample {...commonProps} />,
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
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"strokeConfigKey"}
                        label={"Stroke Pattern"}
                        hint={
                            "Which animated gradient paints the shape's outline. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageGroupedSelectField
                            value={getStrokeConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_GRADIENTS)}
                            ariaLabel={"Stroke pattern"}
                            onChange={(config) => setStrokeConfigKey(() => config)}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={getStrokeKnobs}
                        defaults={() => getStrokeDefaults()}
                        values={getStrokeConfigDefs}
                        onInput={(key, value) =>
                            setStrokeConfigDefs(getStrokeConfigKey(), (previous) => ({ ...previous, [key]: value }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        key={"fillConfigKey"}
                        label={"Fill Pattern"}
                        hint={
                            "Which repeating pattern fills the shape's inside. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageGroupedSelectField
                            value={getFillConfigKey}
                            groups={() => toGroupEntriesWithNoSample(GROUPPED_PATTERNS)}
                            ariaLabel={"Fill pattern"}
                            onChange={(config) => setFillConfigKey(() => config)}
                        />
                    </PageProp>

                    <PageProp
                        key={"cellSize"}
                        label={"Fill Cell Size (px)"}
                        hint={"How large one tile of the fill pattern is before it repeats."}
                    >
                        <PageNumberField
                            value={getCellSize}
                            min={() => MIN_CELL_SIZE}
                            max={() => MAX_CELL_SIZE}
                            step={() => CELL_SIZE_STEP}
                            ariaLabel={"Fill cell size"}
                            onInput={setCellSize}
                        />
                    </PageProp>
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
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
                        key={"shouldClipChildren"}
                        label={"Clip children"}
                        hint={
                            "Cuts whatever is inside the shape to the shape's own outline, instead of letting it spill past."
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

                    <PageProp
                        key={"edgeThicknessPx"}
                        label={"Edge Thickness (px)"}
                        hint={
                            "How thick the outline is along each edge. With individual corners off, the first field drives them all."
                        }
                    >
                        <div class={styles.valueList} style={{ "grid-template-columns": getTemplateColumns() }}>
                            <For each={getPointIterator()}>
                                {(_, getIndex) => (
                                    <PageNumberField
                                        value={() => getEdgeThicknesses()[getIndex()]}
                                        min={() => MIN_EDGE_THICKNESS}
                                        max={() => MAX_EDGE_THICKNESS}
                                        step={() => EDGE_THICKNESS_STEP}
                                        width={() => CORNER_FIELD_WIDTH}
                                        ariaLabel={() => `Edge thickness ${getIndex() + 1}`}
                                        onInput={(value) =>
                                            setEdgeThicknesses((prev) =>
                                                spreadCornerValue(prev, getIndex(), value, getHasIndividualCorners()),
                                            )
                                        }
                                    />
                                )}
                            </For>
                        </div>
                    </PageProp>

                    <PageProp
                        key={"jointRadiiPx"}
                        label={"Joint Radii (px)"}
                        hint={
                            "How far each corner is rounded. With individual corners off, the first field drives them all."
                        }
                    >
                        <div class={styles.valueList} style={{ "grid-template-columns": getTemplateColumns() }}>
                            <For each={getPointIterator()}>
                                {(_, getIndex) => (
                                    <PageNumberField
                                        value={() => getJoinRadii()[getIndex()]}
                                        min={() => MIN_JOIN_RADIUS}
                                        max={() => MAX_JOIN_RADIUS}
                                        step={() => JOIN_RADIUS_STEP}
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
                                        min={() => MIN_LAME_EXPONENT}
                                        max={() => MAX_LAME_EXPONENT}
                                        step={() => LAME_EXPONENT_STEP}
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

                    <PageProp
                        key={"shapeKind"}
                        label={"Shape"}
                        hint={
                            "The outline the shape is cut to, which also decides how many corners the corner fields offer."
                        }
                    >
                        <PageSelectField
                            value={getShapeKind}
                            values={() => ShapeConst.DEFAULT_SHAPES}
                            ariaLabel={"Shape"}
                            onChange={(shape) => setShapeKind(() => shape)}
                        />
                    </PageProp>

                    <PageProp
                        key={"colors"}
                        label={"Colors"}
                        hint={"The colors the outline, the fill and the page's own background are painted from."}
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
                        key={"blurWidth"}
                        label={"Blur (px)"}
                        hint={"How far the outline is blurred outward, which is what gives it its glow."}
                    >
                        <PageNumberField
                            value={getBlurWidth}
                            min={() => MIN_BLUR_WIDTH}
                            max={() => MAX_BLUR_WIDTH}
                            step={() => BLUR_WIDTH_STEP}
                            ariaLabel={"Blur width"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <PageProp
                        key={"animationDurationMs"}
                        label={"Animation duration (ms)"}
                        hint={"How long one pass of the stroke or fill animation takes."}
                    >
                        <PageNumberField
                            value={getAnimationDurationMs}
                            min={() => MIN_DURATION_MS}
                            max={() => MAX_DURATION_MS}
                            step={() => DURATION_STEP_MS}
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
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
