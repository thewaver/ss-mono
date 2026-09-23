import { createEffect, createMemo, createSignal, onCleanup, untrack } from "solid-js";

import { DecimalUtils } from "@thewaver/ss-utils";

import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import { NUMBER_INPUT_DEFAULTS } from "./NumberInput.const";
import type { NumberInputProps, NumberInputStepDefs, NumberInputStepper } from "./NumberInput.types";
import { NumberInputUtils } from "./NumberInput.utils";

const PAGE_STEP_MULTIPLE = 10;

export const NumberInput = (props: NumberInputProps) => {
    const getSeparators = createMemo(() => DecimalUtils.getSeparators(access(props.locale)));

    const textSignal = createSignal(NumberInputUtils.formatValue(props.valueSignal[0](), getSeparators()));

    const getStepDefs = createMemo((): NumberInputStepDefs => ({
        min: access(props.min),
        max: access(props.max),
        step: access(props.step) ?? NUMBER_INPUT_DEFAULTS.step,
    }));

    const getPageStep = () => access(props.pageStep) ?? getStepDefs().step * PAGE_STEP_MULTIPLE;

    const getIsWritable = () => !(access(props.isDisabled) ?? false) && !(access(props.isReadOnly) ?? false);

    const getTypedValue = () => NumberInputUtils.parseValue(textSignal[0](), getSeparators());

    const getHasRangeIssue = () => {
        const value = getTypedValue();

        return value !== undefined && !NumberInputUtils.getIsInRange(value, getStepDefs());
    };

    const reportValue = (value: number | undefined) => {
        props.valueSignal[1](value);

        void props.onInput?.(value);
    };

    const applyValue = (value: number | undefined) => {
        textSignal[1](NumberInputUtils.formatValue(value, getSeparators()));

        if (untrack(() => props.valueSignal[0]()) === value) return;

        reportValue(value);
    };

    const stepValue = (direction: 1 | -1, distance?: number) => {
        if (!getIsWritable()) return false;

        const current = getTypedValue();
        const next = NumberInputUtils.computeStep(current, direction, getStepDefs(), distance);

        applyValue(next);

        return next !== current;
    };

    let repeatDelay: ReturnType<typeof setTimeout> | undefined;
    let repeatInterval: ReturnType<typeof setInterval> | undefined;

    const stopStepping = () => {
        const wasStepping = repeatDelay !== undefined || repeatInterval !== undefined;

        clearTimeout(repeatDelay);
        clearInterval(repeatInterval);

        repeatDelay = undefined;
        repeatInterval = undefined;

        return wasStepping;
    };

    const startStepping = (direction: 1 | -1) => {
        stopStepping();

        if (!stepValue(direction)) return false;

        repeatDelay = setTimeout(
            () => {
                repeatInterval = setInterval(
                    () => stepValue(direction),
                    access(props.repeatIntervalMs) ?? NUMBER_INPUT_DEFAULTS.repeatIntervalMs,
                );
            },
            access(props.repeatDelayMs) ?? NUMBER_INPUT_DEFAULTS.repeatDelayMs,
        );

        return true;
    };

    onCleanup(stopStepping);

    const stepper: NumberInputStepper = {
        getIsAtMin: () => {
            const value = getTypedValue();
            const min = getStepDefs().min;

            return min !== undefined && value !== undefined && value <= min;
        },
        getIsAtMax: () => {
            const value = getTypedValue();
            const max = getStepDefs().max;

            return max !== undefined && value !== undefined && value >= max;
        },
        stepUp: () => stepValue(1),
        stepDown: () => stepValue(-1),
        startSteppingUp: () => startStepping(1),
        startSteppingDown: () => startStepping(-1),
        stopStepping,
    };

    createEffect(() => {
        const value = props.valueSignal[0]();

        const separators = getSeparators();

        if (NumberInputUtils.parseValue(untrack(textSignal[0]), separators) === value) return;

        textSignal[1](NumberInputUtils.formatValue(value, separators));
    });

    return (
        <TextField
            {...props}
            valueSignal={textSignal}
            element={"input"}
            type={"text"}
            inputMode={() => access(props.inputMode) ?? NUMBER_INPUT_DEFAULTS.inputMode}
            isSpinButton={true}
            computeSpinValue={(text) => NumberInputUtils.parseValue(text, getSeparators())}
            hasError={() => (access(props.hasError) ?? false) || getHasRangeIssue()}
            renderTrailing={props.renderTrailing && ((getFlags) => props.renderTrailing!(getFlags, stepper))}
            onInput={(text) => {
                const sanitized = NumberInputUtils.sanitizeText(text, getSeparators());

                textSignal[1](sanitized);

                const value = NumberInputUtils.parseValue(sanitized, getSeparators());

                if (value !== undefined && !NumberInputUtils.getIsInRange(value, getStepDefs())) return;

                reportValue(value);
            }}
            onKeyDown={(e) => {
                if (!getIsWritable()) return;

                const { min, max } = getStepDefs();

                if (e.key === "ArrowUp") {
                    e.preventDefault();
                    stepValue(1);
                } else if (e.key === "ArrowDown") {
                    e.preventDefault();
                    stepValue(-1);
                } else if (e.key === "PageUp") {
                    e.preventDefault();
                    stepValue(1, getPageStep());
                } else if (e.key === "PageDown") {
                    e.preventDefault();
                    stepValue(-1, getPageStep());
                } else if (e.key === "Home" && min !== undefined) {
                    e.preventDefault();
                    applyValue(min);
                } else if (e.key === "End" && max !== undefined) {
                    e.preventDefault();
                    applyValue(max);
                }
            }}
            onBlur={() => {
                const value = getTypedValue();

                applyValue(value === undefined ? undefined : NumberInputUtils.clampValue(value, getStepDefs()));
            }}
        />
    );
};
