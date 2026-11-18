import { useState } from "react";

import { NumberInputKnobs } from "@thewaver/ss-playground/App/Knobs/NumberInputs.const";
import {
    DOCS_ROOT,
    DOCS_SECTIONS,
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
                        <PageProp itemKey={"isReadOnly"} {...NumberInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...NumberInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...NumberInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={isDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={isReadOnly} hasError={hasError} isDisabled={isDisabled} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.rightLeft} />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.steppingLimits} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Stepping.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"min"} {...NumberInputKnobs.MIN_TEXT}>
                            <PageNumberField
                                value={min}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp itemKey={"max"} {...NumberInputKnobs.MAX_TEXT}>
                            <PageNumberField
                                value={max}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp itemKey={"step"} {...NumberInputKnobs.STEP_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.numbersWrittenLocalWay} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"locale"} {...NumberInputKnobs.LOCALE_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.unitBesideStepper} />

            <PageDocsExample path={`${DOCS_ROOT}/Unit.tsx`}>
                <UnitDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.tooltip} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Tooltip.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"tooltipIsReachableWhenDisabled"}
                            {...NumberInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={isReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp itemKey={"tooltipIsDisabled"} {...NumberInputKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
