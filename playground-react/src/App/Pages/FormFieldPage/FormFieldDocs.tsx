import { useState } from "react";

import type { FormFieldOrientation } from "@thewaver/ss-components-react";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-react";
import { FormFieldKnobs } from "@thewaver/ss-playground/App/Knobs/FormFields.const";
import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/FormFieldPage/FormFieldPage.const";

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
                        <PageProp
                            itemKey={"orientation"}
                            label={"Orientation"}
                            hint={"Whether the caption sits above the control or beside it."}
                            controls={"Sets FormFieldProps.orientation"}
                        >
                            <PageSelectField
                                value={orientation}
                                values={FORM_FIELD_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={setOrientation}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"gap"}
                            label={"Gap (px)"}
                            hint={"The space between the caption, the control and the message."}
                            controls={"Sets FormFieldProps.gap"}
                        >
                            <PageNumberField
                                value={gap}
                                min={FormFieldKnobs.MIN_GAP}
                                max={FormFieldKnobs.MAX_GAP}
                                step={FormFieldKnobs.GAP_STEP}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"message"}
                            label={"Message"}
                            hint={"The line shown under the control. Leave it empty and no line is rendered at all."}
                            controls={"Sets FormFieldProps.message"}
                        >
                            <PageTextField
                                value={message}
                                placeholder={"No message"}
                                ariaLabel={"Message"}
                                onInput={setMessage}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"isRequired"}
                            label={"Required"}
                            hint={
                                "Tells screen readers a value is expected, and hands the caption the state to mark it. Nothing is enforced."
                            }
                            controls={"Sets FormFieldProps.isRequired"}
                        >
                            <PageCheckField value={isRequired} ariaLabel={"Required"} onChange={setIsRequired} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={
                                "Puts the field into its error look and reads the message out as the error rather than as help."
                            }
                            controls={"Sets FormFieldProps.hasError"}
                        >
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

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the caption, the field and the message line up on the right, and what is typed starts from the right of the field. With [prop]orientation[/prop] set to horizontal, the caption sits to the right of the field instead."
                }
            />

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

            <PageDocsSection
                title={"Inside a form"}
                content={
                    "A field inside a Form reports to it, so the form's [prop]isValid[/prop] is false while the field's [prop]hasError[/prop] is on, and the line under the button says so; nothing here hands the field's state to the form. Saving while the error is on moves focus to the field."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/InForm.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"inFormHasError"}
                        label={"Error"}
                        hint={"Puts the field in error, which the form hears without being told."}
                        controls={"Sets FormFieldProps.hasError"}
                    >
                        <PageCheckField value={inFormHasError} ariaLabel={"Error"} onChange={setInFormHasError} />
                    </PageProp>
                )}
            >
                <InFormDocsExample hasError={inFormHasError} />
            </PageDocsExample>
        </>
    );
};
