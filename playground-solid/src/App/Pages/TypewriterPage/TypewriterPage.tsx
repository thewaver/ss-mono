import { createMemo, createSignal } from "solid-js";

import { ScrambleTextWeights, TextArea } from "@thewaver/ss-components-solid";
import type { AccessorProps } from "@thewaver/ss-components-solid";
import { MEASURE_BOX_PADDING } from "@thewaver/ss-playground/App/PageComponents/MeasureBox/MeasureBox.css";
import * as styles from "@thewaver/ss-playground/App/Pages/TypewriterPage/TypewriterPage.css";
import {
    FIELD_GAP,
    FIELD_PADDING,
} from "@thewaver/ss-playground/App/StyledComponents/TextFieldContent/TextFieldContent.css";

import { TypewriterKnobs } from "../../Knobs/Typewriters.const";
import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageMeasureBox } from "../../PageComponents/MeasureBox/MeasureBox";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import {
    PageTextFieldContent,
    computePageTextFieldTextStyle,
} from "../../StyledComponents/TextFieldContent/TextFieldContent";
import { PageTextFieldPlaceholder } from "../../StyledComponents/TextFieldPlaceholder/TextFieldPlaceholder";
import { ComplexExample } from "./Examples/Complex";
import { CustomInputExample } from "./Examples/CustomInput";
import { KaraokeExample } from "./Examples/Karaoke";
import { OutwardExample } from "./Examples/Outward";
import { PhrasesExample } from "./Examples/Phrases";
import { ScrollLitExample } from "./Examples/ScrollLit";
import type { TypewriterExampleProps, TypewriterTextEffect } from "./TypewriterPage.types";

const TEXT_EFFECTS: TypewriterTextEffect[] = ["fade", "scale", "glow", "drop", "slide"];
const TEXT_EFFECT_MAP: Record<TypewriterTextEffect, string> = {
    fade: styles.typewriterFade,
    scale: styles.typewriterScale,
    glow: styles.typewriterGlow,
    drop: styles.typewriterDrop,
    slide: styles.typewriterSlide,
};

const CUSTOM_TEXT_WIDTH = 320;
const CUSTOM_TEXT_MIN_ROWS = 6;
const CUSTOM_TEXT_MAX_ROWS = 12;
const EXAMPLES_ROOT = "/src/App/Pages/TypewriterPage/Examples";

type ExampleWrapperProps = TypewriterExampleProps &
    AccessorProps<{
        width: number;
    }>;

const ComplexExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    return (
        <PageMeasureBox width={width} padding={() => MEASURE_BOX_PADDING}>
            <ComplexExample {...props} />
        </PageMeasureBox>
    );
};

const CustomInputExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const textSignal = createSignal("Line one\n\nline two");

    return (
        <>
            <TextArea
                value={textSignal}
                isAutoSizing={true}
                minRows={() => CUSTOM_TEXT_MIN_ROWS}
                maxRows={() => CUSTOM_TEXT_MAX_ROWS}
                padding={() => FIELD_PADDING}
                gap={() => FIELD_GAP}
                ariaLabel={"Custom text"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(getFlags) => (
                    <PageTextFieldContent flags={getFlags} width={() => CUSTOM_TEXT_WIDTH} isStretched={true} />
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

export const TypewriterPage = () => {
    const [getTextContainerWidth, setTextContainerWidth] = createSignal(TypewriterKnobs.STARTING_WIDTH);
    const [getTextEffect, setTextEffect] = createSignal<TypewriterTextEffect>(TypewriterKnobs.STARTING_TEXT_EFFECT);
    const [getArrivalOrder, setArrivalOrder] = createSignal<(typeof TypewriterKnobs.ARRIVAL_ORDERS)[number]>(
        TypewriterKnobs.STARTING_ARRIVAL_ORDER,
    );

    const getExamples = createMemo(() => {
        const commonProps: ExampleWrapperProps = {
            width: getTextContainerWidth,
            computeAnimationName: () => TEXT_EFFECT_MAP[getTextEffect()],
            computeCharacterWeights: (count) => {
                const arrivalOrder = getArrivalOrder();

                return arrivalOrder === "leftToRight" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[arrivalOrder](count);
            },
        };

        return [
            {
                key: "complex",
                name: "Complex",
                component: () => <ComplexExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Complex.tsx`,
            },
            {
                key: "customInput",
                name: "Custom Input",
                component: () => <CustomInputExampleWrapper {...commonProps} />,
                path: `${EXAMPLES_ROOT}/CustomInput.tsx`,
            },
            {
                key: "phrases",
                name: "Phrases",
                readout: () =>
                    "the example owns the loop: each run's end either holds the phrase and switches to erasing, or moves to the next phrase and types it, and the caret is placed from the same progress the characters are drawn from",
                component: () => <PhrasesExample {...commonProps} />,
                path: `${EXAMPLES_ROOT}/Phrases.tsx`,
            },
            {
                key: "karaoke",
                name: "Karaoke",
                readout: () =>
                    "the line and the slider share one progress: singing writes it as it goes, and dragging the slider draws that moment — a stop can fall partway through a letter's own sweep",
                component: () => <KaraokeExample width={getTextContainerWidth} />,
                path: `${EXAMPLES_ROOT}/Karaoke.tsx`,
            },
            {
                key: "scrollLit",
                name: "Lit by scrolling",
                readout: () =>
                    "playback is off and the progress is how far the paragraph has traveled up its box; the letters not yet reached show their animation's first frame, which is the dimmed text",
                component: () => (
                    <PageMeasureBox width={getTextContainerWidth}>
                        <ScrollLitExample />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/ScrollLit.tsx`,
            },
            {
                key: "outward",
                name: "Flying outward",
                readout: () =>
                    "an animation per letter: the left half flies off to the left and the right half to the right, from the middle out, as the line crosses the middle of its box",
                component: () => (
                    <PageMeasureBox width={getTextContainerWidth}>
                        <OutwardExample />
                    </PageMeasureBox>
                ),
                path: `${EXAMPLES_ROOT}/Outward.tsx`,
            },
        ];
    });

    return (
        <div class={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"textContainerWidth"}
                    label={"Container width (px)"}
                    hint={
                        "How wide the box holding the text is, which decides where the lines wrap as the text is typed."
                    }
                >
                    <PageNumberField
                        value={getTextContainerWidth}
                        min={() => TypewriterKnobs.MIN_CONTAINER_WIDTH}
                        max={() => TypewriterKnobs.MAX_CONTAINER_WIDTH}
                        step={() => TypewriterKnobs.CONTAINER_WIDTH_STEP}
                        ariaLabel={"Container width in pixels"}
                        onInput={setTextContainerWidth}
                    />
                </PageProp>

                <PageProp
                    key={"textEffect"}
                    label={"Effect"}
                    hint={"How each character arrives: plainly, or with one of the entrance effects."}
                >
                    <PageSelectField
                        value={getTextEffect}
                        values={() => TEXT_EFFECTS}
                        ariaLabel={"Effect"}
                        onChange={(effect) => setTextEffect(() => effect)}
                    />
                </PageProp>

                <PageProp
                    key={"arrivalOrder"}
                    label={"Arrival order"}
                    hint={
                        "The order the characters arrive in: left to right, from the middle out, scattered, and so on. Erasing runs it backwards. The caret is meant for left to right, and jumps about under the others."
                    }
                >
                    <PageSelectField
                        value={getArrivalOrder}
                        values={() => TypewriterKnobs.ARRIVAL_ORDERS}
                        ariaLabel={"Arrival order"}
                        onChange={(arrivalOrder) => setArrivalOrder(() => arrivalOrder)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} layout={"flow"} />
        </div>
    );
};
