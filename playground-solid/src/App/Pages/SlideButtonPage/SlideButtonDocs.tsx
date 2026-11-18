import { createSignal } from "solid-js";

import {
    NAVIGATOR_DIRECTIONS,
    SLIDE_BUTTON_DEFAULTS,
    SLIDE_BUTTON_MODES,
    SLIDE_BUTTON_ORIENTATIONS,
} from "@thewaver/ss-components-solid";
import type { NavigatorDirection, SlideButtonMode, SlideButtonOrientation } from "@thewaver/ss-components-solid";
import { SlideButtonKnobs } from "@thewaver/ss-playground/App/Knobs/SlideButtons.const";
import { WCAG_URLS } from "@thewaver/ss-playground/App/PageComponents/DocsProse/DocsProse.const";
import * as docsStyles from "@thewaver/ss-playground/App/PageComponents/DocsView/DocsView.css";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
    FIELD_WIDTH,
} from "@thewaver/ss-playground/App/Pages/SlideButtonPage/SlideButtonPage.const";

import { PageDocsAlert } from "../../PageComponents/DocsAlert/DocsAlert";
import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { DirectionsDocsExample } from "./Docs/Directions";
import { HeldDocsExample } from "./Docs/Held";

export const SlideButtonDocs = () => {
    const [getMode, setMode] = createSignal<SlideButtonMode>(SLIDE_BUTTON_DEFAULTS.mode);
    const [getCompletionRatio, setCompletionRatio] = createSignal(SLIDE_BUTTON_DEFAULTS.completionRatio);
    const [getHoldDurationMs, setHoldDurationMs] = createSignal(SLIDE_BUTTON_DEFAULTS.holdDurationMs);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getOrientation, setOrientation] = createSignal<SlideButtonOrientation>(SLIDE_BUTTON_DEFAULTS.orientation);
    const [getDirection, setDirection] = createSignal<NavigatorDirection>(NAVIGATOR_DIRECTIONS[0]);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Give every SlideButton an <span class={docsStyles.docsPropName}>ariaDescription</span> that says how to
                confirm it without sliding, such as which key to hold. Holding Enter or Space is the keyboard route{" "}
                <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a> requires, and nothing else tells a screen reader user that
                it exists or that a plain press does nothing. A button without one warns in the console.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"mode"} {...SlideButtonKnobs.MODE_TEXT}>
                            <PageSelectField
                                value={getMode}
                                values={SLIDE_BUTTON_MODES}
                                ariaLabel={"Mode"}
                                onChange={setMode}
                            />
                        </PageProp>

                        <PageProp key={"completionRatio"} {...SlideButtonKnobs.COMPLETION_RATIO_TEXT}>
                            <PageNumberField
                                value={getCompletionRatio}
                                min={SlideButtonKnobs.MIN_COMPLETION_RATIO}
                                max={SlideButtonKnobs.MAX_COMPLETION_RATIO}
                                step={SlideButtonKnobs.COMPLETION_RATIO_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Completion ratio"}
                                onInput={setCompletionRatio}
                            />
                        </PageProp>

                        <PageProp key={"holdDurationMs"} {...SlideButtonKnobs.HOLD_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={getHoldDurationMs}
                                min={SlideButtonKnobs.MIN_HOLD_DURATION_MS}
                                max={SlideButtonKnobs.MAX_HOLD_DURATION_MS}
                                step={SlideButtonKnobs.HOLD_DURATION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hold duration"}
                                onInput={setHoldDurationMs}
                            />
                        </PageProp>

                        <PageProp key={"hasError"} {...SlideButtonKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...SlideButtonKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    mode={getMode}
                    completionRatio={getCompletionRatio}
                    holdDurationMs={getHoldDurationMs}
                    isDisabled={getIsDisabled}
                    hasError={getHasError}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.orientationDirection} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Directions.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...SlideButtonKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={SLIDE_BUTTON_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp key={"direction"} {...SlideButtonKnobs.DIRECTION_TEXT}>
                            <PageSelectField
                                value={getDirection}
                                values={NAVIGATOR_DIRECTIONS}
                                ariaLabel={"Direction"}
                                onChange={setDirection}
                            />
                        </PageProp>
                    </>
                )}
            >
                <DirectionsDocsExample orientation={getOrientation} direction={getDirection} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.holdingThumbEnd} />

            <PageDocsExample path={`${DOCS_ROOT}/Held.tsx`}>
                <HeldDocsExample />
            </PageDocsExample>
        </>
    );
};
