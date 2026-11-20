import { useMemo, useState } from "react";

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
} from "@thewaver/ss-components-react";
import type {
    CellAnimationFinalFrame,
    SliceAnimationBreakpointOpts,
    SliceAnimationPlaybackOpts,
    WeightOpts,
} from "@thewaver/ss-components-react";
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
import type { Count2d, Size2d } from "@thewaver/ss-utils";

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
import { SVGDefsSources } from "../../PageComponents/SVGDefsSources/SVGDefsSourcesReact.const";
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

const SourcedExampleWrapper = ({
    ownPlayback,
    computeWidth,
    ...props
}: CellAnimationSourcedExampleProps & {
    ownPlayback: readonly [boolean, (isPlaying: boolean) => void];
    progress: readonly [number, (progress: number) => void];
    computeWidth: (longestSide: number) => number;
}) => {
    return (
        <div className={styles.stack}>
            <PageMeasureBox width={computeWidth(IMAGE_CONTAINER_SIZE)}>
                <DefaultExample {...props} playback={PlaybackScrubberUtils.gate(ownPlayback, props.playback[0])} />
            </PageMeasureBox>

            <PagePlaybackScrubber
                id={"cellAnimation"}
                ariaLabel={"Position in the pass"}
                playback={ownPlayback}
                progress={props.progress}
            />
        </div>
    );
};

const StressTestWrapper = ({
    computeWidth,
    ...props
}: CellAnimationSourcedExampleProps & { computeWidth: (longestSide: number) => number }) => {
    const modalPlayback = useState(true);

    const [isOnGraphicsCard, setIsOnGraphicsCard] = useState(true);

    const stressPlaybackOpts = useMemo(() => ({ ...props.playbackOpts, holdMs: STRESS_HOLD_MS }), [props.playbackOpts]);

    return (
        <>
            <div>{`${STRESS_CELL_COUNT.colCount} x ${STRESS_CELL_COUNT.rowCount} cells`}</div>

            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp itemKey={"onGraphicsCard"} {...CellAnimationKnobs.ON_GRAPHICS_CARD_TEXT}>
                    <PageCheckField
                        value={isOnGraphicsCard}
                        ariaLabel={"On the graphics card"}
                        onChange={setIsOnGraphicsCard}
                    />
                </PageProp>
            </PagePropsPanel>

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
                    <PageMeasureBox width={computeWidth(STRESS_ITEMS[configIndex].size)}>
                        <DefaultExample
                            {...props}
                            playbackOpts={stressPlaybackOpts}
                            animationIterationDelayMs={STRESS_ITERATION_DELAY_MS}
                            playback={modalPlayback}
                            cellCount={STRESS_CELL_COUNT}
                            renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
                        />
                    </PageMeasureBox>
                )}
            />
        </>
    );
};

export const CellAnimationPage = () => {
    const playback = useState(true);
    const sourcedPlayback = useState(true);
    const sourcedProgress = useState(0);

    const [sourceKind, setSourceKind] = useState<CellAnimationSourceKind>(CellAnimationKnobs.STARTING_SOURCE_KIND);
    const [imageSrc, setImageSrc] = useState(knight_profile);
    const [gradientKey, setGradientKey] = useState<SVGDefsSamples.Gradient.Timed.SampleKey>(
        CellAnimationKnobs.STARTING_GRADIENT_KEY,
    );
    const [patternKey, setPatternKey] = useState<SVGDefsSamples.Pattern.Timed.SampleKey>(
        CellAnimationKnobs.STARTING_PATTERN_KEY,
    );
    const [sourceRatio, setSourceRatio] = useState<SVGDefsSources.SourceRatio>(CellAnimationKnobs.DEFAULT_SOURCE_RATIO);

    const [originType, setOriginType] = useState<CellAnimationOrigins.OriginType>(
        CellAnimationKnobs.STARTING_ORIGIN_KEY,
    );
    const [weightType, setWeightType] = useState<SliceAnimationWeights.WeightType>(
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
    const [cellCount, setCellCount] = useState<Count2d>(() => ({ ...CellAnimationKnobs.STARTING_CELL_COUNT }));
    const [weightOpts, setWeightOpts] = useState<WeightOpts>(() => ({ ...CellAnimationKnobs.STARTING_WEIGHT_OPTS }));
    const [breakpointOpts, setBreakpointOpts] = useState<SliceAnimationBreakpointOpts>(() => ({
        ...CellAnimationKnobs.STARTING_BREAKPOINT_OPTS,
    }));
    const [playbackOpts, setPlaybackOpts] = useState<SliceAnimationPlaybackOpts>(() => ({
        ...CellAnimationKnobs.STARTING_PLAYBACK_OPTS,
    }));

    const sourceSize = useMemo(() => SVGDefsSources.computeSourceSize(sourceRatio), [sourceRatio]);

    const cycleDurationMs = SliceAnimationPlaybackUtils.computeCycleDurationMs(animationDurationMs, playbackOpts);

    const sourcedSrc = useMemo(() => {
        if (sourceKind === "gradient") {
            return SVGDefsSources.computeGradientSource(
                gradientKey,
                sourceSize,
                cycleDurationMs,
                animationIterationDelayMs,
            );
        }

        if (sourceKind === "pattern") {
            return SVGDefsSources.computePatternSource(patternKey, sourceSize, cycleDurationMs);
        }

        return imageSrc;
    }, [sourceKind, imageSrc, gradientKey, patternKey, sourceSize, cycleDurationMs, animationIterationDelayMs]);

    const computeSourcedWidth = (longestSide: number) =>
        sourceKind === "image" ? longestSide : computeContainerWidth(sourceSize, longestSide);

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
            key: "source",
            name: EXAMPLE_NAMES.source,
            readout: () =>
                `${Math.round(sourcedProgress[0] * PERCENT)}% through the pass, ${sourcedPlayback[0] ? "running" : "stopped"} — ${SOURCE_READOUTS[sourceKind]}`,
            component: () => (
                <SourcedExampleWrapper
                    {...commonProps}
                    src={sourcedSrc}
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
            component: () => <StressTestWrapper {...commonProps} src={sourcedSrc} computeWidth={computeSourcedWidth} />,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsGroups>
                <PagePropsPanel scope={"sample"}>
                    <PageProp itemKey={"sourceKind"} {...CellAnimationKnobs.SOURCE_KIND_TEXT}>
                        <PageSelectField
                            value={sourceKind}
                            values={CellAnimationKnobs.SOURCE_KINDS}
                            ariaLabel={"Source"}
                            onChange={(kind) => setSourceKind(kind)}
                        />
                    </PageProp>

                    {sourceKind === "image" && (
                        <PageProp itemKey={"image"} {...CellAnimationKnobs.IMAGE_TEXT}>
                            <PageFileField
                                accept={"image/*"}
                                ariaLabel={"Image"}
                                onPick={(file) => setImageSrc(URL.createObjectURL(file))}
                            />
                        </PageProp>
                    )}

                    {sourceKind === "gradient" && (
                        <PageProp itemKey={"gradient"} {...CellAnimationKnobs.GRADIENT_TEXT}>
                            <PageSelectField
                                value={gradientKey}
                                values={SVGDefsSources.GRADIENT_KEYS}
                                ariaLabel={"Gradient"}
                                onChange={(key) => setGradientKey(key)}
                            />
                        </PageProp>
                    )}

                    {sourceKind === "pattern" && (
                        <PageProp itemKey={"pattern"} {...CellAnimationKnobs.PATTERN_TEXT}>
                            <PageSelectField
                                value={patternKey}
                                values={SVGDefsSources.PATTERN_KEYS}
                                ariaLabel={"Pattern"}
                                onChange={(key) => setPatternKey(key)}
                            />
                        </PageProp>
                    )}

                    {sourceKind !== "image" && (
                        <PageProp itemKey={"sourceRatio"} {...CellAnimationKnobs.SOURCE_RATIO_TEXT}>
                            <PageSelectField
                                value={sourceRatio}
                                values={SVGDefsSources.SOURCE_RATIOS}
                                ariaLabel={"Ratio"}
                                onChange={(ratio) => setSourceRatio(ratio)}
                            />
                        </PageProp>
                    )}
                </PagePropsPanel>

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp itemKey={"cellCountCols"} {...CellAnimationKnobs.CELL_COUNT_COLS_TEXT}>
                        <div className={styles.valueList}>
                            <PageNumberField
                                value={cellCount.colCount}
                                min={CellAnimationKnobs.MIN_CELL_COUNT}
                                max={CellAnimationKnobs.MAX_CELL_COUNT}
                                step={CellAnimationKnobs.CELL_COUNT_STEP}
                                ariaLabel={"Columns"}
                                onInput={(value) => setCellCount((previous) => ({ ...previous, colCount: value }))}
                            />
                            <PageNumberField
                                value={cellCount.rowCount}
                                min={CellAnimationKnobs.MIN_CELL_COUNT}
                                max={CellAnimationKnobs.MAX_CELL_COUNT}
                                step={CellAnimationKnobs.CELL_COUNT_STEP}
                                ariaLabel={"Rows"}
                                onInput={(value) => setCellCount((previous) => ({ ...previous, rowCount: value }))}
                            />
                        </div>
                    </PageProp>

                    <PageProp itemKey={"originType"} {...CellAnimationKnobs.ORIGIN_TYPE_TEXT}>
                        <PageSelectField
                            value={originType}
                            values={CellAnimationOrigins.ORIGIN_TYPES}
                            isDisabled={!SliceAnimationWeights.isOriginAware(weightType)}
                            ariaLabel={"Origin"}
                            onChange={(origin) => setOriginType(origin)}
                        />
                    </PageProp>

                    <PageProp itemKey={"weightType"} {...CellAnimationKnobs.WEIGHT_TYPE_TEXT}>
                        <PageGroupedSelectField
                            value={weightType}
                            groups={GROUPPED_WEIGHTS}
                            ariaLabel={"Weight"}
                            onChange={(weight) => setWeightType(weight)}
                        />
                    </PageProp>

                    <PageProp itemKey={"uniqueWeights"} {...CellAnimationKnobs.UNIQUE_WEIGHTS_TEXT}>
                        <PageCheckField
                            value={!!weightOpts.shouldMakeUnique}
                            ariaLabel={"Unique weights"}
                            onChange={(value) =>
                                setWeightOpts((previous) => ({ ...previous, shouldMakeUnique: value }))
                            }
                        />
                    </PageProp>

                    <PageProp itemKey={"normalizeWeights"} {...CellAnimationKnobs.NORMALIZE_WEIGHTS_TEXT}>
                        <PageCheckField
                            value={!!weightOpts.shouldNormalize}
                            ariaLabel={"Normalize weights"}
                            onChange={(value) => setWeightOpts((previous) => ({ ...previous, shouldNormalize: value }))}
                        />
                    </PageProp>

                    <PageProp itemKey={"animationType"} {...CellAnimationKnobs.ANIMATION_TYPE_TEXT}>
                        <PageGroupedSelectField
                            value={animationType}
                            groups={GROUPPED_ANIMATIONS}
                            ariaLabel={"Animation"}
                            onChange={(anim) => setAnimationType(anim)}
                        />
                    </PageProp>

                    <PageProp itemKey={"direction"} {...CellAnimationKnobs.DIRECTION_TEXT}>
                        <PageSelectField
                            value={breakpointOpts.dir!}
                            values={SliceAnimationBreakpoints.DIRECTIONS}
                            ariaLabel={"Direction"}
                            onChange={(dir) => setBreakpointOpts((previous) => ({ ...previous, dir }))}
                        />
                    </PageProp>

                    <PageProp itemKey={"easing"} {...CellAnimationKnobs.EASING_TEXT}>
                        <PageSelectField
                            value={breakpointOpts.easing!}
                            values={SliceAnimationBreakpoints.EASINGS}
                            ariaLabel={"Easing"}
                            onChange={(easing) => setBreakpointOpts((previous) => ({ ...previous, easing }))}
                        />
                    </PageProp>

                    <PageProp itemKey={"smoothness01"} {...CellAnimationKnobs.SMOOTHNESS01_TEXT}>
                        <PageNumberField
                            value={breakpointOpts.smoothness!}
                            min={CellAnimationKnobs.MIN_SMOOTHNESS}
                            max={CellAnimationKnobs.MAX_SMOOTHNESS}
                            step={CellAnimationKnobs.SMOOTHNESS_STEP}
                            ariaLabel={"Smoothness"}
                            onInput={(value) => setBreakpointOpts((previous) => ({ ...previous, smoothness: value }))}
                        />
                    </PageProp>

                    <PageProp itemKey={"animationDurationMs"} {...CellAnimationKnobs.ANIMATION_DURATION_MS_TEXT}>
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
                        {...CellAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT}
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
                        {...CellAnimationKnobs.ANIMATION_ITERATION_COUNT_TEXT}
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

                    <PageProp itemKey={"finalFrame"} {...CellAnimationKnobs.FINAL_FRAME_TEXT}>
                        <PageSelectField
                            value={finalFrame}
                            values={CELL_ANIMATION_FINAL_FRAMES}
                            isDisabled={animationIterationCount === CellAnimationKnobs.ENDLESS_ITERATION_COUNT}
                            ariaLabel={"Final frame"}
                            onChange={(frame) => setFinalFrame(frame)}
                        />
                    </PageProp>

                    <PageProp itemKey={"playbackDir"} {...CellAnimationKnobs.PLAYBACK_DIR_TEXT}>
                        <PageSelectField
                            value={playbackOpts.dir!}
                            values={SliceAnimationPlayback.DIRECTIONS}
                            ariaLabel={"Playback direction"}
                            onChange={(dir) => setPlaybackOpts((previous) => ({ ...previous, dir }))}
                        />
                    </PageProp>

                    <PageProp itemKey={"holdMs"} {...CellAnimationKnobs.HOLD_MS_TEXT}>
                        <PageNumberField
                            value={playbackOpts.holdMs!}
                            min={CellAnimationKnobs.MIN_HOLD_MS}
                            max={CellAnimationKnobs.MAX_HOLD_MS}
                            step={CellAnimationKnobs.DURATION_STEP_MS}
                            isDisabled={!SliceAnimationPlaybackUtils.isRoundTrip(playbackOpts.dir)}
                            ariaLabel={"Hold at far end"}
                            onInput={(value) => setPlaybackOpts((previous) => ({ ...previous, holdMs: value }))}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
