import { useState } from "react";

import { ScrambleTextWeights, TextArea } from "@thewaver/ss-components-react";
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
import { PhrasesExample } from "./Examples/Phrases";
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

type ExampleWrapperProps = TypewriterExampleProps & {
    width: number;
};

const ComplexExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    return (
        <PageMeasureBox width={width} padding={MEASURE_BOX_PADDING}>
            <ComplexExample {...props} />
        </PageMeasureBox>
    );
};

const CustomInputExampleWrapper = ({ width, ...props }: ExampleWrapperProps) => {
    const textState = useState("Line one\n\nline two");

    return (
        <>
            <TextArea
                valueState={textState}
                isAutoSizing={true}
                minRows={CUSTOM_TEXT_MIN_ROWS}
                maxRows={CUSTOM_TEXT_MAX_ROWS}
                padding={FIELD_PADDING}
                gap={FIELD_GAP}
                ariaLabel={"Custom text"}
                computeTextStyle={computePageTextFieldTextStyle}
                renderContent={(flags) => (
                    <PageTextFieldContent flags={flags} width={CUSTOM_TEXT_WIDTH} isStretched={true} />
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

export const TypewriterPage = () => {
    const [textContainerWidth, setTextContainerWidth] = useState(TypewriterKnobs.STARTING_WIDTH);
    const [textEffect, setTextEffect] = useState<TypewriterTextEffect>(TypewriterKnobs.STARTING_TEXT_EFFECT);
    const [arrivalOrder, setArrivalOrder] = useState<(typeof TypewriterKnobs.ARRIVAL_ORDERS)[number]>(
        TypewriterKnobs.STARTING_ARRIVAL_ORDER,
    );

    const commonProps: ExampleWrapperProps = {
        width: textContainerWidth,
        animationName: TEXT_EFFECT_MAP[textEffect],
        computeCharacterWeights: (count) =>
            arrivalOrder === "leftToRight" ? [] : ScrambleTextWeights.SAMPLE_WEIGHTS[arrivalOrder](count),
    };

    const examples = [
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
                "the example owns the loop: each run's end either holds the phrase and switches to erasing, or moves to the next phrase and types it, and the caret is moved by each character's own animation starting",
            component: () => <PhrasesExample {...commonProps} />,
            path: `${EXAMPLES_ROOT}/Phrases.tsx`,
        },
    ];

    return (
        <div className={styles.root}>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"textContainerWidth"}
                    label={"Container width (px)"}
                    hint={
                        "How wide the box holding the text is, which decides where the lines wrap as the text is typed."
                    }
                >
                    <PageNumberField
                        value={textContainerWidth}
                        min={TypewriterKnobs.MIN_CONTAINER_WIDTH}
                        max={TypewriterKnobs.MAX_CONTAINER_WIDTH}
                        step={TypewriterKnobs.CONTAINER_WIDTH_STEP}
                        ariaLabel={"Container width in pixels"}
                        onInput={setTextContainerWidth}
                    />
                </PageProp>

                <PageProp
                    itemKey={"textEffect"}
                    label={"Effect"}
                    hint={"How each character arrives: plainly, or with one of the entrance effects."}
                >
                    <PageSelectField
                        value={textEffect}
                        values={TEXT_EFFECTS}
                        ariaLabel={"Effect"}
                        onChange={(effect) => setTextEffect(effect)}
                    />
                </PageProp>

                <PageProp
                    itemKey={"arrivalOrder"}
                    label={"Arrival order"}
                    hint={
                        "The order the characters arrive in: left to right, from the middle out, scattered, and so on. Erasing runs it backwards. The caret is meant for left to right, and jumps about under the others."
                    }
                >
                    <PageSelectField
                        value={arrivalOrder}
                        values={TypewriterKnobs.ARRIVAL_ORDERS}
                        ariaLabel={"Arrival order"}
                        onChange={(order) => setArrivalOrder(order)}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} layout={"flow"} />
        </div>
    );
};
