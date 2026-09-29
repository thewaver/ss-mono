import { type KeyboardEvent, useEffect, useLayoutEffect, useState } from "react";

import { type TextSyncElement, TextSyncUtils, TimeInputUtils } from "@thewaver/ss-components";
import { TimeUtils, type TimeValue, type TimeValueMeridiem } from "@thewaver/ss-utils";

import { MaskedFieldReactUtils } from "../../../Abstracts/MaskedField/MaskedFieldReact.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import type { TimeInputMeridiem, TimeInputProps } from "./TimeInput.types";

export const TimeInput = (props: TimeInputProps) => {
    const [value, setValue] = props.value;

    const isTwelveHour = props.isTwelveHour ?? false;
    const segmentCount = TimeInputUtils.getSegmentCount(props.hasSeconds ?? false);
    const mask = TimeInputUtils.computeMask(segmentCount);
    const isWritable = !(props.isDisabled ?? false) && !(props.isReadOnly ?? false);

    const [meridiem, setMeridiem] = useState<TimeValueMeridiem>(() => TimeInputUtils.getInitialMeridiem(value));

    const field = MaskedFieldReactUtils.useMaskedField<TimeValue>({
        value,
        digitCount: segmentCount * TimeInputUtils.SEGMENT_DIGITS,
        setValue,
        formatDigits: (digits) => TextSyncUtils.formatWithMask(mask, digits),
        toDigits: (next) => TimeInputUtils.toDigits(next, isTwelveHour),
        fromDigits: (digits) =>
            TimeInputUtils.parseDigits(digits, {
                segmentCount,
                isTwelveHour,
                meridiem,
                minValue: props.minValue,
                maxValue: props.maxValue,
            }),
        getHasImpossibleDigits: (digits) => TimeInputUtils.getHasImpossibleSegment(digits, segmentCount, isTwelveHour),
        getIsSame: TimeUtils.isSame,
    });

    useEffect(() => {
        if (value) setMeridiem(TimeUtils.getMeridiem(value));
    }, [value]);

    useLayoutEffect(() => {
        field.refresh();
    }, [isTwelveHour, segmentCount]);

    const setFieldMeridiem = (next: TimeValueMeridiem) => {
        if (!isWritable) return;

        setMeridiem(next);

        if (!value) return;

        field.commit(TimeInputUtils.withMeridiem(value, next, props.minValue, props.maxValue));
    };

    const meridiemControl: TimeInputMeridiem = {
        value: meridiem,
        set: setFieldMeridiem,
        toggle: () => setFieldMeridiem(TimeInputUtils.toggleMeridiem(meridiem)),
    };

    const handleKeyDown = (e: KeyboardEvent<TextSyncElement>) => {
        if (!isWritable) return;

        const element = e.currentTarget;
        const step = TimeInputUtils.computeStep(
            e.key,
            value,
            element.selectionStart ?? 0,
            props.minValue,
            props.maxValue,
        );

        if (!step) return;

        e.preventDefault();

        setValue(step.time);
        element.setSelectionRange(step.selectionStart, step.selectionEnd);
    };

    const renderTrailing = props.renderTrailing;

    return (
        <TextField
            {...props}
            value={field.text}
            element={"input"}
            inputMode={"numeric"}
            computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(mask, previous, next, caret)}
            placeholderHint={TimeInputUtils.computeHint(segmentCount, props.segmentHints)}
            hasError={(props.hasError ?? false) || field.hasIssue}
            renderTrailing={renderTrailing && ((flags) => renderTrailing(flags, meridiemControl))}
            onInput={field.onInput}
            onKeyDown={handleKeyDown}
            onBlur={field.onBlur}
        />
    );
};
