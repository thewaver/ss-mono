import { useMemo, useState } from "react";

import {
    SCANLINE_ANIMATION_DEFAULTS,
    SCANLINE_ANIMATION_ORIENTATIONS,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    SliceAnimationBreakpoints,
    SliceAnimationWeights,
} from "@thewaver/ss-components-react";
import type {
    ScanlineAnimationOrientation,
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalDropoutOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalInterlaceOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
    SliceAnimationBreakpointDirection,
    SliceAnimationBreakpointOpts,
    SliceAnimationRenderer,
} from "@thewaver/ss-components-react";
import { ScanlineAnimationKeyframeKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimationKeyframes.const";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    IMAGE_CONTAINER_SIZE,
    STRESS_ITEMS,
    STRESS_ITERATION_DELAY_MS,
    STRESS_LINE_COUNT,
    WEIGHT_ORIGIN,
} from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";
import type { Count2d } from "@thewaver/ss-utils";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageCheckField,
    PageFileField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import {
    PlaybackGroupContextProvider,
    usePagePlayback,
} from "../../PageComponents/PlaybackScrubber/PlaybackGroup.context";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { BrightnessExample } from "./Examples/Brightness";
import { DropoutExample } from "./Examples/Dropout";
import { GlitchExample } from "./Examples/Glitch";
import { GrayscaleExample } from "./Examples/Grayscale";
import { HueExample } from "./Examples/Hue";
import { InterlaceExample } from "./Examples/Interlace";
import { SnakeExample } from "./Examples/Snake";
import { SplitExample } from "./Examples/Split";
import { SurgeExample } from "./Examples/Surge";
import type { ScanlineAnimationExampleProps } from "./ScanlineAnimationPage.types";

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

const GROUPPED_WEIGHTS = groupOptions(SliceAnimationWeights.ORIGIN_FREE_WEIGHT_TYPES);

const pickStressKeyframes = (kind: "transform" | "filter") => {
    const random = Math.random() * 3;

    return kind === "transform"
        ? random < 1
            ? ScanlineAnimationKeyframes.createHorizontalSnake()
            : random < 2
              ? ScanlineAnimationKeyframes.createHorizontalSplit()
              : ScanlineAnimationKeyframes.createHorizontalStretch()
        : random < 1
          ? ScanlineAnimationKeyframes.createHorizontalBrightness()
          : random < 2
            ? ScanlineAnimationKeyframes.createHorizontalHue()
            : ScanlineAnimationKeyframes.createHorizontalGrayscale();
};

type StressItemProps = ScanlineAnimationExampleProps & {
    configIndex: number;
    modalPlayback: readonly [boolean, (isPlaying: boolean) => void];
    renderer: SliceAnimationRenderer;
};

const StressItem = ({ configIndex, modalPlayback, weightType, ...props }: StressItemProps) => {
    const [animation] = useState(() => pickStressKeyframes(STRESS_ITEMS[configIndex].kind));

    const computeSliceWeights = useMemo(
        () => (count: Count2d) => SliceAnimationWeights.computeSliceWeights(weightType, count, WEIGHT_ORIGIN),
        [weightType],
    );

    return (
        <PageMeasureBox width={STRESS_ITEMS[configIndex].size} height={STRESS_ITEMS[configIndex].size}>
            <ScanlineAnimation
                {...props}
                playback={modalPlayback}
                lineCount={STRESS_LINE_COUNT}
                animationIterationDelayMs={STRESS_ITERATION_DELAY_MS}
                computeSliceWeights={computeSliceWeights}
                computeSliceAnimation={animation}
            />
        </PageMeasureBox>
    );
};

const StressTestWrapper = (props: ScanlineAnimationExampleProps) => {
    const modalPlayback = useState(true);

    const [isOnGraphicsCard, setIsOnGraphicsCard] = useState(true);

    return (
        <>
            <div>{"120 lines"}</div>

            <PagePropsPanel scope={"local"} hasReset={false}>
                <PageProp itemKey={"onGraphicsCard"} {...ScanlineAnimationKnobs.ON_GRAPHICS_CARD_TEXT}>
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
                renderLabel={(configIndex) =>
                    `Render ${STRESS_ITEMS[configIndex].count} ${STRESS_ITEMS[configIndex].kind} items`
                }
                renderItem={(configIndex) => (
                    <StressItem
                        {...props}
                        configIndex={configIndex}
                        modalPlayback={modalPlayback}
                        renderer={isOnGraphicsCard ? "graphics_card" : "elements"}
                    />
                )}
            />
        </>
    );
};

const SmoothnessInput = (props: { value: number; setter: (value: number) => void }) => {
    return (
        <PageProp itemKey={"smoothness01"} {...ScanlineAnimationKnobs.SMOOTHNESS01_TEXT}>
            <PageNumberField
                value={props.value}
                min={ScanlineAnimationKnobs.MIN_SMOOTHNESS}
                max={ScanlineAnimationKnobs.MAX_SMOOTHNESS}
                step={ScanlineAnimationKnobs.SMOOTHNESS_STEP}
                ariaLabel={"Smoothness"}
                onInput={props.setter}
            />
        </PageProp>
    );
};

const DirInput = (props: {
    value: SliceAnimationBreakpointDirection;
    setter: (value: SliceAnimationBreakpointDirection) => void;
}) => {
    return (
        <PageProp itemKey={"direction"} {...ScanlineAnimationKnobs.DIRECTION_TEXT}>
            <PageSelectField
                value={props.value}
                values={SliceAnimationBreakpoints.DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={props.setter}
            />
        </PageProp>
    );
};

const useFieldState = <T extends object>(initial: T) => {
    const [value, setValue] = useState(initial);

    const setField = <K extends keyof T>(key: K, fieldValue: T[K]) =>
        setValue((previous) => ({ ...previous, [key]: fieldValue }));

    return [value, setField] as const;
};

const GlitchExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineGlitch");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <GlitchExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineGlitch"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageProp itemKey={"count"} {...ScanlineAnimationKnobs.COUNT_TEXT}>
                    <PageNumberField
                        value={keyframeOpts.count}
                        min={ScanlineAnimationKnobs.MIN_GLITCH_COUNT}
                        max={ScanlineAnimationKnobs.MAX_GLITCH_COUNT}
                        step={ScanlineAnimationKnobs.GLITCH_COUNT_STEP}
                        ariaLabel={"Count"}
                        onInput={(value) => setKeyframeOpts("count", value)}
                    />
                </PageProp>

                <PageProp itemKey={"maxShift"} {...ScanlineAnimationKnobs.MAX_SHIFT_TEXT}>
                    <PageNumberField
                        value={keyframeOpts.shiftPercent}
                        min={ScanlineAnimationKnobs.MIN_SHIFT_PERCENT}
                        max={ScanlineAnimationKnobs.MAX_SHIFT_PERCENT}
                        step={ScanlineAnimationKnobs.SHIFT_PERCENT_STEP}
                        ariaLabel={"Shift percent"}
                        onInput={(value) => setKeyframeOpts("shiftPercent", value)}
                    />
                </PageProp>

                <PageProp itemKey={"chunkyness01"} {...ScanlineAnimationKnobs.CHUNKYNESS01_TEXT}>
                    <PageNumberField
                        value={keyframeOpts.chunkyness}
                        min={ScanlineAnimationKnobs.MIN_CHUNKYNESS}
                        max={ScanlineAnimationKnobs.MAX_CHUNKYNESS}
                        step={ScanlineAnimationKnobs.CHUNKYNESS_STEP}
                        ariaLabel={"Chunkyness"}
                        onInput={(value) => setKeyframeOpts("chunkyness", value)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const SurgeExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineSurge");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SURGE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SurgeExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts as ScanlineHorizontalStretchOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineSurge"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={ScanlineAnimationKeyframeKnobs.STRETCH_KNOBS as Record<string, Knob>}
                    defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_STRETCH_OPTS}
                    values={keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const SnakeExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineSnake");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SNAKE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SnakeExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts as ScanlineHorizontalSnakeOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineSnake"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={ScanlineAnimationKeyframeKnobs.SNAKE_KNOBS as Record<string, Knob>}
                    defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SNAKE_OPTS}
                    values={keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const SplitExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineSplit");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SPLIT_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SplitExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts as ScanlineHorizontalSplitOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineSplit"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={ScanlineAnimationKeyframeKnobs.SPLIT_KNOBS as Record<string, Knob>}
                    defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SPLIT_OPTS}
                    values={keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const BrightnessExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineBrightness");
    const progress = useState(0);

    const [keyframeOpts] = useState<ScanlineHorizontalBrightnessOpts>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_BRIGHTNESS_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <BrightnessExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineBrightness"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const GrayscaleExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineGrayscale");
    const progress = useState(0);

    const [keyframeOpts] = useState<ScanlineHorizontalGrayscaleOpts>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_GRAYSCALE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <GrayscaleExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineGrayscale"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const HueExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineHue");
    const progress = useState(0);

    const [keyframeOpts] = useState<ScanlineHorizontalHueOpts>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_HUE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <HueExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineHue"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const DropoutExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineDropout");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_DROPOUT_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <DropoutExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts as ScanlineHorizontalDropoutOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineDropout"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={ScanlineAnimationKeyframeKnobs.DROPOUT_KNOBS as Record<string, Knob>}
                    defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_DROPOUT_OPTS}
                    values={keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const InterlaceExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = usePagePlayback("scanlineInterlace");
    const progress = useState(0);

    const [keyframeOpts, setKeyframeOpts] = useFieldState<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = useFieldState<SliceAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_INTERLACE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div className={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <InterlaceExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={keyframeOpts as ScanlineHorizontalInterlaceOpts}
                        breakpointOpts={breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineInterlace"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={ScanlineAnimationKeyframeKnobs.INTERLACE_KNOBS as Record<string, Knob>}
                    defaults={ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_INTERLACE_OPTS}
                    values={keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    value={breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput value={breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

export const ScanlineAnimationPage = () => {
    const playback = useState(true);
    const takePlayback = PlaybackScrubberUtils.useGroup("scanlineGlitch");

    const [src, setSrc] = useState(knight);
    const [lineCount, setLineCount] = useState(ScanlineAnimationKnobs.STARTING_LINE_COUNT);
    const [orientation, setOrientation] = useState<ScanlineAnimationOrientation>(
        SCANLINE_ANIMATION_DEFAULTS.orientation,
    );
    const [animationDurationMs, setAnimationDurationMs] = useState(ScanlineAnimationKnobs.STARTING_DURATION_MS);
    const [animationIterationDelayMs, setAnimationIterationDelayMs] = useState(
        ScanlineAnimationKnobs.STARTING_ITERATION_DELAY_MS,
    );
    const [weightType, setWeightType] = useState<SliceAnimationWeights.OriginFreeWeightType>(
        ScanlineAnimationKnobs.STARTING_WEIGHT_TYPE,
    );

    const handleFile = (file: File) => {
        setSrc(URL.createObjectURL(file));
    };

    const commonProps: ScanlineAnimationExampleProps = {
        playback,
        src,
        lineCount,
        orientation,
        weightType,
        animationDurationMs,
        animationIterationDelayMs,
    };

    const examples = [
        {
            key: "glitch",
            name: EXAMPLE_NAMES.glitch,
            component: () => <GlitchExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Glitch.tsx`,
        },
        {
            key: "surge",
            name: EXAMPLE_NAMES.surge,
            component: () => <SurgeExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Surge.tsx`,
        },
        {
            key: "snake",
            name: EXAMPLE_NAMES.snake,
            component: () => <SnakeExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Snake.tsx`,
        },
        {
            key: "split",
            name: EXAMPLE_NAMES.split,
            component: () => <SplitExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Split.tsx`,
        },
        {
            key: "dropout",
            name: EXAMPLE_NAMES.dropout,
            component: () => <DropoutExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Dropout.tsx`,
        },
        {
            key: "brightness",
            name: EXAMPLE_NAMES.brightness,
            component: () => <BrightnessExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Brightness.tsx`,
        },
        {
            key: "grayscale",
            name: EXAMPLE_NAMES.grayscale,
            component: () => <GrayscaleExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Grayscale.tsx`,
        },
        {
            key: "hue",
            name: EXAMPLE_NAMES.hue,
            component: () => <HueExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Hue.tsx`,
        },
        {
            key: "interlace",
            name: EXAMPLE_NAMES.interlace,
            component: () => <InterlaceExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Interlace.tsx`,
        },
        {
            key: "stressTest",
            name: EXAMPLE_NAMES.stressTest,
            component: () => <StressTestWrapper {...commonProps} />,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp itemKey={"image"} {...ScanlineAnimationKnobs.IMAGE_TEXT}>
                    <PageFileField accept={"image/*"} ariaLabel={"Image"} onPick={handleFile} />
                </PageProp>

                <PageProp itemKey={"weightType"} {...ScanlineAnimationKnobs.WEIGHT_TYPE_TEXT}>
                    <PageGroupedSelectField
                        value={weightType}
                        groups={GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={setWeightType}
                    />
                </PageProp>

                <PageProp itemKey={"lineCount"} {...ScanlineAnimationKnobs.LINE_COUNT_TEXT}>
                    <PageNumberField
                        value={lineCount}
                        min={ScanlineAnimationKnobs.MIN_LINE_COUNT}
                        max={ScanlineAnimationKnobs.MAX_LINE_COUNT}
                        step={ScanlineAnimationKnobs.LINE_COUNT_STEP}
                        ariaLabel={"Line count"}
                        onInput={setLineCount}
                    />
                </PageProp>

                <PageProp itemKey={"orientation"} {...ScanlineAnimationKnobs.ORIENTATION_TEXT}>
                    <PageSelectField
                        value={orientation}
                        values={SCANLINE_ANIMATION_ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={setOrientation}
                    />
                </PageProp>

                <PageProp itemKey={"animationDurationMs"} {...ScanlineAnimationKnobs.ANIMATION_DURATION_MS_TEXT}>
                    <PageNumberField
                        value={animationDurationMs}
                        min={ScanlineAnimationKnobs.MIN_DURATION_MS}
                        max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                        step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"animationIterationDelayMs"}
                    {...ScanlineAnimationKnobs.ANIMATION_ITERATION_DELAY_MS_TEXT}
                >
                    <PageNumberField
                        value={animationIterationDelayMs}
                        min={ScanlineAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                        step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PlaybackGroupContextProvider value={takePlayback}>
                <PageExamples items={examples} layout={"flow"} />
            </PlaybackGroupContextProvider>
        </div>
    );
};
