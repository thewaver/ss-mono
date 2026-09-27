import { useState } from "react";

import type { InteractionFlags, TextFieldFlags } from "@thewaver/ss-components";

import { CurrencyInput } from "../../src";

const FIELD_WIDTH = 240;
const FIELD_HEIGHT = 32;
const FIELD_PADDING = 8;
const STARTING_LOCALE = "en-GB";
const BUDGET_MAX = 5000;

const LOCALES = ["en-GB", "de-DE", "en-IN"];
const DECIMALS = [0, 2];
const GROUPINGS: Record<string, number[] | undefined> = { "locale": undefined, "3": [3], "4": [4], "3-2": [3, 2] };

const Frame = ({ flags }: { flags: InteractionFlags<TextFieldFlags> }) => (
    <div
        style={{
            width: FIELD_WIDTH,
            height: FIELD_HEIGHT,
            border: "1px solid black",
            opacity: flags.isDisabled ? 0.5 : 1,
        }}
    />
);

const renderFrame = (flags: InteractionFlags<TextFieldFlags>) => <Frame flags={flags} />;

const describe = (value: number | undefined) => (value === undefined ? "none" : `${value}`);

const Readout = ({ value }: { value: number | undefined }) => (
    <output data-readout="value">{`value: ${describe(value)}`}</output>
);

const Knobbed = ({ initial, hasSign, max }: { initial?: number; hasSign?: boolean; max?: number }) => {
    const valueState = useState<number | undefined>(initial);
    const [locale, setLocale] = useState(STARTING_LOCALE);
    const [decimals, setDecimals] = useState(2);
    const [grouping, setGrouping] = useState<number[] | undefined>(undefined);

    return (
        <>
            <CurrencyInput
                id="field"
                ariaLabel="Amount"
                locale={locale}
                decimals={decimals}
                groupSizes={grouping}
                hasSign={hasSign}
                max={max}
                padding={FIELD_PADDING}
                valueState={valueState}
                renderContent={renderFrame}
                renderPlaceholder={(_flags, hint) => <span data-testid="placeholder">{hint}</span>}
            />
            <Readout value={valueState[0]} />
            {LOCALES.map((option) => (
                <button key={option} type="button" data-testid={`locale-${option}`} onClick={() => setLocale(option)}>
                    {option}
                </button>
            ))}
            {DECIMALS.map((option) => (
                <button
                    key={option}
                    type="button"
                    data-testid={`decimals-${option}`}
                    onClick={() => setDecimals(option)}
                >
                    {option}
                </button>
            ))}
            {Object.entries(GROUPINGS).map(([name, sizes]) => (
                <button key={name} type="button" data-testid={`grouping-${name}`} onClick={() => setGrouping(sizes)}>
                    {name}
                </button>
            ))}
        </>
    );
};

export const Default = () => <Knobbed initial={1234.56} />;

export const Empty = () => <Knobbed />;

export const Bounded = () => <Knobbed initial={4999.99} max={BUDGET_MAX} />;

export const Big = () => <Knobbed initial={9876543210.12} />;

export const Negative = () => <Knobbed initial={-250.5} hasSign={true} />;
