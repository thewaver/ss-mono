import { createMemo } from "solid-js";

import { CURRENCY_INPUT_DEFAULTS, CurrencyInputUtils, TextSyncUtils } from "@thewaver/ss-components";

import { MaskedFieldSolidUtils } from "../../../Abstracts/MaskedField/MaskedFieldSolid.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import type { CurrencyInputProps } from "./CurrencyInputSolid.types";

export const CurrencyInput = (props: CurrencyInputProps) => {
    const getDecimals = createMemo(() => access(props.decimals) ?? CURRENCY_INPUT_DEFAULTS.decimals);

    const getHasSign = () => access(props.hasSign) ?? false;

    const getGroupDefs = createMemo(() =>
        CurrencyInputUtils.computeGroupDefs({
            locale: access(props.locale),
            groupSizes: access(props.groupSizes),
            decimals: getDecimals(),
            hasSign: getHasSign(),
        }),
    );

    const field = MaskedFieldSolidUtils.createField<number>({
        getValue: () => props.valueSignal[0](),
        setValue: (next) => props.valueSignal[1](next),
        ...CurrencyInputUtils.createFieldRules({
            getGroupDefs,
            getDecimals,
            getHasSign,
            getMin: () => access(props.min),
            getMax: () => access(props.max),
        }),
    });

    return (
        <TextField
            {...props}
            valueSignal={field.textSignal}
            element={"input"}
            inputMode={"decimal"}
            computeMaskedText={(previous, next, caret) =>
                TextSyncUtils.applyGroupedMask(getGroupDefs(), previous, next, caret)
            }
            placeholderHint={() => CurrencyInputUtils.computeHint(getGroupDefs())}
            hasError={() => (access(props.hasError) ?? false) || field.getHasIssue()}
            onInput={field.onInput}
            onBlur={field.onBlur}
        />
    );
};
