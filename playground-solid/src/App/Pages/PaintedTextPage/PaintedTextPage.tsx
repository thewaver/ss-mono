import { For, Show, createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";

import {
    MediaQueryMonitorSolidUtils,
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextStrokeAlignment,
    SVGDefsSamples,
    TextArea,
} from "@thewaver/ss-components-solid";
import type { AccessorProps, SignalSource } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/PaintedTextPage/PaintedTextPage.css";
import * as typewriterStyles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { PaintedTextKnobs } from "../../Knobs/PaintedTexts.const";
import { PageExampleKnobs } from "../../PageComponents/ExampleKnobs/ExampleKnobs";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageColorField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePaintPicker, createPaintSlot } from "../../PageComponents/PaintPicker/PaintPicker";
import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPicker.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { CircleExample } from "./Examples/Circle";
import { CustomInputExample } from "./Examples/CustomInput";
import { HeadingExample } from "./Examples/Heading";
import { ParagraphExample } from "./Examples/Paragraph";
import { ScrambledExample } from "./Examples/Scrambled";
import { TypedExample } from "./Examples/Typed";
import { WaveExample } from "./Examples/Wave";
import type { PaintedTextExampleProps } from "./PaintedTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PaintedTextPage/Examples";

const PERCENT = 100;

const ARRIVAL_EFFECTS = ["fade", "scale", "glow", "drop", "slide"] as const;

type ArrivalEffect = (typeof ARRIVAL_EFFECTS)[number];

const ARRIVAL_EFFECT_NAMES: Record<ArrivalEffect, string> = {
    fade: typewriterStyles.typewriterFade,
    scale: typewriterStyles.typewriterScale,
    glow: typewriterStyles.typewriterGlow,
    drop: typewriterStyles.typewriterDrop,
    slide: typewriterStyles.typewriterSlide,
};

type ExampleWrapperProps = PaintedTextExampleProps &
    AccessorProps<{
        width: number;
    }>;

const HeadingExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const [getFontSize, setFontSize] = createSignal(PaintedTextKnobs.STARTING_FONT_SIZE);
    const [getLineHeight, setLineHeight] = createSignal(PaintedTextKnobs.STARTING_LINE_HEIGHT);
    const [getFontWeight, setFontWeight] = createSignal(PaintedTextKnobs.STARTING_FONT_WEIGHT);

    return (
        <>
            <PageMeasureBox width={width} padding={() => MEASURE_BOX_PADDING}>
                <HeadingExample
                    {...props}
                    fontSize={getFontSize}
                    lineHeight={getLineHeight}
                    fontWeight={getFontWeight}
                />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp key={"fontSize"} label={"Font size (px)"} hint={"How large the letters are."}>
                    <PageNumberField
                        value={getFontSize}
                        min={() => PaintedTextKnobs.MIN_FONT_SIZE}
                        max={() => PaintedTextKnobs.MAX_FONT_SIZE}
                        step={() => PaintedTextKnobs.FONT_SIZE_STEP}
                        ariaLabel={"Font size in pixels"}
                        onInput={setFontSize}
                    />
                </PageProp>

                <PageProp
                    key={"lineHeight"}
                    label={"Line height"}
                    hint={
                        "How tall each line is, as a multiple of the font size, which decides how far apart the lines sit."
                    }
                >
                    <PageNumberField
                        value={getLineHeight}
                        min={() => PaintedTextKnobs.MIN_LINE_HEIGHT}
                        max={() => PaintedTextKnobs.MAX_LINE_HEIGHT}
                        step={() => PaintedTextKnobs.LINE_HEIGHT_STEP}
                        ariaLabel={"Line height"}
                        onInput={setLineHeight}
                    />
                </PageProp>

                <PageProp key={"fontWeight"} label={"Font weight"} hint={"How heavy the letters are, from 100 to 900."}>
                    <PageNumberField
                        value={getFontWeight}
                        min={() => PaintedTextKnobs.MIN_FONT_WEIGHT}
                        max={() => PaintedTextKnobs.MAX_FONT_WEIGHT}
                        step={() => PaintedTextKnobs.FONT_WEIGHT_STEP}
                        ariaLabel={"Font weight"}
                        onInput={setFontWeight}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ParagraphExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => (
    <PageMeasureBox width={width} padding={() => MEASURE_BOX_PADDING}>
        <ParagraphExample {...props} />
    </PageMeasureBox>
);

const CustomInputExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const textSignal = createSignal(PaintedTextKnobs.STARTING_CUSTOM_TEXT);

    return (
        <>
            <TextArea
                value={textSignal}
                isAutoSizing={true}
                minRows={() => PaintedTextKnobs.CUSTOM_TEXT_MIN_ROWS}
                maxRows={() => PaintedTextKnobs.CUSTOM_TEXT_MAX_ROWS}
                padding={() => FIELD_PADDING}
                gap={() => FIELD_GAP}
                ariaLabel={"Custom text"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => (
                    <PageTextFieldContent
                        flags={getFlags}
                        width={() => PaintedTextKnobs.CUSTOM_TEXT_WIDTH}
                        isStretched={true}
                    />
                )}
                renderPlaceholder={(getFlags) => (
                    <PageTextFieldPlaceholder flags={getFlags} isTopAligned={true}>
                        Put custom text inside me
                    </PageTextFieldPlaceholder>
                )}
            />

            <PageMeasureBox width={width} padding={() => MEASURE_BOX_PADDING}>
                <CustomInputExample {...props} text={textSignal[0]} />
            </PageMeasureBox>
        </>
    );
};

const TypedExampleWrapper = (props: ExampleWrapperProps) => {
    const [getArrivalEffect, setArrivalEffect] = createSignal<ArrivalEffect>(PaintedTextKnobs.STARTING_ARRIVAL_EFFECT);

    return (
        <>
            <TypedExample {...props} computeAnimationName={() => ARRIVAL_EFFECT_NAMES[getArrivalEffect()]} />

            <PageExampleKnobs>
                <PageProp
                    key={"arrivalEffect"}
                    label={"Arrival effect"}
                    hint={
                        "How each letter arrives. The keyframes are the Typewriter page's own, played by the painted letters."
                    }
                >
                    <PageSelectField
                        value={getArrivalEffect}
                        values={() => ARRIVAL_EFFECTS}
                        ariaLabel={"Arrival effect"}
                        onChange={(effect) => setArrivalEffect(() => effect)}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

type PathExampleWrapperProps = ExampleWrapperProps &
    AccessorProps<{
        progress: SignalSource<number>;
        playback: SignalSource<boolean>;
    }>;

type LapDurationKnobProps = AccessorProps<{
    value: number;
    onInput: (value: number) => void;
}>;

const LapDurationKnob = (props: LapDurationKnobProps) => (
    <PageProp
        key={"lapDurationMs"}
        label={"Lap duration (ms)"}
        hint={"How long the text takes to slide once round the whole length of its path."}
    >
        <PageNumberField
            value={props.value}
            min={() => PaintedTextKnobs.MIN_LAP_DURATION_MS}
            max={() => PaintedTextKnobs.MAX_LAP_DURATION_MS}
            step={() => PaintedTextKnobs.LAP_DURATION_STEP_MS}
            ariaLabel={"Lap duration in milliseconds"}
            onInput={props.onInput}
        />
    </PageProp>
);

const CircleExampleWrapper = (props: PathExampleWrapperProps) => {
    const [getRadius, setRadius] = createSignal(PaintedTextKnobs.STARTING_CIRCLE_RADIUS);
    const [getLapDurationMs, setLapDurationMs] = createSignal(PAINTED_TEXT_DEFAULTS.lapDurationMs);
    const [getIsFittedToPath, setIsFittedToPath] = createSignal(PaintedTextKnobs.STARTING_IS_FITTED_TO_PATH);

    return (
        <>
            <CircleExample
                {...props}
                radius={getRadius}
                lapDurationMs={getLapDurationMs}
                isFittedToPath={getIsFittedToPath}
            />

            <PageExampleKnobs>
                <PageProp
                    key={"radius"}
                    label={"Radius (px)"}
                    hint={"How far the circle the text runs round is from its center."}
                >
                    <PageNumberField
                        value={getRadius}
                        min={() => PaintedTextKnobs.MIN_CIRCLE_RADIUS}
                        max={() => PaintedTextKnobs.MAX_CIRCLE_RADIUS}
                        step={() => PaintedTextKnobs.CIRCLE_RADIUS_STEP}
                        ariaLabel={"Radius in pixels"}
                        onInput={setRadius}
                    />
                </PageProp>

                <LapDurationKnob value={getLapDurationMs} onInput={setLapDurationMs} />

                <PageProp
                    key={"isFittedToPath"}
                    label={"Fit to the circle"}
                    hint={
                        "Stretches or squeezes the spacing between the letters so the text goes round the circle exactly once, meeting its own start."
                    }
                >
                    <PageCheckField
                        value={getIsFittedToPath}
                        ariaLabel={"Fit to the circle"}
                        onChange={setIsFittedToPath}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const WaveExampleWrapper = (props: PathExampleWrapperProps) => {
    const [getLapDurationMs, setLapDurationMs] = createSignal(PAINTED_TEXT_DEFAULTS.lapDurationMs);

    return (
        <>
            <WaveExample {...props} lapDurationMs={getLapDurationMs} />

            <PageExampleKnobs>
                <LapDurationKnob value={getLapDurationMs} onInput={setLapDurationMs} />
            </PageExampleKnobs>
        </>
    );
};

export const PaintedTextPage = () => {
    const fill = createPaintSlot(PaintedTextKnobs.STARTING_FILL_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);
    const stroke = createPaintSlot(PaintedTextKnobs.STARTING_STROKE_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);

    const [getWidth, setWidth] = createSignal(PaintedTextKnobs.STARTING_WIDTH);
    const [getStrokeWidth, setStrokeWidth] = createSignal(PAINTED_TEXT_DEFAULTS.strokeWidth);
    const [getStrokeAlignment, setStrokeAlignment] = createSignal<PaintedTextStrokeAlignment>(
        PAINTED_TEXT_DEFAULTS.strokeAlignment,
    );
    const [getBlurWidth, setBlurWidth] = createSignal(PaintedTextKnobs.STARTING_BLUR_WIDTH);
    const [getAnimationDurationMs, setAnimationDurationMs] = createSignal(PaintedTextKnobs.STARTING_DURATION_MS);
    const [getIterationConfigKey, setIterationConfigKey] = createSignal<SVGDefsSamples.Iteration.SampleKey>(
        PaintedTextKnobs.STARTING_ITERATION_KEY,
    );
    const [getCellSize, setCellSize] = createSignal(PaintedTextKnobs.STARTING_CELL_SIZE);
    const [colors, setColors] = createStore({ ...SVGDefsSamples.SAMPLE_COLORS });

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const circleProgressSignal = createSignal(0);
    const circlePlaybackSignal = createSignal(!getPrefersReducedMotion());
    const waveProgressSignal = createSignal(0);
    const wavePlaybackSignal = createSignal(!getPrefersReducedMotion());

    const getPercent = (progress: number) => `${Math.round(progress * PERCENT)}%`;

    const getExamples = createMemo(() => {
        const commonProps: ExampleWrapperProps = {
            width: getWidth,
            fillPaint: fill.getPaint,
            strokePaint: stroke.getPaint,
            strokeWidth: getStrokeWidth,
            strokeAlignment: getStrokeAlignment,
            colors: () => colors,
            blurWidth: getBlurWidth,
            animationDurationMs: getAnimationDurationMs,
            iterationConfigKey: getIterationConfigKey,
            cellSize: () => ({ width: getCellSize(), height: getCellSize() }),
        };

        return [
            {
                key: "heading",
                name: "Heading",
                component: () => <HeadingExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Heading.tsx`,
            },
            {
                key: "paragraph",
                name: "Paragraph",
                readout: () =>
                    "the text wraps where Typewriter would wrap it, the paint is sized to the whole block so one gradient runs across every line, and the image, the icon and the link are carried into the drawing",
                component: () => <ParagraphExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Paragraph.tsx`,
            },
            {
                key: "customInput",
                name: "Custom Input",
                readout: () =>
                    "the text box drives the painted text directly: every change to what it holds is laid out and painted again, line breaks included",
                component: () => <CustomInputExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/CustomInput.tsx`,
            },
            {
                key: "typed",
                name: "Typed",
                readout: () =>
                    "a Typewriter around two painted texts: it decides when each letter arrives and how, the painted texts decide where the letters sit and what paints them, and the two share one run in reading order",
                component: () => <TypedExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Typed.tsx`,
            },
            {
                key: "scrambled",
                name: "Scrambled",
                readout: () =>
                    "a ScrambleText around a painted text: it decides which glyph each letter shows while it churns, and the painted text draws that glyph, painted, in the letter's place",
                component: () => <ScrambledExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Scrambled.tsx`,
            },
            {
                key: "circle",
                name: "Round a circle",
                readout: () =>
                    `${getPercent(circleProgressSignal[0]())} round the circle, ${circlePlaybackSignal[0]() ? "turning" : "stopped"} — the browser sets every letter along the path, the paint runs across the ring as one, and what slides past the end comes round from the start`,
                component: () => (
                    <CircleExampleWrapper
                        {...commonProps}
                        progress={circleProgressSignal}
                        playback={circlePlaybackSignal}
                    />
                ),
                path: `${EXAMPLES_ROOT}/Circle.tsx`,
            },
            {
                key: "wave",
                name: "Along a wave",
                readout: () =>
                    `${getPercent(waveProgressSignal[0]())} along the wave, ${wavePlaybackSignal[0]() ? "sliding" : "stopped"} — any path will do, and on an open one the text leaves at the far end as it comes back in at the near one`,
                component: () => (
                    <WaveExampleWrapper {...commonProps} progress={waveProgressSignal} playback={wavePlaybackSignal} />
                ),
                path: `${EXAMPLES_ROOT}/Wave.tsx`,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsGroups>
                <PagePaintPicker
                    paintSlot={fill}
                    name={"fill"}
                    label={"Fill"}
                    hint={
                        "What paints the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer. For hollow letters, paint them solid and make the background color transparent."
                    }
                />

                <PagePropsDivider />

                <PagePaintPicker
                    paintSlot={stroke}
                    name={"stroke"}
                    label={"Stroke"}
                    hint={
                        "What paints the stroke around the letters: a flat color, a pattern, or a gradient that runs on a clock or follows the pointer."
                    }
                />

                <PagePropsDivider />

                <PagePropsPanel scope={"global"}>
                    <PageProp
                        key={"strokeWidth"}
                        label={"Stroke width (px)"}
                        hint={"How wide the stroke appears, whichever side of the letter's edge it sits on."}
                    >
                        <PageNumberField
                            value={getStrokeWidth}
                            min={() => PaintedTextKnobs.MIN_STROKE_WIDTH}
                            max={() => PaintedTextKnobs.MAX_STROKE_WIDTH}
                            step={() => PaintedTextKnobs.STROKE_WIDTH_STEP}
                            ariaLabel={"Stroke width in pixels"}
                            onInput={setStrokeWidth}
                        />
                    </PageProp>

                    <PageProp
                        key={"strokeAlignment"}
                        label={"Stroke alignment"}
                        hint={
                            "Where the stroke sits against the edge of each letter: outside keeps the letters their full shape, inside keeps the text its overall size, and center straddles the edge."
                        }
                    >
                        <PageSelectField
                            value={getStrokeAlignment}
                            values={() => PaintedTextKnobs.STROKE_ALIGNMENTS}
                            ariaLabel={"Stroke alignment"}
                            onChange={(alignment) => setStrokeAlignment(() => alignment)}
                        />
                    </PageProp>

                    <PageProp
                        key={"colors"}
                        label={"Colors"}
                        hint={
                            "The colors the fill and the stroke are built from. Each sample uses as many as it needs."
                        }
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
                        hint={"How far the paint is blurred outward, which is what gives it its glow."}
                    >
                        <PageNumberField
                            value={getBlurWidth}
                            min={() => PaintedTextKnobs.MIN_BLUR_WIDTH}
                            max={() => PaintedTextKnobs.MAX_BLUR_WIDTH}
                            step={() => PaintedTextKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Blur width"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    <Show when={getIsUsingKind([fill.getPaint(), stroke.getPaint()], ["pattern", "timed"])}>
                        <PageProp
                            key={"animationDurationMs"}
                            label={"Animation duration (ms)"}
                            hint={"How long one pass of the fill or stroke animation takes."}
                        >
                            <PageNumberField
                                value={getAnimationDurationMs}
                                min={() => PaintedTextKnobs.MIN_DURATION_MS}
                                max={() => PaintedTextKnobs.MAX_DURATION_MS}
                                step={() => PaintedTextKnobs.DURATION_STEP_MS}
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

                    <Show when={getIsUsingKind([fill.getPaint(), stroke.getPaint()], ["pattern", "trackedPattern"])}>
                        <PageProp
                            key={"cellSize"}
                            label={"Pattern Cell Size (px)"}
                            hint={"How large one tile of a pattern is before it repeats."}
                        >
                            <PageNumberField
                                value={getCellSize}
                                min={() => PaintedTextKnobs.MIN_CELL_SIZE}
                                max={() => PaintedTextKnobs.MAX_CELL_SIZE}
                                step={() => PaintedTextKnobs.CELL_SIZE_STEP}
                                ariaLabel={"Pattern cell size"}
                                onInput={setCellSize}
                            />
                        </PageProp>
                    </Show>

                    <PageProp
                        key={"width"}
                        label={"Container width (px)"}
                        hint={"How wide the box holding the text is, which decides where the lines wrap."}
                    >
                        <PageNumberField
                            value={getWidth}
                            min={() => PaintedTextKnobs.MIN_CONTAINER_WIDTH}
                            max={() => PaintedTextKnobs.MAX_CONTAINER_WIDTH}
                            step={() => PaintedTextKnobs.CONTAINER_WIDTH_STEP}
                            ariaLabel={"Container width in pixels"}
                            onInput={setWidth}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
