import { createSignal } from "solid-js";

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
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getMin, setMin] = createSignal(QUANTITY_MIN);
    const [getMax, setMax] = createSignal(QUANTITY_MAX);
    const [getStep, setStep] = createSignal(QUANTITY_STEP);
    const [getLocale, setLocale] = createSignal(GERMAN_LOCALE);
    const [getIsReachableWhenDisabled, setIsReachableWhenDisabled] = createSignal(false);
    const [getIsTooltipDisabled, setIsTooltipDisabled] = createSignal(false);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...NumberInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...NumberInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...NumberInputKnobs.IS_DISABLED_TEXT}>
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
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
                        <PageProp key={"min"} {...NumberInputKnobs.MIN_TEXT}>
                            <PageNumberField
                                value={getMin}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Min"}
                                onInput={setMin}
                            />
                        </PageProp>

                        <PageProp key={"max"} {...NumberInputKnobs.MAX_TEXT}>
                            <PageNumberField
                                value={getMax}
                                min={NumberInputKnobs.MIN_LIMIT}
                                max={NumberInputKnobs.MAX_LIMIT}
                                step={NumberInputKnobs.LIMIT_STEP}
                                ariaLabel={"Max"}
                                onInput={setMax}
                            />
                        </PageProp>

                        <PageProp key={"step"} {...NumberInputKnobs.STEP_TEXT}>
                            <PageNumberField
                                value={getStep}
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
                <SteppingDocsExample min={getMin} max={getMax} step={getStep} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.numbersWrittenLocalWay} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <PageProp key={"locale"} {...NumberInputKnobs.LOCALE_TEXT}>
                        <PageSelectField
                            value={getLocale}
                            values={NUMBER_LOCALES}
                            ariaLabel={"Locale"}
                            onChange={setLocale}
                        />
                    </PageProp>
                )}
            >
                <LocaleDocsExample locale={getLocale} />
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
                            key={"tooltipIsReachableWhenDisabled"}
                            {...NumberInputKnobs.TOOLTIP_IS_REACHABLE_WHEN_DISABLED_TEXT}
                        >
                            <PageCheckField
                                value={getIsReachableWhenDisabled}
                                ariaLabel={"Reachable when disabled"}
                                onChange={setIsReachableWhenDisabled}
                            />
                        </PageProp>

                        <PageProp key={"tooltipIsDisabled"} {...NumberInputKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.namedLabel} />

            <PageDocsExample path={`${DOCS_ROOT}/Labeled.tsx`}>
                <LabeledDocsExample />
            </PageDocsExample>
        </>
    );
};
