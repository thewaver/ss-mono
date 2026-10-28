import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CellAnimationBreakpointUtils,
    CellAnimationBreakpoints,
    CellAnimationWeights,
    SCANLINE_ANIMATION_DEFAULTS,
    SCANLINE_ANIMATION_ORIENTATIONS,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components-solid";
import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    ScanlineHorizontalBrightnessOpts,
    ScanlineHorizontalGrayscaleOpts,
    ScanlineHorizontalHueOpts,
    ScanlineHorizontalSnakeOpts,
    ScanlineHorizontalSplitOpts,
    ScanlineHorizontalStretchOpts,
    _ScanlineHorizontalDropoutOpts,
    _ScanlineHorizontalInterlaceOpts,
    _ScanlineHorizontalRollOpts,
    _ScanlineHorizontalSkewOpts,
    _ScanlineHorizontalWaveOpts,
} from "@thewaver/ss-components-solid";
import { ScanlineAnimationKeyframeKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimationKeyframes.const";
import { ScanlineAnimationKnobs } from "@thewaver/ss-playground/App/Knobs/ScanlineAnimations.const";
import {
    EXAMPLES_ROOT,
    EXAMPLE_NAMES,
    IMAGE_CONTAINER_SIZE,
    STRESS_ITEMS,
    STRESS_LINE_COUNT,
    WEIGHT_ORIGIN,
} from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanLineAnimationPage.const";
import * as styles from "@thewaver/ss-playground/App/Pages/ScanLineAnimationPage/ScanlineAnimationPage.css";
import knight from "@thewaver/ss-playground/App/knight.webp";

import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import {
    PageFileField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../PageComponents/Field/Field";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePlaybackScrubber } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber";
import { PlaybackScrubberUtils } from "../../PageComponents/PlaybackScrubber/PlaybackScrubber.utils";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import { BrightnessExample } from "./Examples/Brightness";
import { GlitchExample } from "./Examples/Glitch";
import { GrayscaleExample } from "./Examples/Grayscale";
import { HueExample } from "./Examples/Hue";
import { SnakeExample } from "./Examples/Snake";
import { SplitExample } from "./Examples/Split";
import { SurgeExample } from "./Examples/Surge";
import { DropoutExample } from "./Examples/_Dropout";
import { InterlaceExample } from "./Examples/_Interlace";
import { RollExample } from "./Examples/_Roll";
import { SkewExample } from "./Examples/_Skew";
import { WaveExample } from "./Examples/_Wave";
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

const GROUPPED_WEIGHTS = groupOptions(CellAnimationWeights.ORIGIN_FREE_WEIGHT_TYPES);

const StressTestWrapper = (props: ScanlineAnimationExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <>
            <div>{"120 lines"}</div>

            <StressTest
                configs={STRESS_ITEMS}
                onHideModal={() => {
                    props.playback[1](true);
                }}
                onShowModal={() => {
                    props.playback[1](false);
                }}
                renderLabel={(getConfigIndex) =>
                    `Render ${STRESS_ITEMS[getConfigIndex()].count} ${STRESS_ITEMS[getConfigIndex()].kind} items`
                }
                renderItem={(getConfigIndex) => {
                    const random = Math.random() * 3;
                    const foo =
                        STRESS_ITEMS[getConfigIndex()].kind === "transform"
                            ? random < 1
                                ? ScanlineAnimationKeyframes.computeHorizontalSnake
                                : random < 2
                                  ? ScanlineAnimationKeyframes.computeHorizontalSplit
                                  : ScanlineAnimationKeyframes.computeHorizontalStretch
                            : random < 1
                              ? ScanlineAnimationKeyframes.computeHorizontalBrightness
                              : random < 2
                                ? ScanlineAnimationKeyframes.computeHorizontalHue
                                : ScanlineAnimationKeyframes.computeHorizontalGrayscale;

                    return (
                        <PageMeasureBox
                            width={() => STRESS_ITEMS[getConfigIndex()].size}
                            height={() => STRESS_ITEMS[getConfigIndex()].size}
                        >
                            <ScanlineAnimation
                                {...props}
                                playback={modalPlayback}
                                lineCount={STRESS_LINE_COUNT}
                                animationIterationDelayMs={0}
                                computeCellWeights={(count) =>
                                    CellAnimationWeights.computeCellWeights(
                                        access(props.weightType),
                                        count,
                                        WEIGHT_ORIGIN,
                                    )
                                }
                                computeScanlineAnimation={(defs, timeline) =>
                                    foo(
                                        CellAnimationBreakpointUtils.computeBreakpoints(defs.weight, undefined),
                                        defs,
                                        timeline,
                                        undefined,
                                    )
                                }
                            />
                        </PageMeasureBox>
                    );
                }}
            />
        </>
    );
};

const SmoothnessInput = (props: { getter: () => number; setter: (value: number) => void }) => {
    return (
        <PageProp
            key={"smoothness01"}
            label={"Smoothness (0-1)"}
            hint={
                "How much one line's movement overlaps its neighbors'. 0 makes each line wait its turn; 1 blurs them into one sweep."
            }
            controls={"Sets CellAnimationBreakpointOpts.smoothness"}
        >
            <PageNumberField
                value={props.getter}
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
    getter: () => CellAnimationBreakpointDirection;
    setter: (value: CellAnimationBreakpointDirection) => void;
}) => {
    return (
        <PageProp
            key={"direction"}
            label={"Direction"}
            hint={"Which way the sweep travels through the lines, and so which lines go first."}
            controls={"Sets CellAnimationBreakpointOpts.dir"}
        >
            <PageSelectField
                value={props.getter}
                values={CellAnimationBreakpoints.DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={props.setter}
            />
        </PageProp>
    );
};

const GlitchExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore({ ...ScanlineAnimationKnobs.STARTING_GLITCH_OPTS });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <GlitchExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts}
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
                <PageProp
                    key={"count"}
                    label={"Count"}
                    hint={"How many glitch bursts happen over one pass."}
                    controls={
                        "Sets the number of glitch bursts in the example's ScanlineAnimationProps.computeScanlineAnimation"
                    }
                >
                    <PageNumberField
                        value={() => keyframeOpts.count!}
                        min={ScanlineAnimationKnobs.MIN_GLITCH_COUNT}
                        max={ScanlineAnimationKnobs.MAX_GLITCH_COUNT}
                        step={ScanlineAnimationKnobs.GLITCH_COUNT_STEP}
                        ariaLabel={"Count"}
                        onInput={(value) => setKeyframeOpts("count", value)}
                    />
                </PageProp>

                <PageProp
                    key={"maxShift"}
                    label={"Max shift (%)"}
                    hint={"How far a line can be thrown sideways at the worst of a burst, as a share of its own width."}
                    controls={
                        "Sets how far rows slide in the example's ScanlineAnimationProps.computeScanlineAnimation"
                    }
                >
                    <PageNumberField
                        value={() => keyframeOpts.shiftPercent!}
                        min={ScanlineAnimationKnobs.MIN_SHIFT_PERCENT}
                        max={ScanlineAnimationKnobs.MAX_SHIFT_PERCENT}
                        step={ScanlineAnimationKnobs.SHIFT_PERCENT_STEP}
                        ariaLabel={"Shift percent"}
                        onInput={(value) => setKeyframeOpts("shiftPercent", value)}
                    />
                </PageProp>

                <PageProp
                    key={"chunkyness01"}
                    label={"Chunkyness (0-1)"}
                    hint={
                        "How blocky the glitch is: low values throw single lines about, high values throw thick slabs."
                    }
                    controls={
                        "Sets how many neighboring rows slide together in the example's ScanlineAnimationProps.computeScanlineAnimation"
                    }
                >
                    <PageNumberField
                        value={() => keyframeOpts.chunkyness}
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
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SURGE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SurgeExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as ScanlineHorizontalStretchOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    knobs={() => ScanlineAnimationKeyframeKnobs.STRETCH_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_STRETCH_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const SnakeExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SNAKE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SnakeExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as ScanlineHorizontalSnakeOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    knobs={() => ScanlineAnimationKeyframeKnobs.SNAKE_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SNAKE_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const SplitExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SPLIT_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SplitExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as ScanlineHorizontalSplitOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    knobs={() => ScanlineAnimationKeyframeKnobs.SPLIT_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SPLIT_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const BrightnessExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts] = createStore<ScanlineHorizontalBrightnessOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_BRIGHTNESS_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <BrightnessExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const GrayscaleExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts] = createStore<ScanlineHorizontalGrayscaleOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_GRAYSCALE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <GrayscaleExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const HueExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts] = createStore<ScanlineHorizontalHueOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_HUE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <HueExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const WaveExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_WAVE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <WaveExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as _ScanlineHorizontalWaveOpts}
                        breakpointOpts={() => breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineWave"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={() => ScanlineAnimationKeyframeKnobs.WAVE_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_WAVE_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const RollExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_ROLL_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <RollExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as _ScanlineHorizontalRollOpts}
                        breakpointOpts={() => breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineRoll"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={() => ScanlineAnimationKeyframeKnobs.ROLL_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_ROLL_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const DropoutExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_DROPOUT_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <DropoutExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as _ScanlineHorizontalDropoutOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    knobs={() => ScanlineAnimationKeyframeKnobs.DROPOUT_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_DROPOUT_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const InterlaceExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_INTERLACE_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <InterlaceExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as _ScanlineHorizontalInterlaceOpts}
                        breakpointOpts={() => breakpointOpts}
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
                    knobs={() => ScanlineAnimationKeyframeKnobs.INTERLACE_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_INTERLACE_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

const SkewExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const playback = createSignal(true);
    const progress = createSignal(0);

    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        ...ScanlineAnimationKnobs.STARTING_SKEW_BREAKPOINT_OPTS,
    });

    return (
        <>
            <div class={styles.stack}>
                <PageMeasureBox width={IMAGE_CONTAINER_SIZE}>
                    <SkewExample
                        {...props}
                        playback={PlaybackScrubberUtils.gate(playback, props.playback[0])}
                        progress={progress}
                        keyframeOpts={() => keyframeOpts as _ScanlineHorizontalSkewOpts}
                        breakpointOpts={() => breakpointOpts}
                    />
                </PageMeasureBox>

                <PagePlaybackScrubber
                    id={"scanlineSkew"}
                    ariaLabel={"Position in the pass"}
                    playback={playback}
                    progress={progress}
                />
            </div>

            <PageExampleKnobs>
                <PageKnobs
                    knobs={() => ScanlineAnimationKeyframeKnobs.SKEW_KNOBS as Record<string, Knob>}
                    defaults={() => ScanlineAnimationKeyframes.DEFAULT_HORIZONTAL_SKEW_OPTS}
                    values={() => keyframeOpts}
                    onInput={(key, value) => setKeyframeOpts(key, value)}
                />

                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PageExampleKnobs>
        </>
    );
};

export const ScanlineAnimationPage = () => {
    const playback = createSignal(true);

    const [getSrc, setSrc] = createSignal(knight);
    const [getLineCount, setLineCount] = createSignal(ScanlineAnimationKnobs.STARTING_LINE_COUNT);
    const [getOrientation, setOrientation] = createSignal(SCANLINE_ANIMATION_DEFAULTS.orientation);
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(ScanlineAnimationKnobs.STARTING_DURATION_MS);
    const [getAnimationIterationDelayMs, setAnimationIterationDelayMs] = createSignal(
        ScanlineAnimationKnobs.STARTING_ITERATION_DELAY_MS,
    );
    const [getWeightType, setWeightType] = createSignal<CellAnimationWeights.OriginFreeWeightType>(
        ScanlineAnimationKnobs.STARTING_WEIGHT_TYPE,
    );

    const handleFile = (file: File) => {
        setSrc(URL.createObjectURL(file));
    };

    const getExamples = createMemo(() => {
        const commonProps: ScanlineAnimationExampleProps = {
            playback,
            src: getSrc,
            lineCount: getLineCount,
            orientation: getOrientation,
            weightType: getWeightType,
            animationDurationMs: getAnimationDurationMs,
            animationIterationDelayMs: getAnimationIterationDelayMs,
        };

        return [
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
                key: "_wave",
                name: EXAMPLE_NAMES._wave,
                component: () => <WaveExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Wave.tsx`,
            },
            {
                key: "_roll",
                name: EXAMPLE_NAMES._roll,
                component: () => <RollExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Roll.tsx`,
            },
            {
                key: "_dropout",
                name: EXAMPLE_NAMES._dropout,
                component: () => <DropoutExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Dropout.tsx`,
            },
            {
                key: "_interlace",
                name: EXAMPLE_NAMES._interlace,
                component: () => <InterlaceExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Interlace.tsx`,
            },
            {
                key: "_skew",
                name: EXAMPLE_NAMES._skew,
                component: () => <SkewExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Skew.tsx`,
            },
            {
                key: "stressTest",
                name: EXAMPLE_NAMES.stressTest,
                component: () => <StressTestWrapper {...commonProps} />,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"image"}
                    label={"Image"}
                    hint={
                        "Swaps in a picture of your own, so the sweep can be watched against something other than the sample."
                    }
                    controls={"Picks the example picture sent to ScanlineAnimationProps.src"}
                >
                    <PageFileField accept={"image/*"} ariaLabel={"Image"} onPick={handleFile} />
                </PageProp>

                <PageProp
                    key={"weightType"}
                    label={"Weight"}
                    hint={"How each line's turn is decided: its position, a wave, a random draw, and so on."}
                    controls={"Picks the example's weight function sent to ScanlineAnimationProps.computeCellWeights"}
                >
                    <PageGroupedSelectField
                        value={getWeightType}
                        groups={GROUPPED_WEIGHTS}
                        ariaLabel={"Weight"}
                        onChange={(weight) => setWeightType(() => weight)}
                    />
                </PageProp>

                <PageProp
                    key={"lineCount"}
                    label={"Line count"}
                    hint={
                        "How many lines the picture is cut into. More lines is a finer sweep and more work per frame."
                    }
                    controls={"Sets ScanlineAnimationProps.lineCount"}
                >
                    <PageNumberField
                        value={getLineCount}
                        min={ScanlineAnimationKnobs.MIN_LINE_COUNT}
                        max={ScanlineAnimationKnobs.MAX_LINE_COUNT}
                        step={ScanlineAnimationKnobs.LINE_COUNT_STEP}
                        ariaLabel={"Line count"}
                        onInput={setLineCount}
                    />
                </PageProp>

                <PageProp
                    key={"orientation"}
                    label={"Orientation"}
                    hint={
                        "Which way the lines run: rows across the picture, or columns down it. The samples here were written for rows, so on columns they still push sideways and some read their place off the row."
                    }
                    controls={"Sets ScanlineAnimationProps.orientation"}
                >
                    <PageSelectField
                        value={getOrientation}
                        values={SCANLINE_ANIMATION_ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(orientation) => setOrientation(() => orientation)}
                    />
                </PageProp>

                <PageProp
                    key={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one sweep over the whole picture takes."}
                    controls={"Sets ScanlineAnimationProps.animationDurationMs"}
                >
                    <PageNumberField
                        value={getAnimationDurationMs}
                        min={ScanlineAnimationKnobs.MIN_DURATION_MS}
                        max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                        step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Animation duration"}
                        onInput={setAnimationDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the picture waits between one sweep and the next."}
                    controls={"Sets ScanlineAnimationProps.animationIterationDelayMs"}
                >
                    <PageNumberField
                        value={getAnimationIterationDelayMs}
                        min={ScanlineAnimationKnobs.MIN_ITERATION_DELAY_MS}
                        max={ScanlineAnimationKnobs.MAX_DURATION_MS}
                        step={ScanlineAnimationKnobs.DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
