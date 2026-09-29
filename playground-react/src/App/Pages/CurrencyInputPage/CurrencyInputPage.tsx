import { useState } from "react";

import { CURRENCY_INPUT_DEFAULTS } from "@thewaver/ss-components-react";
import { CurrencyInputKnobs } from "@thewaver/ss-playground/App/Knobs/CurrencyInputs.const";
import { BUDGET_MAX } from "@thewaver/ss-playground/App/Pages/CurrencyInputPage/CurrencyInputPage.const";

import { PageExamples } from "../../PageComponents/Examples/Examples";
import { PageCheckField, PageSelectField } from "../../PageComponents/Field/Field";
import { PageProp } from "../../PageComponents/Prop/Prop";
import { PagePropsPanel } from "../../PageComponents/PropsPanel/PropsPanel";
import type { CurrencyInputExampleProps } from "./CurrencyInputPage.types";
import { BoundedExample } from "./Examples/Bounded";
import { DefaultExample } from "./Examples/Default";
import { SymbolExample } from "./Examples/Symbol";

const LOCALE_FIELD_WIDTH = 120;
const LOCALE_GROUPING = "locale";
const EXAMPLES_ROOT = "/src/App/Pages/CurrencyInputPage/Examples";

const STARTING_PRICE = 1234.56;
const STARTING_BUDGET = 4999.99;
const STARTING_BIG = 9876543210.12;
const STARTING_ADJUSTMENT = -250.5;
const describe = (value: number | undefined) => (value === undefined ? "none" : `${value}`);

const describeGrouping = (sizes: number[] | undefined) =>
    sizes === undefined ? LOCALE_GROUPING : sizes.join(" then ");

export const CurrencyInputPage = () => {
    const [locale, setLocale] = useState(CurrencyInputKnobs.STARTING_LOCALE);
    const [decimals, setDecimals] = useState(CURRENCY_INPUT_DEFAULTS.decimals);
    const [grouping, setGrouping] = useState<number[] | undefined>();
    const [hasSign, setHasSign] = useState(CurrencyInputKnobs.STARTING_HAS_SIGN);

    const priceState = useState<number | undefined>(STARTING_PRICE);
    const emptyState = useState<number | undefined>();
    const budgetState = useState<number | undefined>(STARTING_BUDGET);
    const bigState = useState<number | undefined>(STARTING_BIG);
    const negativeState = useState<number | undefined>(STARTING_ADJUSTMENT);

    const commonProps: Omit<CurrencyInputExampleProps, "value"> = {
        locale,
        decimals,
        groupSizes: grouping,
        hasSign,
    };

    const examples = [
        {
            key: "default",
            name: "Default",
            readout: () =>
                `value: ${describe(priceState[0])} — digits fill from the right, and the separators are the field's rather than yours to type`,
            component: () => <DefaultExample {...commonProps} value={priceState} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "empty",
            name: "Empty",
            readout: () => `value: ${describe(emptyState[0])} — an empty field has no value at all`,
            component: () => <DefaultExample {...commonProps} value={emptyState} ariaLabel={"Amount"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "symbol",
            name: "With a symbol",
            readout: () =>
                `value: ${describe(priceState[0])} — the currency is paint in a slot, since the library holds no currencies`,
            component: () => <SymbolExample {...commonProps} value={priceState} />,
            path: `${EXAMPLES_ROOT}/Symbol.tsx`,
        },
        {
            key: "bounded",
            name: "Bounded",
            readout: () =>
                `value: ${describe(budgetState[0])} — at most ${BUDGET_MAX}, and going over is refused as it is typed`,
            component: () => <BoundedExample {...commonProps} value={budgetState} />,
            path: `${EXAMPLES_ROOT}/Bounded.tsx`,
        },
        {
            key: "negative",
            name: "Signed",
            readout: () =>
                `value: ${describe(negativeState[0])} — a minus is only accepted where the field was told to hold one`,
            component: () => (
                <DefaultExample {...commonProps} value={negativeState} ariaLabel={"Adjustment"} hasSign={true} />
            ),
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
        {
            key: "big",
            name: "Many groups",
            readout: () =>
                `value: ${describe(bigState[0])} — the group count grows with the value, which a fixed pattern cannot do`,
            component: () => <DefaultExample {...commonProps} value={bigState} ariaLabel={"Large amount"} />,
            path: `${EXAMPLES_ROOT}/Default.tsx`,
        },
    ];

    return (
        <>
            <PagePropsPanel scope={"global"}>
                <PageProp
                    itemKey={"locale"}
                    label={"Locale"}
                    hint={
                        "Which country's conventions the amount is written in, which decides the separators and where the symbol sits."
                    }
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
                >
                    <PageSelectField
                        value={decimals}
                        values={CurrencyInputKnobs.DECIMALS}
                        ariaLabel={"Decimals"}
                        onChange={setDecimals}
                    />
                </PageProp>

                <PageProp
                    itemKey={"hasSign"}
                    label={"Signed"}
                    hint={"Allows negative amounts to be typed. With it off, a minus sign is rejected."}
                >
                    <PageCheckField value={hasSign} ariaLabel={"Signed"} onChange={setHasSign} />
                </PageProp>

                <PageProp
                    itemKey={"grouping"}
                    label={"Grouping"}
                    hint={
                        "How the digits before the decimal point are grouped, such as in threes or in the Indian lakh pattern."
                    }
                >
                    <PageSelectField
                        value={grouping}
                        values={CurrencyInputKnobs.GROUPINGS}
                        computeLabel={describeGrouping}
                        ariaLabel={"Grouping"}
                        onChange={setGrouping}
                    />
                </PageProp>
            </PagePropsPanel>

            <PageExamples items={examples} />
        </>
    );
};
