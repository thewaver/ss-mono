import { useEffect, useLayoutEffect, useMemo, useState } from "react";

import {
    DATE_INPUT_DEFAULTS,
    DateInputUtils,
    type DateValue,
    DateValueUtils,
    TextSyncUtils,
} from "@thewaver/ss-components";

import { MaskedFieldReactUtils } from "../../../Abstracts/MaskedField/MaskedFieldReact.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { DateInputEra, DateInputProps } from "./DateInput.types";

export const DateInput = (props: DateInputProps) => {
    const [value, setValue] = props.value;

    const format = props.format ?? DATE_INPUT_DEFAULTS.format;
    const calendar = props.calendar ?? DATE_INPUT_DEFAULTS.calendar;
    const mask = DateInputUtils.computeMask(format);

    const fieldValue = useMemo(
        () => (value ? DateValueUtils.withCalendar(value, calendar) : undefined),
        [value, calendar],
    );

    const nextAnchor = fieldValue ?? DateValueUtils.fromDate(new Date(), calendar);
    const [anchor, setAnchor] = useState(nextAnchor);

    if (!DateInputUtils.getIsSameAnchor(anchor, nextAnchor)) setAnchor(nextAnchor);

    const bounds = useMemo(() => DateInputUtils.computeBounds(anchor), [anchor]);
    const eraOptions = useMemo(() => DateValueUtils.getEras(anchor, props.locale), [anchor, props.locale]);

    const [era, setEra] = useState(() => DateInputUtils.getInitialEra(fieldValue, eraOptions));

    const field = MaskedFieldReactUtils.useMaskedField<DateValue>({
        value: fieldValue,
        digitCount: DateInputUtils.DIGIT_COUNT,
        setValue,
        formatDigits: (digits) => TextSyncUtils.formatWithMask(mask, digits),
        toDigits: (next) => DateInputUtils.toDigits(next, format),
        fromDigits: (digits) =>
            DateInputUtils.parseDigits(digits, {
                format,
                calendar,
                era: fieldValue?.era ?? era,
                minValue: props.minValue,
                maxValue: props.maxValue,
            }),
        getHasImpossibleDigits: (digits) => DateInputUtils.getHasImpossiblePart(digits, format, bounds),
        getIsSame: DateValueUtils.isSame,
    });

    useEffect(() => {
        if (fieldValue) setEra(fieldValue.era);
    }, [fieldValue]);

    useLayoutEffect(() => {
        field.refresh();
    }, [format, calendar]);

    const eraControl: DateInputEra = {
        value: era,
        options: eraOptions,
        set: (next) => {
            setEra(next);

            if (!fieldValue) return;

            field.commit(DateInputUtils.withEra(fieldValue, next, props.minValue, props.maxValue));
        },
    };

    const renderLeading = props.renderLeading;

    return (
        <TextField
            {...props}
            value={field.text}
            element={"input"}
            inputMode={"numeric"}
            computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(mask, previous, next, caret)}
            placeholderHint={DateInputUtils.computeHint(format, props.partHints)}
            hasError={(props.hasError ?? false) || field.hasIssue}
            renderLeading={renderLeading && ((flags) => renderLeading(flags, eraControl))}
            onInput={field.onInput}
            onBlur={field.onBlur}
        />
    );
};
