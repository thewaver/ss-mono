import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    CellAnimationBreakpointUtils,
    CellAnimationBreakpoints,
    CellAnimationWeights,
    SCANLINE_ANIMATION_DEFAULTS,
    ScanlineAnimation,
    ScanlineAnimationKeyframes,
    access,
} from "@thewaver/ss-components";
import type {
    CellAnimationBreakpointDirection,
    CellAnimationBreakpointOpts,
    ScanlineAnimationOrientation,
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
} from "@thewaver/ss-components";

import { ScanlineAnimationKeyframeKnobs } from "../../Knobs/ScanlineAnimationKeyframes.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageKnobs } from "../../PageComponents/Knobs/Knobs";
import type { Knob } from "../../PageComponents/Knobs/Knobs.types";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { StressTest } from "../../PageComponents/StressTest/StressTest";
import type { StressTestDefs } from "../../PageComponents/StressTest/StressText.types";
import {
    PageFileField,
    PageGroupedSelectField,
    PageNumberField,
    PageSelectField,
} from "../../StyledComponents/Field/Field";
import knight from "../../knight.webp";
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

import * as styles from "./ScanlineAnimationPage.css";

const IMAGE_CONTAINER_SIZE = 360;
const MIN_GLITCH_COUNT = 1;
const MAX_GLITCH_COUNT = 10;
const GLITCH_COUNT_STEP = 1;
const MIN_SMOOTHNESS = 0.1;
const MAX_SMOOTHNESS = 1;
const SMOOTHNESS_STEP = 0.1;
const MIN_SHIFT_PERCENT = 5;
const MAX_SHIFT_PERCENT = 25;
const SHIFT_PERCENT_STEP = 5;
const MIN_CHUNKYNESS = 0.1;
const MAX_CHUNKYNESS = 1;
const CHUNKYNESS_STEP = 0.1;
const MIN_LINE_COUNT = 8;
const MAX_LINE_COUNT = 240;
const LINE_COUNT_STEP = 4;
const MIN_DURATION_MS = 100;
const MAX_DURATION_MS = 5000;
const DURATION_STEP_MS = 100;
const MIN_ITERATION_DELAY_MS = 0;
const ORIENTATIONS: ScanlineAnimationOrientation[] = ["horizontal", "vertical"];

const STARTING_LINE_COUNT = 120;
const STARTING_DURATION_MS = 2000;
const STARTING_ITERATION_DELAY_MS = 1000;

const STRESS_LINE_COUNT = 120;
const STRESS_ITEMS: (StressTestDefs & { size: number; kind: "transform" | "filter" })[] = (
    ["transform", "filter"] as const
)
    .map((kind) => [
        {
            count: 4 * 3,
            cols: 4,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 6 * 4,
            cols: 6,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 8 * 6,
            cols: 8,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
        {
            count: 12 * 6,
            cols: 12,
            gap: 10,
            size: STRESS_LINE_COUNT,
            kind,
        },
    ])
    .flat();

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
const EXAMPLES_ROOT = "/src/App/Pages/ScanLineAnimationPage/Examples";
const WEIGHT_ORIGIN = { row: 0, col: 0 };

const StressTestWrapper = (props: ScanlineAnimationExampleProps) => {
    const modalPlayback = createSignal(true);

    return (
        <>
            <div>{"120 lines"}</div>

            <StressTest
                configs={() => STRESS_ITEMS}
                onHideModal={() => {
                    props.playbackSignal[1](true);
                }}
                onShowModal={() => {
                    props.playbackSignal[1](false);
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
                                playbackSignal={modalPlayback}
                                lineCount={() => STRESS_LINE_COUNT}
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
        >
            <PageNumberField
                value={props.getter}
                min={() => MIN_SMOOTHNESS}
                max={() => MAX_SMOOTHNESS}
                step={() => SMOOTHNESS_STEP}
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
        >
            <PageSelectField
                value={props.getter}
                values={() => CellAnimationBreakpoints.DIRECTIONS}
                ariaLabel={"Direction"}
                onChange={props.setter}
            />
        </PageProp>
    );
};

const GlitchExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore({
        count: 3,
        shiftPercent: 10,
        chunkyness: 0.8,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <GlitchExample {...props} keyframeOpts={() => keyframeOpts} />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
                <PageProp key={"count"} label={"Count"} hint={"How many glitch bursts happen over one pass."}>
                    <PageNumberField
                        value={() => keyframeOpts.count!}
                        min={() => MIN_GLITCH_COUNT}
                        max={() => MAX_GLITCH_COUNT}
                        step={() => GLITCH_COUNT_STEP}
                        ariaLabel={"Count"}
                        onInput={(value) => setKeyframeOpts("count", value)}
                    />
                </PageProp>

                <PageProp
                    key={"maxShift"}
                    label={"Max shift (%)"}
                    hint={"How far a line can be thrown sideways at the worst of a burst, as a share of its own width."}
                >
                    <PageNumberField
                        value={() => keyframeOpts.shiftPercent!}
                        min={() => MIN_SHIFT_PERCENT}
                        max={() => MAX_SHIFT_PERCENT}
                        step={() => SHIFT_PERCENT_STEP}
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
                >
                    <PageNumberField
                        value={() => keyframeOpts.chunkyness}
                        min={() => MIN_CHUNKYNESS}
                        max={() => MAX_CHUNKYNESS}
                        step={() => CHUNKYNESS_STEP}
                        ariaLabel={"Chunkyness"}
                        onInput={(value) => setKeyframeOpts("chunkyness", value)}
                    />
                </PageProp>
            </PagePropsPanel>
        </>
    );
};

const SurgeExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.2,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <SurgeExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as ScanlineHorizontalStretchOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const SnakeExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.2,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <SnakeExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as ScanlineHorizontalSnakeOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const SplitExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 1,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <SplitExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as ScanlineHorizontalSplitOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const BrightnessExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts] = createStore<ScanlineHorizontalBrightnessOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.5,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <BrightnessExample {...props} keyframeOpts={() => keyframeOpts} breakpointOpts={() => breakpointOpts} />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PagePropsPanel>
        </>
    );
};

const GrayscaleExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts] = createStore<ScanlineHorizontalGrayscaleOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.5,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <GrayscaleExample {...props} keyframeOpts={() => keyframeOpts} breakpointOpts={() => breakpointOpts} />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PagePropsPanel>
        </>
    );
};

const HueExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts] = createStore<ScanlineHorizontalHueOpts>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.5,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <HueExample {...props} keyframeOpts={() => keyframeOpts} breakpointOpts={() => breakpointOpts} />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
                <SmoothnessInput
                    getter={() => breakpointOpts.smoothness!}
                    setter={(value) => setBreakpointOpts("smoothness", value)}
                />
                <DirInput getter={() => breakpointOpts.dir!} setter={(value) => setBreakpointOpts("dir", value)} />
            </PagePropsPanel>
        </>
    );
};

const WaveExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.6,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <WaveExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as _ScanlineHorizontalWaveOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const RollExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.1,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <RollExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as _ScanlineHorizontalRollOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const DropoutExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.2,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <DropoutExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as _ScanlineHorizontalDropoutOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const InterlaceExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.8,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <InterlaceExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as _ScanlineHorizontalInterlaceOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

const SkewExampleWrapper = (props: ScanlineAnimationExampleProps) => {
    const [keyframeOpts, setKeyframeOpts] = createStore<Record<string, number | boolean>>({});
    const [breakpointOpts, setBreakpointOpts] = createStore<CellAnimationBreakpointOpts>({
        dir: "asc",
        smoothness: 0.3,
    });

    return (
        <>
            <PageMeasureBox width={() => IMAGE_CONTAINER_SIZE}>
                <SkewExample
                    {...props}
                    keyframeOpts={() => keyframeOpts as _ScanlineHorizontalSkewOpts}
                    breakpointOpts={() => breakpointOpts}
                />
            </PageMeasureBox>

            <PagePropsPanel scope={"local"}>
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
            </PagePropsPanel>
        </>
    );
};

export const ScanlineAnimationPage = () => {
    const playback = createSignal(true);

    const [getSrc, setSrc] = createSignal(knight);
    const [getLineCount, setLineCount] = createSignal(STARTING_LINE_COUNT);
    const [getOrientation, setOrientation] = createSignal(SCANLINE_ANIMATION_DEFAULTS.orientation);
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(STARTING_DURATION_MS);
    const [getAnimationIterationDelayMs, setAnimationIterationDelayMs] = createSignal(STARTING_ITERATION_DELAY_MS);
    const [getWeightType, setWeightType] = createSignal<CellAnimationWeights.OriginFreeWeightType>("sequenceLinear");

    const handleFile = (file: File) => {
        setSrc(URL.createObjectURL(file));
    };

    const getExamples = createMemo(() => {
        const commonProps: ScanlineAnimationExampleProps = {
            playbackSignal: playback,
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
                name: "Glitch",
                component: () => <GlitchExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Glitch.tsx`,
            },
            {
                key: "surge",
                name: "Surge",
                component: () => <SurgeExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Surge.tsx`,
            },
            {
                key: "snake",
                name: "Snake",
                component: () => <SnakeExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Snake.tsx`,
            },
            {
                key: "split",
                name: "Split",
                component: () => <SplitExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Split.tsx`,
            },
            {
                key: "brightness",
                name: "Brightness",
                component: () => <BrightnessExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Brightness.tsx`,
            },
            {
                key: "grayscale",
                name: "Grayscale",
                component: () => <GrayscaleExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Grayscale.tsx`,
            },
            {
                key: "hue",
                name: "Hue",
                component: () => <HueExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Hue.tsx`,
            },
            {
                key: "_wave",
                name: "_Wave",
                component: () => <WaveExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Wave.tsx`,
            },
            {
                key: "_roll",
                name: "_Roll",
                component: () => <RollExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Roll.tsx`,
            },
            {
                key: "_dropout",
                name: "_Dropout",
                component: () => <DropoutExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Dropout.tsx`,
            },
            {
                key: "_interlace",
                name: "_Interlace",
                component: () => <InterlaceExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Interlace.tsx`,
            },
            {
                key: "_skew",
                name: "_Skew",
                component: () => <SkewExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/_Skew.tsx`,
            },
            {
                key: "stressTest",
                name: "Stress Test",
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
                >
                    <PageFileField accept={"image/*"} ariaLabel={"Image"} onPick={handleFile} />
                </PageProp>

                <PageProp
                    key={"weightType"}
                    label={"Weight"}
                    hint={"How each line's turn is decided: its position, a wave, a random draw, and so on."}
                >
                    <PageGroupedSelectField
                        value={getWeightType}
                        groups={() => GROUPPED_WEIGHTS}
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
                >
                    <PageNumberField
                        value={getLineCount}
                        min={() => MIN_LINE_COUNT}
                        max={() => MAX_LINE_COUNT}
                        step={() => LINE_COUNT_STEP}
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
                >
                    <PageSelectField
                        value={getOrientation}
                        values={() => ORIENTATIONS}
                        ariaLabel={"Orientation"}
                        onChange={(orientation) => setOrientation(() => orientation)}
                    />
                </PageProp>

                <PageProp
                    key={"animationDurationMs"}
                    label={"Animation duration (ms)"}
                    hint={"How long one sweep over the whole picture takes."}
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
                    key={"animationIterationDelayMs"}
                    label={"Iteration delay (ms)"}
                    hint={"How long the picture waits between one sweep and the next."}
                >
                    <PageNumberField
                        value={getAnimationIterationDelayMs}
                        min={() => MIN_ITERATION_DELAY_MS}
                        max={() => MAX_DURATION_MS}
                        step={() => DURATION_STEP_MS}
                        ariaLabel={"Iteration delay"}
                        onInput={setAnimationIterationDelayMs}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
