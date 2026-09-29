import { createEffect, createMemo, createSignal, untrack } from "solid-js";

import { TextSyncUtils, type TimeInputMeridiem, TimeInputUtils } from "@thewaver/ss-components";
import { TimeUtils } from "@thewaver/ss-utils";
import type { TimeValue, TimeValueMeridiem } from "@thewaver/ss-utils";

import { MaskedFieldSolidUtils } from "../../../Abstracts/MaskedField/MaskedFieldSolid.utils";
import { TextField } from "../../../Primitives/TextField/TextField";
import { access, accessSignal } from "../../../Utils/propUtils";
import type { TimeInputProps } from "./TimeInputSolid.types";

export const TimeInput = (props: TimeInputProps) => {
    const valueSignal = accessSignal(() => props.value);

    const getIsTwelveHour = () => access(props.isTwelveHour) ?? false;

    const [getMeridiem, setMeridiem] = createSignal<TimeValueMeridiem>(
        untrack(() => TimeInputUtils.getInitialMeridiem(valueSignal[0]())),
    );

    const getSegmentCount = () => TimeInputUtils.getSegmentCount(access(props.hasSeconds) ?? false);

    const getMask = createMemo(() => TimeInputUtils.computeMask(getSegmentCount()));

    const fromDigits = (digits: string) =>
        TimeInputUtils.parseDigits(digits, {
            segmentCount: getSegmentCount(),
            isTwelveHour: getIsTwelveHour(),
            meridiem: untrack(getMeridiem),
            minValue: access(props.minValue),
            maxValue: access(props.maxValue),
        });

    const field = MaskedFieldSolidUtils.createField<TimeValue>({
        getValue: () => valueSignal[0](),
        setValue: (next) => valueSignal[1](() => next),
        formatDigits: (digits) => TextSyncUtils.formatWithMask(getMask(), digits),
        getDigitCount: () => getSegmentCount() * TimeInputUtils.SEGMENT_DIGITS,
        toDigits: (value) => TimeInputUtils.toDigits(value, getIsTwelveHour()),
        fromDigits,
        getHasImpossibleDigits: (digits) =>
            TimeInputUtils.getHasImpossibleSegment(digits, getSegmentCount(), getIsTwelveHour()),
        getIsSame: TimeUtils.isSame,
    });

    createEffect(() => {
        const value = valueSignal[0]();

        if (value) setMeridiem(TimeUtils.getMeridiem(value));
    });

    const getIsWritable = () => !(access(props.isDisabled) ?? false) && !(access(props.isReadOnly) ?? false);

    const meridiem: TimeInputMeridiem = {
        getValue: getMeridiem,
        set: (next) => {
            if (!getIsWritable()) return;

            setMeridiem(next);

            const value = untrack(() => valueSignal[0]());

            if (!value) return;

            field.commit(TimeInputUtils.withMeridiem(value, next, access(props.minValue), access(props.maxValue)));
        },
        toggle: () => {
            meridiem.set(TimeInputUtils.toggleMeridiem(getMeridiem()));
        },
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!getIsWritable()) return;

        const element = e.currentTarget as HTMLInputElement | null;

        if (!element) return;

        const step = TimeInputUtils.computeStep(
            e.key,
            valueSignal[0](),
            element.selectionStart ?? 0,
            access(props.minValue),
            access(props.maxValue),
        );

        if (!step) return;

        e.preventDefault();

        valueSignal[1](() => step.time);
        field.text[1](field.formatValue(step.time));
        element.setSelectionRange(step.selectionStart, step.selectionEnd);
    };

    return (
        <TextField
            {...props}
            value={field.text}
            element={"input"}
            inputMode={"numeric"}
            computeMaskedText={(previous, next, caret) => TextSyncUtils.applyMask(getMask(), previous, next, caret)}
            placeholderHint={() => TimeInputUtils.computeHint(getSegmentCount(), access(props.segmentHints))}
            hasError={() => (access(props.hasError) ?? false) || field.getHasIssue()}
            renderTrailing={props.renderTrailing && ((getFlags) => props.renderTrailing!(getFlags, meridiem))}
            onInput={field.onInput}
            onKeyDown={handleKeyDown}
            onBlur={field.onBlur}
        />
    );
};
