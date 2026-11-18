import { useState } from "react";

import type { FormFieldOrientation } from "@thewaver/ss-components-react";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-react";
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
    const [orientation, setOrientation] = useState<FormFieldOrientation>(FORM_FIELD_DEFAULTS.orientation);
    const [gap, setGap] = useState(FORM_FIELD_DEFAULTS.gap);
    const [message, setMessage] = useState(FormFieldKnobs.STARTING_MESSAGE);
    const [isRequired, setIsRequired] = useState(false);
    const [hasError, setHasError] = useState(FormFieldKnobs.STARTING_HAS_ERROR);
    const [inFormHasError, setInFormHasError] = useState(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"orientation"} {...FormFieldKnobs.ORIENTATION_TEXT}>
                            <PageSelectField
                                value={orientation}
                                values={FORM_FIELD_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp itemKey={"gap"} {...FormFieldKnobs.GAP_TEXT}>
                            <PageNumberField
                                value={gap}
                                min={FormFieldKnobs.MIN_GAP}
                                max={FormFieldKnobs.MAX_GAP}
                                step={FormFieldKnobs.GAP_STEP}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp itemKey={"message"} {...FormFieldKnobs.MESSAGE_TEXT}>
                            <PageTextField
                                value={message}
                                placeholder={"No message"}
                                ariaLabel={"Message"}
                                onInput={setMessage}
                            />
                        </PageProp>

                        <PageProp itemKey={"isRequired"} {...FormFieldKnobs.IS_REQUIRED_TEXT}>
                            <PageCheckField value={isRequired} ariaLabel={"Required"} onChange={setIsRequired} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...FormFieldKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample
                    orientation={orientation}
                    gap={gap}
                    message={message}
                    isRequired={isRequired}
                    hasError={hasError}
                />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Around a control of your own"}
                content={
                    "The library's own controls find the field's caption and message by themselves. A control of your own, here a plain input, gets the same wiring from two calls: FormFieldReactUtils.useAriaLabelledBy answers with the caption's id to put in its aria-labelledby, which names it, and FormFieldReactUtils.useAriaDescribedBy with the message's id to put in its aria-describedby, or with nothing while there is no message."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Foreign.tsx`}>
                <ForeignDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.insideForm} />

            <PageDocsExample
                path={`${DOCS_ROOT}/InForm.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"inFormHasError"} {...FormFieldKnobs.IN_FORM_HAS_ERROR_TEXT}>
                        <PageCheckField value={inFormHasError} ariaLabel={"Error"} onChange={setInFormHasError} />
                    </PageProp>
                )}
            >
                <InFormDocsExample hasError={inFormHasError} />
            </PageDocsExample>
        </>
    );
};
