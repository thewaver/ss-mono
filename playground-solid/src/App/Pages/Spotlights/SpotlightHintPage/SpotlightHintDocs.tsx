import { createSignal } from "solid-js";

import { SPOTLIGHT_DEFAULTS } from "@thewaver/ss-components-solid";
import { SpotlightHintKnobs } from "@thewaver/ss-playground/App/Knobs/SpotlightHints.const";
import { SpotlightKnobs } from "@thewaver/ss-playground/App/Knobs/Spotlights.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightHintPage/SpotlightHintPage.const";
import { FIELD_WIDTH, PADDING } from "@thewaver/ss-playground/App/Pages/Spotlights/SpotlightTourSteps.const";

import { PageDocsAlert } from "../../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../../PageComponents/DocsExample/DocsExample";
import { PageNumberField } from "../../../PageComponents/Field/Field";
import { PageProp } from "../../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";

export const SpotlightHintDocs = () => {
    const [getPadding, setPadding] = createSignal(PADDING);
    const [getTransitionDurationMs, setTransitionDurationMs] = createSignal(SPOTLIGHT_DEFAULTS.transitionDurationMs);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                A hint is only drawn: it moves no focus and says nothing, so a screen-reader user never learns it
                appeared. Whatever it points at must also be said in text the page reads out, in the control's own name
                or description or in a sentence beside it (<a href={WCAG_URLS["1.3.1"]}>WCAG 1.3.1</a>).
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"padding"} {...SpotlightHintKnobs.PADDING_TEXT}>
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

                        <PageProp key={"transitionDurationMs"} {...SpotlightHintKnobs.TRANSITION_DURATION_MS_TEXT}>
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
