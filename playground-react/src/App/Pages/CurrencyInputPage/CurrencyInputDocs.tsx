import { useState } from "react";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-react";
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
    const [isReadOnly, setIsReadOnly] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [locale, setLocale] = useState(CurrencyInputKnobs.STARTING_LOCALE);
    const [decimals, setDecimals] = useState(CURRENCY_INPUT_DEFAULTS.decimals);
    const [grouping, setGrouping] = useState<number[] | undefined>();
    const [max, setMax] = useState(BUDGET_MAX);
    const [hasSign, setHasSign] = useState(true);

    return (
        <>
            <PageDocsExample
                path={`${DOCS_ROOT}/Basic.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"isReadOnly"} {...CurrencyInputKnobs.IS_READ_ONLY_TEXT}>
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp itemKey={"hasError"} {...CurrencyInputKnobs.HAS_ERROR_TEXT}>
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp itemKey={"isDisabled"} {...CurrencyInputKnobs.IS_DISABLED_TEXT}>
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

            <PageDocsSection {...DOCS_SECTIONS.writtenLocalWay} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp itemKey={"locale"} {...CurrencyInputKnobs.LOCALE_TEXT}>
                            <PageSelectField
                                value={locale}
                                values={CurrencyInputKnobs.LOCALES}
                                width={LOCALE_FIELD_WIDTH}
                                ariaLabel={"Locale"}
                                onChange={setLocale}
                            />
                        </PageProp>

                        <PageProp itemKey={"decimals"} {...CurrencyInputKnobs.DECIMALS_TEXT}>
                            <PageSelectField
                                value={decimals}
                                values={CurrencyInputKnobs.DECIMALS}
                                ariaLabel={"Decimals"}
                                onChange={setDecimals}
                            />
                        </PageProp>

                        <PageProp itemKey={"groupSizes"} {...CurrencyInputKnobs.GROUP_SIZES_TEXT}>
                            <PageSelectField
                                value={grouping}
                                values={CurrencyInputKnobs.GROUPINGS}
                                computeLabel={describeGrouping}
                                ariaLabel={"Grouping"}
                                onChange={setGrouping}
                            />
                        </PageProp>
                    </>
                )}
            >
                <LocaleDocsExample locale={locale} decimals={decimals} groupSizes={grouping} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.symbol} />

            <PageDocsExample path={`${DOCS_ROOT}/Symbol.tsx`}>
                <SymbolDocsExample />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.limit} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bounded.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"max"} {...CurrencyInputKnobs.MAX_TEXT}>
                        <PageNumberField
                            value={max}
                            min={CurrencyInputKnobs.MIN_MAX}
                            max={CurrencyInputKnobs.MAX_MAX}
                            step={CurrencyInputKnobs.MAX_STEP}
                            ariaLabel={"Max"}
                            onInput={setMax}
                        />
                    </PageProp>
                )}
            >
                <BoundedDocsExample max={max} />
            </PageDocsExample>

            <PageDocsSection {...DOCS_SECTIONS.negativeAmounts} />

            <PageDocsExample
                path={`${DOCS_ROOT}/Signed.tsx`}
                renderKnobs={() => (
                    <PageProp itemKey={"hasSign"} {...CurrencyInputKnobs.HAS_SIGN_TEXT}>
                        <PageCheckField value={hasSign} ariaLabel={"Signed"} onChange={setHasSign} />
                    </PageProp>
                )}
            >
                <SignedDocsExample hasSign={hasSign} />
            </PageDocsExample>
        </>
    );
};
