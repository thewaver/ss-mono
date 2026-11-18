import { createSignal } from "solid-js";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-solid";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import {
    BUDGET_MAX,
    DOCS_ROOT,
    DOCS_SECTIONS,
    LOCALE_FIELD_WIDTH,
    LOCALE_GROUPING,
} from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

import { PageDocsExample } from "../../PageComponents/DocsExample/DocsExample";
import { PageDocsSection } from "../../PageComponents/DocsSection/DocsSection";
import { PageCheckField, PageNumberField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { BasicDocsExample } from "./Docs/Basic";
import { BoundedDocsExample } from "./Docs/Bounded";
import { LocaleDocsExample } from "./Docs/Locale";
import { RightToLeftDocsExample } from "./Docs/RightToLeft";
import { SignedDocsExample } from "./Docs/Signed";
import { SymbolDocsExample } from "./Docs/Symbol";

const describeGrouping = (sizes: number[] | undefined) =>
    sizes === undefined ? LOCALE_GROUPING : sizes.join(" then ");

export const CurrencyInputDocs = () => {
    const [getIsReadOnly, setIsReadOnly] = createSignal(false);
    const [getHasError, setHasError] = createSignal(false);
    const [getIsDisabled, setIsDisabled] = createSignal(false);
    const [getLocale, setLocale] = createSignal(CurrencyInputKnobs.STARTING_LOCALE);
    const [getDecimals, setDecimals] = createSignal(CURRENCY_INPUT_DEFAULTS.decimals);
    const [getGrouping, setGrouping] = createSignal<number[] | undefined>();
    const [getMax, setMax] = createSignal(BUDGET_MAX);
    const [getHasSign, setHasSign] = createSignal(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"isReadOnly"} {...CurrencyInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp key={"hasError"} {...CurrencyInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp key={"isDisabled"} {...CurrencyInputKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.writtenLocalWay} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp key={"locale"} {...CurrencyInputKnobs.LOCALE_TEXT}>
                            <PageSelectField
                                value={getLocale}
                                values={CurrencyInputKnobs.LOCALES}
                                width={LOCALE_FIELD_WIDTH}
                                ariaLabel={"Locale"}
                                onChange={(locale) => setLocale(() => locale)}
                            />
                        </PageProp>

                        <PageProp key={"decimals"} {...CurrencyInputKnobs.DECIMALS_TEXT}>
                            <PageSelectField
                                value={getDecimals}
                                values={CurrencyInputKnobs.DECIMALS}
                                ariaLabel={"Decimals"}
                                onChange={setDecimals}
                            />
                        </PageProp>

                        <PageProp key={"groupSizes"} {...CurrencyInputKnobs.GROUP_SIZES_TEXT}>
                            <PageSelectField
                                value={getGrouping}
                                values={CurrencyInputKnobs.GROUPINGS}
                                computeLabel={describeGrouping}
                                ariaLabel={"Grouping"}
                                onChange={(sizes) => setGrouping(() => sizes)}
                            />
                        </PageProp>
                    </>
                )}
            >
                <LocaleDocsExample locale={getLocale} decimals={getDecimals} groupSizes={getGrouping} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.symbol} />

            <PageDocsExample path={`${DOCS_ROOT}/Symbol.tsx`}>
                <SymbolDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.limit} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bounded.tsx`}
                renderKnobs={() => (
                    <PageProp key={"max"} {...CurrencyInputKnobs.MAX_TEXT}>
                        <PageNumberField
                            value={getMax}
                            min={CurrencyInputKnobs.MIN_MAX}
                            max={CurrencyInputKnobs.MAX_MAX}
                            step={CurrencyInputKnobs.MAX_STEP}
                            ariaLabel={"Max"}
                            onInput={setMax}
                        />
                    </PageProp>
                )}
            >
                <BoundedDocsExample max={getMax} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.negativeAmounts} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Signed.tsx`}
                renderKnobs={() => (
                    <PageProp key={"hasSign"} {...CurrencyInputKnobs.HAS_SIGN_TEXT}>
                        <PageCheckField value={getHasSign} ariaLabel={"Signed"} onChange={setHasSign} />
                    </PageProp>
                )}
            >
                <SignedDocsExample hasSign={getHasSign} />
            </PageDocsExample>
        </>
    );
};
