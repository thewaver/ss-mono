import { createEffect, createMemo, createSignal, onCleanup, untrack } from "solid-js";

import {
    NUMBER_INPUT_DEFAULTS,
    type NumberInputStepDefs,
    type NumberInputStepper,
    NumberInputUtils,
} from "@thewaver/ss-components";
import { DecimalUtils } from "@thewaver/ss-utils";

import { TextField } from "../../../Primitives/TextField/TextField";
import { access } from "../../../Utils/propUtils";
import type { NumberInputProps } from "./NumberInputSolid.types";

export const NumberInput = (props: NumberInputProps) => {
    const getSeparators = createMemo(() => DecimalUtils.getSeparators(access(props.locale)));

    const textSignal = createSignal(NumberInputUtils.formatValue(props.valueSignal[0](), getSeparators()));

    const getStepDefs = createMemo((): NumberInputStepDefs => ({
        min: access(props.min),
        max: access(props.max),
        step: access(props.step) ?? NUMBER_INPUT_DEFAULTS.step,
    }));

    const getPageStep = () => NumberInputUtils.computePageStep(access(props.pageStep), getStepDefs().step);

    const getIsWritable = () => !(access(props.isDisabled) ?? false) && !(access(props.isReadOnly) ?? false);

    const getTypedValue = () => NumberInputUtils.parseValue(textSignal[0](), getSeparators());

    const getHasRangeIssue = () => NumberInputUtils.getHasRangeIssue(getTypedValue(), getStepDefs());

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

    const repeater = NumberInputUtils.createStepRepeater({
        getDelayMs: () => access(props.repeatDelayMs) ?? NUMBER_INPUT_DEFAULTS.repeatDelayMs,
        getIntervalMs: () => access(props.repeatIntervalMs) ?? NUMBER_INPUT_DEFAULTS.repeatIntervalMs,
    });

    const stopStepping = repeater.stop;

    const startStepping = (direction: 1 | -1) => repeater.start(() => stepValue(direction));

    onCleanup(stopStepping);

    const stepper: NumberInputStepper = {
        getIsAtMin: () => NumberInputUtils.getIsAtMin(getTypedValue(), getStepDefs()),
        getIsAtMax: () => NumberInputUtils.getIsAtMax(getTypedValue(), getStepDefs()),
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

                if (NumberInputUtils.getHasRangeIssue(value, getStepDefs())) return;

                reportValue(value);
            }}
            onKeyDown={(e) => {
                if (!getIsWritable()) return;

                const move = NumberInputUtils.computeKeyMove(e.key, getStepDefs(), getPageStep());

                if (!move) return;

                e.preventDefault();

                if ("value" in move) applyValue(move.value);
                else stepValue(move.direction, move.distance);
            }}
            onBlur={() => applyValue(NumberInputUtils.computeSettledValue(getTypedValue(), getStepDefs()))}
        />
    );
};
