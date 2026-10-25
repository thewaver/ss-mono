import { useState } from "react";

import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
import {
    DOCS_ROOT,
    GERMAN_LOCALE,
    NUMBER_LOCALES,
    QUANTITY_MAX,
    QUANTITY_MIN,
    QUANTITY_STEP,
} from "@thewaver/ss-playground/App/Pages/NumberInputPage/NumberInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { LabeledDocsExample } from "./Docs/Labeled";
import { LocaleDocsExample } from "./Docs/Locale";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SteppingDocsExample } from "./Docs/Stepping";
import { TooltipDocsExample } from "./Docs/Tooltip";
import { UnitDocsExample } from "./Docs/Unit";

export const NumberInputDocs = () => {
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [min, setMin] = useState(QUANTITY_MIN);
    const [max, setMax] = useState(QUANTITY_MAX);
    const [step, setStep] = useState(QUANTITY_STEP);
    const [locale, setLocale] = useState(GERMAN_LOCALE);
    const [isReachableWhenDisabled, setIsReachableWhenDisabled] = useState(false);
    const [isTooltipDisabled, setIsTooltipDisabled] = useState(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"isReadOnly"}
                            label={"Read-only"}
                            hint={
                                "Its number can be selected and copied, but neither typing, pasting nor the stepper changes it."
                            }
                            controls={"Sets NumberInputProps.isReadOnly"}
                        >
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets NumberInputProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."
                            }
                            controls={"Sets NumberInputProps.isDisabled"}
                        >
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Right to left"}
                content={
                    "Inside a box whose text runs right to left, the number starts from the right and the trailing slot, here the unit and the stepper, sits on the left, taking the narrow side of the [prop]padding[/prop] with it. The up and down arrow keys keep their meaning."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Stepping and limits"}
                content={
                    "Its value is a number, or undefined while the field is empty. The up and down arrow keys and the stepper buttons move it by [prop]step[/prop], repeating while held, and a fractional step lands on clean values rather than drifting. A [prop]min[/prop] and a [prop]max[/prop] keep it in range: a typed value outside them is corrected once the field is left, never while it is being typed."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Stepping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"min"}
                            label={"Min"}
                            hint={"The lowest value the field accepts."}
                            controls={"Sets NumberInputProps.min"}
                        >
                            <PageNumberField
                                value={min}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"max"}
                            label={"Max"}
                            hint={"The highest value the field accepts."}
                            controls={"Sets NumberInputProps.max"}
                        >
                            <PageNumberField
                                value={max}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"step"}
                            label={"Step"}
                            hint={"How far one press of an arrow key or a stepper button moves the value."}
                            controls={"Sets NumberInputProps.step"}
                        >
                            <PageNumberField
                                value={step}
                                min={NumberInputKnobs.MIN_STEP}
                                max={NumberInputKnobs.MAX_STEP}
                                step={NumberInputKnobs.STEP_STEP}
                                ariaLabel={"Step"}
                                onInput={setStep}
                            />
                        </PageProp>
                    </>
                )}
            >
                <SteppingDocsExample min={min} max={max} step={step} />
            </PageDocsExample>

            <PageDocsSection
                title={"Numbers written the local way"}
                content={
                    "Give it a [prop]locale[/prop] and it reads and writes numbers the way that locale does: in German, a comma before the decimals and dots between the thousands. Left out, it follows the reader's own."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"locale"}
                        label={"Locale"}
                        hint={"The language and region whose way of writing numbers the field uses."}
                        controls={"Sets NumberInputProps.locale"}
                    >
                        <PageSelectField
                            value={locale}
                            values={NUMBER_LOCALES}
                            ariaLabel={"Locale"}
                            onChange={setLocale}
                        />
                    </PageProp>
                )}
            >
                <LocaleDocsExample locale={locale} />
            </PageDocsExample>

            <PageDocsSection
                title={"A unit beside the stepper"}
                content={
                    "The trailing slot is handed the stepper and can draw more next to it, such as the unit the number is in."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Unit.tsx`}>
                <UnitDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Tooltip"}
                content={
                    "Give a field [prop]tooltipDefs[/prop] and it shows a tooltip on hover and on keyboard focus, read by screen readers as the field's description. A disabled field shows no tooltip unless you also keep it reachable when disabled; it can then be focused to read why it is off, and typing still changes nothing."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            label={"Reachable when disabled"}
                            hint={
                                "Keeps a disabled field's tooltip available: the Tab key can stop on it and hovering it shows the tooltip. Without it a disabled field shows no tooltip at all. It only matters while Disabled is on."
                            }
                            controls={"Sets NumberInputProps.isReachableWhenDisabled"}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"tooltipIsDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, the stepper is off too, and the Tab key skips it."
                            }
                            controls={"Sets NumberInputProps.isDisabled"}
                        >
                            <PageCheckField
                                value={isTooltipDisabled}
                                ariaLabel={"Disabled"}
                                onChange={setIsTooltipDisabled}
                            />
                        </PageProp>
                    </>
                )}
            >
                <TooltipDocsExample isDisabled={isTooltipDisabled} isReachableWhenDisabled={isReachableWhenDisabled} />
            </PageDocsExample>

            <PageDocsSection
                title={"Named by a Label"}
                content={
                    "Inside a Label, the field takes its name from the label's text, so it needs no [prop]ariaLabel[/prop], and pressing the text focuses the field."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
