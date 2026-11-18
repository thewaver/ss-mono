import { Show, createMemo, createSignal, splitProps } from "solid-js";
import type { Signal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CELL_ANIMATION_DEFAULTS,
    CELL_ANIMATION_FINAL_FRAMES,
    CellAnimationKeyframes,
    CellAnimationOrigins,
    SVGDefsSamples,
    SliceAnimationBreakpoints,
    SliceAnimationPlayback,
    SliceAnimationPlaybackUtils,
    SliceAnimationWeights,
    access,
} from "@thewaver/ss-components-solid";
import type {
    CellAnimationFinalFrame,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components-solid";
import { CellAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/CellAnimations.const";
import {
    DEFAULT_EXAMPLE_PATH,
    EXAMPLE_NAMES,
    IMAGE_CONTAINER_SIZE,
    PERCENT,
    SOURCE_READOUTS,
    STRESS_CELL_COUNT,
    STRESS_HOLD_MS,
    STRESS_ITEMS,
    STRESS_ITERATION_DELAY_MS,
    WIPE_EXAMPLE_PATH,
} from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.css";
import type { CellAnimationSourceKind } from "@thewaver/ss-playground/App/Pages/CellAnimationPage/CellAnimationPage.types";
import knight_profile from "@thewaver/ss-playground/App/knight_profile.webp";
import type { Index2d, Size2d } from "@thewaver/ss-utils";

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
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSourcesSolid.const";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { CellAnimationExampleProps, CellAnimationSourcedExampleProps } from "./CellAnimationPage.types";
import { DefaultExample } from "./Examples/Default";
import { WipeExample } from "./Examples/Wipe";

const computeContainerWidth = (size: Size2d, longestSide: number) =>
    (longestSide * size.width) / Math.max(size.width, size.height);

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

const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.WEIGHT_TYPES);
const GROUPPED_ANIMATIONS = groupOptions(CellAnimationKeyframes.ANIMATION_TYPES);

const SourcedExampleWrapper = (
    props: CellAnimationSourcedExampleProps & {
        ownPlayback: Signal<boolean>;
        progress: Signal<number>;
        computeWidth: (longestSide: number) => number;
    },
) => {
    const [local, exampleProps] = splitProps(props, ["ownPlayback", "computeWidth"]);

    return (
        <div class={styles.stack}>
            <PageMeasureBox width={() => local.computeWidth(IMAGE_CONTAINER_SIZE)}>
                <DefaultExample
                    {...exampleProps}
                    playback={PlaybackScrubberUtils.gate(local.ownPlayback, exampleProps.playback[0])}
                />
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={"cellAnimation"}
                ariaLabel={"Position in the pass"}
                playback={local.ownPlayback}
                progress={exampleProps.progress}
            />
        </div>
    );
};

const StressTestWrapper = (
    props: CellAnimationSourcedExampleProps & { computeWidth: (longestSide: number) => number },
) => {
    const [local, exampleProps] = splitProps(props, ["computeWidth"]);

    const modalPlayback = createSignal(true);

    const [getIsOnGraphicsCard, setIsOnGraphicsCard] = createSignal(true);

    const getStressPlaybackOpts = createMemo(() => ({
        ...access(exampleProps.playbackOpts),
        holdMs: STRESS_HOLD_MS,
    }));

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.col} x ${STRESS_CELL_COUNT.row} cells`}</div>

            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp key={"onGraphicsCard"} {...CellAnimationKnobs.ON_GRAPHICS_CARD_TEXT}>
                    <PageCheckField
                        value={getIsOnGraphicsCard}
                        ariaLabel={"On the graphics card"}
                        onChange={setIsOnGraphicsCard}
                    />
                </PageProp>
            </PagePropsPanel>

            <StressTest
                configs={STRESS_ITEMS}
                onHideModal={() => {
                    exampleProps.playback[1](true);
                }}
                onShowModal={() => {
                    exampleProps.playback[1](false);
                }}
                renderLabel={(getConfigIndex) => `Render ${STRESS_ITEMS[getConfigIndex()].count} items`}
                renderItem={(getConfigIndex) => (
                    <PageMeasureBox width={() => local.computeWidth(STRESS_ITEMS[getConfigIndex()].size)}>
                        <DefaultExample
                            {...exampleProps}
                            playbackOpts={getStressPlaybackOpts}
                            animationIterationDelayMs={STRESS_ITERATION_DELAY_MS}
                            playback={modalPlayback}
                            cellCount={STRESS_CELL_COUNT}
                            renderer={() => (getIsOnGraphicsCard() ? "graphics_card" : "elements")}
                        />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const CellAnimationPage = () => {
    const playback = createSignal(true);
    const sourcedPlayback = createSignal(true);
    const sourcedProgress = createSignal(0);

    const [getSourceKind, setSourceKind] = createSignal<CellAnimationSourceKind>(
        CellAnimationKnobs.STARTING_SOURCE_KIND,
    );
    const [getImageSrc, setImageSrc] = createSignal(knight_profile);
    const [getGradientKey, setGradientKey] = createSignal<SVGDefsSamples.Gradient.Timed.SampleKey>(
        CellAnimationKnobs.STARTING_GRADIENT_KEY,
    );
    const [getPatternKey, setPatternKey] = createSignal<SVGDefsSamples.Pattern.Timed.SampleKey>(
        CellAnimationKnobs.STARTING_PATTERN_KEY,
    );
    const [getSourceRatio, setSourceRatio] = createSignal<SVGDefsSources.SourceRatio>(
        CellAnimationKnobs.DEFAULT_SOURCE_RATIO,
    );

    const [getOriginType, setOriginType] = createSignal<CellAnimationOrigins.OriginType>(
        CellAnimationKnobs.STARTING_ORIGIN_KEY,
    );
    const [getWeightType, setWeightType] = createSignal<SliceAnimationWeights.WeightType>(
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
    const [breakpointOpts, setBreakpointOpts] = createStore<SliceAnimationBreakpointOpts>({
        ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS,
    });
    const [playbackOpts, setPlaybackOpts] = createStore<SliceAnimationPlaybackOpts>({
        ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS,
    });

    const getSourceSize = createMemo(() => SVGDefsSources.computeSourceSize(getSourceRatio()));

    const getCycleDurationMs = () =>
        SliceAnimationPlaybackUtils.computeCycleDurationMs(getAnimationDurationMs(), playbackOpts);

    const getSourcedSrc = createMemo(() => {
        const sourceKind = getSourceKind();

        if (sourceKind === "gradient") {
            return SVGDefsSources.computeGradientSource(
                getGradientKey(),
                getSourceSize(),
                getCycleDurationMs(),
                getAnimationIterationDelayMs(),
            );
        }

        if (sourceKind === "pattern") {
            return SVGDefsSources.computePatternSource(getPatternKey(), getSourceSize(), getCycleDurationMs());
        }

        return getImageSrc();
    });

    const computeSourcedWidth = (longestSide: number) =>
        getSourceKind() === "image" ? longestSide : computeContainerWidth(getSourceSize(), longestSide);

    const getExamples = createMemo(() => {
        const commonProps: CellAnimationExampleProps = {
            playback,
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
                key: "source",
                name: EXAMPLE_NAMES.source,
                readout: () =>
                    `${Math.round(sourcedProgress[0]() * PERCENT)}% through the pass, ${sourcedPlayback[0]() ? "running" : "stopped"} — ${SOURCE_READOUTS[getSourceKind()]}`,
                component: () => (
                    <SourcedExampleWrapper
                        {...commonProps}
                        src={getSourcedSrc}
                        ownPlayback={sourcedPlayback}
                        progress={sourcedProgress}
                        computeWidth={computeSourcedWidth}
                    />
                ),
                path: DEFAULT_EXAMPLE_PATH,
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
                component: () => (
                    <StressTestWrapper {...commonProps} src={getSourcedSrc} computeWidth={computeSourcedWidth} />
                ),
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp key={"sourceKind"} {...CellAnimationKnobs.SOURCE_KIND_TEXT}>
                        <PageSelectField
                            value={getSourceKind}
                            values={CellAnimationKnobs.SOURCE_KINDS}
                            ariaLabel={"Source"}
                            onChange={(kind) => setSourceKind(() => kind)}
                        />
                    </PageProp>

                    <Show when={getSourceKind() === "image"}>
                        <PageProp key={"image"} {...CellAnimationKnobs.IMAGE_TEXT}>
                            <PageFileField
                                accept={"image/*"}
                                ariaLabel={"Image"}
                                onPick={(file) => setImageSrc(URL.createObjectURL(file))}
                            />
                        </PageProp>
                    </Show>

                    <Show when={getSourceKind() === "gradient"}>
                        <PageProp key={"gradient"} {...CellAnimationKnobs.GRADIENT_TEXT}>
                            <PageSelectField
                                value={getGradientKey}
                                values={SVGDefsSources.GRADIENT_KEYS}
                                ariaLabel={"Gradient"}
                                onChange={(key) => setGradientKey(() => key)}
                            />
                        </PageProp>
                    </Show>

                    <Show when={getSourceKind() === "pattern"}>
                        <PageProp key={"pattern"} {...CellAnimationKnobs.PATTERN_TEXT}>
                            <PageSelectField
                                value={getPatternKey}
                                values={SVGDefsSources.PATTERN_KEYS}
                                ariaLabel={"Pattern"}
                                onChange={(key) => setPatternKey(() => key)}
                            />
                        </PageProp>
                    </Show>

                    <Show when={getSourceKind() !== "image"}>
                        <PageProp key={"sourceRatio"} {...CellAnimationKnobs.SOURCE_RATIO_TEXT}>
                            <PageSelectField
                                value={getSourceRatio}
                                values={SVGDefsSources.SOURCE_RATIOS}
                                ariaLabel={"Ratio"}
                                onChange={(ratio) => setSourceRatio(() => ratio)}
                            />
                        </PageProp>
                    </Show>
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp key={"cellCountCols"} {...CellAnimationKnobs.CELL_COUNT_COLS_TEXT}>
                        <div class={styles.valueList}>
                            <PageNumberField
                                value={() => cellCount.col}
                                min={CellAnimationKnobs.MIN_CELL_COUNT}
                                max={CellAnimationKnobs.MAX_CELL_COUNT}
                                step={CellAnimationKnobs.CELL_COUNT_STEP}
                                ariaLabel={"Columns"}
                                onInput={(value) => setCellCount("col", value)}
                            />
                            <PageNumberField
                                value={() => cellCount.row}
                                min={CellAnimationKnobs.MIN_CELL_COUNT}
                                max={CellAnimationKnobs.MAX_CELL_COUNT}
                                step={CellAnimationKnobs.CELL_COUNT_STEP}
                                ariaLabel={"Rows"}
                                onInput={(value) => setCellCount("row", value)}
                            />
                        </div>
                    </PageProp>

                    <PageProp key={"originType"} {...CellAnimationKnobs.ORIGIN_TYPE_TEXT}>
                        <PageSelectField
                            value={getOriginType}
                            values={CellAnimationOrigins.ORIGIN_TYPES}
                            isDisabled={() => !SliceAnimationWeights.isOriginAware(getWeightType())}
                            ariaLabel={"Origin"}
                            onChange={(origin) => setOriginType(() => origin)}
                        />
                    </PageProp>

                    <PageProp key={"weightType"} {...CellAnimationKnobs.WEIGHT_TYPE_TEXT}>
                        <PageGroupedSelectField
                            value={getWeightType}
                            groups={GROUPPED_WEIGHTS}
                            ariaLabel={"Weight"}
                            onChange={(weight) => setWeightType(() => weight)}
                        />
                    </PageProp>

                    <PageProp key={"uniqueWeights"} {...CellAnimationKnobs.UNIQUE_WEIGHTS_TEXT}>
                        <PageCheckField
                            value={() => !!weightOpts.shouldMakeUnique}
                            ariaLabel={"Unique weights"}
                            onChange={(value) => setWeightOpts("shouldMakeUnique", value)}
                        />
                    </PageProp>

                    <PageProp key={"normalizeWeights"} {...CellAnimationKnobs.NORMALIZE_WEIGHTS_TEXT}>
                        <PageCheckField
                            value={() => !!weightOpts.shouldNormalize}
                            ariaLabel={"Normalize weights"}
                            onChange={(value) => setWeightOpts("shouldNormalize", value)}
                        />
                    </PageProp>

                    <PageProp key={"animationType"} {...CellAnimationKnobs.ANIMATION_TYPE_TEXT}>
                        <PageGroupedSelectField
                            value={getAnimationType}
                            groups={GROUPPED_ANIMATIONS}
                            ariaLabel={"Animation"}
                            onChange={(anim) => setAnimationType(() => anim)}
                        />
                    </PageProp>

                    <PageProp key={"direction"} {...CellAnimationKnobs.DIRECTION_TEXT}>
                        <PageSelectField
                            value={() => breakpointOpts.dir!}
                            values={SliceAnimationBreakpoints.DIRECTIONS}
                            ariaLabel={"Direction"}
                            onChange={(dir) => setBreakpointOpts("dir", dir)}
                        />
                    </PageProp>

                    <PageProp key={"easing"} {...CellAnimationKnobs.EASING_TEXT}>
                        <PageSelectField
                            value={() => breakpointOpts.easing!}
                            values={SliceAnimationBreakpoints.EASINGS}
                            ariaLabel={"Easing"}
                            onChange={(easing) => setBreakpointOpts("easing", easing)}
                        />
                    </PageProp>

                    <PageProp key={"smoothness01"} {...CellAnimationKnobs.SMOOTHNESS01_TEXT}>
                        <PageNumberField
                            value={() => breakpointOpts.smoothness!}
                            min={CellAnimationKnobs.MIN_SMOOTHNESS}
                            max={CellAnimationKnobs.MAX_SMOOTHNESS}
                            step={CellAnimationKnobs.SMOOTHNESS_STEP}
                            ariaLabel={"Smoothness"}
                            onInput={(value) => setBreakpointOpts("smoothness", value)}
                        />
                    </PageProp>

                    <PageProp key={"animationDurationMs"} {...CellAnimationKnobs.ANIMATION_DURATION_MS_TEXT}>
                        <PageNumberField
                            value={getAnimationDurationMs}
                            min={CellAnimationKnobs.MIN_DURATION_MS}
                            max={CellAnimationKnobs.MAX_DURATION_MS}
                            step={CellAnimationKnobs.DURATION_STEP_MS}
                            ariaLabel={"Animation duration"}
                            onInput={setAnimationDurationMs}
                        />
                    </PageProp>

                    <PageProp
                        key={"animationIterationDelayMs"}
                        {...CellAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT}
                    >
                        <PageNumberField
                            value={getAnimationIterationDelayMs}
                            min={CellAnimationKnobs.MIN_ITERATION_DELAY_MS}
                            max={CellAnimationKnobs.MAX_ITERATION_DELAY_MS}
                            step={CellAnimationKnobs.DURATION_STEP_MS}
                            ariaLabel={"Iteration delay"}
                            onInput={setAnimationIterationDelayMs}
                        />
                    </PageProp>

                    <PageProp key={"animationIterationCount"} {...CellAnimationKnobs.ANIMATION_ITERATION_COUNT_TEXT}>
                        <PageNumberField
                            value={getAnimationIterationCount}
                            min={CellAnimationKnobs.MIN_ITERATION_COUNT}
                            max={CellAnimationKnobs.MAX_ITERATION_COUNT}
                            step={CellAnimationKnobs.CELL_COUNT_STEP}
                            ariaLabel={"Iteration count"}
                            onInput={setAnimationIterationCount}
                        />
                    </PageProp>

                    <PageProp key={"finalFrame"} {...CellAnimationKnobs.FINAL_FRAME_TEXT}>
                        <PageSelectField
                            value={getFinalFrame}
                            values={CELL_ANIMATION_FINAL_FRAMES}
                            isDisabled={() =>
                                getAnimationIterationCount() === CellAnimationKnobs.ENDLESS_ITERATION_COUNT
                            }
                            ariaLabel={"Final frame"}
                            onChange={(frame) => setFinalFrame(() => frame)}
                        />
                    </PageProp>

                    <PageProp key={"playbackDir"} {...CellAnimationKnobs.PLAYBACK_DIR_TEXT}>
                        <PageSelectField
                            value={() => playbackOpts.dir!}
                            values={SliceAnimationPlayback.DIRECTIONS}
                            ariaLabel={"Playback direction"}
                            onChange={(dir) => setPlaybackOpts("dir", dir)}
                        />
                    </PageProp>

                    <PageProp key={"holdMs"} {...CellAnimationKnobs.HOLD_MS_TEXT}>
                        <PageNumberField
                            value={() => playbackOpts.holdMs!}
                            min={CellAnimationKnobs.MIN_HOLD_MS}
                            max={CellAnimationKnobs.MAX_HOLD_MS}
                            step={CellAnimationKnobs.DURATION_STEP_MS}
                            isDisabled={() => !SliceAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)}
                            ariaLabel={"Hold at far end"}
                            onInput={(value) => setPlaybackOpts("holdMs", value)}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
