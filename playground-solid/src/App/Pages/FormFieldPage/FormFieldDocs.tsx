import { createSignal } from "solid-js";

import type { FormFieldOrientation } from "@thewaver/ss-components-solid";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-solid";
import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";
import { DOCS_ROOT, DOCS_SECTIONS } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField, PageTextField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { ForeignDocsExample } from "./Docs/Foreign";
import { InFormDocsExample } from "./Docs/InForm";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";

export const FormFieldDocs = () => {
    const [getOrientation, setOrientation] = createSignal<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
    const [getGap, setGap] = createSignal(FORM_FIELD_DEFAULTS.gap);
    const [getMessage, setMessage] = createSignal(FormFieldKnobs.STARTING_MESSAGE);
    const [getIsRequired, setIsRequired] = createSignal(false);
    const [getHasError, setHasError] = createSignal(FormFieldKnobs.STARTING_HAS_ERROR);
    const [getInFormHasError, setInFormHasError] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"orientation"} {...FormFieldKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={getOrientation}
                                values={FORM_FIELD_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp key={"gap"} {...FormFieldKnobs.GAP_TEXT}>
                            <PageNumberField
                                value={getGap}
                                min={FormFieldKnobs.MIN_GAP}
                                max={FormFieldKnobs.MAX_GAP}
                                step={FormFieldKnobs.GAP_STEP}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp key={"message"} {...FormFieldKnobs.MESSAGE_TEXT}>
                            <PageTextField
                                value={getMessage}
                                placeholder={"No message"}
                                ariaLabel={"Message"}
                                onInput={setMessage}
                            />
                        </PageProp>

                        <PageProp key={"isRequired"} {...FormFieldKnobs.IS_REQUIRED_TEXT}>
                            <PageCheckField value={getIsRequired} ariaLabel={"Required"} onChange={setIsRequired} />
                        </PageProp>

                        <PageProp key={"hasError"} {...FormFieldKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    orientation={getOrientation}
                    gap={getGap}
                    message={getMessage}
                    isRequired={getIsRequired}
                    hasError={getHasError}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Around a control of your own"}
                content={
                    "The library's own controls find the field's caption and message by themselves. A control of your own, here a plain input, gets the same wiring from two calls: FormFieldSolidUtils.resolveAriaLabelledBy answers with the caption's id to put in its aria-labelledby, which names it, and FormFieldSolidUtils.resolveAriaDescribedBy with the message's id to put in its aria-describedby, or with nothing while there is no message."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Foreign.tsx`}>
                <ForeignDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.insideForm} />

            <PageDocsExample
                path={`${DOCS_ROOT}/InForm.tsx`}
                renderKnobs={() => (
                    <PageProp key={"inFormHasError"} {...FormFieldKnobs.IN_FORM_HAS_ERROR_TEXT}>
                        <PageCheckField value={getInFormHasError} ariaLabel={"Error"} onChange={setInFormHasError} />
                    </PageProp>
                )}
            >
                <InFormDocsExample hasError={getInFormHasError} />
            </PageDocsExample>
        </>
    );
};
