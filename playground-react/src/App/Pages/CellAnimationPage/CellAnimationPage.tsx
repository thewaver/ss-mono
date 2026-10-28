import { useMemo, useState } from "react";

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
} from "@thewaver/ss-components-react";
import type {
    CellAnimationBreakpointOpts,
    CellAnimationFinalFrame,
    CellAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components-react";
import { CellAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/CellAnimations.const";
import {
    DEFAULT_EXAMPLE_PATH,
    DRAWN_SOURCE_PATH,
    EXAMPLE_NAMES,
    IMAGE_CONTAINER_SIZE,
    PERCENT,
    STRESS_CELL_COUNT,
    STRESS_ITEMS,
    WIPE_EXAMPLE_PATH,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageCheckField,
    PageFileField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSourcesReact.const";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { CellAnimationExampleProps, CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import { DefaultExample } from "./Examples/Default";
import { WipeExample } from "./Examples/Wipe";

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

const ImageExampleWrapper = (
    props: CellAnimationExampleProps & { progress: readonly [number, (progress: number) => void] },
) => {
    const [src, setSrc] = useState(knight_profile);

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <DefaultExample {...props} src={src} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"cellAnimation"}
                    ariaLabel={"Position in the pass"}
                    playback={props.playback}
                    progress={props.progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"image"}
                    label={"Image"}
                    hint={
                        "Swaps in a picture of your own, so the cells can be watched against something other than the sample."
                    }
                    controls={"Picks the example picture sent to CellAnimationProps.src"}
                >
                    <PageFileField
                        accept={"image/*"}
                        ariaLabel={"Image"}
                        onPick={(file) => setSrc(URL.createObjectURL(file))}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const GradientExampleWrapper = (props: CellAnimationExampleProps) => {
    const playback = useState(true);
    const progress = useState(0);
    const [key, setKey] = useState<SVGDefsSamples.Gradient.Timed.SampleKey>(CellAnimationKnobs.STARTING_GRADIENT_KEY);
    const [ratio, setRatio] = useState<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const size = useMemo(() => SVGDefsSources.computeSourceSize(ratio), [ratio]);

    const cycleDurationMs = CellAnimationPlaybackUtils.computeCycleDurationMs(
        props.animationDurationMs,
        props.playbackOpts,
    );

    const src = useMemo(
        () => SVGDefsSources.computeGradientSource(key, size, cycleDurationMs, props.animationIterationDelayMs),
        [key, size, cycleDurationMs, props.animationIterationDelayMs],
    );

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={computeContainerWidth(size)}>
                    <DefaultExample {...props} playback={playback} progress={progress} src={src} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"cellAnimationGradient"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"gradient"}
                    label={"Gradient"}
                    hint={"Which animated gradient is rendered into the picture the cells are cut from."}
                    controls={"Picks the gradient drawn into the example picture sent to CellAnimationProps.src"}
                >
                    <PageSelectField
                        value={key}
                        values={SVGDefsSources.GRADIENT_KEYS}
                        ariaLabel={"Gradient"}
                        onChange={(key) => setKey(key)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"gradientRatio"}
                    label={"Ratio"}
                    hint={
                        "The shape of the picture the gradient is drawn into, which decides how the cells are proportioned."
                    }
                    controls={"Sets the shape of the example picture sent to CellAnimationProps.src"}
                >
                    <PageSelectField
                        value={ratio}
                        values={SVGDefsSources.SOURCE_RATIOS}
                        ariaLabel={"Gradient ratio"}
                        onChange={(ratio) => setRatio(ratio)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const PatternExampleWrapper = (props: CellAnimationExampleProps) => {
    const playback = useState(true);
    const progress = useState(0);
    const [key, setKey] = useState<SVGDefsSamples.Pattern.Timed.SampleKey>(CellAnimationKnobs.STARTING_PATTERN_KEY);
    const [ratio, setRatio] = useState<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const size = useMemo(() => SVGDefsSources.computeSourceSize(ratio), [ratio]);

    const cycleDurationMs = CellAnimationPlaybackUtils.computeCycleDurationMs(
        props.animationDurationMs,
        props.playbackOpts,
    );

    const src = useMemo(
        () => SVGDefsSources.computePatternSource(key, size, cycleDurationMs),
        [key, size, cycleDurationMs],
    );

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={computeContainerWidth(size)}>
                    <DefaultExample {...props} playback={playback} progress={progress} src={src} />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"cellAnimationPattern"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"pattern"}
                    label={"Pattern"}
                    hint={"Which repeating pattern is rendered into the picture the cells are cut from."}
                    controls={"Picks the pattern drawn into the example picture sent to CellAnimationProps.src"}
                >
                    <PageSelectField
                        value={key}
                        values={SVGDefsSources.PATTERN_KEYS}
                        ariaLabel={"Pattern"}
                        onChange={(key) => setKey(key)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"patternRatio"}
                    label={"Ratio"}
                    hint={
                        "The shape of the picture the pattern is drawn into, which decides how the cells are proportioned."
                    }
                    controls={"Sets the shape of the example picture sent to CellAnimationProps.src"}
                >
                    <PageSelectField
                        value={ratio}
                        values={SVGDefsSources.SOURCE_RATIOS}
                        ariaLabel={"Pattern ratio"}
                        onChange={(ratio) => setRatio(ratio)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const StressTestWrapper = (props: CellAnimationSourcedExampleProps) => {
    const modalPlayback = useState(true);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <StressTest
                configs={STRESS_ITEMS}
                onHideModal={() => {
                    props.playback[1](true);
                }}
                onShowModal={() => {
                    props.playback[1](false);
                }}
                renderLabel={(configIndex) => `Render ${STRESS_ITEMS[configIndex].count} items`}
                renderItem={(configIndex) => (
                    <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
                        <DefaultExample {...props} playback={modalPlayback} cellCount={STRESS_CELL_COUNT} />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const CellAnimationPage = () => {
    const playback = useState(true);
    const imagePlayback = useState(true);
    const imageProgress = useState(0);

    const [originType, setOriginType] = useState<CellAnimationOrigins.OriginType>(
        CellAnimationKnobs.STARTING_ORIGIN_KEY,
    );
    const [weightType, setWeightType] = useState<CellAnimationWeights.WeightType>(
        CellAnimationKnobs.STARTING_WEIGHT_KEY,
    );
    const [animationType, setAnimationType] = useState<CellAnimationKeyframes.AnimationType>(
        CellAnimationKnobs.STARTING_ANIMATION_KEY,
    );
    const [animationDurationMs, setAnimationDurationMs] = useState(CELL_ANIMATION_DEFAULTS.animationDurationMs);
    const [animationIterationDelayMs, setAnimationIterationDelayMs] = useState(
        CELL_ANIMATION_DEFAULTS.animationIterationDelayMs,
    );
    const [animationIterationCount, setAnimationIterationCount] = useState(CellAnimationKnobs.ENDLESS_ITERATION_COUNT);
    const [finalFrame, setFinalFrame] = useState<CellAnimationFinalFrame>(CELL_ANIMATION_DEFAULTS.finalFrame);
    const [cellCount, setCellCount] = useState<Index2d>(() => ({ ...CellAnimationKnobs.STARTING_CELL_COUNT }));
    const [weightOpts, setWeightOpts] = useState<WeightOpts>(() => ({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS }));
    const [breakpointOpts, setBreakpointOpts] = useState<CellAnimationBreakpointOpts>(() => ({
        ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS,
    }));
    const [playbackOpts, setPlaybackOpts] = useState<CellAnimationPlaybackOpts>(() => ({
        ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS,
    }));

    const commonProps: CellAnimationExampleProps = {
        playback,
        cellCount,
        originType,
        weightType,
        weightOpts,
        breakpointOpts,
        playbackOpts,
        animationType,
        animationDurationMs,
        animationIterationCount:
            animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT ? Infinity : animationIterationCount,
        animationIterationDelayMs,
        finalFrame,
    };

    const examples = [
        {
            key: "image",
            name: EXAMPLE_NAMES.image,
            readout: () =>
                `${Math.round(imageProgress[0] * PERCENT)}% through the pass, ${imagePlayback[0] ? "running" : "stopped"} — the progress signal is written by the component while it plays, and writing it moves the pass there`,
            component: () => <ImageExampleWrapper {...commonProps} playback={imagePlayback} progress={imageProgress} />,
            path: DEFAULT_EXAMPLE_PATH,
        },
        {
            key: "gradient",
            name: EXAMPLE_NAMES.gradient,
            readout: () =>
                "the Shape page's own gradients, serialized into a source — the start and the pause a script would have timed are written into the markup instead, so they run at the same length and rhythm as the cells",
            component: () => <GradientExampleWrapper {...commonProps} />,
            path: DRAWN_SOURCE_PATH,
        },
        {
            key: "pattern",
            name: EXAMPLE_NAMES.pattern,
            readout: () =>
                "the same for the patterns, which flow on without a pause — a repeating fill has no beat to be out of step with",
            component: () => <PatternExampleWrapper {...commonProps} />,
            path: DRAWN_SOURCE_PATH,
        },
        {
            key: "wipe",
            name: EXAMPLE_NAMES.wipe,
            readout: () =>
                "a solid-color picture fixed over the whole viewport, its cells growing in by the chosen weight and going back out after a hold; the lozenge is each cell turned 45° and grown past its box until it covers it, and there is no circle, since a cell can only be transformed and filtered, not reshaped",
            component: () => <WipeExample {...commonProps} />,
            path: WIPE_EXAMPLE_PATH,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: () => <StressTestWrapper {...commonProps} src={knight_profile} />,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"cellCountCols"}
                    label={"Cell count (cols x rows)"}
                    hint={
                        "How many columns and rows the picture is cut into. More cells is a finer animation and more work per frame."
                    }
                    controls={"Sets CellAnimationProps.cellCount"}
                >
                    <div className={styles.valueList}>
                        <PageNumberField
                            value={cellCount.col}
                            min={CellAnimationKnobs.MIN_CELL_COUNT}
                            max={CellAnimationKnobs.MAX_CELL_COUNT}
                            step={CellAnimationKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Columns"}
                            onInput={(value) => setCellCount((previous) => ({ ...previous, col: value }))}
                        />
                        <PageNumberField
                            value={cellCount.row}
                            min={CellAnimationKnobs.MIN_CELL_COUNT}
                            max={CellAnimationKnobs.MAX_CELL_COUNT}
                            step={CellAnimationKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Rows"}
                            onInput={(value) => setCellCount((previous) => ({ ...previous, row: value }))}
                        />
                    </div>
                </PageProp>

                <PageProp
                    itemKey={"originType"}
                    label={"Origin"}
                    hint={
                        "Where in the grid the animation starts from. It only applies to weights that are measured from a point."
                    }
                    controls={
                        "Picks the point the example's weights are measured from, sent to CellAnimationProps.computeCellWeights"
                    }
                >
                    <PageSelectField
                        value={originType}
                        values={CellAnimationOrigins.ORIGIN_TYPES}
                        isDisabled={!CellAnimationWeights.isOriginAware(weightType)}
                        ariaLabel={"Origin"}
                        onChange={(origin) => setOriginType(origin)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"weightType"}
                    label={"Weight"}
                    hint={
                        "How each cell's turn is decided: its distance from the origin, a wave, a random draw, and so on."
                    }
                    controls={"Picks the example's weight function sent to CellAnimationProps.computeCellWeights"}
                >
                    <PageGroupedSelectField
                        value={weightType}
                        groups={GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(weight)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"uniqueWeights"}
                    label={"Unique weights"}
                    hint={
                        "Gives every cell a turn of its own, so no two move together even where the weight would have tied them."
                    }
                    controls={"Sets WeightOpts.shouldMakeUnique"}
                >
                    <PageCheckField
                        value={!!weightOpts.shouldMakeUnique}
                        ariaLabel={"Unique weights"}
                        onChange={(value) => setWeightOpts((previous) => ({ ...previous, shouldMakeUnique: value }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"normalizeWeights"}
                    label={"Normalize weights"}
                    hint={
                        "Spreads the weights out to fill the whole run, so the first cell starts at the beginning and the last ends at the end."
                    }
                    controls={"Sets WeightOpts.shouldNormalize"}
                >
                    <PageCheckField
                        value={!!weightOpts.shouldNormalize}
                        ariaLabel={"Normalize weights"}
                        onChange={(value) => setWeightOpts((previous) => ({ ...previous, shouldNormalize: value }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationType"}
                    label={"Animation"}
                    hint={"What each cell actually does on its turn: fade, slide, spin, and the rest."}
                    controls={"Picks the example's cell keyframes sent to CellAnimationProps.computeCellAnimation"}
                >
                    <PageGroupedSelectField
                        value={animationType}
                        groups={GROUPPED_ANIMATIONS}
                        ariaLabel={"Animation"}
                        onChange={(anim) => setAnimationType(anim)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"direction"}
                    label={"Direction"}
                    hint={"Which way the run travels through the weights, and so which cells go first."}
                    controls={"Sets CellAnimationBreakpointOpts.dir"}
                >
                    <PageSelectField
                        value={breakpointOpts.dir!}
                        values={CellAnimationBreakpoints.DIRECTIONS}
                        ariaLabel={"Direction"}
                        onChange={(dir) => setBreakpointOpts((previous) => ({ ...previous, dir }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"easing"}
                    label={"Easing"}
                    hint={"The speed curve a single cell follows from its start to its finish."}
                    controls={"Sets CellAnimationBreakpointOpts.easing"}
                >
                    <PageSelectField
                        value={breakpointOpts.easing!}
                        values={CellAnimationBreakpoints.EASINGS}
                        ariaLabel={"Easing"}
                        onChange={(easing) => setBreakpointOpts((previous) => ({ ...previous, easing }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"smoothness01"}
                    label={"Smoothness (0-1)"}
                    hint={
                        "How much a cell's own movement overlaps its neighbors'. 0 makes each cell wait its turn; 1 blurs them into one sweep."
                    }
                    controls={"Sets CellAnimationBreakpointOpts.smoothness"}
                >
                    <PageNumberField
                        value={breakpointOpts.smoothness!}
                        min={CellAnimationKnobs.MIN_SMOOTHNESS}
                        max={CellAnimationKnobs.MAX_SMOOTHNESS}
                        step={CellAnimationKnobs.SMOOTHNESS_STEP}
                        ariaLabel={"Smoothness"}
                        onInput={(value) => setBreakpointOpts((previous) => ({ ...previous, smoothness: value }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one pass over the whole grid takes."}
                    controls={"Sets CellAnimationProps.animationDurationMs"}
                >
                    <PageNumberField
                        value={animationDurationMs}
                        min={CellAnimationKnobs.MIN_DURATION_MS}
                        max={CellAnimationKnobs.MAX_DURATION_MS}
                        step={CellAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the grid waits between one pass and the next."}
                    controls={"Sets CellAnimationProps.animationIterationDelayMs"}
                >
                    <PageNumberField
                        value={animationIterationDelayMs}
                        min={CellAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={CellAnimationKnobs.MAX_ITERATION_DELAY_MS}
                        step={CellAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationIterationCount"}
                    label={"Iteration count (-1 = endless)"}
                    hint={"How many passes to run. -1 means it never stops, and 0 shows the final frame at once."}
                    controls={"Sets CellAnimationProps.animationIterationCount, with -1 sent as Infinity"}
                >
                    <PageNumberField
                        value={animationIterationCount}
                        min={CellAnimationKnobs.MIN_ITERATION_COUNT}
                        max={CellAnimationKnobs.MAX_ITERATION_COUNT}
                        step={CellAnimationKnobs.CELL_COUNT_STEP}
                        ariaLabel={"Iteration count"}
                        onInput={setAnimationIterationCount}
                    />
                </PageProp>

                <PageProp
                    itemKey={"finalFrame"}
                    label={"Final frame is"}
                    hint={
                        "What the grid is left showing once the passes are done. It has nothing to settle on while the run is endless."
                    }
                    controls={"Sets CellAnimationProps.finalFrame"}
                >
                    <PageSelectField
                        value={finalFrame}
                        values={CELL_ANIMATION_FINAL_FRAMES}
                        isDisabled={animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT}
                        ariaLabel={"Final frame"}
                        onChange={(frame) => setFinalFrame(frame)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"playbackDir"}
                    label={"Playback direction"}
                    hint={
                        "Whether each pass runs one way, or goes out and comes back. Coming back, stack starts with the last cell to arrive and pipe with the first."
                    }
                    controls={"Sets CellAnimationPlaybackOpts.dir"}
                >
                    <PageSelectField
                        value={playbackOpts.dir!}
                        values={CellAnimationPlayback.DIRECTIONS}
                        ariaLabel={"Playback direction"}
                        onChange={(dir) => setPlaybackOpts((previous) => ({ ...previous, dir }))}
                    />
                </PageProp>

                <PageProp
                    itemKey={"holdMs"}
                    label={"Hold at far end (ms)"}
                    hint={
                        "How long the grid rests at the far end before turning back. It only applies to stack and pipe, which come back."
                    }
                    controls={"Sets CellAnimationPlaybackOpts.holdMs"}
                >
                    <PageNumberField
                        value={playbackOpts.holdMs!}
                        min={CellAnimationKnobs.MIN_HOLD_MS}
                        max={CellAnimationKnobs.MAX_HOLD_MS}
                        step={CellAnimationKnobs.DURATION_STEP_MS}
                        isDisabled={!CellAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)}
                        ariaLabel={"Hold at far end"}
                        onInput={(value) => setPlaybackOpts((previous) => ({ ...previous, holdMs: value }))}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
