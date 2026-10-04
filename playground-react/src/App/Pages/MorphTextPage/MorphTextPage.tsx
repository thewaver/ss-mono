import { useState } from "react";

import { MORPH_TEXT_DEFAULTS, MediaQueryMonitorReactUtils } from "@thewaver/ss-components-react";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PaintedExample } from "./Examples/Painted";
import { WordsExample } from "./Examples/Words";

const EXAMPLES_ROOT = "/src/App/Pages/MorphTextPage/Examples";

const NO_MOTION_DURATION_MS = 0;

export const MorphTextPage = () => {
    const [morphDurationMs, setMorphDurationMs] = useState(MORPH_TEXT_DEFAULTS.morphDurationMs);
    const [maxBlurPx, setMaxBlurPx] = useState(MORPH_TEXT_DEFAULTS.maxBlurPx);
    const [word, setWord] = useState("");
    const [paintedWord, setPaintedWord] = useState("");

    const prefersReducedMotion = MediaQueryMonitorReactUtils.useReducedMotion();

    const commonProps = {
        morphDurationMs: prefersReducedMotion ? NO_MOTION_DURATION_MS : morphDurationMs,
        maxBlurPx,
    };

    const examples = [
        {
            key: "words",
            name: "Words in turn",
            readout: () =>
                `showing: ${word} — the page changes the word on a timer and the text melts into the next; Pause stops the cycle`,
            component: () => <WordsExample {...commonProps} onWordChange={setWord} />,
            path: `${EXAMPLES_ROOT}/Words.tsx`,
        },
        {
            key: "painted",
            name: "Painted text",
            readout: () =>
                `showing: ${paintedWord} — each copy is a PaintedText with a moving gradient, and the melt still works because the filter sits on the morph's own box`,
            component: () => <PaintedExample {...commonProps} onWordChange={setPaintedWord} />,
            path: `${EXAMPLES_ROOT}/Painted.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"morphDurationMs"}
                    label={"Morph duration (ms)"}
                    hint={
                        "How long one word takes to melt into the next. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={morphDurationMs}
                        min={MorphTextKnobs.MIN_MORPH_DURATION_MS}
                        max={MorphTextKnobs.MAX_MORPH_DURATION_MS}
                        step={MorphTextKnobs.MORPH_DURATION_STEP_MS}
                        isDisabled={prefersReducedMotion}
                        ariaLabel={"Morph duration in milliseconds"}
                        onInput={setMorphDurationMs}
                    />
                </PageProp>

                <PageProp
                    itemKey={"maxBlurPx"}
                    label={"Blur (px)"}
                    hint={
                        "The most either word is blurred while they cross. More blur melts more of the letters together."
                    }
                >
                    <PageNumberField
                        value={maxBlurPx}
                        min={MorphTextKnobs.MIN_MAX_BLUR_PX}
                        max={MorphTextKnobs.MAX_MAX_BLUR_PX}
                        step={MorphTextKnobs.MAX_BLUR_STEP_PX}
                        ariaLabel={"Blur in pixels"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
