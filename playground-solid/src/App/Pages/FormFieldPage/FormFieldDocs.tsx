import { createSignal } from "solid-js";

import type { FormFieldOrientation } from "@thewaver/ss-components-solid";
import { FORM_FIELD_DEFAULTS, FORM_FIELD_ORIENTATIONS } from "@thewaver/ss-components-solid";
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
                        <PageProp
                            key={"orientation"}
                            label={"Orientation"}
                            hint={"Whether the caption sits above the control or beside it."}
                            controls={"Sets FormFieldProps.orientation"}
                        >
                            <PageSelectField
                                value={getOrientation}
                                values={FORM_FIELD_ORIENTATIONS}
                                ariaLabel={"Orientation"}
                                onChange={(orientation) => setOrientation(() => orientation)}
                            />
                        </PageProp>

                        <PageProp
                            key={"gap"}
                            label={"Gap (px)"}
                            hint={"The space between the caption, the control and the message."}
                            controls={"Sets FormFieldProps.gap"}
                        >
                            <PageNumberField
                                value={getGap}
                                min={FormFieldKnobs.MIN_GAP}
                                max={FormFieldKnobs.MAX_GAP}
                                step={FormFieldKnobs.GAP_STEP}
                                ariaLabel={"Gap in pixels"}
                                onInput={setGap}
                            />
                        </PageProp>

                        <PageProp
                            key={"message"}
                            label={"Message"}
                            hint={"The line shown under the control. Leave it empty and no line is rendered at all."}
                            controls={"Sets FormFieldProps.message"}
                        >
                            <PageTextField
                                value={getMessage}
                                placeholder={"No message"}
                                ariaLabel={"Message"}
                                onInput={setMessage}
                            />
                        </PageProp>

                        <PageProp
                            key={"isRequired"}
                            label={"Required"}
                            hint={
                                "Tells screen readers a value is expected, and hands the caption the state to mark it. Nothing is enforced."
                            }
                            controls={"Sets FormFieldProps.isRequired"}
                        >
                            <PageCheckField value={getIsRequired} ariaLabel={"Required"} onChange={setIsRequired} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={
                                "Puts the field into its error look and reads the message out as the error rather than as help."
                            }
                            controls={"Sets FormFieldProps.hasError"}
                        >
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
                    "The library's own controls find the field's caption and message by themselves. A control of your own, here a plain input, gets the same wiring from two calls: FormFieldSolidUtils.resolveAriaLabelledBy answers with the caption's id to put in its aria-labelledby, which names it, and FormFieldSolidUtils.resolveAriaDescribedBy with the message's id to put in its aria-describedby, or with nothing while there is no message."
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
                        key={"inFormHasError"}
                        label={"Error"}
                        hint={"Puts the field in error, which the form hears without being told."}
                        controls={"Sets FormFieldProps.hasError"}
                    >
                        <PageCheckField value={getInFormHasError} ariaLabel={"Error"} onChange={setInFormHasError} />
                    </PageProp>
                )}
            >
                <InFormDocsExample hasError={getInFormHasError} />
            </PageDocsExample>
        </>
    );
};
