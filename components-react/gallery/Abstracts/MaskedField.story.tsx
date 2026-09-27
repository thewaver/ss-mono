import { useState } from "react";

import { TextSyncUtils } from "@thewaver/ss-components";

import { MaskedFieldReactUtils } from "../../src";

const PATTERN = "##:##";

export const Default = () => {
    const [value, setValue] = useState<string | undefined>(undefined);

    const field = MaskedFieldReactUtils.useMaskedField<string>({
        value,
        setValue,
        digitCount: 4,
        formatDigits: (digits) => TextSyncUtils.formatWithMask(PATTERN, digits),
        toDigits: (next) => next.replace(":", ""),
        fromDigits: (digits) => (digits.length === 4 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : undefined),
        getHasImpossibleDigits: (digits) => digits[0] !== undefined && Number(digits[0]) > 2,
        getIsSame: (a, b) => a === b,
    });

    const [text, type] = field.textState;

    return (
        <>
            <input
                data-testid="field"
                value={text}
                onChange={(e) => {
                    field.onInput();
                    type(TextSyncUtils.formatWithMask(PATTERN, e.currentTarget.value));
                }}
                onBlur={field.onBlur}
            />
            <button type="button" data-testid="set" onClick={() => setValue("09:15")}>
                Set
            </button>
            <output data-readout="value">{value ?? "none"}</output>
            <output data-readout="issue">{String(field.hasIssue)}</output>
        </>
    );
};
