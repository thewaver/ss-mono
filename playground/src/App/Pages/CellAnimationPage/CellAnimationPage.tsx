import { createMemo, createSignal } from "solid-js";
import type { Signal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CELL_ANIMATION_DEFAULTS,
    CELL_ANIMATION_FINAL_FRAMES,
    CellAnimationBreakpoints,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    CellAnimationPlayback,
    CellAnimationPlaybackUtils,
    CellAnimationWeights,
    SVGDefsSamples,
    access,
} from "@thewaver/ss-components";
import type {
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { CellAnimationKnobs } from "../../Knobs/CellAnimations.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSources.const";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import {
    PageCheckField,
    PageFileField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../StyledComponents/Field/Field";
import knight_profile from "../../knight_profile.webp";
import type { CellAnimationExampleProps, CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import { DefaultExample } from "./Examples/Default";
import { ScrubExample } from "./Examples/Scrub";
import { WipeExample } from "./Examples/Wipe";

import * as styles from "./CellAnimationPage.css";

const IMAGE_CONTAINER_SIZE = 480;
const STRESS_CELL_COUNT: Index2d = { row: 11, col: 11 };
const STRESS_ITEM_SIZE = 120;
const STRESS_ITEMS: (StressTestDefs & { size: number })[] = [
    {
        count: 4 * 3,
        cols: 4,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 6 * 4,
        cols: 6,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 8 * 6,
        cols: 8,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
    {
        count: 12 * 6,
        cols: 12,
        gap: 10,
        size: STRESS_ITEM_SIZE,
    },
];

const DEFAULT_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Default.tsx";
const SCRUB_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Scrub.tsx";
const WIPE_EXAMPLE_PATH = "/src/App/Pages/CellAnimationPage/Examples/Wipe.tsx";
const DRAWN_SOURCE_PATH = "/src/App/PageComponents/SVGDefsSources/SVGDefsSources.const.ts";

const PERCENT = 100;

const computeContainerWidth = (size: Size2d) => (IMAGE_CONTAINER_SIZE * size.width) / Math.max(size.width, size.height);

const extractOptionGroupWord = (key: string) => key.replace(/^_/, "").match(/^[a-z]+/)?.[0] ?? key;

const groupOptions = <T extends string>(keys: readonly T[]) => {
    const result: Record<string, T[]> = {};

    for (const key of keys) {
        const group = extractOptionGroupWord(key);

        result[group] ??= [];
        result[group].push(key);
    }

    return Object.entries(result);
};

const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.WEIGHT_TYPES);
const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

const ImageExampleWrapper = (props: CellAnimationExampleProps) => {
    const [getSrc, setSrc] = createSignal(knight_profile);

    return (
        <>
            <div class={styles.exampleRoot}>
                <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                    <DefaultExample {...props} src={getSrc} />
                </PageMeasureBox>
            </div>

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"image"}
                    label={"Image"}
                    hint={
                        "Swaps in a picture of your own, so the cells can be watched against something other than the sample."
                    }
                >
                    <PageFileField
                        accept={"image/*"}
                        ariaLabel={"Image"}
                        onPick={(file) => setSrc(URL.createObjectURL(file))}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const GradientExampleWrapper = (props: CellAnimationExampleProps) => {
    const [getKey, setKey] = createSignal<SVGDefsSamples.Gradient.Timed.SampleKey>(
        CellAnimationKnobs.STARTING_GRADIENT_KEY,
    );
    const [getRatio, setRatio] = createSignal<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const getSize = createMemo(() => SVGDefsSources.computeSourceSize(getRatio()));

    return (
        <>
            <div class={styles.exampleRoot}>
                <PageMeasureBox width={() => computeContainerWidth(getSize())}>
                    <DefaultExample
                        {...props}
                        src={() =>
                            SVGDefsSources.computeGradientSource(
                                getKey(),
                                getSize(),
                                CellAnimationPlaybackUtils.computeCycleDurationMs(
                                    access(props.animationDurationMs),
                                    access(props.playbackOpts),
                                ),
                                access(props.animationIterationDelayMs),
                            )
                        }
                    />
                </PageMeasureBox>
            </div>

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"gradient"}
                    label={"Gradient"}
                    hint={"Which animated gradient is rendered into the picture the cells are cut from."}
                >
                    <PageSelectField
                        value={getKey}
                        values={() => SVGDefsSources.GRADIENT_KEYS}
                        ariaLabel={"Gradient"}
                        onChange={(key) => setKey(() => key)}
                    />
                </PageProp>

                <PageProp
                    key={"gradientRatio"}
                    label={"Ratio"}
                    hint={
                        "The shape of the picture the gradient is drawn into, which decides how the cells are proportioned."
                    }
                >
                    <PageSelectField
                        value={getRatio}
                        values={() => SVGDefsSources.SOURCE_RATIOS}
                        ariaLabel={"Gradient ratio"}
                        onChange={(ratio) => setRatio(() => ratio)}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const PatternExampleWrapper = (props: CellAnimationExampleProps) => {
    const [getKey, setKey] = createSignal<SVGDefsSamples.Pattern.SampleKey>(CellAnimationKnobs.STARTING_PATTERN_KEY);
    const [getRatio, setRatio] = createSignal<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const getSize = createMemo(() => SVGDefsSources.computeSourceSize(getRatio()));

    return (
        <>
            <div class={styles.exampleRoot}>
                <PageMeasureBox width={() => computeContainerWidth(getSize())}>
                    <DefaultExample
                        {...props}
                        src={() =>
                            SVGDefsSources.computePatternSource(
                                getKey(),
                                getSize(),
                                CellAnimationPlaybackUtils.computeCycleDurationMs(
                                    access(props.animationDurationMs),
                                    access(props.playbackOpts),
                                ),
                            )
                        }
                    />
                </PageMeasureBox>
            </div>

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"pattern"}
                    label={"Pattern"}
                    hint={"Which repeating pattern is rendered into the picture the cells are cut from."}
                >
                    <PageSelectField
                        value={getKey}
                        values={() => SVGDefsSources.PATTERN_KEYS}
                        ariaLabel={"Pattern"}
                        onChange={(key) => setKey(() => key)}
                    />
                </PageProp>

                <PageProp
                    key={"patternRatio"}
                    label={"Ratio"}
                    hint={
                        "The shape of the picture the pattern is drawn into, which decides how the cells are proportioned."
                    }
                >
                    <PageSelectField
                        value={getRatio}
                        values={() => SVGDefsSources.SOURCE_RATIOS}
                        ariaLabel={"Pattern ratio"}
                        onChange={(ratio) => setRatio(() => ratio)}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const ScrubExampleWrapper = (props: CellAnimationExampleProps & { progressSignal: Signal<number> }) => {
    return (
        <>
            <div class={styles.exampleRoot}>
                <ScrubExample {...props} src={() => knight_profile} />
            </div>

            <PagePropsPanel scope={"local"}>
                <PageProp
                    key={"scrubIsPlaying"}
                    label={"Playing"}
                    hint={
                        "Runs the pass on its own, and the slider follows it. Stopped, the slider is the only thing that moves the grid."
                    }
                >
                    <PageCheckField
                        value={props.playbackSignal[0]}
                        ariaLabel={"Playing"}
                        onChange={props.playbackSignal[1]}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const StressTestWrapper = (props: CellAnimationSourcedExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <StressTest
                configs={() => STRESS_ITEMS}
                onHideModal={() => {
                    props.playbackSignal[1](true);
                }}
                onShowModal={() => {
                    props.playbackSignal[1](false);
                }}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} items`}
                renderItem={(getConfigIndex) => (
                    <PageMeasureBox
                        width={() => STRESS_ITEMS[getConfigIndex()].size}
                        height={() => STRESS_ITEMS[getConfigIndex()].size}
                    >
                        <DefaultExample {...props} playbackSignal={modalPlayback} cellCount={() => STRESS_CELL_COUNT} />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const CellAnimationPage = () => {
    const playback = createSignal(true);
    const scrubPlayback = createSignal(false);
    const scrubProgress = createSignal(0);

    const [getOriginType, setOriginType] = createSignal<CellAnimationOrigins.OriginType>(
        CellAnimationKnobs.STARTING_ORIGIN_KEY,
    );
    const [getWeightType, setWeightType] = createSignal<CellAnimationWeights.WeightType>(
        CellAnimationKnobs.STARTING_WEIGHT_KEY,
    );
    const [getAnimationType, setAnimationType] = createSignal<CellAnimationKeyframes.AnimationType>(
        CellAnimationKnobs.STARTING_ANIMATION_KEY,
    );
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(CELL_ANIMATION_DEFAULTS.animationDurationMs);
    const [getAnimationIterationDelayMs, setAnimationIterationDelayMs] = createSignal(
        CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const [getAnimationIterationCount, setAnimationIterationCount] = createSignal(
        CellAnimationKnobs.ENDLESS_ITERATION_COUNT,
    );
    const [getFinalFrame, setFinalFrame] = createSignal<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
    const [cellCount, setCellCount] = createStore<Index2d>({ ...CellAnimationKnobs.STARTING_CELL_COUNT });
    const [weightOpts, setWeightOpts] = createStore<WeightOpts>({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS });
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS,
    });
    const [playbackOpts, setPlaybackOpts] = createStore<CellAnimationPlaybackOpts>({
        ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS,
    });

    const getExamples = createMemo(() => {
        const commonProps: CellAnimationExampleProps = {
            playbackSignal: playback,
            cellCount: () => cellCount,
            originType: getOriginType,
            weightType: getWeightType,
            weightOpts: () => weightOpts,
            breakpointOpts: () => breakpointOpts,
            playbackOpts: () => playbackOpts,
            animationType: getAnimationType,
            animationDurationMs: getAnimationDurationMs,
            animationIterationCount: () =>
                getAnimationIterationCount() === CellAnimationKnobs.ENDLESS_ITERATION_COUNT
                    ? Infinity
                    : getAnimationIterationCount(),
            animationIterationDelayMs: getAnimationIterationDelayMs,
            finalFrame: getFinalFrame,
        };

        return [
            {
                key: "image",
                name: "A photograph, sliced",
                component: () => <ImageExampleWrapper {...commonProps} />,
                path: DEFAULT_EXAMPLE_PATH,
            },
            {
                key: "gradient",
                name: "A gradient, drawn in place",
                readout: () =>
                    "the Shape page's own gradients, serialized into a source — the start and the pause a script would have timed are written into the markup instead, so they run at the same length and rhythm as the cells",
                component: () => <GradientExampleWrapper {...commonProps} />,
                path: DRAWN_SOURCE_PATH,
            },
            {
                key: "pattern",
                name: "A pattern, drawn in place",
                readout: () =>
                    "the same for the patterns, which flow on without a pause — a repeating fill has no beat to be out of step with",
                component: () => <PatternExampleWrapper {...commonProps} />,
                path: DRAWN_SOURCE_PATH,
            },
            {
                key: "scrub",
                name: "Scrubbed by a slider",
                readout: () =>
                    `${Math.round(scrubProgress[0]() * PERCENT)}% through the pass, ${scrubPlayback[0]() ? "running" : "stopped"} — the progress signal is written by the component while it plays, and writing it moves the pass there`,
                component: () => (
                    <ScrubExampleWrapper
                        {...commonProps}
                        playbackSignal={scrubPlayback}
                        progressSignal={scrubProgress}
                    />
                ),
                path: SCRUB_EXAMPLE_PATH,
            },
            {
                key: "wipe",
                name: "A screen wipe",
                readout: () =>
                    "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
                component: () => <WipeExample {...commonProps} />,
                path: WIPE_EXAMPLE_PATH,
            },
            {
                key: "stressTest",
                name: "Stress Test",
                component: () => <StressTestWrapper {...commonProps} src={() => knight_profile} />,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"cellCountCols"}
                    label={"Cell count (cols x rows)"}
                    hint={
                        "How many columns and rows the picture is cut into. More cells is a finer animation and more work per frame."
                    }
                >
                    <div class={styles.valueList}>
                        <PageNumberField
                            value={() => cellCount.col}
                            min={() => CellAnimationKnobs.MIN_CELL_COUNT}
                            max={() => CellAnimationKnobs.MAX_CELL_COUNT}
                            step={() => CellAnimationKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Columns"}
                            onInput={(value) => setCellCount("col", value)}
                        />
                        <PageNumberField
                            value={() => cellCount.row}
                            min={() => CellAnimationKnobs.MIN_CELL_COUNT}
                            max={() => CellAnimationKnobs.MAX_CELL_COUNT}
                            step={() => CellAnimationKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Rows"}
                            onInput={(value) => setCellCount("row", value)}
                        />
                    </div>
                </PageProp>

                <PageProp
                    key={"originType"}
                    label={"Origin"}
                    hint={
                        "Where in the grid the animation starts from. It only applies to weights that are measured from a point."
                    }
                >
                    <PageSelectField
                        value={getOriginType}
                        values={() => CellAnimationOrigins.ORIGIN_TYPES}
                        isDisabled={() => !CellAnimationWeights.isOriginAware(getWeightType())}
                        ariaLabel={"Origin"}
                        onChange={(origin) => setOriginType(() => origin)}
                    />
                </PageProp>

                <PageProp
                    key={"weightType"}
                    label={"Weight"}
                    hint={
                        "How each cell's turn is decided: its distance from the origin, a wave, a random draw, and so on."
                    }
                >
                    <PageGroupedSelectField
                        value={getWeightType}
                        groups={() => GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(() => weight)}
                    />
                </PageProp>

                <PageProp
                    key={"uniqueWeights"}
                    label={"Unique weights"}
                    hint={
                        "Gives every cell a turn of its own, so no two move together even where the weight would have tied them."
                    }
                >
                    <PageCheckField
                        value={() => !!weightOpts.shouldMakeUnique}
                        ariaLabel={"Unique weights"}
                        onChange={(value) => setWeightOpts("shouldMakeUnique", value)}
                    />
                </PageProp>

                <PageProp
                    key={"normalizeWeights"}
                    label={"Normalize weights"}
                    hint={
                        "Spreads the weights out to fill the whole run, so the first cell starts at the beginning and the last ends at the end."
                    }
                >
                    <PageCheckField
                        value={() => !!weightOpts.shouldNormalize}
                        ariaLabel={"Normalize weights"}
                        onChange={(value) => setWeightOpts("shouldNormalize", value)}
                    />
                </PageProp>

                <PageProp
                    key={"animationType"}
                    label={"Animation"}
                    hint={"What each cell actually does on its turn: fade, slide, spin, and the rest."}
                >
                    <PageGroupedSelectField
                        value={getAnimationType}
                        groups={() => GROUPPED_ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(anim) => setAnimationType(() => anim)}
                    />
                </PageProp>

                <PageProp
                    key={"direction"}
                    label={"Direction"}
                    hint={"Which way the run travels through the weights, and so which cells go first."}
                >
                    <PageSelectField
                        value={() => breakpointOpts.dir!}
                        values={() => CellAnimationBreakpoints.DIRECTIONS}
                        ariaLabel={"Direction"}
                        onChange={(dir) => setBreakpointOpts("dir", dir)}
                    />
                </PageProp>

                <PageProp
                    key={"easing"}
                    label={"Easing"}
                    hint={"The speed curve a single cell follows from its start to its finish."}
                >
                    <PageSelectField
                        value={() => breakpointOpts.easing!}
                        values={() => CellAnimationBreakpoints.EASINGS}
                        ariaLabel={"Easing"}
                        onChange={(easing) => setBreakpointOpts("easing", easing)}
                    />
                </PageProp>

                <PageProp
                    key={"smoothness01"}
                    label={"Smoothness (0-1)"}
                    hint={
                        "How much a cell's own movement overlaps its neighbors'. 0 makes each cell wait its turn; 1 blurs them into one sweep."
                    }
                >
                    <PageNumberField
                        value={() => breakpointOpts.smoothness!}
                        min={() => CellAnimationKnobs.MIN_SMOOTHNESS}
                        max={() => CellAnimationKnobs.MAX_SMOOTHNESS}
                        step={() => CellAnimationKnobs.SMOOTHNESS_STEP}
                        ariaLabel={"Smoothness"}
                        onInput={(value) => setBreakpointOpts("smoothness", value)}
                    />
                </PageProp>

                <PageProp
                    key={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass over the whole grid takes."}
                >
                    <PageNumberField
                        value={getAnimationDurationMs}
                        min={() => CellAnimationKnobs.MIN_DURATION_MS}
                        max={() => CellAnimationKnobs.MAX_DURATION_MS}
                        step={() => CellAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the grid waits between one pass and the next."}
                >
                    <PageNumberField
                        value={getAnimationIterationDelayMs}
                        min={() => CellAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={() => CellAnimationKnobs.MAX_ITERATION_DELAY_MS}
                        step={() => CellAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>

                <PageProp
                    key={"animationIterationCount"}
                    label={"Iteration count (-1 = endless)"}
                    hint={"How many passes to run. -1 means it never stops, and 0 shows the final frame at once."}
                >
                    <PageNumberField
                        value={getAnimationIterationCount}
                        min={() => CellAnimationKnobs.MIN_ITERATION_COUNT}
                        max={() => CellAnimationKnobs.MAX_ITERATION_COUNT}
                        step={() => CellAnimationKnobs.CELL_COUNT_STEP}
                        ariaLabel={"Iteration count"}
                        onInput={setAnimationIterationCount}
                    />
                </PageProp>

                <PageProp
                    key={"finalFrame"}
                    label={"Final frame is"}
                    hint={
                        "What the grid is left showing once the passes are done. It has nothing to settle on while the run is endless."
                    }
                >
                    <PageSelectField
                        value={getFinalFrame}
                        values={() => CELL_ANIMATION_FINAL_FRAMES}
                        isDisabled={() => getAnimationIterationCount() === CellAnimationKnobs.ENDLESS_ITERATION_COUNT}
                        ariaLabel={"Final frame"}
                        onChange={(frame) => setFinalFrame(() => frame)}
                    />
                </PageProp>

                <PageProp
                    key={"playbackDir"}
                    label={"Playback direction"}
                    hint={"Whether each pass runs the same way as the last, or turns round and comes back."}
                >
                    <PageSelectField
                        value={() => playbackOpts.dir!}
                        values={() => CellAnimationPlayback.DIRECTIONS}
                        ariaLabel={"Playback direction"}
                        onChange={(dir) => setPlaybackOpts("dir", dir)}
                    />
                </PageProp>

                <PageProp
                    key={"holdMs"}
                    label={"Hold at far end (ms)"}
                    hint={
                        "How long the grid rests at the far end before turning back. It only applies when the passes alternate."
                    }
                >
                    <PageNumberField
                        value={() => playbackOpts.holdMs!}
                        min={() => CellAnimationKnobs.MIN_HOLD_MS}
                        max={() => CellAnimationKnobs.MAX_HOLD_MS}
                        step={() => CellAnimationKnobs.DURATION_STEP_MS}
                        isDisabled={() => !playbackOpts.dir?.startsWith("alternate")}
                        ariaLabel={"Hold at far end"}
                        onInput={(value) => setPlaybackOpts("holdMs", value)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
