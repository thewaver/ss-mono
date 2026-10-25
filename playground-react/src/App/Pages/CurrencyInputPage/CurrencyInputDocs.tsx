import { useState } from "react";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-react";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import {
    BUDGET_MAX,
    DOCS_ROOT,
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
                        <PageProp
                            itemKey={"isReadOnly"}
                            label={"Read-only"}
                            hint={"Its amount can be selected and copied, but neither typing nor pasting changes it."}
                            controls={"Sets CurrencyInputProps.isReadOnly"}
                        >
                            <PageCheckField value={isReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            itemKey={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets CurrencyInputProps.hasError"}
                        >
                            <PageCheckField value={hasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            itemKey={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets CurrencyInputProps.isDisabled"}
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
                    "Inside a box whose text runs right to left, the leading slot, here the symbol, sits on the right and the amount starts beside it, while the digits keep their own order."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/RightToLeft.tsx`}>
                <RightToLeftDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"Written the local way"}
                content={
                    "Give it a [prop]locale[/prop] and the amount is written the way that place writes money: which separators, and in which groups. The [prop]decimals[/prop] say how many digits follow the separator, and [prop]groupSizes[/prop] overrides the locale's grouping, such as the Indian pattern of a group of three and then groups of two. However many groups the amount needs, it gets."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            itemKey={"locale"}
                            label={"Locale"}
                            hint={"Which country's conventions the amount is written in, which decides the separators."}
                            controls={"Sets CurrencyInputProps.locale"}
                        >
                            <PageSelectField
                                value={locale}
                                values={CurrencyInputKnobs.LOCALES}
                                width={LOCALE_FIELD_WIDTH}
                                ariaLabel={"Locale"}
                                onChange={setLocale}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"decimals"}
                            label={"Decimals"}
                            hint={"How many digits are kept after the decimal separator."}
                            controls={"Sets CurrencyInputProps.decimals"}
                        >
                            <PageSelectField
                                value={decimals}
                                values={CurrencyInputKnobs.DECIMALS}
                                ariaLabel={"Decimals"}
                                onChange={setDecimals}
                            />
                        </PageProp>

                        <PageProp
                            itemKey={"groupSizes"}
                            label={"Grouping"}
                            hint={
                                "How the digits before the decimal separator are grouped: the locale's own way, or a pattern such as threes or the Indian lakh."
                            }
                            controls={"Sets CurrencyInputProps.groupSizes"}
                        >
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

            <PageDocsSection
                title={"With a symbol"}
                content={
                    "The field keeps no list of currencies, so the symbol is yours to draw, in the leading or the trailing slot, on whichever side your locale puts it."
                }
            />

            <PageDocsExample path={`${DOCS_ROOT}/Symbol.tsx`}>
                <SymbolDocsExample />
            </PageDocsExample>

            <PageDocsSection
                title={"A limit"}
                content={
                    "Give it a [prop]max[/prop] and any amount above it is refused as it is typed, so the field never holds more."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Bounded.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"max"}
                        label={"Max"}
                        hint={"The largest amount the field accepts."}
                        controls={"Sets CurrencyInputProps.max"}
                    >
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

            <PageDocsSection
                title={"Negative amounts"}
                content={
                    "With [prop]hasSign[/prop] on, a minus can be typed and the amount can go below zero. Off, the default, a minus is refused."
                }
            />

            <PageDocsExample
                path={`${DOCS_ROOT}/Signed.tsx`}
                renderKnobs={() => (
                    <PageProp
                        itemKey={"hasSign"}
                        label={"Signed"}
                        hint={"Allows negative amounts to be typed. With it off, a minus sign is refused."}
                        controls={"Sets CurrencyInputProps.hasSign"}
                    >
                        <PageCheckField value={hasSign} ariaLabel={"Signed"} onChange={setHasSign} />
                    </PageProp>
                )}
            >
                <SignedDocsExample hasSign={hasSign} />
            </PageDocsExample>
        </>
    );
};
