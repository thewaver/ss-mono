import { useId, useState } from "react";

import type { SVGDefsColors } from "@thewaver/ss-components-react";
import { SVGDefsSamples, Shape, TimedGradientDefaults } from "@thewaver/ss-components-react";
import {
    NO_SAMPLE_KEY,
    computeNoSampleDefs,
    splitEntriesIntoGroups,
    toGroupEntriesWithNoSample,
} from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.const";
import type { WithNoSample } from "@thewaver/ss-playground/App/PageComponents/SampleGroups/SampleGroups.types";
import * as styles from "@thewaver/ss-playground/App/Pages/ShapePage/ShapePage.css";
import { ShapeConst } from "@thewaver/ss-utils";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ShapeKnobs } from "../../Knobs/Shapes.const";
import { TimedGradientKnobs } from "../../Knobs/TimedGradients.const";
import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageCheckField,
    PageColorField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import { DefaultExample } from "./Examples/Default";
import { MorphExample } from "./Examples/Morph";
import { TextWrapExample } from "./Examples/TextWrap";
import type { ShapeExampleProps } from "./ShapePage.types";

const GROUPPED_GRADIENTS = splitEntriesIntoGroups(SVGDefsSamples.Gradient.Timed.SAMPLE_ENTRIES);
const GROUPPED_PATTERNS = splitEntriesIntoGroups(SVGDefsSamples.Pattern.SAMPLE_CONFIGS);

const STROKE_GROUPS = toGroupEntriesWithNoSample(GROUPPED_GRADIENTS);
const FILL_GROUPS = toGroupEntriesWithNoSample(GROUPPED_PATTERNS);

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
    const id = useId();

    const iterationConfig = SVGDefsSamples.Iteration.SAMPLE_CONFIGS[iterationConfigKey];

    return (
        <StressTest
            configs={STRESS_ITEMS}
            renderLabel={(configIndex) => `Render ${STRESS_ITEMS[configIndex].count} items`}
            renderItem={(configIndex, itemIndex) => (
                <Shape
                    {...otherProps}
                    joinRadii={otherProps.joinRadii!.map(
                        (n) => (n * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                    )}
                    computePoints={(size) => ShapeConst.getDefaultShapePoints(shapeKind, size)}
                    computeStrokeDefs={(size, element) => {
                        if (strokeConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "stroke");

                        return SVGDefsSamples.Gradient.Timed.toConfig({
                            family: strokeConfigKey,
                            defs: strokeConfigDefs,
                        } as SVGDefsSamples.Gradient.Timed.Entry).computeSVGDefs(`stroke-${id}`, undefined, element, {
                            getSize: () => size,
                            animationDurationMs,
                            colors,
                            blurWidth,
                            ...iterationConfig.computeDefs(animationDurationMs),
                        });
                    }}
                    strokeGeom={[
                        {
                            thicknesses: edgeThicknesses.map(
                                (t) => (t * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                            ),
                        },
                    ]}
                    computeFillDefs={(size, element) => {
                        if (fillConfigKey === NO_SAMPLE_KEY) return computeNoSampleDefs(colors, "fill");

                        return SVGDefsSamples.Pattern.SAMPLE_CONFIGS[fillConfigKey].computeSVGDefs(
                            `fill-${id}`,
                            undefined,
                            element,
                            {
                                getSize: () => size,
                                cellSize: {
                                    width: (cellSize.width * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                                    height: (cellSize.height * STRESS_ITEMS[configIndex].size) / styles.exampleSize,
                                },
                                animationDurationMs,
                                colors,
                                blurWidth,
                                ...iterationConfig.computeDefs(animationDurationMs),
                            },
                        );
                    }}
                    renderChildren={(_, clipPath) => {
                        return (
                            <div
                                className={styles.stressExample}
                                style={{
                                    width: `${STRESS_ITEMS[configIndex].size}px`,
                                    height: `${STRESS_ITEMS[configIndex].size}px`,
                                    clipPath: `path("${clipPath}")`,
                                }}
                            >
                                {itemIndex}
                            </div>
                        );
                    }}
                />
            )}
        />
    );
};

const useShapeGeometry = (startingShapeKind: ShapeConst.DefaultShape = ShapeKnobs.STARTING_SHAPE_KIND) => {
    const [hasIndividualCorners, setHasIndividualCorners] = useState(ShapeKnobs.STARTING_HAS_INDIVIDUAL_CORNERS);
    const [shapeKind, setShapeKind] = useState<ShapeConst.DefaultShape>(startingShapeKind);
    const [joinRadii, setJoinRadii] = useState<number[]>(ShapeKnobs.STARTING_JOIN_RADII);
    const [lameExponents, setLameExponents] = useState<number[]>(ShapeKnobs.STARTING_LAME_EXPONENTS);

    const shapePointCount = ShapeConst.getDefaultShapePoints(shapeKind, { width: 0, height: 0 }).length;

    const pointIterator = Array.from({ length: hasIndividualCorners ? shapePointCount : 1 }, (_, idx) => idx);

    const columns = hasIndividualCorners ? Math.min(shapePointCount * 0.5, MAX_CORNER_COLUMNS) : 1;

    const templateColumns = `repeat(${columns}, 1fr)`;

    const geometryProps = {
        shapeKind,
        joinRadii: joinRadii.slice(0, shapePointCount),
        lameExponents: lameExponents.slice(0, shapePointCount),
    };

    const renderKnobs = () => (
        <>
            <PageProp
                itemKey={"shapeKind"}
                label={"Shape"}
                hint={"The outline the shape is cut to, which also decides how many corners the corner fields offer."}
            >
                <PageSelectField
                    value={shapeKind}
                    values={ShapeConst.DEFAULT_SHAPES}
                    ariaLabel={"Shape"}
                    onChange={setShapeKind}
                />
            </PageProp>

            <PageProp
                itemKey={"hasIndividualCorners"}
                label={"Individual corner settings"}
                hint={"Opens one field per corner instead of one field driving all of them together."}
            >
                <PageCheckField
                    value={hasIndividualCorners}
                    ariaLabel={"Individual corner settings"}
                    onChange={setHasIndividualCorners}
                />
            </PageProp>

            <PageProp
                itemKey={"jointRadiiPx"}
                label={"Joint Radii (px)"}
                hint={"How far each corner is rounded. With individual corners off, the first field drives them all."}
            >
                <div className={styles.valueList} style={{ gridTemplateColumns: templateColumns }}>
                    {pointIterator.map((index) => (
                        <PageNumberField
                            key={index}
                            value={joinRadii[index]}
                            min={ShapeKnobs.MIN_JOIN_RADIUS}
                            max={ShapeKnobs.MAX_JOIN_RADIUS}
                            step={ShapeKnobs.JOIN_RADIUS_STEP}
                            width={CORNER_FIELD_WIDTH}
                            id={`jointRadius${index + 1}`}
                            ariaLabel={`Joint radius ${index + 1}`}
                            onInput={(value) =>
                                setJoinRadii((prev) => spreadCornerValue(prev, index, value, hasIndividualCorners))
                            }
                        />
                    ))}
                </div>
            </PageProp>

            <PageProp
                itemKey={"lameExponent"}
                label={"Lamé Exponent"}
                hint={
                    "How square or how pinched each rounded corner is: 2 is a circular round, higher is squarer, lower is pinched inward."
                }
            >
                <div className={styles.valueList} style={{ gridTemplateColumns: templateColumns }}>
                    {pointIterator.map((index) => (
                        <PageNumberField
                            key={index}
                            value={lameExponents[index]}
                            min={ShapeKnobs.MIN_LAME_EXPONENT}
                            max={ShapeKnobs.MAX_LAME_EXPONENT}
                            step={ShapeKnobs.LAME_EXPONENT_STEP}
                            width={CORNER_FIELD_WIDTH}
                            ariaLabel={`Lamé exponent ${index + 1}`}
                            onInput={(value) =>
                                setLameExponents((prev) => spreadCornerValue(prev, index, value, hasIndividualCorners))
                            }
                        />
                    ))}
                </div>
            </PageProp>
        </>
    );

    return { geometryProps, renderKnobs };
};

const DefaultExampleWrapper = (props: ShapeExampleProps) => {
    const { geometryProps, renderKnobs } = useShapeGeometry();

    const [shouldClipChildren, setShouldClipChildren] = useState(ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN);
    const [shouldPadChildren, setShouldPadChildren] = useState(ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN);

    return (
        <>
            <DefaultExample
                {...props}
                {...geometryProps}
                shouldClipChildren={shouldClipChildren}
                shouldPadChildren={shouldPadChildren}
            />

            <PageExampleKnobs>
                {renderKnobs()}

                <PageProp
                    itemKey={"shouldClipChildren"}
                    label={"Clip children"}
                    hint={
                        "Cuts whatever is inside the shape to the shape's own outline, instead of letting it spill past."
                    }
                >
                    <PageCheckField
                        value={shouldClipChildren}
                        ariaLabel={"Clip children"}
                        onChange={setShouldClipChildren}
                    />
                </PageProp>

                <PageProp
                    itemKey={"shouldPadChildren"}
                    label={"Pad children"}
                    hint={
                        "Insets whatever is inside far enough to clear the rounded corners, so text does not run under them."
                    }
                >
                    <PageCheckField
                        value={shouldPadChildren}
                        ariaLabel={"Pad children"}
                        onChange={setShouldPadChildren}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const MorphExampleWrapper = (props: ShapeExampleProps) => {
    const [starPoints, setStarPoints] = useState(ShapeKnobs.STARTING_STAR_POINTS);

    return (
        <>
            <MorphExample {...props} starPoints={starPoints} />

            <PageExampleKnobs>
                <PageProp
                    itemKey={"starPoints"}
                    label={"Star points"}
                    hint={
                        "How many tips the star has. The outline carries twice as many points: one per tip, one per notch between tips."
                    }
                >
                    <PageNumberField
                        value={starPoints}
                        min={ShapeKnobs.MIN_STAR_POINTS}
                        max={ShapeKnobs.MAX_STAR_POINTS}
                        step={ShapeKnobs.STAR_POINTS_STEP}
                        ariaLabel={"Star points"}
                        onInput={setStarPoints}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const TextWrapExampleWrapper = (props: ShapeExampleProps) => {
    const { geometryProps, renderKnobs } = useShapeGeometry(ShapeKnobs.STARTING_TEXT_WRAP_SHAPE_KIND);

    return (
        <>
            <TextWrapExample {...props} {...geometryProps} />

            <PageExampleKnobs>{renderKnobs()}</PageExampleKnobs>
        </>
    );
};

export const ShapePage = () => {
    const [blurWidth, setBlurWidth] = useState(ShapeKnobs.STARTING_BLUR_WIDTH);
    const [animationDurationMs, setAnimationDurationMs] = useState(ShapeKnobs.STARTING_DURATION_MS);
    const [edgeThickness, setEdgeThickness] = useState(ShapeKnobs.STARTING_EDGE_THICKNESS);
    const [strokeConfigKey, setStrokeConfigKey] = useState<WithNoSample<SVGDefsSamples.Gradient.Timed.SampleKey>>(
        ShapeKnobs.STARTING_GRADIENT_KEY,
    );
    const [strokeConfigDefsByKey, setStrokeConfigDefsByKey] = useState<
        Record<string, Record<string, number | boolean>>
    >({});

    const strokeKnobs =
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientKnobs.KNOBS_BY_FAMILY[strokeConfigKey] as Record<string, Knob>);
    const strokeDefaults =
        strokeConfigKey === NO_SAMPLE_KEY
            ? {}
            : (TimedGradientDefaults.DEFAULTS_BY_FAMILY[strokeConfigKey] as Record<string, unknown>);
    const strokeConfigDefs = strokeConfigDefsByKey[strokeConfigKey] ?? {};

    const [fillConfigKey, setFillConfigKey] = useState<WithNoSample<SVGDefsSamples.Pattern.SampleKey>>(NO_SAMPLE_KEY);
    const [iterationConfigKey, setIterationConfigKey] = useState<SVGDefsSamples.Iteration.SampleKey>(
        ShapeKnobs.STARTING_ITERATION_KEY,
    );
    const [cellSize, setCellSize] = useState(ShapeKnobs.STARTING_CELL_SIZE);
    const [colors, setColors] = useState<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

    const commonProps: ShapeExampleProps = {
        shouldClipChildren: ShapeKnobs.STARTING_SHOULD_CLIP_CHILDREN,
        shouldPadChildren: ShapeKnobs.STARTING_SHOULD_PAD_CHILDREN,
        blurWidth,
        animationDurationMs,
        colors,
        shapeKind: ShapeKnobs.STARTING_SHAPE_KIND,
        strokeConfigKey,
        strokeConfigDefs,
        fillConfigKey,
        iterationConfigKey,
        cellSize: { width: cellSize, height: cellSize },
        edgeThicknesses: [edgeThickness],
        joinRadii: ShapeKnobs.STARTING_JOIN_RADII,
        lameExponents: ShapeKnobs.STARTING_LAME_EXPONENTS,
    };

    const examples = [
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
                "one number from 0 to 1 is read inside computePoints and blends two outlines of twice the star-point count each, their corner radii and their exponents with them; under reduced motion the press jumps straight to the other shape",
            component: () => <MorphExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Morph.tsx`,
        },
        {
            key: "textWrap",
            name: "Text Wrap",
            readout: () =>
                "the shape writes its outline as shape-outside, so floating it is all the page does for the text to follow the edge",
            component: () => <TextWrapExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/TextWrap.tsx`,
        },
        {
            key: "stressTest",
            name: "Stress Test",
            component: () => <StressTestWrapper {...commonProps} />,
        },
    ];

    return (
        <div className={styles.root} style={assignInlineVars({ [styles.backgroundColor]: colors.background })}>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp
                        itemKey={"strokeConfigKey"}
                        label={"Stroke Pattern"}
                        hint={
                            "Which animated gradient paints the shape's outline. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageGroupedSelectField
                            value={strokeConfigKey}
                            groups={STROKE_GROUPS}
                            ariaLabel={"Stroke pattern"}
                            onChange={setStrokeConfigKey}
                        />
                    </PageProp>

                    <PageKnobs
                        knobs={strokeKnobs}
                        defaults={strokeDefaults}
                        values={strokeConfigDefs}
                        onInput={(key, value) =>
                            setStrokeConfigDefsByKey((previous) => ({
                                ...previous,
                                [strokeConfigKey]: { ...previous[strokeConfigKey], [key]: value },
                            }))
                        }
                    />
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        itemKey={"fillConfigKey"}
                        label={"Fill Pattern"}
                        hint={
                            "Which repeating pattern fills the shape's inside. Choosing one brings its own knobs with it."
                        }
                    >
                        <PageGroupedSelectField
                            value={fillConfigKey}
                            groups={FILL_GROUPS}
                            ariaLabel={"Fill pattern"}
                            onChange={setFillConfigKey}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"cellSize"}
                        label={"Fill Cell Size (px)"}
                        hint={"How large one tile of the fill pattern is before it repeats."}
                    >
                        <PageNumberField
                            value={cellSize}
                            min={ShapeKnobs.MIN_CELL_SIZE}
                            max={ShapeKnobs.MAX_CELL_SIZE}
                            step={ShapeKnobs.CELL_SIZE_STEP}
                            ariaLabel={"Fill cell size"}
                            onInput={setCellSize}
                        />
                    </PageProp>
                    <PageProp
                        itemKey={"colors"}
                        label={"Colors"}
                        hint={"The colors the outline, the fill and the page's own background are painted from."}
                    >
                        <div className={styles.colorList}>
                            {(Object.keys(colors) as (keyof SVGDefsColors)[]).map((key) => (
                                <PageColorField
                                    key={key}
                                    value={colors[key]}
                                    ariaLabel={key}
                                    onInput={(value) => setColors((previous) => ({ ...previous, [key]: value }))}
                                />
                            ))}
                        </div>
                    </PageProp>

                    <PageProp
                        itemKey={"edgeThicknessPx"}
                        label={"Edge Thickness (px)"}
                        hint={"How thick the outline is."}
                    >
                        <PageNumberField
                            value={edgeThickness}
                            min={ShapeKnobs.MIN_EDGE_THICKNESS}
                            max={ShapeKnobs.MAX_EDGE_THICKNESS}
                            step={ShapeKnobs.EDGE_THICKNESS_STEP}
                            ariaLabel={"Edge thickness"}
                            onInput={setEdgeThickness}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"blurWidth"}
                        label={"Blur (px)"}
                        hint={"How far the outline is blurred outward, which is what gives it its glow."}
                    >
                        <PageNumberField
                            value={blurWidth}
                            min={ShapeKnobs.MIN_BLUR_WIDTH}
                            max={ShapeKnobs.MAX_BLUR_WIDTH}
                            step={ShapeKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Blur width"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"animationDurationMs"}
                        label={"Animation duration (ms)"}
                        hint={"How long one pass of the stroke or fill animation takes."}
                    >
                        <PageNumberField
                            value={animationDurationMs}
                            min={ShapeKnobs.MIN_DURATION_MS}
                            max={ShapeKnobs.MAX_DURATION_MS}
                            step={ShapeKnobs.DURATION_STEP_MS}
                            ariaLabel={"Animation duration"}
                            onInput={setAnimationDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"iterationConfigKey"}
                        label={"Iteration Pattern"}
                        hint={"How the animation repeats: once, endlessly, or back and forth."}
                    >
                        <PageSelectField
                            value={iterationConfigKey}
                            values={SVGDefsSamples.Iteration.SAMPLE_KEYS}
                            ariaLabel={"Iteration pattern"}
                            onChange={setIterationConfigKey}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
