import { useState } from "react";

import {
    NAVIGATOR_DIRECTIONS,
    SLIDE_BUTTON_DEFAULTS,
    SLIDE_BUTTON_MODES,
    SLIDE_BUTTON_ORIENTATIONS,
} from "@thewaver/ss-components-react";
import type { NavigatorDirection, SlideButtonMode, SlideButtonOrientation } from "@thewaver/ss-components-react";
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
    const [mode, setMode] = useState<SlideButtonMode>(SLIDE_BUTTON_DEFAULTS.mode);
    const [completionRatio, setCompletionRatio] = useState(SLIDE_BUTTON_DEFAULTS.completionRatio);
    const [holdDurationMs, setHoldDurationMs] = useState(SLIDE_BUTTON_DEFAULTS.holdDurationMs);
    const [isDisabled, setIsDisabled] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [orientation, setOrientation] = useState<SlideButtonOrientation>(SLIDE_BUTTON_DEFAULTS.orientation);
    const [direction, setDirection] = useState<NavigatorDirection>(NAVIGATOR_DIRECTIONS[0]);

    return (
        <>
            <PageDocsAlert severity={"alert"}>
                Give every SlideButton an <span className={docsStyles.docsPropName}>ariaDescription</span> that says how
                to confirm it without sliding, such as which key to hold. Holding Enter or Space is the keyboard route{" "}
                <a href={WCAG_URLS["2.1.1"]}>WCAG 2.1.1</a> requires, and nothing else tells a screen reader user that
                it exists or that a plain press does nothing. A button without one warns in the console.
            </PageDocsAlert>

            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"mode"} {...SlideButtonKnobs.MODE_TEXT}>
                            <PageSelectField
                                value={mode}
                                values={SLIDE_BUTTON_MODES}
                                ariaLabel={"Mode"}
                                onChange={setMode}
                            />
                        </PageProp>

                        <PageProp itemKey={"completionRatio"} {...SlideButtonKnobs.COMPLETION_RATIO_TEXT}>
                            <PageNumberField
                                value={completionRatio}
                                min={SlideButtonKnobs.MIN_COMPLETION_RATIO}
                                max={SlideButtonKnobs.MAX_COMPLETION_RATIO}
                                step={SlideButtonKnobs.COMPLETION_RATIO_STEP}
                                width={FIELD_WIDTH}
                                ariaLabel={"Completion ratio"}
                                onInput={setCompletionRatio}
                            />
                        </PageProp>

                        <PageProp itemKey={"holdDurationMs"} {...SlideButtonKnobs.HOLD_DURATION_MS_TEXT}>
                            <PageNumberField
                                value={holdDurationMs}
                                min={SlideButtonKnobs.MIN_HOLD_DURATION_MS}
                                max={SlideButtonKnobs.MAX_HOLD_DURATION_MS}
                                step={SlideButtonKnobs.HOLD_DURATION_STEP_MS}
                                width={FIELD_WIDTH}
                                ariaLabel={"Hold duration"}
                                onInput={setHoldDurationMs}
                            />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...SlideButtonKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...SlideButtonKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    mode={mode}
                    completionRatio={completionRatio}
                    holdDurationMs={holdDurationMs}
                    isDisabled={isDisabled}
                    hasError={hasError}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.orientationDirection} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Directions.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"orientation"} {...SlideButtonKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={SLIDE_BUTTON_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"direction"} {...SlideButtonKnobs.DIRECTION_TEXT}>
                            <PageSelectField
                                value={direction}
                                values={NAVIGATOR_DIRECTIONS}
                                ariaLabel={"Direction"}
                                onChange={setDirection}
                            />
                        </PageProp>
                    </>
                )}
            >
                <DirectionsDocsExample orientation={orientation} direction={direction} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.holdingThumbEnd} />

            <PageDocsExample path={`${DOCS_ROOT}/Held.tsx`}>
                <HeldDocsExample />
            </PageDocsExample>
        </>
    );
};
