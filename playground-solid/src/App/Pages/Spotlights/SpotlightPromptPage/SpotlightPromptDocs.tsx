import { createSignal } from "solid-js";

import { SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-solid";
import { SpotlightPromptKnobs } from "@thewaver/ss-playground/App/Knobs/SpotlightPrompts.const";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightPromptPage/SpotlightPromptPage.const";
import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import { PageDocsAlert } from "../../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";

export const SpotlightPromptDocs = () => {
    const [getPadding, setPadding] = createSignal(PADDING);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(SPOTLIGHT_DEFAULTS.transitionDurationMs);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                A prompt keeps the pointer and the keyboard on the lit control, but not a screen reader, which can still
                read the rest of the page: the library cannot hide the page from it while one control in it stays
                usable. Focus is put on the lit control, so its name is all a screen-reader user is told. Make that name
                say what is being asked, "Buy the potato" rather than "OK" (<a href={WCAG_URLS["2.4.6"]}>WCAG 2.4.6</a>
                ). Where the page must be shut off from everyone, use SpotlightGuide, which hides it from screen readers
                too.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"padding"} {...SpotlightPromptKnobs.PADDING_TEXT}>
                            <PageNumberField
                                value={getPadding}
                                min={SpotlightKnobs.MIN_PADDING}
                                max={SpotlightKnobs.MAX_PADDING}
                                step={SpotlightKnobs.PADDING_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Padding in pixels"}
                                onInput={setPadding}
                            />
                        </PageProp>

                        <PageProp key={"transitionDurationMs"} {...SpotlightPromptKnobs.TRANSITION_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getTransitionDurationMs}
                                min={SpotlightKnobs.MIN_DURATION}
                                max={SpotlightKnobs.MAX_DURATION}
                                step={SpotlightKnobs.DURATION_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Transition duration in milliseconds"}
                                onInput={setTransitionDurationMs}
                            />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample padding={getPadding} transitionDurationMs={getTransitionDurationMs} />
            </PageDocsExample>
        </>
    );
};
