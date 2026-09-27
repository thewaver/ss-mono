import { createEffect, createMemo, createSignal, untrack } from "solid-js";

import {
    DATE_INPUT_DEFAULTS,
    type DateInputEra,
    DateInputUtils,
    type DateValue,
    DateValueUtils,
    TextSyncUtils,
} from "@thewaver/ss-components";

import { MaskedFieldSolidUtils } from "../../../Abstracts/MaskedField/MaskedFieldSolid.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { DateInputProps } from "./DateInputSolid.types";

export const DateInput = (props: DateInputProps) => {
    const valueSignal = accessSignal(() => props.valueSignal);

    const getFormat = createMemo(() => access(props.format) ?? DATE_INPUT_DEFAULTS.format);

    const getCalendar = createMemo(() => access(props.calendar) ?? DATE_INPUT_DEFAULTS.calendar);

    const getMask = createMemo(() => DateInputUtils.computeMask(getFormat()));

    const getFieldValue = () => {
        const value = valueSignal[0]();

        return value ? DateValueUtils.withCalendar(value, getCalendar()) : undefined;
    };

    const getAnchor = createMemo(
        () => getFieldValue() ?? DateValueUtils.fromDate(new Date(), getCalendar()),
        undefined,
        { equals: DateInputUtils.getIsSameAnchor },
    );

    const getBounds = createMemo(() => DateInputUtils.computeBounds(getAnchor()));

    const getEraOptions = createMemo(() => DateValueUtils.getEras(getAnchor(), access(props.locale)));

    const [getEra, setEra] = createSignal<string>(
        untrack(() => DateInputUtils.getInitialEra(getFieldValue(), untrack(getEraOptions))),
    );

    const fromDigits = (digits: string) =>
        DateInputUtils.parseDigits(digits, {
            format: untrack(getFormat),
            calendar: untrack(getCalendar),
            era: untrack(getFieldValue)?.era ?? untrack(getEra),
            minValue: access(props.minValue),
            maxValue: access(props.maxValue),
        });

    const field = MaskedFieldSolidUtils.createField<DateValue>({
        getValue: getFieldValue,
        setValue: (next) => valueSignal[1](() => next),
        formatDigits: (digits) => TextSyncUtils.formatWithMask(getMask(), digits),
        getDigitCount: () => DateInputUtils.DIGIT_COUNT,
        toDigits: (value) => DateInputUtils.toDigits(value, getFormat()),
        fromDigits,
        getHasImpossibleDigits: (digits) => DateInputUtils.getHasImpossiblePart(digits, getFormat(), getBounds()),
        getIsSame: DateValueUtils.isSame,
    });

    createEffect(() => {
        const value = getFieldValue();

        if (value) setEra(value.era);
    });

    const era: DateInputEra = {
        getValue: getEra,
        getOptions: getEraOptions,
        set: (next) => {
            setEra(next);

            const value = untrack(getFieldValue);

            if (!value) return;

            field.commit(DateInputUtils.withEra(value, next, access(props.minValue), access(props.maxValue)));
        },
    };

    return (
        <TextField
            {...props}
            valueSignal={field.textSignal}
            element={"input"}
            inputMode={"numeric"}
            computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(getMask(), previous, next, caret)}
            placeholderHint={() => DateInputUtils.computeHint(getFormat(), access(props.partHints))}
            hasError={() => (access(props.hasError) ?? false) || field.getHasIssue()}
            renderLeading={props.renderLeading && ((getFlags) => props.renderLeading!(getFlags, era))}
            onInput={field.onInput}
            onBlur={field.onBlur}
        />
    );
};
