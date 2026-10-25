import { createSignal } from "solid-js";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-solid";
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
                        <PageProp
                            key={"isReadOnly"}
                            label={"Read-only"}
                            hint={"Its amount can be selected and copied, but neither typing nor pasting changes it."}
                            controls={"Sets CurrencyInputProps.isReadOnly"}
                        >
                            <PageCheckField value={getIsReadOnly} ariaLabel={"Read-only"} onChange={setIsReadOnly} />
                        </PageProp>

                        <PageProp
                            key={"hasError"}
                            label={"Error"}
                            hint={"Marks the field invalid, for screen readers as well as for the painter."}
                            controls={"Sets CurrencyInputProps.hasError"}
                        >
                            <PageCheckField value={getHasError} ariaLabel={"Error"} onChange={setHasError} />
                        </PageProp>

                        <PageProp
                            key={"isDisabled"}
                            label={"Disabled"}
                            hint={
                                "Turns the field off: nothing can write to it, it shows no caret, and the Tab key skips it."
                            }
                            controls={"Sets CurrencyInputProps.isDisabled"}
                        >
                            <PageCheckField value={getIsDisabled} ariaLabel={"Disabled"} onChange={setIsDisabled} />
                        </PageProp>
                    </>
                )}
            >
                <BasicDocsExample isReadOnly={getIsReadOnly} hasError={getHasError} isDisabled={getIsDisabled} />
            </PageDocsExample>

            <PageDocsSection title={"Written the local way"}>
                {
                    "Give it a locale and the amount is written the way that place writes money: which separators, and in which groups. The decimals say how many digits follow the separator, and groupSizes overrides the locale's grouping, such as the Indian pattern of a group of three and then groups of two. However many groups the amount needs, it gets."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Locale.tsx`}
                renderKnobs={() => (
                    <>
                        <PageProp
                            key={"locale"}
                            label={"Locale"}
                            hint={"Which country's conventions the amount is written in, which decides the separators."}
                            controls={"Sets CurrencyInputProps.locale"}
                        >
                            <PageSelectField
                                value={getLocale}
                                values={CurrencyInputKnobs.LOCALES}
                                width={LOCALE_FIELD_WIDTH}
                                ariaLabel={"Locale"}
                                onChange={(locale) => setLocale(() => locale)}
                            />
                        </PageProp>

                        <PageProp
                            key={"decimals"}
                            label={"Decimals"}
                            hint={"How many digits are kept after the decimal separator."}
                            controls={"Sets CurrencyInputProps.decimals"}
                        >
                            <PageSelectField
                                value={getDecimals}
                                values={CurrencyInputKnobs.DECIMALS}
                                ariaLabel={"Decimals"}
                                onChange={setDecimals}
                            />
                        </PageProp>

                        <PageProp
                            key={"groupSizes"}
                            label={"Grouping"}
                            hint={
                                "How the digits before the decimal separator are grouped: the locale's own way, or a pattern such as threes or the Indian lakh."
                            }
                            controls={"Sets CurrencyInputProps.groupSizes"}
                        >
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

            <PageDocsSection title={"With a symbol"}>
                {
                    "The field keeps no list of currencies, so the symbol is yours to draw, in the leading or the trailing slot, on whichever side your locale puts it."
                }
            </PageDocsSection>

            <PageDocsExample path={`${DOCS_ROOT}/Symbol.tsx`}>
                <SymbolDocsExample />
            </PageDocsExample>

            <PageDocsSection title={"A limit"}>
                {"Give it a max and any amount above it is refused as it is typed, so the field never holds more."}
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Bounded.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"max"}
                        label={"Max"}
                        hint={"The largest amount the field accepts."}
                        controls={"Sets CurrencyInputProps.max"}
                    >
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

            <PageDocsSection title={"Negative amounts"}>
                {
                    "With hasSign on, a minus can be typed and the amount can go below zero. Off, the default, a minus is refused."
                }
            </PageDocsSection>

            <PageDocsExample
                path={`${DOCS_ROOT}/Signed.tsx`}
                renderKnobs={() => (
                    <PageProp
                        key={"hasSign"}
                        label={"Signed"}
                        hint={"Allows negative amounts to be typed. With it off, a minus sign is refused."}
                        controls={"Sets CurrencyInputProps.hasSign"}
                    >
                        <PageCheckField value={getHasSign} ariaLabel={"Signed"} onChange={setHasSign} />
                    </PageProp>
                )}
            >
                <SignedDocsExample hasSign={getHasSign} />
            </PageDocsExample>
        </>
    );
};
