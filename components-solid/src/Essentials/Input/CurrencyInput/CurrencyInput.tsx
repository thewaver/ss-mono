import { createMemo, splitProps } from "solid-js";

import { CURRENCY_INPUT_DEFAULTS, CurrencyInputUtils, FormValueUtils, TextSyncUtils } from "@thewaver/ss-components";

import { MaskedFieldSolidUtils } from "../../../Abstracts/MaskedField/MaskedFieldSolid.utils";
import { FormValue } from "../../../Primitives/FormValue/FormValue";
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
        getValue: () => props.value[0](),
        setValue: (next) => props.value[1](next),
        ...CurrencyInputUtils.createFieldRules({
            getGroupDefs,
            getDecimals,
            getHasSign,
            getMin: () => access(props.min),
            getMax: () => access(props.max),
        }),
    });

    const [, fieldProps] = splitProps(props, ["name"]);

    return (
        <>
            <TextField
                {...fieldProps}
                value={field.text}
                element={"input"}
                inputMode={"decimal"}
                computeMaskedText={(previous, next, caret, isForwardDeletion) =>
                    TextSyncUtils.applyGroupedMask(getGroupDefs(), previous, next, caret, isForwardDeletion)
                }
                placeholderHint={() => CurrencyInputUtils.computeHint(getGroupDefs())}
                hasError={() => (access(props.hasError) ?? false) || field.getHasIssue()}
                onInput={field.onInput}
                onBlur={field.onBlur}
            />

            <FormValue
                name={props.name}
                values={() => [FormValueUtils.computeText(props.value[0]()) ?? FormValueUtils.EMPTY_TEXT]}
            />
        </>
    );
};
