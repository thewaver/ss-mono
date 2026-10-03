import { useState } from "react";

import {
    PAINTED_TEXT_DEFAULTS,
    type PaintedTextStrokeAlignment,
    type SVGDefsColors,
    SVGDefsSamples,
    TextArea,
} from "@thewaver/ss-components-react";
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
import { PageColorField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PagePaintPicker, usePaintSlot } from "../../PageComponents/PaintPicker/PaintPicker";
import { getIsUsingKind } from "../../PageComponents/PaintPicker/PaintPicker.const";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsDivider, PagePropsGroups, PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { CustomInputExample } from "./Examples/CustomInput";
import { HeadingExample } from "./Examples/Heading";
import { ParagraphExample } from "./Examples/Paragraph";
import { ScrambledExample } from "./Examples/Scrambled";
import { TypedExample } from "./Examples/Typed";
import type { PaintedTextExampleProps } from "./PaintedTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/PaintedTextPage/Examples";

const ARRIVAL_EFFECTS = ["fade", "scale", "glow", "drop", "slide"] as const;

type ArrivalEffect = (typeof ARRIVAL_EFFECTS)[number];

const ARRIVAL_EFFECT_NAMES: Record<ArrivalEffect, string> = {
    fade: typewriterStyles.typewriterFade,
    scale: typewriterStyles.typewriterScale,
    glow: typewriterStyles.typewriterGlow,
    drop: typewriterStyles.typewriterDrop,
    slide: typewriterStyles.typewriterSlide,
};

type ExampleWrapperProps = PaintedTextExampleProps & {
    width: number;
};

const HeadingExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const [fontSize, setFontSize] = useState(PaintedTextKnobs.STARTING_FONT_SIZE);
    const [lineHeight, setLineHeight] = useState(PaintedTextKnobs.STARTING_LINE_HEIGHT);
    const [fontWeight, setFontWeight] = useState(PaintedTextKnobs.STARTING_FONT_WEIGHT);

    return (
        <>
            <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
                <HeadingExample {...props} fontSize={fontSize} lineHeight={lineHeight} fontWeight={fontWeight} />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp itemKey={"fontSize"} label={"Font size (px)"} hint={"How large the letters are."}>
                    <PageNumberField
                        value={fontSize}
                        min={PaintedTextKnobs.MIN_FONT_SIZE}
                        max={PaintedTextKnobs.MAX_FONT_SIZE}
                        step={PaintedTextKnobs.FONT_SIZE_STEP}
                        ariaLabel={"Font size in pixels"}
                        onInput={setFontSize}
                    />
                </PageProp>

                <PageProp
                    itemKey={"lineHeight"}
                    label={"Line height"}
                    hint={
                        "How tall each line is, as a multiple of the font size, which decides how far apart the lines sit."
                    }
                >
                    <PageNumberField
                        value={lineHeight}
                        min={PaintedTextKnobs.MIN_LINE_HEIGHT}
                        max={PaintedTextKnobs.MAX_LINE_HEIGHT}
                        step={PaintedTextKnobs.LINE_HEIGHT_STEP}
                        ariaLabel={"Line height"}
                        onInput={setLineHeight}
                    />
                </PageProp>

                <PageProp
                    itemKey={"fontWeight"}
                    label={"Font weight"}
                    hint={"How heavy the letters are, from 100 to 900."}
                >
                    <PageNumberField
                        value={fontWeight}
                        min={PaintedTextKnobs.MIN_FONT_WEIGHT}
                        max={PaintedTextKnobs.MAX_FONT_WEIGHT}
                        step={PaintedTextKnobs.FONT_WEIGHT_STEP}
                        ariaLabel={"Font weight"}
                        onInput={setFontWeight}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ParagraphExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => (
    <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
        <ParagraphExample {...props} />
    </PageMeasureBox>
);

const CustomInputExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const textState = useState(PaintedTextKnobs.STARTING_CUSTOM_TEXT);

    return (
        <>
            <TextArea
                value={textState}
                isAutoSizing={true}
                minRows={PaintedTextKnobs.CUSTOM_TEXT_MIN_ROWS}
                maxRows={PaintedTextKnobs.CUSTOM_TEXT_MAX_ROWS}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Custom text"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => (
                    <PageTextFieldContent flags={flags} width={PaintedTextKnobs.CUSTOM_TEXT_WIDTH} isStretched={true} />
                )}
                renderPlaceholder={(flags) => (
                    <PageTextFieldPlaceholder flags={flags} isTopAligned={true}>
                        Put custom text inside me
                    </PageTextFieldPlaceholder>
                )}
            />

            <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
                <CustomInputExample {...props} text={textState[0]} />
            </PageMeasureBox>
        </>
    );
};

const TypedExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const [arrivalEffect, setArrivalEffect] = useState<ArrivalEffect>(PaintedTextKnobs.STARTING_ARRIVAL_EFFECT);

    return (
        <>
            <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
                <TypedExample {...props} animationName={ARRIVAL_EFFECT_NAMES[arrivalEffect]} />
            </PageMeasureBox>

            <PageExampleKnobs>
                <PageProp
                    itemKey={"arrivalEffect"}
                    label={"Arrival effect"}
                    hint={
                        "How each letter arrives. The keyframes are the Typewriter page's own, played by the painted letters."
                    }
                >
                    <PageSelectField
                        value={arrivalEffect}
                        values={ARRIVAL_EFFECTS}
                        ariaLabel={"Arrival effect"}
                        onChange={setArrivalEffect}
                    />
                </PageProp>
            </PageExampleKnobs>
        </>
    );
};

const ScrambledExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => (
    <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
        <ScrambledExample {...props} />
    </PageMeasureBox>
);

export const PaintedTextPage = () => {
    const fill = usePaintSlot(PaintedTextKnobs.STARTING_FILL_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);
    const stroke = usePaintSlot(PaintedTextKnobs.STARTING_STROKE_PAINT_KIND, PaintedTextKnobs.STARTING_KEYS);

    const [width, setWidth] = useState(PaintedTextKnobs.STARTING_WIDTH);
    const [strokeWidth, setStrokeWidth] = useState(PAINTED_TEXT_DEFAULTS.strokeWidth);
    const [strokeAlignment, setStrokeAlignment] = useState<PaintedTextStrokeAlignment>(
        PAINTED_TEXT_DEFAULTS.strokeAlignment,
    );
    const [blurWidth, setBlurWidth] = useState(PaintedTextKnobs.STARTING_BLUR_WIDTH);
    const [animationDurationMs, setAnimationDurationMs] = useState(PaintedTextKnobs.STARTING_DURATION_MS);
    const [iterationConfigKey, setIterationConfigKey] = useState<SVGDefsSamples.Iteration.SampleKey>(
        PaintedTextKnobs.STARTING_ITERATION_KEY,
    );
    const [cellSize, setCellSize] = useState(PaintedTextKnobs.STARTING_CELL_SIZE);
    const [colors, setColors] = useState<SVGDefsColors>({ ...SVGDefsSamples.SAMPLE_COLORS });

    const usesPattern = getIsUsingKind([fill.paint, stroke.paint], ["pattern", "trackedPattern"]);
    const usesTiming = getIsUsingKind([fill.paint, stroke.paint], ["pattern", "timed"]);

    const commonProps: ExampleWrapperProps = {
        width,
        fillPaint: fill.paint,
        strokePaint: stroke.paint,
        strokeWidth,
        strokeAlignment,
        colors,
        blurWidth,
        animationDurationMs,
        iterationConfigKey,
        cellSize: { width: cellSize, height: cellSize },
    };

    const examples = [
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
            component: () => <ScrambledExampleWrapper {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Scrambled.tsx`,
        },
    ];

    return (
        <div className={styles.root}>
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
                        itemKey={"strokeWidth"}
                        label={"Stroke width (px)"}
                        hint={"How wide the stroke appears, whichever side of the letter's edge it sits on."}
                    >
                        <PageNumberField
                            value={strokeWidth}
                            min={PaintedTextKnobs.MIN_STROKE_WIDTH}
                            max={PaintedTextKnobs.MAX_STROKE_WIDTH}
                            step={PaintedTextKnobs.STROKE_WIDTH_STEP}
                            ariaLabel={"Stroke width in pixels"}
                            onInput={setStrokeWidth}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"strokeAlignment"}
                        label={"Stroke alignment"}
                        hint={
                            "Where the stroke sits against the edge of each letter: outside keeps the letters their full shape, inside keeps the text its overall size, and center straddles the edge."
                        }
                    >
                        <PageSelectField
                            value={strokeAlignment}
                            values={PaintedTextKnobs.STROKE_ALIGNMENTS}
                            ariaLabel={"Stroke alignment"}
                            onChange={setStrokeAlignment}
                        />
                    </PageProp>

                    <PageProp
                        itemKey={"colors"}
                        label={"Colors"}
                        hint={
                            "The colors the fill and the stroke are built from. Each sample uses as many as it needs."
                        }
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
                        itemKey={"blurWidth"}
                        label={"Blur (px)"}
                        hint={"How far the paint is blurred outward, which is what gives it its glow."}
                    >
                        <PageNumberField
                            value={blurWidth}
                            min={PaintedTextKnobs.MIN_BLUR_WIDTH}
                            max={PaintedTextKnobs.MAX_BLUR_WIDTH}
                            step={PaintedTextKnobs.BLUR_WIDTH_STEP}
                            ariaLabel={"Blur width"}
                            onInput={setBlurWidth}
                        />
                    </PageProp>

                    {usesTiming && (
                        <>
                            <PageProp
                                itemKey={"animationDurationMs"}
                                label={"Animation duration (ms)"}
                                hint={"How long one pass of the fill or stroke animation takes."}
                            >
                                <PageNumberField
                                    value={animationDurationMs}
                                    min={PaintedTextKnobs.MIN_DURATION_MS}
                                    max={PaintedTextKnobs.MAX_DURATION_MS}
                                    step={PaintedTextKnobs.DURATION_STEP_MS}
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
                        </>
                    )}

                    {usesPattern && (
                        <PageProp
                            itemKey={"cellSize"}
                            label={"Pattern Cell Size (px)"}
                            hint={"How large one tile of a pattern is before it repeats."}
                        >
                            <PageNumberField
                                value={cellSize}
                                min={PaintedTextKnobs.MIN_CELL_SIZE}
                                max={PaintedTextKnobs.MAX_CELL_SIZE}
                                step={PaintedTextKnobs.CELL_SIZE_STEP}
                                ariaLabel={"Pattern cell size"}
                                onInput={setCellSize}
                            />
                        </PageProp>
                    )}

                    <PageProp
                        itemKey={"width"}
                        label={"Container width (px)"}
                        hint={"How wide the box holding the text is, which decides where the lines wrap."}
                    >
                        <PageNumberField
                            value={width}
                            min={PaintedTextKnobs.MIN_CONTAINER_WIDTH}
                            max={PaintedTextKnobs.MAX_CONTAINER_WIDTH}
                            step={PaintedTextKnobs.CONTAINER_WIDTH_STEP}
                            ariaLabel={"Container width in pixels"}
                            onInput={setWidth}
                        />
                    </PageProp>
                </PagePropsPanel>
            </PagePropsGroups>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
