import { createMemo, createSignal } from "solid-js";

import { MORPH_TEXT_DEFAULTS, MediaQueryMonitorSolidUtils } from "@thewaver/ss-components-solid";
import { MorphTextKnobs } from "@thewaver/ss-playground/App/Knobs/MorphTexts.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import { PaintedExample } from "./Examples/Painted";
import { WordsExample } from "./Examples/Words";
import type { MorphTextExampleProps } from "./MorphTextPage.types";

const EXAMPLES_ROOT = "/src/App/Pages/MorphTextPage/Examples";

const NO_MOTION_DURATION_MS = 0;

export const MorphTextPage = () => {
    const [getMorphDurationMs, setMorphDurationMs] = createSignal(MORPH_TEXT_DEFAULTS.morphDurationMs);
    const [getMaxBlurPx, setMaxBlurPx] = createSignal(MORPH_TEXT_DEFAULTS.maxBlurPx);
    const [getWord, setWord] = createSignal("");
    const [getPaintedWord, setPaintedWord] = createSignal("");

    const getPrefersReducedMotion = MediaQueryMonitorSolidUtils.createReducedMotion();

    const getExamples = createMemo(() => {
        const commonProps: Omit<MorphTextExampleProps, "onWordChange"> = {
            morphDurationMs: () => (getPrefersReducedMotion() ? NO_MOTION_DURATION_MS : getMorphDurationMs()),
            maxBlurPx: getMaxBlurPx,
        };

        return [
            {
                key: "words",
                name: "Words in turn",
                readout: () =>
                    `showing: ${getWord()} — the page changes the word on a timer and the text melts into the next; Pause stops the cycle`,
                component: () => <WordsExample {...commonProps} onWordChange={setWord} />,
                path: `${EXAMPLES_ROOT}/Words.tsx`,
            },
            {
                key: "painted",
                name: "Painted text",
                readout: () =>
                    `showing: ${getPaintedWord()} — each copy is a PaintedText with a moving gradient, and the melt still works because the filter sits on the morph's own box`,
                component: () => <PaintedExample {...commonProps} onWordChange={setPaintedWord} />,
                path: `${EXAMPLES_ROOT}/Painted.tsx`,
            },
        ];
    });

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    key={"morphDurationMs"}
                    label={"Morph duration (ms)"}
                    hint={
                        "How long one word takes to melt into the next. It is off while the visitor has asked for reduced motion."
                    }
                >
                    <PageNumberField
                        value={getMorphDurationMs}
                        min={() => MorphTextKnobs.MIN_MORPH_DURATION_MS}
                        max={() => MorphTextKnobs.MAX_MORPH_DURATION_MS}
                        step={() => MorphTextKnobs.MORPH_DURATION_STEP_MS}
                        isDisabled={getPrefersReducedMotion}
                        ariaLabel={"Morph duration in milliseconds"}
                        onInput={setMorphDurationMs}
                    />
                </PageProp>

                <PageProp
                    key={"maxBlurPx"}
                    label={"Blur (px)"}
                    hint={
                        "The most either word is blurred while they cross. More blur melts more of the letters together."
                    }
                >
                    <PageNumberField
                        value={getMaxBlurPx}
                        min={() => MorphTextKnobs.MIN_MAX_BLUR_PX}
                        max={() => MorphTextKnobs.MAX_MAX_BLUR_PX}
                        step={() => MorphTextKnobs.MAX_BLUR_STEP_PX}
                        ariaLabel={"Blur in pixels"}
                        onInput={setMaxBlurPx}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={getExamples} />
        </>
    );
};
