import { createSignal } from "solid-js";

import { DOCS_ROOT } from "@thewaver/ss-playground/App/Pages/TextInputPage/TextInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { AdornmentsDocsExample } from "./Docs/Adornments";
import { BasicDocsExample } from "./Docs/Basic";
import { EditableDocsExample } from "./Docs/Editable";
import { LabeledDocsExample } from "./Docs/Labeled";
import { NumberDocsExample } from "./Docs/Number";
import { PasswordDocsExample } from "./Docs/Password";
import { RefusingDocsExample } from "./Docs/Refusing";
import { RewritingDocsExample } from "./Docs/Rewriting";
import { SuggestionsDocsExample } from "./Docs/Suggestions";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const TextInputDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"isReadOnly"}
                            label={"Read-only"}
                            hint={"Its text can be selected and copied, but neither typing nor pasting changes it."}
                            controls={"Sets TextInputProps.isReadOnly"}
                        >
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets TextInputProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets TextInputProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Rewriting what is typed"}>
                {
                    "Every change also runs onInput, and whatever it writes to the value is what the field shows. Here every letter is upper-cased on the way in, and the caret stays where it was, even when typing in the middle."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Rewriting.tsx`}>
                <RewritingDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Refusing what is typed"}>
                {
                    "Writing less than was typed from onInput refuses the rest. This PIN keeps digits only, no more than six of them, and reports an error while it holds fewer than six."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Refusing.tsx`}>
                <RefusingDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Leading and trailing content"}>
                {
                    "Content can sit inside the field, before and after the text, through renderLeading and renderTrailing: a unit, an icon, or a control of its own, such as this Clear button."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Adornments.tsx`}>
                <AdornmentsDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Passwords"}>
                {
                    "A type of password hides the text, and switching it to text shows it again, here from a trailing button. Give it an autoComplete so password managers know what to fill."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Password.tsx`}>
                <PasswordDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Numbers"}>
                {
                    "A type of number takes min, max and step, and the up and down arrows step the value. It draws no buttons to step with; NumberInput is the field that does."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Number.tsx`}>
                <NumberDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Suggestions"}>
                {
                    "Give it suggestions and it becomes a combobox: typing opens a list under it, with nothing highlighted, so Enter keeps exactly what was typed. The arrows walk the list and Enter then writes the highlighted suggestion; Escape closes the list and leaves the text alone. Any text is allowed, so filtering the list is yours."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Suggestions.tsx`}>
                <SuggestionsDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Tooltip"}>
                {
                    "Give a field tooltipDefs and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets TextInputProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            key={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets TextInputProps.isDisabled"}
                        >
                            <PageCheckField
                                value={getIsTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample
                    isDisabled={getIsTooltipDisabled}
                    isReachableWhenDisabled={getIsReachableWhenDisabled}
                />
            </PageDocsExample>

            <PageDocsSection title={"Named by a Label"}>
                {
                    "Inside a Label, the field takes its name from the label's text, so it needs no ariaLabel, and pressing the text focuses the field."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"Editing in place"}>
                {
                    "A field can stand in for a button while it is being edited. Pressing the name swaps it for a field holding the current text, already focused; Enter or leaving the field keeps the edit, Escape puts the old text back, and either way focus returns to the button."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Editable.tsx`}>
                <EditableDocsExample />
            </PageDocsExample>
        </>
    );
};
