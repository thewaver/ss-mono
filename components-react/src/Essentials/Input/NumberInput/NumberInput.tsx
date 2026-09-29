import { useEffect, useMemo, useRef, useState } from "react";

import {
    NUMBER_INPUT_DEFAULTS,
    type NumberInputStepDefs,
    type NumberInputStepper,
    NumberInputUtils,
} from "@thewaver/ss-components";
import { DecimalUtils } from "@thewaver/ss-utils";

import { TextField } from "../../../Primitives/TextField/TextField";
import { useLatest } from "../../../Utils/refUtils";
import type { NumberInputProps } from "./NumberInput.types";

export const NumberInput = (props: NumberInputProps) => {
    const [value, setValue] = props.value;

    const separators = useMemo(() => DecimalUtils.getSeparators(props.locale), [props.locale]);

    const [text, setText] = useState(() => NumberInputUtils.formatValue(value, separators));
    const textRef = useRef(text);

    const stepDefs: NumberInputStepDefs = {
        min: props.min,
        max: props.max,
        step: props.step ?? NUMBER_INPUT_DEFAULTS.step,
    };

    const pageStep = NumberInputUtils.computePageStep(props.pageStep, stepDefs.step);
    const isWritable = !(props.isDisabled ?? false) && !(props.isReadOnly ?? false);
    const typedValue = NumberInputUtils.parseValue(text, separators);

    const latest = useLatest({
        value,
        setValue,
        separators,
        stepDefs,
        pageStep,
        isWritable,
        onInput: props.onInput,
        repeatDelayMs: props.repeatDelayMs,
        repeatIntervalMs: props.repeatIntervalMs,
    });

    const writeText = (next: string) => {
        textRef.current = next;
        setText(next);
    };

    const readTypedValue = () => NumberInputUtils.parseValue(textRef.current, latest.current.separators);

    const reportValue = (next: number | undefined) => {
        latest.current.setValue(next);

        latest.current.onInput?.(next);
    };

    const applyValue = (next: number | undefined) => {
        writeText(NumberInputUtils.formatValue(next, latest.current.separators));

        if (latest.current.value === next) return;

        reportValue(next);
    };

    const stepValue = (direction: 1 | -1, distance?: number) => {
        if (!latest.current.isWritable) return false;

        const current = readTypedValue();
        const next = NumberInputUtils.computeStep(current, direction, latest.current.stepDefs, distance);

        applyValue(next);

        return next !== current;
    };

    const stepValueRef = useLatest(stepValue);

    const [repeater] = useState(() =>
        NumberInputUtils.createStepRepeater({
            getDelayMs: () => latest.current.repeatDelayMs ?? NUMBER_INPUT_DEFAULTS.repeatDelayMs,
            getIntervalMs: () => latest.current.repeatIntervalMs ?? NUMBER_INPUT_DEFAULTS.repeatIntervalMs,
        }),
    );

    useEffect(() => () => void repeater.stop(), [repeater]);

    useEffect(() => {
        if (NumberInputUtils.parseValue(textRef.current, separators) === value) return;

        writeText(NumberInputUtils.formatValue(value, separators));
    }, [value, separators]);

    const stepper: NumberInputStepper = {
        getIsAtMin: () => NumberInputUtils.getIsAtMin(typedValue, stepDefs),
        getIsAtMax: () => NumberInputUtils.getIsAtMax(typedValue, stepDefs),
        stepUp: () => stepValue(1),
        stepDown: () => stepValue(-1),
        startSteppingUp: () => repeater.start(() => stepValueRef.current(1)),
        startSteppingDown: () => repeater.start(() => stepValueRef.current(-1)),
        stopStepping: repeater.stop,
    };

    const renderTrailing = props.renderTrailing;

    return (
        <TextField
            {...props}
            value={[text, writeText]}
            element={"input"}
            type={"text"}
            inputMode={props.inputMode ?? NUMBER_INPUT_DEFAULTS.inputMode}
            isSpinButton={true}
            computeSpinValue={(next) => NumberInputUtils.parseValue(next, separators)}
            hasError={(props.hasError ?? false) || NumberInputUtils.getHasRangeIssue(typedValue, stepDefs)}
            renderTrailing={renderTrailing && ((flags) => renderTrailing(flags, stepper))}
            onInput={(next) => {
                const sanitized = NumberInputUtils.sanitizeText(next, latest.current.separators);

                writeText(sanitized);

                const parsed = NumberInputUtils.parseValue(sanitized, latest.current.separators);

                if (NumberInputUtils.getHasRangeIssue(parsed, latest.current.stepDefs)) return;

                reportValue(parsed);
            }}
            onKeyDown={(e) => {
                if (!latest.current.isWritable) return;

                const move = NumberInputUtils.computeKeyMove(e.key, latest.current.stepDefs, latest.current.pageStep);

                if (!move) return;

                e.preventDefault();

                if ("value" in move) applyValue(move.value);
                else stepValue(move.direction, move.distance);
            }}
            onBlur={() => applyValue(NumberInputUtils.computeSettledValue(readTypedValue(), latest.current.stepDefs))}
        />
    );
};
