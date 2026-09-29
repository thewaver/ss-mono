import { useEffect, useMemo } from "react";

import { CURRENCY_INPUT_DEFAULTS, CurrencyInputUtils, TextSyncUtils } from "@thewaver/ss-components";

import { MaskedFieldReactUtils } from "../../../Abstracts/MaskedField/MaskedFieldReact.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { CurrencyInputProps } from "./CurrencyInput.types";

const EMPTY_TEXT = "";

export const CurrencyInput = (props: CurrencyInputProps) => {
    const [value, setValue] = props.value;

    const decimals = props.decimals ?? CURRENCY_INPUT_DEFAULTS.decimals;
    const hasSign = props.hasSign ?? false;
    const groupSizesKey = props.groupSizes?.join(",");

    const groupDefs = useMemo(
        () =>
            CurrencyInputUtils.computeGroupDefs({
                locale: props.locale,
                groupSizes: props.groupSizes,
                decimals,
                hasSign,
            }),
        [props.locale, groupSizesKey, decimals, hasSign],
    );

    const field = MaskedFieldReactUtils.useMaskedField<number>({
        ...CurrencyInputUtils.createFieldRules({
            getGroupDefs: () => groupDefs,
            getDecimals: () => decimals,
            getHasSign: () => hasSign,
            getMin: () => props.min,
            getMax: () => props.max,
        }),
        value,
        digitCount: undefined,
        setValue,
    });

    const [text, typeText] = field.text;
    const spelling = value === undefined ? EMPTY_TEXT : field.formatValue(value);

    useEffect(() => {
        if (spelling === text) return;

        typeText(spelling);
    }, [groupDefs]);

    return (
        <TextField
            {...props}
            value={field.text}
            element={"input"}
            inputMode={"decimal"}
            computeMaskedText={(previous, next, caret) =>
                TextSyncUtils.applyGroupedMask(groupDefs, previous, next, caret)
            }
            placeholderHint={CurrencyInputUtils.computeHint(groupDefs)}
            hasError={(props.hasError ?? false) || field.hasIssue}
            onInput={field.onInput}
            onBlur={field.onBlur}
        />
    );
};
