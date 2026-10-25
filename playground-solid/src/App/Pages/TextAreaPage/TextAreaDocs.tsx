import { createSignal } from "solid-js";

import { TextAreaKnobs } from "@thewaver/ss-playground/App/Knobs/TextAreas.const";
import { DOCS_ROOT, MAX_ROWS } from "@thewaver/ss-playground/App/Pages/TextAreaPage/TextAreaPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { GrowingDocsExample } from "./Docs/Growing";
import { LabeledDocsExample } from "./Docs/Labeled";
import { TooltipDocsExample } from "./Docs/Tooltip";

export const TextAreaDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getMaxRows, setMaxRows] = createSignal(MAX_ROWS);
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
                            controls={"Sets TextAreaProps.isReadOnly"}
                        >
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets TextAreaProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets TextAreaProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Growing with what is typed"}>
                {
                    "With isAutoSizing on, the box follows its own content: it starts minRows tall and grows a row at a time as lines are added, so nothing has to guess a height. At maxRows it stops growing and scrolls instead."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Growing.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"maxRows"}
                        label={"Max rows"}
                        hint={"The most rows the box grows to before it starts scrolling."}
                        controls={"Sets TextAreaProps.maxRows"}
                    >
                        <PageNumberField
                            value={getMaxRows}
                            min={TextAreaKnobs.MIN_MAX_ROWS}
                            max={TextAreaKnobs.MAX_MAX_ROWS}
                            step={TextAreaKnobs.MAX_ROWS_STEP}
                            ariaLabel={"Max rows"}
                            onInput={setMaxRows}
                        />
                    </PageProp>
                )}
            >
                <GrowingDocsExample maxRows={getMaxRows} />
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
                            controls={"Sets TextAreaProps.isReachableWhenDisabled"}
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
                            controls={"Sets TextAreaProps.isDisabled"}
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
        </>
    );
};
